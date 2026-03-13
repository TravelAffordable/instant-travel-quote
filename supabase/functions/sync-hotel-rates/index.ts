import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  getHotelsForDestination,
  getUniqueRealNames,
  SYNC_DESTINATIONS,
} from '../_shared/budget-affordable-hotels.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Extract ZAR prices from text. Returns lowest valid price (R200–R50,000).
 */
function extractZARPrice(text: string): number | null {
  const patterns = [
    /R\s?([\d,]+(?:\.\d{2})?)\s*(?:per|\/)\s*night/gi,
    /(?:from\s+)?R\s?([\d,]+(?:\.\d{2})?)/gi,
    /ZAR\s?([\d,]+(?:\.\d{2})?)/gi,
    /(?:price|rate|from|total)[:\s]+R\s?([\d,]+)/gi,
  ];

  const prices: number[] = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const price = parseFloat(match[1].replace(/,/g, ''));
      if (price >= 200 && price <= 50000) {
        prices.push(price);
      }
    }
  }

  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Search for a hotel's nightly rate using Firecrawl search with scrapeOptions
 * to get full page content (including JS-rendered prices) from search results.
 */
async function searchHotelRate(
  realName: string,
  city: string,
  apiKey: string,
): Promise<number | null> {
  const query = `${realName} ${city} South Africa booking.com price per night`;

  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit: 3,
        lang: 'en',
        country: 'za',
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limited for "${realName}", skipping`);
      } else {
        console.warn(`Firecrawl search failed for "${realName}": ${response.status}`);
      }
      return null;
    }

    const data = await response.json();
    const results = data?.data ?? data?.results ?? [];

    for (const result of results) {
      const text = `${result.title || ''} ${result.description || ''} ${result.markdown || ''}`;
      const price = extractZARPrice(text);
      if (price !== null) {
        return price;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error searching rate for "${realName}":`, error);
    return null;
  }
}

/**
 * Process hotels sequentially with a delay between each to avoid rate limits.
 */
async function processSequentially(
  items: { realName: string; city: string }[],
  apiKey: string,
): Promise<Map<string, number>> {
  const rateMap = new Map<string, number>();

  for (let i = 0; i < items.length; i++) {
    const h = items[i];
    const rate = await searchHotelRate(h.realName, h.city, apiKey);

    if (rate !== null) {
      rateMap.set(h.realName, rate);
      console.log(`  ✓ ${h.realName}: R${rate}`);
    } else {
      console.log(`  ✗ ${h.realName}: no rate found`);
    }

    // Small delay to avoid rate limits (skip after last item)
    if (i < items.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return rateMap;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const destination = body?.destination as string | undefined;

    // IMPORTANT: When syncing all destinations, only process one at a time
    // The cron job should call this function per-destination to avoid timeouts
    const destinations = destination ? [destination] : SYNC_DESTINATIONS;

    // Validate destinations
    for (const dest of destinations) {
      if (!SYNC_DESTINATIONS.includes(dest)) {
        return jsonResponse({ error: `Invalid destination: ${dest}. Valid: ${SYNC_DESTINATIONS.join(', ')}` }, 400);
      }
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'FIRECRAWL_API_KEY not configured' }, 500);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const summary: Record<string, { unique: number; matched: number; entries: number }> = {};

    for (const dest of destinations) {
      const hotels = getHotelsForDestination(dest);
      const uniqueHotels = getUniqueRealNames(dest);

      console.log(`Processing ${dest}: ${uniqueHotels.length} unique hotels, ${hotels.length} entries`);

      // Process hotels sequentially to manage rate limits and timeouts
      const rateMap = await processSequentially(uniqueHotels, apiKey);

      // Build upsert data
      const upserts = hotels.map(h => ({
        hotel_alias: h.alias,
        real_hotel_name: h.realName,
        destination: h.dest,
        tier: h.tier,
        capacity: h.cap,
        crawled_rate: rateMap.get(h.realName) ?? h.refRate,
        room_type: h.roomType ?? 'Standard Room',
        includes_breakfast: h.breakfast,
        crawled_at: new Date().toISOString(),
        is_available: true,
        updated_at: new Date().toISOString(),
      }));

      // Upsert in batches of 50
      for (let i = 0; i < upserts.length; i += 50) {
        const batch = upserts.slice(i, i + 50);
        const { error } = await supabase
          .from('cached_hotel_rates')
          .upsert(batch, { onConflict: 'hotel_alias,destination,capacity' });

        if (error) {
          console.error(`Upsert error for ${dest}:`, error.message);
        }
      }

      summary[dest] = {
        unique: uniqueHotels.length,
        matched: rateMap.size,
        entries: upserts.length,
      };
    }

    console.log('Sync complete:', JSON.stringify(summary));

    return jsonResponse({
      success: true,
      synced_at: new Date().toISOString(),
      summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('sync-hotel-rates error:', message);
    return jsonResponse({ error: message }, 500);
  }
});

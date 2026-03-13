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
 * Extract ZAR prices from text using multiple patterns.
 * Returns the lowest valid price found (R200–R50,000 range).
 */
function extractZARPrice(text: string): number | null {
  const patterns = [
    /R\s?([\d,]+(?:\.\d{2})?)\s*(?:per|\/)\s*night/gi,
    /(?:from\s+)?R\s?([\d,]+(?:\.\d{2})?)/gi,
    /ZAR\s?([\d,]+(?:\.\d{2})?)/gi,
    /(?:price|rate|from|total)[:\s]+R\s?([\d,]+)/gi,
    /(?:price|rate)\s*[:\s]*(?:ZAR|R)\s*([\d,]+)/gi,
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
 * Build a Booking.com search URL for a hotel in ZAR currency.
 */
function buildBookingSearchUrl(hotelName: string, city: string): string {
  const ss = encodeURIComponent(`${hotelName} ${city}`);
  return `https://www.booking.com/searchresults.en-gb.html?ss=${ss}&selected_currency=ZAR&lang=en-gb`;
}

/**
 * Delay helper to avoid rate limits.
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Strategy 1: Directly scrape Booking.com search results page for ZAR pricing.
 * Strategy 2: Fall back to Firecrawl web search if scrape fails.
 */
async function searchHotelRate(
  realName: string,
  city: string,
  apiKey: string,
): Promise<number | null> {
  // Strategy 1: Direct Booking.com search page scrape
  try {
    const searchUrl = buildBookingSearchUrl(realName, city);
    
    const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: searchUrl,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 5000,
        location: { country: 'ZA', languages: ['en'] },
      }),
    });

    if (scrapeResponse.ok) {
      const scrapeData = await scrapeResponse.json();
      const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || '';
      
      // Check if the hotel name appears in results (relevance check)
      const nameParts = realName.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const mdLower = markdown.toLowerCase();
      const nameMatch = nameParts.some(part => mdLower.includes(part));
      
      if (nameMatch) {
        const price = extractZARPrice(markdown);
        if (price !== null) {
          return price;
        }
      }
    } else if (scrapeResponse.status === 429) {
      console.warn(`Rate limited scraping for "${realName}", waiting...`);
      await delay(2000);
    }
  } catch (err) {
    console.warn(`Scrape error for "${realName}":`, err);
  }

  // Strategy 2: Firecrawl web search as fallback
  try {
    const query = `${realName} ${city} South Africa booking.com price per night ZAR`;
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit: 5 }),
    });

    if (response.ok) {
      const data = await response.json();
      const results = data?.data ?? data?.results ?? [];

      for (const result of results) {
        const text = `${result.title || ''} ${result.description || ''} ${result.markdown || ''}`;
        const price = extractZARPrice(text);
        if (price !== null) {
          return price;
        }
      }
    }
  } catch (error) {
    console.error(`Search fallback error for "${realName}":`, error);
  }

  return null;
}

/**
 * Process hotels in batches with concurrency control.
 */
async function processBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 2,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
    // Small delay between batches to avoid rate limits
    if (i + concurrency < items.length) {
      await delay(500);
    }
  }

  return results;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const destination = body?.destination as string | undefined;

    // If no destination specified, sync all destinations
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

      // Search for rates for unique hotels
      const rateMap = new Map<string, number>();

      const results = await processBatch(
        uniqueHotels,
        async (h) => {
          const rate = await searchHotelRate(h.realName, h.city, apiKey);
          return { realName: h.realName, rate };
        },
        3, // 3 concurrent searches to avoid rate limits
      );

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.rate !== null) {
          rateMap.set(result.value.realName, result.value.rate);
          console.log(`  ✓ ${result.value.realName}: R${result.value.rate}`);
        } else if (result.status === 'fulfilled') {
          console.log(`  ✗ ${result.value.realName}: no rate found`);
        }
      }

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

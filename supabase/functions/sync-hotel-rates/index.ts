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
 * Search Firecrawl for a hotel's current rate on Booking.com.
 * Returns the extracted nightly rate or null if not found.
 */
/**
 * Extract ZAR prices from text using multiple patterns.
 * Returns the first valid price found (R200–R50,000 range).
 */
function extractZARPrice(text: string): number | null {
  const patterns = [
    /(?:from\s+)?R\s?([\d,]+(?:\.\d{2})?)/gi,
    /ZAR\s?([\d,]+(?:\.\d{2})?)/gi,
    /(?:price|rate|from|total|per\s*night)[:\s]+R\s?([\d,]+)/gi,
    /R\s?([\d]{3,5})\s*(?:per|\/)\s*night/gi,
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

  // Return the lowest valid price (most likely the base nightly rate)
  return prices.length > 0 ? Math.min(...prices) : null;
}

/**
 * Phase 1: Search Firecrawl for hotel info and try to extract rate from search results.
 * Phase 2: If a Booking.com URL is found, scrape it directly for more reliable pricing.
 */
async function searchHotelRate(
  realName: string,
  city: string,
  apiKey: string,
): Promise<number | null> {
  // Try multiple search queries for better coverage
  const queries = [
    `${realName} ${city} site:booking.com price per night`,
    `"${realName}" ${city} South Africa booking.com`,
  ];

  let bookingUrl: string | null = null;
  let searchPrice: number | null = null;

  for (const query of queries) {
    if (searchPrice !== null) break;

    try {
      const response = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 5 }),
      });

      if (!response.ok) {
        console.warn(`Firecrawl search failed for "${realName}" (${response.status})`);
        continue;
      }

      const data = await response.json();
      const results = data?.data ?? data?.results ?? [];

      for (const result of results) {
        const url = result.url || result.sourceURL || '';
        const text = `${result.title || ''} ${result.description || ''} ${result.markdown || ''}`;

        // Capture Booking.com URL for phase 2
        if (!bookingUrl && url.includes('booking.com/hotel')) {
          bookingUrl = url;
        }

        // Try to extract price from search result
        const price = extractZARPrice(text);
        if (price !== null) {
          searchPrice = price;
          break;
        }
      }
    } catch (error) {
      console.error(`Search error for "${realName}":`, error);
    }
  }

  // Phase 1 success
  if (searchPrice !== null) {
    return searchPrice;
  }

  // Phase 2: Scrape the Booking.com URL directly for pricing
  if (bookingUrl) {
    try {
      // Add South African locale params to get ZAR pricing
      const url = new URL(bookingUrl);
      if (!url.searchParams.has('selected_currency')) {
        url.searchParams.set('selected_currency', 'ZAR');
      }

      const scrapeResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.toString(),
          formats: ['markdown'],
          onlyMainContent: true,
          waitFor: 3000,
          location: { country: 'ZA', languages: ['en'] },
        }),
      });

      if (scrapeResponse.ok) {
        const scrapeData = await scrapeResponse.json();
        const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || '';
        const scraped = extractZARPrice(markdown);
        if (scraped !== null) {
          console.log(`  → Scraped rate for "${realName}": R${scraped}`);
          return scraped;
        }
      }
    } catch (err) {
      console.warn(`Scrape failed for "${realName}":`, err);
    }
  }

  return null;
}

/**
 * Process hotels in batches with concurrency control.
 */
async function processBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 5,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
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

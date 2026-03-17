import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  getHotelsForDestination,
  getUniqueRealNames,
  SYNC_DESTINATIONS,
} from '../_shared/budget-affordable-hotels.ts';
import { processHotelsSequentially } from '../_shared/scrape-hotel-rate.ts';

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const destination = body?.destination as string | undefined;

    const destinations = destination ? [destination] : SYNC_DESTINATIONS;

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

      // Use Firecrawl SCRAPE (not search) — same proven approach as premium-live-booking
      const rateMap = await processHotelsSequentially(uniqueHotels, apiKey);

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

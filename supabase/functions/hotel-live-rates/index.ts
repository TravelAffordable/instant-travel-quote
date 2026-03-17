import { getHotelsForDestination } from '../_shared/budget-affordable-hotels.ts';
import { scrapeHotelRate } from '../_shared/scrape-hotel-rate.ts';

type RequestedHotel = {
  name: string;
  tier: 'budget' | 'affordable' | 'premium';
  capacity: '2_sleeper' | '4_sleeper';
};

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

function normalizeDestination(destination: string): string {
  const value = destination.trim().toLowerCase();
  if (value === 'vaal') return 'vaal-river';
  return value;
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function getNightCount(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function resolveCatalogHotel(destination: string, requestedHotel: RequestedHotel) {
  const name = normalizeName(requestedHotel.name);
  const candidates = getHotelsForDestination(normalizeDestination(destination));

  return candidates.find((hotel) => (
    hotel.cap === requestedHotel.capacity
    && hotel.tier === requestedHotel.tier
    && (normalizeName(hotel.alias) === name || normalizeName(hotel.realName) === name)
  )) ?? candidates.find((hotel) => (
    hotel.cap === requestedHotel.capacity
    && (normalizeName(hotel.alias) === name || normalizeName(hotel.realName) === name)
  )) ?? null;
}

async function processInBatches<T, R>(
  items: T[],
  batchSize: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(worker));
    results.push(...batchResults);

    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 350));
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
    const destination = typeof body?.destination === 'string' ? body.destination : '';
    const checkIn = typeof body?.checkIn === 'string' ? body.checkIn : '';
    const checkOut = typeof body?.checkOut === 'string' ? body.checkOut : '';
    const rooms = Number(body?.rooms || 1);
    const hotels = Array.isArray(body?.hotels) ? body.hotels as RequestedHotel[] : [];

    if (!destination) {
      return jsonResponse({ error: 'destination is required' }, 400);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      return jsonResponse({ error: 'checkIn and checkOut must be YYYY-MM-DD' }, 400);
    }

    if (!Number.isInteger(rooms) || rooms < 1 || rooms > 5) {
      return jsonResponse({ error: 'rooms must be an integer between 1 and 5' }, 400);
    }

    if (hotels.length === 0) {
      return jsonResponse({ rates: [] });
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'FIRECRAWL_API_KEY not configured' }, 500);
    }

    const nights = getNightCount(checkIn, checkOut);
    const requestedDestination = normalizeDestination(destination);

    const liveRates = await processInBatches(hotels, 3, async (requestedHotel) => {
      const catalogHotel = resolveCatalogHotel(requestedDestination, requestedHotel);
      if (!catalogHotel) {
        console.log(`No catalog match for ${requestedHotel.name} (${requestedDestination})`);
        return null;
      }

      const nightlyRate = await scrapeHotelRate(
        catalogHotel.realName,
        catalogHotel.city,
        apiKey,
        { checkIn, checkOut },
      );

      if (nightlyRate === null) {
        return null;
      }

      return {
        name: requestedHotel.name,
        nightlyRate,
        totalRate: nightlyRate * nights * rooms,
      };
    });

    return jsonResponse({
      destination: requestedDestination,
      generatedAt: new Date().toISOString(),
      rates: liveRates.filter(Boolean),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('hotel-live-rates error:', message);
    return jsonResponse({ error: message }, 500);
  }
});
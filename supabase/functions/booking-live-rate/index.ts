import {
  getPremiumHotelConfig,
  type HotelKey,
  type OccupancyKey,
  scrapeLiveBookingRate,
} from '../_shared/premium-live-booking.ts';

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
    const body = await req.json();
    const hotelKey = body?.hotelKey as HotelKey | undefined;
    const checkIn = body?.checkIn as string | undefined;
    const checkOut = body?.checkOut as string | undefined;
    const occupancy = body?.occupancy as OccupancyKey | undefined;
    const rooms = Number(body?.rooms || 1);

    if (!hotelKey || !getPremiumHotelConfig(hotelKey)) {
      return jsonResponse({ error: 'A valid hotelKey is required.' }, 400);
    }

    if (!checkIn || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn)) {
      return jsonResponse({ error: 'A valid checkIn date in YYYY-MM-DD format is required.' }, 400);
    }

    if (!checkOut || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      return jsonResponse({ error: 'A valid checkOut date in YYYY-MM-DD format is required.' }, 400);
    }

    if (!occupancy || !['2_sleeper', '4_sleeper'].includes(occupancy)) {
      return jsonResponse({ error: 'A valid occupancy is required.' }, 400);
    }

    if (!Number.isInteger(rooms) || rooms < 1 || rooms > 5) {
      return jsonResponse({ error: 'rooms must be an integer between 1 and 5.' }, 400);
    }

    const result = await scrapeLiveBookingRate({
      checkIn,
      checkOut,
      hotelKey,
      occupancy,
      rooms,
    });

    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('booking-live-rate error:', message);
    return jsonResponse({ error: message }, 500);
  }
});

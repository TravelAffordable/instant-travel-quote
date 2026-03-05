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

const NIGHTS = 2;
const RANGE_END = new Date('2027-02-26T00:00:00Z');

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getUpcomingFriday(now = new Date()) {
  const current = startOfDay(now);
  const day = current.getUTCDay();
  const distance = (5 - day + 7) % 7;
  return addDays(current, distance);
}

function getMonthBounds(month: string) {
  const match = month.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));
  return { end, start };
}

function getWeekendStartsForMonth(month: string) {
  const bounds = getMonthBounds(month);
  if (!bounds) return [];

  const minimumStart = getUpcomingFriday();
  const rangeStart = bounds.start > minimumStart ? bounds.start : minimumStart;
  const rangeEnd = bounds.end < RANGE_END ? bounds.end : RANGE_END;

  if (rangeStart > rangeEnd) return [];

  const weekends: Date[] = [];
  const cursor = new Date(rangeStart);
  const offsetToFriday = (5 - cursor.getUTCDay() + 7) % 7;
  cursor.setUTCDate(cursor.getUTCDate() + offsetToFriday);

  while (cursor <= rangeEnd) {
    weekends.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 7);
  }

  return weekends;
}

async function scrapeWeekend(hotelKey: HotelKey, weekendStart: Date, occupancy: OccupancyKey) {
  return scrapeLiveBookingRate({
    checkIn: toDateOnly(weekendStart),
    checkOut: toDateOnly(addDays(weekendStart, NIGHTS)),
    hotelKey,
    occupancy,
    rooms: 1,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const hotelKey = body?.hotelKey as HotelKey | undefined;
    const month = body?.month as string | undefined;
    const hotelConfig = hotelKey ? getPremiumHotelConfig(hotelKey) : null;

    if (!hotelKey || !hotelConfig) {
      return jsonResponse({ error: 'A valid hotelKey is required.' }, 400);
    }

    if (!month || !getMonthBounds(month)) {
      return jsonResponse({ error: 'A valid month in YYYY-MM format is required.' }, 400);
    }

    const weekends = getWeekendStartsForMonth(month);
    const weekendPairs = await Promise.all(
      weekends.map(async (weekendStart) => {
        const [twoSleeperRate, fourSleeperRate] = await Promise.all([
          scrapeWeekend(hotelKey, weekendStart, '2_sleeper'),
          scrapeWeekend(hotelKey, weekendStart, '4_sleeper'),
        ]);

        return { fourSleeperRate, twoSleeperRate };
      }),
    );

    return jsonResponse({
      generatedAt: new Date().toISOString(),
      hotelKey,
      hotelName: hotelConfig.name,
      month,
      weekendsByOccupancy: {
        '2_sleeper': weekendPairs.map((pair) => pair.twoSleeperRate),
        '4_sleeper': weekendPairs.map((pair) => pair.fourSleeperRate),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('booking-weekend-calendar error:', message);
    return jsonResponse({ error: message }, 500);
  }
});

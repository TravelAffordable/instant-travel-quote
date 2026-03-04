const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type HotelKey = 'blue-waters' | 'garden-court-south-beach' | 'the-edward';
type OccupancyKey = '2_sleeper' | '4_sleeper';

type WeekendRate = {
  available: boolean;
  checkIn: string;
  checkOut: string;
  currency: string;
  displayNightlyRate: number | null;
  maxPeople: number | null;
  note: string | null;
  partyNightlyRate: number | null;
  ratePerNight: number | null;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms' | null;
  roomName: string | null;
  sourceUrl: string;
  totalPrice: number | null;
};

type ParsedRoomOption = {
  maxPeople: number | null;
  partyNightlyRate: number;
  ratePerNight: number;
  raw: string;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms';
  roomName: string;
  totalPrice: number;
};

const HOTEL_CONFIGS: Record<HotelKey, { bookingUrl: string; name: string }> = {
  'blue-waters': {
    bookingUrl: 'https://www.booking.com/hotel/za/blue-waters.en-gb.html',
    name: 'Blue Waters Hotel',
  },
  'garden-court-south-beach': {
    bookingUrl: 'https://www.booking.com/hotel/za/garden-court-south-beach-durban1.en-gb.html',
    name: 'Garden Court South Beach',
  },
  'the-edward': {
    bookingUrl: 'https://www.booking.com/hotel/za/the-edward-durban.html',
    name: 'The Edward',
  },
};

const CURRENCY_CODE = 'ZAR';
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

function buildBookingUrl(hotelKey: HotelKey, checkIn: string, checkOut: string, adults: number) {
  const url = new URL(HOTEL_CONFIGS[hotelKey].bookingUrl);
  url.searchParams.set('checkin', checkIn);
  url.searchParams.set('checkout', checkOut);
  url.searchParams.set('group_adults', String(adults));
  url.searchParams.set('group_children', '0');
  url.searchParams.set('no_rooms', '1');
  url.searchParams.set('sb_price_type', 'total');
  url.searchParams.set('selected_currency', CURRENCY_CODE);
  url.searchParams.set('type', 'total');
  return url.toString();
}

function parseMoney(raw: string | undefined | null) {
  if (!raw) return null;
  const normalized = raw.replace(/,/g, '').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function parseRoomOptions(markdown: string) {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  const options: ParsedRoomOption[] = [];
  let currentRoomName: string | null = null;

  for (const line of lines) {
    const roomMatch = line.match(/^\|\s*\[([^\]]+)\]/);
    if (roomMatch) {
      currentRoomName = roomMatch[1];
    }

    if (!currentRoomName) continue;
    if (!line.includes('per night') || !line.includes('Price')) continue;

    const rateMatch = line.match(/(?:ZAR|R)\s*([\d,]+)<br>per night/i);
    const totalMatch = line.match(/<br>(?:ZAR|R)\s*([\d,]+)<br>Price/i);
    const maxPeopleMatch = line.match(/Max\. people:\s*(\d+)/i);
    const requiredRoomsMatch = line.match(/To fit\s+4\s+adults,\s+you'll need to select\s+(\d+)\s+of these/i);

    const ratePerNight = parseMoney(rateMatch?.[1]);
    const totalPrice = parseMoney(totalMatch?.[1]);
    if (ratePerNight === null || totalPrice === null) continue;

    const requiredRooms = Number(requiredRoomsMatch?.[1] || '1');
    const partyNightlyRate = Number(((totalPrice * requiredRooms) / NIGHTS).toFixed(2));

    options.push({
      maxPeople: maxPeopleMatch ? Number(maxPeopleMatch[1]) : null,
      partyNightlyRate,
      ratePerNight: Number((totalPrice / NIGHTS).toFixed(2)),
      raw: line,
      requiredRooms,
      roomMode: requiredRooms > 1 ? 'multiple_rooms' : 'single_room',
      roomName: currentRoomName,
      totalPrice,
    });
  }

  return options;
}

function pickBestOption(options: ParsedRoomOption[], occupancy: OccupancyKey) {
  if (occupancy === '2_sleeper') {
    const exactTwo = options
      .filter((option) => option.requiredRooms === 1 && option.maxPeople === 2)
      .sort((a, b) => a.partyNightlyRate - b.partyNightlyRate);

    if (exactTwo[0]) return exactTwo[0];

    return options
      .filter((option) => option.requiredRooms === 1 && (option.maxPeople === null || option.maxPeople >= 2))
      .sort((a, b) => a.partyNightlyRate - b.partyNightlyRate)[0] || null;
  }

  const fourAdultOptions = options
    .filter((option) => option.requiredRooms > 1 || (option.maxPeople !== null && option.maxPeople >= 4) || /Recommended for 4 adults/i.test(option.raw))
    .sort((a, b) => a.partyNightlyRate - b.partyNightlyRate);

  return fourAdultOptions[0] || null;
}

async function scrapeMarkdown(url: string) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formats: ['markdown'],
      location: { country: 'ZA', languages: ['en'] },
      onlyMainContent: true,
      url,
      waitFor: 1500,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Firecrawl scrape failed [${response.status}]: ${JSON.stringify(data)}`);
  }

  const markdown = data?.data?.markdown || data?.markdown;
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('Firecrawl scrape returned no markdown');
  }

  return markdown;
}

async function scrapeWeekend(hotelKey: HotelKey, weekendStart: Date, occupancy: OccupancyKey): Promise<WeekendRate> {
  const checkIn = toDateOnly(weekendStart);
  const checkOut = toDateOnly(addDays(weekendStart, NIGHTS));
  const adults = occupancy === '2_sleeper' ? 2 : 4;
  const sourceUrl = buildBookingUrl(hotelKey, checkIn, checkOut, adults);

  try {
    const markdown = await scrapeMarkdown(sourceUrl);
    const options = parseRoomOptions(markdown);
    const bestOption = pickBestOption(options, occupancy);

    if (!bestOption) {
      return {
        available: false,
        checkIn,
        checkOut,
        currency: CURRENCY_CODE,
        displayNightlyRate: null,
        maxPeople: null,
        note: 'No matching weekend room option was found for this occupancy.',
        partyNightlyRate: null,
        ratePerNight: null,
        requiredRooms: 0,
        roomMode: null,
        roomName: null,
        sourceUrl,
        totalPrice: null,
      };
    }

    return {
      available: true,
      checkIn,
      checkOut,
      currency: CURRENCY_CODE,
      displayNightlyRate: occupancy === '2_sleeper' ? bestOption.ratePerNight : bestOption.partyNightlyRate,
      maxPeople: bestOption.maxPeople,
      note: bestOption.requiredRooms > 1
        ? `${bestOption.requiredRooms} rooms required to fit 4 adults.`
        : null,
      partyNightlyRate: bestOption.partyNightlyRate,
      ratePerNight: bestOption.ratePerNight,
      requiredRooms: bestOption.requiredRooms,
      roomMode: bestOption.roomMode,
      roomName: bestOption.roomName,
      sourceUrl,
      totalPrice: bestOption.totalPrice,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown scrape error';
    return {
      available: false,
      checkIn,
      checkOut,
      currency: CURRENCY_CODE,
      displayNightlyRate: null,
      maxPeople: null,
      note: message,
      partyNightlyRate: null,
      ratePerNight: null,
      requiredRooms: 0,
      roomMode: null,
      roomName: null,
      sourceUrl,
      totalPrice: null,
    };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const hotelKey = body?.hotelKey as HotelKey | undefined;
    const month = body?.month as string | undefined;

    if (!hotelKey || !(hotelKey in HOTEL_CONFIGS)) {
      return jsonResponse({ error: 'A valid hotelKey is required.' }, 400);
    }

    if (!month || !getMonthBounds(month)) {
      return jsonResponse({ error: 'A valid month in YYYY-MM format is required.' }, 400);
    }

    const weekends = getWeekendStartsForMonth(month);
    const twoSleeper: WeekendRate[] = [];
    const fourSleeper: WeekendRate[] = [];

    for (const weekendStart of weekends) {
      twoSleeper.push(await scrapeWeekend(hotelKey, weekendStart, '2_sleeper'));
      fourSleeper.push(await scrapeWeekend(hotelKey, weekendStart, '4_sleeper'));
    }

    return jsonResponse({
      generatedAt: new Date().toISOString(),
      hotelKey,
      hotelName: HOTEL_CONFIGS[hotelKey].name,
      month,
      weekendsByOccupancy: {
        '2_sleeper': twoSleeper,
        '4_sleeper': fourSleeper,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('booking-weekend-calendar error:', message);
    return jsonResponse({ error: message }, 500);
  }
});

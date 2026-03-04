const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type HotelKey = 'blue-waters' | 'garden-court-south-beach' | 'the-edward';
type OccupancyKey = '2_sleeper' | '4_sleeper';

type ParsedRoomOption = {
  maxPeople: number | null;
  partyNightlyRate: number;
  partyTotalPrice: number;
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
const SCRAPE_TIMEOUT_MS = 15000;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function parseMoney(raw: string | undefined | null) {
  if (!raw) return null;
  const normalized = raw.replace(/,/g, '').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function getNightCount(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function buildBookingUrl(hotelKey: HotelKey, checkIn: string, checkOut: string, adults: number, rooms: number) {
  const url = new URL(HOTEL_CONFIGS[hotelKey].bookingUrl);
  url.searchParams.set('checkin', checkIn);
  url.searchParams.set('checkout', checkOut);
  url.searchParams.set('group_adults', String(adults));
  url.searchParams.set('group_children', '0');
  url.searchParams.set('no_rooms', String(Math.max(1, rooms)));
  url.searchParams.set('sb_price_type', 'total');
  url.searchParams.set('selected_currency', CURRENCY_CODE);
  url.searchParams.set('type', 'total');
  return url.toString();
}

function parseRoomOptions(markdown: string, nights: number) {
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
    const requiredRoomsMatch = line.match(/you'll need to select\s+(\d+)\s+of these/i);

    const ratePerNight = parseMoney(rateMatch?.[1]);
    const totalPrice = parseMoney(totalMatch?.[1]);
    if (ratePerNight === null || totalPrice === null) continue;

    const requiredRooms = Number(requiredRoomsMatch?.[1] || '1');
    const partyTotalPrice = totalPrice * requiredRooms;
    const partyNightlyRate = Number((partyTotalPrice / nights).toFixed(2));

    options.push({
      maxPeople: maxPeopleMatch ? Number(maxPeopleMatch[1]) : null,
      partyNightlyRate,
      partyTotalPrice,
      ratePerNight: Number((totalPrice / nights).toFixed(2)),
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
      .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice);

    if (exactTwo[0]) return exactTwo[0];

    return options
      .filter((option) => option.requiredRooms === 1 && (option.maxPeople === null || option.maxPeople >= 2))
      .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice)[0] || null;
  }

  return options
    .filter((option) => option.requiredRooms > 1 || (option.maxPeople !== null && option.maxPeople >= 4) || /Recommended for 4 adults/i.test(option.raw))
    .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice)[0] || null;
}

async function scrapeMarkdown(url: string) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  let response: Response;

  try {
    response = await fetch('https://api.firecrawl.dev/v1/scrape', {
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
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Scrape timed out after ${SCRAPE_TIMEOUT_MS / 1000}s`);
    }

    throw error;
  }

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

    if (!hotelKey || !(hotelKey in HOTEL_CONFIGS)) {
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

    const nights = getNightCount(checkIn, checkOut);
    const adults = occupancy === '2_sleeper' ? 2 : 4;
    const sourceUrl = buildBookingUrl(hotelKey, checkIn, checkOut, adults, rooms);
    const markdown = await scrapeMarkdown(sourceUrl);
    const options = parseRoomOptions(markdown, nights);
    const bestOption = pickBestOption(options, occupancy);

    if (!bestOption) {
      return jsonResponse({
        available: false,
        checkIn,
        checkOut,
        currency: CURRENCY_CODE,
        displayNightlyRate: null,
        displayTotalPrice: null,
        hotelKey,
        hotelName: HOTEL_CONFIGS[hotelKey].name,
        maxPeople: null,
        note: 'No matching room option was found for this occupancy.',
        requiredRooms: 0,
        roomMode: null,
        roomName: null,
        sourceUrl,
      });
    }

    return jsonResponse({
      available: true,
      checkIn,
      checkOut,
      currency: CURRENCY_CODE,
      displayNightlyRate: occupancy === '2_sleeper' ? bestOption.ratePerNight : bestOption.partyNightlyRate,
      displayTotalPrice: occupancy === '2_sleeper' ? bestOption.totalPrice : bestOption.partyTotalPrice,
      hotelKey,
      hotelName: HOTEL_CONFIGS[hotelKey].name,
      maxPeople: bestOption.maxPeople,
      note: bestOption.requiredRooms > 1
        ? `${bestOption.requiredRooms} rooms required to fit 4 adults.`
        : null,
      requiredRooms: bestOption.requiredRooms,
      roomMode: bestOption.roomMode,
      roomName: bestOption.roomName,
      sourceUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('booking-live-rate error:', message);
    return jsonResponse({ error: message }, 500);
  }
});

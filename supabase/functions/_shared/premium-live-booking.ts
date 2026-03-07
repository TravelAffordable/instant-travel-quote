const CURRENCY_CODE = 'ZAR';
const SCRAPE_TIMEOUT_MS = 15000;

export type HotelKey =
  | 'blue-waters'
  | 'garden-court-south-beach'
  | 'the-edward'
  | 'the-balmoral'
  | 'belaire-suites-hotel'
  | 'gooderson-tropicana-hotel'
  | 'gooderson-leisure-silver-sands-2'
  | 'first-group-the-palace-all-suite'
  | 'garden-court-marine-parade'
  | 'southern-sun-elangeni-maharani'
  | 'suncoast-hotel-towers'
  | 'sea-esta-luxury-apartment-107'
  | 'beach-hurst-303'
  | 'ushaka-views'
  | 'indlovukazi-guesthouse'
  | 'villa-paradiso-hotel'
  | 'cocomo-boutique-hotel'
  | 'the-riverleaf-hotel'
  | 'kosmos-manor'
  | 'palm-swift-luxury'
  | 'the-venue-country-hotel-and-spa'
  | 'waterfront-guesthouse'
  | 'metsingat-harties'
  | 'marina-view-guesthouse'
  | 'cozy-kosmos'
  | 'serenity-guesthouse'
  | 'mint-hotel-the-blyde'
  | 'blyde-penthouse-apartments';

export type OccupancyKey = '2_sleeper' | '4_sleeper';

export type PremiumHotelConfig = {
  aliases: string[];
  bookingUrl?: string;
  destinationLabel: string;
  key: HotelKey;
  name: string;
  searchQuery: string;
};

export type LiveBookingRate = {
  available: boolean;
  checkIn: string;
  checkOut: string;
  currency: string;
  displayNightlyRate: number | null;
  displayTotalPrice: number | null;
  hotelKey: HotelKey;
  hotelName: string;
  maxPeople: number | null;
  note: string | null;
  partyNightlyRate: number | null;
  partyTotalPrice: number | null;
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
  partyTotalPrice: number;
  ratePerNight: number;
  raw: string;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms';
  roomName: string;
  totalPrice: number;
};

export const PREMIUM_HOTEL_CONFIGS: Record<HotelKey, PremiumHotelConfig> = {
  'blue-waters': {
    aliases: ['Blue Waters Hotel'],
    bookingUrl: 'https://www.booking.com/hotel/za/blue-waters.en-gb.html',
    destinationLabel: 'Durban',
    key: 'blue-waters',
    name: 'Blue Waters Hotel',
    searchQuery: 'Blue Waters Hotel Durban South Africa site:booking.com',
  },
  'garden-court-south-beach': {
    aliases: ['Garden Court South Beach', 'Southern Sun Garden Court South Beach'],
    bookingUrl: 'https://www.booking.com/hotel/za/garden-court-south-beach-durban1.en-gb.html',
    destinationLabel: 'Durban',
    key: 'garden-court-south-beach',
    name: 'Garden Court South Beach',
    searchQuery: 'Garden Court South Beach Durban South Africa site:booking.com',
  },
  'the-edward': {
    aliases: ['The Edward', 'Southern Sun The Edward'],
    bookingUrl: 'https://www.booking.com/hotel/za/the-edward-durban.html',
    destinationLabel: 'Durban',
    key: 'the-edward',
    name: 'The Edward',
    searchQuery: 'The Edward Durban South Africa site:booking.com',
  },
  'the-balmoral': {
    aliases: ['The Balmoral'],
    destinationLabel: 'Durban',
    key: 'the-balmoral',
    name: 'The Balmoral',
    searchQuery: 'The Balmoral Durban South Africa site:booking.com',
  },
  'belaire-suites-hotel': {
    aliases: ['Belaire Suites Hotel'],
    destinationLabel: 'Durban',
    key: 'belaire-suites-hotel',
    name: 'Belaire Suites Hotel',
    searchQuery: 'Belaire Suites Hotel Durban South Africa site:booking.com',
  },
  'gooderson-tropicana-hotel': {
    aliases: ['Gooderson Tropicana Hotel'],
    destinationLabel: 'Durban',
    key: 'gooderson-tropicana-hotel',
    name: 'Gooderson Tropicana Hotel',
    searchQuery: 'Gooderson Tropicana Hotel Durban South Africa site:booking.com',
  },
  'gooderson-leisure-silver-sands-2': {
    aliases: ['Gooderson Leisure Silver Sands 2'],
    destinationLabel: 'Durban',
    key: 'gooderson-leisure-silver-sands-2',
    name: 'Gooderson Leisure Silver Sands 2',
    searchQuery: 'Gooderson Leisure Silver Sands Durban South Africa site:booking.com',
  },
  'first-group-the-palace-all-suite': {
    aliases: ['First Group The Palace All-Suite'],
    destinationLabel: 'Durban',
    key: 'first-group-the-palace-all-suite',
    name: 'First Group The Palace All-Suite',
    searchQuery: 'First Group The Palace All-Suite Durban South Africa site:booking.com',
  },
  'garden-court-marine-parade': {
    aliases: ['Garden Court Marine Parade', 'Southern Sun Garden Court Marine Parade'],
    destinationLabel: 'Durban',
    key: 'garden-court-marine-parade',
    name: 'Garden Court Marine Parade',
    searchQuery: 'Garden Court Marine Parade Durban South Africa site:booking.com',
  },
  'southern-sun-elangeni-maharani': {
    aliases: ['Southern Sun Elangeni & Maharani Hotel', 'Southern Sun Elangeni & Maharani'],
    destinationLabel: 'Durban',
    key: 'southern-sun-elangeni-maharani',
    name: 'Southern Sun Elangeni & Maharani Hotel',
    searchQuery: 'Southern Sun Elangeni Maharani Durban South Africa site:booking.com',
  },
  'suncoast-hotel-towers': {
    aliases: ['Suncoast Hotel & Towers'],
    destinationLabel: 'Durban',
    key: 'suncoast-hotel-towers',
    name: 'Suncoast Hotel & Towers',
    searchQuery: 'Suncoast Hotel Towers Durban South Africa site:booking.com',
  },
  'sea-esta-luxury-apartment-107': {
    aliases: ['Sea Esta Luxury Apartment 107'],
    destinationLabel: 'Durban',
    key: 'sea-esta-luxury-apartment-107',
    name: 'Sea Esta Luxury Apartment 107',
    searchQuery: 'Sea Esta Luxury Apartment 107 Durban South Africa site:booking.com',
  },
  'beach-hurst-303': {
    aliases: ['Beach Hurst 303'],
    destinationLabel: 'Durban',
    key: 'beach-hurst-303',
    name: 'Beach Hurst 303',
    searchQuery: 'Beach Hurst 303 Durban South Africa site:booking.com',
  },
  'ushaka-views': {
    aliases: ['UshakaViews'],
    destinationLabel: 'Durban',
    key: 'ushaka-views',
    name: 'UshakaViews',
    searchQuery: 'UshakaViews Durban South Africa site:booking.com',
  },
  'indlovukazi-guesthouse': {
    aliases: ['Indlovukazi Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'indlovukazi-guesthouse',
    name: 'Indlovukazi Guesthouse',
    searchQuery: 'Indlovukazi Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'villa-paradiso-hotel': {
    aliases: ['Villa Paradiso Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'villa-paradiso-hotel',
    name: 'Villa Paradiso Hotel',
    searchQuery: 'Villa Paradiso Hotel Hartbeespoort South Africa site:booking.com',
  },
  'cocomo-boutique-hotel': {
    aliases: ['Cocomo Boutique Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'cocomo-boutique-hotel',
    name: 'Cocomo Boutique Hotel',
    searchQuery: 'Cocomo Boutique Hotel Hartbeespoort South Africa site:booking.com',
  },
  'the-riverleaf-hotel': {
    aliases: ['The Riverleaf Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'the-riverleaf-hotel',
    name: 'The Riverleaf Hotel',
    searchQuery: 'The Riverleaf Hotel Hartbeespoort South Africa site:booking.com',
  },
  'kosmos-manor': {
    aliases: ['Kosmos Manor'],
    destinationLabel: 'Hartbeespoort',
    key: 'kosmos-manor',
    name: 'Kosmos Manor',
    searchQuery: 'Kosmos Manor Hartbeespoort South Africa site:booking.com',
  },
  'palm-swift-luxury': {
    aliases: ['Palm Swift Luxury'],
    destinationLabel: 'Hartbeespoort',
    key: 'palm-swift-luxury',
    name: 'Palm Swift Luxury',
    searchQuery: 'Palm Swift Luxury Hartbeespoort South Africa site:booking.com',
  },
  'the-venue-country-hotel-and-spa': {
    aliases: ['The Venue Country Hotel and Spa'],
    destinationLabel: 'Hartbeespoort',
    key: 'the-venue-country-hotel-and-spa',
    name: 'The Venue Country Hotel and Spa',
    searchQuery: 'The Venue Country Hotel and Spa Hartbeespoort South Africa site:booking.com',
  },
  'waterfront-guesthouse': {
    aliases: ['Waterfront Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'waterfront-guesthouse',
    name: 'Waterfront Guesthouse',
    searchQuery: 'Waterfront Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'metsingat-harties': {
    aliases: ['MetsingAt Harties'],
    destinationLabel: 'Hartbeespoort',
    key: 'metsingat-harties',
    name: 'MetsingAt Harties',
    searchQuery: 'MetsingAt Harties Hartbeespoort South Africa site:booking.com',
  },
  'marina-view-guesthouse': {
    aliases: ['Marina View Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'marina-view-guesthouse',
    name: 'Marina View Guesthouse',
    searchQuery: 'Marina View Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'cozy-kosmos': {
    aliases: ['Cozy Kosmos'],
    destinationLabel: 'Hartbeespoort',
    key: 'cozy-kosmos',
    name: 'Cozy Kosmos',
    searchQuery: 'Cozy Kosmos Hartbeespoort South Africa site:booking.com',
  },
  'serenity-guesthouse': {
    aliases: ['Serenity Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'serenity-guesthouse',
    name: 'Serenity Guesthouse',
    searchQuery: 'Serenity Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'mint-hotel-the-blyde': {
    aliases: ['Mint Hotel The Blyde'],
    destinationLabel: 'Pretoria',
    key: 'mint-hotel-the-blyde',
    name: 'Mint Hotel The Blyde',
    searchQuery: 'Mint Hotel The Blyde Pretoria South Africa site:booking.com',
  },
  'blyde-penthouse-apartments': {
    aliases: ['Blyde Penthouse Apartments'],
    destinationLabel: 'Pretoria',
    key: 'blyde-penthouse-apartments',
    name: 'Blyde Penthouse Apartments',
    searchQuery: 'Blyde Penthouse Apartments Pretoria South Africa site:booking.com',
  },
};

export function getPremiumHotelConfig(hotelKey: HotelKey) {
  return PREMIUM_HOTEL_CONFIGS[hotelKey] ?? null;
}

export function parseMoney(raw: string | undefined | null) {
  if (!raw) return null;
  const normalized = raw.replace(/,/g, '').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function getNightCount(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function buildBookingUrl(hotelKey: HotelKey, checkIn: string, checkOut: string, adults: number, rooms: number, bookingUrl?: string) {
  const baseUrl = bookingUrl ?? PREMIUM_HOTEL_CONFIGS[hotelKey].bookingUrl;
  if (!baseUrl) {
    throw new Error(`No booking URL available for ${PREMIUM_HOTEL_CONFIGS[hotelKey].name}`);
  }

  const url = new URL(baseUrl);
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

export function parseRoomOptions(markdown: string, nights: number) {
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

export function pickBestOption(options: ParsedRoomOption[], occupancy: OccupancyKey) {
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

async function firecrawlRequest(path: string, body: Record<string, unknown>) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  let response: Response;

  try {
    response = await fetch(`https://api.firecrawl.dev/v1/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`${path} timed out after ${SCRAPE_TIMEOUT_MS / 1000}s`);
    }

    throw error;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Firecrawl ${path} failed [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function resolveBookingListingUrl(hotelKey: HotelKey) {
  const config = PREMIUM_HOTEL_CONFIGS[hotelKey];
  if (config.bookingUrl) return config.bookingUrl;

  const data = await firecrawlRequest('search', {
    query: config.searchQuery,
    country: 'ZA',
    lang: 'en',
    limit: 5,
  });

  const results = Array.isArray(data?.data) ? data.data : [];
  const bookingMatch = results.find((result) => {
    const url = typeof result?.url === 'string' ? result.url : '';
    return url.includes('booking.com') && (url.includes('/hotel/') || url.includes('/searchresults'));
  });

  const url = typeof bookingMatch?.url === 'string' ? bookingMatch.url : null;
  if (!url) {
    throw new Error(`No Booking.com result found for ${config.name}`);
  }

  return url;
}

export async function scrapeMarkdown(url: string) {
  const data = await firecrawlRequest('scrape', {
    formats: ['markdown'],
    location: { country: 'ZA', languages: ['en'] },
    onlyMainContent: true,
    url,
    waitFor: 1500,
  });

  const markdown = data?.data?.markdown || data?.markdown;
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('Firecrawl scrape returned no markdown');
  }

  return markdown;
}

export async function scrapeLiveBookingRate(params: {
  checkIn: string;
  checkOut: string;
  hotelKey: HotelKey;
  occupancy: OccupancyKey;
  rooms: number;
}): Promise<LiveBookingRate> {
  const { checkIn, checkOut, hotelKey, occupancy, rooms } = params;
  const nights = getNightCount(checkIn, checkOut);
  const adults = occupancy === '2_sleeper' ? 2 : 4;
  const config = PREMIUM_HOTEL_CONFIGS[hotelKey];
  const listingUrl = await resolveBookingListingUrl(hotelKey);
  const sourceUrl = buildBookingUrl(hotelKey, checkIn, checkOut, adults, rooms, listingUrl);

  try {
    const markdown = await scrapeMarkdown(sourceUrl);
    const options = parseRoomOptions(markdown, nights);
    const bestOption = pickBestOption(options, occupancy);

    if (!bestOption) {
      return {
        available: false,
        checkIn,
        checkOut,
        currency: CURRENCY_CODE,
        displayNightlyRate: null,
        displayTotalPrice: null,
        hotelKey,
        hotelName: config.name,
        maxPeople: null,
        note: 'No matching room option was found for this occupancy.',
        partyNightlyRate: null,
        partyTotalPrice: null,
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
      displayTotalPrice: occupancy === '2_sleeper' ? bestOption.totalPrice : bestOption.partyTotalPrice,
      hotelKey,
      hotelName: config.name,
      maxPeople: bestOption.maxPeople,
      note: bestOption.requiredRooms > 1 ? `${bestOption.requiredRooms} rooms required to fit 4 adults.` : null,
      partyNightlyRate: bestOption.partyNightlyRate,
      partyTotalPrice: bestOption.partyTotalPrice,
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
      displayTotalPrice: null,
      hotelKey,
      hotelName: config.name,
      maxPeople: null,
      note: message,
      partyNightlyRate: null,
      partyTotalPrice: null,
      ratePerNight: null,
      requiredRooms: 0,
      roomMode: null,
      roomName: null,
      sourceUrl,
      totalPrice: null,
    };
  }
}

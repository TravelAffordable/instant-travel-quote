import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges?: number[];
  rooms: number;
}

// Destination coordinates for geographic search
const destinationConfig: Record<string, { latitude: number; longitude: number; radius: number; cityCode: string }> = {
  'durban': { latitude: -29.8560, longitude: 31.0315, radius: 3, cityCode: 'DUR' },
  'umhlanga': { latitude: -29.725, longitude: 31.085, radius: 3, cityCode: 'DUR' },
  'ballito': { latitude: -29.539, longitude: 31.214, radius: 5, cityCode: 'DUR' },
  'harties': { latitude: -25.7461, longitude: 27.8614, radius: 10, cityCode: 'JNB' },
  'magalies': { latitude: -25.7833, longitude: 27.5167, radius: 10, cityCode: 'JNB' },
  'pilanesberg': { latitude: -25.2667, longitude: 27.0833, radius: 15, cityCode: 'JNB' },
  'sun city': { latitude: -25.3350, longitude: 27.0992, radius: 10, cityCode: 'JNB' },
  'vaal': { latitude: -26.8700, longitude: 28.1100, radius: 15, cityCode: 'JNB' },
  'mpumalanga': { latitude: -25.4358, longitude: 30.9861, radius: 30, cityCode: 'MQP' },
  'cape town': { latitude: -33.9249, longitude: 18.4241, radius: 10, cityCode: 'CPT' },
  'zanzibar': { latitude: -6.1659, longitude: 39.2026, radius: 20, cityCode: 'ZNZ' },
  'mozambique': { latitude: -25.9692, longitude: 32.5732, radius: 20, cityCode: 'MPM' },
  'mauritius': { latitude: -20.1609, longitude: 57.5012, radius: 30, cityCode: 'MRU' },
};

// Get OAuth2 access token from Amadeus
async function getAccessToken(apiKey: string, apiSecret: string): Promise<string> {
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OAuth token error:', response.status, errorText);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Get hotel IDs by geographic location
async function getHotelsByLocation(
  accessToken: string,
  latitude: number,
  longitude: number,
  radius: number
): Promise<string[]> {
  const url = new URL('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode');
  url.searchParams.set('latitude', latitude.toString());
  url.searchParams.set('longitude', longitude.toString());
  url.searchParams.set('radius', radius.toString());
  url.searchParams.set('radiusUnit', 'KM');

  console.log('Fetching hotels by location:', url.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Hotel list error:', response.status, errorText);
    return [];
  }

  const data = await response.json();
  const hotelIds = data.data?.map((hotel: any) => hotel.hotelId) || [];
  console.log(`Found ${hotelIds.length} hotel IDs`);
  return hotelIds.slice(0, 50); // Limit to 50 hotels for API constraints
}

// Search hotel offers/prices
async function searchHotelOffers(
  accessToken: string,
  hotelIds: string[],
  checkIn: string,
  checkOut: string,
  adults: number,
  rooms: number
): Promise<any[]> {
  if (hotelIds.length === 0) return [];

  // Amadeus API limits hotel IDs per request
  const batchSize = 20;
  const allOffers: any[] = [];

  for (let i = 0; i < hotelIds.length; i += batchSize) {
    const batch = hotelIds.slice(i, i + batchSize);
    const url = new URL('https://test.api.amadeus.com/v3/shopping/hotel-offers');
    url.searchParams.set('hotelIds', batch.join(','));
    url.searchParams.set('checkInDate', checkIn);
    url.searchParams.set('checkOutDate', checkOut);
    url.searchParams.set('adults', adults.toString());
    url.searchParams.set('roomQuantity', rooms.toString());
    url.searchParams.set('currency', 'EUR');
    url.searchParams.set('bestRateOnly', 'true');

    console.log(`Searching offers for batch ${i / batchSize + 1}:`, url.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Hotel offers error:', response.status, errorText);
        continue;
      }

      const data = await response.json();
      if (data.data) {
        allOffers.push(...data.data);
      }
    } catch (err) {
      console.error('Batch search error:', err);
    }
  }

  return allOffers;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AMADEUS_API_KEY = Deno.env.get('AMADEUS_API_KEY');
    const AMADEUS_API_SECRET = Deno.env.get('AMADEUS_API_SECRET');

    if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
      console.error('Missing Amadeus API credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'API credentials not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const { destination, checkIn, checkOut, adults, children, childrenAges, rooms }: HotelSearchRequest = await req.json();

    console.log('Amadeus search request:', { destination, checkIn, checkOut, adults, children, rooms });

    // Get destination config
    const destKey = destination.toLowerCase();
    const config = destinationConfig[destKey];

    if (!config) {
      return new Response(
        JSON.stringify({ success: false, error: `Unknown destination: ${destination}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OAuth access token
    console.log('Getting Amadeus access token...');
    const accessToken = await getAccessToken(AMADEUS_API_KEY, AMADEUS_API_SECRET);
    console.log('Access token obtained');

    // Get hotel IDs by location
    console.log(`Searching hotels near ${destination} (${config.latitude}, ${config.longitude})`);
    const hotelIds = await getHotelsByLocation(
      accessToken,
      config.latitude,
      config.longitude,
      config.radius
    );

    if (hotelIds.length === 0) {
      return new Response(
        JSON.stringify({ success: true, hotels: [], message: 'No hotels found in this location' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search for hotel offers
    const totalGuests = adults + (children || 0);
    const offers = await searchHotelOffers(
      accessToken,
      hotelIds,
      checkIn,
      checkOut,
      totalGuests,
      rooms
    );

    console.log(`Found ${offers.length} hotel offers`);

    // EUR to ZAR conversion rate
    const EUR_TO_ZAR = 19.5;
    const MARKUP = 1.05; // 5% markup

    // Process and format hotels
    const hotels = offers.map((offer: any) => {
      const hotel = offer.hotel;
      const bestOffer = offer.offers?.[0];
      
      if (!bestOffer) return null;

      const priceEUR = parseFloat(bestOffer.price?.total || '0');
      const priceZAR = priceEUR * EUR_TO_ZAR * MARKUP;

      return {
        code: hotel.hotelId,
        name: hotel.name || 'Unknown Hotel',
        stars: hotel.rating ? parseInt(hotel.rating) : 3,
        image: null, // Amadeus doesn't provide images in this endpoint
        address: hotel.address?.lines?.join(', ') || hotel.cityCode || '',
        minRate: Math.round(priceZAR),
        currency: 'ZAR',
        rooms: bestOffer ? [{
          code: bestOffer.id,
          name: bestOffer.room?.description?.text || 'Standard Room',
          rates: [{
            rateKey: bestOffer.id,
            net: Math.round(priceZAR),
            boardCode: bestOffer.boardType || 'RO',
            boardName: bestOffer.boardType === 'BREAKFAST' ? 'Bed & Breakfast' : 'Room Only',
          }],
        }] : [],
      };
    }).filter(Boolean);

    // Sort by price
    hotels.sort((a: any, b: any) => a.minRate - b.minRate);

    console.log(`Returning ${hotels.length} processed hotels`);

    return new Response(
      JSON.stringify({ success: true, hotels }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Amadeus search error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

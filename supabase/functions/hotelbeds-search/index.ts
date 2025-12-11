import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/node/crypto.ts";

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

// Map destinations to Hotelbeds destination codes
const destinationCodes: Record<string, string> = {
  'harties': 'HLA',
  'magalies': 'HLA',
  'sun-city': 'SUN',
  'durban': 'DUR',
  'cape-town': 'CPT',
  'mpumalanga': 'MQP',
  'drakensberg': 'PMB',
  'garden-route': 'GRJ',
  'johannesburg': 'JNB',
  'pretoria': 'PRY',
  'umhlanga': 'DUR',
  'knysna': 'GRJ',
  'vaal-river': 'JNB',
  'bela-bela': 'PRY',
};

// Fallback coordinates for destinations
const destinationCoordinates: Record<string, { latitude: number; longitude: number }> = {
  'harties': { latitude: -25.7461, longitude: 27.8711 },
  'magalies': { latitude: -25.8333, longitude: 27.5333 },
  'sun-city': { latitude: -25.3356, longitude: 27.0928 },
  'durban': { latitude: -29.8587, longitude: 31.0218 },
  'cape-town': { latitude: -33.9249, longitude: 18.4241 },
  'mpumalanga': { latitude: -25.4753, longitude: 30.9694 },
  'drakensberg': { latitude: -29.4500, longitude: 29.4500 },
  'garden-route': { latitude: -33.9600, longitude: 22.4600 },
  'johannesburg': { latitude: -26.2041, longitude: 28.0473 },
  'pretoria': { latitude: -25.7479, longitude: 28.2293 },
  'umhlanga': { latitude: -29.7300, longitude: 31.0800 },
  'knysna': { latitude: -34.0356, longitude: 23.0488 },
  'vaal-river': { latitude: -26.8700, longitude: 27.9800 },
  'bela-bela': { latitude: -24.8850, longitude: 28.2870 },
};

function generateSignature(apiKey: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = apiKey + secret + timestamp;
  const hash = createHash('sha256');
  hash.update(signatureString);
  return hash.digest('hex') as string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('HOTELBEDS_API_KEY');
    const apiSecret = Deno.env.get('HOTELBEDS_API_SECRET');

    if (!apiKey || !apiSecret) {
      console.error('Hotelbeds API credentials not configured');
      return new Response(JSON.stringify({
        success: false,
        hotels: [],
        error: 'API credentials not configured. Please contact support.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { destination, checkIn, checkOut, adults, children, childrenAges, rooms }: HotelSearchRequest = await req.json();

    console.log('Search request:', { destination, checkIn, checkOut, adults, children, rooms });

    const signature = generateSignature(apiKey, apiSecret);
    const coords = destinationCoordinates[destination] || destinationCoordinates['johannesburg'];

    // Build occupancy array
    const occupancies = [];
    for (let i = 0; i < rooms; i++) {
      const roomOccupancy: any = {
        rooms: 1,
        adults: Math.ceil(adults / rooms),
        children: children > 0 ? Math.ceil(children / rooms) : 0,
      };
      
      if (children > 0 && childrenAges && childrenAges.length > 0) {
        const childrenPerRoom = Math.ceil(childrenAges.length / rooms);
        const startIdx = i * childrenPerRoom;
        const endIdx = Math.min(startIdx + childrenPerRoom, childrenAges.length);
        roomOccupancy.paxes = childrenAges.slice(startIdx, endIdx).map(age => ({
          type: 'CH',
          age: age
        }));
      }
      
      occupancies.push(roomOccupancy);
    }

    // Hotelbeds availability request
    const searchPayload = {
      stay: {
        checkIn: checkIn,
        checkOut: checkOut,
      },
      occupancies: occupancies.length > 0 ? occupancies : [{ rooms: 1, adults: adults, children: children }],
      geolocation: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: 50,
        unit: 'km'
      },
      filter: {
        maxHotels: 50,
        maxRooms: 5,
      },
    };

    console.log('Hotelbeds request payload:', JSON.stringify(searchPayload));

    // Test environment (production requires upgraded credentials from Hotelbeds)
    const response = await fetch('https://api.test.hotelbeds.com/hotel-api/1.0/hotels', {
      method: 'POST',
      headers: {
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchPayload),
    });

    const responseText = await response.text();
    console.log('Hotelbeds response status:', response.status);

    if (!response.ok) {
      console.error('Hotelbeds API error:', responseText);
      return new Response(JSON.stringify({
        success: false,
        hotels: [],
        error: 'Hotel search unavailable. Please try again later or contact us directly.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);
    
    if (!data.hotels || !data.hotels.hotels || data.hotels.hotels.length === 0) {
      console.log('No hotels found from Hotelbeds API');
      return new Response(JSON.stringify({
        success: true,
        hotels: [],
        message: 'No hotels available for this destination and dates. Please try different dates or contact us.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // EUR to ZAR conversion rate (approximate - in production use live rates)
    const EUR_TO_ZAR = 19.5;
    
    // Process hotels - flat list, no categories
    const processedHotels = data.hotels.hotels.map((hotel: any) => {
      const minRateEUR = hotel.minRate ? parseFloat(hotel.minRate) : 0;
      const stars = hotel.categoryCode ? parseFloat(hotel.categoryCode.replace('EST', '').replace('*', '')) : 3;
      
      // Convert EUR to ZAR and apply 5% markup
      const minRateZAR = minRateEUR * EUR_TO_ZAR * 1.05;
      
      return {
        code: hotel.code,
        name: hotel.name,
        stars: stars,
        image: hotel.images && hotel.images.length > 0 
          ? `https://photos.hotelbeds.com/giata/medium/${hotel.images[0].path}`
          : null,
        address: hotel.address?.content || '',
        minRate: Math.round(minRateZAR), // Rounded ZAR amount
        currency: 'ZAR',
        rooms: hotel.rooms?.map((room: any) => ({
          code: room.code,
          name: room.name,
          rates: room.rates?.map((rate: any) => ({
            rateKey: rate.rateKey,
            net: Math.round(parseFloat(rate.net) * EUR_TO_ZAR * 1.05),
            boardCode: rate.boardCode,
            boardName: rate.boardName,
            cancellationPolicies: rate.cancellationPolicies,
          }))
        })) || [],
        reviews: hotel.reviews || [],
      };
    });

    // Sort by price (cheapest first)
    processedHotels.sort((a: any, b: any) => a.minRate - b.minRate);

    console.log(`Found ${processedHotels.length} hotels from Hotelbeds`);

    return new Response(JSON.stringify({
      success: true,
      hotels: processedHotels,
      total: processedHotels.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hotelbeds-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      hotels: [],
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

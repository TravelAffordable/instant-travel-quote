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
  'harties': 'HLA', // Hartbeespoort area
  'magalies': 'HLA', // Magaliesberg area (same region)
  'sun-city': 'SUN', // Sun City
  'durban': 'DUR', // Durban
  'cape-town': 'CPT', // Cape Town
  'mpumalanga': 'MQP', // Mpumalanga/Kruger area
  'drakensberg': 'PMB', // Drakensberg/Pietermaritzburg area
  'garden-route': 'GRJ', // Garden Route/George
  'johannesburg': 'JNB', // Johannesburg
  'pretoria': 'PRY', // Pretoria
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
};

function generateSignature(apiKey: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = apiKey + secret + timestamp;
  const hash = createHash('sha256');
  hash.update(signatureString);
  return hash.digest('hex') as string;
}

function categorizeHotelByStars(stars: number, minRate: number): 'budget' | 'affordable' | 'premium' {
  if (stars >= 4.5 || minRate >= 2000) return 'premium';
  if (stars >= 3.5 || minRate >= 1000) return 'affordable';
  return 'budget';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('HOTELBEDS_API_KEY');
    const apiSecret = Deno.env.get('HOTELBEDS_API_SECRET');

    if (!apiKey || !apiSecret) {
      throw new Error('Hotelbeds API credentials not configured');
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
        maxHotels: 30,
        maxRooms: 5,
      },
    };

    console.log('Hotelbeds request payload:', JSON.stringify(searchPayload));

    // Production environment
    const response = await fetch('https://api.hotelbeds.com/hotel-api/1.0/hotels', {
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
      
      // Return mock data for development/testing when API fails
      return new Response(JSON.stringify({
        success: true,
        hotels: generateMockHotels(destination, checkIn, checkOut, adults, rooms),
        source: 'mock',
        message: 'Using sample data - live API unavailable'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = JSON.parse(responseText);
    
    if (!data.hotels || !data.hotels.hotels || data.hotels.hotels.length === 0) {
      console.log('No hotels found, returning mock data');
      return new Response(JSON.stringify({
        success: true,
        hotels: generateMockHotels(destination, checkIn, checkOut, adults, rooms),
        source: 'mock',
        message: 'No live availability - showing sample options'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process and categorize hotels
    const processedHotels = data.hotels.hotels.map((hotel: any) => {
      const minRate = hotel.minRate ? parseFloat(hotel.minRate) : 0;
      const stars = hotel.categoryCode ? parseFloat(hotel.categoryCode.replace('EST', '').replace('*', '')) : 3;
      const category = categorizeHotelByStars(stars, minRate);
      
      // Apply 5% markup
      const markedUpRate = minRate * 1.05;
      
      return {
        code: hotel.code,
        name: hotel.name,
        category: category,
        stars: stars,
        image: hotel.images && hotel.images.length > 0 
          ? `https://photos.hotelbeds.com/giata/medium/${hotel.images[0].path}`
          : null,
        address: hotel.address?.content || '',
        minRate: markedUpRate,
        currency: hotel.currency || 'ZAR',
        rooms: hotel.rooms?.map((room: any) => ({
          code: room.code,
          name: room.name,
          rates: room.rates?.map((rate: any) => ({
            rateKey: rate.rateKey,
            net: parseFloat(rate.net) * 1.05,
            boardCode: rate.boardCode,
            boardName: rate.boardName,
            cancellationPolicies: rate.cancellationPolicies,
          }))
        })) || [],
        reviews: hotel.reviews || [],
      };
    });

    // Group by category
    const categorizedHotels = {
      budget: processedHotels.filter((h: any) => h.category === 'budget').slice(0, 4),
      affordable: processedHotels.filter((h: any) => h.category === 'affordable').slice(0, 4),
      premium: processedHotels.filter((h: any) => h.category === 'premium').slice(0, 4),
    };

    return new Response(JSON.stringify({
      success: true,
      hotels: categorizedHotels,
      source: 'live',
      total: processedHotels.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in hotelbeds-search:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Mock data generator for when API is unavailable
function generateMockHotels(destination: string, checkIn: string, checkOut: string, adults: number, rooms: number) {
  const destName = destination.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    budget: [
      {
        code: `${destination}-budget-1`,
        name: `${destName} Budget Inn`,
        category: 'budget',
        stars: 2.5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        address: `${destName} Central`,
        minRate: 350 * nights * rooms,
        currency: 'ZAR',
      },
      {
        code: `${destination}-budget-2`,
        name: `${destName} Traveller's Rest`,
        category: 'budget',
        stars: 2.5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        address: `${destName} Downtown`,
        minRate: 450 * nights * rooms,
        currency: 'ZAR',
      },
    ],
    affordable: [
      {
        code: `${destination}-affordable-1`,
        name: `${destName} Comfort Hotel`,
        category: 'affordable',
        stars: 3.5,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        address: `${destName} Main Road`,
        minRate: 750 * nights * rooms,
        currency: 'ZAR',
      },
      {
        code: `${destination}-affordable-2`,
        name: `${destName} Garden Suites`,
        category: 'affordable',
        stars: 3.5,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        address: `${destName} Gardens`,
        minRate: 850 * nights * rooms,
        currency: 'ZAR',
      },
    ],
    premium: [
      {
        code: `${destination}-premium-1`,
        name: `${destName} Luxury Resort & Spa`,
        category: 'premium',
        stars: 4.5,
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
        address: `${destName} Waterfront`,
        minRate: 1200 * nights * rooms,
        currency: 'ZAR',
      },
      {
        code: `${destination}-premium-2`,
        name: `${destName} Grand Hotel`,
        category: 'premium',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
        address: `${destName} Premium District`,
        minRate: 1500 * nights * rooms,
        currency: 'ZAR',
      },
    ],
  };
}

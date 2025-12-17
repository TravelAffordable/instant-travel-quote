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
  bookingType?: 'accommodation-only' | 'with-activities';
  filterBreakfast?: boolean;
  filterPool?: boolean;
  filterCheapest?: boolean;
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

// Destination coordinates and radius settings
const destinationConfig: Record<string, { latitude: number; longitude: number; radius: number }> = {
  // Hartbeespoort - centered on Harties Aerial Cableway, 20km radius
  'harties': { latitude: -25.7479, longitude: 27.8713, radius: 20 },
  'magalies': { latitude: -25.8333, longitude: 27.5333, radius: 20 },
  // Sun City - 30km radius
  'sun-city': { latitude: -25.3356, longitude: 27.0928, radius: 30 },
  // Durban - centered on Southern Sun Elangeni Maharani Hotel, 7km radius
  'durban': { latitude: -29.8512, longitude: 31.0382, radius: 7 },
  'cape-town': { latitude: -33.9249, longitude: 18.4241, radius: 15 },
  'mpumalanga': { latitude: -25.4753, longitude: 30.9694, radius: 30 },
  'drakensberg': { latitude: -29.4500, longitude: 29.4500, radius: 30 },
  'garden-route': { latitude: -33.9600, longitude: 22.4600, radius: 30 },
  'johannesburg': { latitude: -26.2041, longitude: 28.0473, radius: 20 },
  'pretoria': { latitude: -25.7479, longitude: 28.2293, radius: 20 },
  // Umhlanga - centered on Radisson Blu Umhlanga, 10km radius
  'umhlanga': { latitude: -29.7270, longitude: 31.0870, radius: 10 },
  'knysna': { latitude: -34.0356, longitude: 23.0488, radius: 20 },
  // Vaal - centered on Emerald Resort Casino
  'vaal-river': { latitude: -26.6833, longitude: 27.8667, radius: 15 },
  // Dubai - centered on Burj Khalifa area, 20km radius
  'dubai': { latitude: 25.1972, longitude: 55.2744, radius: 20 },
  // Phuket - centered on Patong Beach area, 30km radius
  'phuket': { latitude: 7.8804, longitude: 98.3923, radius: 30 },
  // Thailand (general) - centered on Bangkok, 30km radius
  'thailand': { latitude: 13.7563, longitude: 100.5018, radius: 30 },
  'bela-bela': { latitude: -24.8850, longitude: 28.2870, radius: 15 },
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

    const { destination, checkIn, checkOut, adults, children, childrenAges, rooms, bookingType, filterBreakfast, filterPool, filterCheapest }: HotelSearchRequest = await req.json();

    console.log('Search request:', { destination, checkIn, checkOut, adults, children, rooms, bookingType, filterBreakfast, filterPool, filterCheapest });

    const signature = generateSignature(apiKey, apiSecret);
    const config = destinationConfig[destination] || destinationConfig['johannesburg'];
    const coords = { latitude: config.latitude, longitude: config.longitude };
    
    // Use larger radius for accommodation-only searches (full destination)
    // Use 30km radius for with-activities (near attractions)
    const searchRadius = bookingType === 'accommodation-only' ? Math.max(config.radius, 50) : 30;

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

    // Build filter object
    const filter: any = {
      maxHotels: 50,
      maxRooms: 5,
    };

    // Add board filter for breakfast (BB = Bed & Breakfast, HB = Half Board, FB = Full Board, AI = All Inclusive)
    if (filterBreakfast) {
      filter.boards = {
        included: true,
        board: ['BB', 'HB', 'FB', 'AI']
      };
    }

    // Hotelbeds availability request
    const searchPayload: any = {
      stay: {
        checkIn: checkIn,
        checkOut: checkOut,
      },
      occupancies: occupancies.length > 0 ? occupancies : [{ rooms: 1, adults: adults, children: children }],
      geolocation: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius: searchRadius,
        unit: 'km'
      },
      filter: filter,
    };

    console.log('Hotelbeds request payload:', JSON.stringify(searchPayload));
    console.log(`Searching ${destination} with radius ${searchRadius}km from coords ${coords.latitude}, ${coords.longitude}`);

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
    let processedHotels = data.hotels.hotels.map((hotel: any) => {
      const minRateEUR = hotel.minRate ? parseFloat(hotel.minRate) : 0;
      const stars = hotel.categoryCode ? parseFloat(hotel.categoryCode.replace('EST', '').replace('*', '')) : 3;
      
      // Convert EUR to ZAR and apply 5% markup
      const minRateZAR = minRateEUR * EUR_TO_ZAR * 1.05;
      
      // Check for breakfast in available rooms
      const hasBreakfast = hotel.rooms?.some((room: any) => 
        room.rates?.some((rate: any) => ['BB', 'HB', 'FB', 'AI'].includes(rate.boardCode))
      ) || false;
      
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
        hasBreakfast: hasBreakfast,
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

    // Apply client-side filtering for breakfast if requested
    if (filterBreakfast) {
      processedHotels = processedHotels.filter((h: any) => h.hasBreakfast);
    }

    // Sort based on preference
    if (filterCheapest !== false) {
      // Default: sort by price (cheapest first)
      processedHotels.sort((a: any, b: any) => a.minRate - b.minRate);
    } else if (filterBreakfast) {
      // Sort hotels with breakfast first, then by price
      processedHotels.sort((a: any, b: any) => {
        if (a.hasBreakfast && !b.hasBreakfast) return -1;
        if (!a.hasBreakfast && b.hasBreakfast) return 1;
        return a.minRate - b.minRate;
      });
    }

    console.log(`Found ${processedHotels.length} hotels from Hotelbeds (after filters)`);

    return new Response(JSON.stringify({
      success: true,
      hotels: processedHotels,
      total: processedHotels.length,
      filters: { filterBreakfast, filterPool, filterCheapest }
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

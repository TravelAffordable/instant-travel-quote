import { useState, useCallback } from 'react';
import { hotels as staticHotels, type Hotel } from '@/data/travelData';
import { supabase } from '@/integrations/supabase/client';

export interface RMSHotel {
  code: string;
  name: string;
  starRating: number | null;
  tier: 'budget' | 'affordable' | 'premium';
  includesBreakfast: boolean;
  minRate: number;
  totalRate: number;
  roomTypeId: string;
  roomTypeName: string;
  capacity: '2_sleeper' | '4_sleeper';
  areaName: string;
  destination: string;
  images?: string[];
  isCachedRate?: boolean;
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  areaName?: string;
}

const destinationMap: Record<string, string> = {
  harties: 'harties',
  magalies: 'magalies',
  'sun-city': 'sun-city',
  durban: 'durban',
  umhlanga: 'umhlanga',
  'cape-town': 'cape-town',
  mpumalanga: 'mpumalanga',
  vaal: 'vaal-river',
  'vaal-river': 'vaal-river',
  'bela-bela': 'bela-bela',
  pretoria: 'pretoria',
  knysna: 'knysna',
};

const destinationLabelMap: Record<string, string> = {
  harties: 'Harties',
  magalies: 'Magalies',
  'sun-city': 'Sun City',
  durban: 'Durban',
  umhlanga: 'Umhlanga',
  'cape-town': 'Cape Town',
  mpumalanga: 'Mpumalanga',
  'vaal-river': 'Vaal River',
  'bela-bela': 'Bela Bela',
  pretoria: 'Pretoria',
  knysna: 'Knysna',
};

const tierMap: Record<Hotel['type'], RMSHotel['tier']> = {
  'very-affordable': 'budget',
  affordable: 'affordable',
  premium: 'premium',
};

function matchesCapacity(hotel: Hotel, totalGuests: number, hasKids: boolean): boolean {
  if (hotel.destination === 'durban' && hotel.type === 'very-affordable' && hotel.capacity) {
    return totalGuests > 2 ? hotel.capacity >= 4 : hotel.capacity === 2;
  }

  if (hotel.destination === 'pretoria' && hotel.type === 'affordable' && hotel.capacity) {
    return totalGuests > 2 ? hotel.capacity >= 4 : hotel.capacity === 2;
  }

  if (hotel.destination === 'durban' && hotel.type === 'premium' && hotel.capacity) {
    if (totalGuests > 2) {
      return hasKids
        ? hotel.capacity >= 4 && hotel.forFamilyWithKids === true
        : hotel.capacity >= 4 && hotel.forAdultsOnly === true;
    }

    return hotel.capacity === 2;
  }

  if (hotel.destination === 'pretoria' && hotel.type === 'premium' && hotel.capacity) {
    return totalGuests > 2 ? hotel.capacity >= 4 : hotel.capacity === 2;
  }

  return true;
}

function matchesAreaFilter(hotel: Hotel, params: SearchParams): boolean {
  if (!params.areaName) return true;

  if (params.destination === 'umhlanga') {
    return hotel.destination === 'umhlanga';
  }

  if (params.destination === 'durban') {
    return hotel.destination === 'durban';
  }

  if (params.destination === 'mpumalanga' && params.areaName === 'Graskop') {
    return !hotel.name.toLowerCase().includes('hazyview');
  }

  return true;
}

function getRoomCapacity(hotel: Hotel): RMSHotel['capacity'] {
  return hotel.capacity && hotel.capacity >= 4 ? '4_sleeper' : '2_sleeper';
}

export function useRMSHotels() {
  const [hotels, setHotels] = useState<RMSHotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHotels = useCallback(async (params: SearchParams): Promise<RMSHotel[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const mappedDestination = destinationMap[params.destination];

      if (!mappedDestination) {
        setHotels([]);
        return [];
      }

      const checkInDate = new Date(params.checkIn);
      const checkOutDate = new Date(params.checkOut);
      const nights = Math.max(
        1,
        Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const totalGuests = params.adults + params.children;
      const hasKids = params.children > 0;

      const rmsHotels = staticHotels
        .filter((hotel) => hotel.destination === mappedDestination)
        .filter((hotel) => matchesAreaFilter(hotel, params))
        .filter((hotel) => matchesCapacity(hotel, totalGuests, hasKids))
        .map((hotel) => ({
          code: hotel.id,
          name: hotel.name,
          starRating: Math.round(hotel.rating),
          tier: tierMap[hotel.type],
          includesBreakfast: hotel.includesBreakfast ?? false,
          minRate: Math.round(hotel.pricePerNight),
          totalRate: Math.round(hotel.pricePerNight * nights),
          roomTypeId: hotel.id,
          roomTypeName: hotel.roomType || 'Standard Room',
          capacity: getRoomCapacity(hotel),
          areaName: params.areaName || destinationLabelMap[mappedDestination] || mappedDestination,
          destination: mappedDestination,
          images: hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.image],
        }))
        .sort((a, b) => {
          const tierOrder = { budget: 1, affordable: 2, premium: 3 };
          if (tierOrder[a.tier] !== tierOrder[b.tier]) {
            return tierOrder[a.tier] - tierOrder[b.tier];
          }

          return a.minRate - b.minRate;
        });

      // Fetch cached live rates for budget/affordable tiers
      try {
        const capacityFilter = totalGuests > 2 ? '4_sleeper' : '2_sleeper';
        const { data: cachedRates } = await supabase
          .from('cached_hotel_rates')
          .select('hotel_alias, real_hotel_name, crawled_rate, tier, capacity, room_type, includes_breakfast, crawled_at')
          .eq('destination', mappedDestination)
          .eq('capacity', capacityFilter)
          .eq('is_available', true);

        if (cachedRates && cachedRates.length > 0) {
          // Build cached hotel entries that replace static budget/affordable hotels
          const cachedHotels: RMSHotel[] = cachedRates.map((cr, idx) => ({
            code: `cached-${cr.tier}-${capacityFilter}-${idx}`,
            name: cr.hotel_alias,
            starRating: null,
            tier: cr.tier as 'budget' | 'affordable',
            includesBreakfast: cr.includes_breakfast ?? false,
            minRate: Math.round(Number(cr.crawled_rate)),
            totalRate: Math.round(Number(cr.crawled_rate) * nights),
            roomTypeId: `cached-${cr.tier}-${capacityFilter}-${idx}`,
            roomTypeName: cr.room_type || 'Standard Room',
            capacity: cr.capacity as '2_sleeper' | '4_sleeper',
            areaName: params.areaName || destinationLabelMap[mappedDestination] || mappedDestination,
            destination: mappedDestination,
            images: [],
            isCachedRate: true,
          }));

          // Keep only premium from static, replace budget/affordable with cached
          const staticPremium = rmsHotels.filter(h => h.tier === 'premium');
          const merged = [...cachedHotels, ...staticPremium].sort((a, b) => {
            const tierOrder = { budget: 1, affordable: 2, premium: 3 };
            if (tierOrder[a.tier] !== tierOrder[b.tier]) {
              return tierOrder[a.tier] - tierOrder[b.tier];
            }
            return a.minRate - b.minRate;
          });

          setHotels(merged);
          return merged;
        }
      } catch (cacheErr) {
        console.warn('Failed to fetch cached rates, using static data:', cacheErr);
      }

      setHotels(rmsHotels);
      return rmsHotels;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch hotels';
      setError(message);
      setHotels([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHotels = useCallback(() => {
    setHotels([]);
    setError(null);
  }, []);

  return {
    hotels,
    isLoading,
    error,
    searchHotels,
    clearHotels,
  };
}

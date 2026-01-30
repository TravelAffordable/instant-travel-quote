import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RMSHotel {
  code: string;
  name: string;
  starRating: number | null;
  tier: 'budget' | 'affordable' | 'premium';
  includesBreakfast: boolean;
  minRate: number; // per night for the room
  totalRate: number; // for entire stay
  roomTypeId: string;
  roomTypeName: string;
  capacity: '2_sleeper' | '4_sleeper';
  areaName: string;
  destination: string;
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  areaName?: string; // Optional filter by area name (e.g., 'Graskop', 'Hazyview')
}

import type { Database } from '@/integrations/supabase/types';

type DestinationCode = Database['public']['Enums']['destination_code'];

// Map frontend destination codes to database destination codes
const destinationMap: Record<string, DestinationCode> = {
  'harties': 'hartbeespoort',
  'magalies': 'magaliesburg',
  'sun-city': 'sun_city',
  'durban': 'durban',
  'cape-town': 'cape_town',
  'mpumalanga': 'mpumalanga',
  'vaal': 'vaal',
  // UI uses `vaal-river` as the destination id; backend uses the `vaal` destination code.
  'vaal-river': 'vaal',
};

export function useRMSHotels() {
  const [hotels, setHotels] = useState<RMSHotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHotels = useCallback(async (params: SearchParams): Promise<RMSHotel[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const dbDestination = destinationMap[params.destination];
      
      if (!dbDestination) {
        setHotels([]);
        return [];
      }
      
      // Determine required capacity based on total guests
      const totalGuests = params.adults + params.children;
      const guestsPerRoom = Math.ceil(totalGuests / params.rooms);
      const requiredCapacity = guestsPerRoom <= 2 ? '2_sleeper' : '4_sleeper';

      // Calculate nights
      const checkInDate = new Date(params.checkIn);
      const checkOutDate = new Date(params.checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      // Build query for hotels - optionally filter by area name
      let hotelsQuery = supabase
        .from('hotels')
        .select(`
          id,
          name,
          star_rating,
          tier,
          includes_breakfast,
          areas!inner(destination, name)
        `)
        .eq('is_active', true)
        .eq('areas.destination', dbDestination);

      // Apply area filter if specified (e.g., 'Graskop' for MP1 In Style package)
      if (params.areaName) {
        hotelsQuery = hotelsQuery.eq('areas.name', params.areaName);
      }

      const { data: hotelsData, error: hotelsError } = await hotelsQuery;

      if (hotelsError) {
        throw new Error(hotelsError.message);
      }

      if (!hotelsData || hotelsData.length === 0) {
        setHotels([]);
        return [];
      }

      // Get room types for these hotels with the required capacity
      const hotelIds = hotelsData.map(h => h.id);
      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('room_types')
        .select('id, hotel_id, name, capacity')
        .in('hotel_id', hotelIds)
        .eq('capacity', requiredCapacity)
        .eq('is_active', true);

      if (roomTypesError) {
        throw new Error(roomTypesError.message);
      }

      if (!roomTypesData || roomTypesData.length === 0) {
        // No room types found for required capacity - try the other capacity
        const altCapacity = requiredCapacity === '2_sleeper' ? '4_sleeper' : '2_sleeper';
        const { data: altRoomTypes, error: altError } = await supabase
          .from('room_types')
          .select('id, hotel_id, name, capacity')
          .in('hotel_id', hotelIds)
          .eq('capacity', altCapacity)
          .eq('is_active', true);

        if (altError || !altRoomTypes || altRoomTypes.length === 0) {
          setHotels([]);
          return [];
        }

        // Use alt room types
        Object.assign(roomTypesData, altRoomTypes);
      }

      // Get rates for these room types
      const roomTypeIds = roomTypesData.map(rt => rt.id);
      const { data: ratesData, error: ratesError } = await supabase
        .from('room_rates')
        .select('room_type_id, base_rate_weekday, base_rate_weekend')
        .in('room_type_id', roomTypeIds)
        .eq('is_active', true);

      if (ratesError) {
        throw new Error(ratesError.message);
      }

      // Get seasonal multiplier for the check-in date
      const { data: seasonData } = await supabase
        .from('seasonal_periods')
        .select('multiplier')
        .eq('is_active', true)
        .lte('start_date', params.checkIn)
        .gte('end_date', params.checkIn)
        .order('multiplier', { ascending: false })
        .limit(1);

      const seasonalMultiplier = seasonData?.[0]?.multiplier || 1;

      // Build hotel objects with calculated rates
      const rmsHotels: RMSHotel[] = [];

      for (const hotel of hotelsData) {
        const roomType = roomTypesData.find(rt => rt.hotel_id === hotel.id);
        if (!roomType) continue;

        const rate = ratesData?.find(r => r.room_type_id === roomType.id);
        if (!rate) continue;

        // Calculate total rate for the stay
        let totalRate = 0;
        const currentDate = new Date(params.checkIn);
        
        while (currentDate < checkOutDate) {
          const dayOfWeek = currentDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat, Sun
          const baseRate = isWeekend ? rate.base_rate_weekend : rate.base_rate_weekday;
          totalRate += Number(baseRate) * seasonalMultiplier;
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate per-night average
        const minRate = Math.round(totalRate / nights);

        const areas = hotel.areas as { destination: string; name: string };

        rmsHotels.push({
          code: hotel.id,
          name: hotel.name,
          starRating: hotel.star_rating,
          tier: hotel.tier as 'budget' | 'affordable' | 'premium',
          includesBreakfast: hotel.includes_breakfast,
          minRate,
          totalRate: Math.round(totalRate),
          roomTypeId: roomType.id,
          roomTypeName: roomType.name,
          capacity: roomType.capacity as '2_sleeper' | '4_sleeper',
          areaName: areas.name,
          destination: areas.destination,
        });
      }

      // Sort by tier then by rate
      const tierOrder = { budget: 1, affordable: 2, premium: 3 };
      rmsHotels.sort((a, b) => {
        if (tierOrder[a.tier] !== tierOrder[b.tier]) {
          return tierOrder[a.tier] - tierOrder[b.tier];
        }
        return a.minRate - b.minRate;
      });

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

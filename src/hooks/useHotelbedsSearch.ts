import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveHotel {
  code: string;
  name: string;
  stars: number;
  image: string | null;
  address: string;
  minRate: number;
  currency: string;
  rooms?: Array<{
    code: string;
    name: string;
    rates?: Array<{
      rateKey: string;
      net: number;
      boardCode: string;
      boardName: string;
    }>;
  }>;
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges?: number[];
  rooms: number;
}

export function useHotelbedsSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<LiveHotel[]>([]);

  const searchHotels = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('hotelbeds-search', {
        body: params,
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to search hotels');
      }

      if (!data.success && data.error) {
        setError(data.error);
        setHotels([]);
        return [];
      }

      const hotelList = data.hotels || [];
      setHotels(hotelList);
      return hotelList as LiveHotel[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Hotel search error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearHotels = () => {
    setHotels([]);
    setError(null);
  };

  return {
    searchHotels,
    clearHotels,
    hotels,
    isLoading,
    error,
  };
}

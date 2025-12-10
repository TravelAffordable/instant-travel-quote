import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveHotel {
  code: string;
  name: string;
  category: 'budget' | 'affordable' | 'premium';
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

export interface LiveHotelsResult {
  budget: LiveHotel[];
  affordable: LiveHotel[];
  premium: LiveHotel[];
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
  const [hotels, setHotels] = useState<LiveHotelsResult | null>(null);
  const [source, setSource] = useState<'live' | 'mock' | null>(null);

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

      if (!data.success) {
        throw new Error(data.error || 'Hotel search failed');
      }

      setHotels(data.hotels);
      setSource(data.source);
      return data.hotels as LiveHotelsResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Hotel search error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearHotels = () => {
    setHotels(null);
    setSource(null);
    setError(null);
  };

  return {
    searchHotels,
    clearHotels,
    hotels,
    source,
    isLoading,
    error,
  };
}

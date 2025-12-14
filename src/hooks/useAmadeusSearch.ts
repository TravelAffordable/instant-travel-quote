import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { hotels as staticHotels } from '@/data/travelData';

export interface AmadeusHotel {
  code: string;
  name: string;
  stars: number;
  image: string | null;
  address: string;
  minRate: number;
  currency: string;
  isStaticFallback?: boolean;
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

// Convert static hotel data to AmadeusHotel format
function getStaticHotelsForDestination(destination: string, nights: number): AmadeusHotel[] {
  const normalizedDest = destination.toLowerCase().replace(/\s+/g, '-');
  
  const destinationHotels = staticHotels.filter(h => 
    h.destination === normalizedDest || 
    h.destination === destination.toLowerCase() ||
    h.destination.replace(/-/g, ' ') === destination.toLowerCase()
  );

  if (destinationHotels.length === 0) {
    // Try partial match for destinations like "cape-town" vs "cape town"
    const partialMatch = staticHotels.filter(h => 
      h.destination.includes(normalizedDest) || 
      normalizedDest.includes(h.destination)
    );
    if (partialMatch.length > 0) {
      return partialMatch.map(hotel => convertToAmadeusFormat(hotel, nights));
    }
    return [];
  }

  return destinationHotels.map(hotel => convertToAmadeusFormat(hotel, nights));
}

function convertToAmadeusFormat(hotel: typeof staticHotels[0], nights: number): AmadeusHotel {
  // Calculate total accommodation cost for the stay
  const totalAccommodation = hotel.pricePerNight * nights;
  
  return {
    code: hotel.id,
    name: hotel.name,
    stars: Math.round(hotel.rating),
    image: hotel.image,
    address: `${hotel.destination.charAt(0).toUpperCase() + hotel.destination.slice(1).replace(/-/g, ' ')}, South Africa`,
    minRate: totalAccommodation, // Already in ZAR
    currency: 'ZAR',
    isStaticFallback: true,
  };
}

export function useAmadeusSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<AmadeusHotel[]>([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const searchHotels = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setIsUsingFallback(false);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('amadeus-search', {
        body: params,
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to search hotels');
      }

      const hotelList = data?.hotels || [];

      // If Amadeus returns no results, use static fallback
      if (hotelList.length === 0) {
        console.log('Amadeus returned no results, using static hotel fallback for:', params.destination);
        
        // Calculate nights from check-in/check-out
        const checkIn = new Date(params.checkIn);
        const checkOut = new Date(params.checkOut);
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        
        const fallbackHotels = getStaticHotelsForDestination(params.destination, nights);
        
        if (fallbackHotels.length > 0) {
          setIsUsingFallback(true);
          setHotels(fallbackHotels);
          return fallbackHotels;
        } else {
          // No static hotels either
          setError('No hotels available for this destination');
          setHotels([]);
          return [];
        }
      }

      setHotels(hotelList);
      return hotelList as AmadeusHotel[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Amadeus search error:', err);
      
      // On API error, also try static fallback
      console.log('Amadeus API error, attempting static fallback for:', params.destination);
      
      const checkIn = new Date(params.checkIn);
      const checkOut = new Date(params.checkOut);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      const fallbackHotels = getStaticHotelsForDestination(params.destination, nights);
      
      if (fallbackHotels.length > 0) {
        setIsUsingFallback(true);
        setError(null);
        setHotels(fallbackHotels);
        return fallbackHotels;
      }
      
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearHotels = () => {
    setHotels([]);
    setError(null);
    setIsUsingFallback(false);
  };

  return {
    searchHotels,
    clearHotels,
    hotels,
    isLoading,
    error,
    isUsingFallback,
  };
}

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hand-picked "luxury stays" per destination, chosen by the site owner.
 * Stored in the backend so the same picks show for every visitor.
 */
export function useFeaturedHotels(destination: string) {
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!destination) return;
    const { data } = await supabase
      .from('featured_hotels')
      .select('hotel_name')
      .eq('destination', destination)
      .order('created_at', { ascending: true });
    setNames((data ?? []).map((r) => r.hotel_name));
    setLoading(false);
  }, [destination]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = useCallback(
    async (hotelName: string) => {
      const isPicked = names.includes(hotelName);
      // Optimistic update so the circle responds instantly
      setNames((prev) => (isPicked ? prev.filter((n) => n !== hotelName) : [...prev, hotelName]));

      if (isPicked) {
        await supabase
          .from('featured_hotels')
          .delete()
          .eq('destination', destination)
          .eq('hotel_name', hotelName);
      } else {
        await supabase
          .from('featured_hotels')
          .insert({ destination, hotel_name: hotelName });
      }
      void load();
    },
    [destination, names, load],
  );

  return { featuredNames: names, isFeatured: (n: string) => names.includes(n), toggle, loading };
}

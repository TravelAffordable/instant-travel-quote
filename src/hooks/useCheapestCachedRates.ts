import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Returns a map of destination => cheapest available budget 2-sleeper
 * nightly rate from the cached_hotel_rates table. Used to derive the
 * "From R___ pp" teaser shown on package cards.
 *
 * Only available (is_available = true) budget tier 2-sleeper rates are
 * considered, so the teaser always reflects real, live inventory.
 */
export function useCheapestCachedRates() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('cached_hotel_rates')
        .select('destination, crawled_rate')
        .eq('tier', 'budget')
        .eq('capacity', '2_sleeper')
        .eq('is_available', true);

      if (cancelled) return;

      if (error || !data) {
        setIsLoading(false);
        return;
      }

      const cheapest: Record<string, number> = {};
      for (const row of data) {
        const rate = Number(row.crawled_rate);
        if (!Number.isFinite(rate) || rate <= 0) continue;
        if (cheapest[row.destination] === undefined || rate < cheapest[row.destination]) {
          cheapest[row.destination] = rate;
        }
      }

      setRates(cheapest);
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { cheapestNightlyByDestination: rates, isLoading };
}

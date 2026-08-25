import type { AccommodationTier } from '@/components/common/TierSelector';

/**
 * Presentation-only labels for the approved premium design.
 * These do NOT replace the existing tier data structure — they are a display
 * mapping over `classifyHotels()` output.
 */
export type StayLabel = 'SMART STAY' | 'COMFORT' | 'INDULGE';

export const stayLabelFor = (tier: AccommodationTier): StayLabel => {
  switch (tier) {
    case 'budget':
    case 'standard':
      return 'SMART STAY';
    case 'mid-range':
      return 'COMFORT';
    default:
      return 'INDULGE';
  }
};

export const stayLabelClass: Record<StayLabel, string> = {
  'SMART STAY': 'bg-burgundy text-white',
  COMFORT: 'bg-burgundy-light text-white',
  INDULGE: 'bg-champagne text-burgundy-dark',
};

export const STAY_LABEL_ORDER: StayLabel[] = ['SMART STAY', 'COMFORT', 'INDULGE'];

/**
 * Presentation-only positioning bands. Splits the available stays into three
 * price terciles so the customer always sees a real comparison instead of a
 * single repeated label. No pricing or supplier logic is changed.
 */
export function classifyStayLabels(
  hotels: { id: string; pricePerNight: number }[],
): Map<string, StayLabel> {
  const map = new Map<string, StayLabel>();
  if (!hotels.length) return map;
  const prices = hotels.map((h) => h.pricePerNight).sort((a, b) => a - b);
  const at = (f: number) => prices[Math.min(prices.length - 1, Math.floor(prices.length * f))];
  const t1 = at(1 / 3);
  const t2 = at(2 / 3);
  for (const h of hotels) {
    map.set(
      h.id,
      h.pricePerNight <= t1 ? 'SMART STAY' : h.pricePerNight <= t2 ? 'COMFORT' : 'INDULGE',
    );
  }
  return map;
}

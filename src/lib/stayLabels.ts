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

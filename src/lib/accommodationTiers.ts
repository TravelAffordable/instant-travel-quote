import type { Hotel } from '@/data/travelData';
import type { AccommodationTier } from '@/components/common/TierSelector';

/**
 * Data-driven tier classification: hotels are grouped by their nightly rate
 * relative to the other hotels available in the same destination.
 * No supplier costs or margins are involved or exposed.
 */
export function classifyHotels(hotels: Hotel[]): Map<string, AccommodationTier> {
  const map = new Map<string, AccommodationTier>();
  if (!hotels.length) return map;

  const prices = hotels.map((h) => h.pricePerNight).sort((a, b) => a - b);
  const q = (p: number) => prices[Math.min(prices.length - 1, Math.floor(prices.length * p))];
  const q1 = q(0.25);
  const q2 = q(0.5);
  const q3 = q(0.75);

  for (const hotel of hotels) {
    let tier: AccommodationTier = 'standard';
    if (hotel.type === 'premium' || hotel.pricePerNight > q3) tier = 'luxury';
    else if (hotel.pricePerNight > q2) tier = 'mid-range';
    else if (hotel.pricePerNight <= q1) tier = 'budget';
    map.set(hotel.id, tier);
  }
  return map;
}

export const tierLabels: Record<AccommodationTier, string> = {
  budget: 'Budget',
  standard: 'Standard',
  'mid-range': 'Mid-range',
  luxury: 'Luxury',
};

export function mealBasis(hotel: Hotel): string {
  return hotel.includesBreakfast ? 'Bed & breakfast' : 'Breakfast optional extra';
}

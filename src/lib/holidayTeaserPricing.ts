import { getPackageFromPrice } from '@/data/packagePricing';
import type { Package } from '@/data/travelData';
import { getTourFromPrice, TOUR_FROM_PRICES } from '@/lib/packageTourPricing';

/** Advertising allowance only; never use this in final booking calculations. */
export const TEASER_ACCOMMODATION_TOTAL = 1400;
export const TEASER_SHARING_ADULTS = 2;

export function withTeaserAccommodation(packagePrice: number | null): number | null {
  return packagePrice === null ? null : packagePrice + TEASER_ACCOMMODATION_TOTAL / TEASER_SHARING_ADULTS;
}

export function getHolidayTeaserPrice(pkg: Package): number | null {
  const packagePrice = getTourFromPrice(pkg.name)
    ?? TOUR_FROM_PRICES[pkg.id.toUpperCase()]
    ?? getPackageFromPrice(pkg.id)
    ?? pkg.fromPriceOverride
    ?? null;
  return withTeaserAccommodation(packagePrice);
}
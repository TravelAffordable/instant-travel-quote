import type { Hotel } from '@/data/travelData';
import { getDurbanHotelStars } from '@/data/durbanHotelStars';
import { getUmhlangaHotelStars } from '@/data/umhlangaHotelStars';

/**
 * Stars are only shown where an official star grading was confirmed for the
 * property. Confirmed gradings are whole numbers (or come from the curated
 * Durban / Umhlanga grading lists). Anything else is treated as ungraded and
 * no stars are displayed.
 */
export function verifiedStars(hotel: Pick<Hotel, 'name' | 'rating' | 'destination'>): number | null {
  const curated = getDurbanHotelStars(hotel.name) ?? getUmhlangaHotelStars(hotel.name);
  if (curated != null) return curated;
  if (hotel.destination === 'durban' || hotel.destination === 'umhlanga') return null;
  const r = hotel.rating;
  return Number.isInteger(r) && r > 0 && r <= 5 ? r : null;
}

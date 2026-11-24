import { differenceInCalendarDays } from 'date-fns';
import { getHotelsByDestination, type Hotel, type Package } from '@/data/travelData';
import { calculatePackagePrice } from '@/data/packagePricing';
import { isGenericHotelName } from '@/data/durbanHotelStars';
import { getGoldenMileStayTotal } from '@/data/goldenMileRateCalendar';
import { getStayAvailability, isAvailabilityTracked } from '@/data/krugerAvailability';
import {
  bandedChildAges,
  childBandCounts,
  fromDateString,
  isTripComplete,
  type TripDetails,
} from '@/lib/tripDetails';

/**
 * Group price for a package: package price for the whole group + the cheapest
 * available stay for the whole stay. This follows the same rules as the booking
 * page (holidayPriceFor / hotelPrice / capacity matching / availability) so the
 * price on a package card matches what the guest sees after clicking through.
 *
 * It deliberately does NOT use the advertising-only teaser helper.
 */
export type GroupPrice =
  | {
      status: 'ok';
      total: number;
      hotel: Hotel;
      nights: number;
      rooms: number;
      /** Rooms to pre-select on the booking page so it opens on this same price. */
      requestedRooms: number;
      childPriceOnRequest: boolean;
    }
  | { status: 'unavailable' }
  | { status: 'unknown' };

export function groupGuestCount(trip: TripDetails): number {
  const { kids, teens } = childBandCounts(trip.childAges);
  // The booking page counts adults + children aged 3–17 (under-3s share a room).
  return trip.adults + kids + teens;
}

export function stayNights(trip: TripDetails): number {
  const checkIn = fromDateString(trip.checkIn);
  const checkOut = fromDateString(trip.checkOut);
  if (!checkIn || !checkOut) return 0;
  return Math.max(1, differenceInCalendarDays(checkOut, checkIn));
}

/** Rooms for one stay, exactly as the booking page works them out (1 room requested by default). */
export function roomsFor(totalGuests: number, capacity: number, requestedRooms = 1): number {
  return Math.max(requestedRooms, Math.ceil(totalGuests / Math.max(1, capacity)));
}

export function stayCost(
  hotelName: string,
  hotelPerNight: number,
  capacity: number,
  checkIn: Date | undefined,
  nights: number,
): number {
  return capacity > 2
    ? hotelPerNight * Math.max(1, nights)
    : getGoldenMileStayTotal(hotelName, checkIn, Math.max(1, nights), hotelPerNight);
}

export function getCheapestGroupPrice(
  pkg: Package,
  destinationId: string,
  trip: TripDetails,
  minRooms = 1,
): GroupPrice {
  if (!isTripComplete(trip)) return { status: 'unknown' };

  const pricing = calculatePackagePrice(pkg.id, {
    adults: trip.adults,
    childrenAges: bandedChildAges(trip.childAges),
  });
  // No package price on file for this package — leave its normal teaser in place.
  if (!pricing) return { status: 'unknown' };

  const checkIn = fromDateString(trip.checkIn);
  const nights = stayNights(trip);
  const totalGuests = groupGuestCount(trip);

  const hotels = getHotelsByDestination(destinationId).filter((h) => !isGenericHotelName(h.name));
  // No stays on file for this destination — it is arranged personally, so show no group price.
  if (hotels.length === 0) return { status: 'unknown' };

  // Fewest rooms first: try 1 room, and only if nothing fits the group (or is free) try 2, 3 ...
  for (let requestedRooms = Math.max(1, minRooms); requestedRooms <= Math.max(1, totalGuests); requestedRooms += 1) {
    const perRoomGuests = Math.max(1, Math.ceil(totalGuests / requestedRooms));
    const fitting = hotels.filter((h) => (h.capacity ?? 2) >= perRoomGuests);
    const exact = fitting.filter((h) => (h.capacity ?? 2) === perRoomGuests);
    const capacityMatched = exact.length > 0 ? exact : fitting;

    const available = capacityMatched.filter((h) => {
      if (!isAvailabilityTracked(h.name)) return true;
      const capacity = h.capacity ?? 2;
      return getStayAvailability(checkIn, nights, roomsFor(totalGuests, capacity, requestedRooms)).available;
    });
    if (available.length === 0) continue;

    let best: { hotel: Hotel; total: number; rooms: number } | null = null;
    for (const hotel of available) {
      const capacity = hotel.capacity ?? 2;
      const rooms = roomsFor(totalGuests, capacity, requestedRooms);
      const hotelTotal = stayCost(hotel.name, hotel.pricePerNight, capacity, checkIn, nights) * Math.max(1, rooms);
      const total = pricing.total + hotelTotal;
      if (!best || total < best.total) best = { hotel, total, rooms };
    }
    if (best) {
      return {
        status: 'ok',
        total: best.total,
        hotel: best.hotel,
        nights,
        rooms: best.rooms,
        requestedRooms,
        childPriceOnRequest: pricing.childPriceOnRequest,
      };
    }
  }

  return { status: 'unavailable' };
}

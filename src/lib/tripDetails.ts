import { useSyncExternalStore } from 'react';
import { format, parse } from 'date-fns';

/**
 * The guest's trip details (dates, adults, children's ages), entered once on a
 * destination page and remembered while they browse other destinations and
 * move into the booking steps. Kept in sessionStorage so it clears when the
 * browser tab is closed.
 */
export interface TripDetails {
  /** yyyy-MM-dd, local date */
  checkIn?: string;
  /** yyyy-MM-dd, local date */
  checkOut?: string;
  adults: number;
  childAges: number[];
}

export const DEFAULT_TRIP: TripDetails = { adults: 2, childAges: [] };

const STORAGE_KEY = 'ta-trip-details';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Representative ages for each booking-page children band (0–2, 3–12, 13–17). */
export const BAND_AGES = { infant: 1, kid: 8, teen: 15 } as const;

export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromDateString(value?: string | null): Date | undefined {
  if (!value || !DATE_RE.test(value)) return undefined;
  const d = parse(value, 'yyyy-MM-dd', new Date());
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function sanitise(raw: unknown): TripDetails {
  if (!raw || typeof raw !== 'object') return DEFAULT_TRIP;
  const r = raw as Partial<TripDetails>;
  const adults = Math.min(30, Math.max(1, Math.round(Number(r.adults) || 2)));
  const childAges = Array.isArray(r.childAges)
    ? r.childAges
        .map((a) => Math.round(Number(a)))
        .filter((a) => Number.isFinite(a) && a >= 0 && a <= 17)
        .slice(0, 20)
    : [];
  return {
    checkIn: fromDateString(r.checkIn) ? r.checkIn : undefined,
    checkOut: fromDateString(r.checkOut) ? r.checkOut : undefined,
    adults,
    childAges,
  };
}

/** True once there are valid dates (check-out after check-in) and at least one adult. */
export function isTripComplete(trip: TripDetails): boolean {
  const checkIn = fromDateString(trip.checkIn);
  const checkOut = fromDateString(trip.checkOut);
  return Boolean(checkIn && checkOut && checkOut > checkIn && trip.adults >= 1);
}

export function childBandCounts(ages: number[]) {
  return {
    infants: ages.filter((a) => a <= 2).length,
    kids: ages.filter((a) => a >= 3 && a <= 12).length,
    teens: ages.filter((a) => a >= 13).length,
  };
}

/** Ages as the booking page prices them (one representative age per band). */
export function bandedChildAges(ages: number[]): number[] {
  const { infants, kids, teens } = childBandCounts(ages);
  return [
    ...Array.from({ length: infants }, () => BAND_AGES.infant),
    ...Array.from({ length: kids }, () => BAND_AGES.kid),
    ...Array.from({ length: teens }, () => BAND_AGES.teen),
  ];
}

/** Query string for the booking page, using the parameters it already reads. */
export function tripToSearchParams(trip: TripDetails): URLSearchParams {
  const params = new URLSearchParams();
  if (!isTripComplete(trip)) return params;
  const { infants, kids, teens } = childBandCounts(trip.childAges);
  params.set('checkIn', trip.checkIn as string);
  params.set('checkOut', trip.checkOut as string);
  params.set('adults', String(trip.adults));
  params.set('c02', String(infants));
  params.set('c312', String(kids));
  params.set('c1317', String(teens));
  return params;
}

/* ---------- tiny external store so every component stays in sync ---------- */

let cached: TripDetails | null = null;
const listeners = new Set<() => void>();

function read(): TripDetails {
  if (cached) return cached;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    cached = stored ? sanitise(JSON.parse(stored)) : DEFAULT_TRIP;
  } catch {
    cached = DEFAULT_TRIP;
  }
  return cached;
}

export function getTripDetails(): TripDetails {
  return read();
}

export function saveTripDetails(next: TripDetails): void {
  cached = sanitise(next);
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    /* storage unavailable — keep in memory only */
  }
  listeners.forEach((l) => l());
}

export function clearTripDetails(): void {
  cached = DEFAULT_TRIP;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTripDetails(): TripDetails {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_TRIP);
}

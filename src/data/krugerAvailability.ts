// Pretoriuskop Rest Camp — Hut (EB2) availability and rates
// Units available per date, captured from the SANParks availability calendars.
// A value of 0 means no availability for that date.

export const PRETORIUSKOP_NIGHTLY_RATE = 1180;

export const PRETORIUSKOP_UNITS: Record<string, number[]> = {
  // index 0 = 1st of the month
  '2026-09': [20, 17, 17, 14, 6, 11, 12, 16, 0, 0, 0, 0, 22, 19, 14, 18, 1, 5, 1, 14, 15, 16, 10, 0, 0, 0, 8, 6, 1, 1],
  '2026-10': [8, 14, 18, 23, 25, 25, 24, 26, 27, 20, 22, 20, 18, 11, 21, 22, 26, 25, 23, 26, 23, 21, 25, 25, 22, 24, 25, 26, 25, 26, 25],
  '2026-11': [26, 27, 21, 18, 21, 20, 26, 26, 24, 24, 23, 11, 14, 26, 27, 27, 27, 27, 27, 27, 25, 6, 4, 2, 22, 24, 26, 27, 27, 27],
  '2026-12': [27, 27, 26, 26, 26, 26, 27, 27, 27, 27, 26, 27, 27, 27, 27, 26, 24, 27, 24, 24, 26, 22, 21, 25, 26, 26, 26, 23, 22, 24, 22],
  '2027-01': [25, 27, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27],
  '2027-02': [27, 27, 27, 27, 27, 27, 27, 27, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 26, 26, 27, 27, 27, 27, 27, 27],
};

export const PRETORIUSKOP_MONTHS = Object.keys(PRETORIUSKOP_UNITS);

export function getMonthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
}

export function getUnitsForDate(month: string, day: number): number {
  return PRETORIUSKOP_UNITS[month]?.[day - 1] ?? 0;
}

/** Weekday index (0 = Sunday) of the 1st of the given month. */
export function getMonthStartWeekday(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).getDay();
}

export function getDaysInMonth(month: string): number {
  return PRETORIUSKOP_UNITS[month]?.length ?? 0;
}

/** Hotels whose availability is tracked by the SANParks unit calendar. */
export const AVAILABILITY_TRACKED_HOTELS = ['Pretoriuskop Rest Camp'];

export function isAvailabilityTracked(hotelName: string): boolean {
  return AVAILABILITY_TRACKED_HOTELS.some(
    (n) => n.toLowerCase() === hotelName.trim().toLowerCase(),
  );
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Units available on a specific date; null when the date falls outside loaded data. */
export function getUnitsForDay(date: Date): number | null {
  const month = monthKey(date);
  if (!PRETORIUSKOP_UNITS[month]) return null;
  return getUnitsForDate(month, date.getDate());
}

/**
 * Availability for a stay. Requires `rooms` units on every night of the stay.
 * Returns `available: true` when the dates are outside the loaded calendar
 * (we then confirm on request rather than blocking the booking).
 */
export function getStayAvailability(
  checkIn: Date | undefined,
  nights: number,
  rooms = 1,
): { available: boolean; soldOutDates: Date[]; unknown: boolean } {
  if (!checkIn) return { available: true, soldOutDates: [], unknown: true };
  const soldOutDates: Date[] = [];
  let unknown = false;
  for (let i = 0; i < Math.max(1, nights); i++) {
    const day = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate() + i);
    const units = getUnitsForDay(day);
    if (units === null) {
      unknown = true;
      continue;
    }
    if (units < Math.max(1, rooms)) soldOutDates.push(day);
  }
  return { available: soldOutDates.length === 0, soldOutDates, unknown };
}

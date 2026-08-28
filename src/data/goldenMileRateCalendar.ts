/**
 * GOLDEN MILE (DURBAN BEACHFRONT) HOTEL RATE CALENDAR
 * Validity: 30 August 2026 – 30 April 2027
 * All values are NIGHTLY ROOM RATES in ZAR (per room per night).
 * Peak (15 Dec 2026 – 10 Jan 2027) rates already include the 10% festive uplift.
 * Never apply any further uplift to these values.
 */

type RatePeriod = { start: string; end: string; rate: number };

/** Rate periods per hotel key. `end` is the LAST night charged at that rate. */
const CALENDAR: Record<string, RatePeriod[]> = {
  'blue-waters': [
    { start: '2026-08-30', end: '2026-08-31', rate: 950 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1000 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1100 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1200 },
    { start: '2026-12-01', end: '2026-12-14', rate: 1800 },
    { start: '2026-12-15', end: '2027-01-10', rate: 2860 },
    { start: '2027-01-11', end: '2027-01-31', rate: 1800 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1200 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1100 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1050 },
  ],
  belaire: [
    { start: '2026-08-30', end: '2026-08-31', rate: 1000 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1050 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1200 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1300 },
    { start: '2026-12-01', end: '2026-12-14', rate: 2000 },
    { start: '2026-12-15', end: '2027-01-10', rate: 3300 },
    { start: '2027-01-11', end: '2027-01-31', rate: 2000 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1300 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1200 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1150 },
  ],
  'gc-marine-parade': [
    { start: '2026-08-30', end: '2026-08-31', rate: 1350 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1400 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1600 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1800 },
    { start: '2026-12-01', end: '2026-12-14', rate: 2600 },
    { start: '2026-12-15', end: '2027-01-10', rate: 4180 },
    { start: '2027-01-11', end: '2027-01-31', rate: 2600 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1800 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1600 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1500 },
  ],
  'gc-south-beach': [
    { start: '2026-08-30', end: '2026-08-31', rate: 1250 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1300 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1500 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1700 },
    { start: '2026-12-01', end: '2026-12-14', rate: 2400 },
    { start: '2026-12-15', end: '2027-01-10', rate: 3850 },
    { start: '2027-01-11', end: '2027-01-31', rate: 2400 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1700 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1500 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1450 },
  ],
  edward: [
    { start: '2026-08-30', end: '2026-08-31', rate: 1500 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1600 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1800 },
    { start: '2026-11-01', end: '2026-11-30', rate: 2000 },
    { start: '2026-12-01', end: '2026-12-14', rate: 3000 },
    { start: '2026-12-15', end: '2027-01-10', rate: 4620 },
    { start: '2027-01-11', end: '2027-01-31', rate: 3000 },
    { start: '2027-02-01', end: '2027-02-28', rate: 2000 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1800 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1700 },
  ],
  suncoast: [
    { start: '2026-08-30', end: '2026-08-31', rate: 2200 },
    { start: '2026-09-01', end: '2026-09-30', rate: 2300 },
    { start: '2026-10-01', end: '2026-10-31', rate: 2500 },
    { start: '2026-11-01', end: '2026-11-30', rate: 2700 },
    { start: '2026-12-01', end: '2026-12-14', rate: 3800 },
    { start: '2026-12-15', end: '2027-01-10', rate: 6050 },
    { start: '2027-01-11', end: '2027-01-31', rate: 3800 },
    { start: '2027-02-01', end: '2027-02-28', rate: 2700 },
    { start: '2027-03-01', end: '2027-03-31', rate: 2500 },
    { start: '2027-04-01', end: '2027-04-30', rate: 2400 },
  ],
  'elangeni-maharani': [
    { start: '2026-08-30', end: '2026-08-31', rate: 1450 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1500 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1700 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1900 },
    { start: '2026-12-01', end: '2026-12-14', rate: 2800 },
    { start: '2026-12-15', end: '2027-01-10', rate: 4400 },
    { start: '2027-01-11', end: '2027-01-31', rate: 2800 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1900 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1700 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1650 },
  ],
  parade: [
    { start: '2026-08-30', end: '2026-08-31', rate: 800 },
    { start: '2026-09-01', end: '2026-09-30', rate: 850 },
    { start: '2026-10-01', end: '2026-10-31', rate: 900 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1000 },
    { start: '2026-12-01', end: '2026-12-14', rate: 1500 },
    { start: '2026-12-15', end: '2027-01-10', rate: 2420 },
    { start: '2027-01-11', end: '2027-01-31', rate: 1500 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1000 },
    { start: '2027-03-01', end: '2027-03-31', rate: 900 },
    { start: '2027-04-01', end: '2027-04-30', rate: 850 },
  ],
  tropicana: [
    { start: '2026-08-30', end: '2026-08-31', rate: 850 },
    { start: '2026-09-01', end: '2026-09-30', rate: 900 },
    { start: '2026-10-01', end: '2026-10-31', rate: 950 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1050 },
    { start: '2026-12-01', end: '2026-12-14', rate: 1600 },
    { start: '2026-12-15', end: '2027-01-10', rate: 2640 },
    { start: '2027-01-11', end: '2027-01-31', rate: 1600 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1050 },
    { start: '2027-03-01', end: '2027-03-31', rate: 950 },
    { start: '2027-04-01', end: '2027-04-30', rate: 900 },
  ],
  'durban-spa': [
    { start: '2026-08-30', end: '2026-08-31', rate: 1000 },
    { start: '2026-09-01', end: '2026-09-30', rate: 1050 },
    { start: '2026-10-01', end: '2026-10-31', rate: 1200 },
    { start: '2026-11-01', end: '2026-11-30', rate: 1300 },
    { start: '2026-12-01', end: '2026-12-14', rate: 2000 },
    { start: '2026-12-15', end: '2027-01-10', rate: 3520 },
    { start: '2027-01-11', end: '2027-01-31', rate: 2000 },
    { start: '2027-02-01', end: '2027-02-28', rate: 1300 },
    { start: '2027-03-01', end: '2027-03-31', rate: 1200 },
    { start: '2027-04-01', end: '2027-04-30', rate: 1100 },
  ],
};

/** Resolve a hotel display name to a calendar key. */
export function getGoldenMileRateKey(hotelName: string): string | undefined {
  const n = hotelName.toLowerCase();
  if (n.includes('blue waters')) return 'blue-waters';
  if (n.includes('belaire')) return 'belaire';
  if (n.includes('marine parade')) return 'gc-marine-parade';
  if (n.includes('south beach')) return 'gc-south-beach';
  if (n.includes('edward')) return 'edward';
  if (n.includes('suncoast')) return 'suncoast';
  if (n.includes('elangeni') || n.includes('maharani')) return 'elangeni-maharani';
  if (n.includes('parade hotel')) return 'parade';
  if (n.includes('tropicana')) return 'tropicana';
  if (n.includes('durban spa')) return 'durban-spa';
  return undefined;
}

export function hasGoldenMileCalendar(hotelName: string): boolean {
  return getGoldenMileRateKey(hotelName) !== undefined;
}

function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Nightly rate for a single accommodation night, or undefined outside validity. */
export function getGoldenMileNightlyRate(hotelName: string, night: Date): number | undefined {
  const key = getGoldenMileRateKey(hotelName);
  if (!key) return undefined;
  const stamp = toKey(night);
  return CALENDAR[key].find((p) => stamp >= p.start && stamp <= p.end)?.rate;
}

/**
 * Total room cost for a stay, charged night-by-night.
 * The check-out date is never charged. Nights outside the calendar validity
 * fall back to `fallbackRate` so existing behaviour is preserved.
 */
export function getGoldenMileStayTotal(
  hotelName: string,
  checkIn: Date | undefined,
  nights: number,
  fallbackRate: number,
): number {
  const key = getGoldenMileRateKey(hotelName);
  const nightCount = Math.max(1, nights);
  if (!key || !checkIn) return fallbackRate * nightCount;

  let total = 0;
  for (let i = 0; i < nightCount; i += 1) {
    const night = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate() + i);
    total += getGoldenMileNightlyRate(hotelName, night) ?? fallbackRate;
  }
  return total;
}

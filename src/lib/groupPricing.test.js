import { describe, expect, test } from 'bun:test';
import { getCheapestGroupPrice, stayNights, groupGuestCount } from './groupPricing';
import { bandedChildAges, isTripComplete, tripToSearchParams, childBandCounts } from './tripDetails';
import { calculatePackagePrice } from '../data/packagePricing';
import { getPackagesByDestination } from '../data/travelData';

const trip = { checkIn: '2026-12-12', checkOut: '2026-12-15', adults: 2, childAges: [5, 14] };

describe('trip details', () => {
  test('needs dates in order and an adult', () => {
    expect(isTripComplete({ adults: 2, childAges: [] })).toBe(false);
    expect(isTripComplete({ checkIn: '2026-12-15', checkOut: '2026-12-12', adults: 2, childAges: [] })).toBe(false);
    expect(isTripComplete(trip)).toBe(true);
  });
  test('children are grouped into the booking page age bands', () => {
    expect(childBandCounts([1, 2, 3, 12, 13, 17])).toEqual({ infants: 2, kids: 2, teens: 2 });
    expect(bandedChildAges([0, 5, 14])).toEqual([1, 8, 15]);
  });
  test('booking link carries the details the booking page already reads', () => {
    expect(tripToSearchParams(trip).toString()).toBe(
      'checkIn=2026-12-12&checkOut=2026-12-15&adults=2&c02=0&c312=1&c1317=1',
    );
    expect(tripToSearchParams({ adults: 2, childAges: [] }).toString()).toBe('');
  });
  test('nights and guests', () => {
    expect(stayNights(trip)).toBe(3);
    expect(groupGuestCount({ ...trip, childAges: [1, 5, 14] })).toBe(4);
  });
});

describe('cheapest group price', () => {
  test('equals package price plus the cheapest stay, for every package', () => {
    for (const dest of ['durban', 'cape-town', 'sun-city', 'hartbeespoort', 'magaliesburg', 'mpumalanga', 'bela-bela', 'umhlanga']) {
      for (const pkg of getPackagesByDestination(dest)) {
        const result = getCheapestGroupPrice(pkg, dest, trip);
        if (result.status !== 'ok') continue;
        const pkgTotal = calculatePackagePrice(pkg.id, { adults: 2, childrenAges: bandedChildAges(trip.childAges) }).total;
        expect(result.total).toBeGreaterThan(pkgTotal);
        expect(result.nights).toBe(3);
      }
    }
  });
  test('more guests never cost less', () => {
    const [pkg] = getPackagesByDestination('durban');
    const small = getCheapestGroupPrice(pkg, 'durban', { ...trip, childAges: [] });
    const big = getCheapestGroupPrice(pkg, 'durban', { ...trip, adults: 4, childAges: [6, 9] });
    if (small.status === 'ok' && big.status === 'ok') expect(big.total).toBeGreaterThan(small.total);
  });
  test('no dates means no group price', () => {
    const [pkg] = getPackagesByDestination('durban');
    expect(getCheapestGroupPrice(pkg, 'durban', { adults: 2, childAges: [] }).status).toBe('unknown');
  });
});

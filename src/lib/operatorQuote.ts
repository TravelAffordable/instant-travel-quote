import { packages, hotels, type Hotel } from '@/data/travelData';
import { calculatePackageBaseCost } from '@/lib/packagePricing';
import { roundToNearest10 } from '@/lib/utils';

export const COMMISSION_BASE_BONUS = 250;

export function perPassengerRate(pax: number): number {
  if (pax >= 40) return 150;
  if (pax >= 20) return 100;
  return 0;
}

export function calculateCommission(pax: number): number {
  return COMMISSION_BASE_BONUS + perPassengerRate(pax) * pax;
}

export function nightsBetween(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0;
  const n = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  return n > 0 ? n : 0;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function findListedHotel(name: string, destination: string): Hotel | undefined {
  const n = norm(name);
  if (n.length < 4) return undefined;
  const pool = hotels.filter((h) => h.destination === destination);
  return pool.find((h) => norm(h.name) === n) ?? pool.find((h) => norm(h.name).includes(n) || n.includes(norm(h.name)));
}

export interface OperatorQuoteInput {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenAges: number[];
  packageIds: string[];
  busAmount: number;
  hotelRate: number;
  hotelCapacity: number;
  rooms: number;
}

export function computeOperatorQuote(q: OperatorQuoteInput) {
  const nights = nightsBetween(q.checkIn, q.checkOut);
  const pax = q.adults + q.childrenAges.length;
  const packageTotal = q.packageIds.reduce((sum, id) => {
    const pkg = packages.find((p) => p.id === id);
    return pkg ? sum + calculatePackageBaseCost(pkg, q.adults, q.childrenAges) : sum;
  }, 0);
  const roomsRequired = Math.max(q.rooms || 1, Math.ceil(pax / Math.max(1, q.hotelCapacity || 2)));
  const accommodationTotal = (q.hotelRate || 0) * nights * roomsRequired;
  const travelAffordableTotal = roundToNearest10(packageTotal + accommodationTotal);
  const busTotal = roundToNearest10(q.busAmount || 0);
  const grandTotal = travelAffordableTotal + busTotal;
  const perPerson = pax > 0 ? roundToNearest10(grandTotal / pax) : 0;
  return {
    nights,
    pax,
    roomsRequired,
    packageTotal,
    accommodationTotal,
    travelAffordableTotal,
    busTotal,
    grandTotal,
    perPerson,
    commission: calculateCommission(pax),
  };
}

export const rand = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`;

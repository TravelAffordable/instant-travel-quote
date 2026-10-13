import { z } from 'zod';

export const bookingNameSchema = z.string().trim().min(1).max(100).regex(/^[^\x00-\x1f<>]+$/);
export const bookingWhatsAppSchema = z.string().trim().max(20).regex(/^\+?[\d\s()-]+$/)
  .refine((value) => { const digits = value.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 15; });
export const bookingBudgetSchema = z.coerce.number().finite().positive().max(100000000);
export const HOTEL_BATCH_SIZE = 10;
export const BUDGET_WINDOW = 1000;

export function matchBudgetHotels<T>(hotels: T[], budget: number, priceFor: (hotel: T) => number): T[] {
  return hotels.filter((hotel) => {
    const price = priceFor(hotel);
    return price >= budget - BUDGET_WINDOW && price <= budget + BUDGET_WINDOW;
  }).sort((a, b) => priceFor(a) - priceFor(b));
}
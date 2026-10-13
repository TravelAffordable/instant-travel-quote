import { describe, expect, test } from 'bun:test';
import { bookingNameSchema, bookingWhatsAppSchema, bookingBudgetSchema, HOTEL_BATCH_SIZE, matchBudgetHotels } from './bookingSelection';

describe('booking selection rules', () => {
  test('dates require a nonempty name', () => {
    expect(bookingNameSchema.safeParse('   ').success).toBe(false);
    expect(bookingNameSchema.parse(' Mosidi ')).toBe('Mosidi');
  });
  test('travellers require a valid WhatsApp number', () => {
    expect(bookingWhatsAppSchema.safeParse('').success).toBe(false);
    expect(bookingWhatsAppSchema.safeParse('123').success).toBe(false);
    expect(bookingWhatsAppSchema.safeParse('0731898366').success).toBe(true);
  });
  test('budget includes exactly R1000 below and above and sorts ascending', () => {
    const hotels = [9001, 8000, 6999, 9000, 7000];
    expect(matchBudgetHotels(hotels, 8000, (price) => price)).toEqual([7000, 8000, 9000]);
  });
  test('each hotel batch contains 10 options', () => {
    const hotels = Array.from({ length: 25 }, (_, i) => 7000 + i);
    const matches = matchBudgetHotels(hotels, 8000, (price) => price);
    expect(HOTEL_BATCH_SIZE).toBe(10);
    expect(matches.slice(0, HOTEL_BATCH_SIZE)).toHaveLength(10);
    expect(matches.slice(0, HOTEL_BATCH_SIZE * 2)).toHaveLength(20);
  });
  test('budget must be positive and finite', () => {
    expect(bookingBudgetSchema.safeParse(0).success).toBe(false);
    expect(bookingBudgetSchema.safeParse(Infinity).success).toBe(false);
    expect(bookingBudgetSchema.parse(8000)).toBe(8000);
  });
});
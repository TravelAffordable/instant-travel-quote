import { describe, expect, test } from 'bun:test';
import { assignHotelDisplayNames } from './hotelDisplayNames';

describe('public hotel display names', () => {
  test('assigns sequential Durban aliases while retaining real property names', () => {
    const hotels = assignHotelDisplayNames([
      { destination: 'durban', name: 'Blue Waters Hotel', capacity: 2 },
      { destination: 'durban', name: 'Blue Waters Hotel', capacity: 4 },
      { destination: 'durban', name: 'The Edward', capacity: 2 },
    ]);

    expect(hotels.map((hotel) => hotel.displayName)).toEqual([
      'Durban Beachfront Hotel #101',
      'Durban Beachfront Hotel #101',
      'Durban Beachfront Hotel #102',
    ]);
    expect(hotels[0]?.name).toBe('Blue Waters Hotel');
  });

  test('preserves specified Sun City property names and aliases other stays', () => {
    const names = [
      'Sundown Country Estate',
      'Sun City Cabanas Hotel — 2 Sleeper',
      'The Kingdom Resort',
      'Bakubung Bush Lodge — 4 Sleeper',
      'Kwa Maritane Lodge',
      'Pilanesberg Hotel',
    ];
    const hotels = assignHotelDisplayNames(names.map((name) => ({ destination: 'sun-city', name })));

    expect(hotels.map((hotel) => hotel.displayName)).toEqual([
      'Sun City Area Hotel #101',
      undefined,
      undefined,
      undefined,
      undefined,
      'Sun City Area Hotel #102',
    ]);
    expect(hotels[2]?.name).toBe('The Kingdom Resort');
  });

  test('assigns Harties area aliases', () => {
    const hotels = assignHotelDisplayNames([
      { destination: 'harties', name: 'Indlovukazi Guesthouse' },
      { destination: 'harties', name: 'Villa Paradiso Hotel' },
    ]);

    expect(hotels.map((hotel) => hotel.displayName)).toEqual([
      'Harties Area Hotel #101',
      'Harties Area Hotel #102',
    ]);
  });
});
type HotelNameRecord = {
  name: string;
  destination: string;
};

const aliasPrefixByDestination: Record<string, string> = {
  durban: 'Durban Beachfront Hotel',
  'sun-city': 'Sun City Area Hotel',
  harties: 'Harties Area Hotel',
};

function keepSunCityRealName(name: string) {
  return /cabanas|the kingdom resort|bakubung bush lodge|kwa maritane lodge/i.test(name);
}

/** Adds public-facing aliases without changing the real property names used internally. */
export function assignHotelDisplayNames<T extends HotelNameRecord>(hotels: T[]): (T & { displayName?: string })[] {
  const nextNumberByDestination = new Map<string, number>();
  const aliasByProperty = new Map<string, string>();

  return hotels.map((hotel) => {
    const prefix = aliasPrefixByDestination[hotel.destination];
    if (!prefix || (hotel.destination === 'sun-city' && keepSunCityRealName(hotel.name))) {
      return { ...hotel, displayName: undefined };
    }

    const propertyKey = `${hotel.destination}:${hotel.name.trim().toLocaleLowerCase()}`;
    let displayName = aliasByProperty.get(propertyKey);
    if (!displayName) {
      const number = (nextNumberByDestination.get(hotel.destination) ?? 100) + 1;
      nextNumberByDestination.set(hotel.destination, number);
      displayName = `${prefix} #${number}`;
      aliasByProperty.set(propertyKey, displayName);
    }

    return { ...hotel, displayName };
  });
}
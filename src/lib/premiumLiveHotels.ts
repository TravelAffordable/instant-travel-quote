export const PREMIUM_LIVE_HOTELS = [
  {
    key: 'blue-waters',
    label: 'Blue Waters Hotel',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Blue Waters Hotel'],
  },
  {
    key: 'garden-court-south-beach',
    label: 'Garden Court South Beach',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Garden Court South Beach', 'Southern Sun Garden Court South Beach'],
  },
  {
    key: 'the-edward',
    label: 'The Edward',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['The Edward', 'Southern Sun The Edward'],
  },
  {
    key: 'the-balmoral',
    label: 'The Balmoral',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['The Balmoral'],
  },
  {
    key: 'belaire-suites-hotel',
    label: 'Belaire Suites Hotel',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Belaire Suites Hotel'],
  },
  {
    key: 'gooderson-tropicana-hotel',
    label: 'Gooderson Tropicana Hotel',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Gooderson Tropicana Hotel'],
  },
  {
    key: 'gooderson-leisure-silver-sands-2',
    label: 'Gooderson Leisure Silver Sands 2',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Gooderson Leisure Silver Sands 2'],
  },
  {
    key: 'first-group-the-palace-all-suite',
    label: 'First Group The Palace All-Suite',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['First Group The Palace All-Suite'],
  },
  {
    key: 'garden-court-marine-parade',
    label: 'Garden Court Marine Parade',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Garden Court Marine Parade', 'Southern Sun Garden Court Marine Parade'],
  },
  {
    key: 'southern-sun-elangeni-maharani',
    label: 'Southern Sun Elangeni & Maharani Hotel',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Southern Sun Elangeni & Maharani Hotel', 'Southern Sun Elangeni & Maharani'],
  },
  {
    key: 'suncoast-hotel-towers',
    label: 'Suncoast Hotel & Towers',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Suncoast Hotel & Towers'],
  },
  {
    key: 'sea-esta-luxury-apartment-107',
    label: 'Sea Esta Luxury Apartment 107',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Sea Esta Luxury Apartment 107'],
  },
  {
    key: 'beach-hurst-303',
    label: 'Beach Hurst 303',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['Beach Hurst 303'],
  },
  {
    key: 'ushaka-views',
    label: 'UshakaViews',
    destination: 'durban',
    destinationLabel: 'Durban',
    aliases: ['UshakaViews'],
  },
  {
    key: 'indlovukazi-guesthouse',
    label: 'Indlovukazi Guesthouse',
    destination: 'harties',
    destinationLabel: 'Hartbeespoort',
    aliases: ['Indlovukazi Guesthouse'],
  },
  {
    key: 'villa-paradiso-hotel',
    label: 'Villa Paradiso Hotel',
    destination: 'harties',
    destinationLabel: 'Hartbeespoort',
    aliases: ['Villa Paradiso Hotel'],
  },
  {
    key: 'cocomo-boutique-hotel',
    label: 'Cocomo Boutique Hotel',
    destination: 'harties',
    destinationLabel: 'Hartbeespoort',
    aliases: ['Cocomo Boutique Hotel'],
  },
  {
    key: 'the-riverleaf-hotel',
    label: 'The Riverleaf Hotel',
    destination: 'harties',
    destinationLabel: 'Hartbeespoort',
    aliases: ['The Riverleaf Hotel'],
  },
  {
    key: 'kosmos-manor',
    label: 'Kosmos Manor',
    destination: 'harties',
    destinationLabel: 'Hartbeespoort',
    aliases: ['Kosmos Manor'],
  },
  {
    key: 'mint-hotel-the-blyde',
    label: 'Mint Hotel The Blyde',
    destination: 'pretoria',
    destinationLabel: 'Pretoria',
    aliases: ['Mint Hotel The Blyde'],
  },
  {
    key: 'blyde-penthouse-apartments',
    label: 'Blyde Penthouse Apartments',
    destination: 'pretoria',
    destinationLabel: 'Pretoria',
    aliases: ['Blyde Penthouse Apartments'],
  },
] as const;

export type PremiumLiveHotelKey = (typeof PREMIUM_LIVE_HOTELS)[number]['key'];
export type PremiumLiveHotelOption = (typeof PREMIUM_LIVE_HOTELS)[number];

const NAME_TO_KEY = new Map<string, PremiumLiveHotelKey>();

for (const hotel of PREMIUM_LIVE_HOTELS) {
  for (const alias of hotel.aliases) {
    NAME_TO_KEY.set(alias.trim().toLowerCase(), hotel.key);
  }
}

export function getPremiumLiveHotelKeyByName(name: string) {
  return NAME_TO_KEY.get(name.trim().toLowerCase()) ?? null;
}

export function getPremiumLiveHotelsByDestination(destination: string) {
  return PREMIUM_LIVE_HOTELS.filter((hotel) => hotel.destination === destination);
}

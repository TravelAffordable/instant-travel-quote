const CURRENCY_CODE = 'ZAR';
const SCRAPE_TIMEOUT_MS = 15000;

export type HotelKey =
  | 'blue-waters'
  | 'garden-court-south-beach'
  | 'the-edward'
  | 'the-balmoral'
  | 'belaire-suites-hotel'
  | 'gooderson-tropicana-hotel'
  | 'gooderson-leisure-silver-sands-2'
  | 'first-group-the-palace-all-suite'
  | 'garden-court-marine-parade'
  | 'southern-sun-elangeni-maharani'
  | 'suncoast-hotel-towers'
  | 'sea-esta-luxury-apartment-107'
  | 'beach-hurst-303'
  | 'ushaka-views'
  | 'indlovukazi-guesthouse'
  | 'villa-paradiso-hotel'
  | 'cocomo-boutique-hotel'
  | 'the-riverleaf-hotel'
  | 'kosmos-manor'
  | 'palm-swift-luxury'
  | 'the-venue-country-hotel-and-spa'
  | 'waterfront-guesthouse'
  | 'metsingat-harties'
  | 'marina-view-guesthouse'
  | 'cozy-kosmos'
  | 'serenity-guesthouse'
  | 'mint-hotel-the-blyde'
  | 'blyde-penthouse-apartments'
  | 'sea-point-apartment'
  | 'bantry-aparthotel-totalstay'
  | 'casa-on-kei-totalstay'
  | 'spring-tide-inn-ctha'
  | 'first-group-riviera-suites'
  | 'home-suite-hotels-sea-point'
  | 'camps-bay-village'
  | '3-on-camps-bay'
  | 'camps-bay-beach-front-apartment'
  | 'camps-bay-private-room'
  | 'camps-bay-studio'
  | 'cape-diamond-boutique-hotel'
  | 'fountains-hotel-cape-town'
  | 'holiday-inn-express-cape-town'
  | 'hotel-sky-cape-town'
  | 'cresta-grande-cape-town'
  | 'radisson-cape-town-foreshore'
  | 'onomo-inn-on-the-square'
  | 'onomo-hotel-foreshore'
  | 'first-beach-203-ctha'
  | 'clifton-yolo-spaces'
  | 'radisson-red-va-waterfront'
  | 'cape-grace-va-waterfront'
  | 'waterfront-village-va'
  | 'southern-sun-waterfront'
  | 'president-hotel-cape-town'
  | 'the-bay-hotel'
  | 'twelve-apostles-hotel-spa'
  | 'protea-hotel-sea-point'
  | 'the-marly-cape-town'
  | 'breakers-resort-apartments'
  | 'aha-gateway-hotel-umhlanga'
  | 'the-villa-umhlanga'
  | 'protea-hotel-durban-umhlanga'
  | 'holiday-inn-express-umhlanga'
  | 'hilton-garden-inn-umhlanga'
  | 'premier-splendid-inn-umhlanga'
  | 'first-group-breakers-resort'
  | 'royal-palm-hotel-umhlanga'
  | 'regal-inn-umhlanga-gateway'
  | 'premier-hotel-umhlanga'
  | 'radisson-blu-durban-umhlanga'
  | 'the-millennial-umhlanga'
  | 'breakers-resort-232'
  | 'oceans-apartments-radisson-blu'
  | 'town-lodge-umhlanga'
  | '71-sea-lodge-beachfront'
  | 'bakubung-bush-lodge'
  | 'the-kingdom-resort'
  | 'kwa-maritane-lodge'
  | 'sundown-country-estate'
  | 'gettys-bed-and-breakfast'
  | 'valley-view-guest-house'
  | 'ivory-tree-game-lodge'
  | 'pilanesberg-hotel'
  | 'kedar-heritage-lodge'
  | 'royal-marang-hotel';

export type OccupancyKey = '2_sleeper' | '4_sleeper';

export type PremiumHotelConfig = {
  aliases: string[];
  bookingUrl?: string;
  destinationLabel: string;
  key: HotelKey;
  name: string;
  searchQuery: string;
};

export type LiveBookingRate = {
  available: boolean;
  checkIn: string;
  checkOut: string;
  currency: string;
  displayNightlyRate: number | null;
  displayTotalPrice: number | null;
  hotelKey: HotelKey;
  hotelName: string;
  maxPeople: number | null;
  note: string | null;
  partyNightlyRate: number | null;
  partyTotalPrice: number | null;
  ratePerNight: number | null;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms' | null;
  roomName: string | null;
  sourceUrl: string;
  totalPrice: number | null;
};

type ParsedRoomOption = {
  maxPeople: number | null;
  partyNightlyRate: number;
  partyTotalPrice: number;
  ratePerNight: number;
  raw: string;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms';
  roomName: string;
  totalPrice: number;
};

export const PREMIUM_HOTEL_CONFIGS: Record<HotelKey, PremiumHotelConfig> = {
  'blue-waters': {
    aliases: ['Blue Waters Hotel'],
    bookingUrl: 'https://www.booking.com/hotel/za/blue-waters.en-gb.html',
    destinationLabel: 'Durban',
    key: 'blue-waters',
    name: 'Blue Waters Hotel',
    searchQuery: 'Blue Waters Hotel Durban South Africa site:booking.com',
  },
  'garden-court-south-beach': {
    aliases: ['Garden Court South Beach', 'Southern Sun Garden Court South Beach'],
    bookingUrl: 'https://www.booking.com/hotel/za/garden-court-south-beach-durban1.en-gb.html',
    destinationLabel: 'Durban',
    key: 'garden-court-south-beach',
    name: 'Garden Court South Beach',
    searchQuery: 'Garden Court South Beach Durban South Africa site:booking.com',
  },
  'the-edward': {
    aliases: ['The Edward', 'Southern Sun The Edward'],
    bookingUrl: 'https://www.booking.com/hotel/za/the-edward-durban.html',
    destinationLabel: 'Durban',
    key: 'the-edward',
    name: 'The Edward',
    searchQuery: 'The Edward Durban South Africa site:booking.com',
  },
  'the-balmoral': {
    aliases: ['The Balmoral'],
    destinationLabel: 'Durban',
    key: 'the-balmoral',
    name: 'The Balmoral',
    searchQuery: 'The Balmoral Durban South Africa site:booking.com',
  },
  'belaire-suites-hotel': {
    aliases: ['Belaire Suites Hotel'],
    destinationLabel: 'Durban',
    key: 'belaire-suites-hotel',
    name: 'Belaire Suites Hotel',
    searchQuery: 'Belaire Suites Hotel Durban South Africa site:booking.com',
  },
  'gooderson-tropicana-hotel': {
    aliases: ['Gooderson Tropicana Hotel'],
    destinationLabel: 'Durban',
    key: 'gooderson-tropicana-hotel',
    name: 'Gooderson Tropicana Hotel',
    searchQuery: 'Gooderson Tropicana Hotel Durban South Africa site:booking.com',
  },
  'gooderson-leisure-silver-sands-2': {
    aliases: ['Gooderson Leisure Silver Sands 2'],
    destinationLabel: 'Durban',
    key: 'gooderson-leisure-silver-sands-2',
    name: 'Gooderson Leisure Silver Sands 2',
    searchQuery: 'Gooderson Leisure Silver Sands Durban South Africa site:booking.com',
  },
  'first-group-the-palace-all-suite': {
    aliases: ['First Group The Palace All-Suite'],
    destinationLabel: 'Durban',
    key: 'first-group-the-palace-all-suite',
    name: 'First Group The Palace All-Suite',
    searchQuery: 'First Group The Palace All-Suite Durban South Africa site:booking.com',
  },
  'garden-court-marine-parade': {
    aliases: ['Garden Court Marine Parade', 'Southern Sun Garden Court Marine Parade'],
    destinationLabel: 'Durban',
    key: 'garden-court-marine-parade',
    name: 'Garden Court Marine Parade',
    searchQuery: 'Garden Court Marine Parade Durban South Africa site:booking.com',
  },
  'southern-sun-elangeni-maharani': {
    aliases: ['Southern Sun Elangeni & Maharani Hotel', 'Southern Sun Elangeni & Maharani'],
    destinationLabel: 'Durban',
    key: 'southern-sun-elangeni-maharani',
    name: 'Southern Sun Elangeni & Maharani Hotel',
    searchQuery: 'Southern Sun Elangeni Maharani Durban South Africa site:booking.com',
  },
  'suncoast-hotel-towers': {
    aliases: ['Suncoast Hotel & Towers'],
    destinationLabel: 'Durban',
    key: 'suncoast-hotel-towers',
    name: 'Suncoast Hotel & Towers',
    searchQuery: 'Suncoast Hotel Towers Durban South Africa site:booking.com',
  },
  'sea-esta-luxury-apartment-107': {
    aliases: ['Sea Esta Luxury Apartment 107'],
    destinationLabel: 'Durban',
    key: 'sea-esta-luxury-apartment-107',
    name: 'Sea Esta Luxury Apartment 107',
    searchQuery: 'Sea Esta Luxury Apartment 107 Durban South Africa site:booking.com',
  },
  'beach-hurst-303': {
    aliases: ['Beach Hurst 303'],
    destinationLabel: 'Durban',
    key: 'beach-hurst-303',
    name: 'Beach Hurst 303',
    searchQuery: 'Beach Hurst 303 Durban South Africa site:booking.com',
  },
  'ushaka-views': {
    aliases: ['UshakaViews'],
    destinationLabel: 'Durban',
    key: 'ushaka-views',
    name: 'UshakaViews',
    searchQuery: 'UshakaViews Durban South Africa site:booking.com',
  },
  'indlovukazi-guesthouse': {
    aliases: ['Indlovukazi Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'indlovukazi-guesthouse',
    name: 'Indlovukazi Guesthouse',
    searchQuery: 'Indlovukazi Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'villa-paradiso-hotel': {
    aliases: ['Villa Paradiso Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'villa-paradiso-hotel',
    name: 'Villa Paradiso Hotel',
    searchQuery: 'Villa Paradiso Hotel Hartbeespoort South Africa site:booking.com',
  },
  'cocomo-boutique-hotel': {
    aliases: ['Cocomo Boutique Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'cocomo-boutique-hotel',
    name: 'Cocomo Boutique Hotel',
    searchQuery: 'Cocomo Boutique Hotel Hartbeespoort South Africa site:booking.com',
  },
  'the-riverleaf-hotel': {
    aliases: ['The Riverleaf Hotel'],
    destinationLabel: 'Hartbeespoort',
    key: 'the-riverleaf-hotel',
    name: 'The Riverleaf Hotel',
    searchQuery: 'The Riverleaf Hotel Hartbeespoort South Africa site:booking.com',
  },
  'kosmos-manor': {
    aliases: ['Kosmos Manor'],
    destinationLabel: 'Hartbeespoort',
    key: 'kosmos-manor',
    name: 'Kosmos Manor',
    searchQuery: 'Kosmos Manor Hartbeespoort South Africa site:booking.com',
  },
  'palm-swift-luxury': {
    aliases: ['Palm Swift Luxury'],
    destinationLabel: 'Hartbeespoort',
    key: 'palm-swift-luxury',
    name: 'Palm Swift Luxury',
    searchQuery: 'Palm Swift Luxury Hartbeespoort South Africa site:booking.com',
  },
  'the-venue-country-hotel-and-spa': {
    aliases: ['The Venue Country Hotel and Spa'],
    destinationLabel: 'Hartbeespoort',
    key: 'the-venue-country-hotel-and-spa',
    name: 'The Venue Country Hotel and Spa',
    searchQuery: 'The Venue Country Hotel and Spa Hartbeespoort South Africa site:booking.com',
  },
  'waterfront-guesthouse': {
    aliases: ['Waterfront Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'waterfront-guesthouse',
    name: 'Waterfront Guesthouse',
    searchQuery: 'Waterfront Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'metsingat-harties': {
    aliases: ['MetsingAt Harties'],
    destinationLabel: 'Hartbeespoort',
    key: 'metsingat-harties',
    name: 'MetsingAt Harties',
    searchQuery: 'MetsingAt Harties Hartbeespoort South Africa site:booking.com',
  },
  'marina-view-guesthouse': {
    aliases: ['Marina View Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'marina-view-guesthouse',
    name: 'Marina View Guesthouse',
    searchQuery: 'Marina View Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'cozy-kosmos': {
    aliases: ['Cozy Kosmos'],
    destinationLabel: 'Hartbeespoort',
    key: 'cozy-kosmos',
    name: 'Cozy Kosmos',
    searchQuery: 'Cozy Kosmos Hartbeespoort South Africa site:booking.com',
  },
  'serenity-guesthouse': {
    aliases: ['Serenity Guesthouse'],
    destinationLabel: 'Hartbeespoort',
    key: 'serenity-guesthouse',
    name: 'Serenity Guesthouse',
    searchQuery: 'Serenity Guesthouse Hartbeespoort South Africa site:booking.com',
  },
  'mint-hotel-the-blyde': {
    aliases: ['Mint Hotel The Blyde'],
    destinationLabel: 'Pretoria',
    key: 'mint-hotel-the-blyde',
    name: 'Mint Hotel The Blyde',
    searchQuery: 'Mint Hotel The Blyde Pretoria South Africa site:booking.com',
  },
  'blyde-penthouse-apartments': {
    aliases: ['Blyde Penthouse Apartments'],
    destinationLabel: 'Pretoria',
    key: 'blyde-penthouse-apartments',
    name: 'Blyde Penthouse Apartments',
    searchQuery: 'Blyde Penthouse Apartments Pretoria South Africa site:booking.com',
  },
  'sea-point-apartment': {
    aliases: ['Sea Point Apartment'],
    destinationLabel: 'Cape Town',
    key: 'sea-point-apartment',
    name: 'Sea Point Apartment',
    searchQuery: 'Sea Point apartment Cape Town South Africa site:booking.com',
  },
  'bantry-aparthotel-totalstay': {
    aliases: ['The Bantry Aparthotel by Totalstay'],
    destinationLabel: 'Cape Town',
    key: 'bantry-aparthotel-totalstay',
    name: 'The Bantry Aparthotel by Totalstay',
    searchQuery: 'The Bantry Aparthotel by Totalstay Sea Point Cape Town site:booking.com',
  },
  'casa-on-kei-totalstay': {
    aliases: ['Casa on Kei by Totalstay'],
    destinationLabel: 'Cape Town',
    key: 'casa-on-kei-totalstay',
    name: 'Casa on Kei by Totalstay',
    searchQuery: 'Casa on Kei by Totalstay Sea Point Cape Town site:booking.com',
  },
  'spring-tide-inn-ctha': {
    aliases: ['Spring Tide Inn by CTHA'],
    destinationLabel: 'Cape Town',
    key: 'spring-tide-inn-ctha',
    name: 'Spring Tide Inn by CTHA',
    searchQuery: 'Spring Tide Inn by CTHA Sea Point Cape Town site:booking.com',
  },
  'first-group-riviera-suites': {
    aliases: ['First Group Riviera Suites'],
    destinationLabel: 'Cape Town',
    key: 'first-group-riviera-suites',
    name: 'First Group Riviera Suites',
    searchQuery: 'First Group Riviera Suites Sea Point Cape Town site:booking.com',
  },
  'home-suite-hotels-sea-point': {
    aliases: ['Home Suite Hotels Sea Point', 'Home Suite Hotels'],
    destinationLabel: 'Cape Town',
    key: 'home-suite-hotels-sea-point',
    name: 'Home Suite Hotels Sea Point',
    searchQuery: 'Home Suite Hotels Sea Point Cape Town site:booking.com',
  },
  'camps-bay-village': {
    aliases: ['Camps Bay Village'],
    destinationLabel: 'Cape Town',
    key: 'camps-bay-village',
    name: 'Camps Bay Village',
    searchQuery: 'Camps Bay Village Cape Town site:booking.com',
  },
  '3-on-camps-bay': {
    aliases: ['3 On Camps Bay'],
    destinationLabel: 'Cape Town',
    key: '3-on-camps-bay',
    name: '3 On Camps Bay',
    searchQuery: '3 On Camps Bay Cape Town site:booking.com',
  },
  'camps-bay-beach-front-apartment': {
    aliases: ['Camps Bay Beach Front Apartment'],
    destinationLabel: 'Cape Town',
    key: 'camps-bay-beach-front-apartment',
    name: 'Camps Bay Beach Front Apartment',
    searchQuery: 'Camps Bay Beach Front Apartment Cape Town site:booking.com',
  },
  'camps-bay-private-room': {
    aliases: ['Camps Bay Private Room', 'Camps Bay private room and bathroom'],
    destinationLabel: 'Cape Town',
    key: 'camps-bay-private-room',
    name: 'Camps Bay Private Room',
    searchQuery: 'Camps Bay private room Cape Town site:booking.com',
  },
  'camps-bay-studio': {
    aliases: ['Camps Bay Studio', 'Camps Bay Studio with private patio'],
    destinationLabel: 'Cape Town',
    key: 'camps-bay-studio',
    name: 'Camps Bay Studio',
    searchQuery: 'Camps Bay Studio private patio Cape Town site:booking.com',
  },
  'cape-diamond-boutique-hotel': {
    aliases: ['Cape Diamond Boutique Hotel'],
    destinationLabel: 'Cape Town',
    key: 'cape-diamond-boutique-hotel',
    name: 'Cape Diamond Boutique Hotel',
    searchQuery: 'Cape Diamond Boutique Hotel Cape Town site:booking.com',
  },
  'fountains-hotel-cape-town': {
    aliases: ['Fountains Hotel'],
    destinationLabel: 'Cape Town',
    key: 'fountains-hotel-cape-town',
    name: 'Fountains Hotel',
    searchQuery: 'Fountains Hotel Cape Town site:booking.com',
  },
  'holiday-inn-express-cape-town': {
    aliases: ['Holiday Inn Express Cape Town City Centre'],
    destinationLabel: 'Cape Town',
    key: 'holiday-inn-express-cape-town',
    name: 'Holiday Inn Express Cape Town City Centre',
    searchQuery: 'Holiday Inn Express Cape Town City Centre site:booking.com',
  },
  'hotel-sky-cape-town': {
    aliases: ['Hotel Sky Cape Town'],
    destinationLabel: 'Cape Town',
    key: 'hotel-sky-cape-town',
    name: 'Hotel Sky Cape Town',
    searchQuery: 'Hotel Sky Cape Town site:booking.com',
  },
  'cresta-grande-cape-town': {
    aliases: ['Cresta Grande Cape Town'],
    destinationLabel: 'Cape Town',
    key: 'cresta-grande-cape-town',
    name: 'Cresta Grande Cape Town',
    searchQuery: 'Cresta Grande Cape Town site:booking.com',
  },
  'radisson-cape-town-foreshore': {
    aliases: ['Radisson Hotel Cape Town Foreshore'],
    destinationLabel: 'Cape Town',
    key: 'radisson-cape-town-foreshore',
    name: 'Radisson Hotel Cape Town Foreshore',
    searchQuery: 'Radisson Hotel Cape Town Foreshore site:booking.com',
  },
  'onomo-inn-on-the-square': {
    aliases: ['ONOMO Hotel Cape Town Inn On The Square'],
    destinationLabel: 'Cape Town',
    key: 'onomo-inn-on-the-square',
    name: 'ONOMO Hotel Cape Town Inn On The Square',
    searchQuery: 'ONOMO Hotel Cape Town Inn On The Square site:booking.com',
  },
  'onomo-hotel-foreshore': {
    aliases: ['ONOMO Hotel Foreshore'],
    destinationLabel: 'Cape Town',
    key: 'onomo-hotel-foreshore',
    name: 'ONOMO Hotel Foreshore',
    searchQuery: 'ONOMO Hotel Foreshore Cape Town site:booking.com',
  },
  'first-beach-203-ctha': {
    aliases: ['First Beach 203 by CTHA'],
    destinationLabel: 'Cape Town',
    key: 'first-beach-203-ctha',
    name: 'First Beach 203 by CTHA',
    searchQuery: 'First Beach 203 by CTHA Clifton Cape Town site:booking.com',
  },
  'clifton-yolo-spaces': {
    aliases: ['Clifton YOLO Spaces'],
    destinationLabel: 'Cape Town',
    key: 'clifton-yolo-spaces',
    name: 'Clifton YOLO Spaces',
    searchQuery: 'Clifton YOLO Spaces Cape Town site:booking.com',
  },
  'radisson-red-va-waterfront': {
    aliases: ['Radisson RED Hotel V&A Waterfront Cape Town'],
    destinationLabel: 'Cape Town',
    key: 'radisson-red-va-waterfront',
    name: 'Radisson RED Hotel V&A Waterfront',
    searchQuery: 'Radisson RED Hotel V&A Waterfront Cape Town site:booking.com',
  },
  'cape-grace-va-waterfront': {
    aliases: ['Cape Grace V&A Waterfront', 'Cape Grace, V&A Waterfront, A Fairmont Managed Hotel'],
    destinationLabel: 'Cape Town',
    key: 'cape-grace-va-waterfront',
    name: 'Cape Grace V&A Waterfront',
    searchQuery: 'Cape Grace V&A Waterfront Cape Town site:booking.com',
  },
  'waterfront-village-va': {
    aliases: ['Waterfront Village V&A Waterfront', 'Waterfront Village'],
    destinationLabel: 'Cape Town',
    key: 'waterfront-village-va',
    name: 'Waterfront Village V&A Waterfront',
    searchQuery: 'Waterfront Village V&A Waterfront Cape Town site:booking.com',
  },
  'southern-sun-waterfront': {
    aliases: ['Southern Sun Waterfront'],
    destinationLabel: 'Cape Town',
    key: 'southern-sun-waterfront',
    name: 'Southern Sun Waterfront',
    searchQuery: 'Southern Sun Waterfront Cape Town site:booking.com',
  },
  'president-hotel-cape-town': {
    aliases: ['President Hotel'],
    destinationLabel: 'Cape Town',
    key: 'president-hotel-cape-town',
    name: 'President Hotel',
    searchQuery: 'President Hotel Cape Town site:booking.com',
  },
  'the-bay-hotel': {
    aliases: ['The Bay Hotel'],
    destinationLabel: 'Cape Town',
    key: 'the-bay-hotel',
    name: 'The Bay Hotel',
    searchQuery: 'The Bay Hotel Camps Bay Cape Town site:booking.com',
  },
  'twelve-apostles-hotel-spa': {
    aliases: ['Twelve Apostles Hotel & Spa'],
    destinationLabel: 'Cape Town',
    key: 'twelve-apostles-hotel-spa',
    name: 'Twelve Apostles Hotel & Spa',
    searchQuery: 'Twelve Apostles Hotel Spa Cape Town site:booking.com',
  },
  'protea-hotel-sea-point': {
    aliases: ['Protea Hotel Sea Point'],
    destinationLabel: 'Cape Town',
    key: 'protea-hotel-sea-point',
    name: 'Protea Hotel Sea Point',
    searchQuery: 'Protea Hotel Sea Point Cape Town site:booking.com',
  },
  'the-marly-cape-town': {
    aliases: ['The Marly'],
    destinationLabel: 'Cape Town',
    key: 'the-marly-cape-town',
    name: 'The Marly',
    searchQuery: 'The Marly Camps Bay Cape Town site:booking.com',
  },
  'breakers-resort-apartments': {
    aliases: ['Breakers Resort Apartments'],
    destinationLabel: 'Umhlanga',
    key: 'breakers-resort-apartments',
    name: 'Breakers Resort Apartments',
    searchQuery: 'Breakers Resort Apartments Umhlanga site:booking.com',
  },
  'aha-gateway-hotel-umhlanga': {
    aliases: ['aha Gateway Hotel Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'aha-gateway-hotel-umhlanga',
    name: 'aha Gateway Hotel Umhlanga',
    searchQuery: 'aha Gateway Hotel Umhlanga site:booking.com',
  },
  'the-villa-umhlanga': {
    aliases: ['The Villa Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'the-villa-umhlanga',
    name: 'The Villa Umhlanga',
    searchQuery: 'The Villa Umhlanga site:booking.com',
  },
  'protea-hotel-durban-umhlanga': {
    aliases: ['Protea Hotel by Marriott Durban Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'protea-hotel-durban-umhlanga',
    name: 'Protea Hotel by Marriott Durban Umhlanga',
    searchQuery: 'Protea Hotel Marriott Durban Umhlanga site:booking.com',
  },
  'holiday-inn-express-umhlanga': {
    aliases: ['Holiday Inn Express Durban Umhlanga', 'Holiday Inn Express Durban - Umhlanga by IHG'],
    destinationLabel: 'Umhlanga',
    key: 'holiday-inn-express-umhlanga',
    name: 'Holiday Inn Express Durban Umhlanga',
    searchQuery: 'Holiday Inn Express Durban Umhlanga site:booking.com',
  },
  'hilton-garden-inn-umhlanga': {
    aliases: ['Hilton Garden Inn Umhlanga Arch'],
    destinationLabel: 'Umhlanga',
    key: 'hilton-garden-inn-umhlanga',
    name: 'Hilton Garden Inn Umhlanga Arch',
    searchQuery: 'Hilton Garden Inn Umhlanga Arch site:booking.com',
  },
  'premier-splendid-inn-umhlanga': {
    aliases: ['Premier Splendid Inn Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'premier-splendid-inn-umhlanga',
    name: 'Premier Splendid Inn Umhlanga',
    searchQuery: 'Premier Splendid Inn Umhlanga site:booking.com',
  },
  'first-group-breakers-resort': {
    aliases: ['First Group Breakers Resort', 'First Group Breakers Resort - Official'],
    destinationLabel: 'Umhlanga',
    key: 'first-group-breakers-resort',
    name: 'First Group Breakers Resort',
    searchQuery: 'First Group Breakers Resort Umhlanga site:booking.com',
  },
  'royal-palm-hotel-umhlanga': {
    aliases: ['Royal Palm Hotel'],
    destinationLabel: 'Umhlanga',
    key: 'royal-palm-hotel-umhlanga',
    name: 'Royal Palm Hotel',
    searchQuery: 'Royal Palm Hotel Umhlanga Durban site:booking.com',
  },
  'regal-inn-umhlanga-gateway': {
    aliases: ['Regal Inn Umhlanga Gateway'],
    destinationLabel: 'Umhlanga',
    key: 'regal-inn-umhlanga-gateway',
    name: 'Regal Inn Umhlanga Gateway',
    searchQuery: 'Regal Inn Umhlanga Gateway site:booking.com',
  },
  'premier-hotel-umhlanga': {
    aliases: ['Premier Hotel Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'premier-hotel-umhlanga',
    name: 'Premier Hotel Umhlanga',
    searchQuery: 'Premier Hotel Umhlanga site:booking.com',
  },
  'radisson-blu-durban-umhlanga': {
    aliases: ['Radisson Blu Hotel Durban Umhlanga', 'Radisson Blu Hotel, Durban Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'radisson-blu-durban-umhlanga',
    name: 'Radisson Blu Hotel Durban Umhlanga',
    searchQuery: 'Radisson Blu Hotel Durban Umhlanga site:booking.com',
  },
  'the-millennial-umhlanga': {
    aliases: ['The Millennial Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'the-millennial-umhlanga',
    name: 'The Millennial Umhlanga',
    searchQuery: 'The Millennial Umhlanga site:booking.com',
  },
  'breakers-resort-232': {
    aliases: ['Breakers Resort 232', 'Breakers Resort, Umhlanga, 232'],
    destinationLabel: 'Umhlanga',
    key: 'breakers-resort-232',
    name: 'Breakers Resort 232',
    searchQuery: 'Breakers Resort Umhlanga 232 site:booking.com',
  },
  'oceans-apartments-radisson-blu': {
    aliases: ['Oceans Apartments Balcony Suites Radisson Blu'],
    destinationLabel: 'Umhlanga',
    key: 'oceans-apartments-radisson-blu',
    name: 'Oceans Apartments Balcony Suites Radisson Blu',
    searchQuery: 'Oceans Apartments Balcony Suites Radisson Blu Umhlanga site:booking.com',
  },
  'town-lodge-umhlanga': {
    aliases: ['Town Lodge Umhlanga'],
    destinationLabel: 'Umhlanga',
    key: 'town-lodge-umhlanga',
    name: 'Town Lodge Umhlanga',
    searchQuery: 'Town Lodge Umhlanga site:booking.com',
  },
  '71-sea-lodge-beachfront': {
    aliases: ['71 Sea Lodge Beachfront Apartment'],
    destinationLabel: 'Umhlanga',
    key: '71-sea-lodge-beachfront',
    name: '71 Sea Lodge Beachfront Apartment',
    searchQuery: '71 Sea Lodge Beachfront Apartment Umhlanga site:booking.com',
  },
};

export function getPremiumHotelConfig(hotelKey: HotelKey) {
  return PREMIUM_HOTEL_CONFIGS[hotelKey] ?? null;
}

export function parseMoney(raw: string | undefined | null) {
  if (!raw) return null;
  const normalized = raw.replace(/,/g, '').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function getNightCount(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function buildBookingUrl(hotelKey: HotelKey, checkIn: string, checkOut: string, adults: number, rooms: number, bookingUrl?: string) {
  const baseUrl = bookingUrl ?? PREMIUM_HOTEL_CONFIGS[hotelKey].bookingUrl;
  if (!baseUrl) {
    throw new Error(`No booking URL available for ${PREMIUM_HOTEL_CONFIGS[hotelKey].name}`);
  }

  const url = new URL(baseUrl);
  url.searchParams.set('checkin', checkIn);
  url.searchParams.set('checkout', checkOut);
  url.searchParams.set('group_adults', String(adults));
  url.searchParams.set('group_children', '0');
  url.searchParams.set('no_rooms', String(Math.max(1, rooms)));
  url.searchParams.set('sb_price_type', 'total');
  url.searchParams.set('selected_currency', CURRENCY_CODE);
  url.searchParams.set('type', 'total');
  return url.toString();
}

export function parseRoomOptions(markdown: string, nights: number) {
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  const options: ParsedRoomOption[] = [];
  let currentRoomName: string | null = null;

  for (const line of lines) {
    const roomMatch = line.match(/^\|\s*\[([^\]]+)\]/);
    if (roomMatch) {
      currentRoomName = roomMatch[1];
    }

    if (!currentRoomName) continue;
    if (!line.includes('per night') || !line.includes('Price')) continue;

    const rateMatch = line.match(/(?:ZAR|R)\s*([\d,]+)<br>per night/i);
    const totalMatch = line.match(/<br>(?:ZAR|R)\s*([\d,]+)<br>Price/i);
    const maxPeopleMatch = line.match(/Max\. people:\s*(\d+)/i);
    const requiredRoomsMatch = line.match(/you'll need to select\s+(\d+)\s+of these/i);

    const ratePerNight = parseMoney(rateMatch?.[1]);
    const totalPrice = parseMoney(totalMatch?.[1]);
    if (ratePerNight === null || totalPrice === null) continue;

    const requiredRooms = Number(requiredRoomsMatch?.[1] || '1');
    const partyTotalPrice = totalPrice * requiredRooms;
    const partyNightlyRate = Number((partyTotalPrice / nights).toFixed(2));

    options.push({
      maxPeople: maxPeopleMatch ? Number(maxPeopleMatch[1]) : null,
      partyNightlyRate,
      partyTotalPrice,
      ratePerNight: Number((totalPrice / nights).toFixed(2)),
      raw: line,
      requiredRooms,
      roomMode: requiredRooms > 1 ? 'multiple_rooms' : 'single_room',
      roomName: currentRoomName,
      totalPrice,
    });
  }

  return options;
}

export function pickBestOption(options: ParsedRoomOption[], occupancy: OccupancyKey) {
  if (occupancy === '2_sleeper') {
    const exactTwo = options
      .filter((option) => option.requiredRooms === 1 && option.maxPeople === 2)
      .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice);

    if (exactTwo[0]) return exactTwo[0];

    return options
      .filter((option) => option.requiredRooms === 1 && (option.maxPeople === null || option.maxPeople >= 2))
      .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice)[0] || null;
  }

  return options
    .filter((option) => option.requiredRooms > 1 || (option.maxPeople !== null && option.maxPeople >= 4) || /Recommended for 4 adults/i.test(option.raw))
    .sort((a, b) => a.partyTotalPrice - b.partyTotalPrice)[0] || null;
}

async function firecrawlRequest(path: string, body: Record<string, unknown>) {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) {
    throw new Error('FIRECRAWL_API_KEY is not configured');
  }

  let response: Response;

  try {
    response = await fetch(`https://api.firecrawl.dev/v1/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`${path} timed out after ${SCRAPE_TIMEOUT_MS / 1000}s`);
    }

    throw error;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Firecrawl ${path} failed [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function resolveBookingListingUrl(hotelKey: HotelKey) {
  const config = PREMIUM_HOTEL_CONFIGS[hotelKey];
  if (config.bookingUrl) return config.bookingUrl;

  const data = await firecrawlRequest('search', {
    query: config.searchQuery,
    country: 'ZA',
    lang: 'en',
    limit: 5,
  });

  const results = Array.isArray(data?.data) ? data.data : [];
  const bookingMatch = results.find((result) => {
    const url = typeof result?.url === 'string' ? result.url : '';
    return url.includes('booking.com') && (url.includes('/hotel/') || url.includes('/searchresults'));
  });

  const url = typeof bookingMatch?.url === 'string' ? bookingMatch.url : null;
  if (!url) {
    throw new Error(`No Booking.com result found for ${config.name}`);
  }

  return url;
}

export async function scrapeMarkdown(url: string) {
  const data = await firecrawlRequest('scrape', {
    formats: ['markdown'],
    location: { country: 'ZA', languages: ['en'] },
    onlyMainContent: true,
    url,
    waitFor: 1500,
  });

  const markdown = data?.data?.markdown || data?.markdown;
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('Firecrawl scrape returned no markdown');
  }

  return markdown;
}

export async function scrapeLiveBookingRate(params: {
  checkIn: string;
  checkOut: string;
  hotelKey: HotelKey;
  occupancy: OccupancyKey;
  rooms: number;
}): Promise<LiveBookingRate> {
  const { checkIn, checkOut, hotelKey, occupancy, rooms } = params;
  const nights = getNightCount(checkIn, checkOut);
  const adults = occupancy === '2_sleeper' ? 2 : 4;
  const config = PREMIUM_HOTEL_CONFIGS[hotelKey];
  const listingUrl = await resolveBookingListingUrl(hotelKey);
  const sourceUrl = buildBookingUrl(hotelKey, checkIn, checkOut, adults, rooms, listingUrl);

  try {
    const markdown = await scrapeMarkdown(sourceUrl);
    const options = parseRoomOptions(markdown, nights);
    const bestOption = pickBestOption(options, occupancy);

    if (!bestOption) {
      return {
        available: false,
        checkIn,
        checkOut,
        currency: CURRENCY_CODE,
        displayNightlyRate: null,
        displayTotalPrice: null,
        hotelKey,
        hotelName: config.name,
        maxPeople: null,
        note: 'No matching room option was found for this occupancy.',
        partyNightlyRate: null,
        partyTotalPrice: null,
        ratePerNight: null,
        requiredRooms: 0,
        roomMode: null,
        roomName: null,
        sourceUrl,
        totalPrice: null,
      };
    }

    return {
      available: true,
      checkIn,
      checkOut,
      currency: CURRENCY_CODE,
      displayNightlyRate: occupancy === '2_sleeper' ? bestOption.ratePerNight : bestOption.partyNightlyRate,
      displayTotalPrice: occupancy === '2_sleeper' ? bestOption.totalPrice : bestOption.partyTotalPrice,
      hotelKey,
      hotelName: config.name,
      maxPeople: bestOption.maxPeople,
      note: bestOption.requiredRooms > 1 ? `${bestOption.requiredRooms} rooms required to fit 4 adults.` : null,
      partyNightlyRate: bestOption.partyNightlyRate,
      partyTotalPrice: bestOption.partyTotalPrice,
      ratePerNight: bestOption.ratePerNight,
      requiredRooms: bestOption.requiredRooms,
      roomMode: bestOption.roomMode,
      roomName: bestOption.roomName,
      sourceUrl,
      totalPrice: bestOption.totalPrice,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown scrape error';
    return {
      available: false,
      checkIn,
      checkOut,
      currency: CURRENCY_CODE,
      displayNightlyRate: null,
      displayTotalPrice: null,
      hotelKey,
      hotelName: config.name,
      maxPeople: null,
      note: message,
      partyNightlyRate: null,
      partyTotalPrice: null,
      ratePerNight: null,
      requiredRooms: 0,
      roomMode: null,
      roomName: null,
      sourceUrl,
      totalPrice: null,
    };
  }
}

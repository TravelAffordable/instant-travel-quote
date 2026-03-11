// Complete reference of all budget, affordable & premium hotels across all destinations
// Data sourced from reference documentation (Booking.com rates)

export type BudgetHotelEntry = {
  alias: string;
  realName: string;
  dest: string;
  tier: 'budget' | 'affordable' | 'premium';
  cap: '2_sleeper' | '4_sleeper';
  refRate: number;
  city: string;
  breakfast: boolean;
  roomType?: string;
};

export const BUDGET_AFFORDABLE_HOTELS: BudgetHotelEntry[] = [
  // ═══════════════════════════════════════════════════
  // DURBAN BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Durban Budget 2 Sleeper Option 1', realName: 'Impala Holiday Flats & Apartments', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 574, city: 'Durban', breakfast: false, roomType: 'Entire Studio' },
  { alias: 'Durban Budget 2 Sleeper Option 2', realName: 'Nomacurvy beach front accommodation', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 632, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 2 Sleeper Option 3', realName: 'Shaka Shores 2B', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 855, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 2 Sleeper Option 4', realName: 'The Balmoral - Halaal', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 888, city: 'Durban', breakfast: true, roomType: 'Entire Studio' },
  { alias: 'Durban Budget 2 Sleeper Option 5', realName: 'Yellow House 1101', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 900, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 2 Sleeper Option 6', realName: 'Beachurst Apartment', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 950, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 2 Sleeper Option 7', realName: 'Ocean View Holiday Apartment, Durban', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 968, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 2 Sleeper Option 8', realName: '9th Wonder at 10 South', dest: 'durban', tier: 'budget', cap: '2_sleeper', refRate: 975, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },

  // DURBAN BUDGET 4-SLEEPER
  { alias: 'Durban Budget 4 Sleeper Option 1', realName: 'Nomacurvy beach front accommodation', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 632, city: 'Durban', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 2', realName: 'Impala Holiday Flats & Apartments', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 956, city: 'Durban', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 3', realName: 'Ocean View Holiday Apartment, Durban', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 968, city: 'Durban', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 4', realName: 'Beachurst Apartment', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 981, city: 'Durban', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 5', realName: '9th Wonder at 10 South', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 989, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 6', realName: 'Vitamin Sea Luxury Apartment 204', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 1042, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 7', realName: 'Ocean view @ 10 south', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 1050, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Durban Budget 4 Sleeper Option 8', realName: 'Shaka Shores 2B', dest: 'durban', tier: 'budget', cap: '4_sleeper', refRate: 1060, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },

  // DURBAN AFFORDABLE 2-SLEEPER
  { alias: 'Durban Affordable 2 Sleeper Option 1', realName: 'The Balmoral - Halaal', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 888, city: 'Durban', breakfast: true, roomType: 'Entire Studio' },
  { alias: 'Durban Affordable 2 Sleeper Option 2', realName: 'Parade Hotel', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 972, city: 'Durban', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Durban Affordable 2 Sleeper Option 3', realName: 'Belaire Suites Hotel', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 979, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Durban Affordable 2 Sleeper Option 4', realName: 'Gooderson Tropicana Hotel', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 1067, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Durban Affordable 2 Sleeper Option 5', realName: 'Blue Waters Hotel', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 1078, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Durban Affordable 2 Sleeper Option 6', realName: 'Garden Court South Beach', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 1426, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Durban Affordable 2 Sleeper Option 7', realName: 'The Edward', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 1470, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Durban Affordable 2 Sleeper Option 8', realName: 'First Group The Palace All-Suite', dest: 'durban', tier: 'affordable', cap: '2_sleeper', refRate: 1500, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },

  // DURBAN AFFORDABLE 4-SLEEPER
  { alias: 'Durban Affordable 4 Sleeper Option 1', realName: 'Gooderson Tropicana Hotel', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 1668, city: 'Durban', breakfast: true, roomType: '2 Hotel Rooms' },
  { alias: 'Durban Affordable 4 Sleeper Option 2', realName: 'Blue Waters Hotel', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 1828, city: 'Durban', breakfast: true, roomType: 'Hotel Room (Up to 4)' },
  { alias: 'Durban Affordable 4 Sleeper Option 3', realName: 'The Balmoral - Halaal', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 1836, city: 'Durban', breakfast: true, roomType: '2 Entire Studios' },
  { alias: 'Durban Affordable 4 Sleeper Option 4', realName: 'Belaire Suites Hotel', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 1838, city: 'Durban', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Durban Affordable 4 Sleeper Option 5', realName: 'Parade Hotel', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 1944, city: 'Durban', breakfast: true, roomType: '2 Private Suites' },
  { alias: 'Durban Affordable 4 Sleeper Option 6', realName: 'Garden Court South Beach', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 2851, city: 'Durban', breakfast: true, roomType: '2 Hotel Rooms' },
  { alias: 'Durban Affordable 4 Sleeper Option 7', realName: 'The Edward', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 2900, city: 'Durban', breakfast: true, roomType: '2 Hotel Rooms' },
  { alias: 'Durban Affordable 4 Sleeper Option 8', realName: 'First Group The Palace All-Suite', dest: 'durban', tier: 'affordable', cap: '4_sleeper', refRate: 2950, city: 'Durban', breakfast: true, roomType: '2 Hotel Rooms' },

  // ═══════════════════════════════════════════════════
  // UMHLANGA BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Umhlanga Budget 2 Sleeper Option 1', realName: 'Breakers Resort Apartments', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1367, city: 'Umhlanga', breakfast: false, roomType: 'Entire Studio' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 2', realName: 'Mkhonto-PR The Millenial Durban, Umhlanga', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1463, city: 'Umhlanga', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 3', realName: 'Cozy Mellenial Umhlanga studio', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1530, city: 'Umhlanga', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 4', realName: 'The Oysters Umhlanga Family Apartment', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1538, city: 'Umhlanga', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 5', realName: 'Maison H Guest House', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1721, city: 'Umhlanga', breakfast: false, roomType: 'Private Room' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 6', realName: 'uShaka Manor Guest House', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1800, city: 'Umhlanga', breakfast: true, roomType: 'Private Room' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 7', realName: 'The Cozy Maldives', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1800, city: 'Umhlanga', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Umhlanga Budget 2 Sleeper Option 8', realName: 'The Millenial Studio 5', dest: 'umhlanga', tier: 'budget', cap: '2_sleeper', refRate: 1828, city: 'Umhlanga', breakfast: false, roomType: 'Entire Studio' },

  // UMHLANGA BUDGET 4-SLEEPER
  { alias: 'Umhlanga Budget 4 Sleeper Option 1', realName: 'Breakers Resort Apartments', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 1367, city: 'Umhlanga', breakfast: false, roomType: 'Entire Studio (Up to 4)' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 2', realName: 'The Oysters Umhlanga Family Apartment', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 1538, city: 'Umhlanga', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 3', realName: 'Mkhonto-PR The Millenial Durban, Umhlanga', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 1721, city: 'Umhlanga', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 4', realName: '66 The Shades Umhlanga', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 1850, city: 'Umhlanga', breakfast: false, roomType: 'Entire Vacation Home' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 5', realName: 'Beachbreak Holiday Letting', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 1900, city: 'Umhlanga', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 6', realName: 'Beacon Rock - 6 sleeper Luxurious Apartment', dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 2700, city: 'Umhlanga', breakfast: false, roomType: 'Three-Bedroom Apartment' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 7', realName: "Anchor's Rest Guesthouse and Self Catering", dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 2754, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Budget 4 Sleeper Option 8', realName: "Anchor's Rest Guesthouse and Self Catering", dest: 'umhlanga', tier: 'budget', cap: '4_sleeper', refRate: 2800, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },

  // UMHLANGA AFFORDABLE 2-SLEEPER
  { alias: 'Umhlanga Affordable 2 Sleeper Option 1', realName: 'The Pearls of Umhlanga, or Oceans Apts', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 1688, city: 'Umhlanga', breakfast: true, roomType: 'Entire Studio' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 2', realName: 'uShaka Manor Guest House', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 1800, city: 'Umhlanga', breakfast: true, roomType: 'Private Room' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 3', realName: 'Maison H Guest House', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 1817, city: 'Umhlanga', breakfast: true, roomType: 'Private Room' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 4', realName: 'The Capital Pearls Hotel', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 2893, city: 'Umhlanga', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 5', realName: 'North Star Micro Hotel', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 4422, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 6', realName: 'Beverly Hills', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 4722, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 7', realName: 'The Oyster Box', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 7918, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Umhlanga Affordable 2 Sleeper Option 8', realName: 'The Oyster Box', dest: 'umhlanga', tier: 'affordable', cap: '2_sleeper', refRate: 8000, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },

  // UMHLANGA AFFORDABLE 4-SLEEPER
  { alias: 'Umhlanga Affordable 4 Sleeper Option 1', realName: "Anchor's Rest Guesthouse and Self Catering", dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 2916, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 2', realName: 'The Pearls of Umhlanga, or Oceans Apts', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 3377, city: 'Umhlanga', breakfast: true, roomType: '2 Entire Studios' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 3', realName: 'uShaka Manor Guest House', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 3600, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 4', realName: 'Maison H Guest House', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 3779, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 5', realName: 'The Capital Pearls Hotel', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 6817, city: 'Umhlanga', breakfast: true, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 6', realName: 'North Star Micro Hotel', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 8843, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 7', realName: 'Beverly Hills', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 9000, city: 'Umhlanga', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Umhlanga Affordable 4 Sleeper Option 8', realName: 'Beverly Hills', dest: 'umhlanga', tier: 'affordable', cap: '4_sleeper', refRate: 9500, city: 'Umhlanga', breakfast: true, roomType: '2 Hotel Rooms' },

  // ═══════════════════════════════════════════════════
  // HARTBEESPOORT BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Harties Budget 2 Sleeper Option 1', realName: 'Out of Africa Lodge', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 600, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire bungalow' },
  { alias: 'Harties Budget 2 Sleeper Option 2', realName: 'Die Plasie on-suite rooms', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 633, city: 'Hartbeespoort', breakfast: false, roomType: 'On-suite room' },
  { alias: 'Harties Budget 2 Sleeper Option 3', realName: 'Chalet 2 Camping Style at Cynthias Country Outside bathrooms', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 680, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire chalet' },
  { alias: 'Harties Budget 2 Sleeper Option 4', realName: 'Sun Deck Lodge', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 690, city: 'Hartbeespoort', breakfast: false, roomType: 'Private room' },
  { alias: 'Harties Budget 2 Sleeper Option 5', realName: 'Nthsengedzeni resort harties', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 695, city: 'Hartbeespoort', breakfast: false, roomType: 'Tent' },
  { alias: 'Harties Budget 2 Sleeper Option 6', realName: 'Cottage 3 at Cynthias Country', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 707, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire vacation home' },
  { alias: 'Harties Budget 2 Sleeper Option 7', realName: 'Chalet 5 At Cynthias Country', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 713, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire chalet' },
  { alias: 'Harties Budget 2 Sleeper Option 8', realName: 'The Hart House', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 720, city: 'Hartbeespoort', breakfast: false, roomType: 'Private room' },
  { alias: 'Harties Budget 2 Sleeper Option 9', realName: 'Mansion Lodge', dest: 'harties', tier: 'budget', cap: '2_sleeper', refRate: 750, city: 'Hartbeespoort', breakfast: false, roomType: 'Private room' },

  // HARTBEESPOORT BUDGET 4-SLEEPER
  { alias: 'Harties Budget 4 Sleeper Option 1', realName: 'Harties Lodge - Meerhof Bay View 7 Family Room', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1100, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Budget 4 Sleeper Option 2', realName: 'Harties Is Africa Safari Lodge', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1251, city: 'Hartbeespoort', breakfast: false, roomType: 'Room with shared bathroom' },
  { alias: 'Harties Budget 4 Sleeper Option 3', realName: 'Mill Lane Farmhouse', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1282, city: 'Hartbeespoort', breakfast: false, roomType: 'Hotel room' },
  { alias: 'Harties Budget 4 Sleeper Option 4', realName: "Edwil's Place", dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1354, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Budget 4 Sleeper Option 5', realName: 'Chalet 2 Camping Style at Cynthias Country Outside bathrooms', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1361, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire chalet' },
  { alias: 'Harties Budget 4 Sleeper Option 6', realName: 'Sun Deck Lodge', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1400, city: 'Hartbeespoort', breakfast: false, roomType: 'Private room' },
  { alias: 'Harties Budget 4 Sleeper Option 7', realName: 'Out of Africa Lodge', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1440, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire chalet' },
  { alias: 'Harties Budget 4 Sleeper Option 8', realName: 'Mount Amanzi', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1500, city: 'Hartbeespoort', breakfast: false, roomType: 'One-Bedroom Chalet' },
  { alias: 'Harties Budget 4 Sleeper Option 9', realName: 'Mansion Lodge', dest: 'harties', tier: 'budget', cap: '4_sleeper', refRate: 1670, city: 'Hartbeespoort', breakfast: false, roomType: '2 Double Rooms' },

  // HARTBEESPOORT AFFORDABLE 2-SLEEPER
  { alias: 'Harties Affordable 2 Sleeper Option 1', realName: 'La Bastide Guest House', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1053, city: 'Hartbeespoort', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Harties Affordable 2 Sleeper Option 2', realName: "Vulture's View 5", dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1071, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 3', realName: 'Hartbees Bush Stay #1', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1080, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 4', realName: "Vulture's View 9", dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1080, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 5', realName: 'The Yacht House', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1080, city: 'Hartbeespoort', breakfast: false, roomType: 'Private Room' },
  { alias: 'Harties Affordable 2 Sleeper Option 6', realName: 'Harties Lodge - Meerhof Bay View 7', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1100, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 7', realName: 'Harties Lodge - Meerhof Bay View 8', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1100, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 8', realName: 'Harties Lodge - Meerhof Bay View 6', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1100, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire apartment' },
  { alias: 'Harties Affordable 2 Sleeper Option 9', realName: 'Leopard Lodge', dest: 'harties', tier: 'affordable', cap: '2_sleeper', refRate: 1500, city: 'Hartbeespoort', breakfast: true, roomType: 'Private Room' },

  // HARTBEESPOORT AFFORDABLE 4-SLEEPER
  { alias: 'Harties Affordable 4 Sleeper Option 1', realName: 'Guesthouse Serenity', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1607, city: 'Hartbeespoort', breakfast: false, roomType: '2 Private Rooms' },
  { alias: 'Harties Affordable 4 Sleeper Option 2', realName: 'Leopard Lodge', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1700, city: 'Hartbeespoort', breakfast: false, roomType: '2 Hotel Rooms' },
  { alias: 'Harties Affordable 4 Sleeper Option 3', realName: 'La Bastide Guest House', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1710, city: 'Hartbeespoort', breakfast: false, roomType: 'Entire Bungalow' },
  { alias: 'Harties Affordable 4 Sleeper Option 4', realName: 'Cathy & P Guesthouse', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1750, city: 'Hartbeespoort', breakfast: false, roomType: '2 Private Rooms' },
  { alias: 'Harties Affordable 4 Sleeper Option 5', realName: 'Pamensky Accommodation and Spa', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1750, city: 'Hartbeespoort', breakfast: false, roomType: 'Private Suite' },
  { alias: 'Harties Affordable 4 Sleeper Option 6', realName: 'Damascus Bush Lodge', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1847, city: 'Hartbeespoort', breakfast: false, roomType: '2 Hotel Rooms' },
  { alias: 'Harties Affordable 4 Sleeper Option 7', realName: 'Cock & Bull Restaurant - Pub - Accommodation', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1900, city: 'Hartbeespoort', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Harties Affordable 4 Sleeper Option 8', realName: 'Mansion Guest House', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 1950, city: 'Hartbeespoort', breakfast: false, roomType: '2 Private Rooms' },
  { alias: 'Harties Affordable 4 Sleeper Option 9', realName: 'Leopard Lodge', dest: 'harties', tier: 'affordable', cap: '4_sleeper', refRate: 3000, city: 'Hartbeespoort', breakfast: true, roomType: '2 Double Rooms' },

  // ═══════════════════════════════════════════════════
  // CAPE TOWN BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Cape Town Budget 2 Sleeper Option 1', realName: 'CapePod Sea Point', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 700, city: 'Cape Town', breakfast: false, roomType: 'Standard Double Room with Shared Bathroom' },
  { alias: 'Cape Town Budget 2 Sleeper Option 2', realName: 'Camborne Holiday Apartments', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 1400, city: 'Cape Town', breakfast: false, roomType: 'One-Bedroom Apartment' },
  { alias: 'Cape Town Budget 2 Sleeper Option 3', realName: 'Inn & Out Express Sea Point', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 851, city: 'Cape Town', breakfast: false, roomType: 'Economy Double Room' },
  { alias: 'Cape Town Budget 2 Sleeper Option 4', realName: 'Sea Point apartment', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 900, city: 'Cape Town', breakfast: false, roomType: 'Budget Double Room' },
  { alias: 'Cape Town Budget 2 Sleeper Option 5', realName: '4 on Highworth Apartments and Studios', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 999, city: 'Cape Town', breakfast: false, roomType: 'Studio Apartment' },
  { alias: 'Cape Town Budget 2 Sleeper Option 6', realName: 'Craigrownie Luxury Guest House', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 1360, city: 'Cape Town', breakfast: false, roomType: 'Premier King Room' },
  { alias: 'Cape Town Budget 2 Sleeper Option 7', realName: 'Albatross Guest House Bantry Bay', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 1368, city: 'Cape Town', breakfast: false, roomType: 'One-Bedroom Apartment' },
  { alias: 'Cape Town Budget 2 Sleeper Option 8', realName: 'MoTown by Mojo', dest: 'cape-town', tier: 'budget', cap: '2_sleeper', refRate: 1433, city: 'Cape Town', breakfast: false, roomType: 'Double Room with Shared Bathroom' },

  // CAPE TOWN BUDGET 4-SLEEPER
  { alias: 'Cape Town Budget 4 Sleeper Option 1', realName: 'CapePod Sea Point', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 1400, city: 'Cape Town', breakfast: false, roomType: '2x Standard Double Rooms' },
  { alias: 'Cape Town Budget 4 Sleeper Option 2', realName: 'Inn & Out Express Sea Point', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 1701, city: 'Cape Town', breakfast: false, roomType: '2x Economy Double Rooms' },
  { alias: 'Cape Town Budget 4 Sleeper Option 3', realName: 'Sea Point apartment', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 1800, city: 'Cape Town', breakfast: false, roomType: 'Suite + Deluxe Suite' },
  { alias: 'Cape Town Budget 4 Sleeper Option 4', realName: 'Stonehurst Guest House', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 2250, city: 'Cape Town', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Cape Town Budget 4 Sleeper Option 5', realName: 'Beautiful mountain view apartment in Sea Point', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 2825, city: 'Cape Town', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Cape Town Budget 4 Sleeper Option 6', realName: 'MoTown by Mojo', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 2520, city: 'Cape Town', breakfast: false, roomType: 'Family Room with Balcony' },
  { alias: 'Cape Town Budget 4 Sleeper Option 7', realName: 'Living the Beach Front Life', dest: 'cape-town', tier: 'budget', cap: '4_sleeper', refRate: 3700, city: 'Cape Town', breakfast: false, roomType: 'Two-Bedroom Apartment' },

  // CAPE TOWN AFFORDABLE 2-SLEEPER
  { alias: 'Cape Town Affordable 2 Sleeper Option 1', realName: 'Ami Vine House', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 1780, city: 'Cape Town', breakfast: true, roomType: 'One-Bedroom Cottage' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 2', realName: 'O on Kloof Boutique Hotel & Spa', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 2755, city: 'Cape Town', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 3', realName: 'The Tropicana Hotel', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 2910, city: 'Cape Town', breakfast: true, roomType: 'Standard Studio' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 4', realName: 'Premier Hotel Cape Town', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 3075, city: 'Cape Town', breakfast: true, roomType: 'Standard Double or Twin Room' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 5', realName: 'Mountview Guest House', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 3200, city: 'Cape Town', breakfast: true, roomType: 'Twin Room' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 6', realName: 'Villa Costa Rose', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 3285, city: 'Cape Town', breakfast: true, roomType: 'Double Room with Garden View' },
  { alias: 'Cape Town Affordable 2 Sleeper Option 7', realName: 'The Villa Rosa Hotel & Self-catering Apartments', dest: 'cape-town', tier: 'affordable', cap: '2_sleeper', refRate: 3800, city: 'Cape Town', breakfast: true, roomType: 'Deluxe Double or Twin Room' },

  // CAPE TOWN AFFORDABLE 4-SLEEPER
  { alias: 'Cape Town Affordable 4 Sleeper Option 1', realName: 'O on Kloof Boutique Hotel & Spa', dest: 'cape-town', tier: 'affordable', cap: '4_sleeper', refRate: 5990, city: 'Cape Town', breakfast: true, roomType: 'Standard Room + Deluxe Double' },
  { alias: 'Cape Town Affordable 4 Sleeper Option 2', realName: 'Premier Hotel Cape Town', dest: 'cape-town', tier: 'affordable', cap: '4_sleeper', refRate: 6151, city: 'Cape Town', breakfast: true, roomType: '2x Standard Double or Twin Rooms' },
  { alias: 'Cape Town Affordable 4 Sleeper Option 3', realName: 'The Tropicana Hotel', dest: 'cape-town', tier: 'affordable', cap: '4_sleeper', refRate: 6286, city: 'Cape Town', breakfast: true, roomType: 'Two-Bedroom Superior Apartment' },
  { alias: 'Cape Town Affordable 4 Sleeper Option 4', realName: 'Villa Costa Rose', dest: 'cape-town', tier: 'affordable', cap: '4_sleeper', refRate: 6670, city: 'Cape Town', breakfast: true, roomType: '2x Double Rooms' },

  // ═══════════════════════════════════════════════════
  // MPUMALANGA BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Mpumalanga Budget 2 Sleeper Option 1', realName: 'Ashridge Guesthouse & Safaris', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 666, city: 'Hazyview', breakfast: false, roomType: 'Double Room with Pool View' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 2', realName: 'VM Guesthouse', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 675, city: 'Hazyview', breakfast: false, roomType: 'Double Room' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 3', realName: 'Hazyview Country Cottages', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 680, city: 'Hazyview', breakfast: false, roomType: 'One-Bedroom Apartment' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 4', realName: 'BTV Guesthouse', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 689, city: 'Hazyview', breakfast: false, roomType: 'Deluxe Double Room with Shower' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 5', realName: 'Tshamani Self Catering', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 720, city: 'Hazyview', breakfast: false, roomType: 'One-Bedroom Apartment' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 6', realName: 'Nut Tree Nook', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 740, city: 'Hazyview', breakfast: false, roomType: 'Family Room with Garden View' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 7', realName: 'Matibidi Guest Lodge', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 442, city: 'Graskop', breakfast: false, roomType: 'Double Room' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 8', realName: "Elephant's Nest", dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 749, city: 'Graskop', breakfast: false, roomType: 'Deluxe Double Room' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 9', realName: 'Hamba Kancane Ma-Africa Guest House', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 770, city: 'Graskop', breakfast: false, roomType: 'Double Room with Private Bathroom' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 10', realName: 'Graskop Family Retreat and Backpackers', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 770, city: 'Graskop', breakfast: false, roomType: 'Family Bungalow' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 11', realName: 'Chosen Glamping Tents', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 800, city: 'Graskop', breakfast: false, roomType: 'Tent' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 12', realName: 'Horizon View Chalets', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 802, city: 'Graskop', breakfast: false, roomType: 'One-Bedroom Chalet' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 13', realName: 'Paradise View Guesthouse', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 810, city: 'Graskop', breakfast: false, roomType: 'Double or Twin Room' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 14', realName: 'Havana Nights', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 810, city: 'Graskop', breakfast: false, roomType: 'Two-Bedroom Chalet' },
  { alias: 'Mpumalanga Budget 2 Sleeper Option 15', realName: 'Four Seasons Self-Catering Guest House', dest: 'mpumalanga', tier: 'budget', cap: '2_sleeper', refRate: 884, city: 'Graskop', breakfast: false, roomType: 'Three-Bedroom Apartment' },

  // MPUMALANGA BUDGET 4-SLEEPER
  { alias: 'Mpumalanga Budget 4 Sleeper Option 1', realName: 'Hazyview Country Cottages', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 935, city: 'Hazyview', breakfast: false, roomType: 'Two Bedroomed Duplex Cottage' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 2', realName: 'Nut Tree Nook', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 986, city: 'Hazyview', breakfast: false, roomType: 'Family Room with Garden View' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 3', realName: 'Kanaan Guest Farm', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1100, city: 'Hazyview', breakfast: false, roomType: 'Quadruple Room' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 4', realName: "Masasana's Rest", dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1150, city: 'Hazyview', breakfast: false, roomType: 'Chalet 2 Bedroom' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 5', realName: 'Royal Bakoena Hamiltonparks Country Lodge', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1750, city: 'Hazyview', breakfast: true, roomType: 'Quadruple Room with Garden View' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 6', realName: 'Sagwadi Hotel', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 2031, city: 'Hazyview', breakfast: false, roomType: 'Premium Quadruple Room' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 7', realName: '41 on Clarendon', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 907, city: 'Graskop', breakfast: false, roomType: 'Four-Bedroom House' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 8', realName: 'Graskop Family Retreat and Backpackers', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 930, city: 'Graskop', breakfast: false, roomType: '10-Bed Mixed Dormitory Room' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 9', realName: 'Zur Alten Mine', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1500, city: 'Graskop', breakfast: false, roomType: 'Bungalow' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 10', realName: 'Log Cabin & Settlers Village', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1600, city: 'Graskop', breakfast: false, roomType: 'Chalet' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 11', realName: 'Mogodi Lodge', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1620, city: 'Graskop', breakfast: false, roomType: 'Family Room with Mountain View' },
  { alias: 'Mpumalanga Budget 4 Sleeper Option 12', realName: 'Kloofsig Holiday Cottages', dest: 'mpumalanga', tier: 'budget', cap: '4_sleeper', refRate: 1782, city: 'Graskop', breakfast: false, roomType: 'Two-Bedroom Chalet' },

  // MPUMALANGA AFFORDABLE 2-SLEEPER
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 1', realName: 'Kruger Adventure Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1125, city: 'Hazyview', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 2', realName: 'Royal Bakoena Hamiltonparks Country Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1242, city: 'Hazyview', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 3', realName: 'Mountain Creek Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1260, city: 'Hazyview', breakfast: false, roomType: 'Entire Chalet' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 4', realName: 'SleepOver Phabeni', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1377, city: 'Hazyview', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 5', realName: 'Tatenda Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1485, city: 'Hazyview', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 6', realName: 'Serra Azul Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1497, city: 'Hazyview', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 7', realName: 'ASANTE MOUNTAIN LODGE', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1530, city: 'Hazyview', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 8', realName: 'Mogodi Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1300, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 9', realName: 'Zur Alten Mine', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1400, city: 'Graskop', breakfast: true, roomType: 'Entire Chalet' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 10', realName: 'Mosswood Bed & Breakfast', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1696, city: 'Graskop', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 11', realName: 'Panorama Boutique Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 1985, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 12', realName: 'Westlodge at Graskop B&B', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 2145, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 13', realName: 'Dar Amane Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 2180, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 14', realName: 'Graskop Hotel', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 2248, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },
  { alias: 'Mpumalanga Affordable 2 Sleeper Option 15', realName: 'Panorama Villa', dest: 'mpumalanga', tier: 'affordable', cap: '2_sleeper', refRate: 2655, city: 'Graskop', breakfast: true, roomType: 'Standard Room' },

  // MPUMALANGA AFFORDABLE 4-SLEEPER
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 1', realName: 'Royal Bakoena Hamiltonparks Country Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 1750, city: 'Hazyview', breakfast: true, roomType: 'Hotel Room (3 beds)' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 2', realName: 'Kruger Adventure Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2249, city: 'Hazyview', breakfast: true, roomType: 'Hotel Room (3 beds)' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 3', realName: 'Mountain Creek Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2520, city: 'Hazyview', breakfast: false, roomType: 'Entire Chalet' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 4', realName: 'SleepOver Phabeni', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2754, city: 'Hazyview', breakfast: true, roomType: '2 Hotel Rooms' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 5', realName: 'Tatenda Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2849, city: 'Hazyview', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 6', realName: 'Hotel Numbi & Garden Suites', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2900, city: 'Hazyview', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 7', realName: 'Serra Azul Lodge', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 2994, city: 'Hazyview', breakfast: true, roomType: '2 Private Suites' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 8', realName: 'Graskop Hotel', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 3539, city: 'Graskop', breakfast: true, roomType: 'Hotel Room (3 beds)' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 9', realName: 'Mosswood Bed & Breakfast', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 3691, city: 'Graskop', breakfast: true, roomType: 'Private Suite + Private Room' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 10', realName: 'Panorama Boutique Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 3969, city: 'Graskop', breakfast: true, roomType: '2 Private Rooms' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 11', realName: 'Dar Amane Guest House', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 4093, city: 'Graskop', breakfast: true, roomType: 'Private Room' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 12', realName: 'Westlodge at Graskop B&B', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 4205, city: 'Graskop', breakfast: true, roomType: 'Entire Studio' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 13', realName: 'Panorama Villa', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 6750, city: 'Graskop', breakfast: true, roomType: 'Private Suite' },
  { alias: 'Mpumalanga Affordable 4 Sleeper Option 14', realName: 'Angels View Hotel', dest: 'mpumalanga', tier: 'affordable', cap: '4_sleeper', refRate: 7865, city: 'Graskop', breakfast: true, roomType: '2 Hotel Rooms' },

  // ═══════════════════════════════════════════════════
  // BELA-BELA BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Bela-Bela Budget 2 Sleeper Option 1', realName: 'Aruka', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 405, city: 'Bela-Bela', breakfast: false, roomType: 'Budget Double Room' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 2', realName: 'Shala Mushe Tented Camp & Camp', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 583, city: 'Bela-Bela', breakfast: false, roomType: 'One-Bedroom Chalet' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 3', realName: 'Modubu Lodge', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 627, city: 'Bela-Bela', breakfast: false, roomType: 'One-Bedroom Chalet' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 4', realName: 'Gallery Inn', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 630, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 5', realName: 'Warmbaths Thai Spa and Guest House', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 650, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room with Private Bathroom' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 6', realName: 'Flamboyant Guesthouse', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 700, city: 'Bela-Bela', breakfast: false, roomType: 'Budget Twin Room' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 7', realName: 'SERENE ACCOMMODATION PALACE', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 720, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room with Shared Bathroom' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 8', realName: 'Joyful Home Bela-Bela', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 765, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room' },
  { alias: 'Bela-Bela Budget 2 Sleeper Option 9', realName: 'Light House Lodge', dest: 'bela-bela', tier: 'budget', cap: '2_sleeper', refRate: 799, city: 'Bela-Bela', breakfast: false, roomType: 'Deluxe Double Room' },

  // BELA-BELA BUDGET 4-SLEEPER
  { alias: 'Bela-Bela Budget 4 Sleeper Option 1', realName: 'Shala Mushe Tented Camp & Camp', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 583, city: 'Bela-Bela', breakfast: false, roomType: 'One-Bedroom Chalet (3 beds)' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 2', realName: 'Modubu Lodge', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 627, city: 'Bela-Bela', breakfast: false, roomType: 'One-Bedroom Chalet' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 3', realName: 'Unit 2, Pendleberry Grove Holidays', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1152, city: 'Bela-Bela', breakfast: false, roomType: 'One-Bedroom Apartment' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 4', realName: 'Falcon Lodge PK', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1215, city: 'Bela-Bela', breakfast: false, roomType: 'Two-Bedroom Apartment' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 5', realName: 'Hoogland Spa Resort Bela Bela', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1260, city: 'Bela-Bela', breakfast: false, roomType: 'Two-Bedroom Chalet' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 6', realName: 'Gallery Inn', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1260, city: 'Bela-Bela', breakfast: false, roomType: 'Double or Twin Room' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 7', realName: 'Warmbaths Thai Spa and Guest House', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1350, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room with Private Bathroom' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 8', realName: '27 Pendleberry Grove, Chris Hani Drive', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1350, city: 'Bela-Bela', breakfast: false, roomType: 'Apartment (3 bedrooms)' },
  { alias: 'Bela-Bela Budget 4 Sleeper Option 9', realName: 'Aruka', dest: 'bela-bela', tier: 'budget', cap: '4_sleeper', refRate: 1400, city: 'Bela-Bela', breakfast: false, roomType: 'Cottage with Garden View' },

  // BELA-BELA AFFORDABLE 2-SLEEPER
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 1', realName: 'La Bushka Guesthouse', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 800, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 2', realName: 'Ebenhaeser overnight accomodation', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 800, city: 'Bela-Bela', breakfast: false, roomType: 'Superior Double Room' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 3', realName: 'Lodge Huge Dassie', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 850, city: 'Bela-Bela', breakfast: false, roomType: 'Standard Apartment' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 4', realName: 'La Bella B&B Under The Fig Tree', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 880, city: 'Bela-Bela', breakfast: false, roomType: 'Double or Twin Room with Shower' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 5', realName: 'Divine Sleep', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 891, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 6', realName: 'Bela Valley Guest House', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 899, city: 'Bela-Bela', breakfast: false, roomType: 'Deluxe Double Room' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 7', realName: 'Lemón Cottage', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 900, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room with Garden View' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 8', realName: 'Genesis Guesthouze', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 903, city: 'Bela-Bela', breakfast: false, roomType: 'Standard Double Room' },
  { alias: 'Bela-Bela Affordable 2 Sleeper Option 9', realName: 'Mmakgabo Boutique Lodge', dest: 'bela-bela', tier: 'affordable', cap: '2_sleeper', refRate: 945, city: 'Bela-Bela', breakfast: false, roomType: 'Standard Queen Room' },

  // BELA-BELA AFFORDABLE 4-SLEEPER
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 1', realName: '15 On Reitz Bela bela', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1513, city: 'Bela-Bela', breakfast: false, roomType: 'Three-Bedroom House' },
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 2', realName: 'The Villa Manor & Spa Exclusive Escape', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1540, city: 'Bela-Bela', breakfast: false, roomType: 'Apartment - Split Level' },
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 3', realName: 'Flamboyant Guesthouse', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1540, city: 'Bela-Bela', breakfast: false, roomType: 'Standard Quadruple Room' },
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 4', realName: 'La Bushka Guesthouse', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1600, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room (x2)' },
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 5', realName: 'Joyful Home Bela-Bela', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1615, city: 'Bela-Bela', breakfast: false, roomType: 'Double Room / Deluxe Room' },
  { alias: 'Bela-Bela Affordable 4 Sleeper Option 6', realName: 'De Kunst Huisje', dest: 'bela-bela', tier: 'affordable', cap: '4_sleeper', refRate: 1670, city: 'Bela-Bela', breakfast: false, roomType: 'Two-Bedroom Apartment' },

  // ═══════════════════════════════════════════════════
  // MAGALIESBURG BUDGET 2-SLEEPER
  // ═══════════════════════════════════════════════════
  { alias: 'Magalies Budget 2 Sleeper Option 1', realName: 'CradleLicious camp & caravan', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 351, city: 'Magaliesburg', breakfast: false, roomType: 'Tent' },
  { alias: 'Magalies Budget 2 Sleeper Option 2', realName: 'Krugersdorp Guest House', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 405, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Magalies Budget 2 Sleeper Option 3', realName: 'Budget Stays at Olivia Pines Guesthouse', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 419, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Magalies Budget 2 Sleeper Option 4', realName: 'Lekkerrus guesthouse', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 532, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Budget 2 Sleeper Option 5', realName: 'Amberlight Self Catering Accommodation', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 540, city: 'Magaliesburg', breakfast: false, roomType: 'Self Catering Room' },
  { alias: 'Magalies Budget 2 Sleeper Option 6', realName: 'Hyswan Self Catering Guesthouse', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 663, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Budget 2 Sleeper Option 7', realName: 'Palmera Guest House', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 693, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Magalies Budget 2 Sleeper Option 8', realName: 'Inni Bush Guesthouse', dest: 'magalies', tier: 'budget', cap: '2_sleeper', refRate: 697, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },

  // MAGALIESBURG BUDGET 4-SLEEPER
  { alias: 'Magalies Budget 4 Sleeper Option 1', realName: 'CradleLicious camp & caravan', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 367, city: 'Magaliesburg', breakfast: false, roomType: 'Tent' },
  { alias: 'Magalies Budget 4 Sleeper Option 2', realName: 'Budget Stays at Olivia Pines Guesthouse', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 839, city: 'Magaliesburg', breakfast: false, roomType: '2 Rooms with Shared Bathrooms' },
  { alias: 'Magalies Budget 4 Sleeper Option 3', realName: 'Cave view Cottages', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 855, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Budget 4 Sleeper Option 4', realName: 'Cave View self catering cottages', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 891, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Budget 4 Sleeper Option 5', realName: 'Cave View self catering Silo', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 940, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Budget 4 Sleeper Option 6', realName: 'Affordable Hyswan Family Guesthouse', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 1058, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Budget 4 Sleeper Option 7', realName: 'LikeHome Guesthouse', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 1080, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Budget 4 Sleeper Option 8', realName: 'Palmera Guest House', dest: 'magalies', tier: 'budget', cap: '4_sleeper', refRate: 1100, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },

  // MAGALIESBURG AFFORDABLE 2-SLEEPER
  { alias: 'Magalies Affordable 2 Sleeper Option 1', realName: 'Cave View Self Catering Cottages', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 713, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Affordable 2 Sleeper Option 2', realName: 'CradleLicious Nguni Farm Cottage', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 780, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Affordable 2 Sleeper Option 3', realName: 'Kromdraai Guest Rooms', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 800, city: 'Magaliesburg', breakfast: false, roomType: 'Guest Room' },
  { alias: 'Magalies Affordable 2 Sleeper Option 4', realName: 'Affordable Hyswan Family Guesthouse', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 846, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Affordable 2 Sleeper Option 5', realName: "The Cradle's Rest Guest House", dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 850, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Magalies Affordable 2 Sleeper Option 6', realName: 'Cave view Cottages', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 855, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Affordable 2 Sleeper Option 7', realName: 'MaU Bed and Breakfast', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 885, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Affordable 2 Sleeper Option 8', realName: 'Greenstone Guesthouse', dest: 'magalies', tier: 'affordable', cap: '2_sleeper', refRate: 900, city: 'Magaliesburg', breakfast: false, roomType: 'Guest House Room' },

  // MAGALIESBURG AFFORDABLE 4-SLEEPER
  { alias: 'Magalies Affordable 4 Sleeper Option 1', realName: 'LikeHome Guesthouse', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1080, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Affordable 4 Sleeper Option 2', realName: 'Palmera Guest House', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1256, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Affordable 4 Sleeper Option 3', realName: 'Amberlight Self Catering Accommodation', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1260, city: 'Magaliesburg', breakfast: false, roomType: 'Private Suite' },
  { alias: 'Magalies Affordable 4 Sleeper Option 4', realName: "The Cradle's Rest Guest House", dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1368, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Affordable 4 Sleeper Option 5', realName: 'The Cradle Berry Farm', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1485, city: 'Magaliesburg', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Magalies Affordable 4 Sleeper Option 6', realName: 'Greenstone Guesthouse', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1499, city: 'Magaliesburg', breakfast: false, roomType: 'Private Room' },
  { alias: 'Magalies Affordable 4 Sleeper Option 7', realName: 'Cozy cottage in the Cradle of Humankind', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1600, city: 'Magaliesburg', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Magalies Affordable 4 Sleeper Option 8', realName: 'Kromdraai Guest Rooms', dest: 'magalies', tier: 'affordable', cap: '4_sleeper', refRate: 1700, city: 'Magaliesburg', breakfast: false, roomType: '2 Private Rooms' },
];

// ═══════════════════════════════════════════════════
// PREMIUM HOTELS (all destinations)
// ═══════════════════════════════════════════════════
export const PREMIUM_HOTELS: BudgetHotelEntry[] = [
  // HARTIES PREMIUM
  { alias: 'Indlovukazi Guesthouse', realName: 'Indlovukazi Guesthouse', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1150, city: 'Hartbeespoort', breakfast: true, roomType: 'Guest House Room' },
  { alias: 'Villa Paradiso Hotel', realName: 'Villa Paradiso Hotel', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Hartbeespoort', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Cocomo Boutique Hotel', realName: 'Cocomo Boutique Hotel', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Hartbeespoort', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'The Riverleaf Hotel', realName: 'The Riverleaf Hotel', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Hartbeespoort', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Kosmos Manor', realName: 'Kosmos Manor', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Hartbeespoort', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Palm Swift Luxury', realName: 'Palm Swift Luxury', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Hartbeespoort', breakfast: true, roomType: 'Guest House Room' },
  { alias: 'The Venue Country Hotel and Spa', realName: 'The Venue Country Hotel and Spa', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1093, city: 'Hartbeespoort', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Waterfront Guesthouse', realName: 'Waterfront Guesthouse', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 840, city: 'Hartbeespoort', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'MetsingAt Harties', realName: 'MetsingAt Harties', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1134, city: 'Hartbeespoort', breakfast: true, roomType: 'Guest House Room' },
  { alias: 'Marina View Guesthouse', realName: 'Marina View Guesthouse', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Hartbeespoort', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Cozy Kosmos', realName: 'Cozy Kosmos', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 1000, city: 'Hartbeespoort', breakfast: true, roomType: 'Guest House Room' },
  { alias: 'Serenity Guesthouse', realName: 'Serenity Guesthouse', dest: 'harties', tier: 'premium', cap: '2_sleeper', refRate: 900, city: 'Hartbeespoort', breakfast: false, roomType: 'Guest House Room' },

  // MAGALIES PREMIUM
  { alias: 'Mount Grace Hotel And Spa', realName: 'Mount Grace Hotel And Spa', dest: 'magalies', tier: 'premium', cap: '2_sleeper', refRate: 2988, city: 'Magaliesburg', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Cradle Boutique Hotel', realName: 'Cradle Boutique Hotel', dest: 'magalies', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Magaliesburg', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Valley Lodge & Spa', realName: 'Valley Lodge & Spa', dest: 'magalies', tier: 'premium', cap: '2_sleeper', refRate: 2289, city: 'Magaliesburg', breakfast: true, roomType: 'Hotel Room' },

  // DURBAN PREMIUM
  { alias: 'Blue Waters Hotel', realName: 'Blue Waters Hotel', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1078, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Garden Court South Beach', realName: 'Garden Court South Beach', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1426, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'The Edward', realName: 'The Edward', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1470, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'The Balmoral', realName: 'The Balmoral', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 888, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Belaire Suites Hotel', realName: 'Belaire Suites Hotel', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 979, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Gooderson Tropicana Hotel', realName: 'Gooderson Tropicana Hotel', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1067, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Gooderson Leisure Silver Sands 2', realName: 'Gooderson Leisure Silver Sands 2', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Durban', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'First Group The Palace All-Suite', realName: 'First Group The Palace All-Suite', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Garden Court Marine Parade', realName: 'Garden Court Marine Parade', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1400, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Southern Sun Elangeni & Maharani Hotel', realName: 'Southern Sun Elangeni & Maharani Hotel', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1601, city: 'Durban', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Suncoast Hotel & Towers', realName: 'Suncoast Hotel & Towers', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Durban', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Sea Esta Luxury Apartment 107', realName: 'Sea Esta Luxury Apartment 107', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Beach Hurst 303', realName: 'Beach Hurst 303', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'UshakaViews', realName: 'UshakaViews', dest: 'durban', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Durban', breakfast: false, roomType: 'Entire Apartment' },

  // UMHLANGA PREMIUM
  { alias: 'Breakers Resort Apartments', realName: 'Breakers Resort Apartments', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Umhlanga', breakfast: false, roomType: 'Resort Room' },
  { alias: 'aha Gateway Hotel Umhlanga', realName: 'aha Gateway Hotel Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1350, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'The Villa Umhlanga', realName: 'The Villa Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1361, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Protea Hotel by Marriott Durban Umhlanga', realName: 'Protea Hotel by Marriott Durban Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1848, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Holiday Inn Express Durban Umhlanga', realName: 'Holiday Inn Express Durban - Umhlanga by IHG', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1520, city: 'Umhlanga', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Hilton Garden Inn Umhlanga Arch', realName: 'Hilton Garden Inn Umhlanga Arch', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1539, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Premier Splendid Inn Umhlanga', realName: 'Premier Splendid Inn Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'First Group Breakers Resort', realName: 'First Group Breakers Resort - Official', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1150, city: 'Umhlanga', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Royal Palm Hotel', realName: 'Royal Palm Hotel', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1250, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Regal Inn Umhlanga Gateway', realName: 'Regal Inn Umhlanga Gateway', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Premier Hotel Umhlanga', realName: 'Premier Hotel Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1300, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Radisson Blu Hotel Durban Umhlanga', realName: 'Radisson Blu Hotel Durban Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 3341, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'The Millennial Umhlanga', realName: 'The Millennial Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Umhlanga', breakfast: false, roomType: 'Apartment' },
  { alias: 'Breakers Resort 232', realName: 'Breakers Resort 232', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Umhlanga', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Oceans Apartments Radisson Blu', realName: 'Oceans Apartments Balcony Suites Radisson Blu', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 3596, city: 'Umhlanga', breakfast: false, roomType: 'Apartment' },
  { alias: 'Town Lodge Umhlanga', realName: 'Town Lodge Umhlanga', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Umhlanga', breakfast: false, roomType: 'Hotel Room' },
  { alias: '71 Sea Lodge Beachfront Apartment', realName: '71 Sea Lodge Beachfront Apartment', dest: 'umhlanga', tier: 'premium', cap: '2_sleeper', refRate: 1000, city: 'Umhlanga', breakfast: false, roomType: 'Apartment' },

  // CAPE TOWN PREMIUM
  { alias: 'Sea Point Apartment', realName: 'Sea Point Apartment', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 900, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'The Bantry Aparthotel by Totalstay', realName: 'The Bantry Aparthotel by Totalstay', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Casa on Kei by Totalstay', realName: 'Casa on Kei by Totalstay', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Spring Tide Inn by CTHA', realName: 'Spring Tide Inn by CTHA', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'First Group Riviera Suites', realName: 'First Group Riviera Suites', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Home Suite Hotels Sea Point', realName: 'Home Suite Hotels Sea Point', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1350, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Camps Bay Village', realName: 'Camps Bay Village', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: '3 On Camps Bay', realName: '3 On Camps Bay', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2200, city: 'Cape Town', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Camps Bay Beach Front Apartment', realName: 'Camps Bay Beach Front Apartment', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2500, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Camps Bay Private Room', realName: 'Camps Bay private room and bathroom', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Cape Town', breakfast: false, roomType: 'Private Room' },
  { alias: 'Camps Bay Studio', realName: 'Camps Bay Studio with private patio', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1400, city: 'Cape Town', breakfast: false, roomType: 'Studio' },
  { alias: 'Cape Diamond Boutique Hotel', realName: 'Cape Diamond Boutique Hotel', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Fountains Hotel', realName: 'Fountains Hotel', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Holiday Inn Express Cape Town', realName: 'Holiday Inn Express Cape Town City Centre', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1250, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Hotel Sky Cape Town', realName: 'Hotel Sky Cape Town', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1300, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Cresta Grande Cape Town', realName: 'Cresta Grande Cape Town', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1150, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Radisson Hotel Cape Town Foreshore', realName: 'Radisson Hotel Cape Town Foreshore', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'ONOMO Hotel Inn On The Square', realName: 'ONOMO Hotel Cape Town Inn On The Square', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'ONOMO Hotel Foreshore', realName: 'ONOMO Hotel Foreshore', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'First Beach 203 by CTHA', realName: 'First Beach 203 by CTHA', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2000, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Clifton YOLO Spaces', realName: 'Clifton YOLO Spaces', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2800, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Radisson RED V&A Waterfront', realName: 'Radisson RED Hotel V&A Waterfront Cape Town', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2100, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Cape Grace V&A Waterfront', realName: 'Cape Grace, V&A Waterfront, A Fairmont Managed Hotel', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 5500, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Waterfront Village V&A', realName: 'Waterfront Village V&A Waterfront', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2400, city: 'Cape Town', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Southern Sun Waterfront', realName: 'Southern Sun Waterfront', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 2000, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'President Hotel', realName: 'President Hotel', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1600, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'The Bay Hotel', realName: 'The Bay Hotel', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 3200, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Twelve Apostles Hotel & Spa', realName: 'Twelve Apostles Hotel & Spa', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 6000, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Protea Hotel Sea Point', realName: 'Protea Hotel Sea Point', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Cape Town', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'The Marly', realName: 'The Marly', dest: 'cape-town', tier: 'premium', cap: '2_sleeper', refRate: 3500, city: 'Cape Town', breakfast: false, roomType: 'Hotel Room' },

  // SUN CITY PREMIUM
  { alias: 'Bakubung Bush Lodge', realName: 'Bakubung Bush Lodge', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 3200, city: 'Sun City', breakfast: true, roomType: 'Lodge Room' },
  { alias: 'The Kingdom Resort', realName: 'The Kingdom Resort', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 2500, city: 'Sun City', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Kwa Maritane Lodge', realName: 'Kwa Maritane Lodge', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 3500, city: 'Sun City', breakfast: true, roomType: 'Lodge Room' },
  { alias: 'Sundown Country Estate', realName: 'Sundown Country Estate', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Sun City', breakfast: false, roomType: 'Guest House Room' },
  { alias: "Getty's Bed and Breakfast", realName: "Getty's Bed and Breakfast", dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 800, city: 'Sun City', breakfast: true, roomType: 'B&B Room' },
  { alias: 'Valley View Guest House', realName: 'Valley View Guest House', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 750, city: 'Sun City', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Ivory Tree Game Lodge', realName: 'Ivory Tree Game Lodge', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 4000, city: 'Sun City', breakfast: true, roomType: 'Lodge Room' },
  { alias: 'Pilanesberg Hotel', realName: 'Pilanesberg Hotel', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Sun City', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Kedar Heritage Lodge', realName: 'Kedar Heritage Lodge Conference Centre & Spa', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 2200, city: 'Sun City', breakfast: true, roomType: 'Lodge Room' },
  { alias: 'Royal Marang Hotel', realName: 'Royal Marang Hotel', dest: 'sun-city', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Sun City', breakfast: false, roomType: 'Hotel Room' },

  // MPUMALANGA PREMIUM
  { alias: 'Graskop Hotel', realName: 'Graskop Hotel', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Graskop', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Laguna Lodge', realName: 'Laguna Lodge', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Graskop', breakfast: false, roomType: 'Lodge Room' },
  { alias: 'Panorama Chalets', realName: 'Panorama Chalets and Rest Camp', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 800, city: 'Graskop', breakfast: false, roomType: 'Chalet' },
  { alias: 'Lush', realName: 'Lush', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Graskop', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Panorama Villa', realName: 'Panorama Villa', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 850, city: 'Graskop', breakfast: false, roomType: 'Villa' },
  { alias: 'Beach Island Graskop', realName: 'Beach Island Graskop', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 750, city: 'Graskop', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Panorama Boutique Guesthouse', realName: 'Panorama Boutique Guesthouse', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Graskop', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Angels View Hotel', realName: 'Angels View Hotel', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1300, city: 'Graskop', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Blyde Canyon Forever Resort', realName: 'Blyde Canyon Forever Resort', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1400, city: 'Graskop', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Amafu Forest Lodge', realName: 'Amafu Forest Lodge', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Graskop', breakfast: false, roomType: 'Lodge Room' },
  { alias: 'Blyde Mountain Lodge', realName: 'Blyde Mountain Lodge', dest: 'mpumalanga', tier: 'premium', cap: '2_sleeper', refRate: 1250, city: 'Graskop', breakfast: false, roomType: 'Lodge Room' },

  // KNYSNA PREMIUM
  { alias: 'The Russel Hotel', realName: 'The Russel Hotel', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Knysna', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Knysna Log-Inn Hotel', realName: 'Knysna Log-Inn Hotel', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1350, city: 'Knysna', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'aha The Rex Hotel', realName: 'aha The Rex Hotel', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1500, city: 'Knysna', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Protea Hotel Knysna Quays', realName: 'Protea Hotel by Marriott Knysna Quays', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1800, city: 'Knysna', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'TH39 Thesen Islands', realName: 'TH39 Thesen Islands', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 2200, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Belle View @ Knysna Quays', realName: 'Belle View @ Knysna Quays', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Knysna Inn', realName: 'Knysna Inn', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 900, city: 'Knysna', breakfast: false, roomType: 'Hotel Room' },
  { alias: 'Gem Quays Waterfront', realName: 'Gem Quays Waterfront', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Amazing Views Knysna', realName: 'Amazing Views, Comfortable living space, Knysna', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'KnysnaQuays 4', realName: 'KnysnaQuays 4', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1000, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Waterfront Apartment Knysna', realName: 'Waterfront Apartment, Waterfront', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1150, city: 'Knysna', breakfast: false, roomType: 'Entire Apartment' },
  { alias: 'Knysna Houseboats', realName: 'Knysna Houseboats', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1400, city: 'Knysna', breakfast: false, roomType: 'Houseboat' },
  { alias: 'Spinnaker Quays Waterfront Villa', realName: 'Spinnaker Quays Waterfront Villa', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1600, city: 'Knysna', breakfast: false, roomType: 'Entire Villa' },
  { alias: 'Phoenix Lodge Knysna', realName: 'Phoenix Lodge and Waterside Accommodation', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1050, city: 'Knysna', breakfast: false, roomType: 'Lodge Room' },
  { alias: 'Pezula Golf Estate', realName: 'Knysna, Pezula Golf Estate', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 2500, city: 'Knysna', breakfast: false, roomType: 'Entire Villa' },
  { alias: 'Issaquena Heights Boutique Hotel', realName: 'Issaquena Heights Boutique Hotel', dest: 'knysna', tier: 'premium', cap: '2_sleeper', refRate: 1300, city: 'Knysna', breakfast: false, roomType: 'Hotel Room' },

  // VAAL RIVER PREMIUM
  { alias: 'Riviera on the Vaal', realName: 'Riviera on the Vaal', dest: 'vaal-river', tier: 'premium', cap: '2_sleeper', refRate: 2000, city: 'Vaal River', breakfast: true, roomType: 'Hotel Room' },
  { alias: 'Clivia Lodge', realName: 'Clivia Lodge', dest: 'vaal-river', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Vaal River', breakfast: false, roomType: 'Lodge Room' },
  { alias: 'Troas Boutique Hotel', realName: 'Troas Boutique Hotel', dest: 'vaal-river', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Vaal River', breakfast: false, roomType: 'Hotel Room' },
  { alias: '12 On Vaal Drive Guesthouse', realName: '12 On Vaal Drive Guesthouse', dest: 'vaal-river', tier: 'premium', cap: '2_sleeper', refRate: 900, city: 'Vaal River', breakfast: false, roomType: 'Guest House Room' },
  { alias: 'Casa Angelo', realName: 'Casa Angelo', dest: 'vaal-river', tier: 'premium', cap: '2_sleeper', refRate: 950, city: 'Vaal River', breakfast: false, roomType: 'Guest House Room' },

  // BELA BELA PREMIUM
  { alias: 'Mabalingwe Nature Reserve', realName: 'Mabalingwe Nature Reserve', dest: 'bela-bela', tier: 'premium', cap: '2_sleeper', refRate: 1200, city: 'Bela Bela', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Mabula Game Lodge', realName: 'Mabula Game Lodge', dest: 'bela-bela', tier: 'premium', cap: '2_sleeper', refRate: 3500, city: 'Bela Bela', breakfast: true, roomType: 'Lodge Room' },
  { alias: 'Warmbaths Forever Resort', realName: 'Warmbaths Forever Resort', dest: 'bela-bela', tier: 'premium', cap: '2_sleeper', refRate: 1100, city: 'Bela Bela', breakfast: false, roomType: 'Resort Room' },
  { alias: 'Zebra Country Lodge', realName: 'Zebra Country Lodge', dest: 'bela-bela', tier: 'premium', cap: '2_sleeper', refRate: 2200, city: 'Bela Bela', breakfast: true, roomType: 'Lodge Room' },
];

// Combine all hotels
export const ALL_SYNC_HOTELS: BudgetHotelEntry[] = [...BUDGET_AFFORDABLE_HOTELS, ...PREMIUM_HOTELS];

// Valid destinations for sync
export const SYNC_DESTINATIONS = ['durban', 'umhlanga', 'harties', 'cape-town', 'mpumalanga', 'bela-bela', 'magalies', 'sun-city', 'knysna', 'vaal-river'];

export function getHotelsForDestination(dest: string): BudgetHotelEntry[] {
  return ALL_SYNC_HOTELS.filter(h => h.dest === dest);
}

export function getUniqueRealNames(dest: string): { realName: string; city: string }[] {
  const hotels = getHotelsForDestination(dest);
  const seen = new Set<string>();
  return hotels.filter(h => {
    if (seen.has(h.realName)) return false;
    seen.add(h.realName);
    return true;
  }).map(h => ({ realName: h.realName, city: h.city }));
}

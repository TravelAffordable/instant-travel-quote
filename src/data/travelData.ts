// Complete Travel Affordable package and hotel data with pricing

import sunCityImage from '@/assets/sun-city.jpeg';

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  pricePerNight: number; // Base price per room per night
  rating: number;
  type: 'very-affordable' | 'affordable' | 'premium';
  amenities: string[];
  image: string;
  includesBreakfast?: boolean;
}

export interface Package {
  id: string;
  name: string;
  shortName: string;
  description: string;
  destination: string;
  basePrice: number; // Base price per person
  kidsPrice?: number; // Kids package cost (optional)
  activitiesIncluded: string[];
  duration: string;
  image?: string;
}

export interface Destination {
  id: string;
  name: string;
  shortName: string; // For hotel naming
  country: string;
  description: string;
  image: string;
  startingPrice: number;
  popular: boolean;
  international: boolean;
}

// Destination short names for hotel naming
const destinationShortNames: Record<string, string> = {
  'harties': 'Harties',
  'magalies': 'Magaliesburg',
  'durban': 'Durban',
  'umhlanga': 'Umhlanga',
  'cape-town': 'Cape Town',
  'sun-city': 'Sun City',
  'mpumalanga': 'Mpumalanga',
  'knysna': 'Knysna',
  'vaal-river': 'Vaal',
  'bela-bela': 'Bela Bela',
  'bali': 'Bali',
  'dubai': 'Dubai',
  'thailand': 'Thailand',
  'pretoria': 'Pretoria',
};

// Budget Option pricing tiers (per night) - 10 hotels A-J
const budgetPrices = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
// Affordable pricing tiers (per night) - 10 hotels A-J
const affordablePrices = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100];
// Premium pricing tiers (per night) - 10 hotels A-J
const premiumPrices = [2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100];

// Premium Hotels with their actual names (prices will use premiumPrices array - 4 hotels per destination)
const premiumHotelNames: Record<string, { name: string; includesBreakfast?: boolean }[]> = {
  'harties': [
    { name: 'Villa Paradiso Hotel' },
    { name: 'Cocomo Boutique Hotel' },
    { name: 'The Riverleaf Hotel', includesBreakfast: true },
    { name: 'Kosmos Manor' },
  ],
  'magalies': [
    { name: 'Cocomo Boutique Hotel' },
    { name: 'Mount Grace Hotel And Spa' },
    { name: 'Cradle Boutique Hotel' },
    { name: 'Valley Lodge & Spa' },
  ],
  'durban': [
    { name: 'Coastlands Umhlanga Hotel' },
    { name: 'The Capital Pearls Durban' },
    { name: 'Oyster Box Hotel' },
    { name: 'Southern Sun Elangeni' },
  ],
  'umhlanga': [
    { name: 'The Capital Pearls' },
    { name: 'Beverly Hills Hotel' },
    { name: 'Oyster Box Hotel' },
    { name: 'The Lighthouse' },
  ],
  'cape-town': [
    { name: 'Victoria & Alfred Hotel' },
    { name: 'Table Bay Hotel' },
    { name: 'Cape Grace Hotel' },
    { name: 'The Silo Hotel' },
  ],
  'sun-city': [
    { name: 'Sun City Hotel' },
    { name: 'Cascades Hotel' },
    { name: 'Cabanas Hotel' },
    { name: 'The Palace of Lost City' },
  ],
  'mpumalanga': [
    { name: "Perry's Bridge Hollow" },
    { name: 'White River Manor' },
    { name: 'Kruger Gate Hotel' },
    { name: 'Protea Hotel Hazyview' },
  ],
  'knysna': [
    { name: 'The Turbine Hotel' },
    { name: 'Pezula Resort' },
    { name: 'Conrad Pezula' },
    { name: 'Knysna Hollow' },
  ],
  'vaal-river': [
    { name: 'Three Rivers Lodge' },
    { name: 'Stonehaven on Vaal' },
    { name: 'Emerald Resort' },
    { name: 'Riverside Sun' },
  ],
  'bela-bela': [
    { name: 'Mabalingwe Nature Reserve' },
    { name: 'Mabula Game Lodge' },
    { name: 'Warmbaths Forever Resort' },
    { name: 'Zebra Country Lodge' },
  ],
  'bali': [
    { name: 'Hanging Gardens of Bali' },
    { name: 'Four Seasons Bali' },
    { name: 'Viceroy Bali' },
    { name: 'Mandapa Reserve' },
  ],
  'dubai': [
    { name: 'Atlantis The Palm' },
    { name: 'Jumeirah Beach Hotel' },
    { name: 'One&Only Royal Mirage' },
    { name: 'Burj Al Arab Jumeirah' },
  ],
  'thailand': [
    { name: 'Banyan Tree Phuket' },
    { name: 'Six Senses Yao Noi' },
    { name: 'Amanpuri Resort' },
    { name: 'Trisara Phuket' },
  ],
  'pretoria': [
    { name: 'Sheraton Pretoria Hotel' },
    { name: 'Irene Country Lodge' },
    { name: 'Kievits Kroon' },
    { name: 'Castello di Monte' },
  ],
};

// Generate hotels dynamically
function generateHotels(): Hotel[] {
  const allHotels: Hotel[] = [];
  const destinationIds = Object.keys(destinationShortNames);
  const hotelLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  destinationIds.forEach(destId => {
    const shortName = destinationShortNames[destId];
    
    // Budget Option images - simple, clean guesthouses
    const budgetImages = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', // Simple clean room
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800', // Cozy bedroom
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', // Basic room interior
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800', // Simple guesthouse room
    ];

    // Affordable images - modern comfortable hotels with amenities
    const affordableImages = [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', // Modern hotel room
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', // Comfortable hotel bed
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', // Nice hotel with pool view
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', // Mid-range hotel room
    ];

    // Premium images - luxury boutique hotels
    const premiumImages = [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', // Luxury resort pool
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', // Elegant suite
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', // Premium hotel pool
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', // Luxury hotel exterior
    ];

    // Budget Option Hotels (10 per destination: A-J)
    hotelLetters.forEach((letter, index) => {
      allHotels.push({
        id: `${destId}-very-affordable-${letter.toLowerCase()}`,
        name: `${shortName} Budget Hotel Option ${letter}`,
        destination: destId,
        pricePerNight: budgetPrices[index],
        rating: 3.5 + (Math.random() * 0.5),
        type: 'very-affordable',
        amenities: ['WiFi', 'Parking', 'TV'],
        image: budgetImages[index % budgetImages.length],
      });
    });

    // Affordable Hotels (10 per destination: A-J)
    hotelLetters.forEach((letter, index) => {
      allHotels.push({
        id: `${destId}-affordable-${letter.toLowerCase()}`,
        name: `${shortName} Affordable Hotel ${letter}`,
        destination: destId,
        pricePerNight: affordablePrices[index],
        rating: 4.0 + (Math.random() * 0.3),
        type: 'affordable',
        amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant'],
        image: affordableImages[index % affordableImages.length],
      });
    });

    // Premium Hotels (10 per destination: A-J)
    hotelLetters.forEach((letter, index) => {
      allHotels.push({
        id: `${destId}-premium-${letter.toLowerCase()}`,
        name: `${shortName} Premium Hotel ${letter}`,
        destination: destId,
        pricePerNight: premiumPrices[index],
        rating: 4.5 + (Math.random() * 0.5),
        type: 'premium',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining'],
        image: premiumImages[index % premiumImages.length],
      });
    });
  });

  return allHotels;
}

export const hotels: Hotel[] = generateHotels();

// Packages Database - Complete list from Travel Affordable
export const packages: Package[] = [
  // ============= VAAL RIVER PACKAGES =============
  {
    id: 'emer1',
    name: 'VAAL RIVER CRUISE AND EMERALD WITH AQUADOME, GAME DRIVE, LUNCH CRUISE',
    shortName: 'Aquadome & Cruise',
    description: 'Includes Entry to Aquadome Pools and Waterpark, Game drive in safari truck, Animal World, 2 Hour Sunday lunch buffet boat cruise.',
    destination: 'vaal-river',
    basePrice: 1100,
    kidsPrice: 800,
    activitiesIncluded: ['Aquadome Pools and Waterpark', 'Game drive in safari truck', 'Animal World', '2 Hour Sunday lunch buffet boat cruise'],
    duration: '2 nights'
  },
  {
    id: 'emer2',
    name: 'VAAL RIVER CRUISE EMERALD CASINO FAMILY FUN GETAWAY WITH AQUADOME, 1 HOUR LEISURE CRUISE, GAME DRIVE AND SUNDAY LUNCH BUFFET',
    shortName: 'Family Fun Getaway',
    description: 'Includes Emerald Casino Resort, Entry to Aquadome Pools and Waterpark, 1 hour leisure cruise, Game drive in safari truck, Sunday lunch buffet and carvery.',
    destination: 'vaal-river',
    basePrice: 1050,
    kidsPrice: 700,
    activitiesIncluded: ['Emerald Casino Resort', 'Aquadome Pools and Waterpark', '1 hour leisure cruise', 'Game drive in safari truck', 'Sunday lunch buffet and carvery'],
    duration: '2 nights'
  },
  {
    id: 'emer3',
    name: 'VAAL RIVER CRUISE EMERALD LEISURE WITH MASSAGE, GAME DRIVE LUNCH CRUISE',
    shortName: 'Leisure & Spa',
    description: 'Includes Emerald Casino Resort, 60 Minute Full Body Massage, Game drive experience, Lunch cruise.',
    destination: 'vaal-river',
    basePrice: 1700,
    kidsPrice: 950,
    activitiesIncluded: ['Emerald Casino Resort', '60 Minute Full Body Massage', 'Game drive experience', 'Lunch cruise'],
    duration: '2 nights'
  },

  // ============= UMHLANGA PACKAGES =============
  {
    id: 'umhla1',
    name: 'UMHLA1 - UMHLANGA BEACH AND LEISURE GETAWAY, BREAKFAST, OUTING TO GATEWAY THEATRE OF DREAMS SHOPPING MALL, UMHLANGA ROCKS MAIN BEACH AND THE OCEANS MALL, SHUTTLE',
    shortName: 'Beach & Leisure',
    description: 'Includes accommodation, breakfast, visit to Gateway Theatre of Dreams Shopping Mall, Umhlanga Rocks Main Beach and The Oceans Mall, shuttle transport included.',
    destination: 'umhlanga',
    basePrice: 500,
    kidsPrice: 180,
    activitiesIncluded: ['Accommodation', 'Breakfast at selected hotels', 'Gateway Theatre of Dreams Shopping Mall', 'Umhlanga Rocks Main Beach', 'The Oceans Mall', 'Shuttle transport'],
    duration: '2 nights'
  },
  {
    id: 'umhla2',
    name: 'UMHLA2 - UMHLANGA THE BEACH LIFESTYLE GETAWAY, BREAKFAST, USHAKA MARINE WORLD, WATEFRONT LUXURY CANAL BOAT CRUISE, UMHLANGA ROCKS MAIN BEACH, SHUTTLE',
    shortName: 'Beach Lifestyle',
    description: 'Includes accommodation, breakfast, visit to uShaka Marine World, Point Waterfront luxury canal boat cruise, uMhlanga Rocks Main Beach, shuttle transport included.',
    destination: 'umhlanga',
    basePrice: 1450,
    kidsPrice: 900,
    activitiesIncluded: ['Accommodation', 'Breakfast at selected hotels', 'uShaka Marine World full combo tickets', 'uShaka Marine Beach', 'Point Waterfront luxury canal boat cruise', 'uMhlanga Rocks Main Beach', 'Shuttle transport'],
    duration: '2 nights'
  },
  {
    id: 'umhla3',
    name: 'UMHLA3 - UMHLANGA THREE BEACHES GETAWAY BUFFET BREAKFAST, USHAKA MARINE WORLD AND USHAKA BEACH, BOAT CRUISE, UMHLANGA ROCKS MAIN BEACH, BALLITO BEACH, SHUTTLE',
    shortName: 'Three Beaches',
    description: 'Includes accommodation, buffet breakfast, visit to uShaka Marine World and uShaka Beach, boat cruise, Umhlanga Rocks Beach and Ballito Beach, shuttle transport included.',
    destination: 'umhlanga',
    basePrice: 1850,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Buffet breakfast at selected hotels', 'uShaka Marine World full combo tickets', 'Boat cruise-Durban Harbour', 'Umhlanga Rocks Main Beach', 'Ballito Beach', 'Shuttle transport'],
    duration: '2 nights'
  },
  {
    id: 'umhla4',
    name: 'UMHLA4 - UMHLANGA ROMANCE, BREAKFAST, DINNER DATE, ROMANTIC DECOR IN ROOM, USHAKA, PICNIC ON GONDOLA BOAT CANAL CRUISE',
    shortName: 'Romance Package',
    description: 'Includes accommodation, breakfast, romantic dinner date, romantic room decor, entry to uShaka Marine World, and a picnic experience on the gondola boat canal cruise.',
    destination: 'umhlanga',
    basePrice: 2400,
    kidsPrice: 900,
    activitiesIncluded: ['Accommodation', 'Buffet breakfast at selected hotels', 'Romantic dinner date', 'Romantic room decor', 'uShaka Marine World full combo tickets', 'Gondola boat canal cruise with picnic basket', 'Shuttle transport'],
    duration: '2 nights'
  },

  // ============= KNYSNA PACKAGES =============
  {
    id: 'kny1',
    name: 'KNY1 - KNYSNA BOATS AND QUADS ADVENTURE GETAWAY, BREAKFAST, KNYSNA WINE AND OYSTER LUXURY LOUNGER SUNSET CRUISE, KNYSNA FOREST GUIDED QUAD BIKING EXPERIENCE',
    shortName: 'Boats & Quads Adventure',
    description: 'Includes accommodation, breakfast, Knysna wine and oyster luxury lounger sunset cruise, boat cruise, Knysna Forest guided quad biking adventure.',
    destination: 'knysna',
    basePrice: 1550,
    activitiesIncluded: ['Accommodation', 'Breakfast at selected hotels', 'Knysna wine and oyster luxury lounger sunset cruise', 'Knysna Forest guided quad biking adventure', 'Shuttle transport'],
    duration: '2 nights'
  },

  // ============= HARTIES PACKAGES =============
  {
    id: 'hg1',
    name: 'HG1 - HARTIES LEISURETIME GETAWAY PACKAGE',
    shortName: 'Leisuretime Getaway',
    description: 'Includes ACCOMMODATION, 2 HOUR SUNSET CHAMPAGNE CRUISE WITH A DELICIOUS GOURMET BUFFET, THE HARTIES CABLEWAY EXPERIENCE.',
    destination: 'harties',
    basePrice: 1010,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Breakfast at selected hotels', '2 hour sunset champagne cruise with gourmet buffet', 'Harties Cableway experience'],
    duration: '2 nights'
  },
  {
    id: 'hg2',
    name: 'HG2 - HARTIES FUNTIME GETAWAY PACKAGE',
    shortName: 'Funtime Getaway',
    description: 'Includes ACCOMMODATION, 1 HOUR HORSE RIDING EXPERIENCE, 1 HOUR QUAD BIKING FUN OR A 60 MINUTE FULL BODY SWEDISH MASSAGE, 2 HOUR SUNSET CHAMPAGNE CRUISE WITH A DELICIOUS GOURMET BUFFET.',
    destination: 'harties',
    basePrice: 1700,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', '1 hour horse riding experience', '1 hour quad biking OR 60 minute full body Swedish massage', '2 hour sunset champagne cruise with gourmet buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg3',
    name: 'HG3 - HARTIES FAMILY FUN WEEKENDER GETAWAY',
    shortName: 'Family Fun Weekender',
    description: 'Includes ACCOMMODATION, 1 HOUR QUAD BIKING FUN, HARTIES ZOO ANIMAL AND SNAKE PARK, 2 HOUR SUNDAY BUFFET LUNCH BOAT CRUISE.',
    destination: 'harties',
    basePrice: 1450,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', '1 hour quad biking fun', 'Harties Zoo animal and snake park', '2 hour Sunday buffet lunch boat cruise'],
    duration: '2 nights'
  },
  {
    id: 'hg4',
    name: 'HG4 - HARTIES MAX JET SKI FUN HARTIES WITH ACCOMMODATION, HARTIES CABLEWAY EXPERIENCE, 60 MIN FULL BODY MASSAGE GETAWAY OR 2 HOUR SUNSET BUFFET CRUISE',
    shortName: 'Jet Ski Fun',
    description: 'Includes Jet Ski adventure, Harties Cableway and a 60 minute full body massage or 2 hour sunset champagne cruise with buffet.',
    destination: 'harties',
    basePrice: 1280,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Jet Ski adventure', 'Harties Cableway experience', 'Choice of 60 minute full body massage OR 2 hour sunset champagne cruise with buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg5',
    name: 'HG5 - HARTIES UPSIDE DOWN HOUSE GETAWAY WITH ACCOMMODATION LITTLE PARIS THE HARTIES CABLEWAY EXPERIENCE, 1 HOUR QUAD BIKING FUN',
    shortName: 'Upside Down House',
    description: 'Includes accommodation, Upside Down House, Little Paris, the Harties Cableway Experience, 1 hour quad biking fun.',
    destination: 'harties',
    basePrice: 1330,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Fun at Upside Down House adventure', 'Enjoy Little Paris', 'Harties Cableway Experience', '1 hour quad biking fun adventure'],
    duration: '2 nights'
  },
  {
    id: 'hg6',
    name: 'HG6 - HARTIES WATER TUBE RIDE AND 60 MINUTE FULL BODY MASSAGE GETAWAY',
    shortName: 'Tube Ride & Massage',
    description: 'Includes accommodation, tube ride ski, 60 minute full body massage.',
    destination: 'harties',
    basePrice: 1400,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Tube ride ski', '60 minute full body massage'],
    duration: '2 nights'
  },
  {
    id: 'hg8',
    name: 'HG8 - HARTIES WATER WAKE SNAKE SLIDER SKI AND 2 HOUR HARTIES SUNSET CRUISE',
    shortName: 'Wake Snake & Cruise',
    description: 'Includes accommodation, fun Wake Snake Ski slide, 2 Hour Sunset Champagne Boat cruise with delicious gourmet buffet.',
    destination: 'harties',
    basePrice: 1180,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Fun Wake Snake Ski slide', '2 Hour Sunset Champagne Boat cruise with delicious gourmet buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg9',
    name: 'HG9 - HARTIES GETAWAY WITH ACCOMMODATION AND FULL DAY HARTIES CABLEWAY EXPERIENCE',
    shortName: 'Cableway Experience',
    description: 'Includes accommodation and full day access to the Harties Cableway Experience.',
    destination: 'harties',
    basePrice: 380,
    kidsPrice: 300,
    activitiesIncluded: ['Accommodation', 'Full day access to the Harties Cableway Experience'],
    duration: '2 nights'
  },
  {
    id: 'hg10',
    name: 'HG10 - HARTIES COUPLE GETAWAY WITH ACCOMMODATION AND 2 HOUR SUNSET BOAT CRUISE WITH DELICIOUS BUFFET',
    shortName: 'Couple Cruise Getaway',
    description: 'Includes accommodation and a romantic 2 hour sunset boat cruise with delicious buffet.',
    destination: 'harties',
    basePrice: 700,
    kidsPrice: 350,
    activitiesIncluded: ['Accommodation', 'Romantic 2 hour sunset boat cruise with delicious buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg11',
    name: 'HG11 - HARTIES COUPLE ADVENTURE WITH ACCOMMODATION AND 1 HOUR QUAD BIKING EXPERIENCE',
    shortName: 'Couple Quad Adventure',
    description: 'Includes accommodation and an exciting 1 hour quad biking experience.',
    destination: 'harties',
    basePrice: 550,
    kidsPrice: 300,
    activitiesIncluded: ['Accommodation', 'Exciting 1 hour quad biking experience'],
    duration: '2 nights'
  },
  {
    id: 'hg12',
    name: 'HG12 - HARTIES ROMANCE IN THE AIR WITH ACCOMMODATION, 1 HOUR HORSE RIDE, FULL DAY HARTIES CABLEWAY',
    shortName: 'Romance in the Air',
    description: 'Includes accommodation, a romantic 1 hour horse ride, and full day access to the Harties Cableway.',
    destination: 'harties',
    basePrice: 810,
    kidsPrice: 400,
    activitiesIncluded: ['Accommodation', 'Romantic 1 hour horse ride', 'Full day access to the Harties Cableway'],
    duration: '2 nights'
  },

  // ============= MAGALIES PACKAGES =============
  {
    id: 'mag1',
    name: 'MAG1 - MAGALIES EXPLORER GETAWAY PACKAGE WITH ACCOMMODATION, CRADLE OF MANKIND, STERKFONTEIN CAVES, GAME DRIVE, PREDATOR ENCLOSURE, SNAKE AND REPTILE SHOW',
    shortName: 'Explorer Getaway',
    description: 'Includes accommodation, entrance to Cradle of Mankind Origins Centre, Sterkfontein Caves, game drive, predator enclosure, snake and reptile show.',
    destination: 'magalies',
    basePrice: 900,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Cradle of Mankind Origins Centre', 'Sterkfontein Caves exploration tour', 'Rhino and Lion Park Guided game drive in Safari Truck', 'Reptile show and Predator enclosure at the park Welcome Centre'],
    duration: '2 nights'
  },
  {
    id: 'mag2',
    name: 'MAG2 - MAGALIES ULTIMATE LUX GETAWAY PACKAGE WITH BUFFET CRUISE, CRADLE OF MANKIND, MASSAGE, GAME DRIVE, PREDATOR ENCLOSURE, SNAKE AND REPTILE SHOW',
    shortName: 'Ultimate Lux',
    description: 'Includes accommodation, 2-hour buffet lunch cruise, Cradle of Mankind Origins Centre, 60-minute full body massage, guided game drive in Rhino and Lion Park, predator enclosure, and snake and reptile show.',
    destination: 'magalies',
    basePrice: 2130,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Cradle of Mankind Origins Centre', 'Guided game drive in Rhino and Lion Park', '2-hour buffet lunch cruise', '60-minute full body massage', 'Reptile show and Predator enclosure at the park Welcome Centre'],
    duration: '2 nights'
  },
  {
    id: 'mag3',
    name: 'MAG3 - MAGALIES DELUXE HALF DAY SPA, GAME DRIVE AND SUNSET CRUISE WEEKENDER',
    shortName: 'Deluxe Spa Weekender',
    description: 'Includes accommodation, half-day spa session with massages and treats, game drive in Rhino and Lion Park including snake show, Predator World and cub interactions, sunset cruise.',
    destination: 'magalies',
    basePrice: 1950,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Half-day spa experience, full body massage and other treatments', 'Rhino and Lion Park Game drive in safari truck', 'Reptile and predator show at the Park Welcome Centre', '2 Hour Champagne Sunset cruise with delicious buffet'],
    duration: '2 nights'
  },
  {
    id: 'mag4',
    name: 'MAG4 - MAGALIES BUDGET WITH GAME DRIVE IN RHINO PARK AND FULL BODY MASSAGE',
    shortName: 'Budget Game Drive',
    description: 'Includes accommodation, entrance to Rhino and Lion Park, guided game drive, snake show, Predator World, cub interactions, and 60-minute full body massage.',
    destination: 'magalies',
    basePrice: 1200,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Entrance to Rhino and Lion Park', 'Rhino and Lion Park Guided game drive', '60-minute full body massage'],
    duration: '2 nights'
  },
  {
    id: 'mag5',
    name: 'MAG5 - THE PERFECT DATE IN MAGALIES WITH HORSE RIDING, QUAD BIKING, AND PRIVATE PICNIC',
    shortName: 'Perfect Date',
    description: 'Includes accommodation, 60-minute horse riding, quad biking, private romantic picnic with champagne and a picnic basket, set on a romantically laid out blanket.',
    destination: 'magalies',
    basePrice: 2330,
    kidsPrice: 900,
    activitiesIncluded: ['Accommodation', '60-minute horse riding experience', 'Quad biking adventure', 'Private romantic picnic setup', 'Champagne and picnic basket', 'Romantic blanket layout'],
    duration: '2 nights'
  },
  {
    id: 'mag6',
    name: 'MAG6 - HORSE, SPA AND PICNIC MAGALIES GETAWAY',
    shortName: 'Horse, Spa & Picnic',
    description: 'Includes accommodation, 1-hour horse trail, 60-minute full body massage, private romantic picnic with champagne and a picnic basket.',
    destination: 'magalies',
    basePrice: 1600,
    kidsPrice: 700,
    activitiesIncluded: ['Accommodation', '1-hour horse trail', '60-minute full body massage', 'Private romantic picnic setup', 'Champagne and picnic basket'],
    duration: '2 nights'
  },

  // ============= DURBAN PACKAGES =============
  {
    id: 'dur1',
    name: 'DUR1 - DURBAN GETAWAY FUN ON THE BEACH WITH ACCOMMODATION, USHAKA MARINE WORLD COMBO TICKET, ISLE OF CAPRI BOAT CRUISE, 60 MINUTE FULL BODY MASSAGE, SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK',
    shortName: 'Fun on the Beach',
    description: 'Includes accommodation, uShaka Marine World combo tickets, Isle of Capri Boat Cruise, 60 minute full body massage at a beachfront spa, transport to shuttle you from the hotel to the activities and back to the hotel.',
    destination: 'durban',
    basePrice: 1800,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'uShaka Marine World combo tickets (Sea World & Wet n Wild)', 'Isle of Capri Boat Cruise', '60 minute full body massage', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur2',
    name: 'DUR2 - DURBAN GETAWAY SMILES AND SEA SHELLS WITH ACCOMMODATION, USHAKA MARINE WORLD, 3 HOUR OPEN BUS CITY TOUR, ISLE OF CAPRI BOAT CRUISE, SHUTTLE TO TAKE YOU FROM THE HOTEL TO ACTIVITIES AND BACK TO THE HOTEL',
    shortName: 'Smiles & Sea Shells',
    description: 'Includes accommodation, uShaka Marine World, 3 hour open bus city tour, Isle of Capri Boat Cruise, shuttle to take you from the hotel to activities and back to the hotel.',
    destination: 'durban',
    basePrice: 1300,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'uShaka Marine World combo tickets (Sea World & Wet n Wild)', '3 hour open bus city tour', 'Isle of Capri Boat Cruise', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur3',
    name: 'DUR3 - DURBAN GETAWAY SMILES BEACH AND SPA EASE WITH SPA DAY AND LUXURY CANAL BOAT CRUISE',
    shortName: 'Beach & Spa Ease',
    description: 'Includes accommodation, half-day spa experience, luxury boat canal cruise, and shuttle transport to activities and back to hotel.',
    destination: 'durban',
    basePrice: 1550,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Half-day spa experience with full body massage and drinks', 'Luxury Canal boat cruise', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur4',
    name: 'DUR4 - DURBAN PARTY VIBES GETAWAY TIME WITH NIGHTLIFE BEACH SPA AND BOAT, FULL BODY MASSAGE, LUXURY CANAL BOAT CRUISE',
    shortName: 'Party Vibes',
    description: 'Includes accommodation, nightlife outing, uShaka Marine World combo ticket, luxury boat canal cruise, 60 minute full body massage.',
    destination: 'durban',
    basePrice: 2000,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Nightlife outing to Florida Road Cubana', 'uShaka Marine World combo tickets (Sea World & Wet n Wild)', 'Luxury boat canal cruise', '60 minute full body massage'],
    duration: '2 nights'
  },
  {
    id: 'dur5',
    name: 'DUR5 - DURBAN BEACH COUPLE GETAWAY WITH USHAKA MARINE AND SHUTTLE',
    shortName: 'Beach Couple uShaka',
    description: 'Includes accommodation, uShaka Marine World, and shuttle service to activities and back.',
    destination: 'durban',
    basePrice: 850,
    kidsPrice: 400,
    activitiesIncluded: ['Accommodation', 'uShaka Marine World combo tickets (Sea World & Wet n Wild)', 'Suncoast Casino outing', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur6',
    name: 'DUR6 - DURBAN BEACH COUPLE GETAWAY WITH BOAT CRUISE AND SHUTTLE',
    shortName: 'Beach Couple Cruise',
    description: 'Includes accommodation, boat cruise, and shuttle service to and from activities.',
    destination: 'durban',
    basePrice: 550,
    kidsPrice: 300,
    activitiesIncluded: ['Accommodation', 'Isle of Capri Boat Cruise', 'Suncoast Casino outing', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur7',
    name: 'DUR7 - DURBAN BEACH AND NIGHTLIFE COUPLE ESCAPE',
    shortName: 'Beach & Nightlife',
    description: 'Includes accommodation, Cubana Lounge outing, and shuttle service.',
    destination: 'durban',
    basePrice: 400,
    kidsPrice: 200,
    activitiesIncluded: ['Accommodation', 'Florida Road Cubana Outing', 'Suncoast Casino outing', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },
  {
    id: 'dur8',
    name: 'DUR8 - DURBAN BEACH COUPLE ESCAPE WITH OPEN TOP BUS TOUR',
    shortName: 'Open Top Bus Tour',
    description: 'Includes accommodation and a 3 hour open top bus tour of Durban.',
    destination: 'durban',
    basePrice: 600,
    kidsPrice: 350,
    activitiesIncluded: ['Accommodation', 'Suncoast Casino outing', '3 hour open top bus city tour', 'Shuttle service between hotel and activities'],
    duration: '2 nights'
  },

  // ============= MPUMALANGA PACKAGES =============
  {
    id: 'mp1',
    name: 'MP1 - MPUMALANGA INSTYLE GETAWAY WITH BLYDE RIVER CANYON BOAT CRUISE, GRASKOP GORGE LIFT AND GORGE SUSPENSION BRIDGE',
    shortName: 'InStyle Getaway',
    description: 'Includes accommodation, boat cruise exploring the Blyde River Canyon, view 3 Rondavels, Gods Window from the water, the rare Kadishi Tufa Waterfalls, Blyde River Canyon Nature Reserve, Graskop Gorge Lift experience with suspension bridge.',
    destination: 'mpumalanga',
    basePrice: 1320,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Blyde River Canyon boat cruise with spectacular views', 'View of 3 Rondavels and Gods Window at unique vantage point', 'Rare Kadishi Tufa Waterfalls experience', 'Wildlife viewing on the banks of the river', 'Graskop Gorge Lift, suspension bridge and gorge walking trails'],
    duration: '2 nights'
  },
  {
    id: 'mp2',
    name: 'MP2 - MPUMALANGA FUN ADVENTURE WITH GRASKOP GORGE LIFT, ZIPLINING ADVENTURE, SUSPENSION BRIDGE, QUAD BIKING FUN',
    shortName: 'Fun Adventure',
    description: 'Includes accommodation, entrance to Graskop Lift with suspension bridge, forest experience, quad biking fun, and zip lining adventure.',
    destination: 'mpumalanga',
    basePrice: 1750,
    kidsPrice: 900,
    activitiesIncluded: ['Accommodation', 'Graskop Lift', 'Gorge suspension bridge', 'Deep in the gorge Forest experience', 'Quad biking fun', 'Zip lining adventure'],
    duration: '2 nights'
  },
  {
    id: 'mp3',
    name: 'MP3 - KRUGER NATIONAL PARK EXPERIENCE WITH GRASKOP GORGE LIFT, GORGE SUSPENSION BRIDGE',
    shortName: 'Kruger Experience',
    description: 'Includes accommodation, Graskop Gorge Lift, Gorge Suspension Bridge, Kruger National Park - game drive in safari truck (choice of morning or sunset game drive).',
    destination: 'mpumalanga',
    basePrice: 2100,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Graskop Gorge Lift', 'Gorge suspension bridge', 'Deep in the gorge Forest experience', 'Guided Kruger National Park game drive in safari truck (morning or sunset)'],
    duration: '2 nights'
  },
  {
    id: 'mp4',
    name: 'MP4 - MPUMALANGA WEEKENDER',
    shortName: 'Weekender',
    description: 'Includes accommodation, game drive in the Kruger National Park, full day tour of the Panorama Route (Gods Window & Wonderview, Berlin Falls, Pinnacle Rock, Bourkes Luck Potholes, Blyde River Canyon, and Three Rondavels).',
    destination: 'mpumalanga',
    basePrice: 2800,
    kidsPrice: 1200,
    activitiesIncluded: ['Accommodation', 'Game drive in Kruger National Park', 'Full day Panorama Route tour', 'Gods Window & Wonderview', 'Berlin Falls, Pinnacle Rock, Bourkes Luck Potholes', 'Blyde River Canyon and Three Rondavels'],
    duration: '2 nights'
  },

  // ============= SUN CITY PACKAGES =============
  {
    id: 'sun1',
    name: 'SUN1 - SUN CITY GETAWAY WITH VALLEY OF THE WAVES, THE SUN CITY MAZE, 2 HOUR SUNDAY BUFFET LUNCH CRUISE WITH DELICIOUS FOOD AND GREAT SUNDAY ATMOSPHERE',
    shortName: 'Sun City & Cruise Combo',
    description: 'Includes ACCOMMODATION IN THE SUN CITY AREA, ENTRANCE FEES TO SUN CITY, VALLEY OF THE WAVES, LUNCH INSIDE SUN CITY, THE SUN CITY MAZE, YOU WILL HAVE TRANSPORT TO SHUTTLE YOU FROM THE GUESTHOUSE/HOTEL TO SUN CITY AND BACK, 2 HOUR SUNDAY BUFFET LUNCH BOAT CRUISE IN HARTIES, YOU MAY STAY AFTER THE CRUISE TO ENJOY A PICNIC AND BRAAI AT KOMANDO NEK RESORT WHERE THE CRUISE DOCKS, YOU MAY ALSO DANCE TO MUSIC BY RESIDENT AND INVITED DJs, DRINKS AND LIGHT MEALS AT BEACH CAFE LOCATED ON THE RESORT WHERE YOUR CRUISE ENDS.',
    destination: 'sun-city',
    basePrice: 1550,
    kidsPrice: 600,
    activitiesIncluded: [
      'Accommodation',
      'Entrance fees Sun City included',
      'Entrance fees to Valley of the Waves included',
      'Lunch in Sun City included',
      'You will have transport to take you from your hotel to Sun City and back when you are ready',
      '2 hour Sunday buffet lunch boat cruise in Harties with delicious Sunday lunch menu and a great Sunday Afternoon atmosphere',
      'Enjoy Kommando Nek Resort and music and drinks at Beach Cafe located right where your cruise ends'
    ],
    duration: '2 nights'
  },
  {
    id: 'sun2',
    name: 'SUN2 - SUN CITY GETAWAY PACKAGE WITH VALLEY OF WAVES AND QUAD BIKING',
    shortName: 'Valley & Quads',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, quad biking, lunch inside Sun City, and shuttle transport to and from Sun City (if staying outside).',
    destination: 'sun-city',
    basePrice: 1250,
    kidsPrice: 850,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Quad biking', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun3',
    name: 'SUN3 - SUN CITY GETAWAY PACKAGE WITH VALLEY OF WAVES AND SHUTTLE',
    shortName: 'Valley Getaway',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, lunch inside Sun City, and shuttle transport to and from Sun City (if staying outside).',
    destination: 'sun-city',
    basePrice: 850,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun4',
    name: 'SUN4 - SUN CITY WEEKENDER WITH VALLEY OF THE WAVES & GAME DRIVE',
    shortName: 'Safari Weekender',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, lunch inside Sun City, game drive in Pilanesberg National Park, and shuttle transport (if staying outside).',
    destination: 'sun-city',
    basePrice: 1550,
    kidsPrice: 750,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Game drive in Pilanesberg National Park', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun5',
    name: 'SUN5 - SUN CITY WEEKENDER WITH HALF DAY SPA, GAME DRIVE, VALLEY OF THE WAVES',
    shortName: 'Spa & Safari',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, half-day spa experience, lunch inside Sun City, Guided Game Drive in The Pilanesberg National Park. shuttle transport from hotel to Sun City and back (if staying outside sun city).',
    destination: 'sun-city',
    basePrice: 2150,
    kidsPrice: 900,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Half-day spa experience', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun6',
    name: 'SUN6 - SUN CITY GETAWAY PACKAGE WITH VALLEY OF THE WAVES AND SEGWAY GLIDES',
    shortName: 'Valley & Segway',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, segway glides, lunch inside Sun City, and shuttle transport (if staying outside).',
    destination: 'sun-city',
    basePrice: 1700,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Segway glides', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun7',
    name: 'SUN7 - SUN CITY GETAWAY WITH VALLEY OF WAVES, THE MAZE AND SHUTTLE',
    shortName: 'Valley & Maze',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, maze adventure, lunch inside Sun City, and shuttle transport (if staying outside).',
    destination: 'sun-city',
    basePrice: 800,
    kidsPrice: 700,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Maze adventure', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },
  {
    id: 'sun8',
    name: 'SUN8 - SUN CITY GETAWAY WITH VALLEY OF THE WAVES & ZIP LINE ADVENTURE',
    shortName: 'Valley & Zipline',
    description: 'Includes accommodation, entrance to Sun City and Valley of The Waves, zip lining adventure, lunch inside Sun City, and shuttle transport (if staying outside).',
    destination: 'sun-city',
    basePrice: 1600,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', 'Entrance to Sun City', 'Valley of The Waves access', 'Zip lining adventure', 'Lunch inside Sun City', 'Shuttle service (if booked just outside Sun City)'],
    duration: '2 nights'
  },

  // ============= CAPE TOWN PACKAGES =============
  {
    id: 'cpt1',
    name: 'CPT1 - CAPE TOWN WITH FULL DAY CAPE TOWN TOUR, ROBBEN ISLAND TOUR, TABLE MOUNTAIN AERIAL CABLEWAY',
    shortName: 'Iconic Tour',
    description: 'Includes accommodation, 1 Day full Cape Town Tour on the Cape Town Sightseeing Tour Bus, Tour of Robben Island including the luxury boat to ferry you to the Island, Table Mountain Cableway, A canal boat cruise.',
    destination: 'cape-town',
    basePrice: 1800,
    kidsPrice: 850,
    activitiesIncluded: ['Accommodation', 'Cape Town Sightseeing Tour Bus', 'Robben Island tour with luxury boat transfer', 'Table Mountain Aerial Cableway ticket', 'Canal boat cruise'],
    duration: '3 nights'
  },
  {
    id: 'cpt2',
    name: 'CPT2 - CAPE TOWN WITH 2 DAY SIGHTSEEING TOUR BUS, TABLE MOUNTAIN, CANAL CRUISE, CAPE TOWN SUNSET TOUR TO SIGNAL HILL',
    shortName: 'Sunset Explorer',
    description: 'Includes accommodation, 2 Day full Cape Town Tour on the Sightseeing Tour Bus, Table Mountain Cableway, Canal boat cruise, Cape Town sunset tour with Sundowners at Signal Hill viewpoint overlooking the ocean.',
    destination: 'cape-town',
    basePrice: 1200,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', '2 day Cape Town sightseeing tour', 'Table Mountain Cableway ticket', 'Canal boat cruise', 'Sunset tour with sundowners at Signal Hill'],
    duration: '2 nights'
  },

  // ============= PRETORIA PACKAGES =============
  {
    id: 'pret1',
    name: 'PRETORIA - CITY TOUR',
    shortName: 'City Tour',
    description: 'Includes accommodation, Breakfast at hotel, The Union Buildings, Church Square, Melrose House, Voortrekker Monument.',
    destination: 'pretoria',
    basePrice: 1200,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'The Union Buildings', 'Church Square', 'Melrose House', 'Voortrekker Monument'],
    duration: '2 nights'
  },

  // ============= INTERNATIONAL - BALI =============
  {
    id: 'bali-ubud-6day-explorer',
    name: 'BALI UBUD EXPLORER: 6-DAY CULTURAL, ADVENTURE & SUNSET GETAWAY',
    shortName: '6-Day Ubud Explorer',
    description: 'An affordable 6-day package based in the cultural heartland of Ubud, covering immersive cultural sites, thrilling quad biking, beautiful rice terraces, serene waterfalls, relaxing beach outings, and a memorable sunset cruise.',
    destination: 'bali',
    basePrice: 3400,
    activitiesIncluded: [
      '5 nights accommodation in an affordable guesthouse/homestay in Ubud',
      'Return airport transfers (Denpasar-Ubud)',
      '4 full days of private vehicle transport for day trips',
      'Sacred Monkey Forest Sanctuary entrance',
      'Tegalalang Rice Terraces with swing/photo spot',
      'Tirta Empul Holy Water Temple entrance',
      'Coffee Plantation visit with tastings',
      'Traditional Balinese Dance Performance',
      'Quad Biking (ATV) adventure',
      'Beautiful Balinese waterfall entrance',
      'Sunset Cruise with dinner/entertainment',
      'Besakih Temple entrance',
      'Daily transport to activities and back',
      'Estimated budget for all meals at local warungs'
    ],
    duration: '6 nights'
  },

  // ============= INTERNATIONAL - DUBAI =============
  {
    id: 'dubai-getaway-1',
    name: 'DUBAI EXCLUSIVE MOMENTS GETAWAY: ICONIC SIGHTS, BEACHES & DESERT ADVENTURES',
    shortName: 'Exclusive Moments',
    description: 'Experience the best of Dubai\'s modern marvels, thrilling desert adventures, and luxurious excursions with this comprehensive package.',
    destination: 'dubai',
    basePrice: 4400,
    activitiesIncluded: [
      'Entry to Burj Khalifa (Levels 124 and 125)',
      'Dubai Mega Yacht Cruise with Buffet Dinner',
      'Entry to Museum Of The Future',
      'Speedboat Tour of Dubai Marina, Atlantis, Palm & Burj Al Arab',
      'Entry to Sky Views Observatory',
      'Dubai Desert Safari (including Quad Bikes and Al Khayma Camp experience)'
    ],
    duration: '5 nights'
  },

  // ============= INTERNATIONAL - THAILAND =============
  {
    id: 'phuket-adventure-explorer',
    name: 'PHUKET ADVENTURE EXPLORER: ISLANDS, WATERPARK & QUAD BIKING',
    shortName: 'Adventure Explorer',
    description: 'Experience the best of Phuket with a package featuring thrilling island excursions, a visit to a top waterpark, and an adventurous quad biking tour with panoramic views.',
    destination: 'thailand',
    basePrice: 3800,
    activitiesIncluded: [
      'James Bond Island day tour by speed boat including 2 delicious meals',
      'Phuket Guided city tour',
      'Yona Floating beach club full day visit',
      'Phi Phi, Maya Bay and Khai Island by speed boat',
      'Elephant Jungle Sanctuary experience',
      'Phuket Andamanda Water Park entry',
      'Quad bikes adventure with 360 degrees view of Phuket including a view of Big Buddha'
    ],
    duration: '5 nights'
  },
];

// Destinations - startingPrice calculated as per-person for 2 adults, 2 nights, budget accommodation
// Formula: (R700 accommodation + basePrice×2 + R1700 service fees) / 2 = R1200 + basePrice
export const destinations: Destination[] = [
  { id: 'harties', name: 'Hartbeespoort', shortName: 'Harties', country: 'South Africa', description: 'Scenic escape near the dam with breathtaking views and activities.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/Harties.jpg', startingPrice: 1580, popular: true, international: false },
  { id: 'magalies', name: 'Magaliesburg', shortName: 'Magaliesburg', country: 'South Africa', description: 'Mountain retreats and nature getaways for a refreshing break.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/magalies1.jpg', startingPrice: 2100, popular: true, international: false },
  { id: 'durban', name: 'Durban Beachfront', shortName: 'Durban', country: 'South Africa', description: 'Sunny beach holidays with warm waters and vibrant city life.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/durban.png', startingPrice: 1600, popular: true, international: false },
  { id: 'umhlanga', name: 'Umhlanga', shortName: 'Umhlanga', country: 'South Africa', description: 'Coastal escape near Durban with beautiful beaches and upscale shopping.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', startingPrice: 1700, popular: true, international: false },
  { id: 'cape-town', name: 'Cape Town', shortName: 'Cape Town', country: 'South Africa', description: 'Iconic Table Mountain, stunning beaches, and world-class vineyards.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/cape%20town.jpg', startingPrice: 2400, popular: true, international: false },
  { id: 'sun-city', name: 'Sun City', shortName: 'Sun City', country: 'South Africa', description: 'World-famous resort with Valley of Waves and endless entertainment.', image: sunCityImage, startingPrice: 2000, popular: true, international: false },
  { id: 'mpumalanga', name: 'Mpumalanga', shortName: 'Mpumalanga', country: 'South Africa', description: 'Panorama Route, Blyde River Canyon, and Kruger National Park adventures.', image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=800', startingPrice: 2520, popular: true, international: false },
  { id: 'knysna', name: 'Knysna', shortName: 'Knysna', country: 'South Africa', description: 'Garden Route gem with lagoon, forests, and oyster experiences.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', startingPrice: 2750, popular: false, international: false },
  { id: 'vaal-river', name: 'Vaal River', shortName: 'Vaal', country: 'South Africa', description: 'Riverside relaxation and water sports just outside Johannesburg.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', startingPrice: 2250, popular: false, international: false },
  { id: 'bela-bela', name: 'Bela Bela', shortName: 'Bela Bela', country: 'South Africa', description: 'Hot springs, game reserves, and adventure activities in Limpopo.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', startingPrice: 2600, popular: false, international: false },
  { id: 'pretoria', name: 'Pretoria', shortName: 'Pretoria', country: 'South Africa', description: 'Jacaranda city with historic landmarks and cultural attractions.', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800', startingPrice: 2400, popular: false, international: false },
  { id: 'bali', name: 'Bali', shortName: 'Bali', country: 'Indonesia', description: 'Volcanic mountains, rice paddies, beaches and coral reefs.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', startingPrice: 4600, popular: true, international: true },
  { id: 'dubai', name: 'Dubai', shortName: 'Dubai', country: 'UAE', description: 'Luxury shopping, ultramodern architecture and lively nightlife.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', startingPrice: 5600, popular: true, international: true },
  { id: 'thailand', name: 'Thailand', shortName: 'Thailand', country: 'Thailand', description: 'Tropical beaches, opulent palaces, ancient ruins and ornate temples.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', startingPrice: 5000, popular: true, international: true },
];

// Quote Calculation Logic
export interface QuoteRequest {
  destination: string;
  packageId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  hotelType: 'very-affordable' | 'affordable' | 'premium';
  selectedHotelId?: string;
}

export interface QuoteResult {
  packageName: string;
  packageDescription: string;
  hotelName: string;
  hotelId: string;
  hotelImage: string;
  destination: string;
  nights: number;
  accommodationCost: number;
  packageCost: number;
  activitiesCost: number;
  childDiscount: number;
  totalPerPerson: number;
  totalForGroup: number;
  is4SleeperRoom: boolean;
  roomType: string;
  includesBreakfast: boolean;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  activitiesIncluded: string[];
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export function calculateQuote(request: QuoteRequest): QuoteResult | null {
  const pkg = packages.find(p => p.id === request.packageId);
  const availableHotels = hotels.filter(h => h.destination === request.destination && h.type === request.hotelType);
  
  // Use selected hotel or first available
  const hotel = request.selectedHotelId 
    ? availableHotels.find(h => h.id === request.selectedHotelId) || availableHotels[0]
    : availableHotels[0];
  
  if (!pkg || !hotel) return null;
  
  // Calculate nights
  const nights = Math.ceil((request.checkOut.getTime() - request.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < 1) return null;
  
  // Use the rate directly from the API without any surcharge
  const pricePerNight = hotel.pricePerNight;
  
  // Accommodation cost (per room per night)
  const accommodationCost = pricePerNight * request.rooms * nights;
  
  // Package base price (includes activities)
  const packageBaseCost = pkg.basePrice * request.adults;
  
// Children pricing - only for ages 3-17
  // Package cost for kids + once-off fees based on age
  let childrenPackageCost = 0;
  let childrenOnceFees = 0;
  let validChildren = 0;
  
  request.childrenAges.forEach(age => {
    // Only children 3-17 are charged
    if (age >= 3 && age <= 17) {
      validChildren++;
      // Add package cost for child (use kidsPrice if available)
      if (pkg.kidsPrice) {
        childrenPackageCost += pkg.kidsPrice;
      } else {
        // Fallback if no kidsPrice defined
        childrenPackageCost += pkg.basePrice * 0.5;
      }
      
      // Once-off fees based on age
      if (age >= 3 && age <= 12) {
        childrenOnceFees += 200; // R200 per child 3-12 years
      } else if (age >= 13 && age <= 17) {
        childrenOnceFees += 300; // R300 service fee per child 13-17 years
      }
    }
    // Children under 3 are free
  });
  
  const childDiscount = 0; // No longer using discount model
  
  // Calculate service fees based on number of adults
  let serviceFeePerAdult = 0;
  if (request.adults === 1) {
    serviceFeePerAdult = 1000;
  } else if (request.adults >= 2 && request.adults <= 3) {
    serviceFeePerAdult = 850;
  } else if (request.adults >= 4 && request.adults <= 10) {
    serviceFeePerAdult = 800;
  } else if (request.adults > 10) {
    serviceFeePerAdult = 750;
  }
  const totalServiceFees = serviceFeePerAdult * request.adults;
  
// Total calculations
  // Accommodation cost is divided among adults only (already calculated for group)
  const totalPackageCost = packageBaseCost + childrenPackageCost + childrenOnceFees;
  const totalCost = accommodationCost + totalPackageCost + totalServiceFees;
  const totalPeople = request.adults + validChildren;
  const totalPerPerson = Math.round(totalCost / totalPeople);
  
  const roomType = 'Standard Room';
  const hotelNameDisplay = hotel.includesBreakfast 
    ? `${hotel.name} (includes breakfast)` 
    : hotel.name;
  
  const breakdown = [
    { 
      label: `Accommodation (${nights} nights × ${request.rooms} rooms)`, 
      amount: accommodationCost 
    },
    { label: `Package - ${request.adults} Adults`, amount: packageBaseCost },
  ];
  
  if (validChildren > 0) {
    breakdown.push({ label: `Package - ${validChildren} Children`, amount: childrenPackageCost });
    if (childrenOnceFees > 0) {
      breakdown.push({ label: `Children Once-off Fees`, amount: childrenOnceFees });
    }
  }
  
  // Add service fees to breakdown
  breakdown.push({ label: `Service Fees (${request.adults} Adults @ R${serviceFeePerAdult})`, amount: totalServiceFees });
  
  return {
    packageName: pkg.name,
    packageDescription: pkg.description,
    hotelName: hotelNameDisplay,
    hotelId: hotel.id,
    hotelImage: hotel.image,
    destination: destinations.find(d => d.id === request.destination)?.name || request.destination,
    nights,
    accommodationCost,
    packageCost: totalPackageCost,
    activitiesCost: 0,
    childDiscount,
    totalPerPerson,
    totalForGroup: totalCost,
    is4SleeperRoom: false,
    roomType,
    includesBreakfast: hotel.includesBreakfast || false,
    activitiesIncluded: pkg.activitiesIncluded,
    breakdown,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    adults: request.adults,
    children: request.children,
    rooms: request.rooms,
  };
}

// Calculate quotes for ALL hotels in a type, sorted by price (cheapest first)
export function calculateAllQuotes(request: Omit<QuoteRequest, 'selectedHotelId'>): QuoteResult[] {
  const availableHotels = hotels.filter(h => h.destination === request.destination && h.type === request.hotelType);
  
  const quotes: QuoteResult[] = [];
  
  availableHotels.forEach(hotel => {
    const quote = calculateQuote({ ...request, selectedHotelId: hotel.id });
    if (quote) {
      quotes.push(quote);
    }
  });
  
  // Sort by total price (cheapest first)
  return quotes.sort((a, b) => a.totalForGroup - b.totalForGroup);
}

// Helper to get hotels by destination
export function getHotelsByDestination(destinationId: string): Hotel[] {
  return hotels.filter(h => h.destination === destinationId);
}

// Helper to get hotels by destination and specific type
export function getHotelsByDestinationAndType(destinationId: string, type: 'very-affordable' | 'affordable' | 'premium'): Hotel[] {
  return hotels.filter(h => h.destination === destinationId && h.type === type);
}

// Helper to get packages by destination
export function getPackagesByDestination(destinationId: string): Package[] {
  return packages.filter(p => p.destination === destinationId);
}

// Hotel type display names
export const hotelTypeLabels: Record<string, string> = {
  'very-affordable': 'Budget Option',
  'affordable': 'Affordable',
  'premium': 'Premium',
};

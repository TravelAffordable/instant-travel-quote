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
  'magalies': 'Magalies',
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
};

// Very Affordable pricing tiers (per night) - 4 hotels A-D
const veryAffordablePrices = [350, 450, 550, 650];
// Affordable pricing tiers (per night) - 4 hotels A-D
const affordablePrices = [700, 750, 800, 850];
// Premium pricing tiers (per night) - 4 hotels
const premiumPrices = [950, 1000, 1100, 1200];

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
};

// Generate hotels dynamically
function generateHotels(): Hotel[] {
  const allHotels: Hotel[] = [];
  const destinationIds = Object.keys(destinationShortNames);
  const hotelLetters = ['A', 'B', 'C', 'D'];

  destinationIds.forEach(destId => {
    const shortName = destinationShortNames[destId];
    
    // Very Affordable Hotels (4 per destination: A-D)
    hotelLetters.forEach((letter, index) => {
      allHotels.push({
        id: `${destId}-very-affordable-${letter.toLowerCase()}`,
        name: `${shortName} Budget Option ${letter}`,
        destination: destId,
        pricePerNight: veryAffordablePrices[index],
        rating: 3.5 + (Math.random() * 0.5),
        type: 'very-affordable',
        amenities: ['WiFi', 'Parking', 'TV'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      });
    });

    // Affordable Hotels (4 per destination: A-D)
    hotelLetters.forEach((letter, index) => {
      allHotels.push({
        id: `${destId}-affordable-${letter.toLowerCase()}`,
        name: `${shortName} Affordable Hotel ${letter}`,
        destination: destId,
        pricePerNight: affordablePrices[index],
        rating: 4.0 + (Math.random() * 0.3),
        type: 'affordable',
        amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant'],
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      });
    });

    // Premium Hotels (actual names with standardized pricing)
    const premiums = premiumHotelNames[destId] || [];
    premiums.slice(0, 4).forEach((hotel, index) => {
      allHotels.push({
        id: `${destId}-premium-${index + 1}`,
        name: hotel.name,
        destination: destId,
        pricePerNight: premiumPrices[index],
        rating: 4.5 + (Math.random() * 0.5),
        type: 'premium',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining'],
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        includesBreakfast: hotel.includesBreakfast,
      });
    });
  });

  return allHotels;
}

export const hotels: Hotel[] = generateHotels();

// Packages Database
export const packages: Package[] = [
  // Harties Packages
  { id: 'hg1', name: 'HG1 - HARTIES LEISURETIME GETAWAY PACKAGE', shortName: 'Leisuretime Getaway', description: 'Includes ACCOMMODATION, 2 HOUR SUNSET CHAMPAGNE CRUISE WITH A DELICIOUS GOURMET BUFFET, THE HARTIES CABLEWAY EXPERIENCE.', destination: 'harties', basePrice: 1800, activitiesIncluded: ['Sunset Champagne Cruise', 'Harties Cableway'], duration: '2 nights' },
  { id: 'hg2', name: 'HG2 - HARTIES FUNTIME GETAWAY PACKAGE', shortName: 'Funtime Getaway', description: 'Includes ACCOMMODATION, 1 HOUR HORSE RIDING EXPERIENCE, 1 HOUR QUAD BIKING OR 60 MIN FULL BODY MASSAGE, 2 HOUR SUNSET CHAMPAGNE CRUISE.', destination: 'harties', basePrice: 2200, activitiesIncluded: ['Horse Riding', 'Quad Biking/Massage', 'Sunset Cruise'], duration: '2 nights' },
  { id: 'hg3', name: 'HG3 - HARTIES FAMILY FUN WEEKENDER', shortName: 'Family Fun Weekender', description: 'Includes ACCOMMODATION, 1 HOUR QUAD BIKING, HARTIES ZOO ANIMAL AND SNAKE PARK, 2 HOUR SUNDAY BUFFET LUNCH CRUISE.', destination: 'harties', basePrice: 1950, activitiesIncluded: ['Quad Biking', 'Zoo Visit', 'Lunch Cruise'], duration: '2 nights' },
  { id: 'hg4', name: 'HG4 - HARTIES SUN CITY COMBO', shortName: 'Sun City Combo', description: 'Includes ACCOMMODATION, FREE ENTRY INTO SUN CITY, FULL DAY VALLEY OF THE WAVES, FREE LUNCH, SHUTTLE, 2 HOUR SUNDAY BUFFET LUNCH CRUISE.', destination: 'harties', basePrice: 2800, activitiesIncluded: ['Sun City Entry', 'Valley of Waves', 'Lunch Cruise'], duration: '2 nights' },
  
  // Magalies Packages
  { id: 'mag1', name: 'MAG1 - MAGALIES EXPLORER GETAWAY', shortName: 'Explorer Getaway', description: 'Includes accommodation, Cradle of Mankind Origins Centre, Wonder Caves, game drive, predator enclosure, snake show.', destination: 'magalies', basePrice: 2100, activitiesIncluded: ['Cradle of Mankind', 'Game Drive', 'Predator Enclosure'], duration: '2 nights' },
  { id: 'mag2', name: 'MAG2 - MAGALIES ULTIMATE LUX GETAWAY', shortName: 'Ultimate Lux', description: 'Includes accommodation, buffet cruise, Cradle of Mankind, 60-minute massage, guided game drive, predator enclosure.', destination: 'magalies', basePrice: 2800, activitiesIncluded: ['Buffet Cruise', 'Massage', 'Game Drive'], duration: '2 nights' },
  { id: 'mag3', name: 'MAG3 - MAGALIES DELUXE SPA WEEKENDER', shortName: 'Spa Weekender', description: 'Includes accommodation, half-day spa, game drive including snake show and cub interactions, sunset cruise.', destination: 'magalies', basePrice: 3200, activitiesIncluded: ['Half-day Spa', 'Game Drive', 'Sunset Cruise'], duration: '2 nights' },
  
  // Durban Packages
  { id: 'dur1', name: 'DUR1 - DURBAN FUN ON THE BEACH', shortName: 'Fun on the Beach', description: 'Includes accommodation, uShaka Marine World combo tickets, Isle of Capri Boat Cruise, 60 minute massage, shuttle transport.', destination: 'durban', basePrice: 2250, activitiesIncluded: ['uShaka Marine World', 'Boat Cruise', 'Massage', 'Shuttle'], duration: '2 nights' },
  { id: 'dur2', name: 'DUR2 - DURBAN SMILES AND SEA SHELLS', shortName: 'Smiles & Sea Shells', description: 'Includes accommodation, uShaka Marine World, 3 hour open bus city tour, Isle of Capri Boat Cruise, shuttle.', destination: 'durban', basePrice: 2100, activitiesIncluded: ['uShaka Marine World', 'City Tour', 'Boat Cruise'], duration: '2 nights' },
  { id: 'dur3', name: 'DUR3 - DURBAN BEACH AND SPA EASE', shortName: 'Beach & Spa', description: 'Includes accommodation, half-day spa experience, luxury boat canal cruise, shuttle transport.', destination: 'durban', basePrice: 2450, activitiesIncluded: ['Half-day Spa', 'Canal Cruise', 'Shuttle'], duration: '2 nights' },
  
  // Umhlanga Packages
  { id: 'umhla1', name: 'UMHLA1 - UMHLANGA BEACH AND LEISURE', shortName: 'Beach & Leisure', description: 'Includes accommodation, breakfast, Gateway Theatre of Dreams, Umhlanga Rocks Beach, Oceans Mall, shuttle.', destination: 'umhlanga', basePrice: 2500, activitiesIncluded: ['Breakfast', 'Shopping Mall', 'Beach', 'Shuttle'], duration: '2 nights' },
  { id: 'umhla2', name: 'UMHLA2 - UMHLANGA BEACH LIFESTYLE', shortName: 'Beach Lifestyle', description: 'Includes accommodation, breakfast, uShaka Marine World, Point Waterfront luxury canal boat cruise, uMhlanga Rocks Beach, shuttle.', destination: 'umhlanga', basePrice: 2800, activitiesIncluded: ['Breakfast', 'uShaka', 'Canal Cruise', 'Shuttle'], duration: '2 nights' },
  
  // Cape Town Packages
  { id: 'cpt1', name: 'CPT1 - CAPE TOWN ICONIC TOUR', shortName: 'Iconic Tour', description: 'Includes accommodation, full Cape Town Sightseeing Tour, Robben Island Tour, Table Mountain Cableway, canal boat cruise.', destination: 'cape-town', basePrice: 3200, activitiesIncluded: ['City Tour', 'Robben Island', 'Table Mountain', 'Canal Cruise'], duration: '3 nights' },
  { id: 'cpt2', name: 'CPT2 - CAPE TOWN SUNSET EXPLORER', shortName: 'Sunset Explorer', description: 'Includes accommodation, 2 Day Sightseeing Tour, Table Mountain Cableway, Canal cruise, Signal Hill Sunset Tour.', destination: 'cape-town', basePrice: 2900, activitiesIncluded: ['2-Day Tour', 'Table Mountain', 'Sunset Tour'], duration: '2 nights' },
  
  // Sun City Packages
  { id: 'sun1', name: 'SUN1 - SUN CITY VALLEY & QUADS', shortName: 'Valley & Quads', description: 'Includes accommodation, Sun City and Valley of The Waves entry, quad biking, lunch, shuttle transport.', destination: 'sun-city', basePrice: 2600, activitiesIncluded: ['Valley of Waves', 'Quad Biking', 'Lunch', 'Shuttle'], duration: '2 nights' },
  { id: 'sun2', name: 'SUN2 - SUN CITY VALLEY GETAWAY', shortName: 'Valley Getaway', description: 'Includes accommodation, Sun City and Valley of The Waves entry, lunch, shuttle transport.', destination: 'sun-city', basePrice: 2200, activitiesIncluded: ['Valley of Waves', 'Lunch', 'Shuttle'], duration: '2 nights' },
  { id: 'sun3', name: 'SUN3 - SUN CITY SAFARI WEEKENDER', shortName: 'Safari Weekender', description: 'Includes accommodation, Valley of The Waves, lunch, Pilanesberg game drive, shuttle.', destination: 'sun-city', basePrice: 3100, activitiesIncluded: ['Valley of Waves', 'Game Drive', 'Shuttle'], duration: '2 nights' },
  
  // Mpumalanga Packages
  { id: 'mp1', name: 'MP1 - MPUMALANGA INSTYLE GETAWAY', shortName: 'InStyle Getaway', description: 'Includes accommodation, Blyde River Canyon boat cruise, 3 Rondavels, Gods Window, Graskop Gorge Lift with suspension bridge.', destination: 'mpumalanga', basePrice: 2400, activitiesIncluded: ['Canyon Cruise', 'Graskop Gorge Lift', 'Panorama Views'], duration: '2 nights' },
  { id: 'mp2', name: 'MP2 - MPUMALANGA FUN ADVENTURE', shortName: 'Fun Adventure', description: 'Includes accommodation, Graskop Lift with suspension bridge, ziplining, quad biking.', destination: 'mpumalanga', basePrice: 2200, activitiesIncluded: ['Graskop Lift', 'Ziplining', 'Quad Biking'], duration: '2 nights' },
  { id: 'mp3', name: 'MP3 - KRUGER PARK EXPERIENCE', shortName: 'Kruger Experience', description: 'Includes accommodation, Graskop Gorge Lift, Suspension Bridge, Kruger National Park game drive.', destination: 'mpumalanga', basePrice: 2900, activitiesIncluded: ['Kruger Safari', 'Graskop Lift', 'Suspension Bridge'], duration: '2 nights' },
  
  // International - Bali
  { id: 'bali-explorer', name: 'BALI UBUD EXPLORER 6-DAY', shortName: '6-Day Explorer', description: 'Cultural sites, quad biking, rice terraces, waterfalls, beach outings, sunset cruise.', destination: 'bali', basePrice: 5400, activitiesIncluded: ['Cultural Tours', 'Quad Biking', 'Sunset Cruise', 'Waterfalls'], duration: '6 nights' },
  
  // International - Dubai
  { id: 'dubai-exclusive', name: 'DUBAI EXCLUSIVE MOMENTS', shortName: 'Exclusive Moments', description: 'Dubai\'s modern marvels, desert adventures, Burj Khalifa, luxurious excursions.', destination: 'dubai', basePrice: 6400, activitiesIncluded: ['Burj Khalifa', 'Desert Safari', 'City Tour'], duration: '5 nights' },
  
  // International - Thailand
  { id: 'thailand-adventure', name: 'PHUKET ADVENTURE EXPLORER', shortName: 'Adventure Explorer', description: 'Island excursions, waterpark visit, quad biking tour with panoramic views.', destination: 'thailand', basePrice: 4800, activitiesIncluded: ['Island Hopping', 'Waterpark', 'Quad Biking'], duration: '5 nights' },
];

// Destinations
export const destinations: Destination[] = [
  { id: 'harties', name: 'Hartbeespoort', shortName: 'Harties', country: 'South Africa', description: 'Scenic escape near the dam with breathtaking views and activities.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/Harties.jpg', startingPrice: 1800, popular: true, international: false },
  { id: 'magalies', name: 'Magaliesberg', shortName: 'Magalies', country: 'South Africa', description: 'Mountain retreats and nature getaways for a refreshing break.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/magalies1.jpg', startingPrice: 1950, popular: true, international: false },
  { id: 'durban', name: 'Durban Beachfront', shortName: 'Durban', country: 'South Africa', description: 'Sunny beach holidays with warm waters and vibrant city life.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/durban.png', startingPrice: 2100, popular: true, international: false },
  { id: 'umhlanga', name: 'Umhlanga', shortName: 'Umhlanga', country: 'South Africa', description: 'Coastal escape near Durban with beautiful beaches and upscale shopping.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/umhlanga.jpg', startingPrice: 2500, popular: true, international: false },
  { id: 'cape-town', name: 'Cape Town', shortName: 'Cape Town', country: 'South Africa', description: 'Iconic Table Mountain, stunning beaches, and world-class vineyards.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/cape%20town.jpg', startingPrice: 2100, popular: true, international: false },
  { id: 'sun-city', name: 'Sun City', shortName: 'Sun City', country: 'South Africa', description: 'World-famous resort with Valley of Waves and endless entertainment.', image: sunCityImage, startingPrice: 2200, popular: true, international: false },
  { id: 'mpumalanga', name: 'Mpumalanga', shortName: 'Mpumalanga', country: 'South Africa', description: 'Panorama Route, Blyde River Canyon, and Kruger National Park adventures.', image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=800', startingPrice: 2200, popular: true, international: false },
  { id: 'knysna', name: 'Knysna', shortName: 'Knysna', country: 'South Africa', description: 'Garden Route gem with lagoon, forests, and oyster experiences.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', startingPrice: 2400, popular: false, international: false },
  { id: 'vaal-river', name: 'Vaal River', shortName: 'Vaal', country: 'South Africa', description: 'Riverside relaxation and water sports just outside Johannesburg.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', startingPrice: 1600, popular: false, international: false },
  { id: 'bela-bela', name: 'Bela Bela', shortName: 'Bela Bela', country: 'South Africa', description: 'Hot springs, game reserves, and adventure activities in Limpopo.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', startingPrice: 1400, popular: false, international: false },
  { id: 'bali', name: 'Bali', shortName: 'Bali', country: 'Indonesia', description: 'Volcanic mountains, rice paddies, beaches and coral reefs.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', startingPrice: 5400, popular: true, international: true },
  { id: 'dubai', name: 'Dubai', shortName: 'Dubai', country: 'UAE', description: 'Luxury shopping, ultramodern architecture and lively nightlife.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', startingPrice: 6400, popular: true, international: true },
  { id: 'thailand', name: 'Thailand', shortName: 'Thailand', country: 'Thailand', description: 'Tropical beaches, opulent palaces, ancient ruins and ornate temples.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', startingPrice: 4800, popular: true, international: true },
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
  
  // Calculate total guests per room to determine if 4-sleeper is needed
  const totalGuests = request.adults + request.children;
  const guestsPerRoom = totalGuests / request.rooms;
  const is4SleeperRoom = guestsPerRoom >= 3 && guestsPerRoom <= 4;
  
  // Apply 30% surcharge for 4-sleeper rooms
  let pricePerNight = hotel.pricePerNight;
  if (is4SleeperRoom) {
    pricePerNight = Math.round(pricePerNight * 1.3);
  }
  
  // Accommodation cost (per room per night)
  const accommodationCost = pricePerNight * request.rooms * nights;
  
  // Package base price (includes activities)
  const packageBaseCost = pkg.basePrice * request.adults;
  
  // Children pricing (50% for under 12, 75% for 12-17)
  let childrenCost = 0;
  let childDiscount = 0;
  request.childrenAges.forEach(age => {
    if (age < 12) {
      childrenCost += pkg.basePrice * 0.5;
      childDiscount += pkg.basePrice * 0.5;
    } else if (age < 18) {
      childrenCost += pkg.basePrice * 0.75;
      childDiscount += pkg.basePrice * 0.25;
    } else {
      childrenCost += pkg.basePrice;
    }
  });
  
  // Total calculations
  const totalPackageCost = packageBaseCost + childrenCost;
  const totalCost = accommodationCost + totalPackageCost;
  const totalPeople = request.adults + request.children;
  const totalPerPerson = Math.round(totalCost / totalPeople);
  
  const roomType = is4SleeperRoom ? '4-Sleeper Room' : 'Standard Room';
  const hotelNameDisplay = hotel.includesBreakfast 
    ? `${hotel.name} (includes breakfast)` 
    : hotel.name;
  
  const breakdown = [
    { 
      label: `Accommodation (${nights} nights × ${request.rooms} ${is4SleeperRoom ? '4-sleeper' : 'standard'} rooms)`, 
      amount: accommodationCost 
    },
    { label: `Package - ${request.adults} Adults`, amount: packageBaseCost },
  ];
  
  if (request.children > 0) {
    breakdown.push({ label: `Package - ${request.children} Children`, amount: childrenCost });
  }
  
  if (childDiscount > 0) {
    breakdown.push({ label: 'Child Discount Applied', amount: -childDiscount });
  }
  
  if (is4SleeperRoom) {
    breakdown.push({ label: '4-Sleeper Room Upgrade (+30%)', amount: 0 }); // Info line, cost already included
  }
  
  return {
    packageName: pkg.shortName,
    packageDescription: pkg.description,
    hotelName: hotelNameDisplay,
    hotelId: hotel.id,
    destination: destinations.find(d => d.id === request.destination)?.name || request.destination,
    nights,
    accommodationCost,
    packageCost: totalPackageCost,
    activitiesCost: 0,
    childDiscount,
    totalPerPerson,
    totalForGroup: totalCost,
    is4SleeperRoom,
    roomType,
    includesBreakfast: hotel.includesBreakfast || false,
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

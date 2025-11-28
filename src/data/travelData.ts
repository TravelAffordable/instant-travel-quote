// Complete Travel Affordable package and hotel data with pricing

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  pricePerNight: number; // Base price per room per night
  rating: number;
  type: 'budget' | 'standard' | 'premium';
  amenities: string[];
  image: string;
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
  country: string;
  description: string;
  image: string;
  startingPrice: number;
  popular: boolean;
  international: boolean;
}

// Hotels Database - 2 hotels per destination
export const hotels: Hotel[] = [
  // Harties
  { id: 'harties-1', name: 'Harties Waterfront Lodge', destination: 'harties', pricePerNight: 850, rating: 4.2, type: 'standard', amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: 'harties-2', name: 'Magalies Manor Hotel', destination: 'harties', pricePerNight: 1200, rating: 4.6, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  
  // Magalies
  { id: 'magalies-1', name: 'Riverleaf Hotel', destination: 'magalies', pricePerNight: 780, rating: 4.0, type: 'budget', amenities: ['WiFi', 'Pool', 'Breakfast'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800' },
  { id: 'magalies-2', name: 'Cocomo Boutique Hotel', destination: 'magalies', pricePerNight: 1350, rating: 4.7, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Game Viewing'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800' },
  
  // Durban
  { id: 'durban-1', name: 'Beach Hotel Durban', destination: 'durban', pricePerNight: 950, rating: 4.1, type: 'standard', amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' },
  { id: 'durban-2', name: 'Oyster Box Hotel', destination: 'durban', pricePerNight: 2200, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Fine Dining', 'Ocean View'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },
  
  // Umhlanga
  { id: 'umhlanga-1', name: 'Cabana Beach Resort', destination: 'umhlanga', pricePerNight: 1100, rating: 4.3, type: 'standard', amenities: ['WiFi', 'Pool', 'Beach', 'Kids Club'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  { id: 'umhlanga-2', name: 'The Capital Pearls', destination: 'umhlanga', pricePerNight: 1800, rating: 4.8, type: 'premium', amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Ocean View'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  
  // Cape Town
  { id: 'capetown-1', name: 'Protea Hotel Sea Point', destination: 'cape-town', pricePerNight: 1050, rating: 4.2, type: 'standard', amenities: ['WiFi', 'Pool', 'Restaurant', 'Ocean View'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800' },
  { id: 'capetown-2', name: 'Table Bay Hotel', destination: 'cape-town', pricePerNight: 2500, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Fine Dining', 'Mountain View'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800' },
  
  // Sun City
  { id: 'suncity-1', name: 'Sun City Cabanas', destination: 'sun-city', pricePerNight: 1400, rating: 4.4, type: 'standard', amenities: ['WiFi', 'Pool', 'Casino Access', 'Valley of Waves'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: 'suncity-2', name: 'The Palace of Lost City', destination: 'sun-city', pricePerNight: 3200, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Golf', 'Valley of Waves'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },
  
  // Mpumalanga
  { id: 'mpumalanga-1', name: 'Graskop Hotel', destination: 'mpumalanga', pricePerNight: 750, rating: 4.0, type: 'budget', amenities: ['WiFi', 'Restaurant', 'Parking'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' },
  { id: 'mpumalanga-2', name: 'Perry\'s Bridge Hollow', destination: 'mpumalanga', pricePerNight: 1450, rating: 4.6, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Safari Tours'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
  
  // Knysna
  { id: 'knysna-1', name: 'Knysna Hollow', destination: 'knysna', pricePerNight: 1100, rating: 4.3, type: 'standard', amenities: ['WiFi', 'Pool', 'Garden', 'Restaurant'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800' },
  { id: 'knysna-2', name: 'Pezula Resort', destination: 'knysna', pricePerNight: 2800, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'Golf', 'Ocean View'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800' },
  
  // Bali
  { id: 'bali-1', name: 'Ubud Village Resort', destination: 'bali', pricePerNight: 1800, rating: 4.5, type: 'standard', amenities: ['WiFi', 'Pool', 'Spa', 'Rice Paddy Views'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
  { id: 'bali-2', name: 'Hanging Gardens of Bali', destination: 'bali', pricePerNight: 4500, rating: 5.0, type: 'premium', amenities: ['WiFi', 'Infinity Pool', 'Spa', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800' },
  
  // Dubai
  { id: 'dubai-1', name: 'Rove Downtown Dubai', destination: 'dubai', pricePerNight: 2200, rating: 4.4, type: 'standard', amenities: ['WiFi', 'Pool', 'Gym', 'City View'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
  { id: 'dubai-2', name: 'Atlantis The Palm', destination: 'dubai', pricePerNight: 5500, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Water Park', 'Aquarium', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800' },
  
  // Thailand
  { id: 'thailand-1', name: 'Patong Beach Resort', destination: 'thailand', pricePerNight: 1500, rating: 4.3, type: 'standard', amenities: ['WiFi', 'Pool', 'Beach', 'Restaurant'], image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800' },
  { id: 'thailand-2', name: 'Banyan Tree Phuket', destination: 'thailand', pricePerNight: 3800, rating: 4.9, type: 'premium', amenities: ['WiFi', 'Private Pool', 'Spa', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' },
  
  // Bela Bela
  { id: 'belabela-1', name: 'Warmbaths Forever Resort', destination: 'bela-bela', pricePerNight: 650, rating: 4.0, type: 'budget', amenities: ['WiFi', 'Hot Springs', 'Water Park'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
  { id: 'belabela-2', name: 'Mabula Game Lodge', destination: 'bela-bela', pricePerNight: 2100, rating: 4.7, type: 'premium', amenities: ['WiFi', 'Pool', 'Safari', 'Spa'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800' },

  // Vaal River
  { id: 'vaal-1', name: 'Emerald Resort & Casino', destination: 'vaal-river', pricePerNight: 900, rating: 4.2, type: 'standard', amenities: ['WiFi', 'Pool', 'Casino', 'Golf'], image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800' },
  { id: 'vaal-2', name: 'Stonehaven on Vaal', destination: 'vaal-river', pricePerNight: 1600, rating: 4.6, type: 'premium', amenities: ['WiFi', 'Pool', 'Spa', 'River Views'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
];

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
  { id: 'harties', name: 'Hartbeespoort', country: 'South Africa', description: 'Scenic escape near the dam with breathtaking views and activities.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/Harties.jpg', startingPrice: 1800, popular: true, international: false },
  { id: 'magalies', name: 'Magaliesberg', country: 'South Africa', description: 'Mountain retreats and nature getaways for a refreshing break.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/magalies1.jpg', startingPrice: 1950, popular: true, international: false },
  { id: 'durban', name: 'Durban Beachfront', country: 'South Africa', description: 'Sunny beach holidays with warm waters and vibrant city life.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/durban.png', startingPrice: 2100, popular: true, international: false },
  { id: 'umhlanga', name: 'Umhlanga', country: 'South Africa', description: 'Coastal escape near Durban with beautiful beaches and upscale shopping.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/umhlanga.jpg', startingPrice: 2500, popular: true, international: false },
  { id: 'cape-town', name: 'Cape Town', country: 'South Africa', description: 'Iconic Table Mountain, stunning beaches, and world-class vineyards.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/cape%20town.jpg', startingPrice: 2100, popular: true, international: false },
  { id: 'sun-city', name: 'Sun City', country: 'South Africa', description: 'World-famous resort with Valley of Waves and endless entertainment.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', startingPrice: 2200, popular: true, international: false },
  { id: 'mpumalanga', name: 'Mpumalanga', country: 'South Africa', description: 'Panorama Route, Blyde River Canyon, and Kruger National Park adventures.', image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=800', startingPrice: 2200, popular: true, international: false },
  { id: 'knysna', name: 'Knysna', country: 'South Africa', description: 'Garden Route gem with lagoon, forests, and oyster experiences.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', startingPrice: 2400, popular: false, international: false },
  { id: 'vaal-river', name: 'Vaal River', country: 'South Africa', description: 'Riverside relaxation and water sports just outside Johannesburg.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', startingPrice: 1600, popular: false, international: false },
  { id: 'bela-bela', name: 'Bela Bela', country: 'South Africa', description: 'Hot springs, game reserves, and adventure activities in Limpopo.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', startingPrice: 1400, popular: false, international: false },
  { id: 'bali', name: 'Bali', country: 'Indonesia', description: 'Volcanic mountains, rice paddies, beaches and coral reefs.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', startingPrice: 5400, popular: true, international: true },
  { id: 'dubai', name: 'Dubai', country: 'UAE', description: 'Luxury shopping, ultramodern architecture and lively nightlife.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', startingPrice: 6400, popular: true, international: true },
  { id: 'thailand', name: 'Thailand', country: 'Thailand', description: 'Tropical beaches, opulent palaces, ancient ruins and ornate temples.', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800', startingPrice: 4800, popular: true, international: true },
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
  hotelType: 'budget' | 'standard' | 'premium';
}

export interface QuoteResult {
  packageName: string;
  hotelName: string;
  destination: string;
  nights: number;
  accommodationCost: number;
  packageCost: number;
  activitiesCost: number;
  childDiscount: number;
  totalPerPerson: number;
  totalForGroup: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export function calculateQuote(request: QuoteRequest): QuoteResult | null {
  const pkg = packages.find(p => p.id === request.packageId);
  const availableHotels = hotels.filter(h => h.destination === request.destination && h.type === request.hotelType);
  const hotel = availableHotels[0];
  
  if (!pkg || !hotel) return null;
  
  // Calculate nights
  const nights = Math.ceil((request.checkOut.getTime() - request.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < 1) return null;
  
  // Accommodation cost (per room per night)
  const accommodationCost = hotel.pricePerNight * request.rooms * nights;
  
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
  
  return {
    packageName: pkg.shortName,
    hotelName: hotel.name,
    destination: destinations.find(d => d.id === request.destination)?.name || request.destination,
    nights,
    accommodationCost,
    packageCost: totalPackageCost,
    activitiesCost: 0,
    childDiscount,
    totalPerPerson,
    totalForGroup: totalCost,
    breakdown: [
      { label: `Accommodation (${nights} nights × ${request.rooms} rooms)`, amount: accommodationCost },
      { label: `Package - ${request.adults} Adults`, amount: packageBaseCost },
      ...(request.children > 0 ? [{ label: `Package - ${request.children} Children`, amount: childrenCost }] : []),
      ...(childDiscount > 0 ? [{ label: 'Child Discount Applied', amount: -childDiscount }] : []),
    ],
  };
}

// Helper to get hotels by destination
export function getHotelsByDestination(destinationId: string): Hotel[] {
  return hotels.filter(h => h.destination === destinationId);
}

// Helper to get packages by destination
export function getPackagesByDestination(destinationId: string): Package[] {
  return packages.filter(p => p.destination === destinationId);
}

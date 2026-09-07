// Complete Travel Affordable package and hotel data with pricing

import sunCityImage from '@/assets/sun-city.jpeg';
import { 
  hartiesBudget2SleeperPrimaryImages, 
  hartiesAffordable2SleeperPrimaryImages,
  hartiesIndlovukaziImages
} from './hartiesHotelImages';
import { hartiesPremiumImageMap } from './hartiesPremiumImages';
import { harties4SleeperImageMap } from './harties4SleeperImages';
import { durbanPremiumImageMap } from './durbanPremiumImages';
import { sunCity4SleeperImageMap } from './sunCity4SleeperImages';
import { sunCityPremiumImageMap } from './sunCityPremiumImages';
import { umhlangaPremiumImageMap } from './umhlangaPremiumImages';
import { vaalPremiumImageMap } from './vaalPremiumImages';
import { vaalNewHotelImageMap } from './vaalNewHotelImages';
import { vaal4SleeperImageMap } from './vaal4SleeperImages';
import { magaliesPremiumImageMap } from './magaliesPremiumImages';
import { magalies4SleeperImageMap } from './magalies4SleeperImages';
import { mpumalangaPremiumImageMap } from './mpumalangaPremiumImages';
import { mpumalanga2SleeperImageMap } from './mpumalanga2SleeperImages';
import { capeTownPremiumImageMap } from './capeTownPremiumImages';
import { umdlotiPremiumImageMap } from './umdlotiPremiumImages';
import { belaBelaHotelImageMap } from './belaBelaHotelImages';
import { getUmhlangaHotelStars } from './umhlangaHotelStars';
import { getChildServiceFeeForAge } from '@/lib/childServiceFees';

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  pricePerNight: number; // Base price per room per night
  rating: number;
  type: 'very-affordable' | 'affordable' | 'premium';
  amenities: string[];
  image: string;
  images?: string[]; // Multiple images for carousel
  includesBreakfast?: boolean;
  capacity?: number; // Room capacity (2 for 2-sleeper, 4 for 4-sleeper)
  roomType?: string; // Room type description
  forAdultsOnly?: boolean; // 4-sleeper rooms for adults-only groups
  forFamilyWithKids?: boolean; // 4-sleeper rooms for family groups with kids
}

export interface KidsPriceTier {
  minAge: number;
  maxAge: number;
  price: number;
}

export interface Package {
  id: string;
  name: string;
  shortName: string;
  description: string;
  destination: string;
  basePrice: number; // Base price per person
  kidsPrice?: number; // Kids package cost (optional, single flat rate)
  kidsPriceTiers?: KidsPriceTier[]; // Age-tiered kids pricing (optional)
  kidsMinAge?: number; // Minimum age for kids pricing (kids below this age are free)
  activitiesIncluded: string[];
  duration: string;
  image?: string;
  // Optional: different inclusions for affordable tier (e.g., outside resort)
  affordableInclusions?: string[];
  // Optional: disable budget tier with custom message
  budgetDisabled?: boolean;
  budgetDisabledMessage?: string;
  // Optional: fixed "From R___ pp" teaser shown on package cards.
  // When set, overrides the dynamic basePrice + cheapest-accommodation calculation.
  fromPriceOverride?: number;
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
  'umdloti': 'uMdloti',
  'cape-town': 'Cape Town',
  'sun-city': 'Sun City',
  'mpumalanga': 'Mpumalanga',
  'kruger-national-park': 'Kruger National Park',
  'knysna': 'Knysna',
  'vaal-river': 'Vaal Cruise',
  'bela-bela': 'Bela Bela',
  'bali': 'Bali',
  'dubai': 'Dubai',
  'thailand': 'Thailand',
  'pretoria': 'The Blyde',
};

// Budget Option pricing tiers (per night) - 10 hotels A-J
const budgetPrices = [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];

// Custom Durban Budget Hotels with specific names, prices, and room types
// 2-sleeper rooms (standard double occupancy)
const durbanBudgetHotels2Sleeper: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'Impala Holiday Flats & Apartments', price: 801, roomType: 'Standard Studio', capacity: 2 },
  { name: 'Shaka Shores 4C', price: 855, roomType: 'Studio with Sea View', capacity: 2 },
  { name: 'Yellow House 1101', price: 900, roomType: 'Luxury Quadruple Room', capacity: 2 },
  { name: 'Sea View Escape', price: 914, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'Beachurst Apartment II', price: 972, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'SolSands Hotel & Self-Catering', price: 1021, roomType: 'Standard Apartment', capacity: 2 },
  { name: 'Sea View Apartment next to uShaka', price: 1088, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: '9th Wonder at 10 South', price: 1215, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Parade Hotel', price: 1233, roomType: 'Double Room', capacity: 2, includesBreakfast: true },
  { name: 'Beachurst Apartment', price: 1242, roomType: 'Apartment', capacity: 2 },
  { name: '605 Tenbury Beach Apartment', price: 1250, roomType: 'Apartment with Sea View', capacity: 2 },
  { name: 'Durban Beachfront 10 South Apartments 1404', price: 1269, roomType: 'Deluxe Queen Studio', capacity: 2 },
  { name: 'Metro Lodge MP', price: 1275, roomType: 'Standard Double Room', capacity: 2 },
  { name: 'Durban Beach Front Six Sleeper Sea View Apartment', price: 1296, roomType: 'One-Bedroom Apartment with Sea View', capacity: 2 },
  { name: 'The Balmoral - Halaal', price: 1312, roomType: 'Run of House', capacity: 2 },
  { name: 'Serenity 905', price: 1346, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Garden Court South Beach', price: 1447, roomType: 'Standard Queen Room', capacity: 2 },
  { name: 'Shaka Shores Apartment 4B', price: 1466, roomType: 'Apartment with Sea View', capacity: 2 },
  { name: 'Gooderson Tropicana Hotel', price: 1479, roomType: 'Standard Double Room', capacity: 2, includesBreakfast: true },
  { name: '27 on North Beach', price: 1488, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'No 75 Windemere Holiday Flat', price: 1499, roomType: 'Two-Bedroom Apartment', capacity: 2 },
];

// 4-sleeper rooms (family/group occupancy - 4 adults or 2 adults + 2 kids or 1 adult + 3 kids)
const durbanBudgetHotels4Sleeper: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'Sea View Escape', price: 914, roomType: 'Four-Bed Apartment', capacity: 4 },
  { name: 'Beachurst Apartment II', price: 972, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'SolSands Hotel & Self-Catering', price: 1021, roomType: 'Self-Catering Apartment', capacity: 4 },
  { name: 'Sea View Apartment next to uShaka', price: 1088, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Tenbery 503', price: 1104, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Beachurst Apartment', price: 1118, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'uShaka Ocean Escape - Shaka Shores 5E', price: 1203, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Ocean View @ 10 South', price: 1215, roomType: 'Ocean View Apartment', capacity: 4 },
  { name: 'Durban Beachfront 10 South Apartments 1404', price: 1269, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Durban Beach Front Six Sleeper Sea View Apartment', price: 1296, roomType: 'One-Bedroom Apartment', capacity: 4 },
];

// Custom Durban Premium Hotels with specific names, prices, and room types
// 2-sleeper rooms
const durbanPremiumHotels2Sleeper: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'The Edward', price: 1508, roomType: 'Standard Double Room', capacity: 2 },
  { name: 'Durban Luxury Apartments 204 Vitamin Sea', price: 1514, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Shaka Shores Beachfront', price: 1515, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'Southern Sun Elangeni & Maharani', price: 1557, roomType: 'Elangeni Standard Queen Room', capacity: 2 },
  { name: 'Durban Spa', price: 1591, roomType: 'One-Bedroom Apartment with Sea View', capacity: 2 },
  { name: 'Shaka Shores Green 4A', price: 1620, roomType: 'Deluxe Junior Suite', capacity: 2 },
  { name: '1205 on The Golden Mile - 5 Sleeper Ocean View at 10 South', price: 1620, roomType: 'Apartment with Sea View', capacity: 2 },
  { name: 'Garden Court Marine Parade', price: 1626, roomType: 'King Room', capacity: 2 },
  { name: 'Valley View', price: 1652, roomType: 'Apartment with Sea View', capacity: 2 },
  { name: 'Durban Luxury Apartments 806 Ocean View', price: 1682, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: '309 Marlborough Court', price: 1700, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Durban Luxury Apartments 107 Sea Esta', price: 1708, roomType: 'Deluxe Apartment', capacity: 2 },
  { name: '57 Marlborough Court', price: 1800, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Belaire Suites Hotel', price: 1881, roomType: 'Superior Double or Twin Room', capacity: 2, includesBreakfast: true },
  { name: 'Durban Luxury Apartments 1101 Ocean Pearl', price: 1979, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'Durban Luxury Apartments 10 South 1102', price: 1979, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'Chasing The Sun', price: 1980, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: '10 South Apartment Unit 706', price: 1980, roomType: 'One-Bedroom Apartment', capacity: 2 },
  { name: 'Gooderson Leisure Silver Sands 2', price: 2006, roomType: 'One-Bedroom Apartment with Sea View', capacity: 2 },
  { name: 'Suncoast Hotel & Towers', price: 2016, roomType: 'Standard Room City Facing', capacity: 2 },
  { name: '10 South Apartment Unit 707', price: 2025, roomType: 'Three-Bedroom Apartment', capacity: 2 },
  { name: 'First Group The Palace All-Suite', price: 2029, roomType: 'Standard Double Room with Sea View', capacity: 2 },
  { name: 'Coastal Crown', price: 2178, roomType: 'Two-Bedroom Apartment', capacity: 2 },
  { name: 'Blue Waters Hotel', price: 2303, roomType: 'Deluxe King or Twin Room - South Facing', capacity: 2, includesBreakfast: true },
  { name: 'Tenbury 3 Bedroom', price: 2475, roomType: 'Three-Bedroom Apartment', capacity: 2 },
  { name: 'UshakaViews', price: 2520, roomType: 'Two-Bedroom Apartment', capacity: 2 },
];


// 4-sleeper rooms for 4 adults
const durbanPremiumHotels4SleeperAdults: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'T&N BeachSide Apartment', price: 1368, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Shaka Shores Apartment 4B', price: 1466, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'No 75 Windemere Holiday Flat', price: 1499, roomType: 'Two-Bedroom Flat', capacity: 4 },
  { name: 'Durban Luxury Apartments 806 Ocean View', price: 1514, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Shaka Shores Beachfront', price: 1515, roomType: 'Four-Bed Apartment', capacity: 4 },
  { name: 'Durban Spa', price: 1591, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Shaka Shores Green 4A', price: 1620, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: '1205 on The Golden Mile - 5 Sleeper Ocean View at 10 South', price: 1620, roomType: 'Ocean View Apartment', capacity: 4 },
  { name: 'Mahalia Sea Views', price: 1620, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Valley View', price: 1652, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '309 Marlborough Court', price: 1700, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 107 Sea Esta', price: 1708, roomType: 'Deluxe Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 10 South 1102', price: 1781, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 1101 Ocean Pearl', price: 1781, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '57 Marlborough Court', price: 1800, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Gooderson Leisure Silver Sands 2', price: 1806, roomType: 'One-Bedroom Apartment with Sea View', capacity: 4 },
  { name: 'Chasing The Sun', price: 1980, roomType: 'Four-Bed Apartment', capacity: 4 },
  { name: '10 South Apartment Unit 706', price: 1980, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '10 South Apartment Unit 707', price: 2025, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Tenbury 3 Bedroom', price: 2475, roomType: 'Three-Bedroom Apartment', capacity: 4 },
  { name: 'Durban Beach Views at 10 South', price: 4536, roomType: 'Three-Bed Apartment', capacity: 4, includesBreakfast: true },
];

// 4-sleeper rooms for 2 adults + 2 kids (family rooms)
const durbanPremiumHotels4SleeperFamily: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'T&N BeachSide Apartment', price: 1368, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Shaka Shores Apartment 4B', price: 1466, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'No 75 Windemere Holiday Flat', price: 1499, roomType: 'Two-Bedroom Flat', capacity: 4 },
  { name: 'Durban Luxury Apartments 806 Ocean View', price: 1514, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Shaka Shores Beachfront', price: 1515, roomType: 'Four-Bed Apartment', capacity: 4 },
  { name: 'Durban Spa', price: 1591, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Shaka Shores Green 4A', price: 1620, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: '1205 on The Golden Mile - 5 Sleeper Ocean View at 10 South', price: 1620, roomType: 'Ocean View Apartment', capacity: 4 },
  { name: 'Mahalia Sea Views', price: 1620, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Valley View', price: 1652, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '309 Marlborough Court', price: 1700, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 107 Sea Esta', price: 1708, roomType: 'Deluxe Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 10 South 1102', price: 1781, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Durban Luxury Apartments 1101 Ocean Pearl', price: 1781, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '57 Marlborough Court', price: 1800, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: 'Gooderson Leisure Silver Sands 2', price: 1806, roomType: 'One-Bedroom Apartment with Sea View', capacity: 4 },
  { name: 'Chasing The Sun', price: 1980, roomType: 'Four-Bed Apartment', capacity: 4 },
  { name: '10 South Apartment Unit 706', price: 1980, roomType: 'Three-Bed Apartment', capacity: 4 },
  { name: '10 South Apartment Unit 707', price: 2025, roomType: 'Two-Bedroom Apartment', capacity: 4 },
  { name: 'Tenbury 3 Bedroom', price: 2475, roomType: 'Three-Bedroom Apartment', capacity: 4 },
  { name: 'Durban Beach Views at 10 South', price: 4536, roomType: 'Three-Bed Apartment', capacity: 4, includesBreakfast: true },
];

// Real Umhlanga 2-sleeper properties. Existing properties are retained;
// supplied rates replace only the matching hotel entries.
const umhlangaRealHotels2Sleeper: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'Regal Inn Umhlanga Gateway', price: 950, roomType: 'Hotel Room', capacity: 2 },
  { name: '71 Sea Lodge Beachfront Apartment', price: 1000, roomType: 'Apartment', capacity: 2 },
  { name: 'Town Lodge Umhlanga', price: 1050, roomType: 'Hotel Room', capacity: 2 },
  { name: 'The Millennial Umhlanga', price: 1100, roomType: 'Apartment', capacity: 2 },
  { name: 'First Group Breakers Resort', price: 1150, roomType: 'Resort Room', capacity: 2 },
  { name: 'Breakers Resort Apartments', price: 1200, roomType: 'Resort Room', capacity: 2 },
  { name: 'Breakers Resort 232', price: 1200, roomType: 'Resort Room', capacity: 2 },
  { name: 'Royal Palm Hotel', price: 1250, roomType: 'Hotel Room', capacity: 2 },
  { name: 'Premier Hotel Umhlanga', price: 1300, roomType: 'Hotel Room', capacity: 2 },
  { name: 'aha Gateway Hotel Umhlanga', price: 1350, roomType: 'Hotel Room', capacity: 2 },
  { name: 'The Villa Umhlanga', price: 1361, roomType: 'Hotel Room', capacity: 2, includesBreakfast: true },
  { name: 'BlackBrick Umhlanga Rocks', price: 1656, roomType: 'One-Bedroom Apartment with Garden View', capacity: 2, includesBreakfast: true },
  { name: 'Premier Splendid Inn Umhlanga', price: 1662, roomType: 'Deluxe King Room', capacity: 2 },
  { name: 'Holiday Inn Express Durban - Umhlanga', price: 1752, roomType: 'Standard Double Room with Sofa Bed', capacity: 2, includesBreakfast: true },
  { name: 'Protea Hotel by Marriott Durban Umhlanga', price: 2010, roomType: 'King Room', capacity: 2 },
  { name: 'Hilton Garden Inn Umhlanga Arch', price: 2114, roomType: 'Twin Room', capacity: 2 },
  { name: 'The Capital Pearls Hotel', price: 2422, roomType: 'Executive Studio', capacity: 2 },
  { name: 'Radisson Blu Hotel, Durban Umhlanga', price: 3232, roomType: 'Standard Room', capacity: 2 },
  { name: 'Oceans Apartments Balcony Suites Radisson Blu', price: 3596, roomType: 'Apartment', capacity: 2 },
];

// Combined Durban budget hotels (for backward compatibility)
const durbanBudgetHotels = durbanBudgetHotels2Sleeper;

// Durban affordable hotels - use generic placeholders like other destinations

// Affordable pricing tiers (per night) - 10 hotels A-J
const affordablePrices = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100];
// Premium pricing tiers (per night) - 10 hotels A-J
const premiumPrices = [2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100];

// Premium Hotels with their actual names (prices will use premiumPrices array - 4 hotels per destination)
const premiumHotelNames: Record<string, { name: string; includesBreakfast?: boolean; capacity?: '2_sleeper' | '4_sleeper'; nightlyRate?: number; sleeps?: number; roomType?: string; starRating?: number }[]> = {
  'harties': [
    { name: 'Indlovukazi Guesthouse', nightlyRate: 1150, includesBreakfast: true },
    { name: 'Villa Paradiso Hotel', nightlyRate: 1100 },
    { name: 'Cocomo Boutique Hotel', nightlyRate: 1200 },
    { name: 'The Riverleaf Hotel', nightlyRate: 1500, includesBreakfast: true },
    { name: 'Kosmos Manor', nightlyRate: 1050 },
    { name: 'Palm Swift Luxury', nightlyRate: 1500, includesBreakfast: true },
    { name: 'The Venue Country Hotel and Spa', nightlyRate: 1093, includesBreakfast: true },
    { name: 'Waterfront Guesthouse', nightlyRate: 840 },
    { name: 'MetsingAt Harties', nightlyRate: 1134, includesBreakfast: true },
    { name: 'Marina View Guesthouse', nightlyRate: 950 },
    { name: 'Cozy Kosmos', nightlyRate: 1000, includesBreakfast: true },
    { name: 'Serenity Guesthouse', nightlyRate: 900 },
    { name: 'Laetari Guest House', nightlyRate: 1080, sleeps: 4, roomType: 'Two-Bedroom House (3 beds, sleeps 4)' },
    { name: "Vulture's View 1", nightlyRate: 1246, sleeps: 4, roomType: 'Two-Bedroom Chalet (2 double beds, sleeps 4)' },
    { name: 'Die Plasie Two-Bedroom Flat', nightlyRate: 1400, sleeps: 4, roomType: 'Two-Bedroom Apartment (sleeps 4)', starRating: 3 },
    { name: 'Chalet 1 Camping Style at Cynthias Country', nightlyRate: 1437, sleeps: 4, roomType: 'One-Bedroom Chalet (3 beds, sleeps 4)', starRating: 3 },
    { name: 'Chalet 2 Camping Style at Cynthias Country', nightlyRate: 1437, sleeps: 4, roomType: 'One-Bedroom Chalet (3 beds, sleeps 4)', starRating: 3 },
    { name: 'Kadesh Barnea Camping Site', nightlyRate: 1600, sleeps: 4, roomType: '6-Bed Mixed Dormitory Room (sleeps 4)' },
    { name: 'Damascus Bush Lodge', nightlyRate: 1625, sleeps: 4, roomType: '2x Budget Double or Twin Room (sleeps 4)' },
    { name: 'Cock & Bull Restaurant - Pub - Accommodation', nightlyRate: 1425, sleeps: 4, roomType: '2x Budget Cabin (2 bungalows, sleeps 4)' },
    { name: 'Chalet 4 at Cynthias Country', nightlyRate: 1672, sleeps: 4, roomType: 'Three-Bedroom Chalet (sleeps 4)', starRating: 3 },
    { name: 'Chalet 3 at Cynthias Country', nightlyRate: 1672, sleeps: 4, roomType: 'Two-Bedroom Chalet (4 beds, sleeps 4)', starRating: 3 },
    { name: 'Guesthouse Serenity', nightlyRate: 1696, sleeps: 4, roomType: '2x Budget Double Room (sleeps 4)', starRating: 3 },
    { name: 'Mill Lane Farmhouse', nightlyRate: 1705, sleeps: 4, roomType: 'Family Room with Mountain View (sleeps 4)' },
    { name: 'Cottage 1 at Cynthias Country', nightlyRate: 1756, sleeps: 4, roomType: 'Three-Bedroom House (sleeps 4)', starRating: 3 },
    { name: 'The Yacht House', nightlyRate: 1850, sleeps: 4, roomType: 'Standard Queen Room + Double Room with Private Bathroom (sleeps 4)' },
    { name: 'Cottage 2 at Cynthias Country', nightlyRate: 1756, sleeps: 4, roomType: 'Three-Bedroom House (4 beds, sleeps 4)', starRating: 3 },
    { name: 'Sun Deck Lodge', nightlyRate: 1930, sleeps: 4, roomType: 'Queen Studio + Family Room with Bathroom (sleeps 4)' },
    { name: 'Pretorius Park', nightlyRate: 2000, sleeps: 4, roomType: '2x Double Room with Private Bathroom (sleeps 4)', starRating: 3 },
    { name: 'VinVid Harties Guesthouse', nightlyRate: 2025, sleeps: 4, roomType: 'Budget Single Room + Family Room with Private Bathroom (sleeps 4)', starRating: 3 },
    { name: 'Shalamanzi Lodge', nightlyRate: 2080, sleeps: 4, roomType: 'Family Room with Mountain View (3 beds, sleeps 4)' },
    { name: 'BY Guest House', nightlyRate: 2100, sleeps: 4, roomType: 'Double Room with Lake View (sleeps 4)', starRating: 3 },
    { name: 'Bossi Lodge', nightlyRate: 2100, sleeps: 4, roomType: 'Deluxe Family Room (3 beds, sleeps 4)' },
    { name: 'ZAKA Lodge', nightlyRate: 2124, sleeps: 4, roomType: 'Family Room (3 beds, sleeps 4)' },
    { name: 'Cathy & P Guesthouse', nightlyRate: 2149, sleeps: 4, roomType: '2x Double Room with Private Bathroom (sleeps 4)', starRating: 3 },
    { name: 'La Bastide Guest House', nightlyRate: 1900, sleeps: 4, roomType: 'Two-Bedroom Cottage (sleeps 4)' },
    { name: 'Mia Hills Guest House', nightlyRate: 2200, sleeps: 4, roomType: 'Economy Double Room + Double Room with Mountain View (sleeps 4)', starRating: 3 },
    { name: 'Koinonia Bush Lodge', nightlyRate: 2200, sleeps: 4, roomType: 'Family Bungalow (sleeps 4)' },
    { name: 'Mountain Dreamers', nightlyRate: 1980, sleeps: 4, roomType: 'Deluxe Double Room + Double Room with Shared Toilet (sleeps 4)' },
    { name: 'Pamensky Bush Spa and Accommodation', nightlyRate: 2209, sleeps: 4, roomType: 'Family Room with Mountain View (3 beds, sleeps 4)' },
    { name: 'Tersus Riverbend Lodge', nightlyRate: 2329, sleeps: 4, roomType: '2x Deluxe Double Room (sleeps 4)' },
    { name: 'Nova - PalmValley', nightlyRate: 2430, sleeps: 4, roomType: 'Two-Bedroom Apartment - Annex (sleeps 4)', starRating: 3 },
    { name: 'The Garden on Hartbeespoort', nightlyRate: 2300, sleeps: 4, roomType: 'Two-Bedroom Villa (4 beds, sleeps 4)' },
    { name: 'Andrimat Signature Suites', nightlyRate: 2520, sleeps: 4, roomType: 'Family Room (2 large double beds, sleeps 4)', starRating: 3 },
    { name: 'The Art Guesthouse', nightlyRate: 2610, sleeps: 4, roomType: '2x Deluxe Queen Room (sleeps 4)', starRating: 4 },
    { name: 'Waterfront Guest House', nightlyRate: 2597, sleeps: 4, roomType: 'Double Room with Private Bathroom + Deluxe Room (sleeps 4)', starRating: 3 },
    { name: 'The Venue Country Hotel, Lanseria', nightlyRate: 2753, includesBreakfast: true, sleeps: 4, roomType: '2x Standard Twin Room (sleeps 4)', starRating: 3 },
    { name: 'The Magalies Nest - Self Catering Accommodation', nightlyRate: 2800, sleeps: 4, roomType: 'Deluxe Queen Room + Deluxe Double Room with Shower (sleeps 4)', starRating: 3 },
    { name: 'The Manzi Villa', nightlyRate: 2850, sleeps: 4, roomType: 'Deluxe Double Room with Shower + Double Room with Private Bathroom (sleeps 4)' },
    { name: 'Pumleni Guesthouse', nightlyRate: 2880, sleeps: 4, roomType: 'Standard Double Room + Triple Room (sleeps 4)', starRating: 3 },
    { name: 'Khayamanzi Guesthouse', nightlyRate: 2880, sleeps: 4, roomType: '2x Standard Double Room (sleeps 4)', starRating: 3 },
    { name: 'Thatch View', nightlyRate: 2520, sleeps: 4, roomType: 'Apartment with Terrace (2 bedrooms, sleeps 4)', starRating: 3 },
    { name: 'La Montagne Guest Lodge', nightlyRate: 2923, sleeps: 4, roomType: '2x Luxury Tent (sleeps 4)', starRating: 4 },
    { name: 'Re-Union Vacations', nightlyRate: 2565, includesBreakfast: true, sleeps: 4, roomType: 'Family Room with Bathroom (2 double beds, sleeps 4)', starRating: 4 },
    { name: 'On Golden Pond - Mount Amanzi', nightlyRate: 2939, sleeps: 4, roomType: 'Superior Chalet (2 bedrooms, sleeps 4)', starRating: 3 },
    { name: 'Hartbeespoortdam Lodge', nightlyRate: 2590, includesBreakfast: true, sleeps: 4, roomType: 'Standard Queen Room + Double Room with Lake View (sleeps 4)' },
    { name: 'Kassaboera Lodge', nightlyRate: 2610, sleeps: 4, roomType: '2x Double Room (sleeps 4)', starRating: 4 },
    { name: 'CMK Lodge', nightlyRate: 3000, sleeps: 4, roomType: 'Two-Bedroom House (sleeps 4)' },
    { name: 'Guesthouse 1921', nightlyRate: 3000, sleeps: 4, roomType: 'Deluxe Family Room (3 beds, sleeps 4)', starRating: 3 },
    { name: 'Mountain Spa Lodge & Hiking Campsite', nightlyRate: 3060, sleeps: 4, roomType: '2x Double Room with Garden View (sleeps 4)' },
    { name: "Annie's Boutique Guesthouse and Garden Spa", nightlyRate: 3120, includesBreakfast: true, sleeps: 4, roomType: '2x Double Room (sleeps 4)', starRating: 4 },
    { name: 'Koraalboom at Benlize', nightlyRate: 3183, sleeps: 4, roomType: 'Two-Bedroom Apartment (4 beds, sleeps 4)', starRating: 4 },
    { name: 'Goldeneye Chalet - Hidden Gem of Harties', nightlyRate: 3200, sleeps: 4, roomType: 'Two-Bedroom Chalet (sleeps 4)' },
    { name: 'THE GALLARY INN, Kosmos', nightlyRate: 3200, sleeps: 4, roomType: '2x Queen Room with Balcony (sleeps 4)' },
    { name: 'The Farm', nightlyRate: 3240, sleeps: 4, roomType: 'Three-Bedroom Apartment (3 double beds, sleeps 4)', starRating: 3 },
    { name: '129inHarties Lodge and SPA', nightlyRate: 3381, sleeps: 4, roomType: 'Standard Double Room + Standard Queen Room (sleeps 4)', starRating: 3 },
    { name: 'Bali at Scenic Haven Lodge in Hartbeespoort', nightlyRate: 3015, sleeps: 4, roomType: 'Family Room (3 beds, sleeps 4)' },
    { name: 'Migdash Guesthouse', nightlyRate: 3591, includesBreakfast: true, sleeps: 4, roomType: 'Lavender Deluxe King Room + Peony Deluxe Queen Room (sleeps 4)', starRating: 4 },
    { name: 'Ponciana Superior Guesthouse', nightlyRate: 3600, includesBreakfast: true, sleeps: 4, roomType: '2x Double Room with Terrace (sleeps 4)', starRating: 3 },
    { name: 'Kosmos Lodge', nightlyRate: 3600, sleeps: 4, roomType: 'Deluxe Double Room with Shower + Deluxe Queen Room (sleeps 4)', starRating: 4 },
    { name: 'Die BosKamp - Hartbeespoort Dam', nightlyRate: 3600, sleeps: 4, roomType: 'Chalet (3 beds, sleeps 4)' },
    { name: 'Magalies Mountain Lodge and Spa', nightlyRate: 3230, sleeps: 4, roomType: '2x Classic Triple Room (sleeps 4)', starRating: 3 },
    { name: 'The Shore House', nightlyRate: 3267, includesBreakfast: true, sleeps: 4, roomType: '2x Double Room (sleeps 4)', starRating: 4 },
    { name: '202 on Crescent - Luxury Wildlife Escape', nightlyRate: 3771, sleeps: 4, roomType: 'Three-Bedroom House (sleeps 4)' },
    { name: 'Mafofolozi Lodge', nightlyRate: 3783, sleeps: 4, roomType: 'Double Room with Terrace + Double Room with Lake View (sleeps 4)' },
    { name: 'Letamong', nightlyRate: 3330, includesBreakfast: true, sleeps: 4, roomType: '2x Double Room with Dam View (sleeps 4)', starRating: 4 },
    { name: 'Watershed Guest House', nightlyRate: 3900, sleeps: 4, roomType: 'Suite with Lake View + Deluxe Suite (sleeps 4)', starRating: 3 },
    { name: 'Galagos Guest House', nightlyRate: 3870, sleeps: 4, roomType: '2x Double Room with Lake View (sleeps 4)', starRating: 4 },
    { name: 'Die Ou Pastorie', nightlyRate: 3910, includesBreakfast: true, sleeps: 4, roomType: '2x Double or Twin Room with Garden View (sleeps 4)', starRating: 3 },
    { name: "Junior's Inn Place", nightlyRate: 3969, sleeps: 4, roomType: 'Double Room (5 beds, sleeps 4)' },
    { name: 'La Serenita @ Migdash', nightlyRate: 3500, sleeps: 4, roomType: 'Luxury Apartment (1 bedroom, sleeps 4)', starRating: 3 },
    { name: 'Le Bamboo Guest House And Boat Cruise', nightlyRate: 4040, sleeps: 4, roomType: 'Family Room (2 double beds, sleeps 4)', starRating: 3 },
    { name: 'Olives by Agnes 33', nightlyRate: 4050, sleeps: 4, roomType: 'Three-Bedroom Apartment (3 double beds, sleeps 4)', starRating: 4 },
    { name: 'El Shadai Guest House & Spa Hartbeespoort', nightlyRate: 3800, includesBreakfast: true, sleeps: 4, roomType: 'Economy Double Room + Luxury Family Room (sleeps 4)', starRating: 4 },
    { name: 'Three Oaks and an Aloe Boutique Hotel', nightlyRate: 4490, includesBreakfast: true, sleeps: 4, roomType: 'Villa (2 bedrooms, sleeps 4)', starRating: 4 },
    { name: 'La Dolce Vita Guest House', nightlyRate: 4600, sleeps: 4, roomType: '2x Luxury Queen Room (sleeps 4)', starRating: 4 },
    { name: 'Château La Mer Exclusive Guesthouse & Spa', nightlyRate: 4617, includesBreakfast: true, sleeps: 4, roomType: '2x Deluxe Double Room (sleeps 4)', starRating: 4 },
    { name: 'Pecanwood Lake View', nightlyRate: 4703, sleeps: 4, roomType: 'One-Bedroom Apartment (6 beds, sleeps 4)' },
    { name: 'Hillside Villa Hartbeespoort', nightlyRate: 4725, sleeps: 4, roomType: 'Superior Villa (5 bedrooms, sleeps 4)' },
    { name: 'Pecanwood Treasure Hartbeespoort Dam', nightlyRate: 4500, sleeps: 4, roomType: 'Villa (4 bedrooms, sleeps 4)', starRating: 4 },
    { name: 'Hoyozela', nightlyRate: 4800, sleeps: 4, roomType: 'Villa (3 bedrooms, sleeps 4)' },
    { name: 'Casa Bella', nightlyRate: 4800, sleeps: 4, roomType: 'Three-Bedroom Home (sleeps 4)' },
    { name: 'Pecanwood Golf Estate 3BR Home', nightlyRate: 4500, sleeps: 4, roomType: 'Villa (3 bedrooms, sleeps 4)', starRating: 4 },
    { name: 'Casa Bianca Guest Lodge', nightlyRate: 4250, includesBreakfast: true, sleeps: 4, roomType: '2x Twin Room with Mountain View (sleeps 4)', starRating: 4 },
    { name: 'Red Cascade - Luxury 4 Bedrooms', nightlyRate: 4850, sleeps: 4, roomType: 'Four-Bedroom House (sleeps 4)', starRating: 3 },
    { name: 'Waters View Villa, 5 Bedroom House', nightlyRate: 4875, sleeps: 4, roomType: 'Five-Bedroom House (sleeps 4)', starRating: 4 },
  ],
  'magalies': [
    { name: 'Cocomo Boutique Hotel', nightlyRate: 1200 },
    { name: 'Mount Grace Hotel And Spa', nightlyRate: 2988, includesBreakfast: true },
    { name: 'Cradle Boutique Hotel', nightlyRate: 4500, includesBreakfast: true },
    { name: 'Valley Lodge & Spa', nightlyRate: 2289, includesBreakfast: true },
    { name: 'Palmera Guest House', nightlyRate: 850, sleeps: 2, roomType: 'Double Room (1 full bed, sleeps 2)' },
    { name: 'Sleep Over Lanseria', nightlyRate: 1426, sleeps: 2, roomType: 'Standard Room (sleeps 2)' },
    { name: 'Misty Hills Country Hotel, Conference Centre & Spa', nightlyRate: 1805, sleeps: 2, roomType: 'Deluxe Room (3 beds, sleeps 2)' },
    { name: 'Glenburn Lodge & Spa', nightlyRate: 2118, includesBreakfast: true, sleeps: 2, roomType: 'Standard Double or Twin Room (sleeps 2)' },
    { name: 'Glenburn Lodge & Spa \u2014 Dinner, Bed & Breakfast', nightlyRate: 2460, includesBreakfast: true, sleeps: 2, roomType: 'Standard Double or Twin Room \u2014 Breakfast & Dinner (sleeps 2)' },
    { name: 'aha Lesedi African Lodge & Cultural Village', nightlyRate: 2240, includesBreakfast: true, sleeps: 2, roomType: 'Twin Room (1 double or 2 twins, sleeps 2)' },
    { name: 'Maropeng Boutique Hotel', nightlyRate: 2243, includesBreakfast: true, sleeps: 2, roomType: 'Double Room (1 king bed, sleeps 2)' },
    { name: '26\u00b0 South Bush Boho Hotel', nightlyRate: 2268, includesBreakfast: true, sleeps: 2, roomType: 'Double Room (1 queen bed, sleeps 2)' },
    { name: 'Avianto', nightlyRate: 3230, includesBreakfast: true, sleeps: 2, roomType: 'Double Room (1 queen bed, sleeps 2)' },
    // ===== 4-sleeper options (nightly rate = supplied 2-night total ÷ 2) =====
    { name: 'Old Mill B&B', nightlyRate: 850, sleeps: 4, roomType: 'Double Room with Garden View (sleeps 4)', includesBreakfast: true },
    { name: 'The Lazy Lapa', nightlyRate: 1026, sleeps: 4, roomType: 'Two-Bedroom Suite (sleeps 4)', starRating: 4 },
    { name: 'Kruger Ranch', nightlyRate: 1350, sleeps: 4, roomType: 'Two-Bedroom Chalet (sleeps 4)' },
    { name: 'Thaba Manzi Ranch', nightlyRate: 1200, sleeps: 4, roomType: 'Classic Cottage (sleeps 4)', starRating: 3 },
    { name: "Ma-Ria's Farmhouse", nightlyRate: 1400, sleeps: 4, roomType: 'Five-Bedroom House (sleeps 4)', starRating: 3 },
    { name: 'Kokopelli Farm', nightlyRate: 1900, sleeps: 4, roomType: 'Two-Bedroom Apartment (sleeps 4)', starRating: 4 },
    { name: 'Whispering Pines Country Estate', nightlyRate: 2803, sleeps: 4, roomType: 'Deluxe Family Cabin (sleeps 4)', includesBreakfast: true, starRating: 4 },
    { name: 'Mahikeng Lodge', nightlyRate: 3209, sleeps: 4, roomType: 'Two-Bedroom Chalet (sleeps 4)' },
    { name: 'Budmarsh Country Lodge', nightlyRate: 3348, sleeps: 4, roomType: 'Standard & Deluxe Double or Twin Rooms (sleeps 4)', includesBreakfast: true },
    { name: 'Sanctuary Life Guest Farm', nightlyRate: 4000, sleeps: 4, roomType: 'Two-Bedroom Chalet (sleeps 4)', starRating: 4 },
    { name: 'Olive Tree Farm', nightlyRate: 4920, sleeps: 4, roomType: 'Family Suite (sleeps 4)', starRating: 3 },
    { name: 'Stone Hill', nightlyRate: 5355, sleeps: 4, roomType: 'Cottage 10 — Two-Bedroom (sleeps 4)' },
    { name: 'African Hills Safari Lodge & Spa', nightlyRate: 10640, sleeps: 4, roomType: '2x Standard Double or Twin Room with Garden View (sleeps 4)', includesBreakfast: true, starRating: 4 },
    { name: 'De Hoek Country Hotel', nightlyRate: 32550, sleeps: 4, roomType: 'Deluxe Family Room (sleeps 4)', includesBreakfast: true, starRating: 5 },
    { name: 'Cave View Cottages — Silo Cottage', nightlyRate: 1426, sleeps: 4, roomType: 'Family Suite (sleeps 4)', starRating: 4 },
    { name: 'CradleLicious Camp & Caravan', nightlyRate: 377, sleeps: 4, roomType: 'Tent — 4 single beds (sleeps 4)' },
    { name: 'CradleLicious Farm Mpshe Cottage', nightlyRate: 848, sleeps: 4, roomType: 'Family Suite with Balcony (sleeps 4)', starRating: 4 },
    { name: 'Sunrise Mountain Views', nightlyRate: 3420, sleeps: 4, roomType: 'Three-Bedroom Villa (sleeps 4)', starRating: 4 },
    { name: 'FARMHOUSE58', nightlyRate: 9513, sleeps: 4, roomType: 'Family Room with Garden View (sleeps 4)' },
    { name: 'Cradlestone Camp', nightlyRate: 8800, sleeps: 4, roomType: 'Four-Bedroom Holiday Home (sleeps 4)', starRating: 4 },
    { name: 'The Cottage', nightlyRate: 880, sleeps: 4, roomType: 'Two-Bedroom Apartment (sleeps 4)', starRating: 4 },
    { name: 'LikeHome Guesthouse', nightlyRate: 1200, sleeps: 4, roomType: 'Two-Bedroom Apartment (sleeps 4)' },
    { name: 'Cradle Mount Hotel Suites', nightlyRate: 1305, sleeps: 4, roomType: 'Deluxe Suite & Standard Queen Room (sleeps 4)' },
    { name: 'Greenstone Guesthouse', nightlyRate: 1499, sleeps: 4, roomType: 'Queen Room — 3 beds (sleeps 4)', starRating: 3 },
    { name: 'Cradle Thatch Accommodation', nightlyRate: 1600, sleeps: 4, roomType: 'Three-Bedroom Apartment (sleeps 4)', starRating: 4 },
    { name: 'Kromdraai Guest Rooms', nightlyRate: 1600, sleeps: 4, roomType: '2x Double Room with Pool View (sleeps 4)', starRating: 3 },
    { name: 'Amberlight Self Catering Accommodation', nightlyRate: 1500, sleeps: 4, roomType: 'Private Suite (sleeps 4)' },
    { name: 'The Cradle Berry Farm', nightlyRate: 1890, sleeps: 4, roomType: 'Deluxe Family Suite (sleeps 4)' },
    { name: 'Aviators Retreat B&B', nightlyRate: 1900, sleeps: 4, roomType: 'Family Room (sleeps 4)', starRating: 3 },
    { name: 'Christi-Lue Villa Guest House', nightlyRate: 1530, sleeps: 4, roomType: 'Three-Bedroom Holiday Home (sleeps 4)', starRating: 4 },
    { name: 'Alto Log Cabin', nightlyRate: 1950, sleeps: 4, roomType: 'Two-Bedroom Chalet (sleeps 4)', starRating: 3 },
    { name: 'Cradle Mount Hotel', nightlyRate: 1980, sleeps: 4, roomType: '2x Executive King Room (sleeps 4)' },
    { name: 'Zacks Country Stay', nightlyRate: 2200, sleeps: 4, roomType: '2x Queen Room (sleeps 4)', starRating: 3 },
    { name: 'Falconbridge Properties', nightlyRate: 2448, sleeps: 4, roomType: 'Four-Bedroom House (sleeps 4)', starRating: 3 },
    { name: 'Rabbit Hole Hotel', nightlyRate: 3240, sleeps: 4, roomType: '2x Deluxe King Room (sleeps 4)', starRating: 3 },
    { name: 'Kloofzicht Lodge & Spa', nightlyRate: 7571, sleeps: 4, roomType: 'Family Suite (sleeps 4)', starRating: 5 },
    { name: 'Eagle Nest Luxury Accommodation', nightlyRate: 1870, sleeps: 4, roomType: '2x Queen Room (sleeps 4)' },
    { name: 'Hole In One', nightlyRate: 2700, sleeps: 4, roomType: 'Family Room (sleeps 4)', starRating: 4 },
    { name: 'Riverstone Lodge', nightlyRate: 3089, sleeps: 4, roomType: '2x Queen Room with Balcony (sleeps 4)', starRating: 3 },
    { name: 'Black Eagle Hotel & Spa', nightlyRate: 3336, sleeps: 4, roomType: '2x Superior Double or Twin Room (sleeps 4)', starRating: 4 },
    { name: 'Bosheuvel Country Estate', nightlyRate: 3000, sleeps: 4, roomType: '2x Comfort King Room (sleeps 4)' },
    { name: 'Silverstar Hotel', nightlyRate: 6164, sleeps: 4, roomType: 'Standard King Room & Double Room (sleeps 4)', starRating: 4 },
    { name: 'Vivari Hotel and Spa by Mantis', nightlyRate: 7740, sleeps: 4, roomType: '2x Classic King Room (sleeps 4)', starRating: 5 },
    { name: 'Riverhorse Lodge', nightlyRate: 28800, sleeps: 4, roomType: 'Deluxe Villa (sleeps 4)' },
    { name: 'Town Lodge Roodepoort', nightlyRate: 2748, sleeps: 4, roomType: '2x Twin Room (sleeps 4)', starRating: 2 },
    { name: 'Protea Ridge Guest Cottages and Conference Centre', nightlyRate: 3000, sleeps: 4, roomType: 'Family Suite (sleeps 4)' },
    { name: 'Maropeng Boutique Hotel — Family Option', nightlyRate: 4486, sleeps: 4, roomType: '2x Double Room (sleeps 4)', includesBreakfast: true, starRating: 4 },
    { name: 'Valley Lodge & Spa — Family Option', nightlyRate: 4720, sleeps: 4, roomType: '2x Standard Double Room (sleeps 4)', starRating: 4 },
    { name: 'Mount Grace Hotel & Spa — Family Option', nightlyRate: 8541, sleeps: 4, roomType: '2x Standard King Room (sleeps 4)', includesBreakfast: true, starRating: 5 },
    { name: 'Misty Hills Country Hotel, Conference Centre & Spa — Family Option', nightlyRate: 3467, sleeps: 4, roomType: '2x Deluxe Double or Twin Room (sleeps 4)', starRating: 4 },
    { name: '26° South Bush Boho Hotel — Family Option', nightlyRate: 3779, sleeps: 4, roomType: '2x Double Room (sleeps 4)' },
    { name: 'Glenburn Lodge & Spa — Three-Bedroom Chalet', nightlyRate: 6582, sleeps: 4, roomType: 'Three-Bedroom Chalet (sleeps 4)', starRating: 3 },
    { name: 'Palmera Guest House — Family Room', nightlyRate: 1350, sleeps: 4, roomType: 'Family Room — 3 beds (sleeps 4)', starRating: 4 },
    { name: 'SleepOver Lanseria — Family Option', nightlyRate: 2722, sleeps: 4, roomType: '2x Twin Room (sleeps 4)' },
    { name: 'Cradle Boutique Hotel — Family Option', nightlyRate: 10854, sleeps: 4, roomType: '2x Executive Double Room (sleeps 4)' },
  ],
  'durban': [
    { name: 'Coastlands Umhlanga Hotel', nightlyRate: 1500 },
    { name: 'The Capital Pearls Durban', nightlyRate: 1400 },
    { name: 'Oyster Box Hotel', nightlyRate: 4500, includesBreakfast: true },
    { name: 'Southern Sun Elangeni', nightlyRate: 1601, includesBreakfast: true },
  ],
  'umhlanga': [
    { name: 'Breakers Resort Apartments', nightlyRate: 1200 },
    { name: 'aha Gateway Hotel Umhlanga', nightlyRate: 1350 },
    { name: 'The Villa Umhlanga', nightlyRate: 1361, includesBreakfast: true },
    { name: 'Protea Hotel by Marriott Durban Umhlanga', nightlyRate: 1848 },
    { name: 'Holiday Inn Express Durban Umhlanga', nightlyRate: 1520, includesBreakfast: true },
    { name: 'Hilton Garden Inn Umhlanga Arch', nightlyRate: 1539 },
    { name: 'Premier Splendid Inn Umhlanga', nightlyRate: 1100 },
    { name: 'First Group Breakers Resort', nightlyRate: 1150 },
    { name: 'Royal Palm Hotel', nightlyRate: 1250 },
    { name: 'Regal Inn Umhlanga Gateway', nightlyRate: 950 },
    { name: 'Premier Hotel Umhlanga', nightlyRate: 1300 },
    { name: 'Radisson Blu Hotel Durban Umhlanga', nightlyRate: 3341 },
    { name: 'The Millennial Umhlanga', nightlyRate: 1100 },
    { name: 'Breakers Resort 232', nightlyRate: 1200 },
    { name: 'Oceans Apartments Balcony Suites Radisson Blu', nightlyRate: 3596 },
    { name: 'Town Lodge Umhlanga', nightlyRate: 1050 },
    { name: '71 Sea Lodge Beachfront Apartment', nightlyRate: 1000 },
  ],
  'umdloti': [
    { name: '94 Camarque Umdloti', nightlyRate: 1350, sleeps: 6, roomType: 'Three-Bedroom Apartment (sleeps up to 6)' },
    { name: 'Club Mykonos Umdloti', nightlyRate: 1590, sleeps: 4, roomType: 'Standard Two-Bedroom Apartment (sleeps up to 4)' },
    { name: 'Umdloti Cabanas', nightlyRate: 2035, sleeps: 4, roomType: 'Two-Bedroom Apartment (sleeps up to 4)' },
    { name: 'Umdloti Holiday Resort Apartments', nightlyRate: 2847, sleeps: 4, roomType: 'Apartment (sleeps up to 4)' },
    { name: 'Umdloti Holiday Resort Apartments \u2014 Superior Apartment', nightlyRate: 3157, sleeps: 4, roomType: 'Superior Apartment (sleeps up to 4)' },
    { name: 'Sands Beach Breaks Umdloti Luxury Beach Front', nightlyRate: 3156, sleeps: 6, roomType: 'Three-Bedroom Beachfront Apartment (sleeps up to 6)' },
    { name: 'The Villa Umdloti', nightlyRate: 5500, sleeps: 10, roomType: 'Five-Bedroom Villa with Sea View (sleeps up to 10)' },
  ],
  'cape-town': [
    { name: 'Sea Point Apartment', nightlyRate: 900 },
    { name: 'The Bantry Aparthotel by Totalstay', nightlyRate: 1100 },
    { name: 'Casa on Kei by Totalstay', nightlyRate: 950 },
    { name: 'Spring Tide Inn by CTHA', nightlyRate: 1050 },
    { name: 'First Group Riviera Suites', nightlyRate: 1200 },
    { name: 'Home Suite Hotels Sea Point', nightlyRate: 1350 },
    { name: 'Camps Bay Village', nightlyRate: 1800 },
    { name: '3 On Camps Bay', nightlyRate: 2200 },
    { name: 'Camps Bay Beach Front Apartment', nightlyRate: 2500 },
    { name: 'Camps Bay Private Room', nightlyRate: 1200 },
    { name: 'Camps Bay Studio', nightlyRate: 1400 },
    { name: 'Cape Diamond Boutique Hotel', nightlyRate: 1100, includesBreakfast: true },
    { name: 'Fountains Hotel', nightlyRate: 1050, includesBreakfast: true },
    { name: 'Holiday Inn Express Cape Town City Centre', nightlyRate: 1250, includesBreakfast: true },
    { name: 'Hotel Sky Cape Town', nightlyRate: 1300 },
    { name: 'Cresta Grande Cape Town', nightlyRate: 1150 },
    { name: 'Radisson Hotel Cape Town Foreshore', nightlyRate: 1800 },
    { name: 'ONOMO Hotel Cape Town Inn On The Square', nightlyRate: 1100 },
    { name: 'ONOMO Hotel Foreshore', nightlyRate: 1050 },
    { name: 'First Beach 203 by CTHA', nightlyRate: 2000 },
    { name: 'Clifton YOLO Spaces', nightlyRate: 2800 },
    { name: 'Radisson RED Hotel V&A Waterfront', nightlyRate: 2100 },
    { name: 'Cape Grace V&A Waterfront', nightlyRate: 5500, includesBreakfast: true },
    { name: 'Waterfront Village V&A Waterfront', nightlyRate: 2400 },
    { name: 'Southern Sun Waterfront', nightlyRate: 2000, includesBreakfast: true },
    { name: 'President Hotel', nightlyRate: 1600 },
    { name: 'The Bay Hotel', nightlyRate: 3200 },
    { name: 'Twelve Apostles Hotel & Spa', nightlyRate: 6000, includesBreakfast: true },
    { name: 'Protea Hotel Sea Point', nightlyRate: 1500, includesBreakfast: true },
    { name: 'The Marly', nightlyRate: 3500 },
  ],
  'sun-city': [
    { name: 'Bakubung Bush Lodge', nightlyRate: 3200, includesBreakfast: true },
    { name: 'The Kingdom Resort', nightlyRate: 2500 },
    { name: 'Kwa Maritane Lodge', nightlyRate: 3500, includesBreakfast: true },
    { name: 'Sundown Country Estate', nightlyRate: 1100 },
    { name: "Getty's Bed and Breakfast", nightlyRate: 800, includesBreakfast: true },
    { name: 'Valley View Guest House', nightlyRate: 750 },
    { name: 'Ivory Tree Game Lodge', nightlyRate: 4000, includesBreakfast: true },
    { name: 'Pilanesberg Hotel', nightlyRate: 1800 },
    { name: 'Kedar Heritage Lodge Conference Centre & Spa', nightlyRate: 2200, includesBreakfast: true },
    { name: 'Royal Marang Hotel', nightlyRate: 1500 },
    { name: 'Sun City Cabanas Hotel (Inside Sun City) — 2 Sleeper', nightlyRate: 2480, includesBreakfast: true, sleeps: 2, roomType: '2 Sleeper Room, Breakfast included, Minimum 2 nights' },
    { name: 'Sun City Cabanas Hotel (Inside Sun City) — 4 Sleeper Family', nightlyRate: 3550, includesBreakfast: true, sleeps: 4, roomType: '4 Sleeper Family Room, Breakfast included, 2 Adults + 2 Kids below 17' },
    // ===== 4-sleeper options (4 adults, rates per night derived from 2-night totals) =====
    { name: 'Kingdoms Place Guesthouse', nightlyRate: 200, sleeps: 4, roomType: 'Family Room with Balcony + Triple Room' },
    { name: 'Tsoga OTirele Guesthouse', nightlyRate: 900, sleeps: 4, roomType: 'Family Room, 2 twin + 1 full bed' },
    { name: 'Serene 3-Bedroom House Near Sun City Resort', nightlyRate: 1072, sleeps: 4, roomType: 'Entire vacation home, 3 bedrooms' },
    { name: 'Kiddy Guest House', nightlyRate: 1100, sleeps: 4, roomType: 'Family Room, 2 full beds' },
    { name: 'Granchis Guesthouse', nightlyRate: 1200, sleeps: 4, roomType: 'Family Room with Private Bathroom, 2 full beds' },
    { name: 'Amza Guest Room', nightlyRate: 1320, sleeps: 4, roomType: 'One-Bedroom Apartment, entire apartment' },
    { name: 'Precious Guest House', nightlyRate: 1400, sleeps: 4, roomType: 'Deluxe Double Room + One-Bedroom Chalet' },
    { name: 'Lapeng Mogwase', nightlyRate: 1398, sleeps: 4, roomType: 'Two-Bedroom Apartment, 2 queen beds, 58 m²' },
    { name: 'AndriMat Roadside Guest Lodge', nightlyRate: 1530, sleeps: 4, roomType: '2× Double Room' },
    { name: 'Legae La Tshepo', nightlyRate: 1550, sleeps: 4, roomType: 'Deluxe Family Room, 5 twin beds' },
    { name: 'Lagai Roi Guesthouse', nightlyRate: 1700, sleeps: 4, roomType: '2× Deluxe Queen Room' },
    { name: 'Dees B and B', nightlyRate: 1710, sleeps: 4, roomType: '2× Standard Double Room' },
    { name: 'Sunrise Guest House', nightlyRate: 1840, sleeps: 4, roomType: '2× Double Room' },
    { name: 'Oteng Lifestyle BnB', nightlyRate: 1881, sleeps: 4, roomType: '2× Deluxe Double Room with Shower' },
    { name: 'Toro Guest House', nightlyRate: 1881, sleeps: 4, roomType: 'Standard Double Room + Deluxe Twin Room' },
    { name: 'Kea Bed and Breakfast', nightlyRate: 1900, sleeps: 4, roomType: '2× Double Room' },
    { name: 'MeLeano Guesthouse', nightlyRate: 1980, sleeps: 4, roomType: '2× Queen Room' },
    { name: 'Pilanesberg View Guest House', nightlyRate: 2070, sleeps: 4, roomType: '2× Double Room' },
    { name: 'Druza’s Guest House', nightlyRate: 2079, sleeps: 4, roomType: '2× Comfort Quadruple Room' },
    { name: 'Joezebel Guesthouse', nightlyRate: 2102, sleeps: 4, roomType: 'Quadruple Room with Bathroom' },
    { name: "Getty's Bed and Breakfast — 4 Sleeper", nightlyRate: 2125, includesBreakfast: true, sleeps: 4, roomType: '2× Double Room with Private Bathroom' },
    { name: 'The Botik Hides', nightlyRate: 2150, sleeps: 4, roomType: 'Classic Double Room + Standard Double Room' },
    { name: 'Andrimat Family Nest', nightlyRate: 2185, sleeps: 4, roomType: 'Two-Bedroom House, entire vacation home' },
    { name: 'Elitha Boutique Bed and Breakfast', nightlyRate: 2200, sleeps: 4, roomType: '2× Standard Double Room' },
    { name: 'SolDin Guest House', nightlyRate: 2310, sleeps: 4, roomType: '2× Double Room, 2 queen beds' },
    { name: 'Marys BnB', nightlyRate: 2340, sleeps: 4, roomType: '2× Deluxe Room' },
    { name: 'Vicky B Bed and Breakfast', nightlyRate: 2400, sleeps: 4, roomType: '2× Double Room' },
    { name: 'Latifahs Home', nightlyRate: 2529, sleeps: 4, roomType: 'Two-Bedroom Apartment, entire apartment' },
    { name: 'SelaMod Village Guest House', nightlyRate: 2565, sleeps: 4, roomType: 'Deluxe Double Room with Bath + Double Room' },
    { name: 'Lapeng La Heso Guest House', nightlyRate: 2610, sleeps: 4, roomType: '2× Double Room, 4 twin beds' },
    { name: 'Elephant House (2 Bedroom House near Pilanesberg)', nightlyRate: 2650, sleeps: 4, roomType: 'Entire vacation home, 2 bedrooms, 2 queen beds' },
    { name: 'Ou Kraal Tented Lodge', nightlyRate: 2657, sleeps: 4, roomType: 'Tent, 2 twin + 1 queen bed' },
    { name: 'Kamogelo Guest House', nightlyRate: 2745, sleeps: 4, roomType: 'Family Suite, private suite' },
    { name: 'Lion House (3 Bedroom House near Pilanesberg)', nightlyRate: 2950, sleeps: 4, roomType: 'Deluxe Holiday Home, 3 bedrooms' },
    { name: 'Lefa Guesthouse', nightlyRate: 3000, sleeps: 4, roomType: '2× Superior Double Room' },
    { name: 'Sundown Country Estate — Family Suite', nightlyRate: 3950, sleeps: 4, roomType: 'Family Suite, dinner included, 2 twin + 1 king bed' },
    { name: 'Royal Marang Hotel — 4 Sleeper', nightlyRate: 5400, sleeps: 4, roomType: '2× Deluxe Double or Twin Room' },
    { name: 'The Kingdom Resort — Two Bedroom Villa', nightlyRate: 7250, sleeps: 4, roomType: 'Two Bedroom Villa with Splash Pool, 130 m²' },
    { name: 'Stroomrivier Lodge', nightlyRate: 13900, sleeps: 4, roomType: 'Five-Bedroom House, entire vacation home' },
    { name: 'Kwa Maritane Lodge — 4 Sleeper', nightlyRate: 14000, includesBreakfast: true, sleeps: 4, roomType: '2× Standard Twin Room, dinner included' },
    { name: 'Bakubung Bush Lodge — 4 Sleeper', nightlyRate: 14680, includesBreakfast: true, sleeps: 4, roomType: '2× Standard Twin Room, dinner included' },
    { name: 'Makanyane Lodge', nightlyRate: 15000, sleeps: 4, roomType: 'Three-Bedroom House, entire vacation home' },
    { name: 'Kedar Heritage Lodge, Conference Centre & Spa — 4 Sleeper', nightlyRate: 15641, includesBreakfast: true, sleeps: 4, roomType: 'Superior Double or Twin Room' },
    { name: 'Hoogenboomen Lodge', nightlyRate: 15840, sleeps: 4, roomType: 'Eight-Bedroom House, entire vacation home, 900 m²' },
    { name: 'Pangolin Game Lodge (Self Catering, 2 game drives per day)', nightlyRate: 16711, sleeps: 4, roomType: 'Four-Bedroom Vacation Home, 500 m²' },
    { name: 'Bakubung Villas', nightlyRate: 16860, sleeps: 4, roomType: 'Executive 3 Bedroom Villa, 326 m²' },
    { name: 'Pilanesberg Private Lodge', nightlyRate: 18550, sleeps: 4, roomType: 'Villa, 5 bedrooms, all-inclusive' },
    { name: 'Tlou Tribal Lodge', nightlyRate: 19800, sleeps: 4, roomType: '2× Luxury Tent, dinner included' },
    { name: 'Ntamba Safari Lodge', nightlyRate: 23000, sleeps: 4, roomType: 'Luxury Holiday Home, 5 bedrooms, 600 m²' },
    { name: 'Black Rhino Game Lodge', nightlyRate: 24200, sleeps: 4, roomType: '2× Suite with 2 Game Drives, all-inclusive' },
    { name: 'Umoya Safari Lodge', nightlyRate: 24780, sleeps: 4, roomType: '2× Superior Double or Twin Room with Mountain View' },
    { name: "Twitcher's Nest", nightlyRate: 28050, sleeps: 4, roomType: '2× Family Room' },
    { name: 'Ivory Tree Game Lodge — 4 Sleeper', nightlyRate: 31000, includesBreakfast: true, sleeps: 4, roomType: '2× Standard Double or Twin Room, all-inclusive' },
    { name: 'Shepherds Tree Game Reserve', nightlyRate: 37000, sleeps: 4, roomType: '2× Standard Double or Twin Room, all-inclusive' },
    { name: 'Tshukudu Bush Lodge', nightlyRate: 37100, sleeps: 4, roomType: '2× Tshwene Deluxe Suite, all-inclusive' },
    { name: 'Mbazo Safari Collection', nightlyRate: 39000, sleeps: 4, roomType: 'Dzombo Camp Executive Suite + Premier Suite' },
    { name: 'Village Kulture Guest House', nightlyRate: 1600, sleeps: 4, starRating: 3, roomType: '2× Deluxe Double Room' },
    { name: 'Dithabeng View Guest House', nightlyRate: 1785, sleeps: 4, starRating: 3, roomType: 'Family Room with Shower, 3 beds' },
    { name: 'Diphororo Guest House', nightlyRate: 1943, sleeps: 4, starRating: 3, roomType: 'Deluxe Double Room with Bath + Comfort Triple Room' },
    { name: 'Connesione Mogwase', nightlyRate: 2300, sleeps: 4, starRating: 3, roomType: 'Deluxe Holiday Home, 3 bedrooms, 80 m²' },
    { name: 'Cubes Ledig Luxury Apartments', nightlyRate: 2600, sleeps: 4, roomType: '2× One-Bedroom Apartment' },
    { name: 'Rhino House (3 Bedroom House near Pilanesberg)', nightlyRate: 2738, sleeps: 4, starRating: 4, roomType: 'Holiday Home, 3 bedrooms, 89 m²' },
    { name: 'Morokolo Safari Lodge Self-catering', nightlyRate: 20205, sleeps: 4, starRating: 4, roomType: 'Suite, 4 bedrooms, 1400 m²' },
    { name: 'Buffalo Thorn Lodge', nightlyRate: 23200, sleeps: 4, roomType: 'Five-Bedroom House, entire vacation home, 700 m²' },
    { name: 'Tambuti Lodge', nightlyRate: 25940, sleeps: 4, starRating: 4, roomType: 'Luxury King Room + Classic King Room' },
  ],
  'kruger-national-park': [
    { name: 'Pretoriuskop Rest Camp', nightlyRate: 1180, sleeps: 2, roomType: '2-Sleeper Hut (EB2)' },
    { name: 'Pretoriuskop Rest Camp (3-Sleeper Hut - EB3)', nightlyRate: 1540, sleeps: 3, roomType: '3-Sleeper Hut (EB3)' },
    { name: 'Pretoriuskop Rest Camp (4-Sleeper Hut - EB5)', nightlyRate: 1540, sleeps: 4, roomType: '4-Sleeper Hut (EB5)' },
  ],
  'mpumalanga': [
    // ===== 2-sleeper options (nightly rate = supplied 2-night total ÷ 2) =====
    { name: 'Yello Guest House Graskop', nightlyRate: 525, sleeps: 2, roomType: 'Double Room with Shared Bathroom, 1 double bed' },
    { name: 'African Dream Tents', nightlyRate: 632, sleeps: 2, roomType: 'Honeymoon Tent, 1 double bed' },
    { name: "Elephant's Nest", nightlyRate: 618, sleeps: 2, starRating: 4, roomType: 'Deluxe Double Room' },
    { name: 'Matibidi Guest Lodge', nightlyRate: 638, sleeps: 2, roomType: 'Double Room' },
    { name: 'Ikhutseng Guesthouse', nightlyRate: 675, sleeps: 2, roomType: 'Double Room with Shared Bathroom, 1 double bed' },
    { name: 'Havana Nights', nightlyRate: 728, sleeps: 2, roomType: 'One-Bedroom Chalet, 1 living room, kitchen, 72 m²' },
    { name: '2K City Studios', nightlyRate: 750, sleeps: 2, starRating: 3, roomType: 'Apartment, 1 bedroom, 1 living room, kitchen, 34 m²' },
    { name: 'Graskop Family Retreat and Backpackers', nightlyRate: 770, sleeps: 2, roomType: 'Family Bungalow' },
    { name: 'Horizon View Chalets', nightlyRate: 806, sleeps: 2, starRating: 3, roomType: 'One-Bedroom Chalet, 1 living room, kitchen, 55 m²' },
    { name: '41 on Clarendon', nightlyRate: 801, sleeps: 2, roomType: 'Four-Bedroom House, 1 living room, 2 bathrooms, kitchen, 1 000 m²' },
    { name: 'Paradise View Guesthouse', nightlyRate: 810, sleeps: 2, starRating: 4, roomType: 'Standard Studio, 13 m²' },
    { name: 'Chosen Glamping Tents', nightlyRate: 850, sleeps: 2, roomType: 'Tent, 1 large double bed' },
    { name: 'Four Seasons Self-Catering Guest House', nightlyRate: 884, sleeps: 2, starRating: 3, roomType: 'Three-Bedroom Apartment, 2 bathrooms, kitchen, 250 m²' },
    { name: 'Canimambo at The Old Post Office Inn', nightlyRate: 900, sleeps: 2, roomType: 'Queen Room, 1 double bed' },
    { name: 'Log Cabin & Settlers Village', nightlyRate: 945, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'Rustique', nightlyRate: 981, sleeps: 2, starRating: 3, roomType: 'Large Double Room, 1 double bed' },
    { name: 'Thaba Tsweni Lodge & Safaris', nightlyRate: 985, sleeps: 2, starRating: 3, roomType: 'One-Bedroom Chalet, 2 beds' },
    { name: 'Masingita Guest House', nightlyRate: 1000, sleeps: 2, starRating: 3, roomType: 'Budget Double Room, 1 double bed' },
    { name: 'Duvha Guesthouse', nightlyRate: 1026, sleeps: 2, starRating: 3, roomType: 'Queen Room, air conditioning, 1 double bed' },
    { name: 'Autumn Breeze Manor Guest House', nightlyRate: 1062, sleeps: 2, starRating: 3, roomType: 'Standard Double Room, air conditioning, 1 double bed' },
    { name: 'Beach Island Graskop', nightlyRate: 1105, sleeps: 2, includesBreakfast: true, roomType: 'Standard Tent, 2 single beds' },
    { name: 'Forest and Ferns', nightlyRate: 1200, sleeps: 2, starRating: 4, roomType: 'Luxury Twin Room, 2 single beds' },
    { name: 'Lush', nightlyRate: 1200, sleeps: 2, starRating: 3, roomType: 'Double Room, 1 double bed' },
    { name: 'Soulfenda Guest House', nightlyRate: 1215, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'Blyde Lodge', nightlyRate: 1263, sleeps: 2, starRating: 4, roomType: 'Deluxe Junior Suite, 1 large double bed' },
    { name: 'Panorama Chalets & Rest Camp', nightlyRate: 1300, sleeps: 2, starRating: 3, roomType: 'One-Bedroom Chalet, 1 living room, kitchen, 37 m²' },
    { name: 'A Pilgrims Rest Guest House in Graskop', nightlyRate: 1336, sleeps: 2, starRating: 4, roomType: 'Deluxe Twin Room, air conditioning, 2 single beds' },
    { name: 'Kanyane @ Graskop', nightlyRate: 1400, sleeps: 2, roomType: 'Deluxe Double or Twin Room, 1 extra-large double bed' },
    { name: 'Cozy Guest', nightlyRate: 1400, sleeps: 2, starRating: 4, includesBreakfast: true, roomType: 'Deluxe Double Room with Shower, 1 large double bed' },
    { name: 'Kloofsig Holiday Cottages', nightlyRate: 1440, sleeps: 2, starRating: 2, roomType: 'Two-Bedroom Chalet, 2 bathrooms, kitchen, 160 m²' },
    { name: 'Panorama Home 19', nightlyRate: 1469, sleeps: 2, starRating: 3, roomType: 'Double or Twin Room, 3 beds' },
    { name: "Graskop Harrie's Cottage", nightlyRate: 1470, sleeps: 2, starRating: 4, roomType: 'Holiday Home, 2 bedrooms, 2 bathrooms, kitchen, 250 m²' },
    { name: 'Lisbon Eco Lodge', nightlyRate: 1520, sleeps: 2, starRating: 3, roomType: 'Chalet, 2 bedrooms, kitchen, 42 m²' },
    { name: 'The Spear Guest Lodge', nightlyRate: 1560, sleeps: 2, starRating: 3, roomType: 'Apartment with Garden View, kitchen, 40 m²' },
    { name: 'Panorama View', nightlyRate: 1620, sleeps: 2, starRating: 3, roomType: 'One-Bedroom Chalet, 1 living room, kitchen, 37 m²' },
    { name: 'Crystal Springs Mountain Lodge by MyResorts', nightlyRate: 1634, sleeps: 2, roomType: 'Studio with Patio (Self-Catering)', includesBreakfast: false },
    { name: 'Graskop Cottage', nightlyRate: 1750, sleeps: 2, starRating: 4, roomType: 'Two-Bedroom House, 3 beds, kitchen, 14 m²' },
    { name: 'Yello Guest House Chalets', nightlyRate: 1850, sleeps: 2, roomType: 'Deluxe Double Room, 1 double bed' },
    { name: 'The Gem Emerald', nightlyRate: 1995, sleeps: 2, starRating: 3, roomType: 'Family Room, 3 beds' },
    { name: 'Mosswood Bed & Breakfast', nightlyRate: 1998, sleeps: 2, starRating: 4, includesBreakfast: true, roomType: 'Queen Suite, private suite, 1 large double bed' },
    { name: 'Le Bella Dons', nightlyRate: 2090, sleeps: 2, starRating: 4, roomType: 'Two-Bedroom House, 2 bathrooms, kitchen, 100 m²' },
    { name: 'Panorama Boutique Guest House', nightlyRate: 2095, sleeps: 2, starRating: 4, roomType: 'Standard Queen Room, air conditioning, 1 large double bed' },
    { name: 'Le Soleil', nightlyRate: 2185, sleeps: 2, starRating: 3, roomType: 'Two-Bedroom House, 1 living room, 2 bathrooms, kitchen, 90 m²' },
    { name: 'Angelmalatji Guesthouse', nightlyRate: 2210, sleeps: 2, starRating: 3, roomType: 'Apartment, 4 bedrooms, 4 bathrooms, kitchen, 114 m²' },
    { name: 'Graskop Hotel', nightlyRate: 2381, sleeps: 2, starRating: 4, includesBreakfast: true, roomType: 'Standard Family Room, 3 beds' },
    { name: 'Boh-House', nightlyRate: 2400, sleeps: 2, starRating: 4, roomType: 'Four-Bedroom House, 3 living rooms, 3 bathrooms, kitchen, 140 m²' },
    { name: '83 on De Lange', nightlyRate: 2400, sleeps: 2, roomType: 'Four-Bedroom House, 3 bathrooms, kitchen, 280 m²' },
    { name: 'Panorama Villa', nightlyRate: 2655, sleeps: 2, starRating: 5, includesBreakfast: true, roomType: 'Standard Double Room, air conditioning, 1 double bed' },
    { name: "Molly's Cottage", nightlyRate: 2980, sleeps: 2, starRating: 4, roomType: 'Holiday Home, 3 bedrooms, 2 bathrooms, kitchen, 120 m²' },
    { name: 'Angels View Hotel', nightlyRate: 3323, sleeps: 2, starRating: 4, includesBreakfast: true, roomType: 'Superior Twin Room, air conditioning, 2 single beds' },
    { name: 'Blyde Canyon Forever Resort', nightlyRate: 1400, sleeps: 2 },
    // ===== 4-sleeper options (nightly rate = supplied 2-night total ÷ 2) =====
    // Graskop area
    { name: 'Havana Nights — 4 Sleeper', nightlyRate: 1692, sleeps: 4, roomType: 'One-Bedroom Chalet, 3 beds, 1 living room, 2 bathrooms, kitchen, 72 m²' },
    { name: 'Rustique — 4 Sleeper', nightlyRate: 1701, sleeps: 4, starRating: 3, roomType: 'Entire One-Bedroom Chalet, 3 beds, 1 living room, kitchen, 55 m²' },
    { name: 'Four Seasons Self-Catering Guest House — 4 Sleeper', nightlyRate: 1768, sleeps: 4, starRating: 3, roomType: 'Three-Bedroom Apartment, 4 beds, 2 bathrooms, kitchen, 250 m²' },
    { name: 'Log Cabin & Settlers Village — 4 Sleeper', nightlyRate: 1800, sleeps: 4, roomType: 'Entire Chalet, 2 bedrooms, 4 beds, 2 bathrooms, kitchen, 20 m²' },
    { name: 'Kloofsig Holiday Cottages — 4 Sleeper', nightlyRate: 1944, sleeps: 4, starRating: 2, roomType: 'Two-Bedroom Chalet, 4 beds, 2 bathrooms, kitchen, 160 m²' },
    { name: 'Graskop Cottage — 4 Sleeper', nightlyRate: 2000, sleeps: 4, starRating: 4, roomType: 'Two-Bedroom Holiday Home, 3 beds, kitchen, 140 m²' },
    { name: 'The Gem Emerald — 4 Sleeper', nightlyRate: 2000, sleeps: 4, starRating: 3, roomType: 'Family Room, 3 beds' },
    { name: 'Canimambo at The Old Post Office Inn — 4 Sleeper', nightlyRate: 2100, sleeps: 4, roomType: 'Queen Room + Double Room with Garden View' },
    { name: 'Masingita Guest House — 4 Sleeper', nightlyRate: 2100, sleeps: 4, starRating: 3, roomType: 'Deluxe Double Room with Shower + Double Room' },
    { name: 'Paradise View Guesthouse — 4 Sleeper', nightlyRate: 2040, sleeps: 4, starRating: 3, roomType: 'Standard Studio + Standard Twin Room' },
    { name: 'Le Soleil — 4 Sleeper', nightlyRate: 2185, sleeps: 4, starRating: 3, roomType: 'Two-Bedroom Holiday Home, 5 beds, 2 bathrooms, kitchen, 90 m²' },
    { name: 'Le Bella Dons — 4 Sleeper', nightlyRate: 2200, sleeps: 4, starRating: 4, roomType: 'Two-Bedroom Holiday Home, 3 beds, kitchen, 100 m²' },
    { name: 'Beach Island Graskop — 4 Sleeper', nightlyRate: 2210, sleeps: 4, roomType: '2× Standard Tent, 4 single beds' },
    { name: 'Autumn Breeze Manor Guest House — 4 Sleeper', nightlyRate: 2241, sleeps: 4, starRating: 4, roomType: 'Family Room, 3 beds' },
    { name: 'Duvha Guesthouse — 4 Sleeper', nightlyRate: 2280, sleeps: 4, starRating: 4, roomType: 'Double or Twin Room with Private Bathroom, 2 beds' },
    { name: 'Thaba Tsweni Lodge & Safaris — 4 Sleeper', nightlyRate: 2370, sleeps: 4, starRating: 4, roomType: '2× Superior Chalet (2 Adults), 2 bedrooms, 2 bathrooms, 2 kitchens' },
    { name: 'Boh-House — 4 Sleeper', nightlyRate: 2400, sleeps: 4, starRating: 4, roomType: 'Four-Bedroom Holiday Home, 4 double beds, 3 bathrooms, kitchen, 140 m²' },
    { name: 'Forest and Ferns — 4 Sleeper', nightlyRate: 2400, sleeps: 4, starRating: 4, roomType: '2× Luxury Twin Room, 4 single beds' },
    { name: '83 on De Lange — 4 Sleeper', nightlyRate: 2400, sleeps: 4, roomType: 'Four-Bedroom Holiday Home, 3 bathrooms, kitchen, 280 m²' },
    { name: 'Lush — 4 Sleeper', nightlyRate: 2400, sleeps: 4, starRating: 3, roomType: '2× Double Room, 1 double bed each' },
    { name: 'Soulfenda Guest House — 4 Sleeper', nightlyRate: 2430, sleeps: 4, roomType: '2× Double Room, 1 double bed each' },
    { name: 'Blyde Lodge — 4 Sleeper', nightlyRate: 2525, sleeps: 4, starRating: 3, roomType: '2× Deluxe Junior Suite, 2 large double beds' },
    { name: 'Lisbon Eco Lodge — 4 Sleeper', nightlyRate: 2620, sleeps: 4, starRating: 3, roomType: 'Entire Chalet, 2 bedrooms, 4 beds, kitchen, 42 m²' },
    { name: 'A Pilgrims Rest Guest House in Graskop — 4 Sleeper', nightlyRate: 2672, sleeps: 4, starRating: 4, roomType: 'Deluxe Double Room with Bath + Deluxe Twin Room' },
    { name: 'Angelmalatji Guesthouse — 4 Sleeper', nightlyRate: 2699, sleeps: 4, starRating: 3, roomType: 'Entire Apartment, 4 bedrooms, 5 beds, 4 bathrooms, kitchen, 114 m²' },
    { name: 'Panorama Chalets & Rest Camp — 4 Sleeper', nightlyRate: 2760, sleeps: 4, starRating: 3, roomType: 'Entire Chalet, 2 bedrooms, 4 beds, kitchen, 51 m²' },
    { name: 'Kanyane @ Graskop — 4 Sleeper', nightlyRate: 2800, sleeps: 4, roomType: '2× Deluxe Double or Twin Room, 2 extra-large double beds' },
    { name: "Graskop Harrie's Cottage — 4 Sleeper", nightlyRate: 2790, sleeps: 4, starRating: 4, roomType: 'Two-Bedroom Holiday Home, 4 single beds, 2 bathrooms, kitchen, 250 m²' },
    { name: "Molly's Cottage — 4 Sleeper", nightlyRate: 2980, sleeps: 4, starRating: 4, roomType: 'Three-Bedroom Holiday Home, 4 beds, 2 bathrooms, kitchen, 120 m²' },
    { name: 'The Spear Guest Lodge — 4 Sleeper', nightlyRate: 3119, sleeps: 4, starRating: 3, roomType: '2× Apartment with Garden View, 1 bedroom, kitchen, 40 m² each' },
    { name: 'Panorama View — 4 Sleeper', nightlyRate: 3169, sleeps: 4, roomType: 'One-Bedroom Apartment + One-Bedroom Chalet' },
    { name: 'Graskop Hotel — 4 Sleeper', nightlyRate: 3747, sleeps: 4, starRating: 4, roomType: 'Family Room, 3 beds' },
    { name: 'Panorama Boutique Guest House — 4 Sleeper', nightlyRate: 4190, sleeps: 4, starRating: 4, roomType: '2× Standard Queen Room, 2 large double beds' },
    { name: 'Mosswood Bed & Breakfast — 4 Sleeper', nightlyRate: 4348, sleeps: 4, starRating: 3, roomType: 'Queen Suite + Standard Suite, private suites, 26 m² each' },
    { name: 'Panorama Villa — 4 Sleeper', nightlyRate: 6750, sleeps: 4, starRating: 5, roomType: 'Deluxe Suite, 2 bedrooms, 2 large double beds, 45 m²' },
    { name: 'Angels View Hotel — 4 Sleeper', nightlyRate: 8578, sleeps: 4, starRating: 4, roomType: 'Superior Twin Room + Luxury Classic Twin Room' },
    // Hazyview area
    { name: 'Kruger Park Lodge Unit 550 With Private Pool — 4 Sleeper', nightlyRate: 3700, sleeps: 4, starRating: 4, roomType: 'Family Holiday Home, 3 bedrooms, 4 beds, kitchen, 160 m²' },
    { name: 'Kruger Park Lodge - IKZ2 - 3 Bedroom Chalet — 4 Sleeper', nightlyRate: 3850, sleeps: 4, roomType: 'Entire Three-Bedroom Chalet, 5 beds, kitchen, 200 m²' },
    { name: 'Little Pilgrims Boutique Hotel — 4 Sleeper', nightlyRate: 3888, sleeps: 4, starRating: 4, roomType: '2× Double or Twin Room with Private Bathroom, 4 single beds' },
    { name: 'Kruger Park Lodge Unit No. 216 — 4 Sleeper', nightlyRate: 4000, sleeps: 4, starRating: 3, roomType: 'Entire Three-Bedroom Chalet, 5 beds, 2 bathrooms, kitchen, 228 m²' },
    { name: 'BTV Villa — 4 Sleeper', nightlyRate: 4050, sleeps: 4, roomType: 'Entire Villa, 4 bedrooms, 4 double beds, 3 bathrooms, kitchen, 90 m²' },
    { name: 'Hazyview Cabanas — 4 Sleeper', nightlyRate: 4100, sleeps: 4, roomType: 'Two-Bedroom Chalet with Patio, 3 beds, kitchen, 85 m²' },
    { name: 'Sabie River Bush Lodge — 4 Sleeper', nightlyRate: 4199, sleeps: 4, starRating: 3, roomType: '2× Luxury Bush Tent, 24 m² each' },
    { name: 'Kruger Park Lodge Unit No 440 — 4 Sleeper', nightlyRate: 4200, sleeps: 4, starRating: 3, roomType: 'Entire Chalet, 4 bedrooms, 6 beds, 3 bathrooms, kitchen, 300 m²' },
    { name: 'Hotel Numbi & Garden Suites — 4 Sleeper', nightlyRate: 4320, sleeps: 4, starRating: 3, roomType: '2× Twin Room with Garden View, 4 single beds' },
  ],
  'knysna': [
    { name: 'The Russel Hotel', nightlyRate: 1200, includesBreakfast: true },
    { name: 'Knysna Log-Inn Hotel', nightlyRate: 1350, includesBreakfast: true },
    { name: 'aha The Rex Hotel', nightlyRate: 1500, includesBreakfast: true },
    { name: 'Protea Hotel by Marriott Knysna Quays', nightlyRate: 1800 },
    { name: 'TH39 Thesen Islands', nightlyRate: 2200 },
    { name: 'Belle View @ Knysna Quays', nightlyRate: 1100 },
    { name: 'Knysna Inn', nightlyRate: 900 },
    { name: 'Gem Quays Waterfront', nightlyRate: 1050 },
    { name: 'Amazing Views, Comfortable living space, Knysna', nightlyRate: 950 },
    { name: 'KnysnaQuays 4', nightlyRate: 1000 },
    { name: 'Waterfront Apartment, Waterfront', nightlyRate: 1150 },
    { name: 'Knysna Houseboats', nightlyRate: 1400 },
    { name: 'Spinnaker Quays Waterfront Villa', nightlyRate: 1600 },
    { name: 'Phoenix Lodge and Waterside Accommodation', nightlyRate: 1050 },
    { name: 'Knysna, Pezula Golf Estate', nightlyRate: 2500 },
    { name: 'Issaquena Heights Boutique Hotel', nightlyRate: 1300 },
  ],
  'vaal-river': [
    { name: 'Emerald Casino Hotel — Queen Room', nightlyRate: 3124, roomType: 'Queen Room, 1 queen bed, 33 m²', sleeps: 2 },
    { name: 'Emerald Casino Hotel — Standard Twin Room', nightlyRate: 3124, roomType: 'Standard Twin Room, 2 twin beds, 33 m²', sleeps: 2 },
    { name: 'Emerald Casino Hotel — One-Bedroom Chalet', nightlyRate: 1838, roomType: 'One-Bedroom Chalet, 1 full bed + sofa bed, 45 m², private kitchen', sleeps: 2 },
    { name: 'Emerald Casino Hotel — Two-Bedroom Chalet', nightlyRate: 2836, roomType: 'Two-Bedroom Chalet, 1 full bed + 2 twin beds, 55 m², private kitchen', sleeps: 4 },
    { name: 'Emerald Casino Hotel — Bungalow', nightlyRate: 3754, roomType: 'Bungalow, 1 queen bed, 99 m², private kitchen', sleeps: 2 },
    { name: 'Emerald Casino Hotel — Two-Bedroom Bungalow', nightlyRate: 4332, roomType: 'Two-Bedroom Bungalow, 1 queen bed + 2 twin beds, 99 m², private kitchen', sleeps: 4 },
    { name: 'Emerald Casino Hotel — One-Bedroom Apartment (Non-Smoking)', nightlyRate: 4930, roomType: 'One-Bedroom Apartment, 1 queen bed, 66 m², private kitchen', sleeps: 2 },
    { name: 'Emerald Casino Hotel — King Suite', nightlyRate: 4930, roomType: 'King Suite, 1 king bed, 66 m², balcony with view', sleeps: 2 },
    { name: 'Riviera on the Vaal', nightlyRate: 2000, includesBreakfast: true },
    { name: 'Clivia Lodge', nightlyRate: 1100 },
    { name: 'Troas Boutique Hotel', nightlyRate: 1200 },
    { name: '12 On Vaal Drive Guesthouse', nightlyRate: 900 },
    { name: 'Casa Angelo', nightlyRate: 950 },
    // 2-adult stays from supplied Booking.com listings (2-night totals converted to nightly)
    { name: 'Ngraje Guest House', nightlyRate: 295, sleeps: 2, roomType: 'Double Room with Shared Bathroom, 1 double bed' },
    { name: 'Pearl Guest House', nightlyRate: 324, sleeps: 2, roomType: 'Double Room with Private Bathroom' },
    { name: 'Arcon Guest House', nightlyRate: 347, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'Shivon Vaal Guest House', nightlyRate: 400, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'Coolden Guesthouse', nightlyRate: 400, sleeps: 2, roomType: 'Entire Apartment, 7 bedrooms, 25 m²' },
    { name: 'Jazreel B&B', nightlyRate: 405, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'BK Guest House', nightlyRate: 468, sleeps: 2, roomType: 'Double Room, 1 large double bed' },
    { name: 'Yello Guest House', nightlyRate: 527, sleeps: 2, roomType: 'Deluxe Double Room, 1 double bed' },
    { name: '016 Guest House', nightlyRate: 531, sleeps: 2, roomType: 'Deluxe Queen Room, 1 double bed' },
    { name: 'Iris Bnb on Vaal 2', nightlyRate: 553, sleeps: 2, roomType: 'Double Room with Shared Bathroom, 1 double bed', starRating: 3 },
    { name: 'Golden Highway Guesthouse Sharpville', nightlyRate: 554, sleeps: 2, roomType: 'Double Room, 8 beds' },
    { name: 'AT Ronnies', nightlyRate: 560, sleeps: 2, roomType: 'Double or Twin Room, 1 extra-large double bed', starRating: 3 },
    { name: 'White Rose Guest House', nightlyRate: 567, sleeps: 2, roomType: 'Double Room with Private Bathroom, 1 double bed', starRating: 3 },
    { name: 'Sunflower Guesthouse', nightlyRate: 590, sleeps: 2, roomType: 'Double Room, 1 large double bed' },
    { name: 'Iris Bnb on Vaal', nightlyRate: 595, sleeps: 2, roomType: 'Double Room with Shared Bathroom, 1 large double bed', starRating: 3 },
    { name: 'Urban Escape Day and Night Guest House', nightlyRate: 599, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'House 205', nightlyRate: 600, sleeps: 2, roomType: 'Standard Queen Room, 1 double or 2 singles', starRating: 3 },
    { name: 'Saho Guesthouse', nightlyRate: 603, sleeps: 2, roomType: 'Double Room, 1 double bed', starRating: 3 },
    { name: 'Hillas Ridge Guesthouse', nightlyRate: 650, sleeps: 2, roomType: 'Double Room, 1 double bed', starRating: 3 },
    { name: 'Francos Guest Lodge Accommodation', nightlyRate: 650, sleeps: 2, roomType: 'Double Room with Private Bathroom, 14 beds' },
    { name: 'Vaal Triangle Guest House', nightlyRate: 675, sleeps: 2, roomType: 'Twin Room with Pool View, 2 single beds', includesBreakfast: true },
    { name: 'Lodge36', nightlyRate: 680, sleeps: 2, roomType: 'Deluxe Double Room with Shower, 1 double bed' },
    { name: 'Matlapeng at Thirteen', nightlyRate: 689, sleeps: 2, roomType: 'Budget Double Room, 1 double bed', starRating: 3 },
    { name: 'Stay Over Rentals', nightlyRate: 699, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'Shady Seringa Accommodation', nightlyRate: 704, sleeps: 2, roomType: 'One-Bedroom Apartment, 40 m²' },
    { name: 'Lauren Palace Guest House', nightlyRate: 713, sleeps: 2, roomType: 'Standard Double Room, 1 double bed', starRating: 3 },
    { name: 'Mathwala Guesthouse', nightlyRate: 730, sleeps: 2, roomType: 'Standard Double Room, 1 large double bed' },
    { name: 'Huis Afrika', nightlyRate: 750, sleeps: 2, roomType: 'Standard Family Room, 2 beds', starRating: 3 },
    { name: 'Aalwyns Guesthouse', nightlyRate: 762, sleeps: 2, roomType: 'Deluxe Double or Twin Room', starRating: 4 },
    { name: 'Retro Guesthouse', nightlyRate: 772, sleeps: 2, roomType: 'Queen Room with Pool View, 1 double bed', starRating: 3 },
    { name: 'Triple S Guest House', nightlyRate: 792, sleeps: 2, roomType: '2× Double Room, 2 single beds', starRating: 3 },
    { name: 'Vaal River Guest House', nightlyRate: 800, sleeps: 2, roomType: 'Double Room with Balcony, 3 beds', starRating: 3 },
    { name: 'At Bijl Guesthouse', nightlyRate: 800, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'The Guesthouse', nightlyRate: 850, sleeps: 2, roomType: 'Family Room, 1 double or 2 singles', starRating: 4 },
    { name: 'Luxury Executive Apartment', nightlyRate: 850, sleeps: 2, roomType: 'One-Bedroom Apartment, 40 m²', starRating: 3 },
    { name: 'Premium Apartment with Comfort & Style', nightlyRate: 850, sleeps: 2, roomType: 'One-Bedroom Apartment, 45 m²', starRating: 3 },
    { name: 'Modern Comfort with Easy Access Everywhere', nightlyRate: 850, sleeps: 2, roomType: 'One-Bedroom Apartment, 35 m²', starRating: 3 },
    { name: 'Mall Guesthouse', nightlyRate: 850, sleeps: 2, roomType: 'Deluxe Double Room', starRating: 3 },
    { name: 'Vaal Home near Aquadome', nightlyRate: 855, sleeps: 2, roomType: 'One-Bedroom House, 5 beds, 600 m²', starRating: 3 },
    { name: 'Emerald Resort & Casino', nightlyRate: 1460, sleeps: 2, roomType: 'One-Bedroom Chalet, 2 beds, 45 m²', starRating: 4 },
    { name: 'Asante Guest House', nightlyRate: 1550, sleeps: 2, roomType: 'Deluxe Room, 1 double bed', starRating: 5, includesBreakfast: true },
    { name: 'Qhephulitshe', nightlyRate: 1620, sleeps: 2, roomType: 'Three-Bedroom Apartment, 3 beds' },
    { name: 'Zee Lifestyle Townhouse', nightlyRate: 1840, sleeps: 2, roomType: 'Two-Bedroom Apartment, 153 m²' },
    { name: 'Mother of All Cities', nightlyRate: 1980, sleeps: 2, roomType: 'One-Bedroom Apartment, 2 beds' },
    { name: 'Riverside Sun', nightlyRate: 2203, sleeps: 2, roomType: 'Standard King Room, 1 double bed', starRating: 4, includesBreakfast: true },
    // 4-guest stays from supplied Booking.com listings (2-night totals converted to nightly)
    { name: 'Ngraje Guest House', nightlyRate: 589, sleeps: 4, roomType: '2× Double Room with Shared Bathroom, 2 double beds' },
    { name: 'Pearl Guest House', nightlyRate: 648, sleeps: 4, roomType: '2× Double Room with Private Bathroom' },
    { name: 'Arcon Guest House', nightlyRate: 693, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'Shivon Vaal Guest House', nightlyRate: 800, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'Coolden Guesthouse', nightlyRate: 800, sleeps: 4, roomType: 'Entire Apartment, 7 bedrooms, 8 beds' },
    { name: 'Jazreel B&B', nightlyRate: 810, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: '016 Guest House', nightlyRate: 1062, sleeps: 4, roomType: '2× Deluxe Queen Room, 2 double beds' },
    { name: 'AT Ronnies', nightlyRate: 1120, sleeps: 4, roomType: '2× Double or Twin Room', starRating: 3 },
    { name: 'Iris Bnb on Vaal 2', nightlyRate: 1148, sleeps: 4, roomType: '2× Double Room with Shared Bathroom', starRating: 3 },
    { name: 'White Rose Guest House', nightlyRate: 1152, sleeps: 4, roomType: '2× Double or Twin Room with Private Bathroom', starRating: 3 },
    { name: 'Urban Escape Day and Night Guest House', nightlyRate: 1198, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'House 205', nightlyRate: 1200, sleeps: 4, roomType: 'Standard Queen Room + Standard Twin Room', starRating: 3 },
    { name: 'Saho Guesthouse', nightlyRate: 1206, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'The Guesthouse', nightlyRate: 1207, sleeps: 4, roomType: 'Deluxe Quadruple Room, 2 double beds', starRating: 4 },
    { name: 'Sunflower Guesthouse', nightlyRate: 1246, sleeps: 4, roomType: 'Double Room + Twin/Double Room' },
    { name: 'Lauren Palace Guest House', nightlyRate: 1425, sleeps: 4, roomType: '2× Standard Double Room', starRating: 3 },
    { name: "Lerato's", nightlyRate: 1458, sleeps: 4, roomType: '2× Double Room, air conditioning' },
    { name: 'Mathwala Guesthouse', nightlyRate: 1460, sleeps: 4, roomType: '2× Standard Double Room, 2 large double beds' },
    { name: 'Aalwyns Guesthouse', nightlyRate: 1523, sleeps: 4, roomType: '2× Deluxe Double or Twin Room', starRating: 4 },
    { name: 'Retro Guesthouse', nightlyRate: 1540, sleeps: 4, roomType: 'Family Room with Garden View' },
    { name: 'Vaal River Guest House', nightlyRate: 1600, sleeps: 4, roomType: 'Deluxe Double or Twin Room + Double Room with Balcony', starRating: 3 },
    { name: 'At Bijl Guesthouse', nightlyRate: 1600, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'Little Eden Guest Lodge', nightlyRate: 1690, sleeps: 4, roomType: '2× Standard Suite, 2 extra-large double beds', starRating: 4 },
    { name: 'Mall Guesthouse', nightlyRate: 1700, sleeps: 4, roomType: '2× Deluxe Double Room', starRating: 4 },
    { name: 'Roxy\'s Rest Guest House', nightlyRate: 1740, sleeps: 4, roomType: 'Queen Room with Garden View + Suite', starRating: 4 },
    { name: 'Dream Lodging Apartment', nightlyRate: 1750, sleeps: 4, roomType: 'Deluxe Apartment, 3 bedrooms, 142 m²', starRating: 3 },
    { name: '12 On Vaal Drive Guest Lodge', nightlyRate: 1782, sleeps: 4, roomType: 'Twin/Double Room ×2, air conditioning', starRating: 4 },
    { name: 'Invite Guest House', nightlyRate: 1800, sleeps: 4, roomType: '2× One-Bedroom Suite, 2 double beds' },
    { name: 'Casa Angelo', nightlyRate: 1800, sleeps: 4, roomType: '2× Deluxe Queen Suite, 2 large double beds', starRating: 4 },
    { name: 'Qhephulitshe', nightlyRate: 1823, sleeps: 4, roomType: 'Three-Bedroom Apartment, 2 bedrooms, 3 beds' },
    { name: 'Emufuleni River Lodge', nightlyRate: 1890, sleeps: 4, roomType: 'Deluxe Double or Twin Room with River View, 4 single beds', includesBreakfast: true },
    { name: 'Troas Boutique Hotel', nightlyRate: 1920, sleeps: 4, roomType: 'Entire Apartment, 2 bedrooms, 40 m², 5 beds' },
    { name: 'Arendsnes', nightlyRate: 1950, sleeps: 4, roomType: 'Two-Bedroom Chalet, 2 bedrooms, 3 beds' },
    { name: 'Mother of All Cities', nightlyRate: 1980, sleeps: 4, roomType: 'One-Bedroom Apartment, 2 beds' },
    { name: 'Zee Lifestyle Townhouse', nightlyRate: 2000, sleeps: 4, roomType: 'Two-Bedroom Apartment, 153 m²' },
    { name: 'Zee Lifestyle Guesthouse', nightlyRate: 2070, sleeps: 4, roomType: '2× Double Room, 2 large double beds' },
    { name: '4B on Delius Str', nightlyRate: 2186, sleeps: 4, roomType: '2× Deluxe Double or Twin Room, 4 single beds', starRating: 4 },
    { name: 'Aark Guest Lodge', nightlyRate: 2250, sleeps: 4, roomType: 'Deluxe Double Room, 2 beds', starRating: 4 },
    { name: 'Zero-Three Vaal Ultimate Sky', nightlyRate: 2475, sleeps: 4, roomType: 'Two-Bedroom Apartment, 3 beds' },
    { name: 'Emerald Resort & Casino', nightlyRate: 2520, sleeps: 4, roomType: 'Two-Bedroom Chalet, 3 beds, 55 m²', starRating: 4 },
    { name: 'Lekoa Lifestyle Apartment', nightlyRate: 2565, sleeps: 4, roomType: 'Three-Bedroom Apartment, 3 double beds, 120 m²' },
    { name: "G's Haven", nightlyRate: 2694, sleeps: 4, roomType: 'Two-Bedroom House, 7 beds, 160 m²', starRating: 4 },
    { name: 'Clivia Lodge', nightlyRate: 2673, sleeps: 4, roomType: '2× Deluxe Double Room, 2 large double beds', starRating: 4, includesBreakfast: true },
    { name: 'Villa by The Vaal River', nightlyRate: 2772, sleeps: 4, roomType: 'Three-Bedroom Apartment with Water View, 4 beds, 120 m²', starRating: 3 },
    { name: 'Sevenstones', nightlyRate: 2790, sleeps: 4, roomType: 'Family Room with Terrace, 3 beds' },
    { name: 'Riverside Sun', nightlyRate: 4405, sleeps: 4, roomType: '2× Standard Double Room, air conditioning', starRating: 4, includesBreakfast: true },
    { name: 'Sacred Ibis', nightlyRate: 4455, sleeps: 4, roomType: 'Apartment, 7 bedrooms, 12 beds, 262 m²' },
    { name: "Gentleman's Estate on the Vaal", nightlyRate: 6000, sleeps: 4, roomType: 'Five-Bedroom House, 7 beds' },
    { name: 'Bellamy on Vaal', nightlyRate: 6995, sleeps: 4, roomType: 'Entire Villa, 3 bedrooms, 3 bathrooms' },
    { name: 'Riverside Rhapsody, Vaal River', nightlyRate: 7866, sleeps: 4, roomType: 'Four-Bedroom House, 7 beds, 280 m²' },
    { name: "Barti's Home", nightlyRate: 8793, sleeps: 4, roomType: 'Deluxe Double Room with Bath, 2 double beds', includesBreakfast: true },
    { name: 'Dripiolis', nightlyRate: 8820, sleeps: 4, roomType: 'One-Bedroom House, 5 beds' },
    { name: 'Vaal-Villa, Vintage Style Farmhouse', nightlyRate: 13500, sleeps: 4, roomType: 'Seven-Bedroom House, 16 beds, 1 000 m²', starRating: 3 },
  ],

  'bela-bela': [
    { name: 'Mabalingwe Nature Reserve', nightlyRate: 1200 },
    { name: 'Mabula Game Lodge', nightlyRate: 3500, includesBreakfast: true },
    { name: 'Warmbaths Forever Resort', nightlyRate: 1100 },
    { name: 'Zebra Country Lodge', nightlyRate: 2200, includesBreakfast: true },
    // 2-adult stays sourced from live Booking.com listings (1 night, 2 adults).
    // Star ratings only where the listing displays an official star grading.
    { name: 'Aruka', nightlyRate: 405, sleeps: 2, roomType: 'Double Room, 2 single beds', includesBreakfast: true },
    { name: 'My Bush Camp', nightlyRate: 540, sleeps: 2, roomType: 'Campsite' },
    { name: 'Warmbaths Thai Spa and Guest House', nightlyRate: 650, sleeps: 2, roomType: 'Double Room with Private Bathroom', starRating: 3 },
    { name: 'Thuto Centre Conferencing & Bush Lodge', nightlyRate: 650, sleeps: 2, roomType: 'Deluxe Double Room' },
    { name: 'Shala Mushe Tented Camp & Camp', nightlyRate: 686, sleeps: 2, roomType: 'One-Bedroom Chalet' },
    { name: 'Flamboyant Guesthouse', nightlyRate: 700, sleeps: 2, roomType: 'Twin Room, 2 single beds' },
    { name: 'CLP Lodge', nightlyRate: 720, sleeps: 2, roomType: 'Double or Twin Room with Terrace', starRating: 3 },
    { name: 'El Rancho Grande', nightlyRate: 720, sleeps: 2, roomType: 'Chalet, 1 bedroom, 1 bathroom', starRating: 3 },
    { name: 'In Da Bush', nightlyRate: 757, sleeps: 2, roomType: 'One-Bedroom Apartment', starRating: 3 },
    { name: 'Joyful Home Bela-Bela', nightlyRate: 765, sleeps: 2, roomType: 'Double Room, 1 double bed' },
    { name: 'La Bushka Guesthouse', nightlyRate: 800, sleeps: 2, roomType: 'Double Room, 1 large double bed', starRating: 3 },
    { name: 'BELA Vic', nightlyRate: 850, sleeps: 2, roomType: 'Standard Apartment, 1 bedroom, 50 m²', starRating: 3 },
    { name: 'BelaBela Guesthouse', nightlyRate: 890, sleeps: 2, roomType: 'Comfort Apartment, 1 bedroom, 30 m²' },
    { name: 'La Bella B&B Under The Fig Tree', nightlyRate: 896, sleeps: 2, roomType: 'Double or Twin Room with Shower', starRating: 3 },
    { name: 'Bela Valley Guest House', nightlyRate: 899, sleeps: 2, roomType: 'Deluxe Queen Room', starRating: 3 },
    { name: 'BELA Vic — One-Bedroom Chalet', nightlyRate: 900, sleeps: 2, roomType: 'One-Bedroom Chalet, 50 m²' },
    { name: 'Divine Sleep', nightlyRate: 972, sleeps: 2, roomType: 'Double Room, 1 double bed', starRating: 3 },
    { name: 'Light House Lodge', nightlyRate: 999, sleeps: 2, roomType: 'Deluxe Double Room', starRating: 2 },
    { name: 'Elephant Springs', nightlyRate: 1020, sleeps: 2, roomType: 'Double Room with City View' },
    { name: 'Klip en Kristal Guest House', nightlyRate: 1050, sleeps: 2, roomType: 'Deluxe Double or Twin Room', starRating: 3 },
    { name: 'Thandile River Cottages', nightlyRate: 1122, sleeps: 2, roomType: 'Tent, 3 beds' },
    { name: 'De Kunst Huisje', nightlyRate: 1170, sleeps: 2, roomType: 'Luxury King Room', starRating: 3 },
    { name: 'Buyskop Lodge, Conference & Spa', nightlyRate: 1170, sleeps: 2, roomType: 'Two-Bedroom Chalet, 70 m²' },
    { name: 'Summerset Place Country House', nightlyRate: 1250, sleeps: 2, roomType: 'Double Room', starRating: 4, includesBreakfast: true },
    { name: 'Grafiti Boutique Hotel', nightlyRate: 1323, sleeps: 2, roomType: 'Deluxe Twin Room with Pool View', starRating: 3 },
    { name: 'Meloding Guest House', nightlyRate: 1350, sleeps: 2, roomType: 'Standard Suite, 1 large double bed' },
    { name: 'Keleo Safari Lodge', nightlyRate: 1568, sleeps: 2, roomType: 'Deluxe Double or Twin Room with Garden View', starRating: 5 },
    { name: 'Thandile Country Lodge', nightlyRate: 1648, sleeps: 2, roomType: 'Deluxe Double Room, dinner included', includesBreakfast: true },
    { name: 'Lapa Phanzi Game Lodge', nightlyRate: 1800, sleeps: 2, roomType: 'Family Chalet, 52 m²' },
    { name: 'Castle de Wildt', nightlyRate: 1850, sleeps: 2, roomType: 'Standard Family Room', starRating: 3, includesBreakfast: true },
    { name: '40 at Pendleburry', nightlyRate: 1955, sleeps: 2, roomType: 'Apartment, 1 bedroom, 2 bathrooms' },
    { name: 'Falcon Lodge PK', nightlyRate: 2040, sleeps: 2, roomType: 'Two-Bedroom Apartment' },
    { name: 'Pandleberry', nightlyRate: 2106, sleeps: 2, roomType: 'One-Bedroom House' },
    { name: 'Pendleberry Grove 33', nightlyRate: 2187, sleeps: 2, roomType: 'Three-Bedroom Apartment, 75 m²', starRating: 3 },
    { name: 'Pendleberry Grove Holidays', nightlyRate: 2277, sleeps: 2, roomType: 'Three-Bedroom Apartment' },
    { name: '85 Pendleberry Grove Holidays Bela Bela', nightlyRate: 2309, sleeps: 2, roomType: 'Chalet, 3 bedrooms, 100 m²' },
    { name: 'Pendleberry Grove 90', nightlyRate: 2309, sleeps: 2, roomType: 'Three-Bedroom Chalet, 75 m²', starRating: 3 },
    { name: 'Villa du Toit Private Self Check-in', nightlyRate: 2385, sleeps: 2, roomType: 'Villa, 2 bedrooms, 132 m²' },
    { name: '53 Bela-Bela Pendleberry Grove Holiday Resort Unit 53', nightlyRate: 2486, sleeps: 2, roomType: 'Three-Bedroom Chalet' },
    { name: 'Unit 89 Pendleberry Holiday Resort', nightlyRate: 2592, sleeps: 2, roomType: 'Three-Bedroom Apartment, 100 m²', starRating: 4 },
    { name: 'Unit 35 Pendleberry Grove Holidays', nightlyRate: 2610, sleeps: 2, roomType: 'Family Room, 6 beds' },
    { name: '77 Pendleberry Grove', nightlyRate: 2700, sleeps: 2, roomType: 'Three-Bedroom Apartment, 74 m²' },
    { name: 'Schrikkloof Private Nature Reserve, home of The Lions Foundation', nightlyRate: 2792, sleeps: 2, roomType: 'Standard King Room, dinner included', includesBreakfast: true },
    { name: 'Pendleberry Unit 85', nightlyRate: 2835, sleeps: 2, roomType: 'Two-Bedroom Chalet' },
    { name: 'The Grove Residence - Family luxury resort by Warmbaths', nightlyRate: 3145, sleeps: 2, roomType: 'Superior Chalet, 1 bedroom' },
    { name: 'Bela Bela Pendleberry Grove 52', nightlyRate: 3150, sleeps: 2, roomType: 'Three-Bedroom Apartment, 100 m²', starRating: 3 },
    { name: '49 Bela-Bela Pendleberry Grove Holiday Unit 49', nightlyRate: 3250, sleeps: 2, roomType: 'Three-Bedroom Chalet' },
    { name: 'ThutlwaDitholo Lodge', nightlyRate: 3591, sleeps: 2, roomType: 'Two-Bedroom House' },
    { name: 'Waterberg Game Lodge', nightlyRate: 3651, sleeps: 2, roomType: 'Double or Twin Room, dinner included', includesBreakfast: true },
    { name: '91 Pendleberry Grove Holidays', nightlyRate: 3825, sleeps: 2, roomType: 'Apartment, 3 bedrooms' },
    { name: 'Villa Zizi in Bela-Bela', nightlyRate: 4408, sleeps: 2, roomType: 'Villa, 5 bedrooms', starRating: 3 },
    { name: 'Leopards Rock Bush Boutique', nightlyRate: 5049, sleeps: 2, roomType: 'Deluxe Family Room' },
    { name: 'Feeskraal Lodge', nightlyRate: 5075, sleeps: 2, roomType: 'Holiday Home, 3 bedrooms, 325 m²', starRating: 4 },
    { name: 'Elements Private Golf Reserve', nightlyRate: 5080, sleeps: 2, roomType: 'Two-Bedroom Chalet No.273, 120 m²', starRating: 3 },
    { name: 'Falcon Lodge Bela', nightlyRate: 5100, sleeps: 2, roomType: 'Apartment, 4 bedrooms' },
    { name: 'Milkwood Valley Lodge, Mabalingwe', nightlyRate: 5398, sleeps: 2, roomType: 'Chalet, 4 bedrooms, 400 m²' },
    { name: 'Ngong Hill Lodge at Mabalingwe', nightlyRate: 6300, sleeps: 2, roomType: 'Holiday Home, 3 bedrooms' },
    { name: '213 Zebula Golf Estate & Spa - 4 Bedroom Home', nightlyRate: 6500, sleeps: 2, roomType: 'Four-Bedroom House' },
    { name: 'Serengeti Lodge Mabalingwe Nature Reserve', nightlyRate: 6500, sleeps: 2, roomType: 'One-Bedroom House' },
    { name: 'Rhino Lodge at Zebula', nightlyRate: 6846, sleeps: 2, roomType: 'Villa, 4 bedrooms' },
    { name: 'Fairway Manor at Zebula', nightlyRate: 6900, sleeps: 2, roomType: 'Holiday Home, 5 bedrooms', starRating: 4 },
    { name: '20 Pendleberry Holiday Resort', nightlyRate: 6100, sleeps: 2, roomType: 'Three-Bedroom Apartment', starRating: 3 },
    { name: 'Villa Limonero', nightlyRate: 7200, sleeps: 2, roomType: 'Four-Bedroom Luxury Apartment, 375 m²', starRating: 4 },
    { name: 'Fish Eagle Manor at Bela-Bela', nightlyRate: 7205, sleeps: 2, roomType: 'Holiday Home, 5 bedrooms, 500 m²', starRating: 3 },
    { name: 'Mabula Game Lodge — Superior Room with 2 Game Drives', nightlyRate: 7944, sleeps: 2, roomType: 'Superior BT with 2 Game Drives, all meals included', starRating: 4, includesBreakfast: true },
    { name: 'Re a Lora Lodge', nightlyRate: 7980, sleeps: 2, roomType: 'Bungalow, 6 bedrooms, 600 m²' },
    { name: 'Siyara Lodge, Mabalingwe', nightlyRate: 8925, sleeps: 2, roomType: 'Five-Bedroom House, 450 m²', starRating: 4 },
    { name: 'Buffalo Game Lodge', nightlyRate: 9500, sleeps: 2, roomType: 'Four-Bedroom Holiday Home, 100 m²' },
    { name: 'Reis Lodge at Mabalingwe', nightlyRate: 10300, sleeps: 2, roomType: 'Apartment, 1 bedroom', starRating: 3 },
    { name: 'La-Ngwenya Serenite', nightlyRate: 10350, sleeps: 2, roomType: 'Villa, 4 bedrooms, 36 m²', starRating: 4 },
    { name: 'Zebula Golf and Wildlife Estate - Moi Signature Exclusive Leisure Villas', nightlyRate: 10600, sleeps: 2, roomType: 'Villa, 8 bedrooms', starRating: 3 },
    { name: 'Kwafubesi Tented Safari Camp', nightlyRate: 10719, sleeps: 2, roomType: 'Safari Tent with 2 Game Drives, all-inclusive' },
    { name: 'Kingfisher Villa in Mabula Game Reserve', nightlyRate: 10758, sleeps: 2, roomType: 'Deluxe Suite, all-inclusive' },
    { name: 'Letamo at Qwabi Private Game Reserve by NEWMARK', nightlyRate: 10985, sleeps: 2, roomType: 'Deluxe Room with 2 Game Drives, all meals included', starRating: 5, includesBreakfast: true },
    { name: 'Bakone Lodge', nightlyRate: 12240, sleeps: 2, roomType: 'Two-Bedroom Villa, 400 m²' },
    { name: 'Khenjadji at Fish Eagle Bay', nightlyRate: 13050, sleeps: 2, roomType: 'Holiday Home, 8 bedrooms, 900 m²', starRating: 3 },
    { name: 'Babohi at Qwabi Private Game Reserve by NEWMARK', nightlyRate: 13847, sleeps: 2, roomType: 'Deluxe Room with 2 Game Drives, all-inclusive', starRating: 5 },
    // 4-adult stays sourced from live Booking.com listings (1 night, 4 adults).
    // Meals only noted where the listing clearly states bed & breakfast.
    // Star ratings only where the listing displays an official star grading.
    { name: 'My Bush Camp — 4 Sleeper', nightlyRate: 540, sleeps: 4, roomType: 'Campsite' },
    { name: 'Eindskof Game Farm Flat — 4 Sleeper', nightlyRate: 650, sleeps: 4, roomType: 'One-Bedroom Apartment, 50 m²', starRating: 3 },
    { name: 'MRH Self Check-In Express Homestay — 4 Sleeper', nightlyRate: 773, sleeps: 4, roomType: '2× Double Room, 2 double beds' },
    { name: 'Thuto Centre Conferencing & Bush Lodge — 4 Sleeper', nightlyRate: 950, sleeps: 4, roomType: 'Deluxe Family Room, 2 double beds' },
    { name: 'SummerPlace Studio Apartments with Kitchenette — 4 Sleeper', nightlyRate: 1044, sleeps: 4, roomType: '2× Deluxe Double Room (2 Adults + 1 Child)', starRating: 3 },
    { name: 'SABLE INN B&B — 4 Sleeper', nightlyRate: 1101, sleeps: 4, roomType: 'Family Room, 3 beds', starRating: 4, includesBreakfast: true },
    { name: 'Thandile River Cottages — 4 Sleeper', nightlyRate: 1122, sleeps: 4, roomType: 'Tent, 3 beds' },
    { name: 'Redem House — 4 Sleeper', nightlyRate: 1188, sleeps: 4, roomType: 'Family Room with Private Bathroom, 3 beds', starRating: 3 },
    { name: 'Gorgeous Gecko Guesthouse — 4 Sleeper', nightlyRate: 1200, sleeps: 4, roomType: 'Basic Cottage, 3 bedrooms, 60 m²', starRating: 3 },
    { name: 'Shala Mushe Tented Camp & Camp — 4 Sleeper', nightlyRate: 686, sleeps: 4, roomType: 'One-Bedroom Chalet, 3 beds' },
    { name: 'Impala Palms Guesthouse — 4 Sleeper', nightlyRate: 1350, sleeps: 4, roomType: 'Deluxe Double Room + Deluxe Queen Room', starRating: 3 },
    { name: 'Warmbaths Thai Spa and Guest House — 4 Sleeper', nightlyRate: 1350, sleeps: 4, roomType: 'Double Room with Private Bathroom + Queen Room', starRating: 3 },
    { name: 'BosSpoke Bush Lodge — 4 Sleeper', nightlyRate: 1360, sleeps: 4, roomType: '2× One-Bedroom Apartment' },
    { name: 'The Cottage Inn — 4 Sleeper', nightlyRate: 1403, sleeps: 4, roomType: 'Two-Bedroom Apartment, 3 beds' },
    { name: 'BelaBela Guesthouse — 4 Sleeper', nightlyRate: 1450, sleeps: 4, roomType: 'Classic Apartment, 1 bedroom, 30 m²' },
    { name: 'Flamboyant Guesthouse — 4 Sleeper', nightlyRate: 1540, sleeps: 4, roomType: 'Standard Quadruple Room, 3 beds' },
    { name: 'De Kunst Huisje — 4 Sleeper', nightlyRate: 1670, sleeps: 4, roomType: 'Two-Bedroom Apartment, 30 m²', starRating: 3 },
    { name: 'BELA Vic — 4 Sleeper', nightlyRate: 1700, sleeps: 4, roomType: '2× Standard Apartment, 2 bedrooms', starRating: 3 },
    { name: 'La Bella B&B Under The Fig Tree — 4 Sleeper', nightlyRate: 1792, sleeps: 4, roomType: '2× Double or Twin Room with Shower', starRating: 3, includesBreakfast: true },
    { name: 'Bela Valley Guest House — 4 Sleeper', nightlyRate: 1898, sleeps: 4, roomType: 'Deluxe Queen Room + Deluxe Double Room', starRating: 3 },
    { name: 'Thandile Country Lodge — 4 Sleeper', nightlyRate: 1948, sleeps: 4, roomType: 'Deluxe Family Room, 3 beds' },
    { name: 'Relmies Place — 4 Sleeper', nightlyRate: 1950, sleeps: 4, roomType: 'Economy Queen Room + Standard King Room', starRating: 4 },
    { name: '40 at Pendleburry — 4 Sleeper', nightlyRate: 1955, sleeps: 4, roomType: 'Apartment, 1 bedroom, 2 bathrooms' },
    { name: 'Light House Lodge — 4 Sleeper', nightlyRate: 1999, sleeps: 4, roomType: 'Quadruple Room, 3 beds', starRating: 2 },
    { name: 'Anja Guesthouse — 4 Sleeper', nightlyRate: 2000, sleeps: 4, roomType: 'Classic Apartment, 2 bedrooms, 80 m²' },
    { name: 'The Garden Inn Guesthouse — 4 Sleeper', nightlyRate: 2000, sleeps: 4, roomType: '2× Standard Double Room with Fan', starRating: 3 },
    { name: 'Bush Lovers Lodge — 4 Sleeper', nightlyRate: 2029, sleeps: 4, roomType: 'King Room with Garden View + Deluxe Room' },
    { name: 'Buyskop Lodge, Conference & Spa — 4 Sleeper', nightlyRate: 2070, sleeps: 4, roomType: 'Two-Bedroom Chalet, 70 m²' },
    { name: 'Divine Sleep — 4 Sleeper', nightlyRate: 2160, sleeps: 4, roomType: '2× Double Room, 2 double beds', starRating: 3 },
    { name: 'El Rancho Grande — 4 Sleeper', nightlyRate: 2200, sleeps: 4, roomType: 'Chalet, 2 bedrooms, 65 m²', starRating: 3 },
    { name: 'Nylstroom Guesthouse — 4 Sleeper', nightlyRate: 2200, sleeps: 4, roomType: '2× Standard Twin Room', starRating: 3 },
    { name: 'Dorpsrus — 4 Sleeper', nightlyRate: 2198, sleeps: 4, roomType: 'One-Bedroom Suite + Standard Double Suite' },
    { name: 'Klip en Kristal Guest House — 4 Sleeper', nightlyRate: 2216, sleeps: 4, roomType: '2× Deluxe Double or Twin Room', starRating: 3 },
    { name: 'CLP Lodge — 4 Sleeper', nightlyRate: 2220, sleeps: 4, roomType: 'Double or Twin Room with Terrace + 2 Double Rooms', starRating: 3 },
    { name: 'Sage Haven Guesthouse — 4 Sleeper', nightlyRate: 2244, sleeps: 4, roomType: 'Deluxe King Room + Basic Queen Room', starRating: 4 },
    { name: 'Falcon Lodge PK — 4 Sleeper', nightlyRate: 2295, sleeps: 4, roomType: 'Two-Bedroom Apartment, 3 beds' },
    { name: 'Pendleberry Grove Holidays — 4 Sleeper', nightlyRate: 2300, sleeps: 4, roomType: 'Three-Bedroom Apartment, 75 m²' },
    { name: 'Villa du Toit Private Self Check-in — 4 Sleeper', nightlyRate: 2385, sleeps: 4, roomType: 'Villa, 2 bedrooms, 132 m²' },
    { name: 'Exclusive guest house — 4 Sleeper', nightlyRate: 2400, sleeps: 4, roomType: '2× Deluxe Double Room with Balcony' },
    { name: 'Mon Repos Guest Farm — 4 Sleeper', nightlyRate: 2400, sleeps: 4, roomType: '2× Standard Twin Room', starRating: 4 },
    { name: 'Pendleberry Grove 90 — 4 Sleeper', nightlyRate: 2430, sleeps: 4, roomType: 'Three-Bedroom Chalet, 75 m²', starRating: 3 },
    { name: 'Pendleberry Grove 33 — 4 Sleeper', nightlyRate: 2430, sleeps: 4, roomType: 'Three-Bedroom Apartment, 75 m²', starRating: 3 },
    { name: '85 Pendleberry Grove Holidays Bela Bela — 4 Sleeper', nightlyRate: 2430, sleeps: 4, roomType: 'Chalet, 3 bedrooms, 100 m²' },
    { name: 'Falcon Lodge (ET) — 4 Sleeper', nightlyRate: 2448, sleeps: 4, roomType: 'Three-Bedroom Chalet' },
    { name: 'Pandleberry — 4 Sleeper', nightlyRate: 2470, sleeps: 4, roomType: 'One-Bedroom House, 6 beds' },
    { name: 'Shangri-La Country Hotel & Spa — 4 Sleeper', nightlyRate: 2535, sleeps: 4, roomType: 'Family Suite with Balcony, 4 single beds', starRating: 4 },
    { name: 'Grafiti Boutique Hotel — 4 Sleeper', nightlyRate: 2646, sleeps: 4, roomType: 'Deluxe Twin Room + Deluxe Twin Room with Pool View', starRating: 3 },
    { name: 'Meloding Guest House — 4 Sleeper', nightlyRate: 2700, sleeps: 4, roomType: '2× Standard Suite', starRating: 3 },
    { name: '77 Pendleberry Grove — 4 Sleeper', nightlyRate: 2700, sleeps: 4, roomType: 'Three-Bedroom Apartment, 74 m²' },
    { name: 'Summerset Place Country House — 4 Sleeper', nightlyRate: 2720, sleeps: 4, roomType: 'Twin Room + Double Room', starRating: 4 },
    { name: 'Pendleberry Unit 85 — 4 Sleeper', nightlyRate: 2835, sleeps: 4, roomType: 'Two-Bedroom Chalet, 6 beds' },
    { name: 'Unit 35 Pendleberry Grove Holidays — 4 Sleeper', nightlyRate: 2900, sleeps: 4, roomType: 'Family Room, 6 beds' },
    { name: 'Modubu Lodge — 4 Sleeper', nightlyRate: 2925, sleeps: 4, roomType: 'Two-Bedroom Chalet, 80 m²', starRating: 3 },
    { name: 'Waterberg Accommodation — 4 Sleeper', nightlyRate: 2992, sleeps: 4, roomType: 'Family Room + Double Room', starRating: 4 },
    { name: 'Elephant Springs — 4 Sleeper', nightlyRate: 2999, sleeps: 4, roomType: 'Apartment with Balcony, 32 m²' },
    { name: 'Sublime Home — 4 Sleeper', nightlyRate: 3060, sleeps: 4, roomType: 'Three-Bedroom House, 500 m²', starRating: 4 },
    { name: '53 Bela-Bela Pendleberry Grove Holiday Resort Unit 53 — 4 Sleeper', nightlyRate: 3088, sleeps: 4, roomType: 'Three-Bedroom Chalet, 110 m²' },
    { name: '7th Hole Golf Lodge — 4 Sleeper', nightlyRate: 3110, sleeps: 4, roomType: 'Standard Double or Twin Room + Triple Room', starRating: 4 },
    { name: 'Keleo Safari Lodge — 4 Sleeper', nightlyRate: 3136, sleeps: 4, roomType: '2× Deluxe Double or Twin Room with Garden View', starRating: 5 },
    { name: 'Zebula African Kingdom — 4 Sleeper', nightlyRate: 3180, sleeps: 4, roomType: 'Two-Bedroom Chalet, 3 beds' },
    { name: '20 Pendleberry Holiday Resort — 4 Sleeper', nightlyRate: 6100, sleeps: 4, roomType: 'Three-Bedroom Apartment, 100 m²', starRating: 3 },
    { name: 'Schrikkloof Private Nature Reserve, home of The Lions Foundation — 4 Sleeper', nightlyRate: 6311, sleeps: 4, roomType: '2× Standard King Room' },
    { name: '213 Zebula Golf Estate & Spa - 4 Bedroom Home — 4 Sleeper', nightlyRate: 6500, sleeps: 4, roomType: 'Four-Bedroom House, 7 beds' },
    { name: 'Ngong Hill Lodge at Mabalingwe — 4 Sleeper', nightlyRate: 6300, sleeps: 4, roomType: 'Holiday Home, 3 bedrooms' },
    { name: 'Rhino Lodge at Zebula — 4 Sleeper', nightlyRate: 6846, sleeps: 4, roomType: 'Villa, 4 bedrooms', starRating: 3 },
    { name: 'Fairway Manor at Zebula — 4 Sleeper', nightlyRate: 6900, sleeps: 4, roomType: 'Holiday Home, 5 bedrooms, 400 m²', starRating: 3 },
    { name: 'Fish Eagle Manor at Bela-Bela — 4 Sleeper', nightlyRate: 7205, sleeps: 4, roomType: 'Holiday Home, 5 bedrooms, 500 m²', starRating: 4 },
    { name: 'Monate Game Lodge — 4 Sleeper', nightlyRate: 7232, sleeps: 4, roomType: '2× Chalet - Main Lodge, 2 bedrooms', starRating: 4 },
    { name: 'Waterberg Game Lodge — 4 Sleeper', nightlyRate: 7302, sleeps: 4, roomType: '2× Double or Twin Room, dinner included' },
    { name: 'Re a Lora Lodge — 4 Sleeper', nightlyRate: 7980, sleeps: 4, roomType: 'Bungalow, 6 bedrooms, 600 m²' },
    { name: 'Villa Limonero — 4 Sleeper', nightlyRate: 8000, sleeps: 4, roomType: 'Four-Bedroom Luxury Apartment, 376 m²', starRating: 4 },
    { name: 'Siyara Lodge, Mabalingwe — 4 Sleeper', nightlyRate: 8925, sleeps: 4, roomType: 'Five-Bedroom House, 450 m²' },
    { name: 'Buffalo Game Lodge — 4 Sleeper', nightlyRate: 9500, sleeps: 4, roomType: 'Four-Bedroom Holiday Home, 100 m²' },
    { name: 'Reis Lodge at Mabalingwe — 4 Sleeper', nightlyRate: 10300, sleeps: 4, roomType: 'Apartment, 1 bedroom, 5 bathrooms', starRating: 3 },
    { name: 'La-Ngwenya Serenite — 4 Sleeper', nightlyRate: 10350, sleeps: 4, roomType: 'Villa, 4 bedrooms', starRating: 4 },
    { name: 'Zebula Golf and Wildlife Estate - Moi Signature Exclusive Leisure Villas — 4 Sleeper', nightlyRate: 10600, sleeps: 4, roomType: 'Villa, 8 bedrooms', starRating: 3 },
    { name: 'Tebuah Lodge at Mabalingwe — 4 Sleeper', nightlyRate: 12100, sleeps: 4, roomType: 'Three-Bedroom Apartment' },
    { name: 'Zwahili Private Game Lodge & Spa — 4 Sleeper', nightlyRate: 12221, sleeps: 4, roomType: 'Standard Room Elephant + Standard Room Rhino, dinner included' },
    { name: 'Bakone Lodge — 4 Sleeper', nightlyRate: 12240, sleeps: 4, roomType: 'Two-Bedroom Villa, 400 m²' },
    { name: 'Sitrah Private Lodge, Mabalingwe — 4 Sleeper', nightlyRate: 14025, sleeps: 4, roomType: 'Villa, 2 bedrooms, 500 m²', starRating: 4 },
    { name: 'Shammah Lodge at Mabalingwe — 4 Sleeper', nightlyRate: 14400, sleeps: 4, roomType: 'Holiday Home, 5 bedrooms, 450 m²', starRating: 4 },
    { name: 'Khenjadji at Fish Eagle Bay — 4 Sleeper', nightlyRate: 14500, sleeps: 4, roomType: 'Holiday Home, 8 bedrooms, 900 m²', starRating: 3 },
    { name: 'Mabula Game Lodge — 4 Sleeper', nightlyRate: 16211, sleeps: 4, roomType: '2× Superior Room with Two Game Drives', starRating: 4 },
    { name: 'RoiSan Private Game Lodge — 4 Sleeper', nightlyRate: 21000, sleeps: 4, roomType: 'Tent, 12 beds' },
    { name: 'Kingfisher Villa in Mabula Game Reserve — 4 Sleeper', nightlyRate: 25830, sleeps: 4, roomType: '2× Deluxe Suite' },
    { name: 'Letamo at Qwabi Private Game Reserve by NEWMARK — 4 Sleeper', nightlyRate: 28433, sleeps: 4, roomType: '2× Deluxe Room with 2 Game Drives, dinner included', starRating: 5 },
    { name: 'Babohi at Qwabi Private Game Reserve by NEWMARK — 4 Sleeper', nightlyRate: 35838, sleeps: 4, roomType: '2× Deluxe Room with 2 Game Drives, all-inclusive', starRating: 5 },
    { name: 'Villa Zizi in Bela-Bela — 4 Sleeper', nightlyRate: 4408, sleeps: 4, roomType: 'Villa, 5 bedrooms, 30 m² kitchen', starRating: 3 },
    { name: 'Kwelanga Private Bush Lodge — 4 Sleeper', nightlyRate: 4500, sleeps: 4, roomType: 'Chalet, 4 bedrooms, 450 m²', starRating: 3 },
    { name: 'Fumani Game Lodge — 4 Sleeper', nightlyRate: 4500, sleeps: 4, roomType: 'Standard Family Room, 2 large double beds', starRating: 4 },
    { name: 'Bushveld Dream Villa 100 — 4 Sleeper', nightlyRate: 4624, sleeps: 4, roomType: 'Villa, 1 bedroom, 4 bathrooms' },
    { name: 'Emintha Log House — 4 Sleeper', nightlyRate: 4752, sleeps: 4, roomType: 'Four-Bedroom House, 220 m²', starRating: 3 },
    { name: 'Leopards Rock Bush Boutique — 4 Sleeper', nightlyRate: 5049, sleeps: 4, roomType: 'Deluxe Family Room, 4 beds' },
    { name: 'Feeskraal Lodge — 4 Sleeper', nightlyRate: 5075, sleeps: 4, roomType: 'Holiday Home, 3 bedrooms, 325 m²', starRating: 3 },
    { name: 'Elements Private Golf Reserve — 4 Sleeper', nightlyRate: 5080, sleeps: 4, roomType: 'Two-Bedroom Chalet No.273, 120 m²', starRating: 3 },
    { name: 'Falcon Lodge Bela — 4 Sleeper', nightlyRate: 5100, sleeps: 4, roomType: 'Apartment, 4 bedrooms, 4 bathrooms' },
    { name: 'Indlovukazi Lodge Mabalingwe Nature Reserve — 4 Sleeper', nightlyRate: 5142, sleeps: 4, roomType: 'One-Bedroom Villa, 4 bathrooms' },
    { name: 'Milkwood Valley Lodge, Mabalingwe — 4 Sleeper', nightlyRate: 5398, sleeps: 4, roomType: 'Chalet, 4 bedrooms, 400 m²' },
    { name: '36 on EAGLE DRIVE — 4 Sleeper', nightlyRate: 5760, sleeps: 4, roomType: 'One-Bedroom House, 460 m²' },
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
    { name: 'Mint Hotel The Blyde', includesBreakfast: true, capacity: '2_sleeper', nightlyRate: 1320 },
    { name: 'Blyde Penthouse Apartments', capacity: '4_sleeper', nightlyRate: 2600 },
  ],
};

// Custom The Blyde (Pretoria) Affordable Hotels - outside The Blyde, includes Crystal Lagoon access
const pretoriaAffordableHotels: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'The Blyde Crystal Lagoon Affordable 2 Sleeper Option 1', price: 912, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'The Blyde Crystal Lagoon Affordable 2 Sleeper Option 2', price: 941, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'The Blyde Crystal Lagoon Affordable 4 Sleeper Option 1', price: 1300, roomType: '4 Sleeper Room', capacity: 4 },
];

// Custom Harties Budget Hotels (2-sleeper) - with actual hotel images
// Real hotel names are in docs/HARTIES_BUDGET_HOTELS_REFERENCE.md for booking reference
// Only showing options with real user-provided images (Options 1-7 hidden - AI images)
const hartiesBudgetHotels2Sleeper: { name: string; price: number; roomType: string; capacity: number }[] = [
  { name: 'Harties Budget 2 Sleeper Option 8', price: 720, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Budget 2 Sleeper Option 9', price: 750, roomType: '2 Sleeper Room', capacity: 2 },
];

// Custom Harties Affordable Hotels (2-sleeper) - with actual hotel images  
// Real hotel names are in docs/HARTIES_AFFORDABLE_HOTELS_REFERENCE.md for booking reference
const hartiesAffordableHotels2Sleeper: { name: string; price: number; roomType: string; capacity: number; includesBreakfast?: boolean }[] = [
  { name: 'Harties Affordable 2 Sleeper Option 1', price: 1053, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 2', price: 1071, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 3', price: 1080, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 4', price: 1080, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 5', price: 1080, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 6', price: 1100, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 7', price: 1100, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 8', price: 1100, roomType: '2 Sleeper Room', capacity: 2 },
  { name: 'Harties Affordable 2 Sleeper Option 9', price: 1500, roomType: '2 Sleeper Room', capacity: 2, includesBreakfast: true },
];

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
    // Use custom names and prices for Durban and Harties, default for others
    if (destId === 'durban') {
      // Add 2-sleeper rooms
      durbanBudgetHotels2Sleeper.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        allHotels.push({
          id: `${destId}-very-affordable-2sleeper-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 3.5 + (Math.random() * 0.5),
          type: 'very-affordable',
          amenities: ['WiFi', 'Parking', 'TV'],
          image: durbanPremiumImageMap[hotel.name] || budgetImages[index % budgetImages.length],
          images: [durbanPremiumImageMap[hotel.name] || budgetImages[index % budgetImages.length]],
          capacity: 2,
          includesBreakfast: hotel.includesBreakfast,
          roomType: hotel.roomType,
        });
      });
      // Add 4-sleeper rooms
      durbanBudgetHotels4Sleeper.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        allHotels.push({
          id: `${destId}-very-affordable-4sleeper-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 3.5 + (Math.random() * 0.5),
          type: 'very-affordable',
          amenities: ['WiFi', 'Parking', 'TV', 'Kitchen'],
          image: durbanPremiumImageMap[hotel.name] || budgetImages[index % budgetImages.length],
          images: [durbanPremiumImageMap[hotel.name] || budgetImages[index % budgetImages.length]],
          capacity: 4,
          includesBreakfast: hotel.includesBreakfast,
          roomType: hotel.roomType,
        });
      });
    } else if (destId === 'harties') {
      // Harties Budget 2-sleeper hotels with custom images
      hartiesBudgetHotels2Sleeper.forEach((hotel, index) => {
        allHotels.push({
          id: `${destId}-very-affordable-2sleeper-${index + 1}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 3.5 + (Math.random() * 0.5),
          type: 'very-affordable',
          amenities: ['WiFi', 'Parking', 'TV', 'Braai'],
          image: hartiesBudget2SleeperPrimaryImages[index] || budgetImages[0],
          capacity: 2,
          roomType: hotel.roomType,
        });
      });
    } else {
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
          images: [budgetImages[index % budgetImages.length]],
          capacity: 2,

          roomType: 'Standard Room',
        });
      });
    }

    // Affordable Hotels (10 per destination: A-J) - use generic format for all destinations
    // Pretoria (The Blyde) and Harties use custom affordable hotels
    if (destId === 'pretoria') {
      pretoriaAffordableHotels.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        allHotels.push({
          id: `${destId}-affordable-${hotel.capacity}sleeper-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 4.0 + (Math.random() * 0.3),
          type: 'affordable',
          amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Crystal Lagoon Access'],
          image: affordableImages[index % affordableImages.length],
          capacity: hotel.capacity,
          roomType: hotel.roomType,
        });
      });
    } else if (destId === 'harties') {
      // Harties Affordable 2-sleeper hotels with custom images
      hartiesAffordableHotels2Sleeper.forEach((hotel, index) => {
        allHotels.push({
          id: `${destId}-affordable-2sleeper-${index + 1}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 4.0 + (Math.random() * 0.3),
          type: 'affordable',
          amenities: ['WiFi', 'Pool', 'Parking', 'Braai', 'Mountain Views'],
          image: hartiesAffordable2SleeperPrimaryImages[index] || affordableImages[0],
          capacity: 2,
          roomType: hotel.roomType,
        });
      });
    } else {
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
    }

    // Premium Hotels (10 per destination: A-J)
    // Use custom names and prices for Durban, default for others
    if (destId === 'durban') {
      // Add 2-sleeper premium hotels
      durbanPremiumHotels2Sleeper.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        const hotelImg = durbanPremiumImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        allHotels.push({
          id: `${destId}-premium-2s-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 4.5 + (Math.random() * 0.5),
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining', 'Beachfront'],
          image: hotelImg,
          images: [hotelImg],
          capacity: 2,
          roomType: hotel.roomType,
          includesBreakfast: hotel.includesBreakfast,
        });
      });
      
      // Add 4-sleeper premium hotels for adults-only groups
      durbanPremiumHotels4SleeperAdults.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        const hotelImg = durbanPremiumImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        allHotels.push({
          id: `${destId}-premium-4sa-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 4.5 + (Math.random() * 0.5),
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining', 'Beachfront'],
          image: hotelImg,
          images: [hotelImg],
          capacity: 4,
          roomType: hotel.roomType,
          includesBreakfast: hotel.includesBreakfast,
          forAdultsOnly: true,
        });
      });
      
      // Add 4-sleeper premium hotels for family groups (with kids)
      durbanPremiumHotels4SleeperFamily.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        const hotelImg = durbanPremiumImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        allHotels.push({
          id: `${destId}-premium-4sf-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: 4.5 + (Math.random() * 0.5),
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining', 'Beachfront'],
          image: hotelImg,
          images: [hotelImg],
          capacity: 4,
          roomType: hotel.roomType,
          includesBreakfast: hotel.includesBreakfast,
          forFamilyWithKids: true,
        });
      });
    } else if (destId === 'pretoria') {
      // The Blyde: Only 2 specific hotels based on capacity
      const pretoriaHotels = premiumHotelNames['pretoria'] || [];
      pretoriaHotels.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        allHotels.push({
          id: `${destId}-premium-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.nightlyRate || 2600,
          rating: 4.5 + (Math.random() * 0.5),
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining'],
          image: premiumImages[index % premiumImages.length],
          capacity: hotel.capacity === '2_sleeper' ? 2 : 4,
          roomType: hotel.capacity === '2_sleeper' ? '2 Sleeper Room' : '4 Sleeper Penthouse',
          includesBreakfast: hotel.includesBreakfast,
        });
      });
    } else if (destId === 'harties') {
      const hartiesHotels = premiumHotelNames['harties'] || [];
      hartiesHotels.forEach((hotel, index) => {
        const letter = hotelLetters[index] || hotelLetters[index % hotelLetters.length];
        const isIndlovukazi = hotel.name === 'Indlovukazi Guesthouse';
        const premiumImg = hartiesPremiumImageMap[hotel.name] || harties4SleeperImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        const hotelImages = isIndlovukazi 
          ? [premiumImg, ...hartiesIndlovukaziImages.filter(img => img !== premiumImg)]
          : [premiumImg];
        allHotels.push({
          id: `${destId}-premium-${index + 1}-${letter.toLowerCase()}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.nightlyRate || premiumPrices[index % premiumPrices.length],
          rating: hotel.starRating !== undefined ? hotel.starRating : 0,
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining', 'Dam Views'],
          image: premiumImg,
          images: hotelImages,
          capacity: hotel.sleeps ?? 2,
          roomType: hotel.roomType ?? '2 Sleeper Room',
          includesBreakfast: hotel.includesBreakfast,
        });
      });
    } else if (destId === 'umhlanga') {
      umhlangaRealHotels2Sleeper.forEach((hotel, index) => {
        const hotelImg = umhlangaPremiumImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        allHotels.push({
          id: `${destId}-premium-2s-${index + 1}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.price,
          rating: getUmhlangaHotelStars(hotel.name) ?? 0,
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Restaurant', 'Parking'],
          image: hotelImg,
          images: [hotelImg],
          capacity: hotel.capacity,
          roomType: hotel.roomType,
          includesBreakfast: hotel.includesBreakfast,
        });
      });
    } else if (premiumHotelNames[destId] && premiumHotelNames[destId].length > 0) {
      // Use real premium hotel names from premiumHotelNames registry
      let destPremiumHotels = premiumHotelNames[destId];
      // Destination-specific image maps
      const destImageMap: Record<string, string> = {
        ...(destId === 'durban' ? durbanPremiumImageMap : {}),
        ...(destId === 'umhlanga' ? umhlangaPremiumImageMap : {}),
        ...(destId === 'sun-city' ? { ...sunCity4SleeperImageMap, ...sunCityPremiumImageMap } : {}),
        ...(destId === 'vaal-river' ? { ...vaal4SleeperImageMap, ...vaalNewHotelImageMap, ...vaalPremiumImageMap } : {}),
        ...(destId === 'magalies' ? { ...magaliesPremiumImageMap, ...magalies4SleeperImageMap } : {}),
        ...(destId === 'mpumalanga' ? { ...mpumalangaPremiumImageMap, ...mpumalanga2SleeperImageMap } : {}),
        ...(destId === 'kruger-national-park' ? mpumalangaPremiumImageMap : {}),
        ...(destId === 'cape-town' ? capeTownPremiumImageMap : {}),
        ...(destId === 'umdloti' ? umdlotiPremiumImageMap : {}),
        ...(destId === 'bela-bela' ? belaBelaHotelImageMap : {}),
      };
      // Mpumalanga: only show properties with real property photography
      if (destId === 'mpumalanga') {
        destPremiumHotels = destPremiumHotels.filter((h) => mpumalangaPremiumImageMap[h.name] || mpumalanga2SleeperImageMap[h.name]);
      }
      destPremiumHotels.forEach((hotel, index) => {
        const slug = hotelLetters[index] ? hotelLetters[index].toLowerCase() : `${index + 1}`;
        const premiumImg = destImageMap[hotel.name] || premiumImages[index % premiumImages.length];
        allHotels.push({
          id: `${destId}-premium-${slug}`,
          name: hotel.name,
          destination: destId,
          pricePerNight: hotel.nightlyRate || premiumPrices[index % premiumPrices.length],
          // Only show a star grading where the source listing states one.
          rating:
            hotel.starRating !== undefined
              ? hotel.starRating
              : destId === 'bela-bela'
                ? 0
                : 4.5 + Math.random() * 0.5,
          type: 'premium',
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Fine Dining'],
          image: premiumImg,
          images: [premiumImg],
          capacity: hotel.sleeps ?? (hotel.capacity === '4_sleeper' ? 4 : 2),
          roomType: hotel.roomType ?? (hotel.capacity === '4_sleeper' ? '4 Sleeper Room' : '2 Sleeper Room'),
          includesBreakfast: hotel.includesBreakfast,
        });
      });
    } else {
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
    }
  });

  // Placeholder tier stays named "Budget"/"Affordable" are never shown to clients.
  const withoutTierPlaceholders = allHotels.filter(
    (hotel) => !/\b(budget|affordable)\b/i.test(hotel.name),
  );

  // Durban lists the same property in several source arrays (2/4 sleeper,
  // adults vs family). Keep one listing per property + room capacity so the
  // booking flow never shows the same hotel twice.
  const seenDurban = new Set<string>();
  const deduped = withoutTierPlaceholders.filter((hotel) => {
    if (hotel.destination !== 'durban') return true;
    const key = `${hotel.name.trim().toLowerCase()}|${hotel.capacity ?? 2}`;
    if (seenDurban.has(key)) return false;
    seenDurban.add(key);
    return true;
  });


  // Guarantee unique ids: some destinations now list more rooms than the A–J
  // letter pool, which previously produced duplicate ids and made a selection
  // resolve to the wrong property.
  const seenIds = new Map<string, number>();
  return deduped.map((hotel) => {
    const count = (seenIds.get(hotel.id) ?? 0) + 1;
    seenIds.set(hotel.id, count);
    return count === 1 ? hotel : { ...hotel, id: `${hotel.id}-${count}` };
  });
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
    duration: '2 nights',
    fromPriceOverride: 2150
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
    duration: '2 nights',
    fromPriceOverride: 2100
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
    duration: '2 nights',
    fromPriceOverride: 2750
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
    activitiesIncluded: ['Accommodation', 'Gateway Theatre of Dreams Shopping Mall', 'Umhlanga Rocks Main Beach', 'The Oceans Mall', 'Shuttle transport'],
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
    activitiesIncluded: ['Accommodation', 'uShaka Marine World full combo tickets', 'uShaka Marine Beach', 'Point Waterfront luxury canal boat cruise', 'uMhlanga Rocks Main Beach', 'Shuttle transport'],
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
    activitiesIncluded: ['Accommodation', 'uShaka Marine World full combo tickets', 'Boat cruise-Durban Harbour', 'Umhlanga Rocks Main Beach', 'Ballito Beach', 'Shuttle transport'],
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
    activitiesIncluded: ['Accommodation', 'Romantic dinner date', 'Romantic room decor', 'uShaka Marine World full combo tickets', 'Gondola boat canal cruise with picnic basket', 'Shuttle transport'],
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
    activitiesIncluded: ['Accommodation', 'Knysna wine and oyster luxury lounger sunset cruise', 'Knysna Forest guided quad biking adventure', 'Shuttle transport'],
    duration: '2 nights'
  },

  // ============= HARTIES PACKAGES =============
  {
    id: 'hg1',
    name: 'HG1 - HARTIES LEISURETIME GETAWAY WITH ACCOMMODATION, 2 HOUR SUNSET CHAMPAGNE BOAT CRUISE WITH A DELICIOUS BUFFET WELCOME DRINKS AND CANAPES, INCLUDED THE HARTIES CABLEWAY EXPERIENCE WITH CABLE CAR TO THE TOP OF THE MAGALIES MOUNTAIN',
    shortName: 'Leisuretime Getaway',
    description: 'Includes ACCOMMODATION, 2 HOUR SUNSET CHAMPAGNE CRUISE WITH A DELICIOUS GOURMET BUFFET, THE HARTIES CABLEWAY EXPERIENCE.',
    destination: 'harties',
    basePrice: 1010,
    kidsPriceTiers: [
      { minAge: 4, maxAge: 14, price: 690 },
      { minAge: 15, maxAge: 17, price: 1010 }
    ],
    kidsMinAge: 4,
    activitiesIncluded: ['Accommodation', '2 hour sunset champagne cruise with gourmet buffet', 'Harties Cableway experience'],
    duration: '2 nights'
  },
  {
    id: 'hg2',
    name: 'HG2 - HARTIES FUNTIME GETAWAY WITH ACCOMMODATION, 1 HOUR HORSE RIDING ADVENTURE, 60 MINUTE FULL BODY MASSAGE OR 1 HOUR QUAD BIKING, 2 HOUR HARTIES BOAT CRUISE WITH A DELICIOUS BUFFET WELCOME DRINKS AND CANAPES',
    shortName: 'Funtime Getaway',
    description: 'Includes ACCOMMODATION, 1 HOUR HORSE RIDING EXPERIENCE, 1 HOUR QUAD BIKING FUN OR A 60 MINUTE FULL BODY SWEDISH MASSAGE, 2 HOUR SUNSET CHAMPAGNE CRUISE WITH A DELICIOUS GOURMET BUFFET.',
    destination: 'harties',
    basePrice: 1650,
    kidsPriceTiers: [
      { minAge: 6, maxAge: 12, price: 1220 },
      { minAge: 13, maxAge: 17, price: 1430 }
    ],
    kidsMinAge: 6,
    activitiesIncluded: ['Accommodation', '1 hour horse riding experience', '1 hour quad biking OR 60 minute full body Swedish massage', '2 hour sunset champagne cruise with gourmet buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg3',
    name: 'HG3 - HARTIES FAMILY FUN WEEKENDER WITH ACCOMMODATION, 1 HOUR QUAD BIKING FUN, HARTIES ZOO ANIMAL AND SNAKE PARK, 2 HOUR SUNDAY BUFFET LUNCH BOAT CRUISE WITH WELCOME DRINKS AND CANAPES',
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
    name: 'HG4 - HARTIES GETAWAY WITH ACCOMMODATION, ELEPHANT SANCTUARY, 1 HOUR HORSE RIDING OR 1 HOUR QUAD BIKING ADVENTURE HARTIES CABLEWAY EXPERIENCE',
    shortName: 'Elephant Sanctuary Adventure',
    description: 'Includes accommodation, Elephant Sanctuary experience, choice of 1 hour horse riding or 1 hour quad biking adventure, and the Harties Cableway Experience.',
    destination: 'harties',
    basePrice: 2480,
    kidsPrice: 1450,
    kidsMinAge: 4,
    activitiesIncluded: ['Accommodation', 'Elephant Sanctuary experience', '1 hour horse riding OR 1 hour quad biking adventure', 'Harties Cableway Experience'],
    duration: '2 nights'
  },
  {
    id: 'hg5',
    name: 'HG5 - HARTIES UPSIDE DOWN HOUSE GETAWAY WITH ACCOMMODATION LITTLE PARIS THE HARTIES CABLEWAY EXPERIENCE, 1 HOUR QUAD BIKING FUN',
    shortName: 'Upside Down House',
    description: 'Includes accommodation, Upside Down House, Little Paris, the Harties Cableway Experience, 1 hour quad biking fun.',
    destination: 'harties',
    basePrice: 1330,
    kidsPrice: 940,
    activitiesIncluded: ['Accommodation', 'Fun at Upside Down House adventure', 'Enjoy Little Paris', 'Harties Cableway Experience', '1 hour quad biking fun adventure'],
    duration: '2 nights'
  },
  {
    id: 'hg6',
    name: 'HG6 - HARTIES GETAWAY WITH ACCOMMODATION AND FULL DAY HARTIES CABLEWAY EXPERIENCE',
    shortName: 'Cableway Experience',
    description: 'Includes accommodation and full day access to the Harties Cableway Experience.',
    destination: 'harties',
    basePrice: 380,
    kidsPrice: 300,
    activitiesIncluded: ['Accommodation', 'Full day access to the Harties Cableway Experience'],
    duration: '2 nights'
  },
  {
    id: 'hg7',
    name: 'HG7 - HARTIES COUPLE GETAWAY WITH ACCOMMODATION AND 2 HOUR SUNSET BOAT CRUISE WITH DELICIOUS BUFFET',
    shortName: 'Couple Cruise Getaway',
    description: 'Includes accommodation and a romantic 2 hour sunset boat cruise with delicious buffet.',
    destination: 'harties',
    basePrice: 700,
    kidsPrice: 350,
    activitiesIncluded: ['Accommodation', 'Romantic 2 hour sunset boat cruise with delicious buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg8',
    name: 'HG8 - HARTIES COUPLE ADVENTURE WITH ACCOMMODATION AND 1 HOUR QUAD BIKING EXPERIENCE',
    shortName: 'Couple Quad Adventure',
    description: 'Includes accommodation and an exciting 1 hour quad biking experience.',
    destination: 'harties',
    basePrice: 550,
    kidsPrice: 300,
    activitiesIncluded: ['Accommodation', 'Exciting 1 hour quad biking experience'],
    duration: '2 nights'
  },
  {
    id: 'hg9',
    name: 'HG9 - HARTIES ROMANCE IN THE AIR WITH ACCOMMODATION, 1 HOUR HORSE RIDE, FULL DAY HARTIES CABLEWAY',
    shortName: 'Romance in the Air',
    description: 'Includes accommodation, a romantic 1 hour horse ride, and full day access to the Harties Cableway.',
    destination: 'harties',
    basePrice: 810,
    kidsPrice: 400,
    activitiesIncluded: ['Accommodation', 'Romantic 1 hour horse ride', 'Full day access to the Harties Cableway'],
    duration: '2 nights'
  },
  {
    id: 'hg10',
    name: 'HG10 - HARTIES MAX JET SKI FUN HARTIES WITH ACCOMMODATION, HARTIES CABLEWAY EXPERIENCE, 60 MIN FULL BODY MASSAGE GETAWAY OR 2 HOUR SUNSET BUFFET CRUISE',
    shortName: 'Jet Ski Fun',
    description: 'Includes Jet Ski adventure, Harties Cableway and a 60 minute full body massage or 2 hour sunset champagne cruise with buffet.',
    destination: 'harties',
    basePrice: 1280,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Jet Ski adventure', 'Harties Cableway experience', 'Choice of 60 minute full body massage OR 2 hour sunset champagne cruise with buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg11',
    name: 'HG11 - HARTIES WATER WAKE SNAKE SLIDER SKI AND 2 HOUR HARTIES SUNSET CRUISE',
    shortName: 'Wake Snake & Cruise',
    description: 'Includes accommodation, fun Wake Snake Ski slide, 2 Hour Sunset Champagne Boat cruise with delicious gourmet buffet.',
    destination: 'harties',
    basePrice: 1180,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Fun Wake Snake Ski slide', '2 Hour Sunset Champagne Boat cruise with delicious gourmet buffet'],
    duration: '2 nights'
  },
  {
    id: 'hg12',
    name: 'HG12 - HARTIES WATER TUBE RIDE AND 60 MINUTE FULL BODY MASSAGE GETAWAY',
    shortName: 'Tube Ride & Massage',
    description: 'Includes accommodation, tube ride ski, 60 minute full body massage.',
    destination: 'harties',
    basePrice: 1400,
    kidsPrice: 600,
    activitiesIncluded: ['Accommodation', 'Tube ride ski', '60 minute full body massage'],
    duration: '2 nights'
  },

  // ============= MAGALIES PACKAGES =============
  {
    id: 'mag1',
    name: 'MAG1 - MAGALIES EXPLORER GETAWAY PACKAGE WITH ACCOMMODATION, CRADLE OF MANKIND ORIGINS CENTRE, RHINO AND LION PARK GUIDED GAME DRIVE IN SAFARI TRUCK, REPTILE SHOW AND PREDATOR ENCLOSURE AT THE PARK WELCOME CENTRE',
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
    name: 'MAG2 - MAGALIES ULTIMATE LUX GETAWAY PACKAGE WITH ACCOMMODATION, CRADLE OF MANKIND ORIGINS CENTRE, GUIDED GAME DRIVE IN RHINO AND LION PARK, 2-HOUR BUFFET LUNCH CRUISE, 60-MINUTE FULL BODY MASSAGE, REPTILE SHOW AND PREDATOR ENCLOSURE AT THE PARK WELCOME CENTRE',
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
    name: 'MAG3 - MAGALIES DELUXE HALF DAY SPA, GAME DRIVE AND SUNSET CRUISE WEEKENDER WITH ACCOMMODATION, HALF-DAY SPA EXPERIENCE FULL BODY MASSAGE AND OTHER TREATMENTS, RHINO AND LION PARK GAME DRIVE IN SAFARI TRUCK, REPTILE AND PREDATOR SHOW AT THE PARK WELCOME CENTRE, 2 HOUR CHAMPAGNE SUNSET CRUISE WITH DELICIOUS BUFFET',
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
    name: 'MAG4 - MAGALIES BUDGET GETAWAY WITH ACCOMMODATION, ENTRANCE TO RHINO AND LION PARK, RHINO AND LION PARK GUIDED GAME DRIVE, 60-MINUTE FULL BODY MASSAGE',
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
    name: 'MAG5 - THE PERFECT DATE IN MAGALIES WITH ACCOMMODATION, 60-MINUTE HORSE RIDING EXPERIENCE, QUAD BIKING ADVENTURE, PRIVATE ROMANTIC PICNIC SETUP, CHAMPAGNE AND PICNIC BASKET, ROMANTIC BLANKET LAYOUT',
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
    name: 'MAG6 - HORSE, SPA AND PICNIC MAGALIES GETAWAY WITH ACCOMMODATION, 1-HOUR HORSE TRAIL, 60-MINUTE FULL BODY MASSAGE, PRIVATE ROMANTIC PICNIC SETUP, CHAMPAGNE AND PICNIC BASKET',
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
  {
    id: 'dur9',
    name: 'DUR9 - DURBAN BEACH GETAWAY WITH USHAKA MARINE WORLD, MOSES MABHIDA SKYCAR AND ISLE OF CAPRI BOAT CRUISE',
    shortName: 'uShaka, SkyCar & Cruise',
    description: 'Includes accommodation, entrance fees to uShaka Marine World, Moses Mabhida Stadium SkyCar, Isle of Capri Boat Cruise, and transport to shuttle you from the hotel to activities and back.',
    destination: 'durban',
    basePrice: 1150,
    kidsPrice: 700,
    activitiesIncluded: ['Accommodation', 'Entrance fees to uShaka Marine World', 'Moses Mabhida Stadium SkyCar', 'Isle of Capri Boat Cruise', 'Shuttle service between hotel and activities'],
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
  {
    id: 'umdl001',
    name: 'UMDL001 - MYSTIQUAL MDLOTI 3 BEACHES GETAWAY WEEKENDS AND MIDWEEK GETAWAYS',
    shortName: 'Mystiqual Mdloti 3 Beaches',
    description: 'Includes accommodation, uMdloti Beach, Ballito Beach and Umhlanga Main Beach, a night out to Isibaya Casino and transport to shuttle you between the beaches, the casino and your accommodation.',
    destination: 'umdloti',
    basePrice: 1820,
    kidsMinAge: 2,
    kidsPriceTiers: [
      { minAge: 2, maxAge: 6, price: 600 },
      { minAge: 7, maxAge: 17, price: 850 },
    ],
    activitiesIncluded: [
      'Self-catering beachfront accommodation in uMdloti',
      'uMdloti Beach day',
      'Ballito Beach day',
      'Umhlanga Main Beach day',
      'Night out to Isibaya Casino',
      'Shuttle transport between the beaches, the casino and your accommodation',
    ],
    duration: '2 nights'
  },
  {
    id: 'kruger001',
    name: 'KRUGER001 - KRUGER NATIONAL PARK MPUMALANGA BUDGET WEEKENDER',
    shortName: 'Kruger Weekender',
    description: 'Includes accommodation at Pretoriuskop Rest Camp (2-sleeper hut EB2, 3-sleeper hut EB3 or 4-sleeper hut EB5), a 3.5 hour guided Kruger National Park game drive (early morning sunrise, afternoon or sunset drive), conservation and community fees included. Tours to other attractions are on a self drive basis and we can assist with bookings for self drive or scheduled tours should there be a need.',
    destination: 'kruger-national-park',
    basePrice: 1140,
    activitiesIncluded: [
      '2 nights accommodation',
      '3.5 hour guided Kruger National Park game drive (sunrise, afternoon or sunset drive)',
      'Conservation and community fees included',
      'Self drive to other attractions, we assist with bookings for self drive or scheduled tours',
    ],
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
    kidsPrice: 550,
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
    name: 'CPT1 - CAPE TOWN ACCOMMODATION WITH SIGHTSEEING, ROBBEN ISLAND, TABLE MOUNTAIN CABLEWAY, CANAL CRUISE',
    shortName: 'Iconic Tour',
    description: 'Includes accommodation, Cape Town Sightseeing Tour Bus (1 day full tour), Robben Island tour with luxury boat transfer, Table Mountain Aerial Cableway ticket, Canal boat cruise.',
    destination: 'cape-town',
    basePrice: 1800,
    kidsPrice: 850,
    activitiesIncluded: ['Accommodation', 'Cape Town Sightseeing Tour Bus (1 day full tour)', 'Robben Island tour with luxury boat transfer', 'Table Mountain Aerial Cableway ticket', 'Canal boat cruise'],
    duration: '3 nights'
  },
  {
    id: 'cpt2',
    name: 'CPT2 - CAPE TOWN ACCOMMODATION WITH 2 DAY SIGHTSEEING, CONSTANTIA WINE ESTATE TOUR, TABLE MOUNTAIN, SUNSET TOUR SIGNAL HILL (PICNIC)',
    shortName: 'Sunset Explorer',
    description: 'Includes accommodation, 2-day Cape Town Sightseeing Tour Bus, Table Mountain Cableway tickets, Constantia Wine Tour, Canal boat cruise, Sunset tour with sundowners at Signal Hill.',
    destination: 'cape-town',
    basePrice: 1200,
    kidsPrice: 800,
    activitiesIncluded: ['Accommodation', '2-day Cape Town Sightseeing Tour Bus', 'Table Mountain Cableway tickets', 'Constantia Wine Tour', 'Canal boat cruise', 'Sunset tour with sundowners at Signal Hill'],
    duration: '2 nights'
  },
  {
    id: 'cptfw',
    name: 'CPTFW - CAPE TOWN ACCOMMODATION WITH FRANSCHOEK WINE TRAM, SIGHTSEEING, 60 MINUTE FULL BODY MASSAGE, CANAL BOAT CRUISE',
    shortName: 'Wine Tram Getaway',
    description: 'Includes accommodation, Franschoek Wine Tram with wine tasting, Full-day Cape Town city tour, 60 Minute Full body massage, Canal boat cruise.',
    destination: 'cape-town',
    basePrice: 2300,
    activitiesIncluded: ['Accommodation', 'Franschoek Wine Tram with wine tasting', 'Full-day Cape Town city tour', '60 Minute Full body massage', 'Canal boat cruise'],
    duration: '2 nights'
  },
  {
    id: 'cptwtcm',
    name: 'CPTWTCM - CAPE TOWN ACCOMMODATION WITH WINE ROUTE TOUR, TABLE MOUNTAIN CABLEWAY, 60 MINUTE FULL BODY MASSAGE, CANAL BOAT CRUISE',
    shortName: 'Wine & Mountain',
    description: 'Includes accommodation, beach access, Wine route tour with wine tasting, Canal cruise, Table Mountain Cableway, Full Body Swedish massage.',
    destination: 'cape-town',
    basePrice: 2600,
    activitiesIncluded: ['Accommodation', 'Beach access', 'Wine route tour with wine tasting', 'Canal cruise', 'Table Mountain Cableway', 'Full Body Swedish massage'],
    duration: '2-3 nights'
  },

  // ============= THE BLYDE PACKAGES =============
  {
    id: 'bly1',
    name: 'BLY1 - THE BLYDE PLEASURE RESORT WITH 60 MINUTE HOT STONE MASSAGE AND SPA MOMENTS',
    shortName: 'Blyde Spa Getaway',
    description: 'Includes accommodation at Blyde Penthouse Apartments, 60 minute hot stone massage, spa moments experience at The Blyde FUNtastic Pleasure Resort.',
    destination: 'pretoria',
    basePrice: 1200,
    kidsPrice: 600,
    activitiesIncluded: ['2 nights accommodation inside the Blyde Crystal Lagoon', '60 minute hot stone massage with amazing spa moments for couples, or trendy group massage session if you are a group', 'Full Access to The Blyde FUNtastic Crystal Lagoon including all facilities, pools and restaurants'],
    duration: '2 nights',
    // Flag to indicate affordable tier has different inclusions (outside the resort)
    affordableInclusions: ['2 nights quality accommodation just outside the Blyde Crystal Lagoon', '60 minute hot stone massage with amazing spa moments for couples, or trendy group massage session if you are a group', 'Full Day Access to The Blyde FUNtastic Crystal Lagoon including all facilities, pools and restaurants'],
    budgetDisabled: true,
    budgetDisabledMessage: 'This option is currently not available, please check out the Affordable and Premium options.'
  },

  // ============= BELA BELA PACKAGES =============
  {
    id: 'bela1',
    name: 'BELA BELA GETAWAY PACKAGE WITH ACCOMMODATION, ENTRY TO BELA BELA WARMBATHS WATER PARK, GAME DRIVE IN SAFARI TRUCK',
    shortName: 'Waterpark & Game Drive',
    description: 'Includes entrance into Bela Bela Resort Waterpark with water slides, water sports and warm pools, guided game drive in safari truck, and accommodation inside or just outside the resort.',
    destination: 'bela-bela',
    basePrice: 800,
    kidsPrice: 600,
    kidsMinAge: 4,
    activitiesIncluded: ['Entrance into Bela Bela Resort Waterpark with water slides, water sports and warm pools', 'Guided game drive in safari truck', 'Accommodation inside or just outside the resort'],
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
  { id: 'harties', name: 'Harties', shortName: 'Harties', country: 'South Africa', description: 'Scenic escape near the dam with breathtaking views and activities.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/Harties.jpg', startingPrice: 1580, popular: true, international: false },
  { id: 'magalies', name: 'Magalies', shortName: 'Magalies', country: 'South Africa', description: 'Mountain retreats and nature getaways for a refreshing break.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/magalies1.jpg', startingPrice: 2100, popular: true, international: false },
  { id: 'durban', name: 'Durban Beachfront', shortName: 'Durban', country: 'South Africa', description: 'Sunny beach holidays with warm waters and vibrant city life.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/durban.png', startingPrice: 1600, popular: true, international: false },
  { id: 'umhlanga', name: 'Umhlanga', shortName: 'Umhlanga', country: 'South Africa', description: 'Coastal escape near Durban with beautiful beaches and upscale shopping.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', startingPrice: 1700, popular: true, international: false },
  { id: 'umdloti', name: 'uMdloti', shortName: 'uMdloti', country: 'South Africa', description: 'Laid-back north coast beach village between Umhlanga and Ballito with self-catering beachfront apartments.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', startingPrice: 1820, popular: true, international: false },
  { id: 'cape-town', name: 'Cape Town', shortName: 'Cape Town', country: 'South Africa', description: 'Iconic Table Mountain, stunning beaches, and world-class vineyards.', image: 'https://raw.githubusercontent.com/TravelAffordable/Travel-Affordable-Website/main/cape%20town.jpg', startingPrice: 2400, popular: true, international: false },
  { id: 'sun-city', name: 'Sun City', shortName: 'Sun City', country: 'South Africa', description: 'World-famous resort with Valley of Waves and endless entertainment.', image: sunCityImage, startingPrice: 2000, popular: true, international: false },
  { id: 'kruger-national-park', name: 'Kruger National Park', shortName: 'Kruger', country: 'South Africa', description: 'Big Five safari with sunrise, afternoon and sunset game drives in the Kruger National Park.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', startingPrice: 2320, popular: true, international: false },
  { id: 'mpumalanga', name: 'Mpumalanga', shortName: 'Mpumalanga', country: 'South Africa', description: 'Panorama Route, Blyde River Canyon, and Kruger National Park adventures.', image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=800', startingPrice: 2520, popular: true, international: false },
  { id: 'knysna', name: 'Knysna', shortName: 'Knysna', country: 'South Africa', description: 'Garden Route gem with lagoon, forests, and oyster experiences.', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', startingPrice: 2750, popular: false, international: false },
  { id: 'vaal-river', name: 'Vaal Cruise and Emerald Casino', shortName: 'Vaal Cruise', country: 'South Africa', description: 'Riverside relaxation and water sports just outside Johannesburg.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', startingPrice: 2250, popular: false, international: false },
  { id: 'bela-bela', name: 'Bela Bela', shortName: 'Bela Bela', country: 'South Africa', description: 'Hot springs, game reserves, and adventure activities in Limpopo.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', startingPrice: 2600, popular: false, international: false },
  { id: 'pretoria', name: 'The Blyde FUNtastic Pleasure Resort, Pretoria', shortName: 'The Blyde', country: 'South Africa', description: 'Luxury spa resort with hot stone massage, relaxation facilities and scenic getaway experiences.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', startingPrice: 2200, popular: false, international: false },
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
  roomTypeName?: string;
  includesBreakfast: boolean;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  rooms: number;
  activitiesIncluded: string[];
  // Optional: alternative inclusions for affordable tier (when different from premium)
  affordableInclusions?: string[];
  // Hotel tier to determine which inclusions to display
  hotelTier?: 'budget' | 'affordable' | 'premium';
  hotelImages?: string[]; // Real hotel photos if available
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
  
  const totalEligibleChildren = request.childrenAges.filter(age => age >= 4 && age <= 16).length;
  let eligibleChildIndex = 0;
  
  request.childrenAges.forEach(age => {
    // Only children 4-16 are charged service fees
    if (age >= 4 && age <= 16) {
      const isFirstEligible = eligibleChildIndex === 0;
      eligibleChildIndex++;
      validChildren++;
      // Add package cost for child using tiered pricing if available
      if (pkg.kidsPriceTiers && pkg.kidsPriceTiers.length > 0) {
        const tier = pkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
        if (tier) {
          childrenPackageCost += tier.price;
        } else if (pkg.kidsPrice) {
          childrenPackageCost += pkg.kidsPrice;
        } else {
          childrenPackageCost += pkg.basePrice * 0.5;
        }
      } else if (pkg.kidsPrice) {
        childrenPackageCost += pkg.kidsPrice;
      } else {
        // Fallback if no kidsPrice defined
        childrenPackageCost += pkg.basePrice * 0.5;
      }
      
      // Once-off fees using shared child service fee utility
      childrenOnceFees += getChildServiceFeeForAge(request.adults, age, isFirstEligible, totalEligibleChildren);
    }
    // Children under 4 are free
  });
  
  const childDiscount = 0; // No longer using discount model
  
  // Internal flat adult service fee (never shown to clients)
  const serviceFeePerAdult = 400;
  const totalServiceFees = serviceFeePerAdult * request.adults;
  
// Total calculations
  // Accommodation cost is divided among adults only (already calculated for group)
  const totalPackageCost = packageBaseCost + childrenPackageCost + childrenOnceFees;
  const totalCost = accommodationCost + totalPackageCost + totalServiceFees;
  const totalPeople = request.adults + validChildren;
  const totalPerPerson = Math.round(totalCost / totalPeople);
  
  const roomType = hotel.roomType || 'Standard Room';
  const is4SleeperRoom = (hotel.capacity || 2) >= 4;
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
  
  // Service fees are intentionally NOT shown to clients — included silently in totals.
  
  return {
    packageName: pkg.name,
    packageDescription: pkg.description,
    hotelName: hotelNameDisplay,
    hotelId: hotel.id,
    hotelImage: hotel.image,
    hotelImages: hotel.images,
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
  const totalGuests = request.adults + request.children;
  const hasKids = request.children > 0;
  
  // Filter hotels by destination, type, and capacity
  // For Durban: show appropriate room types based on guest count and composition
  const availableHotels = hotels.filter(h => {
    if (h.destination !== request.destination || h.type !== request.hotelType) {
      return false;
    }
    
    // For Durban budget hotels with capacity info, filter by guest count
    if (h.destination === 'durban' && h.type === 'very-affordable' && h.capacity) {
      // If total guests > 2, only show 4-sleeper options
      if (totalGuests > 2) {
        return h.capacity >= 4;
      }
      // If total guests <= 2, only show 2-sleeper options
      return h.capacity === 2;
    }
    
    // Affordable tier uses generic hotels for all destinations (no capacity filtering)

    // For Pretoria (The Blyde) affordable hotels with capacity info, filter by guest count
    if (h.destination === 'pretoria' && h.type === 'affordable' && h.capacity) {
      // If total guests > 2, only show 4-sleeper options
      if (totalGuests > 2) {
        return h.capacity >= 4;
      }
      // If total guests <= 2, only show 2-sleeper options
      return h.capacity === 2;
    }
    
    // For Durban premium hotels with capacity info, filter by guest count and composition
    if (h.destination === 'durban' && h.type === 'premium' && h.capacity) {
      // If total guests > 2, only show 4-sleeper options
      if (totalGuests > 2) {
        // Filter by family vs adults-only
        if (hasKids) {
          // Show family rooms for groups with kids
          return h.capacity >= 4 && h.forFamilyWithKids === true;
        } else {
          // Show adults-only rooms for all-adult groups
          return h.capacity >= 4 && h.forAdultsOnly === true;
        }
      }
      // If total guests <= 2, only show 2-sleeper options
      return h.capacity === 2;
    }
    
    // For Pretoria (The Blyde) premium hotels with capacity info, filter by guest count
    if (h.destination === 'pretoria' && h.type === 'premium' && h.capacity) {
      // If total guests > 2, only show 4-sleeper options (Blyde Penthouse)
      if (totalGuests > 2) {
        return h.capacity >= 4;
      }
      // If total guests <= 2, only show 2-sleeper options (Mint Hotel)
      return h.capacity === 2;
    }
    
    return true;
  });
  
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

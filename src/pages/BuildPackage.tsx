import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MapPin, Users, Calendar, Search, Sparkles } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

// Import images
import sunCityImage from '@/assets/sun-city.jpeg';
import sundownRanch1 from '@/assets/sundown-ranch-1.jpeg';
import sundownRanch2 from '@/assets/sundown-ranch-2.jpeg';
import guesthouseA1 from '@/assets/guesthouse-a-1.png';
import guesthouseA2 from '@/assets/guesthouse-a-2.jpeg';

// Types
interface Hotel {
  id: string;
  name: string;
  nightlyRate: number;
  roomType: string;
  amenities: string;
  guests: string;
  images: string[];
}

interface Activity {
  name: string;
  image: string;
  rates: {
    adult: number;
    child: number;
    freeAge: number;
    childAgeRange?: { min: number; max: number };
  };
}

// Hotels data organized by destination
const hotels: Record<string, Hotel[]> = {
  'Durban Beachfront Accommodation': [
    { id: 'blue-waters', name: 'Blue Waters Hotel', nightlyRate: 994, roomType: 'Deluxe King or Twin Room (South Facing)', amenities: 'Breakfast included, multiple bed types', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300'] },
    { id: 'belaire-suites', name: 'Belaire Suites Hotel', nightlyRate: 997, roomType: 'Superior Double or Twin Room', amenities: 'Breakfast included, multiple bed types', guests: '2 adults', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300'] },
    { id: 'oceanic-unit', name: 'Oceanic Unit 122 - North Beach', nightlyRate: 810, roomType: 'One-Bedroom Apartment', amenities: '1 full bed, full kitchen, 1 bathroom', guests: '2 adults', images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300'] },
  ],
  'Harties Cruise and Cableway Accommodation': [
    { id: 'hartbeespoort-resort', name: 'Hartbeespoort Holiday Resort', nightlyRate: 1200, roomType: 'Chalet', amenities: 'Breakfast included, lake view', guests: '4 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'seasons-golf', name: 'Seasons Golf, Leisure, Spa', nightlyRate: 1500, roomType: 'Deluxe Room', amenities: 'Breakfast included, golf course view', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'cave-view', name: 'The Cave View Apartment', nightlyRate: 550, roomType: 'Bedroom Apartment', amenities: 'Self-catering', guests: '2 adults', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'] },
    { id: 'riverleaf', name: 'Riverleaf Hotel', nightlyRate: 1400, roomType: 'Deluxe Double', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300'] },
    { id: 'villa-paradiso', name: 'Villa Paradiso Hotel', nightlyRate: 1260, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300'] },
    { id: 'palm-swift', name: 'Palm Swift Hotel', nightlyRate: 1400, roomType: 'Deluxe Double', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300'] },
  ],
  'Cape Town Beachfront Accommodation': [
    { id: 'table-bay', name: 'The Table Bay Hotel', nightlyRate: 1500, roomType: 'Luxury King Room', amenities: 'Breakfast included, ocean view', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'one-and-only', name: 'One&Only Cape Town', nightlyRate: 2500, roomType: 'Premier Marina Table Mountain Room', amenities: 'Breakfast included, mountain view', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
  ],
  'Johannesburg, Sandton and Soweto Accommodation': [
    { id: 'michelangelo', name: 'Michelangelo Hotel', nightlyRate: 1200, roomType: 'Executive Room', amenities: 'Breakfast included, city view', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
    { id: 'sandton-sun', name: 'Sandton Sun', nightlyRate: 1100, roomType: 'Deluxe Room', amenities: 'Breakfast included, city view', guests: '2 adults', images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300'] },
  ],
  'Mpumalanga Getaways': [
    { id: 'fourways-guest', name: 'Fourways Guest House', nightlyRate: 632, roomType: 'Double Room', amenities: '1 double bed', guests: '2 adults', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'] },
    { id: 'secret-location', name: 'The Secret Location Guesthouse', nightlyRate: 700, roomType: 'Superior Chalet', amenities: '1 bedroom, 1 bathroom, 25m²', guests: '2 adults', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300'] },
    { id: 'tjimaka-farm', name: 'Tjimaka Farm', nightlyRate: 700, roomType: 'Superior Chalet', amenities: '1 bedroom, 1 bathroom, 25m²', guests: '2 adults', images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300'] },
    { id: 'vm-guesthouse', name: 'VM Guesthouse', nightlyRate: 720, roomType: 'Double Room with Balcony', amenities: '1 double bed', guests: '2 adults', images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=300'] },
  ],
  'Magalies Getaways': [
    { id: 'magalies-ensuite', name: 'Magalies En Suite Rooms', nightlyRate: 550, roomType: 'Double room', amenities: 'En-suite bathroom', guests: '2 adults', images: [guesthouseA1] },
    { id: 'stonehounds-lodge', name: 'Stonehounds Lodge', nightlyRate: 790, roomType: 'Double room', amenities: 'Nature setting', guests: '2 adults', images: [guesthouseA2] },
    { id: 'maropeng-boutique', name: 'Maropeng Boutique Hotel', nightlyRate: 2180, roomType: 'Double room', amenities: 'Luxury boutique', guests: '2 adults', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300'] },
    { id: 'nullarbor-cottages', name: 'Nullarbor Cottages', nightlyRate: 1000, roomType: '2 sleeper Chalet', amenities: 'Self-catering', guests: '2 adults', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'] },
    { id: 'zacks-country', name: 'Zacks Country Stay', nightlyRate: 1000, roomType: 'Queen room', amenities: 'Country setting', guests: '2 adults', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300'] },
    { id: 'palmera-guest', name: 'Palmera Guest House', nightlyRate: 855, roomType: 'Double room', amenities: 'Guest house', guests: '2 adults', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300'] },
    { id: 'cradle-mount', name: 'Cradle Mount Hotel', nightlyRate: 1650, roomType: 'Executive king room', amenities: 'Luxury hotel', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'mau-bed-breakfast', name: 'MaU Bed and Breakfast', nightlyRate: 855, roomType: 'Deluxe double room', amenities: 'B&B', guests: '2 adults', images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300'] },
    { id: 'self-catered-apartment', name: 'Self-Catered Apartment', nightlyRate: 1045, roomType: 'Garden view apartment', amenities: 'Self-catering', guests: '2 adults', images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300'] },
  ],
  'Sun City Getaways': [
    { id: 'modizen', name: 'Modizen Guesthouse', nightlyRate: 1300, roomType: 'Double room', amenities: 'Guest house', guests: '2 adults', images: [sundownRanch1] },
    { id: 'valley-view', name: 'Valley View Guesthouse', nightlyRate: 1400, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: [sundownRanch2] },
    { id: 'asda-guesthouse', name: 'Asda Guesthouse', nightlyRate: 1100, roomType: 'Double Room', amenities: 'Guest house', guests: '2 adults', images: [sunCityImage] },
    { id: 'kingdom-resort', name: 'Kingdom Resort', nightlyRate: 2800, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'sundown-estate', name: 'Sundown Country Estate', nightlyRate: 2500, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'sun-city-cabanas', name: 'Sun City Cabanas Hotel', nightlyRate: 3850, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300'] },
    { id: 'sun-city-cascades', name: 'Sun City Cascades Hotel', nightlyRate: 4410, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300'] },
    { id: 'kwa-maritane', name: 'Kwa-Maritane', nightlyRate: 6410, roomType: 'Double Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
  ],
  'Bela Bela Getaways': [
    { id: 'summerset-house', name: 'Summerset Place Country House', nightlyRate: 1290, roomType: 'Double room', amenities: 'Country house', guests: '2 adults', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300'] },
    { id: 'bela-rest', name: 'Bela Rest Resort', nightlyRate: 1250, roomType: 'Double room', amenities: 'Resort', guests: '2 adults', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300'] },
    { id: 'woodlands-guest', name: 'Woodlands Guesthouse', nightlyRate: 1450, roomType: 'Double room', amenities: 'Guest house', guests: '2 adults', images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300'] },
    { id: 'ditholo-lodge', name: 'Ditholo Game Lodge 3 Star', nightlyRate: 3150, roomType: 'Double room', amenities: 'Game lodge', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'la-bella', name: 'La Bella B&B', nightlyRate: 990, roomType: 'Double room', amenities: 'B&B', guests: '2 adults', images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300'] },
    { id: 'genesis-guesthouse', name: 'Genesis Guesthouse', nightlyRate: 1160, roomType: 'Double room', amenities: 'Guest house', guests: '2 adults', images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300'] },
    { id: 'elephant-springs', name: 'Elephant Springs', nightlyRate: 980, roomType: 'Double room', amenities: 'Hot springs', guests: '2 adults', images: ['https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=300'] },
  ],
  'Umhlanga Beachfront Accommodation': [
    { id: 'beverly-hills', name: 'Beverly Hills Hotel', nightlyRate: 2500, roomType: 'Sea-facing Room', amenities: 'Breakfast included, beachfront', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'oyster-box', name: 'The Oyster Box', nightlyRate: 3500, roomType: 'Luxury Suite', amenities: 'Breakfast included, spa', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'capital-pearls', name: 'The Capital Pearls', nightlyRate: 1800, roomType: 'Studio Apartment', amenities: 'Self-catering, pool', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
    { id: 'cabana-beach', name: 'Cabana Beach Resort', nightlyRate: 1600, roomType: 'Self-catering Unit', amenities: 'Beachfront, pool', guests: '4 adults', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300'] },
  ],
  'Knysna Garden Route': [
    { id: 'turbine-hotel', name: 'The Turbine Hotel', nightlyRate: 2200, roomType: 'Lagoon View Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'pezula-resort', name: 'Pezula Resort', nightlyRate: 3800, roomType: 'Suite', amenities: 'Golf, spa included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'knysna-hollow', name: 'Knysna Hollow', nightlyRate: 1400, roomType: 'Garden Room', amenities: 'Country hotel', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
    { id: 'conrad-pezula', name: 'Conrad Pezula', nightlyRate: 4200, roomType: 'Ocean View Suite', amenities: 'Luxury resort', guests: '2 adults', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300'] },
  ],
  'Vaal River Getaways': [
    { id: 'three-rivers', name: 'Three Rivers Lodge', nightlyRate: 1800, roomType: 'River View Room', amenities: 'Breakfast included', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'stonehaven-vaal', name: 'Stonehaven on Vaal', nightlyRate: 1500, roomType: 'Standard Room', amenities: 'Country setting', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'emerald-resort', name: 'Emerald Resort & Casino', nightlyRate: 1600, roomType: 'Chalet', amenities: 'Casino, Aquadome', guests: '4 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
    { id: 'riverside-sun', name: 'Riverside Sun', nightlyRate: 1400, roomType: 'Standard Room', amenities: 'River views', guests: '2 adults', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300'] },
  ],
  'Pretoria Getaways': [
    { id: 'sheraton-pretoria', name: 'Sheraton Pretoria Hotel', nightlyRate: 1800, roomType: 'Deluxe Room', amenities: 'City centre, pool', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
    { id: 'irene-country', name: 'Irene Country Lodge', nightlyRate: 2200, roomType: 'Country Room', amenities: 'Spa, gardens', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'kievits-kroon', name: 'Kievits Kroon', nightlyRate: 1900, roomType: 'Vineyard Room', amenities: 'Wine estate', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'castello-monte', name: 'Castello di Monte', nightlyRate: 2400, roomType: 'Tuscan Suite', amenities: 'Luxury boutique', guests: '2 adults', images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300'] },
  ],
  'Bali Adventure': [
    { id: 'hanging-gardens', name: 'Hanging Gardens of Bali', nightlyRate: 4500, roomType: 'Infinity Pool Villa', amenities: 'Breakfast, spa', guests: '2 adults', images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300'] },
    { id: 'four-seasons-bali', name: 'Four Seasons Bali', nightlyRate: 5200, roomType: 'Pool Villa', amenities: 'Luxury resort', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'ubud-guesthouse', name: 'Ubud Guesthouse', nightlyRate: 800, roomType: 'Double Room', amenities: 'Traditional setting', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'seminyak-villa', name: 'Seminyak Beach Villa', nightlyRate: 2200, roomType: 'Beach Villa', amenities: 'Pool, beach access', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
  ],
  'Dubai Luxury': [
    { id: 'atlantis-palm', name: 'Atlantis The Palm', nightlyRate: 5500, roomType: 'Palm Room', amenities: 'Waterpark access', guests: '2 adults', images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300'] },
    { id: 'burj-al-arab', name: 'Burj Al Arab', nightlyRate: 8500, roomType: 'Deluxe Suite', amenities: '7-star luxury', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'jumeirah-beach', name: 'Jumeirah Beach Hotel', nightlyRate: 3800, roomType: 'Ocean View Room', amenities: 'Beach access', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'one-only-royal', name: 'One&Only Royal Mirage', nightlyRate: 4200, roomType: 'Arabian Suite', amenities: 'Luxury resort', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
  ],
  'Thailand Adventure': [
    { id: 'banyan-tree', name: 'Banyan Tree Phuket', nightlyRate: 4800, roomType: 'Pool Villa', amenities: 'Spa, beach', guests: '2 adults', images: ['https://images.unsplash.com/photo-1528181304800-259b08848526?w=300'] },
    { id: 'six-senses', name: 'Six Senses Yao Noi', nightlyRate: 5500, roomType: 'Ocean View Pool Villa', amenities: 'Luxury island', guests: '2 adults', images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300'] },
    { id: 'phuket-guesthouse', name: 'Phuket Beach Guesthouse', nightlyRate: 600, roomType: 'Double Room', amenities: 'Beach access', guests: '2 adults', images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300'] },
    { id: 'patong-resort', name: 'Patong Beach Resort', nightlyRate: 1200, roomType: 'Pool View Room', amenities: 'Central location', guests: '2 adults', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'] },
  ],
};

// Activities organized by destination - Individual activities (degrouped)
const activitiesByDestination: Record<string, Activity[]> = {
  'Durban Beachfront Accommodation': [
    { name: 'Ushaka Marine World', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 150, child: 100, freeAge: 0 } },
    { name: 'Moses Mabhida Stadium', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100', rates: { adult: 80, child: 65, freeAge: 0 } },
    { name: '60 minute full body massage at a beachfront spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 700, child: 450, freeAge: 12 } },
    { name: 'Open top Bus 3 hours', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 250, child: 250, freeAge: 0 } },
    { name: 'Gondola Boat cruise with romantic picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 750, child: 750, freeAge: 0 } },
    { name: '1 hour Waterfront pedal boat', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 250, child: 250, freeAge: 0 } },
    { name: 'Segway Glides on the beachfront', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 750, child: 750, freeAge: 0 } },
    { name: 'Airport shuttle to Durban Hotels', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 400, child: 400, freeAge: 0 } },
    { name: 'Trip from Durban Beachfront to Umhlanga main beach and The Oceans Mall', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 850, child: 850, freeAge: 0 } },
    { name: 'Romantic or Happy Birthday settings in room', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 950, child: 950, freeAge: 0 } },
  ],
  'Harties Cruise and Cableway Accommodation': [
    { name: '2 Hour Sunset Champagne Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Lunchtime Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Breakfast Brunch Buffet Cruise', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: 'The Alba Luxury Fine Dining Cruise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 820, child: 620, freeAge: 6 } },
    { name: 'Harties Cableway', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 350, child: 230, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100', rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: '1 Hour Horse Riding and Romantic Picnic', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=100', rates: { adult: 700, child: 0, freeAge: 0 } },
    { name: '1 Hour Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 500, child: 500, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 380, freeAge: 0 } },
    { name: 'Lion & Safari Park', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 460, child: 300, freeAge: 12 } },
    { name: 'Dikhololo Game Reserve Drive', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 350, freeAge: 12 } },
  ],
  'Cape Town Beachfront Accommodation': [
    { name: 'Robben Island', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 450, child: 250, freeAge: 1, childAgeRange: { min: 5, max: 18 } } },
    { name: 'Table Mountain Cableway', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 510, child: 250, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: '2 Days Sightseeing Tour Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 450, child: 320, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Cape Point and Penguin Explorer', image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=100', rates: { adult: 620, child: 420, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: '1 Day Sightseeing Tour Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 330, child: 210, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Wine Route Tour, Paarl, Franschoek, Stellenbosch', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=100', rates: { adult: 750, child: 440, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Sunset Bus Tour to Signal Hill with Picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 230, child: 180, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Sunset Champagne Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 350, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'V&A Waterfront Harbour and Seal Cruise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 120, child: 70, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
  ],
  'Johannesburg, Sandton and Soweto Accommodation': [
    { name: 'Johannesburg and Soweto Bus Tour', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100', rates: { adult: 750, child: 390, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Lesedi Cultural Village and Lion And Safari Park', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 1400, child: 800, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: '2 Hour Buffet Cruise and Harties Cableway', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 940, child: 680, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Elephant Sanctuary and Harties Cableway', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 940, child: 580, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Elephant Sanctuary and 2 Hour Fine Dining Luxury Cruise', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 1600, child: 900, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Maboneng outing with 60 minute Swedish Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 1050, child: 750, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Gautrain Ride to Pretoria and Pretoria Tour', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=100', rates: { adult: 1040, child: 900, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
  ],
  'Mpumalanga Getaways': [
    { name: 'Mpumalanga Sightseeing Tour', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 1700, child: 900, freeAge: 0 } },
    { name: 'Graskop Gorge Lift', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 300, child: 220, freeAge: 0 } },
    { name: 'Kruger National Park Tour', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 700, child: 450, freeAge: 0 } },
    { name: 'Ziplining Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Gorge Suspension Bridge Walk', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 180, child: 120, freeAge: 0 } },
    { name: 'Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 400, child: 320, freeAge: 0 } },
    { name: 'Blyde River Canyon Tour', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 450, child: 300, freeAge: 0 } },
    { name: "God's Window Viewpoint", image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 50, child: 30, freeAge: 0 } },
  ],
  'Magalies Getaways': [
    { name: 'Maropeng Cradle of Mankind Origins Centre', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 350, child: 200, freeAge: 4 } },
    { name: 'Wonder Caves Tour', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 280, child: 180, freeAge: 4 } },
    { name: 'Guided Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 450, child: 300, freeAge: 6 } },
    { name: 'Reptile and Snake Shows', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Rhino and Lion Park Entry', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 380, child: 250, freeAge: 4 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: '2 Hour Sunday Lunch Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Champagne Sunset Cruise with Buffet', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: '2 Hour Spa Treatment with Champagne', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 850, child: 0, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100', rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: '1 Hour Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 500, child: 500, freeAge: 0 } },
    { name: 'Private Romantic Picnic', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=100', rates: { adult: 650, child: 0, freeAge: 0 } },
  ],
  'Sun City Getaways': [
    { name: 'Sun City Entry', image: sunCityImage, rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Valley of the Waves Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 350, child: 250, freeAge: 3 } },
    { name: 'Pilanesberg Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Lunch Inside Sun City', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Shuttle to Sun City from Guesthouse', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 200, child: 150, freeAge: 0 } },
    { name: '2 Hour Sunday Lunch Buffet Cruise in Harties', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: 'Sun City Golf Course', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100', rates: { adult: 1200, child: 0, freeAge: 0 } },
    { name: 'Zip Slide Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 8 } },
    { name: 'Segway Tour', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 380, child: 380, freeAge: 0 } },
  ],
  'Bela Bela Getaways': [
    { name: 'Forever Resorts Waterpark Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Warm Swimming Pools Access', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Water Slides and Gliders', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 180, child: 150, freeAge: 4 } },
    { name: 'Guided Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 320, freeAge: 6 } },
    { name: 'Elephant Tour and Experience', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Braai Facilities with Shades', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100', rates: { adult: 100, child: 50, freeAge: 0 } },
    { name: 'Hot Springs Bath Experience', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 250, child: 150, freeAge: 3 } },
    { name: 'Quad Biking Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 0 } },
  ],
  'Umhlanga Beachfront Accommodation': [
    { name: 'Gateway Theatre of Dreams Shopping Mall', image: 'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Umhlanga Rocks Main Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'The Oceans Mall Visit', image: 'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'uShaka Marine World Full Combo', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Point Waterfront Luxury Canal Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Boat Cruise Durban Harbour', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 200, child: 150, freeAge: 0 } },
    { name: 'Ballito Beach Trip', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 150, child: 100, freeAge: 0 } },
    { name: 'Romantic Dinner Date', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 650, child: 0, freeAge: 0 } },
    { name: 'Romantic Room Decor', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 450, child: 0, freeAge: 0 } },
    { name: 'Gondola Boat Canal Cruise with Picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 750, child: 550, freeAge: 0 } },
    { name: 'Shuttle Transport', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 200, child: 150, freeAge: 0 } },
  ],
  'Knysna Garden Route': [
    { name: 'Knysna Wine and Oyster Luxury Lounger Sunset Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 650, child: 450, freeAge: 4 } },
    { name: 'Knysna Forest Guided Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 550, child: 400, freeAge: 0 } },
    { name: 'Knysna Lagoon Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Knysna Elephant Park', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Featherbed Nature Reserve', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 320, freeAge: 4 } },
    { name: 'Monkey Land Primate Sanctuary', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 280, child: 180, freeAge: 3 } },
    { name: 'Birds of Eden Free Flight Sanctuary', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 280, child: 180, freeAge: 3 } },
    { name: 'Tsitsikamma Storms River Bridge Walk', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
  ],
  'Vaal River Getaways': [
    { name: 'Aquadome Pools and Waterpark Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 380, child: 280, freeAge: 6 } },
    { name: 'Animal World Visit', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: '2 Hour Sunday Lunch Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 550, child: 380, freeAge: 6 } },
    { name: '1 Hour Leisure Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 250, child: 180, freeAge: 4 } },
    { name: 'Sunday Lunch Buffet and Carvery', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: 'Emerald Casino Resort Entry', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Pretoria Getaways': [
    { name: 'Union Buildings Tour', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Voortrekker Monument', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 120, child: 80, freeAge: 4 } },
    { name: 'National Zoological Gardens', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Freedom Park', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 80, child: 50, freeAge: 4 } },
    { name: 'Rietvlei Nature Reserve Game Drive', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 350, child: 250, freeAge: 6 } },
    { name: 'Ann van Dyk Cheetah Centre', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Cullinan Diamond Mine Tour', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Irene Dairy Farm Visit', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
  ],
  'Bali Adventure': [
    { name: 'Sacred Monkey Forest Sanctuary', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Tegalalang Rice Terraces with Swing', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 200, child: 150, freeAge: 4 } },
    { name: 'Tirta Empul Holy Water Temple', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 80, child: 50, freeAge: 4 } },
    { name: 'Coffee Plantation Visit with Tastings', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 120, child: 0, freeAge: 0 } },
    { name: 'Traditional Balinese Dance Performance', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 180, child: 120, freeAge: 4 } },
    { name: 'Quad Biking ATV Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 350, child: 280, freeAge: 0 } },
    { name: 'Balinese Waterfall Visit', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 100, child: 70, freeAge: 4 } },
    { name: 'Sunset Cruise with Dinner', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 650, child: 450, freeAge: 4 } },
    { name: 'Besakih Temple Entrance', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 80, child: 50, freeAge: 4 } },
    { name: 'Ubud Art Market Shopping', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Dubai Luxury': [
    { name: 'Burj Khalifa Entry (Levels 124-125)', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 450, child: 350, freeAge: 4 } },
    { name: 'Dubai Mega Yacht Cruise with Buffet Dinner', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 850, child: 650, freeAge: 4 } },
    { name: 'Museum of the Future Entry', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 380, child: 280, freeAge: 4 } },
    { name: 'Speedboat Tour of Dubai Marina', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 450, child: 350, freeAge: 4 } },
    { name: 'Sky Views Observatory Entry', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Dubai Desert Safari with Quad Bikes', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 650, child: 500, freeAge: 6 } },
    { name: 'Al Khayma Desert Camp Experience', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 550, child: 400, freeAge: 4 } },
    { name: 'Dubai Mall and Aquarium', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Palm Jumeirah Monorail Ride', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 80, child: 50, freeAge: 4 } },
  ],
  'Thailand Adventure': [
    { name: 'James Bond Island Day Tour by Speedboat', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 850, child: 650, freeAge: 4 } },
    { name: 'Phuket Guided City Tour', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Yona Floating Beach Club Full Day', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Phi Phi, Maya Bay and Khai Island by Speedboat', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 950, child: 750, freeAge: 4 } },
    { name: 'Elephant Jungle Sanctuary Experience', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 650, child: 500, freeAge: 6 } },
    { name: 'Phuket Andamanda Water Park Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 380, child: 280, freeAge: 4 } },
    { name: 'Quad Biking with Big Buddha View', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 0 } },
    { name: 'Thai Cooking Class', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 350, child: 250, freeAge: 6 } },
    { name: 'Traditional Thai Massage 1 Hour', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 280, child: 0, freeAge: 0 } },
  ],
};

const BuildPackage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form state
  const [destination, setDestination] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);
  const [kidAges, setKidAges] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  const destinations = Object.keys(hotels);

  // Calculate total nights
  const calculateTotalNights = (checkInDate: string, checkOutDate: string) => {
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const timeDifference = date2.getTime() - date1.getTime();
    return Math.max(1, Math.round(timeDifference / (1000 * 3600 * 24)));
  };

  // Handle activity selection
  const handleActivitySelect = (activityName: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityName)
        ? prev.filter(a => a !== activityName)
        : [...prev, activityName]
    );
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      return;
    }
    setShowSummary(true);
  };

  // Handle kids change
  const handleKidsChange = (numKids: number) => {
    setKids(numKids);
    if (numKids === 0) {
      setKidAges([]);
    } else {
      setKidAges(Array(numKids).fill(5));
    }
  };

  // Handle kid age change
  const handleKidAgeChange = (index: number, age: number) => {
    const newKidAges = [...kidAges];
    newKidAges[index] = age;
    setKidAges(newKidAges);
  };

  // Calculate activity cost
  const calculateActivityCost = (activity: Activity) => {
    if (!activity || !activity.rates) return 0;
    const rates = activity.rates;
    let adultCost = 0;
    let childCost = 0;

    if (rates.childAgeRange) {
      adultCost = rates.adult * (adults + kidAges.filter(age => age >= rates.childAgeRange!.max).length);
      childCost = rates.child * kidAges.filter(age => age >= rates.childAgeRange!.min && age <= rates.childAgeRange!.max).length;
    } else {
      adultCost = rates.adult * adults;
      childCost = rates.child * kidAges.filter(age => age > rates.freeAge).length;
    }

    return adultCost + childCost;
  };

  // Calculate additional service fee per adult
  const calculateAdditionalFee = (numAdults: number) => {
    if (numAdults === 1) return 900;
    if (numAdults >= 2 && numAdults <= 4) return 700;
    if (numAdults >= 5 && numAdults <= 10) return 600;
    if (numAdults > 10) return 550;
    return 0;
  };

  // Calculate total cost
  const calculateTotalCost = (hotel: Hotel | undefined) => {
    if (!hotel || !checkIn || !checkOut) return 0;

    const totalNights = calculateTotalNights(checkIn, checkOut);
    const accommodationCost = hotel.nightlyRate * totalNights * rooms;
    const costPerAdult = adults > 0 ? accommodationCost / adults : 0;
    const additionalFeePerAdult = calculateAdditionalFee(adults);

    const activities = activitiesByDestination[destination] || [];
    const totalActivityCost = selectedActivities.reduce((acc, activityName) => {
      const activity = activities.find(a => a.name === activityName);
      return acc + (activity ? calculateActivityCost(activity) : 0);
    }, 0);

    const totalPackageCostPerAdult = costPerAdult + additionalFeePerAdult + totalActivityCost / adults;
    const feePerChild = 250;

    const totalPackageCostsPerChild = kidAges.reduce((acc, age) => {
      const childActivityCost = selectedActivities.reduce((actAcc, activityName) => {
        const activity = activities.find(a => a.name === activityName);
        if (!activity) return actAcc;
        if (age >= 12) {
          return actAcc + activity.rates.adult;
        } else {
          return actAcc + activity.rates.child;
        }
      }, 0);
      return acc + childActivityCost + feePerChild;
    }, 0);

    return (totalPackageCostPerAdult * adults) + totalPackageCostsPerChild;
  };

  // Handle image carousel
  const handleImageChange = (hotelName: string, direction: 'next' | 'prev') => {
    setCurrentImageIndex(prevIndex => {
      const newIndex = { ...prevIndex };
      const hotel = hotels[destination]?.find(h => h.name === hotelName);
      const imageCount = hotel ? hotel.images.length : 0;
      const currentIdx = newIndex[hotelName] || 0;

      if (direction === 'next') {
        newIndex[hotelName] = (currentIdx + 1) % imageCount;
      } else {
        newIndex[hotelName] = (currentIdx - 1 + imageCount) % imageCount;
      }
      return newIndex;
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const currentActivities = activitiesByDestination[destination] || [];
  const currentHotels = hotels[destination] || [];
  const displayHotels = selectedHotel === 'all' ? currentHotels : currentHotels.filter(h => h.name === selectedHotel);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Build Your Dream Package</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Create Your Own
              <span className="block text-primary">Custom Getaway</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your accommodation, pick your activities, and build the perfect package according to your budget and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!showSummary ? (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Search for Accommodations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Destination */}
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Select
                      value={destination}
                      onValueChange={(value) => {
                        setDestination(value);
                        setSelectedActivities([]);
                        setSelectedHotel('');
                        setShowSummary(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {destinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>
                            {dest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Hotel Selection */}
                  {destination && (
                    <div className="space-y-2">
                      <Label>Hotel</Label>
                      <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Hotel" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="all">Show All Hotels</SelectItem>
                          {currentHotels.map((hotel) => (
                            <SelectItem key={hotel.id} value={hotel.name}>
                              {hotel.name} - R{hotel.nightlyRate}/night
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check-in Date</Label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={today}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Check-out Date</Label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || today}
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Adults</Label>
                      <Select value={adults.toString()} onValueChange={(v) => setAdults(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rooms</Label>
                      <Select value={rooms.toString()} onValueChange={(v) => setRooms(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Children</Label>
                      <Select value={kids.toString()} onValueChange={(v) => handleKidsChange(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 20 }, (_, i) => i).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Children Ages */}
                  {kids > 0 && kids < 20 && (
                    <div className="space-y-2">
                      <Label>Children Ages</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {kidAges.map((age, index) => (
                          <div key={index} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Child {index + 1}</Label>
                            <Select
                              value={age.toString()}
                              onValueChange={(v) => handleKidAgeChange(index, Number(v))}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                {Array.from({ length: 18 }, (_, i) => i).map((a) => (
                                  <SelectItem key={a} value={a.toString()}>
                                    {a} years
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!destination || !checkIn || !checkOut}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Accommodations
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setShowSummary(false)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>

              {/* Destination Title */}
              <h2 className="text-2xl font-bold">{destination}</h2>

              {/* Hotels Display */}
              {displayHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Hotel Info */}
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-primary">{hotel.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="font-medium">Check-in:</span> {checkIn}</p>
                          <p><span className="font-medium">Check-out:</span> {checkOut}</p>
                          <p><span className="font-medium">Room Type:</span> {hotel.roomType}</p>
                          <p><span className="font-medium">Guests:</span> {hotel.guests}</p>
                          <p><span className="font-medium">Amenities:</span> {hotel.amenities}</p>
                          <p><span className="font-medium">Nightly Rate:</span> {formatCurrency(hotel.nightlyRate)}</p>
                          <p><span className="font-medium">Nights:</span> {calculateTotalNights(checkIn, checkOut)}</p>
                          <p><span className="font-medium">Rooms:</span> {rooms}</p>
                        </div>
                      </div>

                      {/* Image Carousel */}
                      <div className="w-full lg:w-72 h-48 relative rounded-lg overflow-hidden bg-muted">
                        {hotel.images.length > 0 && (
                          <>
                            <img
                              src={hotel.images[currentImageIndex[hotel.name] || 0]}
                              alt={hotel.name}
                              className="w-full h-full object-cover"
                            />
                            {hotel.images.length > 1 && (
                              <>
                                <button
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                  onClick={() => handleImageChange(hotel.name, 'prev')}
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                  onClick={() => handleImageChange(hotel.name, 'next')}
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mt-8">
                      <h4 className="text-lg font-bold mb-4">
                        Add fun activities to make it a complete getaway package
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {currentActivities.map((activity) => (
                          <div
                            key={activity.name}
                            className="text-center cursor-pointer group"
                            onClick={() => handleActivitySelect(activity.name)}
                          >
                            <div
                              className={cn(
                                "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                selectedActivities.includes(activity.name)
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-transparent hover:border-muted-foreground/30"
                              )}
                            >
                              <img
                                src={activity.image}
                                alt={activity.name}
                                className="w-full h-full object-cover"
                              />
                              {selectedActivities.includes(activity.name) && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <Check className="w-8 h-8 text-primary bg-white rounded-full p-1" />
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm font-medium py-2 px-1 leading-tight text-center">
                                {activity.name.length > 40 ? activity.name.substring(0, 40) + '...' : activity.name}
                              </div>
                            </div>
                            <p className="text-xs mt-1 text-muted-foreground">
                              {formatCurrency(activity.rates.adult)}/adult
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Activities */}
                    {selectedActivities.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-bold mb-2">Selected Activities:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {selectedActivities.map((activity) => (
                            <li key={activity}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pricing Summary */}
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-semibold">
                          Total Package Price Per Adult: {formatCurrency(calculateTotalCost(hotel) / adults)}
                        </p>
                        <div className="mt-2 text-right">
                          <p className="text-xl font-bold text-primary">
                            Grand total for {adults} adult{adults > 1 ? 's' : ''}{kids > 0 ? ` and ${kids} kid${kids > 1 ? 's' : ''}` : ''}:
                          </p>
                          <p className="text-3xl font-bold text-destructive">
                            {formatCurrency(calculateTotalCost(hotel))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildPackage;

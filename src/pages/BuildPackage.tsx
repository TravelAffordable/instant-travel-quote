import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, Search, Sparkles, Building2, Loader2, Plus, Star, Coffee } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useHotelbedsSearch, LiveHotel } from '@/hooks/useHotelbedsSearch';
import { CustomHotelCard, CustomHotelDetails } from '@/components/CustomHotelCard';

// Import image for Sun City activity
import sunCityImage from '@/assets/sun-city.jpeg';

interface Activity {
  name: string;
  image: string;
  rates: {
    adult: number;
    child: number;
    freeAge: number;
    childAgeRange?: { min: number; max: number };
  };
  isComboEntry?: boolean;
  isShuttle?: boolean;
  shuttleBaseCost?: number;
}

// Destination codes for hotelbeds search
const destinationCodes: Record<string, string> = {
  'Durban Beachfront': 'DUR',
  'Cape Town': 'CPT',
  'Johannesburg': 'JNB',
  'Sun City': 'SUN',
  'Pretoria': 'PRY',
  'Knysna': 'GRJ',
  'Umhlanga': 'DUR',
  'Bela Bela': 'PRY',
  'Hartbeespoort': 'JNB',
  'Mpumalanga': 'MQP',
  'Magalies': 'JNB',
  'Vaal River': 'JNB',
};

// Destinations list
const destinations = [
  'Durban Beachfront',
  'Cape Town',
  'Johannesburg',
  'Sun City',
  'Pretoria',
  'Knysna',
  'Umhlanga',
  'Bela Bela',
  'Hartbeespoort',
  'Mpumalanga',
  'Magalies',
  'Vaal River',
];

// Activities organized by destination
const activitiesByDestination: Record<string, Activity[]> = {
  'Durban Beachfront': [
    { name: 'uShaka Marine World Full Combo', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Point Waterfront Luxury Canal Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Boat Cruise Durban Harbour', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 200, child: 150, freeAge: 0 } },
    { name: 'Ricksha Bus City Tour', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Segway Gliding Tour on the Promenade', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 0 } },
    { name: 'Skycar Cable Car Ride', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 120, child: 80, freeAge: 0 } },
    { name: 'Mini Town Visit', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 60, child: 40, freeAge: 0 } },
    { name: 'Mitchell Park Zoo', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 50, child: 30, freeAge: 3 } },
    { name: 'Suncoast Casino Entertainment', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Surf Lessons', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 350, child: 280, freeAge: 0 } },
    { name: 'Romantic Dinner Date', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 650, child: 0, freeAge: 0 } },
    { name: 'Romantic Room Decor', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 450, child: 0, freeAge: 0 } },
    { name: 'Gondola Boat Canal Cruise with Picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 750, child: 550, freeAge: 0 } },
    { name: 'Shuttle Transport', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 200, child: 150, freeAge: 0 } },
  ],
  'Cape Town': [
    { name: 'Table Mountain Cable Car', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 450, child: 250, freeAge: 4 } },
    { name: 'Robben Island Tour', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 600, child: 350, freeAge: 4 } },
    { name: 'Two Oceans Aquarium', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 280, child: 180, freeAge: 4 } },
    { name: 'Cape Point Tour', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 380, child: 280, freeAge: 4 } },
    { name: 'V&A Waterfront Visit', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Wine Tasting Tour', image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=100', rates: { adult: 650, child: 0, freeAge: 0 } },
    { name: 'Shark Cage Diving', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 2500, child: 2500, freeAge: 0 } },
    { name: 'Penguin Colony Visit (Boulders Beach)', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 180, child: 100, freeAge: 4 } },
  ],
  'Johannesburg': [
    { name: 'Apartheid Museum', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 150, child: 80, freeAge: 4 } },
    { name: 'Gold Reef City Theme Park', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 350, child: 280, freeAge: 3 } },
    { name: 'Soweto Tour', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 450, child: 300, freeAge: 4 } },
    { name: 'Lion Park Safari', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 380, child: 280, freeAge: 3 } },
    { name: 'Cradle of Humankind', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 280, child: 180, freeAge: 4 } },
    { name: 'Sandton City Shopping', image: 'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Hartbeespoort': [
    { name: 'Hartbeespoort Cableway', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 360, child: 220, freeAge: 3 } },
    { name: 'Boat Cruise on the Dam', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 250, child: 150, freeAge: 4 } },
    { name: 'Elephant Sanctuary Visit', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Ann van Dyk Cheetah Centre', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Quad Biking Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 0 } },
    { name: 'Chameleon Village Markets', image: 'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Mpumalanga': [
    { name: 'Kruger National Park Safari', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 850, child: 600, freeAge: 6 } },
    { name: 'Panorama Route Tour', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 550, child: 380, freeAge: 4 } },
    { name: 'Blyde River Canyon Tour', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 450, child: 300, freeAge: 0 } },
    { name: "God's Window Viewpoint", image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 50, child: 30, freeAge: 0 } },
  ],
  'Magalies': [
    { name: 'Maropeng Cradle of Mankind Origins Centre', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 350, child: 200, freeAge: 4 } },
    { name: 'Wonder Caves Tour', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 280, child: 180, freeAge: 4 } },
    { name: 'Guided Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 450, child: 300, freeAge: 6 } },
    { name: 'Rhino and Lion Park Entry', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 380, child: 250, freeAge: 4 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100', rates: { adult: 350, child: 350, freeAge: 0 } },
  ],
  'Sun City': [
    { name: 'Sun City and Valley of the Waves Entrance', image: sunCityImage, rates: { adult: 550, child: 400, freeAge: 2, childAgeRange: { min: 2, max: 16 } }, isComboEntry: true },
    { name: 'Pilanesberg Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Lunch Inside Sun City', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Shuttle to Sun City from Guesthouse', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 0, child: 0, freeAge: 0 }, isShuttle: true, shuttleBaseCost: 800 },
    { name: 'Sun City Golf Course', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100', rates: { adult: 1200, child: 0, freeAge: 0 } },
    { name: 'Zip Slide Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 8 } },
    { name: '1 Hour Quad Biking Fun in Harties', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 450, freeAge: 10, childAgeRange: { min: 10, max: 17 } } },
    { name: '1 Hour Horse Riding Experience in Harties', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100', rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: 'Harties Cableway', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 360, child: 220, freeAge: 3 } },
    { name: 'Breakfast Sun City Area Guesthouse A', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100', rates: { adult: 150, child: 75, freeAge: 0, childAgeRange: { min: 0, max: 5 } } },
  ],
  'Bela Bela': [
    { name: 'Forever Resorts Waterpark Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Warm Swimming Pools Access', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Guided Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 320, freeAge: 6 } },
    { name: 'Elephant Tour and Experience', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Hot Springs Bath Experience', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 250, child: 150, freeAge: 3 } },
  ],
  'Umhlanga': [
    { name: 'Gateway Theatre of Dreams Shopping Mall', image: 'https://images.unsplash.com/photo-1519567770579-c2fc5436bcf9?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Umhlanga Rocks Main Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'uShaka Marine World Full Combo', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Point Waterfront Luxury Canal Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Romantic Dinner Date', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 650, child: 0, freeAge: 0 } },
  ],
  'Knysna': [
    { name: 'Knysna Wine and Oyster Luxury Lounger Sunset Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 650, child: 450, freeAge: 4 } },
    { name: 'Knysna Forest Guided Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 550, child: 400, freeAge: 0 } },
    { name: 'Knysna Lagoon Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Knysna Elephant Park', image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=100', rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Featherbed Nature Reserve', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 320, freeAge: 4 } },
    { name: 'Monkey Land Primate Sanctuary', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 280, child: 180, freeAge: 3 } },
  ],
  'Vaal River': [
    { name: 'Aquadome Pools and Waterpark Entry', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 380, child: 280, freeAge: 6 } },
    { name: '2 Hour Sunday Lunch Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 550, child: 380, freeAge: 6 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: 'Emerald Casino Resort Entry', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Pretoria': [
    { name: 'Union Buildings Tour', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Voortrekker Monument', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 120, child: 80, freeAge: 4 } },
    { name: 'National Zoological Gardens', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Rietvlei Nature Reserve Game Drive', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 350, child: 250, freeAge: 6 } },
    { name: 'Ann van Dyk Cheetah Centre', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Cullinan Diamond Mine Tour', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=100', rates: { adult: 450, child: 350, freeAge: 6 } },
  ],
};

// Selected hotel for package building
interface SelectedAccommodation {
  type: 'hotelbeds' | 'custom';
  hotel?: LiveHotel;
  customDetails?: CustomHotelDetails;
  totalCost: number;
}

const BuildPackage = () => {
  const navigate = useNavigate();
  const { searchHotels, hotels: liveHotels, isLoading, error } = useHotelbedsSearch();

  // Form state
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);
  const [kidAges, setKidAges] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState<SelectedAccommodation | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHotelName, setCustomHotelName] = useState('');

  // Calculate total nights
  const calculateTotalNights = (checkInDate: string, checkOutDate: string) => {
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const timeDifference = date2.getTime() - date1.getTime();
    return Math.max(1, Math.round(timeDifference / (1000 * 3600 * 24)));
  };

  const totalNights = checkIn && checkOut ? calculateTotalNights(checkIn, checkOut) : 1;

  // Handle activity selection
  const handleActivitySelect = (activityName: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityName)
        ? prev.filter(a => a !== activityName)
        : [...prev, activityName]
    );
  };

  // Handle form submit - search for hotels
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !checkIn || !checkOut) return;

    const destCode = destinationCodes[destination] || 'DUR';
    
    await searchHotels({
      destination: destCode,
      checkIn,
      checkOut,
      adults,
      children: kids,
      childrenAges: kidAges,
      rooms,
    });

    setShowResults(true);
    setSelectedAccommodation(null);
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

  // Select hotelbeds hotel
  const handleSelectHotel = (hotel: LiveHotel) => {
    setSelectedAccommodation({
      type: 'hotelbeds',
      hotel,
      totalCost: hotel.minRate * totalNights,
    });
    setShowCustomInput(false);
  };

  // Handle custom hotel calculation
  const handleCustomCalculate = (details: CustomHotelDetails) => {
    setSelectedAccommodation({
      type: 'custom',
      customDetails: details,
      totalCost: details.totalCost,
    });
  };

  // Calculate shuttle cost per adult based on number of adults
  const calculateShuttleCostPerAdult = (numAdults: number) => {
    if (numAdults <= 1) return 800;
    if (numAdults === 2) return 400;
    if (numAdults === 3) return 270;
    if (numAdults === 4) return 200;
    return 150;
  };

  // Calculate activity cost for ADULTS only
  const calculateAdultActivityCost = (activity: Activity) => {
    if (!activity || !activity.rates) return 0;

    if (activity.isShuttle && activity.shuttleBaseCost) {
      const shuttleCostPerAdult = calculateShuttleCostPerAdult(adults);
      return shuttleCostPerAdult * adults;
    }

    return activity.rates.adult * adults;
  };

  const calculateChildActivityCost = (activity: Activity, age: number) => {
    if (!activity || !activity.rates) return 0;

    const rates = activity.rates;

    if (age <= rates.freeAge) return 0;

    if (rates.childAgeRange) {
      if (age >= rates.childAgeRange.min && age <= rates.childAgeRange.max) return rates.child;
      return rates.adult;
    }

    return rates.child;
  };

  // Calculate additional service fee per adult
  const calculateAdditionalFee = (numAdults: number) => {
    if (numAdults === 1) return 1000;
    if (numAdults >= 2 && numAdults <= 3) return 850;
    if (numAdults >= 4 && numAdults <= 10) return 800;
    if (numAdults > 10) return 750;
    return 0;
  };

  // Calculate fee per child
  const calculateChildFee = (numAdults: number) => {
    return numAdults >= 2 ? 150 : 300;
  };

  // Calculate total package cost
  const calculateTotalCost = () => {
    if (!selectedAccommodation) return 0;

    const accommodationCost = selectedAccommodation.totalCost;
    const additionalFeePerAdult = calculateAdditionalFee(adults);

    const activities = activitiesByDestination[destination] || [];

    const totalAdultActivityCost = selectedActivities.reduce((acc, activityName) => {
      const activity = activities.find(a => a.name === activityName);
      return acc + (activity ? calculateAdultActivityCost(activity) : 0);
    }, 0);

    const feePerChild = calculateChildFee(adults);

    const totalPackageCostsPerChild = kidAges.reduce((acc, age) => {
      if (age < 4 || age > 16) return acc;

      const childActivityCost = selectedActivities.reduce((actAcc, activityName) => {
        const activity = activities.find(a => a.name === activityName);
        return actAcc + (activity ? calculateChildActivityCost(activity, age) : 0);
      }, 0);

      return acc + childActivityCost + feePerChild;
    }, 0);

    return accommodationCost + (additionalFeePerAdult * adults) + totalAdultActivityCost + totalPackageCostsPerChild;
  };

  const today = new Date().toISOString().split('T')[0];
  const currentActivities = activitiesByDestination[destination] || [];

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
              Search for live hotel availability or add your own custom accommodation, then pick activities to build your perfect package.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!showResults ? (
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
                    disabled={!destination || !checkIn || !checkOut || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Searching Hotels...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search Accommodations
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setSelectedAccommodation(null);
                }}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>

              {/* Destination Title */}
              <div>
                <h2 className="text-2xl font-bold">{destination}</h2>
                <p className="text-muted-foreground">
                  {checkIn} to {checkOut} • {totalNights} night{totalNights > 1 ? 's' : ''} • {adults} adult{adults > 1 ? 's' : ''}{kids > 0 ? ` • ${kids} child${kids > 1 ? 'ren' : ''}` : ''}
                </p>
              </div>

              {/* Accommodation Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Step 1: Select Your Accommodation</h3>
                
                {/* Error message */}
                {error && (
                  <Card className="border-destructive bg-destructive/10">
                    <CardContent className="py-4">
                      <p className="text-destructive">{error}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Live Hotels from Hotelbeds */}
                {liveHotels.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-muted-foreground">Available Hotels</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {liveHotels.slice(0, 6).map((hotel) => (
                        <Card 
                          key={hotel.code}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedAccommodation?.type === 'hotelbeds' && selectedAccommodation.hotel?.code === hotel.code
                              ? "ring-2 ring-primary border-primary"
                              : ""
                          )}
                          onClick={() => handleSelectHotel(hotel)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-24 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                {hotel.image ? (
                                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{hotel.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array.from({ length: hotel.stars }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-1">{hotel.address}</p>
                                <p className="text-lg font-bold text-primary mt-2">
                                  {formatCurrency(hotel.minRate * totalNights)}
                                  <span className="text-xs font-normal text-muted-foreground ml-1">total</span>
                                </p>
                              </div>
                              {selectedAccommodation?.type === 'hotelbeds' && selectedAccommodation.hotel?.code === hotel.code && (
                                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Hotels Found */}
                {liveHotels.length === 0 && !isLoading && !error && (
                  <Card className="bg-muted/50">
                    <CardContent className="py-8 text-center">
                      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="font-semibold mb-2">No Hotels Found</h4>
                      <p className="text-muted-foreground text-sm">
                        No hotels available for this destination and dates. You can add custom accommodation below.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Custom Accommodation Section */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-muted-foreground">Or Add Custom Accommodation</h4>
                    {!showCustomInput && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomInput(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Custom
                      </Button>
                    )}
                  </div>

                  {showCustomInput && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Hotel Name</Label>
                        <Input
                          placeholder="Enter hotel name"
                          value={customHotelName}
                          onChange={(e) => setCustomHotelName(e.target.value)}
                        />
                      </div>
                      {customHotelName && (
                        <CustomHotelCard
                          hotelName={customHotelName}
                          rooms={rooms}
                          adults={adults}
                          children={kids}
                          nights={totalNights}
                          onCalculate={handleCustomCalculate}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomHotelName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Show selected custom accommodation */}
                  {selectedAccommodation?.type === 'custom' && selectedAccommodation.customDetails && (
                    <Card className="ring-2 ring-primary border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{selectedAccommodation.customDetails.hotelName}</h4>
                            {selectedAccommodation.customDetails.roomType && (
                              <p className="text-sm text-muted-foreground">{selectedAccommodation.customDetails.roomType}</p>
                            )}
                            {selectedAccommodation.customDetails.mealPlan && (
                              <p className="text-sm text-green-600 flex items-center gap-1">
                                <Coffee className="w-3 h-3" /> {selectedAccommodation.customDetails.mealPlan}
                              </p>
                            )}
                            <p className="text-lg font-bold text-primary mt-2">
                              {formatCurrency(selectedAccommodation.totalCost)}
                            </p>
                          </div>
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Activities Section - Only show if accommodation is selected */}
              {selectedAccommodation && currentActivities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Step 2: Add Activities (Optional)</h3>
                  <p className="text-muted-foreground">Select activities to include in your package</p>
                  
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
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs font-medium py-1 px-1 leading-tight text-center">
                            {activity.name.length > 30 ? activity.name.substring(0, 30) + '...' : activity.name}
                          </div>
                        </div>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {formatCurrency(activity.rates.adult)}/adult
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Selected Activities */}
                  {selectedActivities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Selected Activities:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {selectedActivities.map((activity) => (
                          <li key={activity}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Summary */}
              {selectedAccommodation && (
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Package Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Accommodation Cost:</span>
                        <span className="font-semibold">{formatCurrency(selectedAccommodation.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Fee ({adults} adult{adults > 1 ? 's' : ''}):</span>
                        <span className="font-semibold">{formatCurrency(calculateAdditionalFee(adults) * adults)}</span>
                      </div>
                      {selectedActivities.length > 0 && (
                        <div className="flex justify-between">
                          <span>Activities ({selectedActivities.length} selected):</span>
                          <span className="font-semibold">Included in total</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Grand Total:</span>
                          <span className="text-2xl font-bold text-primary">{formatCurrency(calculateTotalCost())}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-right mt-1">
                          {formatCurrency(calculateTotalCost() / adults)} per adult
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildPackage;

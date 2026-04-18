import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Sparkles, MapPin, Star, Calculator, ChevronDown, Hotel, PartyPopper, FileText, Bus, Puzzle, GraduationCap, MessageCircle, Check } from 'lucide-react';
import { getPackageImage } from '@/data/packageImages';

// Genie destination images
import vaalRiverImg from '@/assets/destinations/vaal-river.jpg';
import umhlangaImg from '@/assets/destinations/umhlanga.jpg';
import knysnaImg from '@/assets/destinations/knysna.jpg';
import hartiesImg from '@/assets/destinations/hartbeespoort.jpg';
import magaliesImg from '@/assets/destinations/magaliesberg.jpg';
import durbanImg from '@/assets/destinations/durban.jpg';
import mpumalangaImg from '@/assets/destinations/mpumalanga.jpg';
import sunCityImg from '@/assets/destinations/sun-city.jpg';
import capeTownImg from '@/assets/destinations/cape-town.jpg';
import pretoriaImg from '@/assets/destinations/pretoria.jpg';
import thailandImg from '@/assets/destinations/thailand.jpg';
import dubaiImg from '@/assets/destinations/dubai.jpg';
import baliImg from '@/assets/destinations/bali.jpg';
import { calculateChildServiceFees as calculateChildServiceFeesUtil } from '@/lib/childServiceFees';
import {
  destinations,
  packages,
  hotels,
  calculateAllQuotes,
  getPackagesByDestination,
  type QuoteResult,
  type Package,
} from '@/data/travelData';
import { QuoteList } from './QuoteList';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRMSHotels, type RMSHotel } from '@/hooks/useRMSHotels';
import { getPremiumLiveHotelKeyByName } from '@/lib/premiumLiveHotels';
import { calculatePackageBaseCost } from '@/lib/packagePricing';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

type BookingType = 'accommodation-only' | 'with-activities';

// Destinations that should use the RMS (database) hotel list instead of static placeholders
// Note: UI destination id for Vaal is `vaal-river`, while backend destination code is `vaal`.
// Note: UI uses `umhlanga` as a separate destination, but it maps to `durban` destination with area filter.
const RMS_DESTINATIONS = ['harties', 'magalies', 'durban', 'umhlanga', 'cape-town', 'sun-city', 'mpumalanga', 'vaal', 'vaal-river', 'bela-bela'];

// Mpumalanga package IDs that require Graskop-only hotels (near Blyde River Canyon)
const GRASKOP_ONLY_PACKAGES = ['mp1']; // MP1 - In Style Getaway with Blyde River Canyon

type AccommodationPricingMode = 'catalog_markup' | 'live_booking_total';
type LiveBookingHotelKey = 'blue-waters' | 'garden-court-south-beach' | 'the-edward';
type AccommodationPricingHotel = RMSHotel & { pricingMode?: AccommodationPricingMode };

type LiveBookingRateResponse = {
  available: boolean;
  displayNightlyRate: number | null;
  displayTotalPrice: number | null;
};

type GenericLiveRateResponse = {
  rates?: Array<{
    name: string;
    nightlyRate: number | null;
    totalRate: number | null;
  }>;
};

async function applyLiveRatesForSelectedDates(
  hotels: RMSHotel[],
  params: { checkIn: string; checkOut: string; rooms: number },
): Promise<AccommodationPricingHotel[]> {
  if (hotels.length === 0) return [];

  const premiumConfiguredHotels = hotels.filter((hotel) => getPremiumLiveHotelKeyByName(hotel.name));
  const genericHotels = hotels.filter((hotel) => !getPremiumLiveHotelKeyByName(hotel.name));

  const [premiumResults, genericResponse] = await Promise.all([
    Promise.all(
      premiumConfiguredHotels.map(async (hotel) => {
        const hotelKey = getPremiumLiveHotelKeyByName(hotel.name);
        const occupancy = hotel.capacity === '4_sleeper' ? '4_sleeper' : '2_sleeper';
        const { data, error } = await supabase.functions.invoke('booking-live-rate', {
          body: {
            hotelKey,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            occupancy,
            rooms: params.rooms,
          },
        });

        if (error) {
          console.error(`booking-live-rate failed for ${hotel.name}:`, error.message);
          return {
            ...hotel,
            pricingMode: hotel.isCachedRate ? 'live_booking_total' as AccommodationPricingMode : undefined,
          } satisfies AccommodationPricingHotel;
        }

        const liveRate = data as LiveBookingRateResponse | null;
        if (!liveRate?.available || liveRate.displayTotalPrice === null) {
          return null;
        }

        return {
          ...hotel,
          minRate: liveRate.displayNightlyRate ?? hotel.minRate,
          totalRate: liveRate.displayTotalPrice,
          pricingMode: 'live_booking_total',
        } satisfies AccommodationPricingHotel;
      }),
    ),
    genericHotels.length > 0
      ? supabase.functions.invoke('hotel-live-rates', {
          body: {
            destination: hotels[0].destination,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            rooms: params.rooms,
            hotels: genericHotels.map((hotel) => ({
              name: hotel.name,
              capacity: hotel.capacity,
              tier: hotel.tier,
            })),
          },
        })
      : Promise.resolve({ data: { rates: [] }, error: null }),
  ]);

  if (genericResponse.error) {
    console.error('hotel-live-rates failed:', genericResponse.error.message);
  }

  const genericLiveRates = ((genericResponse.data as GenericLiveRateResponse | null)?.rates ?? []).reduce(
    (map, entry) => map.set(entry.name.toLowerCase(), entry),
    new Map<string, { name: string; nightlyRate: number | null; totalRate: number | null }>(),
  );

  const genericResults = genericHotels.map((hotel) => {
    const liveRate = genericLiveRates.get(hotel.name.toLowerCase());
    if (!liveRate?.totalRate || !liveRate.nightlyRate) {
      return {
        ...hotel,
        pricingMode: hotel.isCachedRate ? 'live_booking_total' as AccommodationPricingMode : undefined,
      } satisfies AccommodationPricingHotel;
    }

    return {
      ...hotel,
      minRate: liveRate.nightlyRate,
      totalRate: liveRate.totalRate,
      pricingMode: 'live_booking_total',
    } satisfies AccommodationPricingHotel;
  });

  return [...premiumResults.filter(Boolean), ...genericResults] as AccommodationPricingHotel[];
}

// Service fee calculation
function calculateServiceFees(adults: number, childrenAges: number[]): number {
  let adultFee = 0;
  if (adults === 1) adultFee = 1000;
  else if (adults <= 3) adultFee = 850;
  else if (adults <= 9) adultFee = 800;
  else adultFee = 750;

  const totalAdultFees = adultFee * adults;

  const childFees = calculateChildServiceFeesUtil(adults, childrenAges);

  return totalAdultFees + childFees;
}

function getPackageFromPrice(pkg: Package): number {
  const cheapestBudgetHotel = hotels
    .filter((hotel) => hotel.destination === pkg.destination && hotel.type === 'very-affordable')
    .sort((a, b) => {
      const aPriority = a.capacity === 2 ? 0 : 1;
      const bPriority = b.capacity === 2 ? 0 : 1;

      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.pricePerNight - b.pricePerNight;
    })[0];

  const stayNights = Number.parseInt(pkg.duration, 10) || 2;

  if (!cheapestBudgetHotel) {
    return roundToNearest10(pkg.basePrice);
  }

  const accommodationPerPerson = (cheapestBudgetHotel.pricePerNight * stayNights) / 2;
  return roundToNearest10(pkg.basePrice + accommodationPerPerson);
}

function sortQuotesForBudgetDisplay(quotes: QuoteResult[], budgetAmount: number): QuoteResult[] {
  const sortedAscending = [...quotes].sort((a, b) => a.totalForGroup - b.totalForGroup);

  if (budgetAmount <= 0) {
    return sortedAscending;
  }

  const firstAtOrAboveBudgetIndex = sortedAscending.findIndex(
    (quote) => quote.totalForGroup >= budgetAmount,
  );

  if (firstAtOrAboveBudgetIndex === -1) {
    return sortedAscending.reverse();
  }

  return sortedAscending.slice(firstAtOrAboveBudgetIndex);
}

// Convert RMS hotels to QuoteResult format for QuoteList display
function convertRMSToQuotes(
  hotels: RMSHotel[],
  selectedPackages: typeof packages,
  params: {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    childrenAges: number[];
    rooms: number;
    destination: string;
  }
): QuoteResult[] {
  const results: QuoteResult[] = [];
  const nights = Math.ceil((params.checkOut.getTime() - params.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const serviceFees = calculateServiceFees(params.adults, params.childrenAges);

  for (const pkg of selectedPackages) {
    const packageCost = calculatePackageBaseCost(pkg, params.adults, params.childrenAges, params.children);

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      const accommodationCost = hotel.totalRate * params.rooms;
      const totalForGroup = roundToNearest10(accommodationCost + packageCost + serviceFees);
      const totalPeople = params.adults + params.children;
      const totalPerPerson = roundToNearest10(totalForGroup / totalPeople);

      const hotelNameDisplay = hotel.includesBreakfast 
        ? `${hotel.name} (includes breakfast)` 
        : hotel.name;

      results.push({
        packageName: pkg.name,
        packageDescription: pkg.description,
        hotelName: hotelNameDisplay,
        hotelId: `${hotel.code}-${pkg.id}`,
        hotelImage: hotel.images?.[0] || '',
        hotelImages: hotel.images,
        destination: params.destination,
        nights,
        accommodationCost,
        packageCost,
        activitiesCost: packageCost,
        childDiscount: 0,
        totalPerPerson,
        totalForGroup,
        is4SleeperRoom: hotel.capacity === '4_sleeper',
        roomType: hotel.capacity === '4_sleeper' ? '4 Sleeper' : '2 Sleeper',
        roomTypeName: hotel.roomTypeName,
        includesBreakfast: hotel.includesBreakfast,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: params.adults,
        children: params.children,
        rooms: params.rooms,
        activitiesIncluded: pkg.activitiesIncluded,
        affordableInclusions: (pkg as any).affordableInclusions,
        hotelTier: hotel.tier,
        breakdown: [
          { label: `Accommodation (${nights} nights × ${params.rooms} rooms)`, amount: accommodationCost },
          { label: 'Package', amount: packageCost },
          { label: 'Service Fees', amount: serviceFees },
        ],
      });
    }
  }

  return results;
}

// Convert RMS hotels to accommodation-only QuoteResult format
// Applies required accommodation add-ons on top of base hotel totals.
function convertRMSToAccommodationOnlyQuotes(
  hotels: AccommodationPricingHotel[],
  params: {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    childrenAges: number[];
    rooms: number;
    destination: string;
  }
): QuoteResult[] {
  const results: QuoteResult[] = [];
  const nights = Math.ceil((params.checkOut.getTime() - params.checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const hotelImages = [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  ];

  const eligibleChildren = params.childrenAges.filter(age => age >= 4 && age <= 17).length;

  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];
    const totalPeople = params.adults + params.children;

    const perNightRate = hotel.totalRate / nights;
    const adultMarkupPerNight = perNightRate <= 1000 ? 50 : 60;
    const totalPerNight = perNightRate + (adultMarkupPerNight * params.adults) + (20 * eligibleChildren);
    const totalForGroup = roundToNearest10(totalPerNight * nights * params.rooms);

    const totalPerPerson = totalPeople > 0
      ? roundToNearest10(totalForGroup / totalPeople)
      : 0;

    const hotelNameDisplay = hotel.includesBreakfast
      ? `${hotel.name} (includes breakfast)`
      : hotel.name;

    const inclusions = [`${nights} nights accommodation`];
    if (hotel.includesBreakfast) {
      inclusions.push('Breakfast included');
    }

    results.push({
      packageName: 'Accommodation Only',
      packageDescription: `${nights} nights accommodation at ${hotel.name}`,
      hotelName: hotelNameDisplay,
      hotelId: `${hotel.code}-accom-only`,
      hotelImage: hotelImages[i % hotelImages.length],
      destination: params.destination,
      nights,
      accommodationCost: totalForGroup,
      packageCost: 0,
      activitiesCost: 0,
      childDiscount: 0,
      totalPerPerson,
      totalForGroup,
      is4SleeperRoom: hotel.capacity === '4_sleeper',
      roomType: hotel.capacity === '4_sleeper' ? '4 Sleeper' : '2 Sleeper',
      roomTypeName: hotel.roomTypeName,
      includesBreakfast: hotel.includesBreakfast,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: params.adults,
      children: params.children,
      rooms: params.rooms,
      activitiesIncluded: inclusions,
      hotelTier: hotel.tier,
      breakdown: [
        { label: `Accommodation (${nights} nights × ${params.rooms} rooms)`, amount: totalForGroup },
      ],
    });
  }

  results.sort((a, b) => a.totalForGroup - b.totalForGroup);
  return results;
}

interface HeroProps {
  onGetQuote: () => void;
}

interface FamilyData {
  parentName: string;
  adults: number;
  children: number;
  childrenAges: string;
  rooms: number;
}

interface FamilyQuotes {
  familyIndex: number;
  parentName: string;
  quotes: QuoteResult[];
}

export function Hero({ onGetQuote }: HeroProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [isBrowsingMore, setIsBrowsingMore] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<string>('');
  const [rooms, setRooms] = useState(1);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  // RMS hotel search (database-backed)
  const {
    searchHotels: searchRMSHotels,
    hotels: rmsHotels,
    isLoading: isSearchingRMS,
    clearHotels: clearRMSHotels,
  } = useRMSHotels();

  // Genie-style destination grid data
  const genieDestinations = [
    { id: 'vaal-river', name: 'Vaal River', image: vaalRiverImg },
    { id: 'umhlanga', name: 'Umhlanga', image: umhlangaImg },
    { id: 'knysna', name: 'Knysna', image: knysnaImg },
    { id: 'harties', name: 'Hartbeespoort', image: hartiesImg },
    { id: 'magalies', name: 'Magaliesberg', image: magaliesImg },
    { id: 'durban', name: 'Durban', image: durbanImg },
    { id: 'mpumalanga', name: 'Mpumalanga', image: mpumalangaImg },
    { id: 'sun-city', name: 'Sun City', image: sunCityImg },
    { id: 'cape-town', name: 'Cape Town', image: capeTownImg },
    { id: 'pretoria', name: 'Pretoria', image: pretoriaImg },
    { id: 'thailand', name: 'Thailand (Phuket)', image: thailandImg },
    { id: 'dubai', name: 'Dubai', image: dubaiImg },
    { id: 'bali', name: 'Bali', image: baliImg },
  ];

  const handleDestinationSelect = (destId: string) => {
    setDestination(destId);
    // Scroll to the form after selecting
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };
  
  // Accommodation type filter
  type AccommodationType = 'budget' | 'affordable' | 'premium';
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('affordable');
  
  // Contact details (required)
  const [guestName, setGuestName] = useState('');
  const [guestTel, setGuestTel] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  
  // Booking type
  const [bookingType, setBookingType] = useState<BookingType>('with-activities');

  // Budget field for with-activities
  const [budget, setBudget] = useState<string>('');

  // Family split mode
  const [showFamilySplitOption, setShowFamilySplitOption] = useState(false);
  const [isFamilySplitMode, setIsFamilySplitMode] = useState(false);
  const [numberOfFamilies, setNumberOfFamilies] = useState(2);
  const [families, setFamilies] = useState<FamilyData[]>([
    { parentName: '', adults: 2, children: 1, childrenAges: '', rooms: 1 },
    { parentName: '', adults: 2, children: 1, childrenAges: '', rooms: 1 },
  ]);
  const [familyQuotes, setFamilyQuotes] = useState<FamilyQuotes[]>([]);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];

  // Handle chatbot URL params to pre-fill form
  useEffect(() => {
    const paramDest = searchParams.get('destination');
    const paramPkg = searchParams.get('package');
    const paramAdults = searchParams.get('adults');
    const paramChildrenAges = searchParams.get('childrenAges');
    const paramBudget = searchParams.get('budget');
    const paramAutoSearch = searchParams.get('autoSearch');
    const paramCheckIn = searchParams.get('checkIn');
    const paramCheckOut = searchParams.get('checkOut');
    const paramTotalBudget = searchParams.get('totalBudget');

    if (paramDest && paramAutoSearch === 'true') {
      setDestination(paramDest);
      
      if (paramAdults) setAdults(parseInt(paramAdults, 10) || 2);
      if (paramChildrenAges && paramChildrenAges !== '0') {
        const ages = paramChildrenAges.split(',');
        setChildren(ages.length);
        setChildrenAges(paramChildrenAges);
      }
      if (paramBudget) {
        const budgetMap: Record<string, AccommodationType> = {
          'very-affordable': 'budget',
          'budget': 'budget',
          'affordable': 'affordable',
          'premium': 'premium',
        };
        setAccommodationType(budgetMap[paramBudget] || 'affordable');
      }

      // Pre-fill check-in and check-out dates from chatbot
      if (paramCheckIn) {
        setCheckIn(paramCheckIn);
      }
      if (paramCheckOut) {
        setCheckOut(paramCheckOut);
      }
      // Fallback default dates if none provided
      if (!paramCheckIn && !checkIn) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 2);
        setCheckIn(tomorrow.toISOString().split('T')[0]);
        setCheckOut(dayAfter.toISOString().split('T')[0]);
      }

      // Pre-fill total budget from chatbot
      if (paramTotalBudget) {
        setBudget(paramTotalBudget);
      }

      // Pre-fill contact details from chatbot
      const paramName = searchParams.get('guestName');
      const paramTel = searchParams.get('guestTel');
      const paramEmail = searchParams.get('guestEmail');
      if (paramName) setGuestName(paramName);
      if (paramTel) setGuestTel(paramTel);
      if (paramEmail) setGuestEmail(paramEmail);

      // Set booking type from URL param
      const paramBookingType = searchParams.get('bookingType');
      if (paramBookingType === 'accommodation-only') {
        setBookingType('accommodation-only');
      } else if (paramPkg) {
        // Set package after a brief delay to let destination state propagate
        setTimeout(() => {
          setPackageIds([paramPkg]);
          setBookingType('with-activities');
        }, 100);
      }

      // Clear the URL params after applying
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setQuotes([]);
    setFamilyQuotes([]);
    clearRMSHotels();
  }, [destination, clearRMSHotels]);

  // Reset to affordable if budget-disabled package is selected while budget is active
  useEffect(() => {
    if (accommodationType === 'budget' && packageIds.length > 0) {
      const selectedPkgs = packages.filter(p => packageIds.includes(p.id));
      const hasBudgetDisabled = selectedPkgs.some(p => (p as any).budgetDisabled);
      if (hasBudgetDisabled) {
        setAccommodationType('affordable');
      }
    }
  }, [packageIds, accommodationType]);

  // Show family split option when 4+ adults AND children
  useEffect(() => {
    const hasChildren = children > 0;
    setShowFamilySplitOption(adults >= 4 && hasChildren);
    if (adults < 4 || !hasChildren) {
      setIsFamilySplitMode(false);
    }
  }, [adults, children]);

  // Update families array when number of families changes
  useEffect(() => {
    const newFamilies: FamilyData[] = [];
    for (let i = 0; i < numberOfFamilies; i++) {
      if (families[i]) {
        newFamilies.push(families[i]);
      } else {
        newFamilies.push({ parentName: '', adults: 2, children: 1, childrenAges: '', rooms: 1 });
      }
    }
    setFamilies(newFamilies);
  }, [numberOfFamilies]);

  // Auto-set checkout to day after check-in
  useEffect(() => {
    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 2);
      const formatted = checkInDate.toISOString().split('T')[0];
      if (!checkOut || new Date(checkOut) <= new Date(checkIn)) {
        setCheckOut(formatted);
      }
    }
  }, [checkIn]);

  const updateFamilyData = (index: number, field: keyof FamilyData, value: string | number) => {
    const newFamilies = [...families];
    newFamilies[index] = { ...newFamilies[index], [field]: value };
    setFamilies(newFamilies);
  };

  const handleCalculate = async () => {
    if (!destination || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!guestName || !guestTel || !guestEmail) {
      toast.error('Please fill in your name, telephone number and email address');
      return;
    }

    // For with-activities, packages and budget are required
    if (bookingType === 'with-activities' && packageIds.length === 0) {
      toast.error('Please select at least one package');
      return;
    }

    if (bookingType === 'with-activities' && (!budget || parseInt(budget) <= 0)) {
      toast.error('Please enter your total budget so we can find the best options for you');
      return;
    }

    setIsCalculating(true);

    // Always reset previous results before calculating
    setQuotes([]);
    setFamilyQuotes([]);
    clearRMSHotels();

    // Parse children ages
    const ages = childrenAges
      .split(',')
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a) && a >= 3 && a <= 17)
      .slice(0, children);

    // Ensure we have ages for all children
    while (ages.length < children) {
      ages.push(5); // Default age
    }

    const useRMS = RMS_DESTINATIONS.includes(destination);

    // ── Shared RMS hotel fetch for both Accommodation-Only and With-Activities ──
    // Hotels are fetched once here and reused by both flows so any additions/changes
    // to accommodation data propagate automatically.
    if (useRMS && !isFamilySplitMode) {
      try {
        // Determine area filter (shared logic)
        const requiresGraskopOnly = bookingType === 'with-activities' && destination === 'mpumalanga' &&
          packageIds.some(id => GRASKOP_ONLY_PACKAGES.includes(id));
        const requiresUmhlangaArea = destination === 'umhlanga';
        const requiresGoldenMileArea = destination === 'durban';

        let areaFilter: string | undefined;
        if (requiresGraskopOnly) {
          areaFilter = 'Graskop';
        } else if (requiresUmhlangaArea) {
          areaFilter = 'Umhlanga';
        } else if (requiresGoldenMileArea) {
          areaFilter = 'Golden Mile';
        }

        const result = await searchRMSHotels({
          destination,
          checkIn,
          checkOut,
          adults,
          children,
          rooms,
          areaName: areaFilter,
        });

        if (result.length === 0) {
          toast.info('No hotels available for this search. Please try different dates.');
          setIsCalculating(false);
          return;
        }

        // Filter by selected tier
        const tierHotels = result.filter(h => h.tier === accommodationType);
        if (tierHotels.length === 0) {
          const availableTiers = [...new Set(result.map(h => h.tier))];
          const tierLabels: Record<string, string> = { budget: 'Budget', affordable: 'Affordable', premium: 'Premium' };
          const availableTierNames = availableTiers.map(t => tierLabels[t] || t).join(', ');
          toast.info(`No ${tierLabels[accommodationType]} hotels available. Available: ${availableTierNames}`);
          setIsCalculating(false);
          return;
        }

        let pricedHotels = await applyLiveRatesForSelectedDates(tierHotels, {
          checkIn,
          checkOut,
          rooms,
        });

        if (pricedHotels.length === 0) {
          toast.info('No hotels are currently available for the selected dates. Please try different dates.');
          return;
        }

        const sharedParams = {
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          adults,
          children,
          childrenAges: ages,
          rooms,
          destination,
        };

        // ── Branch: Accommodation-Only ──
        if (bookingType === 'accommodation-only') {
          const accomQuotes = convertRMSToAccommodationOnlyQuotes(pricedHotels, sharedParams);

          if (accomQuotes.length > 0) {
            setQuotes(accomQuotes);
            toast.success(`${accomQuotes.length} accommodation options found!`);
            setTimeout(() => {
              document.getElementById('quote-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            toast.info('No accommodation options available for this tier.');
          }
        }

        // ── Branch: With-Activities (packages) ──
        // Uses the SAME hotel data but with RAW accommodation cost (no markups)
        if (bookingType === 'with-activities') {
          const tierQuotes = convertRMSToQuotes(
            pricedHotels,
            packages.filter(p => packageIds.includes(p.id)),
            sharedParams,
          );

          if (tierQuotes.length === 0) {
            toast.info('No hotels available. Try different dates or destination.');
            setIsCalculating(false);
            return;
          }

          const budgetAmount = parseInt(budget) || 0;
          const tierLabel = accommodationType === 'budget' ? 'Budget' : accommodationType === 'affordable' ? 'Affordable' : 'Premium';
          const budgetSorted = sortQuotesForBudgetDisplay(tierQuotes, budgetAmount);

          if (budgetSorted.length === 0) {
            toast.info(`No ${tierLabel.toLowerCase()} options are currently available.`);
            setIsCalculating(false);
            return;
          }

          const closestOption = budgetSorted[0];
          const isAboveBudget = budgetAmount > 0 && closestOption.totalForGroup > budgetAmount;
          const difference = budgetAmount > 0 ? Math.abs(closestOption.totalForGroup - budgetAmount) : 0;

          if (budgetAmount > 0) {
            toast.success(
              isAboveBudget
                ? `${budgetSorted.length} ${tierLabel.toLowerCase()} options found. Closest starts R${difference.toLocaleString()} above your budget.`
                : `${budgetSorted.length} ${tierLabel.toLowerCase()} options found. Closest starts R${difference.toLocaleString()} below your budget.`
            );
          } else {
            toast.success(`${budgetSorted.length} ${tierLabel.toLowerCase()} options found.`);
          }

          setQuotes(budgetSorted);
          setTimeout(() => {
            document.getElementById('quote-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Could not fetch hotels';
        toast.error(msg);
      } finally {
        setIsCalculating(false);
      }
      return;
    }

    if (isFamilySplitMode) {
      // Calculate quotes for each family separately
      const allFamilyQuotes: FamilyQuotes[] = [];

      families.forEach((family, index) => {
        const familyAges = family.childrenAges
          .split(',')
          .map(a => parseInt(a.trim()))
          .filter(a => !isNaN(a) && a >= 3 && a <= 17)
          .slice(0, family.children);

        while (familyAges.length < family.children) {
          familyAges.push(5);
        }

        let familyResults: QuoteResult[] = [];
        // Calculate for all three hotel tiers
        const hotelTypes: Array<'very-affordable' | 'affordable' | 'premium'> = ['very-affordable', 'affordable', 'premium'];
        
        packageIds.forEach(pkgId => {
          hotelTypes.forEach(hotelType => {
            const results = calculateAllQuotes({
              destination,
              packageId: pkgId,
              checkIn: new Date(checkIn),
              checkOut: new Date(checkOut),
              adults: family.adults,
              children: family.children,
              childrenAges: familyAges,
              rooms: family.rooms,
              hotelType,
            });
            familyResults = [...familyResults, ...results];
          });
        });

        if (familyResults.length > 0) {
          familyResults.sort((a, b) => a.totalForGroup - b.totalForGroup);
          allFamilyQuotes.push({
            familyIndex: index + 1,
            parentName: family.parentName || `Family ${index + 1}`,
            quotes: familyResults,
          });
        }
      });

      if (allFamilyQuotes.length > 0) {
        setFamilyQuotes(allFamilyQuotes);
        toast.success(`Quotes generated for ${allFamilyQuotes.length} families!`);
      } else {
        toast.error('Could not calculate quotes. Please check your selections.');
      }
    } else {
      // Standard booking - calculate quotes for ALL tiers, then filter by budget
      let allQuotes: QuoteResult[] = [];
      const hotelTypes: Array<'very-affordable' | 'affordable' | 'premium'> = ['very-affordable', 'affordable', 'premium'];
      
      packageIds.forEach(pkgId => {
        hotelTypes.forEach(hotelType => {
          const results = calculateAllQuotes({
            destination,
            packageId: pkgId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults,
            children,
            childrenAges: ages,
            rooms,
            hotelType,
          });
          allQuotes = [...allQuotes, ...results];
        });
      });

      if (allQuotes.length > 0) {
        const budgetAmount = parseInt(budget) || 0;
        const filtered = sortQuotesForBudgetDisplay(allQuotes, budgetAmount);

        if (filtered.length === 0) {
          toast.info('No options are currently available.');
        } else if (budgetAmount > 0) {
          const closestOption = filtered[0];
          const difference = Math.abs(closestOption.totalForGroup - budgetAmount);
          const direction = closestOption.totalForGroup > budgetAmount ? 'above' : 'below';
          toast.success(`${filtered.length} options found. Closest starts R${difference.toLocaleString()} ${direction} your budget.`);
        } else {
          toast.success(`${filtered.length} options found.`);
        }

        setQuotes(filtered);
      } else {
        toast.error('No quotes available for this destination.');
      }
    }

    setIsCalculating(false);
  };

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-20 pb-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80"
          alt="Beautiful beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Content */}
        <div className="text-center mb-6">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight animate-slide-up">
            Discover Your
            <span className="block text-gradient-sunset bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Dream Vacation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Unbeatable prices on amazing getaways across South Africa and beyond
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">15+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">1000+ Happy Travelers</span>
            </div>
          </div>

          {/* Call to action text */}
          <p className="text-white/90 text-lg font-medium mb-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            Get Instant Quote by completing the search form below
          </p>

          {/* Badge - just above form */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 text-secondary-foreground animate-float">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">LIMITED TIME: Up to 30% OFF Selected Packages!</span>
          </div>
        </div>

        </div>{/* close container */}
        {/* Our Destinations Grid - Genie style */}
        <div className="w-full" style={{ backgroundColor: 'hsl(240 10% 10%)' }}>
        <div id="destinations" className="max-w-6xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-white">Our Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {genieDestinations.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleDestinationSelect(dest.id)}
                className={`genie-destination-card ${destination === dest.id ? 'ring-4 ring-secondary' : ''}`}
                style={{ backgroundImage: `url(${dest.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="genie-destination-overlay">
                  <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                  >
                    {destination === dest.id ? '✓ Selected' : 'Select Destination'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Booking type buttons - always visible */}
          <div className="max-w-4xl mx-auto mt-8 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => { setBookingType('accommodation-only'); if (!destination) { toast.error('Please select a destination first'); return; } formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all text-center ${
                bookingType === 'accommodation-only' && destination
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-teal-700 text-white hover:bg-teal-600'
              }`}
            >
              <Hotel className="w-5 h-5" />
              <span className="font-medium text-sm">I would like to book accommodation only</span>
            </button>
            <button
              onClick={() => { setBookingType('with-activities'); if (!destination) { toast.error('Please select a destination first'); return; } formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all text-center ${
                bookingType === 'with-activities' && destination
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/95 text-primary hover:bg-white'
              }`}
            >
              <PartyPopper className="w-5 h-5" />
              <span className="font-medium text-sm">I would like accommodation with fun activities included</span>
            </button>
            <button
              onClick={() => navigate('/build-package')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:scale-105 text-center"
            >
              <Puzzle className="w-5 h-5" />
              <span className="font-medium text-sm">I'd like to build my own package according to my budget</span>
            </button>
            <button
              onClick={() => navigate('/school-trips')}
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-lg hover:scale-105 text-center"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium text-sm">School Trips</span>
            </button>
          </div>
          
          {/* Bus Hire, Hotel Provider & Travel Agent Buttons */}
          <div className="flex flex-col justify-center gap-3 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/bus-hire')}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-amber-500/90 text-white hover:bg-amber-500 transition-all backdrop-blur-sm hover:scale-105"
            >
              <Bus className="w-5 h-5" />
              <span className="font-medium text-sm">Bus Hire Companies - Add transport to your quote</span>
            </button>
            <button
              onClick={() => navigate('/hotel-provider')}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-emerald-600/90 text-white hover:bg-emerald-600 transition-all backdrop-blur-sm hover:scale-105"
            >
              <Hotel className="w-5 h-5" />
              <span className="font-medium text-sm">For Hotels - Add our curated Activity Packages to your guest quotation</span>
            </button>
            <button
              onClick={() => navigate('/travel-agent')}
              className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-purple-600/90 text-white hover:bg-purple-600 transition-all backdrop-blur-sm hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Travel Agents - Get exclusive packages for your clients</span>
            </button>
            </div>
          </div>

        {/* Form - only show when destination is selected */}
        {destination && (
        <div ref={formRef}>

        {/* Quote Form Card */}
        <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div id="quote-section" className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="space-y-5">
              {/* Jenny Travel Assistant Button - at top of form */}
              <button
                onClick={() => {
                  const chatToggle = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                  if (chatToggle) chatToggle.click();
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white border-2 border-orange-400 text-orange-500 hover:bg-orange-50 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-bold text-base">START HERE – Please click here to speak to Jenny, our Travel Assistant, for easy & quick assistance</span>
              </button>

              {/* Selected destination indicator */}
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-700">
                    Destination: {genieDestinations.find(d => d.id === destination)?.name || destination}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDestination('');
                    setQuotes([]);
                    setFamilyQuotes([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Change
                </Button>
              </div>

              {/* Row 1: Check In, Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check In *</Label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check Out *</Label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Row 2: Package (only for with-activities), Adults, Kids, Rooms */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bookingType === 'with-activities' && (
                  <div className="space-y-2 col-span-2 md:col-span-4">
                    <Label className="text-sm font-medium text-gray-700">Package/s *</Label>
                    <p className="text-xs text-muted-foreground mb-1">
                    Click "Show Packages" to view available packages for your destination. You may select one or more packages to get a quote.
                    </p>

                    {/* Budget Field - compulsory for with-activities */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium text-gray-700">Your Total Budget (ZAR) *</Label>
                      <p className="text-xs text-muted-foreground mb-1">
                        Enter your total budget so we can find the best options that fit your pocket.
                      </p>
                      <div className="relative max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">R</span>
                        <Input
                          type="number"
                          placeholder="e.g. 13800"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="h-11 bg-white border-gray-200 pl-8"
                          min={0}
                        />
                      </div>
                    </div>
                    
                    {/* Show Packages button - only when no packages shown yet */}
                    {!isPackageDropdownOpen && packageIds.length === 0 && (
                      <Button
                        variant="outline"
                        disabled={!destination}
                        onClick={() => setIsPackageDropdownOpen(true)}
                        className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      >
                        {destination ? 'Show Packages' : 'Select destination first'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    )}

                    {/* Selected packages summary + change button */}
                    {packageIds.length > 0 && !isPackageDropdownOpen && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {availablePackages
                            .filter(pkg => packageIds.includes(pkg.id))
                            .map(pkg => (
                              <div
                                key={pkg.id}
                                className="border-2 border-primary bg-primary/5 rounded-xl p-4 relative"
                              >
                                <button
                                  type="button"
                                  onClick={() => togglePackageSelection(pkg.id)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-destructive text-lg leading-none"
                                  aria-label="Remove package"
                                >
                                  ×
                                </button>
                                <h4 className="text-sm font-bold text-primary uppercase leading-tight pr-5">{pkg.name}</h4>
                                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pkg.description}</p>
                                <p className="text-sm font-semibold text-primary mt-3">From {formatCurrency(getPackageFromPrice(pkg))} per person</p>
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPackageDropdownOpen(true)}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          Change Packages
                        </Button>
                      </div>
                    )}

                    {/* Package cards grid - visual image cards */}
                    {isPackageDropdownOpen && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(packageIds.length > 0 && !isBrowsingMore
                            ? availablePackages.filter(pkg => packageIds.includes(pkg.id))
                            : availablePackages
                          ).map(pkg => {
                            const isSelected = packageIds.includes(pkg.id);
                            const packageImage = getPackageImage(pkg.id);
                            const tourCode = pkg.name.split(' - ')[0] || pkg.id.toUpperCase();
                            return (
                              <div
                                key={pkg.id}
                                onClick={() => {
                                  togglePackageSelection(pkg.id);
                                  // After selecting a new package, collapse back to show only selected
                                  if (!isSelected) {
                                    setIsBrowsingMore(false);
                                  }
                                }}
                                className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                                  isSelected
                                    ? 'ring-3 ring-primary shadow-lg scale-[1.02]'
                                    : 'hover:shadow-xl hover:scale-[1.01]'
                                }`}
                                style={{ minHeight: '280px' }}
                              >
                                {/* Background Image */}
                                {packageImage ? (
                                  <img
                                    src={packageImage}
                                    alt={pkg.shortName || pkg.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary" />
                                )}

                                {/* Dark overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />

                                {/* Selected checkmark badge */}
                                {isSelected && (
                                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center z-10">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}

                                {/* Content overlay */}
                                <div className="relative z-[5] h-full flex flex-col justify-end p-4" style={{ minHeight: '280px' }}>
                                  {/* Tour Code */}
                                  <div className="mb-1">
                                    <span className="inline-block bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded">
                                      {tourCode}
                                    </span>
                                  </div>

                                  {/* Package short name */}
                                  <h4 className="text-white font-bold text-sm leading-tight mb-2">
                                    {pkg.shortName || pkg.name.split(' - ')[1]?.substring(0, 40) || pkg.name}
                                  </h4>

                                  {/* Inclusions */}
                                  <p className="text-yellow-300 text-xs leading-relaxed mb-3 font-medium">
                                    {(() => {
                                      const rawDescription = pkg.description;
                                      const isCapeTown = pkg.destination === 'cape-town';
                                      const includesIdx = rawDescription.toLowerCase().indexOf('includes');

                                      if (isCapeTown && includesIdx !== -1) {
                                        const prefix = 'This package includes ';
                                        const inclusionsText = rawDescription
                                          .slice(includesIdx + 'includes'.length)
                                          .replace(/^[\s:]+/, '')
                                          .toUpperCase();
                                        return (
                                          <>
                                            {prefix}
                                            {inclusionsText}
                                          </>
                                        );
                                      }

                                      return rawDescription.replace('Includes', 'This package includes');
                                    })()}
                                  </p>

                                  {/* Price */}
                                  <p className="text-white font-semibold text-xs">
                                    From {formatCurrency(getPackageFromPrice(pkg))} pp
                                  </p>
                                </div>
                              </div>
                            );
                          })}

                          {/* "Select More Packages" button shown inline in the grid when packages are selected and not browsing */}
                          {packageIds.length > 0 && !isBrowsingMore && (
                            <div
                              onClick={() => setIsBrowsingMore(true)}
                              className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 border-2 border-dashed border-primary/50 hover:border-primary flex items-center justify-center bg-black/30"
                              style={{ minHeight: '280px' }}
                            >
                              <div className="text-center p-4">
                                <Puzzle className="w-8 h-8 text-primary mx-auto mb-2" />
                                <p className="text-white font-bold text-sm">Select More Packages</p>
                                <p className="text-white/60 text-xs mt-1">Browse all available options</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                  <Select value={adults.toString()} onValueChange={v => setAdults(parseInt(v))}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Number of Kids</Label>
                  <Select 
                    value={children.toString()} 
                    onValueChange={v => {
                      const newCount = parseInt(v);
                      setChildren(newCount);
                      // Adjust childrenAges array
                      const currentAges = childrenAges.split(',').map(a => a.trim()).filter(a => a !== '');
                      if (newCount > currentAges.length) {
                        // Add default ages for new children
                        const newAges = [...currentAges];
                        while (newAges.length < newCount) {
                          newAges.push('5');
                        }
                        setChildrenAges(newAges.join(','));
                      } else if (newCount < currentAges.length) {
                        // Remove extra ages
                        setChildrenAges(currentAges.slice(0, newCount).join(','));
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: 101 }, (_, i) => i).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Child Age Selection */}
                {children > 0 && (
                  <div className="space-y-2 col-span-full">
                    <Label className="text-sm font-medium text-gray-700">Child Ages (3-17 years)</Label>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: children }, (_, i) => {
                        const ages = childrenAges.split(',').map(a => a.trim());
                        const currentAge = ages[i] || '5';
                        return (
                          <div key={i} className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Child {i + 1}:</span>
                            <Select 
                              value={currentAge} 
                              onValueChange={v => {
                                const newAges = [...ages];
                                newAges[i] = v;
                                // Ensure array has correct length
                                while (newAges.length < children) {
                                  newAges.push('5');
                                }
                                setChildrenAges(newAges.slice(0, children).join(','));
                              }}
                            >
                              <SelectTrigger className="h-9 w-20 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {Array.from({ length: 18 }, (_, age) => age).map(age => (
                                  <SelectItem key={age} value={age.toString()}>{age} yrs</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Rooms *</Label>
                  <Select value={rooms.toString()} onValueChange={v => setRooms(parseInt(v))}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Accommodation Type Selection - shown for both booking types */}
              {(bookingType === 'with-activities' || bookingType === 'accommodation-only') && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Accommodation Type by budget:</Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Please use the buttons to navigate various budget options, each time you change to another button to view options always click the get quotes button again to see new results. Once you've found the option that fits your budget please click enquire about this option and send it via email so we can send you pictures of the hotel.
                  </p>
                  {(() => {
                    // Check if any selected package has budget disabled
                    const selectedPkgs = packages.filter(p => packageIds.includes(p.id));
                    const budgetDisabledPkg = selectedPkgs.find(p => p.budgetDisabled);
                    const isBudgetDisabled = !!budgetDisabledPkg;
                    const budgetDisabledMessage = budgetDisabledPkg?.budgetDisabledMessage || 'Budget option is not available for this package.';
                    
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (isBudgetDisabled) {
                              toast.info(budgetDisabledMessage);
                              return;
                            }
                            setAccommodationType('budget');
                          }}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                            isBudgetDisabled
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : accommodationType === 'budget'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                        >
                          Budget Friendly Hotel Options
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccommodationType('affordable')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                            accommodationType === 'affordable'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          Affordable Hotel Options
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccommodationType('premium')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                            accommodationType === 'premium'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        >
                          Premium Hotel Options
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Family Split Option */}
              {showFamilySplitOption && !isFamilySplitMode && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    If you are different families and each family would be paying separately, please click here:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFamilySplitMode(true)}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Split by Family
                  </Button>
                </div>
              )}

              {/* Family Split Mode */}
              {isFamilySplitMode && (
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">How many families are you?</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsFamilySplitMode(false);
                        setFamilyQuotes([]);
                      }}
                      className="text-gray-500"
                    >
                      Cancel Split
                    </Button>
                  </div>
                  <Select value={numberOfFamilies.toString()} onValueChange={v => setNumberOfFamilies(parseInt(v))}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n} Families</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Family Forms */}
                  <div className="space-y-4 max-h-[350px] overflow-y-auto">
                    {families.map((family, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-sm text-primary">Family {index + 1}</h4>
                        
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Name of Parent</Label>
                          <Input
                            placeholder="Parent name"
                            value={family.parentName}
                            onChange={e => updateFamilyData(index, 'parentName', e.target.value)}
                            className="h-9 bg-white border-gray-200"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">Adults</Label>
                            <Select 
                              value={family.adults.toString()} 
                              onValueChange={v => updateFamilyData(index, 'adults', parseInt(v))}
                            >
                              <SelectTrigger className="h-9 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">Kids</Label>
                            <Select 
                              value={family.children.toString()} 
                              onValueChange={v => updateFamilyData(index, 'children', parseInt(v))}
                            >
                              <SelectTrigger className="h-9 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5, 6].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">Rooms</Label>
                            <Select 
                              value={family.rooms.toString()} 
                              onValueChange={v => updateFamilyData(index, 'rooms', parseInt(v))}
                            >
                              <SelectTrigger className="h-9 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map(n => (
                                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {family.children > 0 && (
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">Kids Ages (comma separated, 3-17)</Label>
                            <Input
                              placeholder="e.g. 5, 8"
                              value={family.childrenAges}
                              onChange={e => updateFamilyData(index, 'childrenAges', e.target.value)}
                              className="h-9 bg-white border-gray-200"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Details (Required) */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Your Contact Details *</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="h-11 bg-white border-gray-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Telephone Number *</Label>
                    <Input
                      type="tel"
                      placeholder="e.g. 072 123 4567"
                      value={guestTel}
                      onChange={(e) => setGuestTel(e.target.value)}
                      className="h-11 bg-white border-gray-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="h-11 bg-white border-gray-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleCalculate}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
                  disabled={isCalculating || isSearchingRMS}
                >
                  {isCalculating || isSearchingRMS ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Get Quotes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Results */}
        {quotes.length > 0 && (
          <div id="quote-results" className="max-w-4xl mx-auto mt-8 animate-fade-in scroll-mt-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              <QuoteList quotes={quotes} />
            </div>
          </div>
        )}

        {/* Family Quotes Results */}
        {familyQuotes.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 space-y-6 animate-fade-in">
            {familyQuotes.map((familyData) => (
              <div key={familyData.familyIndex} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {familyData.parentName}'s Quote
                </h3>
                <QuoteList quotes={familyData.quotes} />
              </div>
            ))}
          </div>
        )}
        </div>
        )}
        </div>
        </div>
        </div>
    </section>
  );
}
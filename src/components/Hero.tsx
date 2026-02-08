import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Sparkles, MapPin, Star, Calculator, ChevronDown, Hotel, PartyPopper, FileText, Bus, Puzzle } from 'lucide-react';
import { calculateChildServiceFees as calculateChildServiceFeesUtil } from '@/lib/childServiceFees';
import { 
  destinations, 
  packages, 
  calculateAllQuotes,
  getPackagesByDestination, 
  type QuoteResult 
} from '@/data/travelData';
import { QuoteList } from './QuoteList';
import { toast } from 'sonner';
import { useRMSHotels, type RMSHotel } from '@/hooks/useRMSHotels';
import { getActivitiesForDestination, findActivityByName } from '@/data/activitiesData';
import { roundToNearest10 } from '@/lib/utils';

type BookingType = 'accommodation-only' | 'with-activities';

// Destinations that should use the RMS (database) hotel list instead of static placeholders
// Note: UI destination id for Vaal is `vaal-river`, while backend destination code is `vaal`.
// Note: UI uses `umhlanga` as a separate destination, but it maps to `durban` destination with area filter.
const RMS_DESTINATIONS = ['harties', 'magalies', 'durban', 'umhlanga', 'cape-town', 'sun-city', 'mpumalanga', 'vaal', 'vaal-river', 'bela-bela'];

// Mpumalanga package IDs that require Graskop-only hotels (near Blyde River Canyon)
const GRASKOP_ONLY_PACKAGES = ['mp1']; // MP1 - In Style Getaway with Blyde River Canyon

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

  // Get activities for this destination
  const availableActivities = getActivitiesForDestination(params.destination);

  // Default hotel image for display
  const hotelImages = [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  ];

  for (const pkg of selectedPackages) {
    // Calculate activities cost from package
    let activitiesCost = 0;
    const activitiesForPackage = pkg.activitiesIncluded
      .filter(a => !a.toLowerCase().includes('accommodation') && !a.toLowerCase().includes('breakfast'))
      .map(label => findActivityByName(label, availableActivities))
      .filter(Boolean);

    activitiesForPackage.forEach(activity => {
      if (activity) {
        activitiesCost += (activity.rates.adult * params.adults) + (activity.rates.child * params.children);
      }
    });

    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      const accommodationCost = hotel.totalRate * params.rooms;
      const totalForGroup = roundToNearest10(accommodationCost + activitiesCost + serviceFees);
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
        hotelImage: hotelImages[i % hotelImages.length],
        destination: params.destination,
        nights,
        accommodationCost,
        packageCost: activitiesCost,
        activitiesCost,
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
          { label: 'Activities', amount: activitiesCost },
          { label: 'Service Fees', amount: serviceFees },
        ],
      });
    }
  }

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
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<string>('');
  const [rooms, setRooms] = useState(1);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // RMS hotel search (database-backed)
  const {
    searchHotels: searchRMSHotels,
    hotels: rmsHotels,
    isLoading: isSearchingRMS,
    clearHotels: clearRMSHotels,
  } = useRMSHotels();
  
  // Accommodation type filter
  type AccommodationType = 'budget' | 'affordable' | 'premium';
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('affordable');
  
  // Contact details (required)
  const [guestName, setGuestName] = useState('');
  const [guestTel, setGuestTel] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  
  // Booking type
  const [bookingType, setBookingType] = useState<BookingType>('with-activities');

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
    // For accommodation only, redirect to contact
    if (bookingType === 'accommodation-only') {
      toast.info('For accommodation only bookings, please contact us directly.');
      return;
    }

    if (packageIds.length === 0) {
      toast.error('Please select at least one package');
      return;
    }
    
    if (!destination || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!guestName || !guestTel || !guestEmail) {
      toast.error('Please fill in your name, telephone number and email address');
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

    // RMS path (homepage quote flow) — this is what powers the real hotel names.
    // We only use it for the standard (non-family-split) flow.
    if (useRMS && !isFamilySplitMode) {
      try {
        // Determine if we need to filter by area
        // MP1 (In Style Getaway) requires Graskop-only hotels (near Blyde River Canyon)
        const requiresGraskopOnly = destination === 'mpumalanga' && 
          packageIds.some(id => GRASKOP_ONLY_PACKAGES.includes(id));
        
        // Umhlanga destination should filter to Umhlanga area under Durban
        const requiresUmhlangaArea = destination === 'umhlanga';
        
        // Durban destination should filter to Golden Mile area only (excludes Umhlanga hotels)
        const requiresGoldenMileArea = destination === 'durban';
        
        // Determine area filter
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

        // Filter hotels by selected accommodation type (tier)
        const filteredHotels = result.filter(h => h.tier === accommodationType);

        // If no hotels match the selected tier, show available tiers
        if (filteredHotels.length === 0) {
          const availableTiers = [...new Set(result.map(h => h.tier))];
          const tierLabels: Record<string, string> = {
            budget: 'Budget',
            affordable: 'Affordable', 
            premium: 'Premium'
          };
          const availableTierNames = availableTiers.map(t => tierLabels[t] || t).join(', ');
          toast.info(`No ${tierLabels[accommodationType]} hotels available for ${destination.replace('-', ' ')}. Available tiers: ${availableTierNames}`);
          setIsCalculating(false);
          return;
        }

        // Convert RMS hotels to QuoteResult format for QuoteList display
        const rmsQuotes = convertRMSToQuotes(
          filteredHotels,
          packages.filter(p => packageIds.includes(p.id)),
          {
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults,
            children,
            childrenAges: ages,
            rooms,
            destination,
          }
        );

        if (rmsQuotes.length > 0) {
          setQuotes(rmsQuotes);
          toast.success(`${rmsQuotes.length} quotes found!`);
          // Scroll to results after a short delay to ensure they're rendered
          setTimeout(() => {
            document.getElementById('quote-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        } else {
          toast.info('No hotels available for this tier. Try a different option.');
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
      // Standard booking - calculate quotes for all three tiers
      let allQuotes: QuoteResult[] = [];
      // Map accommodation type to hotel type
      const hotelTypeMap: Record<AccommodationType, 'very-affordable' | 'affordable' | 'premium'> = {
        'budget': 'very-affordable',
        'affordable': 'affordable',
        'premium': 'premium'
      };
      const selectedHotelType = hotelTypeMap[accommodationType];
      
      packageIds.forEach(pkgId => {
        const results = calculateAllQuotes({
          destination,
          packageId: pkgId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          adults,
          children,
          childrenAges: ages,
          rooms,
          hotelType: selectedHotelType,
        });
        allQuotes = [...allQuotes, ...results];
      });

      if (allQuotes.length > 0) {
        // Sort by price (cheapest first)
        allQuotes.sort((a, b) => a.totalForGroup - b.totalForGroup);
        setQuotes(allQuotes);
        toast.success(`${allQuotes.length} quotes generated!`);
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
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden pt-20 pb-12">
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight animate-slide-up">
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

        {/* Booking Type Selection - Outside the white form */}
        <div className="max-w-4xl mx-auto mb-4 animate-slide-up" style={{ animationDelay: '0.28s' }}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setBookingType('accommodation-only')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                bookingType === 'accommodation-only'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
              }`}
            >
              <Hotel className="w-5 h-5" />
              <span className="font-medium">I would like to book accommodation only</span>
            </button>
            <button
              onClick={() => setBookingType('with-activities')}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                bookingType === 'with-activities'
                  ? 'bg-white text-primary shadow-lg scale-105'
                  : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
              }`}
            >
              <PartyPopper className="w-5 h-5" />
              <span className="font-medium">I would like accommodation with fun activities included</span>
            </button>
            <button
              onClick={() => navigate('/build-package')}
              className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:scale-105"
            >
              <Puzzle className="w-5 h-5" />
              <span className="font-medium">I'd like to build my own package according to my budget</span>
            </button>
          </div>
          
          {/* Bus Hire, Hotel Provider & Travel Agent Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-3">
            <a
              href="#bus-hire-section"
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-amber-500/90 text-white hover:bg-amber-500 transition-all backdrop-blur-sm hover:scale-105"
            >
              <Bus className="w-5 h-5" />
              <span className="font-medium">Bus Hire Companies - Add transport to your quote</span>
            </a>
            <a
              href="#hotel-provider-section"
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-600/90 text-white hover:bg-emerald-600 transition-all backdrop-blur-sm hover:scale-105"
            >
              <Hotel className="w-5 h-5" />
              <span className="font-medium">For Hotels - Add our curated Activity Packages to your guest quotation</span>
            </a>
            <a
              href="#travel-agent-section"
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-600/90 text-white hover:bg-purple-600 transition-all backdrop-blur-sm hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Travel Agents - Get exclusive packages for your clients</span>
            </a>
          </div>
        </div>

        {/* Quote Form Card */}
        <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
            <div className="space-y-5">
              {/* Row 1: Destination, Check In, Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Where would you like to go? *</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">South Africa</div>
                      {destinations.filter(d => !d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">International</div>
                      {destinations.filter(d => d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}, {d.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label className="text-sm font-medium text-gray-700">Package/s *</Label>
                    <p className="text-xs text-muted-foreground mb-1">
                      Please select the package/s you'd like quote for by selecting in the dropdown. You may choose more than one package to generate quotes for various packages.
                    </p>
                    <Popover open={isPackageDropdownOpen} onOpenChange={setIsPackageDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={!destination}
                          className="w-full h-11 justify-between bg-white border-gray-200 text-left font-normal"
                        >
                          <span className="truncate">
                            {packageIds.length === 0 
                              ? (destination ? "Select packages" : "Select destination first")
                              : `${packageIds.length} package${packageIds.length > 1 ? 's' : ''} selected`
                            }
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[600px] max-h-[400px] overflow-y-auto p-2" align="start">
                        <div className="space-y-1">
                          {availablePackages.map(pkg => (
                            <div
                              key={pkg.id}
                              className="flex items-start space-x-3 p-2 hover:bg-accent/50 rounded-md cursor-pointer"
                              onClick={() => {
                                togglePackageSelection(pkg.id);
                                setIsPackageDropdownOpen(false);
                              }}
                            >
                              <Checkbox
                                checked={packageIds.includes(pkg.id)}
                                onCheckedChange={() => {
                                  togglePackageSelection(pkg.id);
                                  setIsPackageDropdownOpen(false);
                                }}
                                className="mt-1"
                              />
                              <label className="text-sm cursor-pointer flex-1 leading-tight">
                                {pkg.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
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
                                {Array.from({ length: 15 }, (_, age) => age + 3).map(age => (
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

              {/* Accommodation Type Selection */}
              {bookingType === 'with-activities' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Accommodation Type</Label>
                  {(() => {
                    // Check if any selected package has budget disabled
                    const selectedPkgs = packages.filter(p => packageIds.includes(p.id));
                    const budgetDisabledPkg = selectedPkgs.find(p => p.budgetDisabled);
                    const isBudgetDisabled = !!budgetDisabledPkg;
                    const budgetDisabledMessage = budgetDisabledPkg?.budgetDisabledMessage || 'Budget option is not available for this package.';
                    
                    return (
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (isBudgetDisabled) {
                              toast.info(budgetDisabledMessage);
                              return;
                            }
                            setAccommodationType('budget');
                          }}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            isBudgetDisabled
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : accommodationType === 'budget'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                        >
                          Cheapest Options
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccommodationType('affordable')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            accommodationType === 'affordable'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          Affordable
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccommodationType('premium')}
                          className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                            accommodationType === 'premium'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                          }`}
                        >
                          Premium
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

              {/* Search Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
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
                <Button
                  variant="outline"
                  className="h-12 px-6 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Destinations
                  <ArrowRight className="w-4 h-4 ml-2" />
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
                <h3 className="text-xl font-display font-semibold text-primary mb-4">
                  {familyData.parentName}'s Quote
                </h3>
                <QuoteList quotes={familyData.quotes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
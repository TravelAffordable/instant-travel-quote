import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, MapPin, Star, Calculator, BedDouble, ChevronDown, Hotel, PartyPopper, Check, Pencil, X, FileText, Bus, Puzzle } from 'lucide-react';
import { 
  destinations, 
  packages, 
  calculateAllQuotes,
  getPackagesByDestination, 
  type QuoteResult 
} from '@/data/travelData';
import { QuoteList } from './QuoteList';
import { LiveHotelQuotes } from './LiveHotelQuotes';
import { AccommodationOnlyCard } from './AccommodationOnlyCard';
import { CustomHotelCard } from './CustomHotelCard';
import { BulkHotelParser } from './BulkHotelParser';
import { CustomQuoteActions } from './CustomQuoteActions';
import { useHotelbedsSearch } from '@/hooks/useHotelbedsSearch';
import { toast } from 'sonner';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

// Durban custom hotels
const DURBAN_CUSTOM_HOTELS = [
  'Belaire Suite Hotel',
  'Blue Waters Hotel',
  'Pavilion Hotel',
  'Southern Sun Elangeni Maharani Hotel',
  'Garden Court Marine Parade',
  'Garden Court South Beach',
  'Tropicana Hotel',
  'Southern Sun Marine Parade',
  'The Balmoral Hotel',
  'Onomo Hotel Durban',
];

// Hartbeespoort custom hotels
const HARTBEESPOORT_CUSTOM_HOTELS = [
  'Riverleaf Hotel',
  'Harties en Suite Rooms',
  'Villa Paradiso Hotel',
  'Cocomo Boutique Hotel',
  'Khayamanzi Guesthouse',
  'Indlovukazi Guesthouse',
  'Kosmos Manor',
  'Metsing Guesthouse',
];

// Mpumalanga custom hotels
const MPUMALANGA_CUSTOM_HOTELS = [
  'Hotel Numbi and Garden Suites',
  'Hazyview Cabanas',
  'Little Pilgrims Boutique Hotel',
  'Kruger Adventure Lodge',
  'Sagwadi Hotel',
];

// Sun City custom hotels
const SUN_CITY_CUSTOM_HOTELS = [
  'Sun Hotel Estate',
  'Cabanas Hotel',
  'Sun City Vacation Club',
  'Sun City Area Guesthouse A - 2 Sleeper - R1100/night',
  'Sun City Area Guesthouse A - 3 Sleeper Family Room - R1460/night',
  'Sun City Area Guesthouse A - 4 Sleeper Family Room - R1760/night',
  'Sun City Area Guesthouse A - 5 Sleeper Family Room - R1960/night',
  'Sun City Area Guesthouse A - 6 Sleeper Family Room - R2100/night',
];

// Magaliesburg custom hotels (editable placeholders)
const MAGALIES_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Umhlanga custom hotels (editable placeholders)
const UMHLANGA_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Cape Town custom hotels (editable placeholders)
const CAPE_TOWN_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Knysna custom hotels (editable placeholders)
const KNYSNA_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Vaal River custom hotels (editable placeholders)
const VAAL_RIVER_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Bela Bela custom hotels (editable placeholders)
const BELA_BELA_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Bali custom hotels (editable placeholders)
const BALI_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Dubai custom hotels (editable placeholders)
const DUBAI_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Thailand custom hotels (editable placeholders)
const THAILAND_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Pretoria custom hotels (editable placeholders)
const PRETORIA_CUSTOM_HOTELS = [
  'Hotel Name 1 (edit when quoting)',
  'Hotel Name 2 (edit when quoting)',
  'Hotel Name 3 (edit when quoting)',
];

// Helper to get custom hotels for any destination
const getCustomHotelsForDestination = (dest: string): string[] => {
  switch (dest) {
    case 'durban': return DURBAN_CUSTOM_HOTELS;
    case 'harties': return HARTBEESPOORT_CUSTOM_HOTELS;
    case 'mpumalanga': return MPUMALANGA_CUSTOM_HOTELS;
    case 'sun-city': return SUN_CITY_CUSTOM_HOTELS;
    case 'magalies': return MAGALIES_CUSTOM_HOTELS;
    case 'umhlanga': return UMHLANGA_CUSTOM_HOTELS;
    case 'cape-town': return CAPE_TOWN_CUSTOM_HOTELS;
    case 'knysna': return KNYSNA_CUSTOM_HOTELS;
    case 'vaal-river': return VAAL_RIVER_CUSTOM_HOTELS;
    case 'bela-bela': return BELA_BELA_CUSTOM_HOTELS;
    case 'bali': return BALI_CUSTOM_HOTELS;
    case 'dubai': return DUBAI_CUSTOM_HOTELS;
    case 'thailand': return THAILAND_CUSTOM_HOTELS;
    case 'pretoria': return PRETORIA_CUSTOM_HOTELS;
    default: return [];
  }
};

type BookingType = 'accommodation-only' | 'with-activities';

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
  
  // Booking type and filters
  const [bookingType, setBookingType] = useState<BookingType>('with-activities');
  const [filterCheapest, setFilterCheapest] = useState(true);
  const [filterBreakfast, setFilterBreakfast] = useState(false);
  const [filterPool, setFilterPool] = useState(false);
  
  // Live hotel search - using Hotelbeds API (pre-production)
  const { searchHotels, hotels: liveHotels, isLoading: isSearchingHotels, clearHotels } = useHotelbedsSearch();
  const [budget, setBudget] = useState('');

  // Family split mode
  const [showFamilySplitOption, setShowFamilySplitOption] = useState(false);
  const [isFamilySplitMode, setIsFamilySplitMode] = useState(false);
  const [numberOfFamilies, setNumberOfFamilies] = useState(2);
  const [families, setFamilies] = useState<FamilyData[]>([
    { parentName: '', adults: 2, children: 1, childrenAges: '', rooms: 1 },
    { parentName: '', adults: 2, children: 1, childrenAges: '', rooms: 1 },
  ]);
  const [familyQuotes, setFamilyQuotes] = useState<FamilyQuotes[]>([]);
  
  // Custom hotels state (for Durban)
  const [showCustomHotels, setShowCustomHotels] = useState(false);
  const [selectedCustomHotels, setSelectedCustomHotels] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [editingQuoteIndex, setEditingQuoteIndex] = useState<number | null>(null);
  const [customHotelMode, setCustomHotelMode] = useState<'preset' | 'bulk'>('preset');
  const [customHotelQuotes, setCustomHotelQuotes] = useState<Array<{
    hotelName: string;
    hotelTier?: string;
    recommendation?: string;
    roomType?: string;
    bedConfig?: string;
    mealPlan?: string;
    stayDetails?: string;
    totalCost: number;
    packageId: string;
    packageName: string;
    checkInDate?: string;
    checkOutDate?: string;
  }>>([]);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setQuotes([]);
    setFamilyQuotes([]);
    setSelectedCustomHotels([]);
    setCustomHotelQuotes([]);
    setShowCustomHotels(false);
  }, [destination]);

  // Clear live hotels when destination changes
  useEffect(() => {
    clearHotels();
  }, [destination]);

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
    // For accommodation only, we don't need packages
    if (bookingType === 'with-activities' && packageIds.length === 0) {
      toast.error('Please select at least one package');
      return;
    }
    
    if (!destination || !checkIn || !checkOut || !budget) {
      toast.error('Please fill in all required fields including your budget');
      return;
    }

    setIsCalculating(true);

    // Always reset previous results before calculating a new search.
    setQuotes([]);
    setFamilyQuotes([]);
    clearHotels();
    setCustomHotelQuotes([]);
    setHasSearched(true);

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

    if (isFamilySplitMode) {
      // Calculate quotes for each family separately (uses static data)
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
        packageIds.forEach(pkgId => {
          const results = calculateAllQuotes({
            destination,
            packageId: pkgId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults: family.adults,
            children: family.children,
            childrenAges: familyAges,
            rooms: family.rooms,
            hotelType: 'affordable',
          });
          familyResults = [...familyResults, ...results];
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
      setIsCalculating(false);
    } else {
      // Standard booking - use live hotel search
      try {
        const result = await searchHotels({
          destination,
          checkIn,
          checkOut,
          adults,
          children,
          childrenAges: ages,
          rooms,
          bookingType,
          filterBreakfast,
          filterPool,
          filterCheapest,
        });

        if (result && result.length > 0) {
          toast.success(`${result.length} hotels found!`);
        } else {
          toast.info('No hotels available for this search. Please try different dates or contact us.');
        }
      } catch (error) {
        console.error('Live hotel search error:', error);
        toast.error('Could not fetch hotels. Please try again.');
      } finally {
        setIsCalculating(false);
      }
    }
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
          
          {/* Filter Preferences */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <p className="text-white/90 text-sm font-medium w-full text-center mb-1">Show me:</p>
            <label className="flex items-center gap-2 text-white cursor-pointer hover:text-white/80 transition-colors">
              <Checkbox 
                checked={filterCheapest} 
                onCheckedChange={(checked) => setFilterCheapest(checked as boolean)}
                className="border-white/60 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <span className="text-sm">Cheapest hotels first</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer hover:text-white/80 transition-colors">
              <Checkbox 
                checked={filterBreakfast} 
                onCheckedChange={(checked) => setFilterBreakfast(checked as boolean)}
                className="border-white/60 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <span className="text-sm">Hotels that serve breakfast</span>
            </label>
            <label className="flex items-center gap-2 text-white cursor-pointer hover:text-white/80 transition-colors">
              <Checkbox 
                checked={filterPool} 
                onCheckedChange={(checked) => setFilterPool(checked as boolean)}
                className="border-white/60 data-[state=checked]:bg-white data-[state=checked]:text-primary"
              />
              <span className="text-sm">Hotels with swimming pool</span>
            </label>
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
                                {[1, 2, 3, 4, 5, 6].map(n => (
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

              {/* Budget Field */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">My total budget for the trip is *</Label>
                <Input
                  type="text"
                  placeholder="e.g. R10,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-11 bg-white border-gray-200"
                  required
                />
                <p className="text-xs text-muted-foreground">This helps us understand your preferences</p>
              </div>

              {/* Search Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  onClick={handleCalculate}
                  className="flex-1 h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
                  disabled={isCalculating || isSearchingHotels}
                >
                  {isCalculating || isSearchingHotels ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      {isSearchingHotels ? 'Searching Hotels...' : 'Calculating...'}
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-2" />
                      Search Packages
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

        {/* Custom Hotels Section - Durban, Hartbeespoort, Mpumalanga & Sun City (for with-activities booking type) */}
        {bookingType === 'with-activities' && destination && getCustomHotelsForDestination(destination).length > 0 && hasSearched && (
          <div className="max-w-4xl mx-auto mt-6 animate-fade-in">
            <div className="bg-amber-50 border-2 border-amber-200 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-amber-900">🏨 Custom Hotels (Better Rates Available)</h4>
                <Button
                  variant={showCustomHotels ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCustomHotels(!showCustomHotels)}
                  className="bg-amber-500 hover:bg-amber-600 text-white border-0"
                >
                  {showCustomHotels ? 'Hide Custom Hotels' : 'Select Custom Hotels'}
                </Button>
              </div>
              <p className="text-sm text-amber-700 mb-4">
                We have special rates for these hotels. Select any hotel and enter the total accommodation cost quoted to you.
              </p>
              
              {showCustomHotels && (
                <>
                  {/* Mode Toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={customHotelMode === 'preset' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCustomHotelMode('preset')}
                      className={customHotelMode === 'preset' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    >
                      <Hotel className="w-4 h-4 mr-1" />
                      Preset Hotels
                    </Button>
                    <Button
                      variant={customHotelMode === 'bulk' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCustomHotelMode('bulk')}
                      className={customHotelMode === 'bulk' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Parse Large Copy (up to 20 hotels)
                    </Button>
                  </div>

                  {customHotelMode === 'preset' ? (
                    <>
                      <div className="space-y-3 mb-6">
                        <p className="text-sm font-medium text-gray-700">Select hotels to get custom quotes:</p>
                        <div className="flex flex-wrap gap-2">
                          {getCustomHotelsForDestination(destination).map((hotel) => (
                            <label
                              key={hotel}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                selectedCustomHotels.includes(hotel)
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Checkbox
                                checked={selectedCustomHotels.includes(hotel)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCustomHotels([...selectedCustomHotels, hotel]);
                                  } else {
                                    setSelectedCustomHotels(selectedCustomHotels.filter(h => h !== hotel));
                                  }
                                }}
                              />
                              <span className="text-sm">{hotel}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {selectedCustomHotels.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-700">Enter accommodation costs:</h5>
                          {selectedCustomHotels.map((hotelName) => (
                            <CustomHotelCard
                              key={hotelName}
                              hotelName={hotelName}
                              rooms={rooms}
                              adults={adults}
                              children={children}
                              nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1}
                              onCalculate={(details) => {
                                const selectedPackages = packages.filter(p => packageIds.includes(p.id));
                                if (selectedPackages.length > 0) {
                                  setCustomHotelQuotes(prev => {
                                    // Remove existing quotes for this hotel, then add new ones for ALL selected packages
                                    const filtered = prev.filter(q => q.hotelName !== details.hotelName);
                                    const newQuotes = selectedPackages.map(pkg => ({
                                      ...details,
                                      packageId: pkg.id,
                                      packageName: pkg.name,
                                      checkInDate: checkIn,
                                      checkOutDate: checkOut,
                                    }));
                                    return [...filtered, ...newQuotes];
                                  });
                                  toast.success(`Quote added for ${details.hotelName} (${selectedPackages.length} package${selectedPackages.length > 1 ? 's' : ''})`);
                                } else {
                                  toast.error('Please select a package first');
                                }
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <BulkHotelParser
                      nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1}
                      adults={adults}
                      children={children}
                      rooms={rooms}
                      packageIds={packageIds}
                      packages={packages}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onHotelsAdded={(newQuotes) => {
                        setCustomHotelQuotes(prev => [...prev, ...newQuotes]);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Quote Results */}
        {(liveHotels.length > 0 || (hasSearched && customHotelQuotes.length > 0) || (hasSearched && bookingType === 'with-activities' && destination && getCustomHotelsForDestination(destination).length > 0)) && (bookingType === 'accommodation-only' || packageIds.length > 0) ? (
          <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              {bookingType === 'accommodation-only' ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-semibold text-gray-900">
                      Available Hotels ({liveHotels.length})
                    </h3>
                    <p className="text-sm text-gray-500">
                      {filterCheapest ? 'Sorted by price (cheapest first)' : 'Available options'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {liveHotels.map((hotel, index) => (
                      <AccommodationOnlyCard
                        key={hotel.code || index}
                        hotel={hotel}
                        rooms={rooms}
                        adults={adults}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {liveHotels.length > 0 ? (
                    <LiveHotelQuotes
                      hotels={liveHotels}
                      packages={packages.filter(p => packageIds.includes(p.id))}
                      nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                      adults={adults}
                      children={children}
                      childrenAgesString={childrenAges}
                      rooms={rooms}
                      budget={budget}
                    />
                  ) : (
                    <div className="text-center py-6 mb-6 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-amber-800 font-medium">No hotels found via our system for this search.</p>
                      <p className="text-amber-700 text-sm mt-2">Use the custom hotels section above to generate a quote with your own hotel pricing.</p>
                    </div>
                  )}
                  
                  {/* Custom Hotel Quotes */}
                  {customHotelQuotes.length > 0 && (
                    <div className="mt-8 pt-6 border-t-2 border-amber-200">
                      <h3 className="text-xl font-display font-semibold text-amber-900 mb-4">
                        🏨 Custom Hotel Quotes ({customHotelQuotes.length})
                      </h3>
                      
                      {/* Export/Share Actions */}
                      <CustomQuoteActions
                        quotes={customHotelQuotes}
                        packages={packages}
                        adults={adults}
                        children={children}
                        childrenAges={childrenAges}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        destination={destination}
                      />
                      
                      <div className="space-y-4">
                        {customHotelQuotes.map((quote, index) => {
                          const selectedPkg = packages.find(p => p.id === quote.packageId);
                          const nightsCount = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
                          
                          // Calculate package costs
                          const packageCostPerAdult = selectedPkg?.basePrice || 0;
                          const totalPackageCost = packageCostPerAdult * adults;
                          
                          // Service fees (tiered)
                          let serviceFeePerAdult = 1000;
                          if (adults >= 10) serviceFeePerAdult = 750;
                          else if (adults >= 4) serviceFeePerAdult = 800;
                          else if (adults >= 2) serviceFeePerAdult = 850;
                          const totalServiceFees = serviceFeePerAdult * adults;
                          
                          // Kids costs if any
                          const kidsAges = childrenAges.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a) && a >= 4 && a <= 16);
                          let kidsPackageCost = 0;
                          let kidsFees = 0;
                          const kidFeePerChild = adults >= 2 ? 150 : 300;
                          if (selectedPkg && kidsAges.length > 0) {
                            kidsAges.forEach(age => {
                              // Check for tiered pricing first
                              if (selectedPkg.kidsPriceTiers && selectedPkg.kidsPriceTiers.length > 0) {
                                const tier = selectedPkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
                                if (tier) {
                                  kidsPackageCost += tier.price;
                                } else if (selectedPkg.kidsPrice) {
                                  kidsPackageCost += selectedPkg.kidsPrice;
                                }
                              } else if (selectedPkg.kidsPrice) {
                                kidsPackageCost += selectedPkg.kidsPrice;
                              }
                              kidsFees += kidFeePerChild;
                            });
                          }
                          
                          const grandTotal = quote.totalCost + totalPackageCost + totalServiceFees + kidsPackageCost + kidsFees;
                          const perPerson = Math.round(grandTotal / (adults + kidsAges.length));
                          
                          return (
                            <Card key={index} className="border-2 border-amber-200 bg-amber-50">
                              <CardContent className="p-4 md:p-5">
                                <div className="flex justify-between items-start gap-4">
                                  {/* Left side - Hotel details */}
                                  <div className="flex-1 min-w-0">
                                    {/* Room type badge */}
                                    {quote.roomType && (
                                      <span className="inline-block text-xs font-medium text-white bg-primary px-2 py-1 rounded mb-2">
                                        {quote.roomType}
                                      </span>
                                    )}
                                    
                                    {/* Hotel name */}
                                    <h4 className="font-semibold text-lg text-amber-900 mb-1">{quote.hotelName}</h4>
                                    
                                    {/* Availability note / room details */}
                                    <div className="space-y-0.5 text-sm text-muted-foreground mb-2">
                                      {quote.recommendation && (
                                        <p>{quote.recommendation}</p>
                                      )}
                                      {quote.bedConfig && (
                                        <p>{quote.bedConfig}</p>
                                      )}
                                    </div>
                                    
                                    {/* Meal plan */}
                                    {quote.mealPlan && (
                                      <p className="text-green-600 font-medium text-sm mb-2">✓ {quote.mealPlan}</p>
                                    )}
                                    
                                    {/* Package name */}
                                    <p className="text-amber-700 font-semibold text-sm mb-1">{quote.packageName}</p>
                                    
                                    {/* Check-in/Check-out dates */}
                                    <p className="text-muted-foreground text-sm mb-0.5">
                                      Check-in: {new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} → Check-out: {new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    
                                    {/* Stay details */}
                                    <p className="text-muted-foreground text-sm">
                                      {nightsCount} night{nightsCount !== 1 ? 's' : ''}, {adults} adult{adults !== 1 ? 's' : ''}{children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}
                                    </p>
                                    
                                    {/* Package Inclusions */}
                                    {selectedPkg && selectedPkg.activitiesIncluded.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-amber-200">
                                        <p className="text-muted-foreground text-sm font-medium mb-2">Package Inclusions:</p>
                                        <div className="space-y-1">
                                          <p className="flex items-center gap-2 text-green-600 text-sm">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>Accommodation</span>
                                          </p>
                                          {selectedPkg.activitiesIncluded.map((activity, i) => (
                                            <p key={i} className="flex items-center gap-2 text-green-600 text-sm">
                                              <Check className="w-4 h-4 shrink-0" />
                                              <span>{activity}</span>
                                            </p>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Cost Breakdown */}
                                    <div className="mt-3 pt-3 border-t border-amber-200">
                                      <p className="text-muted-foreground text-sm font-medium mb-2">Cost Breakdown:</p>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Total Accommodation Cost:</span>
                                          <span className="font-medium">{formatCurrency(quote.totalCost)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Package Activity Cost ({adults} adult{adults !== 1 ? 's' : ''}):</span>
                                          <span className="font-medium">{formatCurrency(totalPackageCost)}</span>
                                        </div>
                                        {kidsAges.length > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Package Activity Cost ({kidsAges.length} child{kidsAges.length !== 1 ? 'ren' : ''}):</span>
                                            <span className="font-medium">{formatCurrency(kidsPackageCost)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Service Fee ({adults} adult{adults !== 1 ? 's' : ''} × {formatCurrency(serviceFeePerAdult)}):</span>
                                          <span className="font-medium">{formatCurrency(totalServiceFees)}</span>
                                        </div>
                                        {kidsAges.length > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Service Fee ({kidsAges.length} child{kidsAges.length !== 1 ? 'ren' : ''} × {formatCurrency(kidFeePerChild)}):</span>
                                            <span className="font-medium">{formatCurrency(kidsFees)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Right side - Price and Edit */}
                                  <div className="text-right shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingQuoteIndex(index)}
                                      className="h-7 text-amber-700 hover:text-amber-900 hover:bg-amber-100 mb-2"
                                    >
                                      <Pencil className="w-3 h-3 mr-1" />
                                      Edit
                                    </Button>
                                    
                                    {kidsAges.length === 0 && (
                                      <>
                                        <p className="text-2xl font-bold text-primary">
                                          {formatCurrency(perPerson)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Total Package Price Per Person</p>
                                      </>
                                    )}
                                    
                                    <p className={kidsAges.length > 0 ? "text-2xl font-bold text-primary" : "text-lg font-semibold text-amber-800 mt-1"}>
                                      {formatCurrency(grandTotal)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{kidsAges.length > 0 ? 'Grand Total' : 'Grand Total'}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      
                      {/* Edit Form */}
                      {editingQuoteIndex !== null && customHotelQuotes[editingQuoteIndex] && (
                        <div className="mt-4 p-4 border-2 border-amber-400 rounded-lg bg-amber-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-amber-900">
                              Edit: {customHotelQuotes[editingQuoteIndex].hotelName}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingQuoteIndex(null)}
                              className="text-amber-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <CustomHotelCard
                            hotelName={customHotelQuotes[editingQuoteIndex].hotelName}
                            rooms={rooms}
                            adults={adults}
                            children={children}
                            nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) || 1}
                            isEditing={true}
                            initialData={customHotelQuotes[editingQuoteIndex]}
                            onCancelEdit={() => setEditingQuoteIndex(null)}
                            onCalculate={(details) => {
                              // When editing, keep the same package as the original quote
                              const originalQuote = customHotelQuotes[editingQuoteIndex];
                              setCustomHotelQuotes(prev => {
                                const updated = [...prev];
                                updated[editingQuoteIndex] = {
                                  ...details,
                                  packageId: originalQuote.packageId,
                                  packageName: originalQuote.packageName,
                                  checkInDate: checkIn,
                                  checkOutDate: checkOut,
                                };
                                return updated;
                              });
                              setEditingQuoteIndex(null);
                              toast.success(`Quote updated for ${details.hotelName}`);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : familyQuotes.length > 0 ? (
          <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="space-y-8">
                {familyQuotes.map((fq, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h3 className="text-xl font-display font-semibold text-primary">
                        {fq.parentName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {fq.quotes.length} options
                      </p>
                    </div>
                    <QuoteList quotes={fq.quotes} />
                  </div>
                ))}
                {/* Grand Total Section */}
                <div className="mt-6 pt-4 border-t-2 border-primary/20">
                  <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900">Combined Grand Total (Cheapest Options)</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(familyQuotes.reduce((sum, fq) => sum + (fq.quotes[0]?.totalForGroup || 0), 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : quotes.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-semibold text-gray-900">
                  Available Options ({quotes.length})
                </h3>
                <p className="text-sm text-gray-500">
                  Sorted by price (cheapest first)
                </p>
              </div>
              <QuoteList quotes={quotes} />
            </div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

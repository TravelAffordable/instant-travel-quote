import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Sparkles, MapPin, Star, Calculator, BedDouble, ChevronDown } from 'lucide-react';
import { 
  destinations, 
  packages, 
  calculateAllQuotes,
  getPackagesByDestination, 
  type QuoteResult 
} from '@/data/travelData';
import { QuoteList } from './QuoteList';
import { LiveHotelQuotes } from './LiveHotelQuotes';
import { useHotelbedsSearch } from '@/hooks/useHotelbedsSearch';
import { toast } from 'sonner';

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
  
  // Live hotel search
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

  const availablePackages = destination ? getPackagesByDestination(destination) : [];

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setQuotes([]);
    setFamilyQuotes([]);
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
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut || !budget) {
      toast.error('Please fill in all required fields including your budget');
      return;
    }

    setIsCalculating(true);
    clearHotels();

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
        setQuotes([]);
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
        });

        if (result && result.length > 0) {
          setQuotes([]);
          setFamilyQuotes([]);
          toast.success(`${result.length} hotels found!`);
        } else {
          toast.info('No hotels available for this search. Please try different dates or contact us.');
        }
      } catch (error) {
        console.error('Live hotel search error:', error);
        toast.error('Could not fetch hotels. Please try again.');
      }
      setIsCalculating(false);
    }
  };

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const today = new Date().toISOString().split('T')[0];
  
  // Check if 4-sleeper room will be applied
  const totalGuests = adults + children;
  const guestsPerRoom = totalGuests / rooms;
  const will4SleeperApply = guestsPerRoom >= 3 && guestsPerRoom <= 4;

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

              {/* Row 2: Package, Adults, Kids, Rooms */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-sm font-medium text-gray-700">Package/s *</Label>
                  <p className="text-xs text-muted-foreground mb-1">
                    Please select the package/s you'd like quote for by selecting in the dropdown
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
                            onClick={() => togglePackageSelection(pkg.id)}
                          >
                            <Checkbox
                              checked={packageIds.includes(pkg.id)}
                              onCheckedChange={() => togglePackageSelection(pkg.id)}
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                  <Select value={adults.toString()} onValueChange={v => setAdults(parseInt(v))}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Kids (Ages)</Label>
                  <Input
                    placeholder="e.g. 5, 8"
                    value={childrenAges}
                    onChange={e => {
                      setChildrenAges(e.target.value);
                      const count = e.target.value.split(',').filter(a => a.trim()).length;
                      setChildren(count);
                    }}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Rooms *</Label>
                  <Select value={rooms.toString()} onValueChange={v => setRooms(parseInt(v))}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
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

              {/* 4-Sleeper Notice */}
              {will4SleeperApply && !isFamilySplitMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <BedDouble className="w-4 h-4" />
                    <span>4-Sleeper room rate will apply (+30% per night)</span>
                  </p>
                </div>
              )}

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

        {/* Quote Results */}
        {liveHotels.length > 0 && packageIds.length > 0 ? (
          <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
              <LiveHotelQuotes
                hotels={liveHotels}
                pkg={packages.find(p => packageIds.includes(p.id))!}
                nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
                adults={adults}
                children={children}
                childrenAges={childrenAges.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a) && a >= 3 && a <= 17)}
                rooms={rooms}
                budget={budget}
              />
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
                      {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(
                        familyQuotes.reduce((sum, fq) => sum + (fq.quotes[0]?.totalForGroup || 0), 0)
                      )}
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

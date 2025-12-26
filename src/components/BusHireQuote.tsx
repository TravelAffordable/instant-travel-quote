import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Users, Calculator, ChevronDown, Check, Search, Building2, DollarSign } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { toast } from 'sonner';
import { useHotelbedsSearch } from '@/hooks/useHotelbedsSearch';
import { BusHireHotelCard } from './BusHireHotelCard';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

type UserType = 'bus-company' | 'group-organizer' | null;

export function BusHireQuote() {
  const [userType, setUserType] = useState<UserType>(null);
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(20);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [rooms, setRooms] = useState(10);
  const [busQuoteAmount, setBusQuoteAmount] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { searchHotels, hotels: liveHotels, isLoading: isSearchingHotels, clearHotels } = useHotelbedsSearch();

  const availablePackages = destination ? getPackagesByDestination(destination) : [];
  const selectedPackages = packages.filter(p => packageIds.includes(p.id));

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    clearHotels();
    setHasSearched(false);
  }, [destination]);

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

  // Update children ages array when children count changes
  useEffect(() => {
    setChildrenAges(prev => {
      if (children > prev.length) {
        return [...prev, ...Array(children - prev.length).fill(5)];
      }
      return prev.slice(0, children);
    });
  }, [children]);

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };


  const handleSearch = async () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    setHasSearched(true);

    // Search for hotels using Hotelbeds API
    await searchHotels({
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      childrenAges,
      rooms,
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  const busAmount = parseFloat(busQuoteAmount) || 0;
  const destinationName = destinations.find(d => d.id === destination)?.name || destination;

  // Filter hotels by budget
  const budgetNumber = maxBudget ? parseInt(maxBudget.replace(/[^\d]/g, '')) : null;
  const filteredHotels = budgetNumber 
    ? liveHotels.filter(hotel => hotel.minRate <= budgetNumber)
    : liveHotels;

  if (!userType) {
    return (
      <section id="bus-hire" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 mb-4">
              <Bus className="w-4 h-4" />
              <span className="text-sm font-semibold">Bus Hire & Group Transport</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Add Transport to Your Package Quote
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Are you a bus hire company or a group tour organizer? Select your type below to get started with a customized quote including accommodation and activities.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setUserType('bus-company')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <Bus className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I represent a Bus Hire Company
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Add your transport quote to our curated packages with accommodation and provide complete trip quotes to your clients
                  </p>
                </div>
              </button>

              <button
                onClick={() => setUserType('group-organizer')}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-green-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                    <Users className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    I am a Group Tour Organizer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Looking for accommodation, fun activities, and need to include bus hire in your group quote
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="bus-hire" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* User Type Toggle */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={userType === 'bus-company' ? 'default' : 'outline'}
            onClick={() => {
              setUserType('bus-company');
              clearHotels();
              setHasSearched(false);
            }}
            className="gap-2"
          >
            <Bus className="w-4 h-4" />
            I represent a Bus Hire Company
          </Button>
          <Button
            variant={userType === 'group-organizer' ? 'default' : 'outline'}
            onClick={() => {
              setUserType('group-organizer');
              clearHotels();
              setHasSearched(false);
            }}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            I am a Group Tour Organizer
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setUserType(null);
              clearHotels();
              setHasSearched(false);
            }}
            className="text-gray-500"
          >
            Change Selection
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
            {userType === 'bus-company' 
              ? 'Bus Company Quote Calculator' 
              : 'Group Tour Quote Calculator'}
          </h2>
          <p className="text-gray-600">
            {userType === 'bus-company'
              ? 'Enter your bus transport quote and search for hotels to generate complete quotes for your clients'
              : 'Search for accommodation and activities, then add your transport costs for a complete group quote'}
          </p>
        </div>

        {/* Quote Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="space-y-5">
              {/* Row 1: Destination, Check In, Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Destination *</Label>
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

              {/* Row 2: Package Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Package/s *</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Choose one or more activity packages to include in your group quote
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
                          ? (destination ? 'Select packages...' : 'Select destination first')
                          : `${packageIds.length} package${packageIds.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[300px] p-2" align="start">
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {availablePackages.map(pkg => (
                        <div
                          key={pkg.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                            packageIds.includes(pkg.id) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => togglePackageSelection(pkg.id)}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            packageIds.includes(pkg.id) ? 'bg-primary border-primary' : 'border-gray-300'
                          }`}>
                            {packageIds.includes(pkg.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.duration} • From R{pkg.basePrice}/person</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 3: Group Size & Rooms */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                  <Input
                    type="number"
                    value={adults}
                    onChange={e => setAdults(parseInt(e.target.value) || 0)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Children</Label>
                  <Input
                    type="number"
                    value={children}
                    onChange={e => setChildren(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Rooms *</Label>
                  <Input
                    type="number"
                    value={rooms}
                    onChange={e => setRooms(parseInt(e.target.value) || 1)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    <Bus className="w-4 h-4 inline mr-1" />
                    Bus Quote (R)
                  </Label>
                  <Input
                    type="number"
                    value={busQuoteAmount}
                    onChange={e => setBusQuoteAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Child Age Selection */}
              {children > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Child Ages (3-17 years)</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: children }, (_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Child {i + 1}:</span>
                        <Select 
                          value={childrenAges[i]?.toString() || '5'} 
                          onValueChange={v => {
                            const newAges = [...childrenAges];
                            newAges[i] = parseInt(v);
                            setChildrenAges(newAges);
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
                    ))}
                  </div>
                </div>
              )}

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearchingHotels}
                className="w-full h-12 text-lg gap-2"
                size="lg"
              >
                {isSearchingHotels ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Searching Hotels...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Hotels & Calculate Quotes
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
              {liveHotels.length === 0 ? (
                <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
                  <CardContent className="py-12 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
                    <p className="text-muted-foreground text-sm">
                      No hotels found for this destination and dates. Please try different dates or contact us directly for assistance.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Disclaimer */}
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please note that the images shown are for illustration purposes only. The price includes 
                      hotel accommodation, all activities associated with the package, and your bus transport quote.
                      Select your preferred option and contact us via email or WhatsApp for an accurate quote with confirmed availability.
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Select any package below to download or send for booking confirmation.
                    </p>
                  </div>

                  {/* Budget Filter */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <Label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      Filter by accommodation budget (Optional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. R5000 - Enter max accommodation amount to filter hotels"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      className="h-10 bg-background"
                    />
                    {budgetNumber && filteredHotels.length !== liveHotels.length && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Showing {filteredHotels.length} of {liveHotels.length} hotels within your budget
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Quote Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Destination</p>
                        <p className="font-medium text-blue-900">{destinationName}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Duration</p>
                        <p className="font-medium text-blue-900">{nights} night{nights !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Group Size</p>
                        <p className="font-medium text-blue-900">{adults} adults{children > 0 ? ` + ${children} children` : ''}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Bus Transport</p>
                        <p className="font-medium text-blue-900">{busAmount > 0 ? formatCurrency(busAmount) : 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Sections */}
                  {selectedPackages.map((pkg) => (
                    <div key={pkg.id} className="space-y-4">
                      {/* Package Header */}
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h3 className="text-lg font-display font-bold text-primary uppercase">
                          {pkg.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} available
                        </p>
                      </div>

                      {/* Hotel Cards */}
                      {filteredHotels.length === 0 ? (
                        <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
                          <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground text-sm">
                              No hotels match your budget. Try increasing your budget amount or remove the filter to see all options.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {filteredHotels.map((hotel) => (
                            <BusHireHotelCard
                              key={`${pkg.id}-${hotel.code}`}
                              hotel={hotel}
                              pkg={pkg}
                              nights={nights}
                              adults={adults}
                              children={children}
                              childrenAges={childrenAges}
                              rooms={rooms}
                              busQuoteAmount={busAmount}
                              destinationName={destinationName}
                              checkIn={checkIn}
                              checkOut={checkOut}
                              userType={userType}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

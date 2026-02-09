import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Bus, Users, Calculator, ChevronDown, Check, Building2, Hotel } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { toast } from 'sonner';
import { useRMSHotels } from '@/hooks/useRMSHotels';
import { RMSHotelQuotes } from './RMSHotelQuotes';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { calculateChildServiceFees as calculateChildServiceFeesUtil } from '@/lib/childServiceFees';

type UserType = 'bus-company' | 'group-organizer' | null;

// Destinations that use RMS database hotels
const RMS_DESTINATIONS = ['harties', 'magalies', 'durban', 'cape-town', 'sun-city', 'mpumalanga', 'vaal', 'vaal-river', 'bela-bela'];

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
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showHotelAccommodation, setShowHotelAccommodation] = useState(false);

  // RMS hotel search
  const { searchHotels: searchRMSHotels, hotels: rmsHotels, isLoading: isSearchingRMS, clearHotels: clearRMSHotels } = useRMSHotels();

  const availablePackages = destination ? getPackagesByDestination(destination) : [];
  const selectedPackages = packages.filter(p => packageIds.includes(p.id));

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    clearRMSHotels();
    setHasCalculated(false);
    setShowHotelAccommodation(false);
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

  const totalPeople = adults + children;
  const busAmount = parseFloat(busQuoteAmount) || 0;
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // Calculate the activities-only quote (no hotel)
  const activitiesQuote = useMemo(() => {
    if (selectedPackages.length === 0) return null;

    let totalActivitiesCost = 0;

    selectedPackages.forEach(pkg => {
      // Adult package cost
      totalActivitiesCost += pkg.basePrice * adults;

      // Kids package cost
      if (children > 0 && childrenAges.length > 0) {
        childrenAges.forEach(age => {
          if (age >= 4 && age <= 16) {
            if (pkg.kidsPriceTiers && pkg.kidsPriceTiers.length > 0) {
              const tier = pkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
              if (tier) {
                totalActivitiesCost += tier.price;
              } else if (pkg.kidsPrice) {
                totalActivitiesCost += pkg.kidsPrice;
              }
            } else if (pkg.kidsPrice) {
              totalActivitiesCost += pkg.kidsPrice;
            }
          }
        });
      } else if (children > 0 && pkg.kidsPrice) {
        totalActivitiesCost += pkg.kidsPrice * children;
      }
    });

    // Service fees
    const totalPeopleCount = adults + childrenAges.length;
    let serviceFees = 0;
    if (totalPeopleCount >= 25) {
      serviceFees = adults * 400 + calculateChildServiceFeesUtil(adults, childrenAges);
    } else {
      let adultFeePerPerson = 0;
      if (adults === 1) adultFeePerPerson = 1000;
      else if (adults >= 2 && adults <= 3) adultFeePerPerson = 850;
      else if (adults >= 4 && adults <= 9) adultFeePerPerson = 800;
      else if (adults >= 10) adultFeePerPerson = 750;
      serviceFees = adults * adultFeePerPerson + calculateChildServiceFeesUtil(adults, childrenAges);
    }

    const activitiesAndServiceTotal = totalActivitiesCost + serviceFees;
    const combinedTotal = activitiesAndServiceTotal + busAmount;
    const perPerson = totalPeople > 0 ? roundToNearest10(combinedTotal / totalPeople) : 0;

    return {
      busAmount,
      combinedTotal: roundToNearest10(combinedTotal),
      perPerson,
    };
  }, [selectedPackages, adults, children, childrenAges, busAmount, totalPeople]);

  const handleCalculate = () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }
    setHasCalculated(true);
    setShowHotelAccommodation(false);
    clearRMSHotels();
  };

  const handleAddHotelAccommodation = async () => {
    setShowHotelAccommodation(true);

    // Search for hotels using RMS
    if (RMS_DESTINATIONS.includes(destination)) {
      const result = await searchRMSHotels({
        destination,
        checkIn,
        checkOut,
        adults,
        children,
        rooms,
      });

      if (result && result.length > 0) {
        toast.success(`${result.length} hotels found!`);
      } else {
        toast.info('No hotels available for this destination. Please contact us directly.');
      }
    } else {
      toast.info('Hotel options for this destination are coming soon. Please contact us directly.');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const destinationName = destinations.find(d => d.id === destination)?.name || destination;

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
              clearRMSHotels();
              setHasCalculated(false);
              setShowHotelAccommodation(false);
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
              clearRMSHotels();
              setHasCalculated(false);
              setShowHotelAccommodation(false);
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
              clearRMSHotels();
              setHasCalculated(false);
              setShowHotelAccommodation(false);
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
              ? 'Enter your bus transport quote and select fun activity packages to generate group quotes for your clients'
              : 'Select your activities and add your transport costs for a complete group quote'}
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
                    value={adults === 0 ? '' : adults}
                    onChange={e => setAdults(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Children</Label>
                  <Input
                    type="number"
                    value={children === 0 ? '' : children}
                    onChange={e => setChildren(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
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
                  <Label className="text-sm font-medium text-gray-700">Child Ages (0-17 years)</Label>
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
                            {Array.from({ length: 18 }, (_, age) => age).map(age => (
                              <SelectItem key={age} value={age.toString()}>{age} yrs</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <Button
                onClick={handleCalculate}
                className="w-full h-12 text-lg gap-2"
                size="lg"
              >
                <Calculator className="w-5 h-5" />
                Calculate Transport and Fun Activities
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {hasCalculated && activitiesQuote && (
            <div className="mt-8 space-y-6 animate-fade-in">
              {/* Bus + Activities Quote Summary */}
              {selectedPackages.map(pkg => (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  {/* Package Header */}
                  <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mb-6">
                    <h3 className="text-xl font-display font-bold text-primary uppercase text-center">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 text-center">
                      {destinationName} • {nights} night{nights !== 1 ? 's' : ''} • {adults} adult{adults !== 1 ? 's' : ''}{children > 0 ? ` + ${children} child${children !== 1 ? 'ren' : ''}` : ''}
                    </p>
                  </div>

                  {/* Package Inclusions */}
                  <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                    <p className="text-sm font-semibold text-foreground mb-3">Package Inclusions:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {pkg.activitiesIncluded.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </div>
                      ))}
                      <div className="flex items-start gap-2 text-sm text-blue-600 font-medium">
                        <Bus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Bus Transport Included</span>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Price Display */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-blue-800 font-medium flex items-center gap-2">
                          <Bus className="w-5 h-5" />
                          Bus Transport Quote
                        </span>
                        <span className="font-bold text-blue-900">{formatCurrency(activitiesQuote.busAmount)}</span>
                      </div>

                      <div className="border-t-2 border-blue-300 pt-4">
                        <div className="flex justify-between items-center text-xl">
                          <span className="text-blue-800 font-semibold">Combined Total</span>
                          <span className="font-bold text-blue-900 text-2xl">{formatCurrency(activitiesQuote.combinedTotal)}</span>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">(Bus transport + activities for the group)</p>
                      </div>

                      <div className="border-t-2 border-blue-300 pt-4">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-blue-800 font-medium">Per Person</span>
                          <span className="font-bold text-primary text-2xl">{formatCurrency(activitiesQuote.perPerson)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Hotel Accommodation Button */}
              {!showHotelAccommodation && (
                <div className="text-center">
                  <Button
                    onClick={handleAddHotelAccommodation}
                    disabled={isSearchingRMS}
                    size="lg"
                    className="h-14 text-lg px-8 gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  >
                    {isSearchingRMS ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Searching Hotels...
                      </>
                    ) : (
                      <>
                        <Hotel className="w-6 h-6" />
                        Add Hotel Accommodation to Your Quote
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Hotel Accommodation Section */}
              {showHotelAccommodation && (
                <div className="animate-fade-in">
                  {rmsHotels.length > 0 ? (
                    <RMSHotelQuotes
                      hotels={rmsHotels}
                      packages={selectedPackages}
                      nights={nights}
                      adults={adults}
                      children={children}
                      childrenAgesString={childrenAges.join(',')}
                      rooms={rooms}
                      budget=""
                      busQuoteAmount={busAmount}
                    />
                  ) : isSearchingRMS ? (
                    <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
                      <CardContent className="py-12 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Searching for Hotels...</h3>
                        <p className="text-muted-foreground text-sm">
                          Finding the best accommodation options for your group.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
                      <CardContent className="py-12 text-center">
                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Hotels Found</h3>
                        <p className="text-muted-foreground text-sm">
                          No hotels found for this destination and dates. Please contact us directly for assistance.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

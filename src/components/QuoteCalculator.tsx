import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  destinations, 
  packages, 
  calculateAllQuotes,
  getPackagesByDestination,
  type QuoteResult 
} from '@/data/travelData';
import { CalendarDays, Users, Home, Package, Sparkles, Calculator, BedDouble } from 'lucide-react';
import { QuoteList } from './QuoteList';
import { LiveHotelQuotes } from './LiveHotelQuotes';
import { useHotelbedsSearch } from '@/hooks/useHotelbedsSearch';
import { toast } from 'sonner';

interface QuoteCalculatorProps {
  onQuoteGenerated?: (quote: QuoteResult) => void;
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

export function QuoteCalculator({ onQuoteGenerated }: QuoteCalculatorProps) {
  const [destination, setDestination] = useState('');
  const [packageId, setPackageId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<string>('');
  const [rooms, setRooms] = useState(1);
  const [budget, setBudget] = useState('');
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Live hotel search - using Hotelbeds API (pre-production)
  const { searchHotels, hotels: liveHotels, isLoading: isSearchingHotels, error: hotelError, clearHotels } = useHotelbedsSearch();
  
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

  // Reset package when destination changes
  useEffect(() => {
    setPackageId('');
    setQuotes([]);
    setFamilyQuotes([]);
    clearHotels();
  }, [destination]);
  

  // Show family split option when 4+ adults AND children
  useEffect(() => {
    const totalAdults = adults;
    const hasChildren = children > 0;
    setShowFamilySplitOption(totalAdults >= 4 && hasChildren);
    if (totalAdults < 4 || !hasChildren) {
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
    if (!destination || !packageId || !checkIn || !checkOut || !budget) {
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

    if (!isFamilySplitMode) {
      // Fetch live hotels from Hotelbeds
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
          toast.success(`${result.length} hotels found!`);
        } else if (hotelError) {
          toast.error(hotelError);
        } else {
          toast.info('No hotels available for this search. Please try different dates.');
        }
      } catch (error) {
        console.error('Live hotel search error:', error);
        toast.error('Could not fetch hotels. Please try again.');
      }
      setIsCalculating(false);
    } else if (isFamilySplitMode) {
      // Calculate quotes for each family separately (uses static data for now)
      setTimeout(() => {
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

          const results = calculateAllQuotes({
            destination,
            packageId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults: family.adults,
            children: family.children,
            childrenAges: familyAges,
            rooms: family.rooms,
            hotelType: 'affordable',
          });

          if (results.length > 0) {
            allFamilyQuotes.push({
              familyIndex: index + 1,
              parentName: family.parentName || `Family ${index + 1}`,
              quotes: results,
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
      }, 800);
    } else {
      // Standard static calculation
      setTimeout(() => {
        const results = calculateAllQuotes({
          destination,
          packageId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          adults,
          children,
          childrenAges: ages,
          rooms,
          hotelType: 'affordable',
        });

        if (results.length > 0) {
          setQuotes(results);
          setFamilyQuotes([]);
          onQuoteGenerated?.(results[0]);
          toast.success(`${results.length} quote options generated!`);
        } else {
          toast.error('Could not calculate quotes. Please check your selections.');
        }
        setIsCalculating(false);
      }, 800);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <Card className="border-0 shadow-soft bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-display">
            <Calculator className="w-6 h-6 text-primary" />
            Get Your Live Quote
          </CardTitle>
          <p className="text-muted-foreground text-sm">Fill in your travel details below</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Destination */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Home className="w-4 h-4 text-primary" />
              Destination *
            </Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Where would you like to go?" />
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

          {/* Package */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Package className="w-4 h-4 text-primary" />
              Package *
            </Label>
            <Select value={packageId} onValueChange={setPackageId} disabled={!destination}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={destination ? "Select a package" : "Select destination first"} />
              </SelectTrigger>
              <SelectContent className="max-w-[500px]">
                {availablePackages.map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id} className="whitespace-normal py-2">
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {packageId && (
              <p className="text-xs text-muted-foreground mt-1">
                {packages.find(p => p.id === packageId)?.description.slice(0, 120)}...
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="w-4 h-4 text-primary" />
                Check In *
              </Label>
              <Input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={today}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="w-4 h-4 text-primary" />
                Check Out *
              </Label>
              <Input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                min={checkIn || today}
                className="h-11"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-primary" />
                Adults *
              </Label>
              <Select value={adults.toString()} onValueChange={v => setAdults(parseInt(v))}>
                <SelectTrigger className="h-11">
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
              <Label className="text-sm font-medium">Children</Label>
              <Select value={children.toString()} onValueChange={v => setChildren(parseInt(v))}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rooms</Label>
              <Select value={rooms.toString()} onValueChange={v => setRooms(parseInt(v))}>
                <SelectTrigger className="h-11">
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

          {children > 0 && !isFamilySplitMode && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Children Ages (comma separated, 3-17 years)</Label>
              <Input
                placeholder="e.g. 5, 8, 12"
                value={childrenAges}
                onChange={e => setChildrenAges(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Ages 3-12: R200 once-off fee | Ages 13-17: R300 service fee</p>
            </div>
          )}

          {/* Family Split Option */}
          {showFamilySplitOption && !isFamilySplitMode && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground mb-2">
                If you are different families and each family would be paying separately, please click here:
              </p>
              <Button
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">How many families are you?</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsFamilySplitMode(false);
                    setFamilyQuotes([]);
                  }}
                  className="text-muted-foreground"
                >
                  Cancel Split
                </Button>
              </div>
              <Select value={numberOfFamilies.toString()} onValueChange={v => setNumberOfFamilies(parseInt(v))}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n} Families</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Family Forms */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {families.map((family, index) => (
                  <div key={index} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-primary">Family {index + 1}</h4>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Name of Parent</Label>
                      <Input
                        placeholder="Parent name"
                        value={family.parentName}
                        onChange={e => updateFamilyData(index, 'parentName', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Adults</Label>
                        <Select 
                          value={family.adults.toString()} 
                          onValueChange={v => updateFamilyData(index, 'adults', parseInt(v))}
                        >
                          <SelectTrigger className="h-9">
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
                        <Label className="text-xs">Kids</Label>
                        <Select 
                          value={family.children.toString()} 
                          onValueChange={v => updateFamilyData(index, 'children', parseInt(v))}
                        >
                          <SelectTrigger className="h-9">
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
                        <Label className="text-xs">Rooms</Label>
                        <Select 
                          value={family.rooms.toString()} 
                          onValueChange={v => updateFamilyData(index, 'rooms', parseInt(v))}
                        >
                          <SelectTrigger className="h-9">
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
                        <Label className="text-xs">Kids Ages (comma separated, 3-17)</Label>
                        <Input
                          placeholder="e.g. 5, 8"
                          value={family.childrenAges}
                          onChange={e => updateFamilyData(index, 'childrenAges', e.target.value)}
                          className="h-9"
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
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              My total budget for the trip is *
            </Label>
            <Input
              type="text"
              placeholder="e.g. R10,000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-11 bg-background border-input"
              required
            />
            <p className="text-xs text-muted-foreground">This helps us understand your preferences</p>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
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
        </CardContent>
      </Card>

      {/* Quote Results Section */}
      <div className="space-y-6">
        {/* Live Hotel Results */}
        {liveHotels.length > 0 && packageId ? (
          <LiveHotelQuotes
            hotels={liveHotels}
            pkg={packages.find(p => p.id === packageId)!}
            nights={Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))}
            adults={adults}
            children={children}
            childrenAges={childrenAges.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a) && a >= 3 && a <= 17)}
            rooms={rooms}
            budget={budget}
          />
        ) : familyQuotes.length > 0 ? (
          // Family split mode results
          <div className="space-y-8">
            {familyQuotes.map((fq, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-xl font-display font-semibold text-primary">
                    {fq.parentName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {fq.quotes.length} options
                  </p>
                </div>
                <QuoteList quotes={fq.quotes} onQuoteSelected={onQuoteGenerated} budget={budget} />
              </div>
            ))}
          </div>
        ) : quotes.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-semibold">
                Available Options ({quotes.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Sorted by price (cheapest first)
              </p>
            </div>
            <QuoteList quotes={quotes} onQuoteSelected={onQuoteGenerated} budget={budget} />
          </>
        ) : (
          <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background h-full flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Your Quotes Will Appear Here</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Fill in your travel details and click "Search Packages" to see all available hotel options sorted by price.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

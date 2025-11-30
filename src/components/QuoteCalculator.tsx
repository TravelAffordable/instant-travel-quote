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
  hotelTypeLabels,
  type QuoteResult 
} from '@/data/travelData';
import { CalendarDays, Users, Home, Package, Sparkles, Calculator, BedDouble } from 'lucide-react';
import { QuoteList } from './QuoteList';
import { toast } from 'sonner';

interface QuoteCalculatorProps {
  onQuoteGenerated?: (quote: QuoteResult) => void;
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
  const [hotelType, setHotelType] = useState<'very-affordable' | 'affordable' | 'premium'>('affordable');
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];

  // Reset package when destination changes
  useEffect(() => {
    setPackageId('');
    setQuotes([]);
  }, [destination]);

  // Reset quotes when hotel type changes
  useEffect(() => {
    setQuotes([]);
  }, [hotelType]);

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

  const handleCalculate = () => {
    if (!destination || !packageId || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCalculating(true);

    // Parse children ages
    const ages = childrenAges
      .split(',')
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a))
      .slice(0, children);

    // Ensure we have ages for all children
    while (ages.length < children) {
      ages.push(5); // Default age
    }

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
        hotelType,
      });

      if (results.length > 0) {
        setQuotes(results);
        onQuoteGenerated?.(results[0]);
        toast.success(`${results.length} quote options generated!`);
      } else {
        toast.error('Could not calculate quotes. Please check your selections.');
      }
      setIsCalculating(false);
    }, 800);
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <Card className="border-0 shadow-soft bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-display">
            <Calculator className="w-6 h-6 text-primary" />
            Get Your Instant Quote
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
              <SelectContent>
                {availablePackages.map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.id.toUpperCase()} - {pkg.shortName} - from {formatCurrency(pkg.basePrice)}
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

          {children > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Children Ages (comma separated)</Label>
              <Input
                placeholder="e.g. 5, 8, 12"
                value={childrenAges}
                onChange={e => setChildrenAges(e.target.value)}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Under 12: 50% off | Ages 12-17: 25% off</p>
            </div>
          )}

          {/* Hotel Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Accommodation Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['very-affordable', 'affordable', 'premium'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setHotelType(type)}
                  className={`px-3 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    hotelType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {hotelTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Sleeper Notice */}
          {will4SleeperApply && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <p className="text-sm text-accent-foreground flex items-center gap-2">
                <BedDouble className="w-4 h-4" />
                <span>4-Sleeper room rate will apply (+30% per night)</span>
              </p>
            </div>
          )}

          <Button
            onClick={handleCalculate}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Quote
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quote Results Section */}
      <div className="space-y-6">
        {quotes.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-semibold">
                Available Options ({quotes.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Sorted by price (cheapest first)
              </p>
            </div>
            <QuoteList quotes={quotes} onQuoteSelected={onQuoteGenerated} />
          </>
        ) : (
          <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background h-full flex items-center justify-center min-h-[400px]">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Your Quotes Will Appear Here</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Fill in your travel details and click "Calculate Quote" to see all available hotel options sorted by price.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

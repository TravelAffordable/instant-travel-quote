import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Sparkles, MapPin, Star, Users, CalendarDays, Home, Package, Calculator, BedDouble } from 'lucide-react';
import { 
  destinations, 
  packages, 
  calculateAllQuotes,
  getPackagesByDestination, 
  hotelTypeLabels,
  type QuoteResult 
} from '@/data/travelData';
import { QuoteList } from './QuoteList';
import { toast } from 'sonner';

interface HeroProps {
  onGetQuote: () => void;
}

export function Hero({ onGetQuote }: HeroProps) {
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
        <div className="text-center mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 text-secondary-foreground mb-6 animate-float">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">LIMITED TIME: Up to 30% OFF Selected Packages!</span>
          </div>

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
          <p className="text-white/90 text-lg font-medium mb-2 animate-slide-up" style={{ animationDelay: '0.25s' }}>
            Get Instant Quote by completing the search form below
          </p>
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
                  <Label className="text-sm font-medium text-gray-700">Package *</Label>
                  <Select value={packageId} onValueChange={setPackageId} disabled={!destination}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder={destination ? "Select Package" : "Select destination first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePackages.map(pkg => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.shortName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              {/* Row 3: Accommodation Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Accommodation Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['very-affordable', 'affordable', 'premium'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setHotelType(type)}
                      className={`px-3 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        hotelType === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 hover:border-primary/50 text-gray-700'
                      }`}
                    >
                      {hotelTypeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4-Sleeper Notice */}
              {will4SleeperApply && (
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
        {quotes.length > 0 && (
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

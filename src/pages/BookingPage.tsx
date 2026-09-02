import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { ArrowLeft, ArrowRight, BedDouble, CalendarIcon, Check, CheckCircle2, Clock, MapPin, Star, Users, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DestinationImageMenu } from '@/components/DestinationImageMenu';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DestinationTile } from '@/components/cards/DestinationTile';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { BookingSummary } from '@/components/common/BookingSummary';
import { ResponsiveImage } from '@/components/common/ResponsiveImage';
import { ErrorState } from '@/components/common/ErrorState';
import { catalogueDestinations, getCatalogueDestination } from '@/data/destinationCatalogue';
import { getHotelsByDestination, getPackagesByDestination, packages } from '@/data/travelData';
import { calculatePackagePrice } from '@/data/packagePricing';
import { classifyHotels } from '@/lib/accommodationTiers';
import { isGenericHotelName, getDurbanHotelStars } from '@/data/durbanHotelStars';
import { getUmhlangaHotelStars } from '@/data/umhlangaHotelStars';
import { getStayAvailability, isAvailabilityTracked } from '@/data/krugerAvailability';
import { cn } from '@/lib/utils';
import { mealBasis } from '@/lib/accommodationTiers';
import { trackBookingConversion } from '@/lib/adsConversion';
import { getGoldenMileStayTotal } from '@/data/goldenMileRateCalendar';



type Step = 'destination' | 'experience' | 'dates' | 'travellers' | 'accommodation' | 'review' | 'received';

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: 'destination', label: 'Destination' },
  { id: 'experience', label: 'Experience' },
  { id: 'dates', label: 'Dates' },
  { id: 'travellers', label: 'Travellers' },
  { id: 'accommodation', label: 'Stay' },
  { id: 'review', label: 'Review' },
];

const EXTRAS = [
  { id: 'airport-shuttle', label: 'Airport / home shuttle transfer', price: 450 },
  { id: 'spa', label: '60 minute full body massage', price: 550 },
  { id: 'photo', label: 'Holiday photo session', price: 750 },
];

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function BookingPage() {
  const [params] = useSearchParams();

  const [destinationSlug, setDestinationSlug] = useState(params.get('destination') ?? '');
  const [packageId, setPackageId] = useState(params.get('package') ?? '');
  const [oneDay, setOneDay] = useState(params.get('oneDay') === '1');
  const [tourDate, setTourDate] = useState<Date | undefined>(parseDate(params.get('date')));
  const [checkIn, setCheckIn] = useState<Date | undefined>(parseDate(params.get('checkIn')));
  const [checkOut, setCheckOut] = useState<Date | undefined>(parseDate(params.get('checkOut')));
  const [adults, setAdults] = useState(Number(params.get('adults') ?? 2) || 2);
  const [infants, setInfants] = useState(Number(params.get('c02') ?? 0) || 0);
  const [kids, setKids] = useState(Number(params.get('c312') ?? 0) || 0);
  const [teens, setTeens] = useState(Number(params.get('c1317') ?? 0) || 0);
  const [hotelId, setHotelId] = useState<string>();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [rooms, setRooms] = useState(1);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [paymentOption, setPaymentOption] = useState<'50%' | 'full' | 'quote'>('50%');
  const [promoCode, setPromoCode] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [reference, setReference] = useState<string>();
  const [budgetInput, setBudgetInput] = useState('');
  const [budget, setBudget] = useState<number | null>(null);
  const [budgetVisibleCount, setBudgetVisibleCount] = useState(4);
  const [budgetError, setBudgetError] = useState(false);


  const destination = destinationSlug ? getCatalogueDestination(destinationSlug) : undefined;
  const destinationPackages = destination?.destinationId
    ? getPackagesByDestination(destination.destinationId)
    : [];
  const pkg = packages.find((p) => p.id === packageId);

  const initialStep: Step = !destination
    ? 'destination'
    : !pkg
      ? 'experience'
      : 'dates';
  const [step, setStep] = useState<Step>(initialStep);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const nights = useMemo(() => {
    if (oneDay) return 0;
    if (checkIn && checkOut) return Math.max(1, differenceInCalendarDays(checkOut, checkIn));
    return 2;
  }, [oneDay, checkIn, checkOut]);

  const childrenAges = useMemo(
    () => [
      ...Array.from({ length: infants }, () => 1),
      ...Array.from({ length: kids }, () => 8),
      ...Array.from({ length: teens }, () => 15),
    ],
    [infants, kids, teens],
  );

  const packagePricing = pkg ? calculatePackagePrice(pkg.id, { adults, childrenAges }) : null;
  const packageTotal = packagePricing?.total ?? 0;

  const hotels = (destination?.destinationId ? getHotelsByDestination(destination.destinationId) : [])
    .filter((h) => !isGenericHotelName(h.name))
    .map((h) => {
      const stars = getDurbanHotelStars(h.name) ?? getUmhlangaHotelStars(h.name);
      return stars == null ? h : { ...h, rating: stars };
    });
  const tierMap = useMemo(() => classifyHotels(hotels), [hotels]);
  const totalGuests = adults + kids + teens;

  // Golden Mile (Durban beachfront) hotels are priced night-by-night from the
  // seasonal rate calendar; every other property keeps its flat nightly rate.
  const stayRoomCost = (hotelName: string, hotelPerNight: number) =>
    getGoldenMileStayTotal(hotelName, checkIn, Math.max(1, nights), hotelPerNight);

  const hotelPrice = (hotelPerNight: number, capacity: number, hotelName = '') => {
    const roomCount = Math.max(rooms, Math.ceil(totalGuests / Math.max(1, capacity)));
    return stayRoomCost(hotelName, hotelPerNight) * Math.max(1, roomCount);
  };


  const roomsNeededFor = (capacity: number) =>
    Math.max(rooms, Math.ceil(totalGuests / Math.max(1, capacity)));

  const isHotelAvailable = (hotelName: string, capacity: number) => {
    if (!isAvailabilityTracked(hotelName)) return true;
    return getStayAvailability(checkIn, Math.max(1, nights), roomsNeededFor(capacity)).available;
  };

  // Guests per room drives which room capacities we show:
  // 2 guests / 1 room -> 2-sleepers; 4 guests / 1 room -> 4-sleepers;
  // 4 guests / 2 rooms -> 2-sleepers, quoted as 2 rooms.
  const perRoomGuests = Math.max(1, Math.ceil(totalGuests / Math.max(1, rooms)));
  const capacityMatched = (() => {
    const fitting = hotels.filter((h) => (h.capacity ?? 2) >= perRoomGuests);
    const exact = fitting.filter((h) => (h.capacity ?? 2) === perRoomGuests);
    return exact.length > 0 ? exact : fitting;
  })();

  const availableHotels = capacityMatched.filter((h) => isHotelAvailable(h.name, h.capacity ?? 2));
  const soldOutCount = hotels.length - availableHotels.length;
  // Stays that comfortably fit the whole group in one unit show first (cheapest first),
  // smaller units that would need multiple rooms fall to the bottom.
  const visibleHotels = availableHotels
    .slice()
    .sort((a, b) => {
      const fits = (h: typeof a) => ((h.capacity ?? 2) >= Math.max(1, totalGuests) ? 0 : 1);
      return (
        fits(a) - fits(b) ||
        stayRoomCost(a.name, a.pricePerNight) - stayRoomCost(b.name, b.pricePerNight)
      );
    });

  // Holiday price for a stay = package price + accommodation for the whole stay.
  const holidayPriceFor = (hotel: (typeof visibleHotels)[number]) =>
    packageTotal + hotelPrice(hotel.pricePerNight, hotel.capacity ?? 2, hotel.name);

  // The 5 most expensive stays in the destination — shown to inspire before a budget is set.
  const aspirationalHotels = visibleHotels
    .slice()
    .sort((a, b) => holidayPriceFor(b) - holidayPriceFor(a))
    .slice(0, 5);

  // Stays at or above the guest's budget, closest to the budget first.
  const budgetHotels =
    budget == null
      ? []
      : visibleHotels
          .filter((h) => !aspirationalHotels.some((a) => a.id === h.id))
          .filter((h) => holidayPriceFor(h) >= budget)
          .sort((a, b) => holidayPriceFor(a) - holidayPriceFor(b));

  const shownBudgetHotels = budgetHotels.slice(0, budgetVisibleCount);

  const selectedHotel = availableHotels.find((h) => h.id === hotelId);

  const scrollToBudget = () =>
    document
      .getElementById('holiday-budget-heading')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleSelectHotel = (id: string) => {
    scrollToBudget();
    if (budget == null) {
      setBudgetError(true);
      document.getElementById('holiday-budget')?.focus();
      return;
    }
    setHotelId(id);
  };

  useEffect(() => {
    if (hotelId && !availableHotels.some((h) => h.id === hotelId)) setHotelId(undefined);
  }, [hotelId, availableHotels]);

  const accommodationTotal =
    oneDay || !selectedHotel
      ? 0
      : hotelPrice(selectedHotel.pricePerNight, selectedHotel.capacity ?? 2, selectedHotel.name);

  const extrasTotal = EXTRAS.filter((e) => selectedExtras.includes(e.id)).reduce(
    (sum, e) => sum + e.price * adults,
    0,
  );

  const total = packageTotal + accommodationTotal + extrasTotal;

  const holidayInclusions = useMemo(() => {
    const items: string[] = [];
    if (!oneDay) {
      items.push(`${Math.max(1, nights)} night${Math.max(1, nights) === 1 ? '' : 's'} accommodation`);
      if (selectedHotel?.includesBreakfast) items.push('Daily Breakfast');
    }
    items.push(...(pkg?.activitiesIncluded ?? []));
    items.push(...EXTRAS.filter((e) => selectedExtras.includes(e.id)).map((e) => e.label));
    return items;
  }, [oneDay, nights, selectedHotel, pkg, selectedExtras]);

  const datesLabel = oneDay
    ? tourDate
      ? `${format(tourDate, 'd MMM yyyy')} (1 day experience)`
      : '1 day experience'
    : checkIn && checkOut
      ? `${format(checkIn, 'd MMM')} – ${format(checkOut, 'd MMM yyyy')} · ${nights} night${nights === 1 ? '' : 's'}`
      : `${nights} nights`;

  const travellersLabel = `${adults} adult${adults === 1 ? '' : 's'}${
    childrenAges.length ? `, ${childrenAges.length} children` : ''
  }`;

  const selectedRoomCount = selectedHotel
    ? roomsNeededFor(selectedHotel.capacity ?? 2)
    : Math.max(1, rooms);

  const selectedAccommodationCard =
    selectedHotel && !oneDay ? (
      <Card className="mb-6 overflow-hidden rounded-2xl border-border shadow-md">
        <div className="relative">
          <ResponsiveImage src={selectedHotel.image} alt={selectedHotel.name} ratio="wide" />
        </div>
        <CardContent className="p-5">
          <h3 className="font-display text-lg font-bold text-foreground">{selectedHotel.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {destination?.name ?? 'Your destination'}
          </p>
          {selectedHotel.rating > 0 && (
            <div className="mt-2 flex items-center gap-0.5" aria-label={`${selectedHotel.rating} star`}>
              {Array.from({ length: Math.round(selectedHotel.rating) }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
          )}
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-primary" />
              {selectedHotel.roomType || `${selectedHotel.capacity ?? 2}-sleeper room`}
            </p>
            <p className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              {mealBasis(selectedHotel)}
            </p>
          </div>
          {selectedHotel.amenities?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {selectedHotel.amenities.slice(0, 4).map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <Check className="h-3 w-3 text-accent" /> {a}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    ) : null;

  const submitBooking = async () => {
    const ref = `TA-${Date.now().toString().slice(-6)}`;
    setReference(ref);

    try {
      const { error } = await supabase.functions.invoke('send-quote-request', {
        body: {
          guestName: contact.name,
          guestEmail: contact.email,
          guestTel: contact.phone,
          destination: destination?.name,
          packageNames: pkg?.name ? [pkg.name] : undefined,
          checkIn: oneDay
            ? (tourDate ? format(tourDate, 'yyyy-MM-dd') : undefined)
            : (checkIn ? format(checkIn, 'yyyy-MM-dd') : undefined),
          checkOut: oneDay
            ? (tourDate ? format(tourDate, 'yyyy-MM-dd') : undefined)
            : (checkOut ? format(checkOut, 'yyyy-MM-dd') : undefined),
          adults,
          children: childrenAges.length,
          childrenAges: childrenAges.join(', '),
          rooms,
          budget: total,
          bookingType: 'Online Booking Request',
          paymentOption,
          promoCode,
          specialRequests,
          reference: ref,
          accommodation: selectedHotel?.name,
          totalAmount: total,
        },
      });
      if (error) throw error;
      // Successful submission only — fires the Google Ads conversion once per reference.
      trackBookingConversion(ref, total);
    } catch (err) {
      console.error('Failed to send booking notification:', err);
    }

    setStep('received');
  };

  const summary = (
    <>
      {selectedAccommodationCard}
      <BookingSummary
        destinationName={destination?.name ?? 'Your destination'}
        packageTitle={pkg?.name.replace(/^[A-Z]+\d*[A-Z]*\s*-\s*/, '')}
        dates={datesLabel}
        travellers={travellersLabel}
        accommodationName={oneDay ? 'Not needed for a 1 day experience' : selectedHotel?.name}
        roomsLabel={
          oneDay
            ? undefined
            : `${selectedRoomCount} room${selectedRoomCount === 1 ? '' : 's'}`
        }
        packageTotal={packageTotal}
        accommodationTotal={accommodationTotal}
        extrasTotal={extrasTotal}
        childPriceOnRequest={packagePricing?.childPriceOnRequest}
        onConfirm={step === 'review' ? submitBooking : undefined}
        confirmLabel={paymentOption === 'quote' ? 'Request your quotation' : undefined}
        confirmDisabled={step === 'review' ? !contact.name || !contact.email || !contact.phone : false}
        onRequestFinalQuote={step === 'accommodation' ? () => goto('review') : undefined}
        requestFinalQuoteDisabled={step === 'accommodation' ? !selectedHotel : false}

      />
    </>
  );


  const goto = (next: Step) => setStep(next);

  const currentIndex = STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Plan & book your South African holiday | Travel Affordable"
        description="Choose your destination, experience and accommodation and see your complete holiday price before you book."
        canonical="/book"
      />
      <Header />
      <div className="h-16" />
      <DestinationImageMenu />

      <main className="container mx-auto px-4 pb-20 pt-24">
        {/* Progress */}
        {step !== 'received' && (
          <ol className="mb-8 flex flex-wrap gap-2 text-xs font-medium">
            {STEP_LABELS.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  'rounded-full px-3 py-1.5',
                  i === currentIndex
                    ? 'bg-primary text-primary-foreground'
                    : i < currentIndex
                      ? 'bg-accent/15 text-accent'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {i + 1}. {s.label}
              </li>
            ))}
          </ol>
        )}

        {step === 'destination' && (
          <section>
            <h1 className="font-display text-3xl font-bold text-foreground">Where would you like to go?</h1>
            <p className="mt-2 text-muted-foreground">Choose your destination to begin.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalogueDestinations.map((d) => (
                <DestinationTile
                  key={d.slug}
                  destination={{ ...d, enquireOnly: false }}
                  onSelect={() => {
                    setDestinationSlug(d.slug);
                    setPackageId('');
                    setHotelId(undefined);
                    goto('experience');
                  }}
                />

              ))}
            </div>
          </section>
        )}

        {step === 'experience' && destination && (
          <section>
            <Button variant="ghost" className="mb-4 -ml-2" onClick={() => goto('destination')}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Choose your {destination.name} experience
            </h1>
            <p className="mt-2 text-muted-foreground">
              Package prices are per person and include the listed activities. Accommodation comes next.
            </p>
            {destinationPackages.length === 0 ? (
              <div className="mt-8">
                <ErrorState
                  title={`${destination.name} packages are arranged personally`}
                  message="Tell us your dates and group size and our team will put a tailored quote together for you."
                  actionLabel="WhatsApp us"
                  onAction={() => window.open('https://wa.me/27796813869', '_blank')}
                />
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destinationPackages.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="text-left"
                    onClick={() => {
                      setPackageId(p.id);
                      goto('dates');
                    }}
                  >
                    <ExperienceCard
                      pkg={p}
                      destinationName={destination.name}
                      destinationSlug={destination.slug}
                      fallbackImage={destination.image}
                    />
                  </button>
                ))}
              </div>
            )}
            <Button variant="ghost" className="mt-8" onClick={() => goto('destination')}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Change destination
            </Button>
          </section>
        )}

        {(step === 'dates' || step === 'travellers' || step === 'accommodation' || step === 'review') &&
          destination &&
          pkg && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                {step === 'dates' && (
                  <section>
                    <Button variant="ghost" className="mb-4 -ml-2" onClick={() => goto('experience')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <h1 className="font-display text-3xl font-bold text-foreground">Your dates of travel</h1>
                    <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox checked={oneDay} onCheckedChange={(v) => setOneDay(Boolean(v))} />
                      I'd like to do this experience for 1 day
                    </label>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {oneDay ? (
                        <div className="space-y-1.5">
                          <Label>Tour date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-12 w-full justify-start font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                {tourDate ? format(tourDate, 'd MMM yyyy') : 'Select your day'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={tourDate} onSelect={setTourDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <Label>Check-in</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="h-12 w-full justify-start font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                  {checkIn ? format(checkIn, 'd MMM yyyy') : 'Add date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={checkIn}
                                  onSelect={(d) => {
                                    setCheckIn(d);
                                    if (d && (!checkOut || checkOut <= d)) setCheckOut(addDays(d, 2));
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-1.5">
                            <Label>Check-out</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="h-12 w-full justify-start font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                  {checkOut ? format(checkOut, 'd MMM yyyy') : 'Add date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={checkOut}
                                  onSelect={setCheckOut}
                                  disabled={checkIn ? { before: addDays(checkIn, 1) } : undefined}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-8 flex gap-3">
                      <Button variant="ghost" onClick={() => goto('experience')}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={() => goto('travellers')}>
                        Continue <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </section>
                )}

                {step === 'travellers' && (
                  <section>
                    <Button variant="ghost" className="mb-4 -ml-2" onClick={() => goto('dates')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <h1 className="font-display text-3xl font-bold text-foreground">How many in your travel group</h1>
                    <p className="mt-2 text-muted-foreground">
                      Children under 3 travel free on the experience.
                    </p>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: 'Adults', value: adults, set: setAdults, min: 1 },
                        { label: 'Children 0–2 (free)', value: infants, set: setInfants, min: 0 },
                        { label: 'Children 3–12', value: kids, set: setKids, min: 0 },
                        { label: 'Children 13–17', value: teens, set: setTeens, min: 0 },
                        { label: 'How many rooms', value: rooms, set: setRooms, min: 1 },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4 text-primary" /> {row.label}
                          </span>
                          <div className="flex items-center gap-3">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9"
                              onClick={() => row.set(Math.max(row.min, row.value - 1))}
                            >
                              –
                            </Button>
                            <span className="w-6 text-center font-semibold">{row.value}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-9 w-9"
                              onClick={() => row.set(Math.min(30, row.value + 1))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex gap-3">
                      <Button variant="ghost" onClick={() => goto('dates')}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={() => goto(oneDay ? 'review' : 'accommodation')}>
                        Continue <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </section>
                )}

                {step === 'accommodation' && (
                  <section>
                    <Button variant="ghost" className="mb-4 -ml-2" onClick={() => goto('travellers')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <h1 className="font-display text-3xl font-bold text-foreground">
                      Choose your hotel
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      {nights} night{nights === 1 ? '' : 's'} in {destination.name}. Your package price stays
                      the same — accommodation is added to it.
                    </p>
                    {soldOutCount > 0 && (
                      <p className="mt-2 text-sm font-medium text-destructive">
                        {soldOutCount} {soldOutCount === 1 ? 'stay is' : 'stays are'} sold out for your selected
                        dates and have been hidden. Change your dates to see more options.
                      </p>
                    )}

                    <Card id="holiday-budget-heading" className="mt-6 scroll-mt-28 rounded-2xl border-primary/30">
                      <CardContent className="space-y-3 p-6">
                        <h2 className="font-display text-2xl font-bold uppercase leading-tight text-destructive md:text-3xl">
                          Holiday budget amount required in the box below before you can proceed to select
                          your hotel stay
                        </h2>
                        <Label htmlFor="holiday-budget" className="block text-base font-semibold text-destructive">
                          What would you like to spend for your amazing holiday?
                        </Label>
                        <p className="text-sm font-medium text-destructive">
                          Required — tell us your budget and we'll show the stays that fit.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Input
                            id="holiday-budget"
                            inputMode="numeric"
                            placeholder="e.g. R 8 000"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                            className="sm:max-w-xs"
                          />
                          <Button
                            onClick={() => {
                              const value = Number(budgetInput.replace(/[^\d]/g, ''));
                              if (!value) {
                                setBudgetError(true);
                                return;
                              }
                              setBudget(value);
                              setBudgetError(false);
                              setBudgetVisibleCount(4);
                            }}
                          >
                            Show stays within my budget
                          </Button>
                        </div>
                        {budgetError && budget == null && (
                          <p className="text-sm font-semibold text-destructive">
                            Please complete the budget field to be able to proceed.
                          </p>
                        )}
                        {budget != null && (
                          <p className="text-sm font-medium text-foreground">
                            Showing stays from R{budget.toLocaleString('en-ZA')} upwards.
                          </p>
                        )}

                      </CardContent>
                    </Card>

                    {visibleHotels.length === 0 ? (
                      <div className="mt-8">
                        <ErrorState
                          title="No stays match that category yet"
                          message="Try another category, or contact us and we'll source the right property for you."
                          actionLabel="Back to travellers"
                          onAction={() => goto('travellers')}
                        />
                      </div>
                    ) : (
                      <>
                        {budget != null && (
                          <div className="mt-8">
                            <h2 className="font-display text-xl font-bold text-foreground">
                              Stays within your budget
                            </h2>
                            {shownBudgetHotels.length === 0 ? (
                              <p className="mt-3 text-sm text-muted-foreground">
                                No stays match that budget yet — the inspiring options below show what's
                                possible, or adjust your budget above.
                              </p>
                            ) : (
                              <div className="mt-6 grid gap-6 md:grid-cols-2">
                                {shownBudgetHotels.map((hotel) => (
                                  <AccommodationCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    tier={tierMap.get(hotel.id) ?? 'standard'}
                                    destinationName={destination.name}
                                    nights={Math.max(1, nights)}
                                    rooms={roomsNeededFor(hotel.capacity ?? 2)}
                                    price={hotelPrice(hotel.pricePerNight, hotel.capacity ?? 2, hotel.name)}
                                    selected={hotelId === hotel.id}
                                    onSelect={(id) => handleSelectHotel(id)}

                                  />
                                ))}
                              </div>
                            )}
                            {budgetHotels.length > shownBudgetHotels.length && (
                              <Button
                                variant="outline"
                                className="mt-6 w-full"
                                onClick={() => setBudgetVisibleCount((c) => c + 4)}
                              >
                                Click to view more hotels within budget
                              </Button>
                            )}
                          </div>
                        )}

                        <div className="mt-10">
                          <h2 className="font-display text-xl font-bold text-foreground">
                            Aspirational stays — see what's possible
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Our five most luxurious stays in {destination.name}.
                          </p>
                          <div className="mt-6 grid gap-6 md:grid-cols-2">
                            {aspirationalHotels.map((hotel) => (
                              <AccommodationCard
                                key={hotel.id}
                                hotel={hotel}
                                tier={tierMap.get(hotel.id) ?? 'standard'}
                                luxuryBadge
                                destinationName={destination.name}
                                nights={Math.max(1, nights)}
                                rooms={roomsNeededFor(hotel.capacity ?? 2)}
                                price={hotelPrice(hotel.pricePerNight, hotel.capacity ?? 2, hotel.name)}
                                selected={hotelId === hotel.id}
                                onSelect={(id) => handleSelectHotel(id)}

                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Button variant="ghost" className="mt-8" onClick={() => goto('travellers')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                  </section>
                )}




                {step === 'review' && (
                  <section>
                    <Button variant="ghost" className="mb-4 -ml-2" onClick={() => goto('accommodation')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                    <h1 className="font-display text-3xl font-bold text-foreground">My Holiday</h1>
                    <div className="mt-6">
                      <h2 className="font-display text-xl font-bold text-foreground">
                        What my holiday includes
                      </h2>
                      <ul className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                        {holidayInclusions.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Card className="mt-8 rounded-2xl">
                      <CardContent className="space-y-4 p-6">
                        <h2 className="font-display text-xl font-bold text-foreground">Payment preference</h2>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setPaymentOption('50%')}
                            className={cn(
                              'rounded-xl border p-4 text-left text-sm font-medium transition-colors',
                              paymentOption === '50%'
                                ? 'border-accent bg-accent/10 text-foreground'
                                : 'border-border bg-card text-muted-foreground hover:bg-accent/5',
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-full border',
                                  paymentOption === '50%'
                                    ? 'border-accent bg-accent'
                                    : 'border-muted-foreground',
                                )}
                              >
                                {paymentOption === '50%' && (
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                )}
                              </span>
                              I'd like to pay 50% to secure my booking
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentOption('quote')}
                            className={cn(
                              'rounded-xl border p-4 text-left text-sm font-medium transition-colors',
                              paymentOption === 'quote'
                                ? 'border-accent bg-accent/10 text-foreground'
                                : 'border-border bg-card text-muted-foreground hover:bg-accent/5',
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-full border',
                                  paymentOption === 'quote'
                                    ? 'border-accent bg-accent'
                                    : 'border-muted-foreground',
                                )}
                              >
                                {paymentOption === 'quote' && (
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                )}
                              </span>
                              Please send me a quotation
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentOption('full')}
                            className={cn(
                              'rounded-xl border p-4 text-left text-sm font-medium transition-colors',
                              paymentOption === 'full'
                                ? 'border-accent bg-accent/10 text-foreground'
                                : 'border-border bg-card text-muted-foreground hover:bg-accent/5',
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded-full border',
                                  paymentOption === 'full'
                                    ? 'border-accent bg-accent'
                                    : 'border-muted-foreground',
                                )}
                              >
                                {paymentOption === 'full' && (
                                  <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                )}
                              </span>
                              I'd like to make full payment with a discount
                            </span>
                          </button>
                        </div>
                        {paymentOption === 'quote' ? (
                          <p className="text-sm text-muted-foreground">
                            We'll send you a detailed quotation for this holiday — no payment required now.
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-muted-foreground">
                              You won't be charged any amount now, we will send you a limited time payment link
                              to secure booking.
                            </p>
                            <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                              <span className="text-muted-foreground">Amount on payment link</span>
                              <span className="font-display text-lg font-bold text-sunset">
                                R{' '}
                                {Math.round(
                                  paymentOption === '50%' ? total * 0.5 : total,
                                ).toLocaleString('en-ZA')}
                              </span>
                            </div>
                          </>
                        )}
                        {paymentOption === 'full' && (
                          <p className="text-xs text-accent">
                            A limited-time discount will be applied to your payment link.
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="mt-8 rounded-2xl">
                      <CardContent className="space-y-4 p-6">
                        <h2 className="font-display text-xl font-bold text-foreground">Your details</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                              id="name"
                              value={contact.name}
                              maxLength={100}
                              onChange={(e) => setContact({ ...contact, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contact.email}
                              maxLength={255}
                              onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="phone">Mobile number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={contact.phone}
                              maxLength={20}
                              onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="promo">Promo / discount code</Label>
                            <Input
                              id="promo"
                              value={promoCode}
                              maxLength={50}
                              placeholder="Enter code if you have one"
                              onChange={(e) => setPromoCode(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="requests">Special requests</Label>
                            <Input
                              id="requests"
                              value={specialRequests}
                              maxLength={500}
                              placeholder="Dietary requirements, accessibility needs, celebrations, etc."
                              onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                          </div>
                        </div>
                        <p className="text-center text-xs text-muted-foreground">
                          You'll receive a booking reference immediately. Your booking is confirmed once your
                          accommodation is secured.
                        </p>
                      </CardContent>
                    </Card>

                    <Button variant="ghost" className="mt-6" onClick={() => goto(oneDay ? 'travellers' : 'accommodation')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                  </section>
                )}
              </div>

              <aside className="lg:sticky lg:top-20 lg:self-start lg:pb-4">
                {summary}
              </aside>
            </div>
          )}

        {step === 'received' && (
          <section className="mx-auto max-w-2xl text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Booking Received</h1>
            <p className="mt-3 text-muted-foreground">
              Thank you {contact.name.split(' ')[0]}! Your reference is{' '}
              <span className="font-semibold text-foreground">{reference}</span>. We're processing your
              booking now and securing your accommodation.
            </p>
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Booking Received</p>
                  <p className="text-sm text-muted-foreground">
                    We have your holiday details and travellers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
                <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">Booking Confirmed</p>
                  <p className="text-sm text-muted-foreground">
                    As soon as your chosen accommodation is secured to your specifications, we'll email your
                    confirmation with your full itinerary and hotel details.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8">{summary}</div>
            <Button asChild className="mt-8">
              <Link to="/">Back to home</Link>
            </Button>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

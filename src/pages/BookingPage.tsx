import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format, addDays, differenceInCalendarDays } from 'date-fns';
import { ArrowLeft, ArrowRight, CalendarIcon, CheckCircle2, Clock, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
import { Itinerary } from '@/components/common/Itinerary';
import { TierSelector, type AccommodationTier } from '@/components/common/TierSelector';
import { ErrorState } from '@/components/common/ErrorState';
import { catalogueDestinations, getCatalogueDestination } from '@/data/destinationCatalogue';
import { getHotelsByDestination, getPackagesByDestination, packages } from '@/data/travelData';
import { calculatePackagePrice } from '@/data/packagePricing';
import { buildItinerary } from '@/lib/itinerary';
import { classifyHotels } from '@/lib/accommodationTiers';
import { isGenericHotelName, getDurbanHotelStars } from '@/data/durbanHotelStars';
import { cn } from '@/lib/utils';

type Step = 'destination' | 'experience' | 'dates' | 'travellers' | 'accommodation' | 'extras' | 'review' | 'received';

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: 'destination', label: 'Destination' },
  { id: 'experience', label: 'Experience' },
  { id: 'dates', label: 'Dates' },
  { id: 'travellers', label: 'Travellers' },
  { id: 'accommodation', label: 'Stay' },
  { id: 'extras', label: 'Extras' },
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
  const [tier, setTier] = useState<AccommodationTier | 'all'>('all');
  const [hotelId, setHotelId] = useState<string>();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [reference, setReference] = useState<string>();

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
      const stars = getDurbanHotelStars(h.name);
      return stars == null ? h : { ...h, rating: stars };
    });
  const tierMap = useMemo(() => classifyHotels(hotels), [hotels]);
  const totalGuests = adults + kids + teens;

  const hotelPrice = (hotelPerNight: number, capacity: number) => {
    const rooms = Math.max(1, Math.ceil(totalGuests / Math.max(1, capacity)));
    return hotelPerNight * Math.max(1, nights) * rooms;
  };

  const visibleHotels = hotels.filter((h) => tier === 'all' || tierMap.get(h.id) === tier);
  const selectedHotel = hotels.find((h) => h.id === hotelId);
  const accommodationTotal =
    oneDay || !selectedHotel
      ? 0
      : hotelPrice(selectedHotel.pricePerNight, selectedHotel.capacity ?? 2);

  const extrasTotal = EXTRAS.filter((e) => selectedExtras.includes(e.id)).reduce(
    (sum, e) => sum + e.price * adults,
    0,
  );

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

  const summary = (
    <BookingSummary
      destinationName={destination?.name ?? 'Your destination'}
      packageTitle={pkg?.name.replace(/^[A-Z]+\d*[A-Z]*\s*-\s*/, '')}
      dates={datesLabel}
      travellers={travellersLabel}
      accommodationName={oneDay ? 'Not needed for a 1 day experience' : selectedHotel?.name}
      packageTotal={packageTotal}
      accommodationTotal={accommodationTotal}
      extrasTotal={extrasTotal}
      childPriceOnRequest={packagePricing?.childPriceOnRequest}
    />
  );

  const goto = (next: Step) => setStep(next);

  const submitBooking = () => {
    setReference(`TA-${Date.now().toString().slice(-6)}`);
    setStep('received');
  };

  const currentIndex = STEP_LABELS.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Plan & book your South African holiday | Travel Affordable"
        description="Choose your destination, experience and accommodation and see your complete holiday price before you book."
        canonical="/book"
      />
      <Header />

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
                <button
                  key={d.slug}
                  type="button"
                  className="text-left"
                  onClick={() => {
                    setDestinationSlug(d.slug);
                    setPackageId('');
                    setHotelId(undefined);
                    goto('experience');
                  }}
                >
                  <DestinationTile destination={{ ...d, enquireOnly: false }} />
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'experience' && destination && (
          <section>
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

        {(step === 'dates' || step === 'travellers' || step === 'accommodation' || step === 'extras' || step === 'review') &&
          destination &&
          pkg && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                {step === 'dates' && (
                  <section>
                    <h1 className="font-display text-3xl font-bold text-foreground">When are you going?</h1>
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
                    <h1 className="font-display text-3xl font-bold text-foreground">Who is travelling?</h1>
                    <p className="mt-2 text-muted-foreground">
                      Children under 3 travel free on the experience.
                    </p>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: 'Adults', value: adults, set: setAdults, min: 1 },
                        { label: 'Children 0–2 (free)', value: infants, set: setInfants, min: 0 },
                        { label: 'Children 3–12', value: kids, set: setKids, min: 0 },
                        { label: 'Children 13–17', value: teens, set: setTeens, min: 0 },
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
                      <Button onClick={() => goto(oneDay ? 'extras' : 'accommodation')}>
                        Continue <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </section>
                )}

                {step === 'accommodation' && (
                  <section>
                    <h1 className="font-display text-3xl font-bold text-foreground">
                      Choose where you'd like to stay
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      {nights} night{nights === 1 ? '' : 's'} in {destination.name}. Your package price stays
                      the same — accommodation is added to it.
                    </p>
                    <div className="mt-6">
                      <TierSelector value={tier} onChange={setTier} />
                    </div>

                    {visibleHotels.length === 0 ? (
                      <div className="mt-8">
                        <ErrorState
                          title="No stays match that category yet"
                          message="Try another category, or contact us and we'll source the right property for you."
                          actionLabel="Show all stays"
                          onAction={() => setTier('all')}
                        />
                      </div>
                    ) : (
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {visibleHotels.map((hotel) => (
                          <AccommodationCard
                            key={hotel.id}
                            hotel={hotel}
                            tier={tierMap.get(hotel.id) ?? 'standard'}
                            destinationName={destination.name}
                            nights={Math.max(1, nights)}
                            rooms={Math.max(1, Math.ceil(totalGuests / Math.max(1, hotel.capacity ?? 2)))}
                            price={hotelPrice(hotel.pricePerNight, hotel.capacity ?? 2)}
                            selected={hotelId === hotel.id}
                            onSelect={(id) => {
                              setHotelId(id);
                              goto('extras');
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <Button variant="ghost" className="mt-8" onClick={() => goto('travellers')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                  </section>
                )}

                {step === 'extras' && (
                  <section>
                    <h1 className="font-display text-3xl font-bold text-foreground">Add anything extra?</h1>
                    <p className="mt-2 text-muted-foreground">Optional — you can skip this step.</p>
                    <div className="mt-6 space-y-3">
                      {EXTRAS.map((extra) => (
                        <label
                          key={extra.id}
                          className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-card p-4"
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <Checkbox
                              checked={selectedExtras.includes(extra.id)}
                              onCheckedChange={(v) =>
                                setSelectedExtras((prev) =>
                                  v ? [...prev, extra.id] : prev.filter((id) => id !== extra.id),
                                )
                              }
                            />
                            {extra.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            R{extra.price.toLocaleString('en-ZA')} per adult
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-8 flex gap-3">
                      <Button variant="ghost" onClick={() => goto(oneDay ? 'travellers' : 'accommodation')}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={() => goto('review')}>
                        Review my holiday <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </section>
                )}

                {step === 'review' && (
                  <section>
                    <h1 className="font-display text-3xl font-bold text-foreground">Review your holiday</h1>
                    <div className="mt-6">
                      <h2 className="font-display text-xl font-bold text-foreground">Your itinerary</h2>
                      <div className="mt-4">
                        <Itinerary
                          days={buildItinerary(pkg, {
                            nights,
                            oneDay,
                            destinationName: destination.name,
                          })}
                        />
                      </div>
                    </div>

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
                        </div>
                        <Button
                          size="lg"
                          className="w-full"
                          disabled={!contact.name || !contact.email || !contact.phone}
                          onClick={submitBooking}
                        >
                          Confirm & continue to payment
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                          You'll receive a booking reference immediately. Your booking is confirmed once your
                          accommodation is secured.
                        </p>
                      </CardContent>
                    </Card>

                    <Button variant="ghost" className="mt-6" onClick={() => goto('extras')}>
                      <ArrowLeft className="mr-1 h-4 w-4" /> Back
                    </Button>
                  </section>
                )}
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">{summary}</aside>
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

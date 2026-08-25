import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import { ArrowLeft, ArrowRight, CalendarIcon, Check, CheckCircle2, Clock, Minus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PremiumHeader } from '@/components/premium/PremiumHeader';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StayCard } from '@/components/premium/StayCard';
import { GetawayTotal, GetawayTotalBar } from '@/components/premium/GetawayTotal';
import { ErrorState } from '@/components/common/ErrorState';
import { getCatalogueDestination } from '@/data/destinationCatalogue';
import { getDestinationPage } from '@/data/destinationPages';
import { getHotelsByDestination, packages } from '@/data/travelData';
import { calculatePackagePrice } from '@/data/packagePricing';
import { getPackageImage } from '@/data/packageImages';
import { extractTourCode } from '@/lib/packageTourPricing';
import { classifyHotels } from '@/lib/accommodationTiers';
import { isGenericHotelName, getDurbanHotelStars } from '@/data/durbanHotelStars';
import { getUmhlangaHotelStars } from '@/data/umhlangaHotelStars';
import { getStayAvailability, isAvailabilityTracked } from '@/data/krugerAvailability';
import { cn } from '@/lib/utils';

type Step = 'experience' | 'plan' | 'stay' | 'book' | 'received';

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function Counter({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors hover:bg-cream disabled:opacity-40"
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center font-display text-lg font-bold text-burgundy-dark">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-burgundy/30 text-burgundy transition-colors hover:bg-cream disabled:opacity-40"
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function GetawayPage() {
  const [params] = useSearchParams();

  const destinationSlug = params.get('destination') ?? '';
  const packageId = params.get('package') ?? '';

  const destination = destinationSlug ? getCatalogueDestination(destinationSlug) : undefined;
  const destinationPage = destinationSlug ? getDestinationPage(destinationSlug) : undefined;
  const pkg = packages.find((p) => p.id === packageId);

  const [step, setStep] = useState<Step>('experience');
  const [checkIn, setCheckIn] = useState<Date | undefined>(parseDate(params.get('checkIn')));
  const [checkOut, setCheckOut] = useState<Date | undefined>(parseDate(params.get('checkOut')));
  const [adults, setAdults] = useState(Number(params.get('adults') ?? 2) || 2);
  const [infants, setInfants] = useState(0);
  const [kids, setKids] = useState(0);
  const [teens, setTeens] = useState(0);
  const rooms = 1;
  const [hotelId, setHotelId] = useState<string>();
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [paymentOption, setPaymentOption] = useState<'50%' | 'full'>('50%');
  const [specialRequests, setSpecialRequests] = useState('');
  const [reference, setReference] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const nights = useMemo(() => {
    if (checkIn && checkOut) return Math.max(1, differenceInCalendarDays(checkOut, checkIn));
    return 2;
  }, [checkIn, checkOut]);

  const childrenAges = useMemo(
    () => [
      ...Array.from({ length: infants }, () => 1),
      ...Array.from({ length: kids }, () => 8),
      ...Array.from({ length: teens }, () => 15),
    ],
    [infants, kids, teens],
  );

  const tourCode = pkg ? (extractTourCode(pkg.name) ?? pkg.id.toUpperCase()) : '';
  const pricing = pkg ? calculatePackagePrice(pkg.id, { adults, childrenAges }) : null;
  const experienceTotal = pricing?.total ?? 0;
  const payingGuests = adults + kids + teens;

  const hotels = useMemo(
    () =>
      (destination?.destinationId ? getHotelsByDestination(destination.destinationId) : [])
        .filter((h) => !isGenericHotelName(h.name))
        .map((h) => {
          const stars = getDurbanHotelStars(h.name) ?? getUmhlangaHotelStars(h.name);
          return stars == null ? h : { ...h, rating: stars };
        }),
    [destination?.destinationId],
  );

  const tierMap = useMemo(() => classifyHotels(hotels), [hotels]);

  const roomsNeededFor = (capacity: number) =>
    Math.max(rooms, Math.ceil(payingGuests / Math.max(1, capacity)));

  const hotelPrice = (perNight: number, capacity: number) =>
    perNight * Math.max(1, nights) * Math.max(1, roomsNeededFor(capacity));

  const isHotelAvailable = (name: string, capacity: number) => {
    if (!isAvailabilityTracked(name)) return true;
    return getStayAvailability(checkIn, Math.max(1, nights), roomsNeededFor(capacity)).available;
  };

  const availableHotels = hotels.filter((h) => isHotelAvailable(h.name, h.capacity ?? 2));
  const soldOutCount = hotels.length - availableHotels.length;

  const visibleHotels = availableHotels
    .slice()
    .sort((a, b) => {
      const fits = (h: typeof a) => ((h.capacity ?? 2) >= Math.max(1, payingGuests) ? 0 : 1);
      return fits(a) - fits(b) || a.pricePerNight - b.pricePerNight;
    });

  const selectedHotel = availableHotels.find((h) => h.id === hotelId);

  useEffect(() => {
    if (hotelId && !availableHotels.some((h) => h.id === hotelId)) setHotelId(undefined);
  }, [hotelId, availableHotels]);

  const accommodationTotal = selectedHotel
    ? hotelPrice(selectedHotel.pricePerNight, selectedHotel.capacity ?? 2)
    : 0;
  const total = experienceTotal + accommodationTotal;
  const selectedRoomCount = selectedHotel ? roomsNeededFor(selectedHotel.capacity ?? 2) : Math.max(1, rooms);

  if (!destination || !pkg) {
    return (
      <div className="min-h-screen bg-cream">
        <PremiumHeader />
        <div className="container mx-auto px-4 py-32">
          <ErrorState
            title="We couldn't find that getaway"
            message="Choose a destination to see the getaways available."
          />
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex h-12 items-center rounded-xl bg-burgundy px-8 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white"
            >
              Browse destinations
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const heroImage = getPackageImage(pkg.id) || destinationPage?.heroImage || destination.image;
  const packageTitle = pkg.shortName;
  const datesLabel =
    checkIn && checkOut
      ? `${format(checkIn, 'd MMM')} – ${format(checkOut, 'd MMM yyyy')} · ${nights} night${nights === 1 ? '' : 's'}`
      : undefined;
  const travellersLabel = `${adults} adult${adults === 1 ? '' : 's'}${
    childrenAges.length ? `, ${childrenAges.length} child${childrenAges.length === 1 ? '' : 'ren'}` : ''
  }`;

  const inclusions = [
    `${Math.max(1, nights)} night${Math.max(1, nights) === 1 ? '' : 's'} accommodation`,
    ...(selectedHotel?.includesBreakfast ? ['Daily breakfast'] : []),
    ...pkg.activitiesIncluded.filter((a) => a.toLowerCase() !== 'accommodation'),
  ];

  const submitBooking = async () => {
    setSubmitting(true);
    const ref = `TA-${Date.now().toString().slice(-6)}`;
    setReference(ref);
    try {
      await supabase.functions.invoke('send-quote-request', {
        body: {
          guestName: contact.name,
          guestEmail: contact.email,
          guestTel: contact.phone,
          destination: destination.name,
          packageNames: [pkg.name],
          checkIn: checkIn ? format(checkIn, 'yyyy-MM-dd') : undefined,
          checkOut: checkOut ? format(checkOut, 'yyyy-MM-dd') : undefined,
          adults,
          children: childrenAges.length,
          childrenAges: childrenAges.join(', '),
          rooms: selectedRoomCount,
          budget: total,
          bookingType: 'Online Booking Request',
          paymentOption,
          specialRequests,
          reference: ref,
          accommodation: selectedHotel?.name,
          totalAmount: total,
        },
      });
    } catch (err) {
      console.error('Failed to send booking notification:', err);
    }
    setSubmitting(false);
    setStep('received');
  };

  const summaryCard = (
    <GetawayTotal
      destinationName={destination.name}
      heroImage={heroImage}
      packageTitle={packageTitle}
      packageCode={tourCode}
      duration={pkg.duration}
      dates={datesLabel}
      travellers={travellersLabel}
      accommodationName={selectedHotel?.name}
      roomLabel={
        selectedHotel
          ? `${selectedHotel.roomType || `${selectedHotel.capacity ?? 2}-sleeper`} · ${selectedRoomCount} room${
              selectedRoomCount === 1 ? '' : 's'
            }`
          : undefined
      }
      experienceTotal={experienceTotal}
      accommodationTotal={accommodationTotal}
      guests={Math.max(1, payingGuests)}
      ctaLabel={step === 'book' ? 'Request to confirm your booking' : 'Continue'}
      childPriceOnRequest={pricing?.childPriceOnRequest}
      onCta={
        step === 'book'
          ? submitBooking
          : step === 'stay'
            ? () => setStep('book')
            : undefined
      }
      ctaDisabled={
        step === 'book'
          ? submitting || !contact.name || !contact.email || !contact.phone
          : step === 'stay'
            ? !selectedHotel
            : false
      }
    />
  );

  return (
    <div className="min-h-screen bg-cream pb-28 lg:pb-0">
      <SEO
        title={`${pkg.shortName} | ${destination.name} Getaway | Travel Affordable`}
        description={pkg.description.slice(0, 155)}
        canonical={`/getaway?destination=${destination.slug}&package=${pkg.id}`}
        noindex
      />
      <PremiumHeader />

      {step !== 'received' && (
        <>
          {/* Hero */}
          <section className="relative">
            <div className="relative h-[320px] w-full md:h-[420px]">
              <img src={heroImage} alt={pkg.shortName} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark/90 via-burgundy-dark/55 to-burgundy-dark/15" />
              <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-8">
                <Link
                  to={`/destinations/${destination.slug}`}
                  className="mb-auto mt-8 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 hover:text-champagne"
                >
                  <ArrowLeft className="h-4 w-4" /> All {destination.name} getaways
                </Link>
                <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-champagne">
                  {tourCode} · {destination.name}
                </p>
                <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold uppercase leading-tight text-white md:text-5xl">
                  {pkg.shortName}
                </h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-white/85">
                  <Clock className="h-4 w-4 text-champagne" /> {pkg.duration}
                </p>
              </div>
            </div>
          </section>

        </>
      )}

      <main className="container mx-auto px-4 py-10 md:py-14">
        {step === 'received' ? (
          <div className="mx-auto max-w-2xl pt-24 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-champagne" />
            <h1 className="mt-6 font-display text-3xl font-bold uppercase text-burgundy-dark md:text-4xl">
              Your booking request is in!
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Thank you {contact.name.split(' ')[0]} — your {destination.name} getaway request is with our team.
              We'll confirm availability and send you a secure payment link to lock in your booking.
            </p>
            {reference && (
              <p className="mt-4 text-sm font-semibold text-burgundy">Reference {reference}</p>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="flex h-12 items-center rounded-xl bg-burgundy px-8 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white"
              >
                Back home
              </Link>
              <a
                href="https://wa.me/27796813869"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center rounded-xl border border-burgundy px-8 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-burgundy"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              {step === 'experience' && (
                <section>
                  <h2 className="font-display text-2xl font-bold text-burgundy-dark md:text-3xl">
                    What's included
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {pkg.description}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {pkg.activitiesIncluded
                      .filter((a) => a.toLowerCase() !== 'accommodation')
                      .map((a) => (
                        <li
                          key={a}
                          className="flex items-start gap-3 rounded-xl bg-card p-4 text-sm text-foreground/85 shadow-sm ring-1 ring-border/60"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                          {a}
                        </li>
                      ))}
                  </ul>

                  <div className="mt-10 rounded-2xl bg-burgundy-dark p-8 text-center">
                    <h3 className="font-display text-2xl font-bold uppercase text-white md:text-3xl">
                      Make it your getaway
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
                      Tell us when you're travelling and who's coming, then choose the stay that suits you.
                    </p>
                    <Button
                      onClick={() => setStep('plan')}
                      className="mt-6 h-14 rounded-xl bg-champagne px-10 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-burgundy-dark hover:bg-champagne/90"
                    >
                      Start planning <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </section>
              )}

              {step === 'plan' && (
                <section className="space-y-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold uppercase text-burgundy-dark md:text-4xl">
                      Make it your getaway
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Tell us when you're travelling and who's coming. We'll work out the rooms for you.
                    </p>
                    <h3 className="mt-8 font-display text-xl font-bold text-burgundy-dark">Your dates</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {[
                        { label: 'Check in', value: checkIn, set: setCheckIn },
                        { label: 'Check out', value: checkOut, set: setCheckOut },
                      ].map((field) => (
                        <Popover key={field.label}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex h-14 items-center gap-3 rounded-xl bg-card px-4 text-left shadow-sm ring-1 ring-border/60"
                            >
                              <CalendarIcon className="h-4 w-4 text-burgundy" />
                              <span className="flex-1">
                                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                  {field.label}
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                  {field.value ? format(field.value, 'd MMM yyyy') : 'Select date'}
                                </span>
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.set}
                              disabled={(date) => date < new Date(new Date().toDateString())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-burgundy-dark">Who's travelling</h3>
                    <div className="mt-5 rounded-2xl bg-card px-5 shadow-sm ring-1 ring-border/60">
                      <Counter label="Adults" hint="18 years and older" value={adults} onChange={setAdults} min={1} />
                      <Counter label="Children 0–2" hint="Travel free" value={infants} onChange={setInfants} />
                      <Counter label="Children 3–12" value={kids} onChange={setKids} />
                      <Counter label="Children 13–17" value={teens} onChange={setTeens} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('experience')}
                      className="h-14 rounded-xl border-burgundy px-6 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-burgundy"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep('stay')}
                      disabled={!checkIn || !checkOut}
                      className="h-14 flex-1 rounded-xl bg-burgundy text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white hover:bg-burgundy-dark"
                    >
                      Show me where I can stay <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </section>
              )}

              {step === 'stay' && (
                <section>
                  <h2 className="font-display text-3xl font-bold uppercase text-burgundy-dark md:text-4xl">
                    Choose your stay
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your total updates instantly as you choose. {soldOutCount > 0 && `${soldOutCount} stay${
                      soldOutCount === 1 ? '' : 's'
                    } sold out for your dates.`}
                  </p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {visibleHotels.map((h) => {
                      const price = hotelPrice(h.pricePerNight, h.capacity ?? 2);
                      return (
                        <StayCard
                          key={h.id}
                          hotel={h}
                          tier={tierMap.get(h.id) ?? 'standard'}
                          destinationName={destination.name}
                          nights={Math.max(1, nights)}
                          rooms={roomsNeededFor(h.capacity ?? 2)}
                          price={price}
                          resultingTotal={experienceTotal + price}
                          guests={Math.max(1, payingGuests)}
                          selected={hotelId === h.id}
                          onSelect={setHotelId}
                        />
                      );
                    })}
                  </div>

                  {visibleHotels.length === 0 && (
                    <p className="mt-6 rounded-2xl bg-card p-6 text-sm text-muted-foreground shadow-sm ring-1 ring-border/60">
                      No stays match this filter for your dates. Try another style or adjust your dates.
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('plan')}
                      className="h-14 rounded-xl border-burgundy px-6 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-burgundy"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={() => setStep('book')}
                      disabled={!selectedHotel}
                      className="h-14 flex-1 rounded-xl bg-burgundy text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white hover:bg-burgundy-dark"
                    >
                      My getaway is ready <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </section>
              )}

              {step === 'book' && (
                <section className="space-y-8">
                  <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 md:p-8">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-champagne">
                      {tourCode} · {destination.name}
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-burgundy-dark md:text-4xl">
                      Your getaway
                      <span className="block text-burgundy">is ready!</span>
                    </h2>
                    <p className="mt-4 text-sm font-semibold text-burgundy-dark">
                      {packageTitle} · {datesLabel ?? `${nights} nights`} · {travellersLabel}
                      {selectedHotel ? ` · ${selectedHotel.name}` : ''}
                    </p>
                    <p className="mt-6 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      What your getaway includes
                    </p>
                    <ul className="mt-4 space-y-2">
                      {inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-champagne" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 md:p-8">
                    <h3 className="font-display text-xl font-bold text-burgundy-dark">Payment preference</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { id: '50%' as const, label: "I'd like to pay 50% to secure my booking" },
                        { id: 'full' as const, label: "I'd like to make full payment with a discount" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setPaymentOption(opt.id)}
                          className={cn(
                            'rounded-xl p-4 text-left text-sm font-medium transition-colors',
                            paymentOption === opt.id
                              ? 'bg-burgundy text-white'
                              : 'bg-cream text-burgundy ring-1 ring-border/60',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      You won't be charged any amount now — we'll send you a limited time payment link to secure
                      your booking.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60 md:p-8">
                    <h3 className="font-display text-xl font-bold text-burgundy-dark">Your details</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          value={contact.name}
                          onChange={(e) => setContact({ ...contact, name: e.target.value })}
                          className="mt-1 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          className="mt-1 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Mobile number</Label>
                        <Input
                          id="phone"
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          className="mt-1 h-12"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="requests">Special requests (optional)</Label>
                        <Textarea
                          id="requests"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setStep('stay')}
                    className="h-14 rounded-xl border-burgundy px-6 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-burgundy"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Change my stay
                  </Button>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">{summaryCard}</aside>
          </div>
        )}
      </main>

      {step !== 'received' && step !== 'experience' && (
        <GetawayTotalBar
          total={total}
          perPerson={total / Math.max(1, payingGuests)}
          ctaLabel={
            step === 'plan' ? 'Choose your stay' : step === 'stay' ? 'See my total' : 'Request to confirm'
          }
          onCta={
            step === 'plan'
              ? () => setStep('stay')
              : step === 'stay'
                ? () => setStep('book')
                : submitBooking
          }
          disabled={
            step === 'plan'
              ? !checkIn || !checkOut
              : step === 'stay'
                ? !selectedHotel
                : submitting || !contact.name || !contact.email || !contact.phone
          }
        />
      )}

      <Footer />
    </div>
  );
}

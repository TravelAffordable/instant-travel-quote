import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { DestinationImageMenu } from '@/components/DestinationImageMenu';
import { PackageCard } from '@/components/cards/PackageCard';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ArrowRight, MapPin, Calendar as CalendarIcon, Users, Check, Sparkles } from 'lucide-react';
import { cn, getDestinationHeroTitle } from '@/lib/utils';
import { getDestinationPage } from '@/data/destinationPages';
import { getPackagesByDestination, Package as TravelPackage } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { formatCurrency } from '@/lib/utils';
import { extractTourCode, getTourFromPrice } from '@/lib/packageTourPricing';
import NotFound from './NotFound';
import { getHolidayTeaserPrice, withTeaserAccommodation } from '@/lib/holidayTeaserPricing';
import { useTravelSearch } from '@/hooks/useTravelSearch';
import { calculatePackagePrice } from '@/data/packagePricing';
import { hotelDeals, dealHotelTotal } from '@/data/hotelDeals';

const SITE_URL = 'https://travelaffordable.co.za';

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = slug ? getDestinationPage(slug) : undefined;

  // Persistent Search Hook state across destinations
  const { searchState, updateSearch, setKidsCount, setKidAge } = useTravelSearch(slug || 'cape-town');

  const [requestPkg, setRequestPkg] = useState<TravelPackage | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [checkOutMonth, setCheckOutMonth] = useState<Date | undefined>();
  const [form, setForm] = useState({ name: '', tel: '', email: '', adults: 2, kids: 0, rooms: 1, budget: '', childAges: [] as number[] });

  if (!data) return <NotFound />;

  const canonical = `/destinations/${data.slug}`;
  const pkgs = getPackagesByDestination(data.destinationId);

  // Relevant hotels for cheapest price calculation in this destination
  const destinationHotels = hotelDeals.filter(
    (h) => h.destination.toLowerCase() === data.name.toLowerCase() || h.destination.toLowerCase().includes(data.slug.replace('-', ' '))
  );

  const advertisedPrices = pkgs
    .map(getHolidayTeaserPrice)
    .filter((price): price is number => price !== null);
  const advertisedStartingPrice = advertisedPrices.length
    ? Math.min(...advertisedPrices)
    : withTeaserAccommodation(data.startingFrom);

  const openRequest = (pkg: TravelPackage) => {
    setRequestPkg(pkg);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setForm({ name: '', tel: '', email: '', adults: searchState.adults, kids: searchState.kids, rooms: 1, budget: '', childAges: searchState.kidAges });
  };

  const closeRequest = () => {
    setRequestPkg(null);
    setCheckInOpen(false);
    setCheckOutOpen(false);
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestPkg) return;
    const subject = `Price request: ${requestPkg.name} (${data.name})`;
    const body = [
      `Package: ${requestPkg.name}`,
      `Destination: ${data.name}`,
      `Check-in: ${checkIn ? format(checkIn, 'PPP') : searchState.travelDate || '-'}`,
      `Check-out: ${checkOut ? format(checkOut, 'PPP') : '-'}`,
      `Name: ${form.name}`,
      `Tel: ${form.tel}`,
      `Email: ${form.email}`,
      `Adults: ${searchState.adults}`,
      `Kids: ${searchState.kids}`,
      `Child Ages: ${searchState.kidAges.length ? searchState.kidAges.map((a, i) => `Child ${i + 1}: ${a} yrs`).join(', ') : '-'}`,
      `Rooms: ${form.rooms}`,
      `Budget (ZAR): ${form.budget || '-'}`,
    ].join('\n');
    window.location.href = `mailto:info@travelaffordable.co.za?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    closeRequest();
  };

  // JSON-LD: TouristDestination + Breadcrumb + FAQ
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: data.name,
      description: data.intro,
      image: `${SITE_URL}${data.heroImage}`,
      url: `${SITE_URL}${canonical}`,
      address: { '@type': 'PostalAddress', addressRegion: data.region, addressCountry: 'ZA' },
      includesAttraction: data.highlights.map((h) => ({ '@type': 'TouristAttraction', name: h })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE_URL}/destinations` },
        { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE_URL}${canonical}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${data.name} Holiday Package`,
      image: `${SITE_URL}${data.heroImage}`,
      description: data.intro,
      brand: { '@type': 'Brand', name: 'Travel Affordable' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ZAR',
        price: advertisedStartingPrice,
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}${canonical}`,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={canonical}
        keywords={data.keywords}
        jsonLd={jsonLd}
      />
      <Header />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={data.heroImage}
            alt={`${data.name} holiday packages — ${data.region}`}
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-10">
            <div className="flex items-center gap-2 text-sm text-navy font-medium">
              <MapPin className="h-4 w-4" />
              <span>{data.region}, South Africa</span>
            </div>
            <h1 className="font-display mt-2 text-4xl font-bold text-navy md:text-6xl">
              {getDestinationHeroTitle(data.slug, data.name)}
            </h1>
          </div>
        </div>
      </section>

      {/* Destinations image menu */}
      <DestinationImageMenu activeSlug={data.slug} />

      {/* Packages & Group Search Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl font-bold text-navy mb-2">
          {data.name} Packages
        </h2>
        <p className="text-navy/80 mb-6">
          All available packages for {data.name}. Click any package to get an instant quote.
        </p>

        {/* Group Search Bar */}
        <div className="mb-10 bg-card border border-border rounded-3xl p-6 shadow-soft grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
              Date of Travel
            </Label>
            <Input
              type="date"
              value={searchState.travelDate}
              onChange={(e) => updateSearch({ travelDate: e.target.value })}
              className="w-full rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
              Adult Travellers
            </Label>
            <Select
              value={String(searchState.adults)}
              onValueChange={(v) => updateSearch({ adults: Number(v) })}
            >
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} Adult{n > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
              Kids
            </Label>
            <Select
              value={String(searchState.kids)}
              onValueChange={(v) => setKidsCount(Number(v))}
            >
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} Kid{n !== 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {searchState.kids > 0 && (
            <div className="sm:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border">
              {searchState.kidAges.map((age, idx) => (
                <div key={idx}>
                  <Label className="text-xs text-muted-foreground mb-1 block">Age of Child {idx + 1}</Label>
                  <Select
                    value={String(age)}
                    onValueChange={(v) => setKidAge(idx, Number(v))}
                  >
                    <SelectTrigger className="rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => i).map((a) => (
                        <SelectItem key={a} value={String(a)}>Age {a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Package Grid with Calculated Group Prices */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pkgs.map((pkg) => {
            const tourCode = extractTourCode(pkg);
            const pkgCost = tourCode ? calculatePackagePrice(tourCode, {
              adults: searchState.adults,
              childrenAges: searchState.kidAges,
            }) : null;

            // Find cheapest hotel total for group
            const nights = 2;
            let cheapestHotelTotal = 0;
            if (destinationHotels.length > 0) {
              const hotelTotals = destinationHotels.map((h) => dealHotelTotal(h, nights, searchState.adults) ?? 0).filter((t) => t > 0);
              if (hotelTotals.length > 0) {
                cheapestHotelTotal = Math.min(...hotelTotals);
              }
            }

            const groupTotalPrice = (pkgCost?.total ?? 0) + cheapestHotelTotal;

            return (
              <div key={pkg.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft flex flex-col justify-between p-6">
                <div>
                  <img src={getPackageImage(pkg, data.heroImage)} alt={pkg.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">TOUR CODE: {tourCode || pkg.id}</span>
                  <h3 className="text-xl font-black tracking-tight mt-1 text-navy">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pkg.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="text-2xl font-black text-primary">
                    {groupTotalPrice > 0 ? `R ${groupTotalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : getTourFromPrice(pkg, data.destinationId)}
                  </div>
                  <p className="text-xs font-bold text-foreground mt-0.5">Budget Conscious Hotel Option</p>
                  <p className="text-xs text-muted-foreground mt-1">Includes hotel and fun activities</p>
                  <p className="text-[11px] text-muted-foreground/80 italic mt-0.5">discounts subject to availability at various hotels</p>

                  <Button
                    onClick={() => openRequest(pkg)}
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 text-sm shadow-lift hover:opacity-90"
                  >
                    See your amazing options →
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Internal links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-navy">Other popular destinations</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['durban', 'cape-town', 'sun-city', 'hartbeespoort', 'magaliesburg', 'mpumalanga', 'bela-bela', 'umhlanga']
            .filter((s) => s !== data.slug)
            .map((s) => (
              <Link
                key={s}
                to={`/destinations/${s}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-navy hover:bg-muted"
              >
                {s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>
            ))}
        </div>
      </section>

      {/* Request Dialog with Budget Upgrade Prompt */}
      <Dialog open={!!requestPkg} onOpenChange={(o) => !o && closeRequest()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Prices & Upgrades</DialogTitle>
            <DialogDescription>
              {requestPkg ? `${requestPkg.name} — ${data.name}` : ''}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Check in date</Label>
                <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !checkIn && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : searchState.travelDate || 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(d) => {
                        setCheckIn(d);
                        if (d) {
                          if (checkOut && checkOut <= d) setCheckOut(undefined);
                          setCheckOutMonth(d);
                          setCheckInOpen(false);
                          setTimeout(() => setCheckOutOpen(true), 100);
                        }
                      }}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Check out date</Label>
                <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !checkOut && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(d) => {
                        setCheckOut(d);
                        if (d) setCheckOutOpen(false);
                      }}
                      disabled={(d) =>
                        checkIn ? d <= checkIn : d < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      month={checkOutMonth}
                      onMonthChange={setCheckOutMonth}
                      initialFocus
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rp-name">Name</Label>
              <Input id="rp-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rp-tel">Tel</Label>
                <Input id="rp-tel" type="tel" required value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rp-email">Email</Label>
                <Input id="rp-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* Budget Upgrade Prompt */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <Label htmlFor="rp-budget" className="font-bold text-navy">
                If you need a better hotel, please write the budget you would like to spend to see more options within your proposed budget. (ZAR) *
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                <Input
                  id="rp-budget"
                  type="number"
                  min={0}
                  required
                  className="pl-7"
                  placeholder="Enter your target budget"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeRequest}>Cancel</Button>
              <Button type="submit" disabled={!checkIn && !searchState.travelDate}>Send Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DestinationPage;

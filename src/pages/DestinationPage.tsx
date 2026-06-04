import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
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
import { cn } from '@/lib/utils';
import { getDestinationPage } from '@/data/destinationPages';
import { getPackagesByDestination, Package as TravelPackage } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { formatCurrency } from '@/lib/utils';
import NotFound from './NotFound';

const SITE_URL = 'https://travelaffordable.co.za';

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = slug ? getDestinationPage(slug) : undefined;

  const [requestPkg, setRequestPkg] = useState<TravelPackage | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [checkOutMonth, setCheckOutMonth] = useState<Date | undefined>();
  const [form, setForm] = useState({ name: '', tel: '', email: '', adults: 2, kids: 0, rooms: 1, budget: '', childAges: [] as number[] });

  if (!data) return <NotFound />;

  const canonical = `/destinations/${data.slug}`;

  const openRequest = (pkg: TravelPackage) => {
    setRequestPkg(pkg);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setForm({ name: '', tel: '', email: '', adults: 2, kids: 0, rooms: 1, budget: '', childAges: [] });
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
      `Check-in: ${checkIn ? format(checkIn, 'PPP') : '-'}`,
      `Check-out: ${checkOut ? format(checkOut, 'PPP') : '-'}`,
      `Name: ${form.name}`,
      `Tel: ${form.tel}`,
      `Email: ${form.email}`,
      `Adults: ${form.adults}`,
      `Kids: ${form.kids}`,
      `Child Ages: ${form.childAges.length ? form.childAges.map((a, i) => `Child ${i + 1}: ${a} yrs`).join(', ') : '-'}`,
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
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
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
        price: data.startingFrom,
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}${canonical}`,
      },
    },
  ];

  const goToQuote = () => navigate(`/?destination=${data.destinationId}#quote`);

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
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <MapPin className="h-4 w-4" />
              <span>{data.region}, South Africa</span>
            </div>
            <h1 className="font-display mt-2 text-4xl font-bold text-foreground md:text-6xl">
              {data.name} Weekend Getaways
            </h1>
            <p className="mt-3 max-w-2xl text-base text-navy md:text-lg font-medium">
              Trusted by South African families. Instant all-inclusive quotes from <strong className="text-navy">R{data.startingFrom.toLocaleString('en-ZA')}pp</strong> — accommodation and activities included, no hidden costs.
            </p>
          </div>
        </div>
      </section>

      {/* Intro removed per request — packages section below */}


      {/* Packages */}
      {(() => {
        const pkgs = getPackagesByDestination(data.destinationId);
        if (!pkgs.length) return null;
        return (
          <section className="container mx-auto px-4 py-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              {data.name} Packages
            </h2>
            <p className="text-muted-foreground mb-8">
              All available packages for {data.name}. Click any package to get an instant quote.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pkgs.map((pkg) => {
                const img = getPackageImage(pkg.id) || data.heroImage;
                const fromPrice = pkg.fromPriceOverride ?? pkg.basePrice;
                return (
                  <Card key={pkg.id} className="overflow-hidden flex flex-col">
                    <div className="h-44 overflow-hidden">
                      <img src={img} alt={pkg.shortName} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {pkg.name.replace(/^[A-Z]+\d+\s*-\s*/, '')}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        <CalendarIcon className="inline h-3 w-3 mr-1" />{pkg.duration}
                      </p>
                      <p className="text-sm text-foreground/80 mt-3 line-clamp-3 flex-1">
                        {pkg.description}
                      </p>
                      {pkg.activitiesIncluded?.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {pkg.activitiesIncluded.slice(0, 4).map((a) => (
                            <li key={a} className="text-xs text-foreground/70 flex items-start gap-1">
                              <Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{a}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase">From</p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(fromPrice)}<span className="text-xs font-normal"> pp</span>
                          </p>
                        </div>
                        <Button size="sm" onClick={() => openRequest(pkg)}>
                          Request Prices <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* FAQs */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-bold text-foreground">
            {data.name} holiday FAQs
          </h2>
          <div className="mt-6 space-y-4">
            {data.faqs.map((f) => (
              <Card key={f.question}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{f.question}</h3>
                  <p className="mt-2 text-foreground/80">{f.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground">Other popular destinations</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['durban', 'cape-town', 'sun-city', 'hartbeespoort', 'magaliesburg', 'mpumalanga', 'bela-bela', 'umhlanga']
            .filter((s) => s !== data.slug)
            .map((s) => (
              <Link
                key={s}
                to={`/destinations/${s}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                {s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>
            ))}
        </div>
      </section>


      <Dialog open={!!requestPkg} onOpenChange={(o) => !o && closeRequest()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Prices</DialogTitle>
            <DialogDescription>
              {requestPkg ? `${requestPkg.name} — ${data.name}` : ''}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRequest} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Check in date (when you arrive)</Label>
                <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal', !checkIn && 'text-muted-foreground')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'PPP') : 'Pick a date'}
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
                <Label>Check out date (when you leave)</Label>
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
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>How many Adults</Label>
                <Select value={String(form.adults)} onValueChange={(v) => setForm({ ...form, adults: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>How many Kids</Label>
                <Select
                  value={String(form.kids)}
                  onValueChange={(v) => {
                    const k = Number(v);
                    const childAges = Array.from({ length: k }, (_, i) => form.childAges[i] ?? 5);
                    setForm({ ...form, kids: k, childAges });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 101 }, (_, i) => i).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Rooms *</Label>
                <Select value={String(form.rooms)} onValueChange={(v) => setForm({ ...form, rooms: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.kids > 0 && (
              <div className="space-y-2">
                <Label>Child Ages (3-17 years)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {form.childAges.map((age, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm whitespace-nowrap">Child {i + 1}:</span>
                      <Select
                        value={String(age)}
                        onValueChange={(v) => {
                          const next = [...form.childAges];
                          next[i] = Number(v);
                          setForm({ ...form, childAges: next });
                        }}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {Array.from({ length: 15 }, (_, n) => n + 3).map((n) => (
                            <SelectItem key={n} value={String(n)}>{n} yrs</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="rp-budget">How much would you like to spend for your whole group? (ZAR) *</Label>
              <p className="text-xs text-muted-foreground">
                Enter how much you'd like to spend for your whole group so we can find the best options that fit your pocket.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                <Input
                  id="rp-budget"
                  type="number"
                  min={0}
                  required
                  className="pl-7"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeRequest}>Cancel</Button>
              <Button type="submit" disabled={!checkIn || !checkOut}>Send Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DestinationPage;

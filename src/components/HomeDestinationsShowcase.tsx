import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, MapPin, Calendar as CalendarIcon, Check } from 'lucide-react';
import { cn, getDestinationHeroTitle } from '@/lib/utils';
import { destinationPages } from '@/data/destinationPages';
import { getPackagesByDestination } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { formatCurrency } from '@/lib/utils';
import { extractTourCode, getTourFromPrice } from '@/lib/packageTourPricing';

// Order: Durban, Harties, Sun City, Magalies, Mpumalanga, Cape Town, Bela-Bela, Vaal River, Knysna
const ORDERED_SLUGS = [
  'durban',
  'hartbeespoort',
  'sun-city',
  'magaliesburg',
  'mpumalanga',
  'cape-town',
  'bela-bela',
  'vaal-river',
  'knysna',
] as const;

const NAV_ITEMS = [
  { slug: 'durban', label: 'Durban' },
  { slug: 'umhlanga', label: 'Umhlanga' },
  { slug: 'cape-town', label: 'Cape Town' },
  { slug: 'sun-city', label: 'Sun City' },
  { slug: 'hartbeespoort', label: 'Harties' },
  { slug: 'magaliesburg', label: 'Magalies' },
  { slug: 'mpumalanga', label: 'Mpumalanga' },
  { slug: 'bela-bela', label: 'Bela-Bela' },
  { slug: 'vaal-river', label: 'Emerald Casino and Vaal Cruise' },
  { slug: 'knysna', label: 'Knysna' },
];

function DestinationsNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="border-y border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3 overflow-x-auto">
        <ul className="flex flex-nowrap items-center gap-2 md:gap-3 justify-center min-w-max">
          {NAV_ITEMS.map((d) => {
            const active = d.slug === activeSlug;
            return (
              <li key={d.slug}>
                <a
                  href={`#dest-${d.slug}`}
                  className={cn(
                    'inline-block whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-navy hover:bg-muted',
                  )}
                >
                  {d.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function HomeDestinationsShowcase() {
  return (
    <div className="bg-background">
      {ORDERED_SLUGS.map((slug) => {
        const data = destinationPages.find((d) => d.slug === slug);
        if (!data) return null;
        const pkgs = getPackagesByDestination(data.destinationId);
        if (!pkgs.length) return null;

        return (
          <div key={slug} id={`dest-${slug}`} className="scroll-mt-24">
            {/* Destination Hero — mirrors DestinationPage */}
            <section className="relative">
              <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
                <img
                  src={data.heroImage}
                  alt={`${data.name} holiday packages — ${data.region}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  width={1920}
                  height={1080}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-10">
                  <div className="flex items-center gap-2 text-sm text-navy font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{data.region}, South Africa</span>
                  </div>
                  <h2 className="font-display mt-2 text-4xl font-bold text-navy md:text-6xl">
                    {getDestinationHeroTitle(slug, data.name)}
                  </h2>
                </div>
              </div>
            </section>

            {/* Nav bar (active destination highlighted) */}
            <DestinationsNav activeSlug={slug} />

            {/* Packages */}
            <section className="container mx-auto px-4 py-12">
              <h3 className="font-display text-3xl font-bold text-navy mb-2">
                {data.name} Packages
              </h3>
              <p className="text-navy/80 mb-8">
                All available packages for {data.name}.{' '}
                <Link
                  to={`/destinations/${data.slug}`}
                  className="text-primary font-semibold underline"
                >
                  Open {data.name} page
                </Link>{' '}
                to request prices.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pkgs.map((pkg) => {
                  const img = getPackageImage(pkg.id) || data.heroImage;
                  const tourCode = extractTourCode(pkg.name);
                  const fromPrice = getTourFromPrice(pkg.name);
                  return (
                    <Card key={pkg.id} className="overflow-hidden flex flex-col">
                      <div className="h-44 overflow-hidden">
                        <img
                          src={img}
                          alt={pkg.shortName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1 text-center">
                        {tourCode && (
                          <p className="font-['Anton'] text-xs font-bold text-primary tracking-widest mb-1">
                            TOUR CODE: {tourCode}
                          </p>
                        )}
                        <h4 className="font-['Anton'] text-lg font-bold text-navy uppercase tracking-wide">
                          {pkg.name.replace(/^[A-Z]+\d*[A-Z]*\s*-\s*/, '')}
                        </h4>
                        <p className="font-['Anton'] text-xs text-navy/70 mt-1 uppercase tracking-wide">
                          <CalendarIcon className="inline h-3 w-3 mr-1" />
                          {pkg.duration}
                        </p>
                        <p className="font-['Anton'] text-sm text-navy/80 mt-3 line-clamp-3 flex-1 uppercase">
                          {pkg.description}
                        </p>
                        {pkg.activitiesIncluded?.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {pkg.activitiesIncluded.slice(0, 4).map((a) => (
                              <li
                                key={a}
                                className="text-xs text-navy/80 flex items-center justify-center gap-1"
                              >
                                <Check className="h-3 w-3 text-primary shrink-0" />
                                <span className="font-['Anton'] line-clamp-1 uppercase text-gold">
                                  {a}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {fromPrice !== null && (
                          <div className="mt-4">
                            <p className="font-['Anton'] text-navy">
                              <span className="text-sm uppercase tracking-wide">From </span>
                              <span className="text-2xl font-bold text-primary">{formatCurrency(fromPrice)}</span>
                              <span className="text-sm uppercase tracking-wide"> pp</span>
                            </p>
                            <p className="mt-1 text-[11px] text-navy/70">
                              was <span className="line-through">{formatCurrency(fromPrice + 400)} pp</span>
                            </p>
                            <p className="text-[11px] text-navy/70 italic">
                              discounts subject to availability at various hotels
                            </p>
                          </div>
                        )}
                        <div className="mt-4 pt-4 border-t flex items-center justify-center gap-4">
                          <Button size="sm" asChild>
                            <Link to={`/destinations/${data.slug}`}>
                              Request Prices <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {slug === 'durban' && (
                <div className="mt-8 max-w-3xl mx-auto text-center">
                  <p className="text-sm md:text-base text-navy/80 leading-relaxed">
                    Should you be interested in a deal you saw on shot left that may not appear on the website, or if you are looking to get assistance without searching the website, please send an email to{' '}
                    <a href="mailto:info@travelaffordable.co.za" className="text-primary font-semibold underline">info@travelaffordable.co.za</a>{' '}
                    or WhatsApp{' '}
                    <a href="https://wa.me/27796813869" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline">079 681 3869</a>{' '}
                    or please fill out this request form (please be aware that the prices you see on shotleft are per person not per couple).
                  </p>
                </div>
              )}
            </section>
          </div>
        );
      })}

      {/* Shotleft Deals section */}
      <div className="max-w-3xl mx-auto text-left bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl my-12">
        <h2 className="text-4xl md:text-5xl text-center mb-4 tracking-wide" style={{ fontFamily: "'Anton', sans-serif", fontWeight: 700, color: '#D4AF37' }}>
          Shotleft Deals
        </h2>
        <p className="text-sm md:text-base text-foreground/80 text-center mb-6 leading-relaxed">
          Should you be interested in a deal you saw on shot left that may not appear on the website, or if you are looking to get assistance without searching the website, please send an email to{' '}
          <a href="mailto:info@travelaffordable.co.za" className="text-primary font-semibold underline">info@travelaffordable.co.za</a>{' '}
          or WhatsApp{' '}
          <a href="https://wa.me/27796813869" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline">079 681 3869</a>{' '}
          or please fill out this request form (please be aware that the prices you see on shotleft are per person not per couple).
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget as HTMLFormElement;
            const data = new FormData(f);
            const body = `Full name: ${data.get('fullName')}%0D%0AEmail: ${data.get('email')}%0D%0ATelephone: ${data.get('telephone')}%0D%0ADeal interested in: ${data.get('deal')}%0D%0ATravel dates: ${data.get('dates')}%0D%0ANumber of people: ${data.get('people')}%0D%0APrice of the deal: ${data.get('price')}`;
            window.location.href = `mailto:info@travelaffordable.co.za?subject=Shotleft Deal Request&body=${body}`;
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
        >
          <label className="md:col-span-2 flex items-center gap-2">
            <span className="whitespace-nowrap">Full name:</span>
            <Input name="fullName" required maxLength={100} className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Email Address:</span>
            <Input name="email" type="email" required maxLength={255} className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Telephone:</span>
            <Input name="telephone" type="tel" required maxLength={20} className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Deal interested in:</span>
            <Input name="deal" required maxLength={200} className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Travel dates:</span>
            <Input name="dates" required maxLength={100} placeholder="e.g. 12-15 June 2026" className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Number of people:</span>
            <Input name="people" type="number" min={1} max={100} required className="h-8 flex-1 text-sm" />
          </label>
          <label className="flex items-center gap-2">
            <span className="whitespace-nowrap">Price you saw on Shotleft or Google:</span>
            <Input name="price" required maxLength={50} placeholder="e.g. R3 500 pp" className="h-8 flex-1 text-sm" />
          </label>
          <div className="md:col-span-2">
            <Button type="submit" size="sm" className="w-full bg-primary text-primary-foreground font-semibold">
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

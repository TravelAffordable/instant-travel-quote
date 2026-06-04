import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { destinationPages } from '@/data/destinationPages';
import { getPackagesByDestination } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';

// Order specified by user (Umhlanga excluded — covered under Durban):
// Durban, Harties, Sun City, Magalies, Mpumalanga, Cape Town, Bela Bela, Vaal Cruise & Emerald Casino, Knysna
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
  { slug: 'hartbeespoort', label: 'Hartbeespoort' },
  { slug: 'magaliesburg', label: 'Magaliesburg' },
  { slug: 'mpumalanga', label: 'Mpumalanga' },
  { slug: 'bela-bela', label: 'Bela-Bela' },
  { slug: 'vaal-river', label: 'Vaal River' },
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
      {/* Nav bar moved here — under Shotleft Deals */}
      <DestinationsNav />

      {ORDERED_SLUGS.map((slug) => {
        const data = destinationPages.find((d) => d.slug === slug);
        if (!data) return null;
        const pkgs = getPackagesByDestination(data.destinationId);
        if (!pkgs.length) return null;

        return (
          <div key={slug}>
            <section
              id={`dest-${slug}`}
              className="container mx-auto px-4 py-12 scroll-mt-24"
            >
              <h2 className="font-display text-3xl font-bold text-navy mb-2">
                {data.name} Packages
              </h2>
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
                        <h3 className="font-['Anton'] text-lg font-bold text-navy uppercase tracking-wide">
                          {pkg.name.replace(/^[A-Z]+\d+\s*-\s*/, '')}
                        </h3>
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
            </section>

            {/* Nav bar between every destination */}
            <DestinationsNav activeSlug={slug} />
          </div>
        );
      })}
    </div>
  );
}

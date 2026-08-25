import { Link } from 'react-router-dom';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { cn } from '@/lib/utils';

/**
 * Compact destination image menu shown in the same position on every page,
 * directly under the hero. Clicking a destination opens its packages.
 */
export function DestinationImageMenu({ activeSlug }: { activeSlug?: string }) {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
          Your Favourite Destinations
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8">
          {catalogueDestinations.map((d) => {
            const active = d.slug === activeSlug;
            return (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className={cn(
                  'group relative block overflow-hidden rounded-xl ring-1 transition-shadow hover:shadow-lg',
                  active ? 'ring-2 ring-primary' : 'ring-border',
                )}
              >
                <img
                  src={d.image}
                  alt={`${d.name} holiday packages`}
                  loading="lazy"
                  className="h-20 w-full object-cover transition-transform duration-300 group-hover:scale-105 md:h-24"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 px-2 pb-1.5 text-[11px] font-semibold leading-tight text-white md:text-xs">
                  {d.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

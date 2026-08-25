import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock } from 'lucide-react';
import type { Package } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { getPackageFromPrice } from '@/data/packagePricing';
import { extractTourCode } from '@/lib/packageTourPricing';

interface GetawayCardProps {
  pkg: Package;
  destinationSlug: string;
  fallbackImage?: string;
}

export function GetawayCard({ pkg, destinationSlug, fallbackImage }: GetawayCardProps) {
  const code = extractTourCode(pkg.name) ?? pkg.id.toUpperCase();
  const image = getPackageImage(pkg.id) || fallbackImage || '/placeholder.svg';
  const fromPrice = getPackageFromPrice(code);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-md ring-1 ring-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={pkg.shortName}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-burgundy px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white">
          {code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold leading-snug text-burgundy-dark">
          {pkg.shortName}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-champagne" /> {pkg.duration}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {pkg.description}
        </p>

        {pkg.activitiesIncluded.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {pkg.activitiesIncluded
              .filter((a) => a.toLowerCase() !== 'accommodation')
              .slice(0, 3)
              .map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" />
                  <span className="line-clamp-1">{a}</span>
                </li>
              ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          {fromPrice !== null && (
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Experience from
            </p>
          )}
          {fromPrice !== null && (
            <p className="font-display text-3xl font-bold text-burgundy">
              R{fromPrice.toLocaleString('en-ZA')}
              <span className="ml-1 font-sans text-xs font-medium text-muted-foreground">per person</span>
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">You choose your accommodation next</p>

          <Link
            to={`/getaway?destination=${destinationSlug}&package=${pkg.id}`}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-burgundy-dark"
          >
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

import { Link } from 'react-router-dom';
import { Calendar, Check, ArrowRight } from 'lucide-react';
import { ResponsiveImage } from '@/components/common/ResponsiveImage';
import type { Package } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { getPackageFromPrice } from '@/data/packagePricing';

interface ExperienceCardProps {
  pkg: Package;
  destinationName: string;
  destinationSlug: string;
  fallbackImage?: string;
}

export function ExperienceCard({
  pkg,
  destinationName,
  destinationSlug,
  fallbackImage,
}: ExperienceCardProps) {
  const image = getPackageImage(pkg.id) || fallbackImage || '/placeholder.svg';
  const fromPrice = getPackageFromPrice(pkg.id);
  const title = pkg.name.replace(/^[A-Z]+\d*[A-Z]*\s*-\s*/, '');

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <ResponsiveImage src={image} alt={title} ratio="photo" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/70">
          {destinationName}
        </p>
        <h3 className="mt-1 font-display text-sm font-bold uppercase leading-snug text-primary">
          {title}
        </h3>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /> {pkg.duration}
        </p>
        {pkg.activitiesIncluded?.length > 0 && (
          <ul className="mt-2 space-y-1">
            {pkg.activitiesIncluded.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-xs text-foreground/80">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-4">
          {fromPrice !== null && (
            <p className="text-sm font-semibold text-foreground">
              Package from{' '}
              <span className="text-sunset">R{fromPrice.toLocaleString('en-ZA')}</span> per person
            </p>
          )}
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Accommodation added in the next step
          </p>
          <Link
            to={`/book?destination=${destinationSlug}&package=${pkg.id}`}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Choose this experience <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    <Link
      to={`/book?destination=${destinationSlug}&package=${pkg.id}`}
      className="group relative block overflow-hidden rounded-2xl shadow-md ring-1 ring-border transition-shadow hover:shadow-xl"
    >
      <ResponsiveImage src={image} alt={title} ratio="photo" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/60 to-navy/10" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-white/80">{destinationName}</p>
        <h3 className="font-display text-xl font-bold uppercase leading-snug text-white">{title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
          <Calendar className="h-3 w-3" /> {pkg.duration}
        </p>
        {pkg.activitiesIncluded?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {pkg.activitiesIncluded.slice(0, 4).map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-sm text-white/90">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span className="line-clamp-1">{activity}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            {fromPrice !== null && (
              <p className="text-sm font-semibold text-white">
                <span className="text-white/80">Package from </span>
                <span className="text-gold">R{fromPrice.toLocaleString('en-ZA')}</span>
                <span className="text-white/80"> per person</span>
              </p>
            )}
            <p className="mt-1 text-xs text-white/75">Accommodation added in the next step</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-white transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

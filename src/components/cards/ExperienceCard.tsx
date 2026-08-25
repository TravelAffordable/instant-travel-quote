import { Link } from 'react-router-dom';
import { Calendar, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/70 shadow-md transition-shadow hover:shadow-xl">
      <ResponsiveImage src={image} alt={title} ratio="wide" />
      <CardContent className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{destinationName}</p>
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-foreground">{title}</h3>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /> {pkg.duration}
        </p>
        {pkg.activitiesIncluded?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {pkg.activitiesIncluded.slice(0, 4).map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                <span className="line-clamp-1">{activity}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-5">
          {fromPrice !== null && (
            <p className="text-sm text-muted-foreground">
              Package from{' '}
              <span className="font-display text-2xl font-bold text-sunset">
                R{fromPrice.toLocaleString('en-ZA')}
              </span>{' '}
              per person
            </p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Accommodation added in the next step</p>
          <Button asChild className="mt-4 w-full">
            <Link to={`/book?destination=${destinationSlug}&package=${pkg.id}`}>
              Choose this experience <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Link } from 'react-router-dom';
import { Calendar, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/common/ResponsiveImage';
import type { Package } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import { getHolidayTeaserPrice } from '@/lib/holidayTeaserPricing';
import { roundToNearest10 } from '@/lib/utils';
import type { GroupPrice } from '@/lib/groupPricing';

interface ExperienceCardProps {
  pkg: Package;
  destinationName: string;
  destinationSlug: string;
  fallbackImage?: string;
  /** Cheapest total for the guest's whole group, once their dates and group are known. */
  groupPrice?: GroupPrice;
  /** Short description of the trip, e.g. "2 adults, 2 children · 3 nights". */
  tripLabel?: string;
}

export function ExperienceCard({
  pkg,
  destinationName,
  destinationSlug,
  fallbackImage,
  groupPrice,
  tripLabel,
}: ExperienceCardProps) {
  const image = getPackageImage(pkg.id) || fallbackImage || '/placeholder.svg';
  const fromPrice = getHolidayTeaserPrice(pkg);
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
          {groupPrice?.status === 'ok' ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Cheapest total for your group
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-display text-2xl font-bold text-sunset">
                  R{roundToNearest10(groupPrice.total).toLocaleString('en-ZA')}
                </span>{' '}
                total
              </p>
              {tripLabel && <p className="mt-1 text-xs font-semibold text-muted-foreground">{tripLabel}</p>}
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Includes hotel and fun activities</p>
              {groupPrice.childPriceOnRequest && (
                <p className="mt-1 text-[10px] italic text-muted-foreground">
                  Price for some children is on request and not included in this total
                </p>
              )}
            </>
          ) : groupPrice?.status === 'unavailable' ? (
            <>
              <p className="text-base font-bold text-foreground">Not available for your dates</p>
              <p className="mt-1 text-xs text-muted-foreground">Try different dates or ask us for help.</p>
            </>
          ) : (
            <>
              {fromPrice !== null && (
                <p className="text-sm text-muted-foreground">
                  Package from{' '}
                  <span className="font-display text-2xl font-bold text-sunset">
                    R{fromPrice.toLocaleString('en-ZA')}
                  </span>{' '}
                  per person
                </p>
              )}
              <p className="mt-1 text-xs font-semibold text-muted-foreground">Includes hotel and fun activities</p>
              <p className="mt-1 text-[10px] italic text-muted-foreground">discounts subject to availability at various hotels</p>
            </>
          )}
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

import { Link } from 'react-router-dom';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { extractTourCode, TOUR_FROM_PRICES } from '@/lib/packageTourPricing';
import { getHolidayTeaserPrice } from '@/lib/holidayTeaserPricing';
import type { Package } from '@/data/travelData';
import { getPackageImage } from '@/data/packageImages';
import type { GroupPrice } from '@/lib/groupPricing';

/** Turn a long package name into a short, human headline. */
export function getPackageHeadline(name: string): string {
  let title = name.replace(/^[A-Z]+\d*[A-Z]*\s*-\s*/, '').trim();
  // Cut everything from the inclusions list onwards
  title = title.split(/\s+with\s+accommodation/i)[0];
  title = title.split(/\s+including\s+/i)[0];
  title = title.split(/\s+includes\s+/i)[0];
  if (title.length > 70) title = title.split(',')[0];
  title = title.replace(/\s+with\s+$/i, '').trim();
  return title;
}

interface PackageCardProps {
  pkg: Package;
  destinationSlug: string;
  fallbackImage?: string;
  /** Cheapest total for the guest's whole group, once they have searched. */
  groupPrice?: GroupPrice;
  /** Saved trip details (dates, adults, children) passed on to the booking page. */
  tripQuery?: string;
  /** Short description of the search, e.g. "2 adults, 2 children · 3 nights". */
  tripLabel?: string;
}

export function PackageCard({ pkg, destinationSlug, fallbackImage, groupPrice, tripQuery, tripLabel }: PackageCardProps) {
  const img = getPackageImage(pkg.id) || fallbackImage || '/placeholder.svg';
  const idCode = pkg.id.toUpperCase();
  const idCodePrice = TOUR_FROM_PRICES[idCode] ?? null;
  const tourCode = extractTourCode(pkg.name) ?? (idCodePrice !== null ? idCode : null);
  const fromPrice = getHolidayTeaserPrice(pkg);
  const headline = getPackageHeadline(pkg.name);
  const inclusions = pkg.activitiesIncluded ?? [];

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/60 shadow-lg">
      {/* Image with overlays */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <img src={img} alt={headline} className="h-full w-full object-cover" loading="lazy" />
        {tourCode && (
          <div className="absolute left-4 top-4 rounded-lg bg-background/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-navy">
              Tour code: {tourCode}
            </span>
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-navy shadow-md">
          <Clock className="h-3.5 w-3.5" />
          {pkg.duration}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="mb-3 text-3xl uppercase leading-[0.95] text-navy"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {headline}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {pkg.description}
        </p>

        {inclusions.length > 0 && (
          <div className="mb-8 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              What's included
            </p>
            <ul className="space-y-3">
              {inclusions.slice(0, 5).map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={3} />
                  <span className="text-[15px] font-semibold leading-snug text-navy">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.id === 'kruger001' && (
          <p className="mb-4 text-xs text-muted-foreground">
            For kids pricing please send a request to{' '}
            <a href="mailto:info@travelaffordable.co.za" className="underline">info@travelaffordable.co.za</a>{' '}
            or WhatsApp{' '}
            <a href="https://wa.me/27796813869" target="_blank" rel="noopener noreferrer" className="underline">079 681 3869</a>
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto">
          {groupPrice?.status === 'ok' ? (
            <div className="mb-5 space-y-1 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Cheapest total for your group
              </p>
              <div className="flex flex-wrap items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-sunset">
                  {`R${roundToNearest10(groupPrice.total).toLocaleString('en-ZA')}`} <span className="text-base font-bold">total</span>
                </span>
              </div>
              {tripLabel && <p className="text-xs font-semibold text-muted-foreground">{tripLabel}</p>}
              <p className="text-xs font-semibold text-muted-foreground">
                Includes hotel and fun activities
              </p>
              {groupPrice.childPriceOnRequest && (
                <p className="text-[10px] italic text-muted-foreground">
                  Price for some children is on request and not included in this total
                </p>
              )}
            </div>
          ) : groupPrice?.status === 'unavailable' ? (
            <div className="mb-5 space-y-1 text-center">
              <p className="text-base font-bold text-navy">Not available for your dates</p>
              <p className="text-xs text-muted-foreground">Try different dates or ask us for help.</p>
            </div>
          ) : (
            fromPrice !== null && (
              <div className="mb-5 space-y-1 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">From</p>
                <div className="flex flex-wrap items-baseline justify-center gap-2">
                  <span className="text-4xl font-black text-sunset">
                    {formatCurrency(fromPrice)} <span className="text-base font-bold">per person</span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Includes hotel and fun activities
                </p>
                <p className="text-[10px] italic text-muted-foreground">
                  discounts subject to availability at various hotels
                </p>
              </div>
            )
          )}

          <Link
            to={`/book?destination=${destinationSlug}&package=${pkg.id}${tripQuery ? `&${tripQuery}` : ''}${
              groupPrice?.status === 'ok' && groupPrice.requestedRooms > 1 ? `&rooms=${groupPrice.requestedRooms}` : ''
            }`}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90"
          >
            See your amazing options
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

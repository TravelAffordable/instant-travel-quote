import { BedDouble, Check, MapPin, Star, Utensils } from 'lucide-react';
import type { Hotel } from '@/data/travelData';
import { mealBasis } from '@/lib/accommodationTiers';
import type { AccommodationTier } from '@/components/common/TierSelector';
import { stayLabelClass, stayLabelFor } from '@/lib/stayLabels';
import { cn } from '@/lib/utils';

interface StayCardProps {
  hotel: Hotel;
  tier: AccommodationTier;
  destinationName: string;
  nights: number;
  rooms: number;
  /** Accommodation amount being added to the getaway. */
  price: number;
  /** Resulting complete holiday total if this stay is chosen. */
  resultingTotal: number;
  guests: number;
  selected?: boolean;
  onSelect: (hotelId: string) => void;
}

export function StayCard({
  hotel,
  tier,
  destinationName,
  nights,
  rooms,
  price,
  resultingTotal,
  guests,
  selected,
  onSelect,
}: StayCardProps) {
  const label = stayLabelFor(tier);
  const perPerson = Math.round(resultingTotal / Math.max(1, guests));

  return (
    <button
      type="button"
      onClick={() => onSelect(hotel.id)}
      className={cn(
        'group flex w-full flex-col overflow-hidden rounded-2xl bg-card text-left shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-premium)]',
        selected ? 'ring-2 ring-burgundy' : 'ring-1 ring-border/60',
      )}
      aria-pressed={selected}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={cn(
            'absolute left-4 top-4 rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em]',
            stayLabelClass[label],
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
            selected ? 'border-burgundy bg-burgundy' : 'border-white/80 bg-white/30',
          )}
        >
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-burgundy-dark">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {destinationName}
        </p>
        {hotel.rating > 0 && (
          <div className="mt-2 flex items-center gap-0.5" aria-label={`${hotel.rating} star`}>
            {Array.from({ length: Math.round(hotel.rating) }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-champagne text-champagne" />
            ))}
          </div>
        )}

        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-burgundy" />
            {hotel.roomType || `${hotel.capacity ?? 2}-sleeper room`}
            {rooms > 1 ? ` · ${rooms} rooms` : ''}
          </p>
          <p className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-burgundy" />
            {mealBasis(hotel)}
          </p>
        </div>

        {hotel.amenities.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((a) => (
              <li key={a} className="rounded-full bg-cream px-2.5 py-1 text-[0.68rem] text-burgundy">
                {a}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Adds to your getaway
            </p>
            <p className="font-display text-xl font-bold text-burgundy">
              + R{Math.round(price).toLocaleString('en-ZA')}
            </p>
            <p className="text-[0.68rem] text-muted-foreground">
              {nights} night{nights === 1 ? '' : 's'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Total from
            </p>
            <p className="font-display text-xl font-bold text-burgundy-dark">
              R{Math.round(resultingTotal).toLocaleString('en-ZA')}
            </p>
            <p className="text-[0.68rem] text-muted-foreground">
              R{perPerson.toLocaleString('en-ZA')} pp
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

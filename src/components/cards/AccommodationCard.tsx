import { MapPin, Star, Utensils, BedDouble, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/common/ResponsiveImage';
import type { Hotel } from '@/data/travelData';
import { mealBasis } from '@/lib/accommodationTiers';
import type { AccommodationTier } from '@/components/common/TierSelector';
import { cn } from '@/lib/utils';

interface AccommodationCardProps {
  hotel: Hotel;
  tier: AccommodationTier;
  destinationName: string;
  nights: number;
  rooms: number;
  price: number;
  showPrice?: boolean;
  luxuryBadge?: boolean;
  selected?: boolean;
  onSelect: (hotelId: string) => void;
}

export function AccommodationCard({
  hotel,
  tier,
  destinationName,
  nights,
  rooms,
  price,
  showPrice = false,
  luxuryBadge = false,
  selected,
  onSelect,
}: AccommodationCardProps) {
  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl',
        selected ? 'ring-2 ring-primary' : 'ring-1 ring-border',
      )}
    >
      <div className="relative">
        <ResponsiveImage src={hotel.image} alt={hotel.name} ratio="wide" />
        {luxuryBadge && (
          <span className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-foreground">
            Luxury
          </span>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-foreground">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {destinationName}
        </p>
        {hotel.rating > 0 && (
          <div className="mt-2 flex items-center gap-0.5" aria-label={`${hotel.rating} star`}>
            {Array.from({ length: Math.round(hotel.rating) }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
            ))}
          </div>
        )}
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-primary" />
            {hotel.roomType || `${hotel.capacity ?? 2}-sleeper room`}
          </p>
          <p className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary" />
            {mealBasis(hotel)}
          </p>
        </div>
        {hotel.amenities?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <li
                key={a}
                className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                <Check className="h-3 w-3 text-accent" /> {a}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-5">
          <p className="text-sm text-muted-foreground">
            {showPrice && (
              <>
                <span className="font-display text-2xl font-bold text-foreground">
                  R{Math.round(price).toLocaleString('en-ZA')}
                </span>{' '}
              </>
            )}
            {nights} night{nights === 1 ? '' : 's'}
            {rooms > 1 ? `, ${rooms} rooms` : ''}
          </p>
          <Button
            className="mt-4 w-full whitespace-normal py-3 leading-snug"
            variant={selected ? 'secondary' : 'default'}
            onClick={() => onSelect(hotel.id)}
          >
            {selected ? 'Selected' : 'Select accommodation to see total price on the right'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

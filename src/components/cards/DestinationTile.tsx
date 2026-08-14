import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { ResponsiveImage } from '@/components/common/ResponsiveImage';
import type { CatalogueDestination } from '@/data/destinationCatalogue';

interface DestinationTileProps {
  destination: CatalogueDestination;
  fromPrice?: number | null;
}

export function DestinationTile({ destination, fromPrice }: DestinationTileProps) {
  const to = destination.enquireOnly
    ? `/book?destination=${destination.slug}`
    : `/destinations/${destination.slug}`;

  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl shadow-md ring-1 ring-border transition-shadow hover:shadow-xl"
    >
      <ResponsiveImage src={destination.image} alt={`${destination.name} holidays`} ratio="photo" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="flex items-center gap-1 text-xs font-medium text-white/80">
          <MapPin className="h-3 w-3" /> {destination.region}
        </p>
        <h3 className="font-display text-2xl font-bold text-white">{destination.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-white/85">{destination.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          {destination.enquireOnly ? (
            <span className="text-sm font-semibold text-white/90">Enquire now</span>
          ) : (
            <span className="text-sm font-semibold text-white">
              {typeof fromPrice === 'number' ? (
                <>
                  <span className="text-white/80">Packages from </span>
                  <span className="text-gold">R{fromPrice.toLocaleString('en-ZA')} pp</span>
                </>
              ) : (
                'View packages'
              )}
            </span>
          )}
          <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

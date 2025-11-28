import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '@/data/travelData';

interface DestinationCardProps {
  destination: Destination;
  onViewPackages: (destinationId: string) => void;
}

export function DestinationCard({ destination, onViewPackages }: DestinationCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="destination-card group overflow-hidden border-0 shadow-soft bg-card cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="destination-overlay absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300" />
        {destination.international && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
            International
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="destination-title text-xl font-display font-bold text-white transition-transform duration-300">
            {destination.name}
          </h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {destination.country}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(destination.startingPrice)}
            </p>
          </div>
          <Button
            onClick={() => onViewPackages(destination.id)}
            size="sm"
            className="group/btn bg-primary hover:bg-primary/90"
          >
            View Packages
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

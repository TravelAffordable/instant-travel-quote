import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Building2 } from 'lucide-react';
import { LiveHotelQuoteCard } from './LiveHotelQuoteCard';
import { type LiveHotelsResult, type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';

interface LiveHotelQuotesProps {
  hotels: LiveHotelsResult;
  pkg: Package;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  budget: string;
  hotelType: 'very-affordable' | 'affordable' | 'premium';
  source: 'live' | 'mock' | null;
}

export function LiveHotelQuotes({
  hotels,
  pkg,
  nights,
  adults,
  children,
  childrenAges,
  rooms,
  budget,
  hotelType,
  source,
}: LiveHotelQuotesProps) {
  // Map hotelType to Hotelbeds categories
  const categoryMap: Record<string, keyof LiveHotelsResult> = {
    'very-affordable': 'budget',
    'affordable': 'affordable',
    'premium': 'premium',
  };
  
  const selectedCategory = categoryMap[hotelType];
  const filteredHotels = hotels[selectedCategory] || [];

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'very-affordable': return 'Budget Option';
      case 'affordable': return 'Affordable';
      case 'premium': return 'Premium';
      default: return type;
    }
  };

  if (filteredHotels.length === 0) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
        <CardContent className="py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hotels Available</h3>
          <p className="text-muted-foreground text-sm">
            No {getCategoryLabel(hotelType)} hotels found for this destination and dates.
            Try selecting a different accommodation type.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Source indicator */}
      {source === 'mock' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
          <p className="text-sm text-amber-700">
            Showing sample hotel options. Live availability will be confirmed upon booking request.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Please note that the images shown are for illustration purposes only. The price includes 
          hotel accommodation and all activities associated with the package. Select your preferred 
          option and contact us via email or WhatsApp for an accurate quote with confirmed availability.
        </p>
        <p className="text-sm text-primary font-medium">
          Select any package below to send to us for booking confirmation.
        </p>
      </div>

      {/* Package Header */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="text-lg font-display font-bold text-primary uppercase">
          {pkg.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredHotels.length} {getCategoryLabel(hotelType)} hotel{filteredHotels.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Hotel Cards */}
      <div className="space-y-4">
        {filteredHotels.map((hotel) => (
          <LiveHotelQuoteCard
            key={hotel.code}
            hotel={hotel}
            pkg={pkg}
            nights={nights}
            adults={adults}
            children={children}
            childrenAges={childrenAges}
            rooms={rooms}
            budget={budget}
          />
        ))}
      </div>
    </div>
  );
}

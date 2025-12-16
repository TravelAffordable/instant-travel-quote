import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, DollarSign } from 'lucide-react';
import { LiveHotelQuoteCard } from './LiveHotelQuoteCard';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';

interface LiveHotelQuotesProps {
  hotels: LiveHotel[];
  pkg: Package;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  budget: string;
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
}: LiveHotelQuotesProps) {
  const [maxBudget, setMaxBudget] = useState<string>('');

  // Parse the optional budget filter
  const budgetNumber = maxBudget ? parseInt(maxBudget.replace(/[^\d]/g, '')) : null;

  // Filter hotels by budget if set
  const filteredHotels = budgetNumber 
    ? hotels.filter(hotel => hotel.minRate <= budgetNumber)
    : hotels;

  if (hotels.length === 0) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
        <CardContent className="py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hotels Available</h3>
          <p className="text-muted-foreground text-sm">
            No hotels found for this destination and dates. Please try different dates or contact us directly for assistance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Budget Filter */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <Label className="flex items-center gap-2 text-sm font-medium mb-2">
          <DollarSign className="w-4 h-4 text-primary" />
          What would you like to spend for your getaway? (Optional)
        </Label>
        <Input
          type="text"
          placeholder="e.g. R5000 - Enter max amount to filter hotels"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          className="h-10 bg-background"
        />
        {budgetNumber && filteredHotels.length !== hotels.length && (
          <p className="text-xs text-muted-foreground mt-2">
            Showing {filteredHotels.length} of {hotels.length} hotels within your budget
          </p>
        )}
      </div>

      {/* Package Header */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="text-lg font-display font-bold text-primary uppercase">
          {pkg.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Hotel Cards */}
      {filteredHotels.length === 0 ? (
        <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">
              No hotels match your budget. Try increasing your budget amount or remove the filter to see all options.
            </p>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}

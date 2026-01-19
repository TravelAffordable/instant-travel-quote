import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, DollarSign } from 'lucide-react';
import { LiveHotelQuoteCard } from './LiveHotelQuoteCard';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';
import { getActivitiesForDestination, findActivityByName } from '@/data/activitiesData';

interface LiveHotelQuotesProps {
  hotels: LiveHotel[];
  packages: Package[];
  nights: number;
  adults: number;
  children: number;
  childrenAgesString: string;
  rooms: number;
  budget: string;
  guestName?: string;
  guestTel?: string;
  guestEmail?: string;
}

export function LiveHotelQuotes({
  hotels,
  packages: selectedPackages,
  nights,
  adults,
  children,
  childrenAgesString,
  rooms,
  budget,
  guestName = '',
  guestTel = '',
  guestEmail = '',
}: LiveHotelQuotesProps) {
  const [maxBudget, setMaxBudget] = useState<string>('');
  
  // Shared activity selection state for all cards (keyed by package ID)
  const [sharedActivitySelections, setSharedActivitySelections] = useState<Record<string, string[]>>({});

  // Memoize parsed children ages to prevent re-renders
  const childrenAges = useMemo(() => {
    return childrenAgesString
      .split(',')
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a) && a >= 3 && a <= 17);
  }, [childrenAgesString]);

  // Filter activity name helper
  const filterActivityName = (activity: string): boolean => {
    const lower = activity.toLowerCase();
    return !lower.includes('accommodation') && 
           !lower.includes('breakfast at selected') &&
           !lower.includes('buffet breakfast at selected') &&
           !lower.includes('room only') &&
           !lower.includes('shuttle service');
  };

  // Initialize shared activity selections for Durban packages
  useEffect(() => {
    const newSelections: Record<string, string[]> = {};
    
    selectedPackages.forEach(pkg => {
      if (pkg.destination === 'durban') {
        const availableActivities = getActivitiesForDestination(pkg.destination);
        const initialActivities = pkg.activitiesIncluded
          .filter(filterActivityName)
          .filter(activityName => findActivityByName(activityName, availableActivities) !== undefined);
        newSelections[pkg.id] = initialActivities;
      }
    });
    
    setSharedActivitySelections(prev => ({ ...prev, ...newSelections }));
  }, [selectedPackages]);

  // Handle activity toggle for a package (shared across all cards)
  const handleActivityToggle = useCallback((packageId: string, activityName: string) => {
    setSharedActivitySelections(prev => {
      const current = prev[packageId] || [];
      const updated = current.includes(activityName)
        ? current.filter(a => a !== activityName)
        : [...current, activityName];
      return { ...prev, [packageId]: updated };
    });
  }, []);

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

      {/* Package Sections - One for each selected package */}
      {selectedPackages.map((pkg) => (
        <div key={pkg.id} className="space-y-4">
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
                  key={`${pkg.id}-${hotel.code}`}
                  hotel={hotel}
                  pkg={pkg}
                  nights={nights}
                  adults={adults}
                  children={children}
                  childrenAges={childrenAges}
                  rooms={rooms}
                  budget={budget}
                  guestName={guestName}
                  guestTel={guestTel}
                  guestEmail={guestEmail}
                  sharedSelectedActivities={sharedActivitySelections[pkg.id] || []}
                  onActivityToggle={(activityName) => handleActivityToggle(pkg.id, activityName)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

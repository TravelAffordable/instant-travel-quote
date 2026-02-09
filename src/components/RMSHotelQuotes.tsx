import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Star, Coffee, MapPin, Phone, Mail, BedDouble, Bus } from 'lucide-react';
import { type RMSHotel } from '@/hooks/useRMSHotels';
import { type Package } from '@/data/travelData';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getActivitiesForDestination, findActivityByName, type Activity } from '@/data/activitiesData';
import { calculateChildServiceFees as calculateChildServiceFeesUtil } from '@/lib/childServiceFees';

interface RMSHotelQuotesProps {
  hotels: RMSHotel[];
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
  busQuoteAmount?: number;
}

// Tier configuration
const TIER_DESCRIPTION = 'Please use the price comparison options below to select an option that suits your budget. The prices you see includes hotel accommodation and the activities associated with the package. Please select the package that you like and that fits your budget, email or WhatsApp it to us using the buttons below so we can send you an accurate quote with available hotel options that suit your budget and preferences.';

const TIER_CONFIG = {
  budget: {
    name: 'CHEAPEST OPTIONS',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    activeColor: 'bg-green-600',
    description: TIER_DESCRIPTION,
  },
  affordable: {
    name: 'AFFORDABLE OPTIONS',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    activeColor: 'bg-blue-600',
    description: TIER_DESCRIPTION,
  },
  premium: {
    name: 'PREMIUM OPTIONS',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    activeColor: 'bg-purple-600',
    description: TIER_DESCRIPTION,
  },
};

// Service fee calculation
function calculateServiceFees(adults: number, children: number, childrenAges: number[]): number {
  let adultFee = 0;
  if (adults === 1) adultFee = 1000;
  else if (adults <= 3) adultFee = 850;
  else if (adults <= 9) adultFee = 800;
  else adultFee = 750;

  const totalAdultFees = adultFee * adults;
  const childFees = calculateChildServiceFeesUtil(adults, childrenAges);

  return totalAdultFees + childFees;
}

type TierKey = 'budget' | 'affordable' | 'premium';

export function RMSHotelQuotes({
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
  busQuoteAmount = 0,
}: RMSHotelQuotesProps) {
  // Active tier tab - default to 'budget' (cheapest)
  const [activeTier, setActiveTier] = useState<TierKey>('budget');

  // Shared activity selection state
  const [sharedActivitySelections, setSharedActivitySelections] = useState<Record<string, string[]>>({});

  const childrenAges = useMemo(() => {
    return childrenAgesString
      .split(',')
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a) && a >= 3 && a <= 17);
  }, [childrenAgesString]);

  // Initialize activity selections for each package
  useEffect(() => {
    const newSelections: Record<string, string[]> = {};
    selectedPackages.forEach(pkg => {
      const availableActivities = getActivitiesForDestination(pkg.destination);
      const initialActivities = pkg.activitiesIncluded
        .filter(a => !a.toLowerCase().includes('accommodation') && !a.toLowerCase().includes('breakfast at selected'))
        .map(label => findActivityByName(label, availableActivities)?.name)
        .filter((v): v is string => Boolean(v));
      newSelections[pkg.id] = Array.from(new Set(initialActivities));
    });
    setSharedActivitySelections(prev => ({ ...prev, ...newSelections }));
  }, [selectedPackages]);

  const handleActivityToggle = useCallback((packageId: string, activityName: string) => {
    setSharedActivitySelections(prev => {
      const current = prev[packageId] || [];
      const updated = current.includes(activityName)
        ? current.filter(a => a !== activityName)
        : [...current, activityName];
      return { ...prev, [packageId]: updated };
    });
  }, []);

  // Group hotels by tier
  const hotelsByTier = useMemo(() => {
    const grouped: Record<TierKey, RMSHotel[]> = {
      budget: [],
      affordable: [],
      premium: [],
    };
    hotels.forEach(hotel => {
      if (grouped[hotel.tier]) {
        grouped[hotel.tier].push(hotel);
      }
    });
    return grouped;
  }, [hotels]);

  // Auto-select the first tier that has hotels
  useEffect(() => {
    if (hotelsByTier.budget.length > 0) {
      setActiveTier('budget');
    } else if (hotelsByTier.affordable.length > 0) {
      setActiveTier('affordable');
    } else if (hotelsByTier.premium.length > 0) {
      setActiveTier('premium');
    }
  }, [hotelsByTier]);

  if (hotels.length === 0) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-to-br from-muted/50 to-background">
        <CardContent className="py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Hotels Available</h3>
          <p className="text-muted-foreground text-sm">
            No hotels found for this destination and dates. Please try different dates or contact us directly.
          </p>
        </CardContent>
      </Card>
    );
  }

  const availableTiers = (['budget', 'affordable', 'premium'] as const).filter(
    tier => hotelsByTier[tier].length > 0
  );

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          Please note that prices shown are based on our contracted rates. Select your preferred 
          option and contact us via email or WhatsApp for booking confirmation.
        </p>
        <p className="text-sm text-primary font-medium">
          Select any package below to send to us for booking confirmation.
        </p>
      </div>

      {/* Tier Selection Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {availableTiers.map(tier => {
          const config = TIER_CONFIG[tier];
          const isActive = activeTier === tier;
          return (
            <Button
              key={tier}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setActiveTier(tier)}
              className={`gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                isActive 
                  ? `${config.activeColor} text-white hover:opacity-90 shadow-lg` 
                  : `${config.borderColor} ${config.textColor} hover:${config.bgColor}`
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : config.color}`} />
              {config.name}
              <span className="text-xs font-normal opacity-80">
                ({hotelsByTier[tier].length})
              </span>
            </Button>
          );
        })}
      </div>

      {/* Active Tier Description */}
      {activeTier && (
        <div className={`${TIER_CONFIG[activeTier].bgColor} border-2 ${TIER_CONFIG[activeTier].borderColor} rounded-lg p-4`}>
          <p className={`text-xs ${TIER_CONFIG[activeTier].textColor}`}>
            {TIER_CONFIG[activeTier].description}
          </p>
        </div>
      )}

      {/* Package Sections */}
      {selectedPackages.map((pkg) => {
        const availableActivities = getActivitiesForDestination(pkg.destination);
        const selectedActivities = sharedActivitySelections[pkg.id] || [];

        // Calculate activities cost
        let activitiesCost = 0;
        selectedActivities.forEach(actName => {
          const activity = availableActivities.find(a => a.name === actName);
          if (activity) {
            activitiesCost += (activity.rates.adult * adults) + (activity.rates.child * children);
          }
        });

        const serviceFees = calculateServiceFees(adults, children, childrenAges);

        // Get hotels for active tier
        const tierHotels = hotelsByTier[activeTier];

        return (
          <div key={pkg.id} className="space-y-6">
            {/* Package Header */}
            <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4">
              <h3 className="text-xl font-display font-bold text-primary uppercase text-center">
                {pkg.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                {tierHotels.length} hotel{tierHotels.length !== 1 ? 's' : ''} available in {TIER_CONFIG[activeTier].name.toLowerCase()}
              </p>
            </div>

            {/* Activity Selection */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-3">Select Activities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableActivities
                  .filter(a => !a.name.toLowerCase().includes('accommodation'))
                  .map(activity => (
                    <div key={activity.name} className="flex items-center gap-2">
                      <Checkbox
                        id={`${pkg.id}-${activity.name}`}
                        checked={selectedActivities.includes(activity.name)}
                        onCheckedChange={() => handleActivityToggle(pkg.id, activity.name)}
                      />
                      <label 
                        htmlFor={`${pkg.id}-${activity.name}`} 
                        className="text-sm cursor-pointer flex-1"
                      >
                        {activity.name} 
                        <span className="text-muted-foreground ml-1">
                          ({formatCurrency(activity.rates.adult)}/adult)
                        </span>
                      </label>
                    </div>
                  ))}
              </div>
            </div>

            {/* Hotel Cards for Active Tier */}
            <div className="space-y-4">
              {tierHotels.map(hotel => {
                const accommodationCost = hotel.totalRate * rooms;
                let grandTotal = roundToNearest10(accommodationCost + activitiesCost + serviceFees);
                
                // Add bus quote if present
                if (busQuoteAmount > 0) {
                  grandTotal = roundToNearest10(grandTotal + busQuoteAmount);
                }
                
                const perPerson = roundToNearest10(grandTotal / (adults + children));

                const busInfo = busQuoteAmount > 0 ? `\n🚌 Bus Transport: ${formatCurrency(busQuoteAmount)}` : '';
                const whatsappMessage = `Hi! I'd like to book:\n\n🏨 ${hotel.name}\n📦 ${pkg.name}\n📅 ${nights} nights\n👥 ${adults} adults${children > 0 ? `, ${children} children` : ''}\n🛏️ ${rooms} room(s) - ${hotel.roomTypeName}${busInfo}\n💰 Total: ${formatCurrency(grandTotal)}\n\nGuest: ${guestName || 'Not provided'}\nTel: ${guestTel || 'Not provided'}\nEmail: ${guestEmail || 'Not provided'}`;

                const emailSubject = `Booking Request: ${hotel.name} - ${pkg.name}`;
                const emailBody = `Dear Travel Affordable,\n\nI would like to request a booking:\n\nHotel: ${hotel.name}\nPackage: ${pkg.name}\nNights: ${nights}\nGuests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\nRooms: ${rooms} x ${hotel.roomTypeName}${busQuoteAmount > 0 ? `\nBus Transport: ${formatCurrency(busQuoteAmount)}` : ''}\nTotal: ${formatCurrency(grandTotal)}\n\nGuest Details:\nName: ${guestName || 'Not provided'}\nTel: ${guestTel || 'Not provided'}\nEmail: ${guestEmail || 'Not provided'}\n\nPlease confirm availability.\n\nThank you!`;

                return (
                  <Card key={hotel.code} className="border shadow-sm overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Hotel Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-bold text-lg uppercase text-primary">
                                {hotel.name}
                              </h5>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3" />
                                {hotel.areaName}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {hotel.starRating && (
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                )}
                                {hotel.includesBreakfast && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                    <Coffee className="w-3 h-3 mr-1" />
                                    Breakfast Included
                                  </Badge>
                                )}
                                {busQuoteAmount > 0 && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                    <Bus className="w-3 h-3 mr-1" />
                                    Bus Included
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                <BedDouble className="w-4 h-4" />
                                {hotel.roomTypeName} ({hotel.capacity === '2_sleeper' ? '2 Sleeper' : '4 Sleeper'})
                              </div>
                            </div>

                            {/* Pricing */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {formatCurrency(perPerson)}
                              </div>
                              <div className="text-xs text-muted-foreground">per person</div>
                              <div className="text-sm font-semibold text-primary mt-1">
                                {formatCurrency(grandTotal)} total
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <a 
                                href={`mailto:info@travelaffordable.co.za?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Request to Book
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <a
                                href={`https://wa.me/27796813869?text=${encodeURIComponent(whatsappMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                WhatsApp Us
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

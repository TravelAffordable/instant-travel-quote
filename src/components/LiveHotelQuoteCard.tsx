import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Mail, MessageSquare, Star, MapPin, Building2 } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';

interface LiveHotelQuoteCardProps {
  hotel: LiveHotel;
  pkg: Package;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  budget: string;
}

export function LiveHotelQuoteCard({
  hotel,
  pkg,
  nights,
  adults,
  children,
  childrenAges,
  rooms,
  budget,
}: LiveHotelQuoteCardProps) {
  // Calculate costs
  // IMPORTANT: In the UI we treat hotel.minRate as the total stay price for ONE room (same as accommodation-only).
  const perRoomAccommodation = hotel.minRate || 0;
  const accommodationCost = perRoomAccommodation * Math.max(1, rooms);

  const packageCostPerAdult = pkg.basePrice;
  const packageTotal = packageCostPerAdult * adults;

  // Distribute adults across rooms to correctly compute accommodation cost per person.
  // Example: 4 adults + 2 rooms => [2, 2]; 3 adults + 2 rooms => [2, 1]
  const getRoomAdultOccupancies = (adultCount: number, roomCount: number) => {
    const safeAdults = Math.max(0, Math.floor(adultCount));
    const safeRooms = Math.max(1, Math.floor(roomCount));

    const usedRooms = Math.min(safeRooms, Math.max(1, safeAdults));
    const base = Math.floor(safeAdults / usedRooms);
    const remainder = safeAdults % usedRooms;

    // First `remainder` rooms get `base + 1` adults, rest get `base`.
    return Array.from({ length: usedRooms }, (_, i) => base + (i < remainder ? 1 : 0)).filter(
      (n) => n > 0
    );
  };

  const roomAdultOccupancies = getRoomAdultOccupancies(adults, rooms);

  // Accommodation per adult = sum(roomCost / adultsInThatRoom)
  // - Double room (2 adults): divide that room's cost by 2
  // - Single occupancy (1 adult): room cost stays as-is
  // - 4-sleeper (4 adults in 1 room): divide by 4
  const accommodationPerAdult = roomAdultOccupancies.reduce(
    (sum, adultsInRoom) => sum + perRoomAccommodation / adultsInRoom,
    0
  );

  // Kids package cost
  let kidsPackageCost = 0;
  if (children > 0 && pkg.kidsPrice) {
    kidsPackageCost = pkg.kidsPrice * children;
  }

  // Service fees
  const getServiceFeePerAdult = (adultCount: number) => {
    if (adultCount >= 10) return 750;
    if (adultCount >= 4) return 800;
    if (adultCount >= 2) return 850;
    return 1000;
  };
  const serviceFeePerAdult = getServiceFeePerAdult(adults);
  const totalServiceFees = serviceFeePerAdult * adults;

  // Kids fees
  let kidsFees = 0;
  childrenAges.forEach((age) => {
    if (age >= 3 && age <= 12) kidsFees += 200;
    else if (age >= 13 && age <= 17) kidsFees += 300;
  });

  const totalCost = accommodationCost + packageTotal + kidsPackageCost + totalServiceFees + kidsFees;
  const pricePerPerson =
    children > 0
      ? totalCost
      : accommodationPerAdult + packageCostPerAdult + serviceFeePerAdult;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStarsLabel = (stars: number) => {
    if (stars >= 4.5) return 'Premium';
    if (stars >= 3.5) return 'Comfortable';
    return 'Budget Friendly';
  };

  const getStarsColor = (stars: number) => {
    if (stars >= 4.5) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (stars >= 3.5) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    return 'bg-green-500/10 text-green-600 border-green-500/20';
  };

  const handleWhatsApp = () => {
    const text = `Hi! I'm interested in booking:\n\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `📦 Package: ${pkg.name}\n` +
      `📅 Duration: ${nights} nights\n` +
      `🛏️ Rooms: ${rooms} room${rooms > 1 ? 's' : ''}\n` +
      `👥 Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `💰 Total: ${formatCurrency(totalCost)}\n` +
      `💵 My Budget: ${budget}\n\n` +
      `Please send me more details and availability.`;
    
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const subject = `Booking Enquiry: ${hotel.name} - ${pkg.shortName}`;
    const body = `Hi Travel Affordable,\n\n` +
      `I would like to enquire about the following booking:\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Package: ${pkg.name}\n` +
      `Duration: ${nights} nights\n` +
      `Rooms: ${rooms} room${rooms > 1 ? 's' : ''}\n` +
      `Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `Total Price: ${formatCurrency(totalCost)}\n` +
      `My Budget: ${budget}\n\n` +
      `Package Inclusions:\n${pkg.activitiesIncluded.map(a => `- ${a}`).join('\n')}\n\n` +
      `Please confirm availability and send me booking details.\n\n` +
      `Thank you`;
    
    window.open(`mailto:info@travelaffordable.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <Card className="overflow-hidden border shadow-soft hover:shadow-lg transition-all duration-300">
      <div className="grid md:grid-cols-[280px,1fr] gap-0">
        {/* Hotel Image */}
        <div className="relative h-48 md:h-full min-h-[200px]">
          <img
            src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getStarsColor(hotel.stars)} border`}>
              {getStarsLabel(hotel.stars)}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm font-medium">{hotel.stars}</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          {/* Hotel Name & Address */}
          <div className="mb-3">
            <h3 className="text-xl font-display font-bold text-foreground mb-1">
              {hotel.name}
            </h3>
            {hotel.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {hotel.address}
              </p>
            )}
          </div>

          {/* Package Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-primary mb-2">{pkg.shortName}</p>
            <div className="grid grid-cols-2 gap-2">
              {pkg.activitiesIncluded.slice(0, 4).map((activity, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{activity}</span>
                </div>
              ))}
            </div>
            {pkg.activitiesIncluded.length > 4 && (
              <p className="text-xs text-primary mt-2">+{pkg.activitiesIncluded.length - 4} more inclusions</p>
            )}
          </div>

          {/* Package Description */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-foreground leading-relaxed">
              The discounted price below includes {nights} night{nights > 1 ? 's' : ''} accommodation, {pkg.activitiesIncluded.join(', ')}. Our getaways are stylish and trendy with a bit of affordable sophistication.
            </p>
          </div>

          {/* Per-Room Breakdown (when multiple rooms) */}
          {rooms > 1 && (
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-foreground mb-2">Room Breakdown</p>
              <div className="space-y-1">
                {Array.from({ length: rooms }, (_, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Room {i + 1} Total:</span>
                    <span className="font-medium text-foreground">{formatCurrency(perRoomAccommodation)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Price */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Package Price</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</p>
              {children === 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(pricePerPerson)} per person
                </p>
              )}
            </div>
          <div className="text-right text-sm">
            <p className="font-medium text-foreground">{nights} nights • {rooms} room{rooms > 1 ? 's' : ''}</p>
            <p className="text-muted-foreground">{adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` • ${children} child${children > 1 ? 'ren' : ''}` : ''}</p>
          </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleEmail} variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Request to Book
            </Button>
            <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

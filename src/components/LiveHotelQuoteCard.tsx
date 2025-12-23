import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Mail, MessageSquare, Star, MapPin, Building2, Users, ChevronDown } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

// Room capacity mapping based on common Hotelbeds room type codes
const getRoomCapacity = (roomCode: string, roomName: string): number => {
  const code = roomCode.toUpperCase();
  const name = roomName.toUpperCase();
  
  // Family rooms typically sleep 4-6
  if (code.includes('FAM') || name.includes('FAMILY')) return 4;
  
  // Suites often sleep 3-4
  if (code.includes('SUI') || name.includes('SUITE')) return 3;
  
  // Triple rooms
  if (code.includes('TRP') || code.includes('TPL') || name.includes('TRIPLE')) return 3;
  
  // Quad rooms
  if (code.includes('QUA') || code.includes('QAD') || name.includes('QUAD')) return 4;
  
  // Single rooms
  if (code.includes('SGL') || code.includes('SIN') || name.includes('SINGLE')) return 1;
  
  // Penthouses and luxury apartments
  if (name.includes('PENTHOUSE') || name.includes('APARTMENT')) return 5;
  if (name.includes('THREE BEDROOM') || name.includes('3 BEDROOM')) return 6;
  if (name.includes('TWO BEDROOM') || name.includes('2 BEDROOM')) return 4;
  
  // Default to double occupancy for standard rooms
  return 2;
};

interface RoomRate {
  rateKey: string;
  net: number;
  boardCode: string;
  boardName: string;
}

interface RoomOption {
  code: string;
  name: string;
  capacity: number;
  lowestRate: number;
  rates: RoomRate[];
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
  // Process available room options with capacity and pricing
  const roomOptions: RoomOption[] = useMemo(() => {
    if (!hotel.rooms || hotel.rooms.length === 0) return [];
    
    return hotel.rooms.map(room => {
      const capacity = getRoomCapacity(room.code, room.name);
      const rates = room.rates || [];
      const lowestRate = rates.length > 0 
        ? Math.min(...rates.map(r => r.net))
        : hotel.minRate;
      
      return {
        code: room.code,
        name: room.name,
        capacity,
        lowestRate,
        rates,
      };
    }).sort((a, b) => a.lowestRate - b.lowestRate);
  }, [hotel.rooms, hotel.minRate]);

  // State for selected room types (one selection per room)
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(() => {
    // Default to cheapest room for all rooms
    const defaultRoom = roomOptions.length > 0 ? roomOptions[0].code : '';
    return Array(rooms).fill(defaultRoom);
  });

  // Get the rate for a specific room code
  const getRoomRate = (roomCode: string): number => {
    const roomOption = roomOptions.find(r => r.code === roomCode);
    return roomOption?.lowestRate || hotel.minRate;
  };

  // Calculate total accommodation based on selected rooms
  const accommodationCost = useMemo(() => {
    if (roomOptions.length === 0) {
      // Fallback if no room options available
      return (hotel.minRate || 0) * Math.max(1, rooms);
    }
    
    return selectedRoomTypes.reduce((total, roomCode) => {
      return total + getRoomRate(roomCode);
    }, 0);
  }, [selectedRoomTypes, roomOptions, hotel.minRate, rooms]);

  const packageCostPerAdult = pkg.basePrice;
  const packageTotal = packageCostPerAdult * adults;

  // Distribute adults across rooms to correctly compute accommodation cost per person.
  const getRoomAdultOccupancies = (adultCount: number, roomCount: number) => {
    const safeAdults = Math.max(0, Math.floor(adultCount));
    const safeRooms = Math.max(1, Math.floor(roomCount));

    const usedRooms = Math.min(safeRooms, Math.max(1, safeAdults));
    const base = Math.floor(safeAdults / usedRooms);
    const remainder = safeAdults % usedRooms;

    return Array.from({ length: usedRooms }, (_, i) => base + (i < remainder ? 1 : 0)).filter(
      (n) => n > 0
    );
  };

  const roomAdultOccupancies = getRoomAdultOccupancies(adults, rooms);

  // Accommodation per adult based on selected room rates
  const accommodationPerAdult = useMemo(() => {
    if (roomOptions.length === 0 || roomAdultOccupancies.length === 0) {
      const perRoom = hotel.minRate || 0;
      return roomAdultOccupancies.reduce(
        (sum, adultsInRoom) => sum + perRoom / adultsInRoom,
        0
      );
    }
    
    return roomAdultOccupancies.reduce((sum, adultsInRoom, idx) => {
      const roomCode = selectedRoomTypes[idx] || selectedRoomTypes[0] || '';
      const roomRate = getRoomRate(roomCode);
      return sum + roomRate / adultsInRoom;
    }, 0);
  }, [roomAdultOccupancies, selectedRoomTypes, roomOptions, hotel.minRate]);

  // Kids package cost
  let kidsPackageCost = 0;
  if (children > 0 && pkg.kidsPrice) {
    kidsPackageCost = pkg.kidsPrice * children;
  }

  // Service fees: R550 per adult, R100 for kids 3-12, R200 for kids 13-17 (groups of 25+)
  const calculateServiceFees = () => {
    const totalPeople = adults + childrenAges.length;
    
    if (totalPeople < 25) {
      return { adultFees: 0, kidsFees: 0, totalFees: 0 };
    }

    const adultFees = adults * 550;
    
    let kidsFees = 0;
    childrenAges.forEach((age) => {
      if (age >= 3 && age <= 12) kidsFees += 100;
      else if (age >= 13 && age <= 17) kidsFees += 200;
    });

    return {
      adultFees,
      kidsFees,
      totalFees: adultFees + kidsFees,
    };
  };
  
  const serviceFees = calculateServiceFees();
  const totalServiceFees = serviceFees.totalFees;
  const serviceFeePerAdult = (adults + children) >= 25 ? 550 : 0;

  const totalCost = accommodationCost + packageTotal + kidsPackageCost + totalServiceFees;
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

  const handleRoomTypeChange = (roomIndex: number, roomCode: string) => {
    setSelectedRoomTypes(prev => {
      const updated = [...prev];
      updated[roomIndex] = roomCode;
      return updated;
    });
  };

  const getSelectedRoomNames = () => {
    return selectedRoomTypes.map(code => {
      const room = roomOptions.find(r => r.code === code);
      return room ? `${room.name} (${room.code})` : 'Standard Room';
    });
  };

  const handleWhatsApp = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `\n🛏️ Room Types:\n${getSelectedRoomNames().map((name, i) => `   Room ${i + 1}: ${name}`).join('\n')}`
      : `\n🛏️ Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const text = `Hi! I'm interested in booking:\n\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `📦 Package: ${pkg.name}\n` +
      `📅 Duration: ${nights} nights${roomDetails}\n` +
      `👥 Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `💰 Total: ${formatCurrency(totalCost)}\n` +
      `💵 My Budget: ${budget}\n\n` +
      `Please send me more details and availability.`;
    
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `Room Types:\n${getSelectedRoomNames().map((name, i) => `- Room ${i + 1}: ${name}`).join('\n')}`
      : `Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const subject = `Booking Enquiry: ${hotel.name} - ${pkg.shortName}`;
    const body = `Hi Travel Affordable,\n\n` +
      `I would like to enquire about the following booking:\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Package: ${pkg.name}\n` +
      `Duration: ${nights} nights\n` +
      `${roomDetails}\n` +
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

          {/* Room Selection (when multiple rooms OR room options available) */}
          {rooms >= 1 && roomOptions.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                {rooms > 1 ? 'Select Room Types' : 'Select Room Type'}
              </p>
              <div className="space-y-3">
                {Array.from({ length: rooms }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Room {i + 1}
                    </label>
                    <Select
                      value={selectedRoomTypes[i] || roomOptions[0]?.code}
                      onValueChange={(value) => handleRoomTypeChange(i, value)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((room) => (
                          <SelectItem key={room.code} value={room.code}>
                            <div className="flex items-center gap-2 w-full">
                              <span className="flex-1">
                                {room.name} ({room.code})
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {room.capacity}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Show selected room capacity only */}
                    {selectedRoomTypes[i] && (
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Sleeps {roomOptions.find(r => r.code === selectedRoomTypes[i])?.capacity || 2}
                        </span>
                      </div>
                    )}
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

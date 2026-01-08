import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Mail, MessageSquare, ChevronDown, Check } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccommodationOnlyCardProps {
  hotel: LiveHotel;
  rooms: number;
  adults: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  guestName?: string;
  guestTel?: string;
  guestEmail?: string;
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

export function AccommodationOnlyCard({ 
  hotel, 
  rooms, 
  adults,
  nights,
  checkIn,
  checkOut,
  guestName = '',
  guestTel = '',
  guestEmail = '',
}: AccommodationOnlyCardProps) {
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
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  
  // Initialize selected room types when roomOptions or rooms change
  useEffect(() => {
    if (roomOptions.length > 0) {
      const defaultRoom = roomOptions[0].code;
      setSelectedRoomTypes(Array(rooms).fill(defaultRoom));
    }
  }, [roomOptions.length, rooms]);

  // Get the rate for a specific room code
  const getRoomRate = (roomCode: string): number => {
    const roomOption = roomOptions.find(r => r.code === roomCode);
    return roomOption?.lowestRate || hotel.minRate;
  };

  // Get the rateKey for a specific room code
  const getRoomRateKey = (roomCode: string): string => {
    const roomOption = roomOptions.find(r => r.code === roomCode);
    if (roomOption && roomOption.rates.length > 0) {
      const lowestRateEntry = roomOption.rates.reduce((lowest, current) => 
        current.net < lowest.net ? current : lowest
      , roomOption.rates[0]);
      return lowestRateEntry.rateKey;
    }
    return '';
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

  // Calculate per person cost
  const pricePerPerson = adults > 0 ? accommodationCost / adults : accommodationCost;

  // Calculate total capacity
  const totalCapacity = useMemo(() => {
    if (roomOptions.length === 0) return rooms * 2;
    
    return selectedRoomTypes.reduce((total, roomCode) => {
      const roomOption = roomOptions.find(r => r.code === roomCode);
      return total + (roomOption?.capacity || 2);
    }, 0);
  }, [selectedRoomTypes, roomOptions, rooms]);

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

  const getSelectedRateKeys = () => {
    return selectedRoomTypes.map(code => getRoomRateKey(code)).filter(key => key);
  };

  // Get board/meal info for selected rooms
  const getMealInfo = () => {
    const boardNames: string[] = [];
    selectedRoomTypes.forEach(roomCode => {
      const roomOption = roomOptions.find(r => r.code === roomCode);
      if (roomOption && roomOption.rates.length > 0) {
        const lowestRateEntry = roomOption.rates.reduce((lowest, current) => 
          current.net < lowest.net ? current : lowest
        , roomOption.rates[0]);
        if (lowestRateEntry.boardName && !boardNames.includes(lowestRateEntry.boardName)) {
          boardNames.push(lowestRateEntry.boardName);
        }
      }
    });
    return boardNames.join(', ') || 'Room Only';
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

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleWhatsApp = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `\n🛏️ Room Types:\n${getSelectedRoomNames().map((name, i) => `   Room ${i + 1}: ${name}`).join('\n')}`
      : `\n🛏️ Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const rateKeys = getSelectedRateKeys();
    const rateKeyInfo = rateKeys.length > 0 ? `\n📋 Rate Reference: ${rateKeys[0].substring(0, 30)}...` : '';

    const text = `Greetings ${guestName || '(Guest)'}\n\n` +
      `Your accommodation quote is ready!\n\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `📍 Address: ${hotel.address || 'See hotel details'}\n` +
      `⭐ Rating: ${hotel.stars} Star\n` +
      `📅 Check-in: ${formatDateForDisplay(checkIn)}\n` +
      `📅 Check-out: ${formatDateForDisplay(checkOut)}\n` +
      `🌙 Duration: ${nights} night${nights > 1 ? 's' : ''}${roomDetails}\n` +
      `👥 Guests: ${adults} adult${adults > 1 ? 's' : ''}\n` +
      `🍽️ Meal Plan: ${getMealInfo()}\n` +
      `💰 Total: ${formatCurrency(accommodationCost)}${rateKeyInfo}\n\n` +
      `To proceed with your booking, please reply to this message. Our agents will guide you through the booking process.\n\n` +
      `Thank you,\nBookings,\nTravel Affordable Pty Ltd`;
    
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `Room Types:\n${getSelectedRoomNames().map((name, i) => `- Room ${i + 1}: ${name}`).join('\n')}`
      : `Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const rateKeys = getSelectedRateKeys();
    const rateKeyInfo = rateKeys.length > 0 ? `\nRate Reference: ${rateKeys[0]}` : '';

    const subject = `Accommodation Booking Request: ${hotel.name}`;
    const body = `Greetings ${guestName || '(Guest)'}\n\n` +
      `Your accommodation quote is ready!\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Address: ${hotel.address || 'See hotel details'}\n` +
      `Rating: ${hotel.stars} Star\n` +
      `Check-in: ${formatDateForDisplay(checkIn)}\n` +
      `Check-out: ${formatDateForDisplay(checkOut)}\n` +
      `Duration: ${nights} night${nights > 1 ? 's' : ''}\n` +
      `${roomDetails}\n` +
      `Guests: ${adults} adult${adults > 1 ? 's' : ''}\n` +
      `Meal Plan: ${getMealInfo()}\n` +
      `Total Price: ${formatCurrency(accommodationCost)}${rateKeyInfo}\n\n` +
      `To proceed with your booking, please send this email. Our agents will guide you through the booking process and send you the invoice to secure your booking.\n\n` +
      `Once payment is received, we will confirm your booking and send you all the important details including hotel confirmation numbers.\n\n` +
      `Thank you,\nBookings,\nTravel Affordable Pty Ltd`;
    
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

          {/* Stay Details */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-primary mb-2">Accommodation Only</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{nights} night{nights > 1 ? 's' : ''} stay</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{getMealInfo()}</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{rooms} room{rooms > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{adults} guest{adults > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Dates Display */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm">
              <div>
                <span className="text-muted-foreground">Check-in: </span>
                <span className="font-medium">{formatDateForDisplay(checkIn)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Check-out: </span>
                <span className="font-medium">{formatDateForDisplay(checkOut)}</span>
              </div>
            </div>
          </div>

          {/* Room Selection */}
          {roomOptions.length > 0 && rooms > 0 && (
            <div className="space-y-3 mb-4">
              <label className="text-sm font-medium text-foreground">
                Select Room Type{rooms > 1 ? 's' : ''}:
              </label>
              <div className="space-y-2">
                {Array.from({ length: rooms }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {rooms > 1 && (
                      <span className="text-xs text-muted-foreground w-16">Room {idx + 1}:</span>
                    )}
                    <Select
                      value={selectedRoomTypes[idx] || roomOptions[0]?.code}
                      onValueChange={(value) => handleRoomTypeChange(idx, value)}
                    >
                      <SelectTrigger className="flex-1 h-9 text-sm">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((room) => (
                          <SelectItem key={room.code} value={room.code}>
                            <span className="flex items-center justify-between w-full">
                              <span className="truncate max-w-[180px]">{room.name}</span>
                              <span className="text-primary font-medium ml-2">
                                {formatCurrency(room.lowestRate)}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Display */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total accommodation</p>
              <p className="text-xs text-muted-foreground">
                {rooms} room{rooms > 1 ? 's' : ''} × {nights} night{nights > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(accommodationCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(pricePerPerson)} per person
              </p>
            </div>
          </div>

          {/* Booking Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleEmail}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Request to Book
            </Button>
            <Button 
              onClick={handleWhatsApp}
              variant="outline"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

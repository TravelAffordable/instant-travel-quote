import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
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

export function AccommodationOnlyCard({ hotel, rooms }: AccommodationOnlyCardProps) {
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
    const defaultRoom = roomOptions.length > 0 ? roomOptions[0].code : '';
    return Array(rooms).fill(defaultRoom);
  });

  // Get the rate for a specific room code
  const getRoomRate = (roomCode: string): number => {
    const roomOption = roomOptions.find(r => r.code === roomCode);
    return roomOption?.lowestRate || hotel.minRate;
  };

  // Get room details by code
  const getRoomDetails = (roomCode: string): RoomOption | undefined => {
    return roomOptions.find(r => r.code === roomCode);
  };

  // Calculate total accommodation based on selected rooms
  const totalCost = useMemo(() => {
    if (roomOptions.length === 0) {
      return (hotel.minRate || 0) * Math.max(1, rooms);
    }
    
    return selectedRoomTypes.reduce((total, roomCode) => {
      return total + getRoomRate(roomCode);
    }, 0);
  }, [selectedRoomTypes, roomOptions, hotel.minRate, rooms]);

  // Handle room type change
  const handleRoomTypeChange = (roomIndex: number, roomCode: string) => {
    setSelectedRoomTypes(prev => {
      const newSelections = [...prev];
      newSelections[roomIndex] = roomCode;
      return newSelections;
    });
  };

  return (
    <Card className="border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {hotel.image && (
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-32 h-24 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{hotel.name}</h4>
            <p className="text-sm text-muted-foreground">{hotel.address}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {Array.from({ length: hotel.stars || 3 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              {(hotel as any).hasBreakfast && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Breakfast included</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              R{totalCost.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">total stay</p>
          </div>
        </div>

        {/* Room Type Selection */}
        {rooms >= 1 && roomOptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h5 className="text-sm font-semibold mb-3 text-foreground">Select Room Type{rooms > 1 ? 's' : ''}</h5>
            <div className="space-y-3">
              {Array.from({ length: rooms }, (_, roomIndex) => {
                const selectedRoom = getRoomDetails(selectedRoomTypes[roomIndex]);
                return (
                  <div key={roomIndex} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                      Room {roomIndex + 1}:
                    </span>
                    <Select
                      value={selectedRoomTypes[roomIndex] || ''}
                      onValueChange={(value) => handleRoomTypeChange(roomIndex, value)}
                    >
                      <SelectTrigger className="flex-1 h-9 text-sm">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomOptions.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            <div className="flex items-center justify-between w-full gap-2">
                              <span className="truncate">{option.name}</span>
                              <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                <Users className="w-3 h-3" />
                                {option.capacity}
                              </span>
                              <span className="text-primary font-medium">
                                R{option.lowestRate.toLocaleString()}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm font-medium text-primary min-w-[80px] text-right">
                      R{getRoomRate(selectedRoomTypes[roomIndex]).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Room Capacity Info */}
            <div className="mt-3 space-y-1">
              {selectedRoomTypes.map((roomCode, idx) => {
                const room = getRoomDetails(roomCode);
                if (!room) return null;
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Room {idx + 1}: {room.name} (sleeps {room.capacity})</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback for hotels without room options */}
        {rooms > 1 && roomOptions.length === 0 && typeof hotel.minRate === 'number' && (
          <div className="mt-4 pt-4 border-t border-border space-y-1">
            {Array.from({ length: rooms }, (_, i) => (
              <div key={i} className="flex justify-between gap-4 text-xs text-muted-foreground">
                <span>Room {i + 1} total</span>
                <span className="font-medium text-foreground">
                  R{hotel.minRate.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

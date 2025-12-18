import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, Plus, Minus, Check } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { Button } from '@/components/ui/button';

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

interface RoomOption {
  code: string;
  name: string;
  capacity: number;
  lowestRate: number;
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
      };
    }).sort((a, b) => a.lowestRate - b.lowestRate);
  }, [hotel.rooms, hotel.minRate]);

  // State for room type quantities (how many of each room type selected)
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>({});

  // Calculate total rooms selected
  const totalRoomsSelected = useMemo(() => {
    return Object.values(roomQuantities).reduce((sum, qty) => sum + qty, 0);
  }, [roomQuantities]);

  // Calculate total cost based on selected room types
  const totalCost = useMemo(() => {
    if (Object.keys(roomQuantities).length === 0) {
      // Default to cheapest room type for all rooms
      const cheapestRoom = roomOptions[0];
      if (cheapestRoom) {
        return cheapestRoom.lowestRate * rooms;
      }
      return (hotel.minRate || 0) * Math.max(1, rooms);
    }
    
    return Object.entries(roomQuantities).reduce((total, [roomCode, qty]) => {
      const room = roomOptions.find(r => r.code === roomCode);
      return total + (room ? room.lowestRate * qty : 0);
    }, 0);
  }, [roomQuantities, roomOptions, hotel.minRate, rooms]);

  // Calculate total capacity of selected rooms
  const totalCapacity = useMemo(() => {
    return Object.entries(roomQuantities).reduce((total, [roomCode, qty]) => {
      const room = roomOptions.find(r => r.code === roomCode);
      return total + (room ? room.capacity * qty : 0);
    }, 0);
  }, [roomQuantities, roomOptions]);

  // Handle incrementing room quantity
  const incrementRoom = (roomCode: string) => {
    if (totalRoomsSelected >= rooms) return;
    setRoomQuantities(prev => ({
      ...prev,
      [roomCode]: (prev[roomCode] || 0) + 1
    }));
  };

  // Handle decrementing room quantity
  const decrementRoom = (roomCode: string) => {
    setRoomQuantities(prev => {
      const currentQty = prev[roomCode] || 0;
      if (currentQty <= 0) return prev;
      const newQty = currentQty - 1;
      if (newQty === 0) {
        const { [roomCode]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [roomCode]: newQty };
    });
  };

  // Get breakdown of selected rooms for display
  const selectedRoomsBreakdown = useMemo(() => {
    return Object.entries(roomQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([roomCode, qty]) => {
        const room = roomOptions.find(r => r.code === roomCode);
        return room ? { ...room, quantity: qty, subtotal: room.lowestRate * qty } : null;
      })
      .filter(Boolean) as (RoomOption & { quantity: number; subtotal: number })[];
  }, [roomQuantities, roomOptions]);

  const roomsRemaining = rooms - totalRoomsSelected;

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

        {/* Room Type Selection - Inline Style */}
        {roomOptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-foreground">Select Room Types</h5>
              <span className={`text-sm font-medium ${roomsRemaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {roomsRemaining > 0 ? `${roomsRemaining} room${roomsRemaining > 1 ? 's' : ''} remaining` : 
                  <span className="flex items-center gap-1"><Check className="w-4 h-4" /> All {rooms} rooms selected</span>}
              </span>
            </div>
            
            {/* Available Room Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roomOptions.map((option) => {
                const currentQty = roomQuantities[option.code] || 0;
                const isSelected = currentQty > 0;
                
                return (
                  <div 
                    key={option.code}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{option.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          Sleeps {option.capacity}
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          R{option.lowestRate.toLocaleString()}/room
                        </span>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => decrementRoom(option.code)}
                        disabled={currentQty === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{currentQty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => incrementRoom(option.code)}
                        disabled={totalRoomsSelected >= rooms}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Rooms Breakdown */}
            {selectedRoomsBreakdown.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <h6 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Your Selection</h6>
                <div className="space-y-1.5">
                  {selectedRoomsBreakdown.map((room, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {room.quantity}x {room.name} 
                        <span className="text-xs ml-1">(sleeps {room.capacity})</span>
                      </span>
                      <span className="font-medium text-foreground">
                        R{room.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm font-medium">
                      Total Capacity: {totalCapacity} guests
                    </span>
                    <span className="text-lg font-bold text-primary">
                      R{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Capacity Warning */}
            {selectedRoomsBreakdown.length > 0 && totalCapacity < 10 && totalRoomsSelected === rooms && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                ⚠️ Selected rooms sleep {totalCapacity} guests. You may need rooms with higher capacity for 10 adults.
              </div>
            )}
          </div>
        )}

        {/* Fallback for hotels without room options */}
        {roomOptions.length === 0 && typeof hotel.minRate === 'number' && (
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

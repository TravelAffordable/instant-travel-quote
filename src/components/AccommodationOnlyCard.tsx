import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

interface AccommodationOnlyCardProps {
  hotel: LiveHotel;
  rooms: number;
  adults: number;
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

export function AccommodationOnlyCard({ hotel, rooms, adults }: AccommodationOnlyCardProps) {
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

  // Automatically determine the best combination of rooms
  const { selectedRooms, totalCost, totalCapacity } = useMemo(() => {
    if (roomOptions.length === 0) {
      // Fallback to minRate
      return {
        selectedRooms: Array.from({ length: rooms }, (_, i) => ({
          name: 'Standard Room',
          rate: hotel.minRate || 0,
          capacity: 2
        })),
        totalCost: (hotel.minRate || 0) * rooms,
        totalCapacity: rooms * 2
      };
    }

    const avgAdultsPerRoom = Math.ceil(adults / rooms);
    const selectedRooms: { name: string; rate: number; capacity: number }[] = [];
    let remainingAdults = adults;
    let remainingRooms = rooms;

    // Strategy: Fill rooms efficiently - prefer rooms that fit the needed capacity at lowest cost
    while (remainingRooms > 0 && remainingAdults > 0) {
      const adultsForThisRoom = Math.ceil(remainingAdults / remainingRooms);
      
      // Find the cheapest room that can fit the needed adults
      const suitableRoom = roomOptions.find(r => r.capacity >= adultsForThisRoom);
      
      // If no room fits exactly, get the largest capacity room or just the cheapest
      const bestRoom = suitableRoom || 
        roomOptions.reduce((best, curr) => curr.capacity > best.capacity ? curr : best, roomOptions[0]);
      
      selectedRooms.push({
        name: bestRoom.name,
        rate: bestRoom.lowestRate,
        capacity: bestRoom.capacity
      });
      
      remainingAdults -= bestRoom.capacity;
      remainingRooms--;
    }

    // If we still have rooms to fill but no adults left, use cheapest rooms
    while (selectedRooms.length < rooms) {
      const cheapestRoom = roomOptions[0];
      selectedRooms.push({
        name: cheapestRoom.name,
        rate: cheapestRoom.lowestRate,
        capacity: cheapestRoom.capacity
      });
    }

    const totalCost = selectedRooms.reduce((sum, r) => sum + r.rate, 0);
    const totalCapacity = selectedRooms.reduce((sum, r) => sum + r.capacity, 0);

    return { selectedRooms, totalCost, totalCapacity };
  }, [roomOptions, rooms, adults, hotel.minRate]);

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
              {formatCurrency(totalCost)}
            </p>
            <p className="text-xs text-muted-foreground">total stay</p>
          </div>
        </div>

        {/* Room Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {rooms} room{rooms > 1 ? 's' : ''} for {adults} adult{adults > 1 ? 's' : ''} • Total capacity: {totalCapacity} guests
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

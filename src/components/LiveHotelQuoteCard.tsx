import { useState, useMemo, useEffect, memo } from 'react';
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
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { 
  getActivitiesForDestination, 
  findActivityByName,
  calculateTotalActivityCost,
  type Activity 
} from '@/data/activitiesData';

interface LiveHotelQuoteCardProps {
  hotel: LiveHotel;
  pkg: Package;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  budget: string;
  guestName?: string;
  guestTel?: string;
  guestEmail?: string;
  // Shared activity selection for Durban packages (synced across all cards)
  sharedSelectedActivities?: string[];
  onActivityToggle?: (activityName: string) => void;
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

function LiveHotelQuoteCardComponent({
  hotel,
  pkg,
  nights,
  adults,
  children,
  childrenAges,
  rooms,
  budget,
  guestName = '',
  guestTel = '',
  guestEmail = '',
  sharedSelectedActivities = [],
  onActivityToggle,
}: LiveHotelQuoteCardProps) {
  const isDurbanPackage = pkg.destination === 'durban';

  // Get available activities for this destination
  const availableActivities = useMemo(() => {
    return getActivitiesForDestination(pkg.destination);
  }, [pkg.destination]);

  // Filter package activities to exclude accommodation/breakfast items
  const filterActivityName = (activity: string): boolean => {
    const lower = activity.toLowerCase();

    // Always exclude non-activities
    if (lower.includes('accommodation') ||
        lower.includes('breakfast at selected') ||
        lower.includes('buffet breakfast at selected') ||
        lower.includes('room only')) {
      return false;
    }

    // Durban must keep shuttle as an activity (client can deselect it)
    if (isDurbanPackage) return true;

    // Other destinations: keep previous behavior
    return !lower.includes('shuttle service');
  };

  // For Durban packages, use shared selection; otherwise use local state
  const [localSelectedActivities, setLocalSelectedActivities] = useState<string[]>([]);
  
  // Use shared activities for Durban, local for others
  const selectedActivities = isDurbanPackage ? sharedSelectedActivities : localSelectedActivities;
  
  // Initialize local activities for non-Durban packages
  useEffect(() => {
    if (!isDurbanPackage) {
      const initialActivities = pkg.activitiesIncluded
        .filter(filterActivityName)
        .filter(activityName => findActivityByName(activityName, availableActivities) !== undefined);
      setLocalSelectedActivities(initialActivities);
    }
  }, [pkg.id, availableActivities, isDurbanPackage]);

  // Handle activity selection toggle
  const handleActivityToggle = (activityName: string) => {
    if (isDurbanPackage && onActivityToggle) {
      onActivityToggle(activityName);
    } else {
      setLocalSelectedActivities(prev => 
        prev.includes(activityName)
          ? prev.filter(a => a !== activityName)
          : [...prev, activityName]
      );
    }
  };

  // Sort activities: Durban package activities first (fixed order), then others
  const sortedActivities = useMemo(() => {
    if (!isDurbanPackage) return availableActivities;

    const DURBAN_DEFAULT_ACTIVITY_ORDER = [
      'USHAKA MARINE WORLD COMBO TICKET',
      'ISLE OF CAPRI BOAT CRUISE',
      '60 MINUTE FULL BODY MASSAGE',
      'SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK',
    ];

    // Prefer the fixed Durban order; fall back to whatever is in the package if needed
    const preferredNames = DURBAN_DEFAULT_ACTIVITY_ORDER
      .map(label => findActivityByName(label, availableActivities)?.name)
      .filter((v): v is string => Boolean(v));

    const packageActivityNames = (preferredNames.length > 0
      ? preferredNames
      : pkg.activitiesIncluded
          .filter(filterActivityName)
          .map(label => findActivityByName(label, availableActivities)?.name)
          .filter((v): v is string => Boolean(v))
    );

    const packageActivities: typeof availableActivities = [];
    const otherActivities: typeof availableActivities = [];

    availableActivities.forEach(activity => {
      const isPackageActivity = packageActivityNames.some(
        name => name.toLowerCase() === activity.name.toLowerCase()
      );

      if (isPackageActivity) packageActivities.push(activity);
      else otherActivities.push(activity);
    });

    // Keep package activities in the requested order
    packageActivities.sort((a, b) => {
      const aIndex = packageActivityNames.findIndex(n => n.toLowerCase() === a.name.toLowerCase());
      const bIndex = packageActivityNames.findIndex(n => n.toLowerCase() === b.name.toLowerCase());
      return aIndex - bIndex;
    });

    return [...packageActivities, ...otherActivities];
  }, [availableActivities, pkg.activitiesIncluded, isDurbanPackage]);

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

  // Handle room type change
  const handleRoomTypeChange = (roomIndex: number, roomCode: string) => {
    setSelectedRoomTypes(prev => {
      const updated = [...prev];
      updated[roomIndex] = roomCode;
      return updated;
    });
  };

  // Get room rate by code
  const getRoomRate = (roomCode: string): number => {
    const room = roomOptions.find(r => r.code === roomCode);
    return room ? room.lowestRate : (hotel.minRate || 0);
  };

  // Get selected room names for display
  const getSelectedRoomNames = () => {
    return selectedRoomTypes.map(code => {
      const room = roomOptions.find(r => r.code === code);
      return room ? room.name : 'Standard Room';
    });
  };

  // Calculate accommodation cost based on selected rooms
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

  // Kids package cost with tiered pricing support
  let kidsPackageCost = 0;
  if (children > 0 && childrenAges.length > 0) {
    childrenAges.forEach(age => {
      if (age >= 4 && age <= 16) {
        // Check for tiered pricing first
        if (pkg.kidsPriceTiers && pkg.kidsPriceTiers.length > 0) {
          const tier = pkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
          if (tier) {
            kidsPackageCost += tier.price;
          } else if (pkg.kidsPrice) {
            kidsPackageCost += pkg.kidsPrice;
          }
        } else if (pkg.kidsPrice) {
          kidsPackageCost += pkg.kidsPrice;
        }
      }
    });
  } else if (children > 0 && pkg.kidsPrice) {
    // Fallback if no ages provided
    kidsPackageCost = pkg.kidsPrice * children;
  }

  // Service fees: R550 per adult, R100 for kids 3-12, R200 for kids 13-17 (groups of 25+)
  // Service fees using tiered structure
  const calculateServiceFees = () => {
    const totalPeople = adults + childrenAges.length;
    
    // Groups of 25+ use flat rate
    if (totalPeople >= 25) {
      const adultFees = adults * 550;
      let kidsFees = 0;
      const kidFeePerChild = adults >= 2 ? 150 : 300;
      childrenAges.forEach((age) => {
        if (age >= 4 && age <= 16) kidsFees += kidFeePerChild;
      });
      return { adultFees, kidsFees, totalFees: adultFees + kidsFees };
    }

    // Tiered structure for groups 1-24
    let adultFeePerPerson = 0;
    if (adults === 1) adultFeePerPerson = 1000;
    else if (adults >= 2 && adults <= 3) adultFeePerPerson = 850;
    else if (adults >= 4 && adults <= 9) adultFeePerPerson = 800;
    else if (adults >= 10) adultFeePerPerson = 750;
    
    const adultFees = adults * adultFeePerPerson;
    
    let kidsFees = 0;
    const kidFeePerChild = adults >= 2 ? 150 : 300;
    childrenAges.forEach((age) => {
      if (age >= 0 && age <= 3) kidsFees += 0; // Free for under 4
      else if (age >= 4 && age <= 16) kidsFees += kidFeePerChild;
    });

    return {
      adultFees,
      kidsFees,
      totalFees: adultFees + kidsFees,
    };
  };
  
  const serviceFees = calculateServiceFees();
  const totalServiceFees = serviceFees.totalFees;
  const totalPeopleForFee = adults + children;
  const serviceFeePerAdult = totalPeopleForFee >= 25 ? 550 : (adults === 1 ? 1000 : adults <= 3 ? 850 : adults <= 9 ? 800 : 750);

  // Calculate activity costs based on selected activities
  const activityCost = useMemo(() => {
    return calculateTotalActivityCost(selectedActivities, availableActivities, adults, childrenAges);
  }, [selectedActivities, availableActivities, adults, childrenAges]);

  const totalCost = accommodationCost + packageTotal + kidsPackageCost + totalServiceFees + activityCost;
  const pricePerPerson =
    children > 0
      ? totalCost
      : accommodationPerAdult + packageCostPerAdult + serviceFeePerAdult + (activityCost / adults);


  const getStarsLabel = (stars: number) => {
    if (stars >= 5) return '5 Star Luxury';
    if (stars >= 4) return '4 Star Premium';
    if (stars >= 3) return '3 Star Comfort';
    return `${stars} Star`;
  };

  const getStarsColor = (stars: number) => {
    if (stars >= 5) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (stars >= 4) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (stars >= 3) return 'bg-green-100 text-green-800 border-green-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const handleWhatsApp = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `\n🛏️ Room Types:\n${getSelectedRoomNames().map((name, i) => `   Room ${i + 1}: ${name}`).join('\n')}`
      : `\n🛏️ Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const inclusionsList = [`${nights} nights accommodation`, ...selectedActivities].join(', ');

    const text = `Greetings ${guestName || '(Guest)'}\n\n` +
      `The discounted package price for your getaway includes ${inclusionsList}. Our getaways are stylish and trendy with a bit of affordable sophistication.\n\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `📦 Package: ${pkg.name}\n` +
      `📅 Duration: ${nights} nights${roomDetails}\n` +
      `👥 Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `💰 Total: ${formatCurrency(totalCost)}\n\n` +
      `To start with your booking process, please reply to this message. Our agents will then be in communication with you.\n\n` +
      `Thank you,\nBookings,\nTravel Affordable Pty Ltd`;
    
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `\nRoom Types:\n${getSelectedRoomNames().map((name, i) => `- Room ${i + 1}: ${name}`).join('\n')}`
      : `\nRooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const inclusionsList = [`${nights} nights accommodation`, ...selectedActivities].join(', ');

    const subject = `Booking Request - ${pkg.shortName} at ${hotel.name}`;
    const body = `Greetings ${guestName || '(Guest)'}\n\n` +
      `The discounted package price for your getaway includes ${inclusionsList}. Our getaways are stylish and trendy with a bit of affordable sophistication.\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Package: ${pkg.name}\n` +
      `Duration: ${nights} nights${roomDetails}\n` +
      `Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `Total: ${formatCurrency(totalCost)}\n\n` +
      `To start with your booking process, please reply to this email. Our agents will then be in communication with you.\n\n` +
      `Thank you,\nBookings,\nTravel Affordable Pty Ltd`;
    
    window.location.href = `mailto:bookings@travelaffordable.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return isDurbanPackage ? (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Hotel Info */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-primary uppercase">{hotel.name}</h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="font-medium">Package:</span> {pkg.name}
              </p>
              <p>
                <span className="font-medium">Nights:</span> {nights}
              </p>
              <p>
                <span className="font-medium">Rooms:</span> {rooms}
              </p>
              <p>
                <span className="font-medium">Guests:</span> {adults} adult{adults > 1 ? 's' : ''}
                {children > 0
                  ? ` and ${children} child${children > 1 ? 'ren' : ''} (${childrenAges.join(', ')})`
                  : ''}
              </p>
              {hotel.address && (
                <p className="col-span-2">
                  <span className="font-medium">Area:</span> {hotel.address}
                </p>
              )}
            </div>
          </div>

          {/* Hotel Image */}
          <div className="w-full lg:w-72 h-48 relative rounded-lg overflow-hidden bg-muted">
            <img
              src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
              alt={hotel.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`${getStarsColor(hotel.stars)} border`}>{getStarsLabel(hotel.stars)}</Badge>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">{hotel.stars}</span>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        {sortedActivities.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-bold mb-4">
              Below are selected package activities, you may remove an activity by deselecting it or add another activity by selecting it
            </h4>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {sortedActivities.map((activity) => {
                const isSelected = selectedActivities.some(
                  (a) =>
                    a.toLowerCase() === activity.name.toLowerCase() ||
                    activity.name.toLowerCase().includes(a.toLowerCase()) ||
                    a.toLowerCase().includes(activity.name.toLowerCase())
                );

                return (
                  <div
                    key={activity.name}
                    className="text-center cursor-pointer group"
                    onClick={() => handleActivityToggle(activity.name)}
                  >
                    <div
                      className={cn(
                        "relative w-full aspect-square rounded-lg overflow-hidden transition-all",
                        isSelected
                          ? "border-4 border-red-500 ring-2 ring-red-500/20"
                          : "border-2 border-transparent hover:border-muted-foreground/30"
                      )}
                    >
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-8 h-8 text-primary bg-white rounded-full p-1" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm font-bold py-2 px-1 leading-tight text-center uppercase">
                        {activity.name.length > 40
                          ? activity.name.substring(0, 40) + '...'
                          : activity.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Personalized Package Description */}
            <div className="mt-6 bg-muted/30 rounded-lg p-4">
              <p className="text-sm font-bold text-foreground leading-relaxed uppercase">
                GREETINGS {guestName?.toUpperCase() || '(GUEST)'}, THE DISCOUNTED PACKAGE PRICE YOU SEE INCLUDES {nights} NIGHT{nights > 1 ? 'S' : ''} HOTEL ACCOMMODATION
                {selectedActivities.length > 0 && selectedActivities.map((activity, index) => {
                  const activityDescriptions: Record<string, string> = {
                    'USHAKA MARINE WORLD COMBO TICKET': 'USHAKA MARINE WORLD FUN COMBO TICKETS FOR SEAWORLD AND WET N WILD',
                    'ISLE OF CAPRI BOAT CRUISE': 'CRUISE IN LEISURE ON THE ISLE OF CAPRI BOAT CRUISE',
                    '60 MINUTE FULL BODY MASSAGE': 'YOU WILL ENJOY A 60 MINUTE FULL BODY MASSAGE AT A TRENDY BEACHFRONT SPA INCLUDING DRINKS AND HYDRO FACILITIES (SAUNA, STEAM, JACCUZZI)',
                    'SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK': 'SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK',
                  };
                  const description = activityDescriptions[activity.toUpperCase()] || activity.toUpperCase();
                  return ` ° ${description}`;
                })}
                {' '}° OUR GETAWAYS ARE STYLISH AND TRENDY WITH A BIT OF AFFORDABLE SOPHISTICATION. TO MAKE A BOOKING PLEASE CLICK ON THE BOOK NOW BUTTON.
              </p>
            </div>
          </div>
        )}

        {/* Room Selection */}
        {rooms >= 1 && roomOptions.length > 0 && (
          <div className="mt-6">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground mb-3">
                {rooms > 1 ? 'Select Room Types' : 'Select Room Type'}
              </p>
              <div className="space-y-3">
                {Array.from({ length: rooms }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Room {i + 1}</label>
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
                    {selectedRoomTypes[i] && (
                      <div className="text-xs text-muted-foreground mt-1 px-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Sleeps {roomOptions.find((r) => r.code === selectedRoomTypes[i])?.capacity || 2}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col items-end">
            <div className="text-right">
              <p className="text-xl font-bold text-primary">
                Grand total for {adults} adult{adults > 1 ? 's' : ''}
                {children > 0 ? ` and ${children} kid${children > 1 ? 's' : ''}` : ''}:
              </p>
              <p className="text-3xl font-bold text-destructive">{formatCurrency(totalCost)}</p>
            </div>
            {children === 0 && (
              <p className="text-sm text-muted-foreground mt-1">{formatCurrency(pricePerPerson)} per person</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button onClick={handleEmail} className="flex-1 bg-primary hover:bg-primary/90">
            <Mail className="w-4 h-4 mr-2" />
            Book Now
          </Button>
          <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp Us
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card className="overflow-hidden border shadow-lg hover:shadow-xl transition-shadow">
      <div className="grid md:grid-cols-[300px_1fr]">
        {/* Hotel Image */}
        <div className="relative h-48 md:h-full min-h-[200px]">
          <img
            src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge className={`${getStarsColor(hotel.stars)} border`}>{getStarsLabel(hotel.stars)}</Badge>
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
            <h3 className="text-xl font-display font-bold text-foreground mb-1">{hotel.name}</h3>
            {hotel.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {hotel.address}
              </p>
            )}
          </div>

          {/* Package Info Header */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-primary mb-2">{pkg.shortName}</p>
            <p className="text-xs text-muted-foreground">
              Select or deselect activities below to customize your package. The price updates automatically.
            </p>
          </div>

          {/* Activity Selection Grid */}
          {availableActivities.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">Customize Your Activities</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {availableActivities.map((activity) => {
                  const isSelected = selectedActivities.some(
                    (a) =>
                      a.toLowerCase() === activity.name.toLowerCase() ||
                      activity.name.toLowerCase().includes(a.toLowerCase()) ||
                      a.toLowerCase().includes(activity.name.toLowerCase())
                  );

                  return (
                    <div
                      key={activity.name}
                      className="text-center cursor-pointer group"
                      onClick={() => handleActivityToggle(activity.name)}
                    >
                      <div
                        className={cn(
                          "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          isSelected
                            ? "border-red-500 ring-2 ring-red-500/20"
                            : "border-transparent hover:border-muted-foreground/30"
                        )}
                      >
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary bg-white rounded-full p-1" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] font-medium py-1 px-1 leading-tight text-center">
                          {activity.name.length > 25 ? activity.name.substring(0, 25) + '...' : activity.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedActivities.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedActivities.length} activit{selectedActivities.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}
            </div>
          )}

          {/* Package Description - Personalized */}
          <div className="bg-muted/30 rounded-lg p-3 mb-4">
            <p className="text-sm font-bold text-foreground leading-relaxed uppercase">
              GREETINGS {guestName?.toUpperCase() || '(GUEST)'}, THE DISCOUNTED PACKAGE PRICE YOU SEE INCLUDES {nights} NIGHT{nights > 1 ? 'S' : ''} HOTEL ACCOMMODATION
              {selectedActivities.length > 0 && selectedActivities.map((activity) => {
                const activityDescriptions: Record<string, string> = {
                  'USHAKA MARINE WORLD COMBO TICKET': 'USHAKA MARINE WORLD FUN COMBO TICKETS FOR SEAWORLD AND WET N WILD',
                  'ISLE OF CAPRI BOAT CRUISE': 'CRUISE IN LEISURE ON THE ISLE OF CAPRI BOAT CRUISE',
                  '60 MINUTE FULL BODY MASSAGE': 'YOU WILL ENJOY A 60 MINUTE FULL BODY MASSAGE AT A TRENDY BEACHFRONT SPA INCLUDING DRINKS AND HYDRO FACILITIES (SAUNA, STEAM, JACCUZZI)',
                  'SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK': 'SHUTTLE TO TAKE YOU FROM THE HOTEL TO THE ACTIVITIES AND BACK',
                };
                const description = activityDescriptions[activity.toUpperCase()] || activity.toUpperCase();
                return ` ° ${description}`;
              })}
              {' '}° OUR GETAWAYS ARE STYLISH AND TRENDY WITH A BIT OF AFFORDABLE SOPHISTICATION. TO MAKE A BOOKING PLEASE CLICK ON THE BOOK NOW BUTTON.
            </p>
          </div>

          {/* Room Selection */}
          {rooms >= 1 && roomOptions.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-foreground mb-3">
                {rooms > 1 ? 'Select Room Types' : 'Select Room Type'}
              </p>
              <div className="space-y-3">
                {Array.from({ length: rooms }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Room {i + 1}</label>
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
                          Sleeps {roomOptions.find((r) => r.code === selectedRoomTypes[i])?.capacity || 2}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Display */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Package Price</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalCost)}</p>
              {children === 0 && (
                <p className="text-sm text-muted-foreground">{formatCurrency(pricePerPerson)} per person</p>
              )}
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-foreground">
                {nights} nights • {rooms} room{rooms > 1 ? 's' : ''}
              </p>
              <p className="text-muted-foreground">
                {adults} adult{adults > 1 ? 's' : ''}
                {children > 0 ? ` • ${children} child${children > 1 ? 'ren' : ''}` : ''}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleEmail} className="flex-1 bg-primary hover:bg-primary/90">
              <Mail className="w-4 h-4 mr-2" />
              Book Now
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

// Memoize the component to prevent unnecessary re-renders
export const LiveHotelQuoteCard = memo(LiveHotelQuoteCardComponent);

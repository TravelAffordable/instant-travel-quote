import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Mail, MessageSquare, Star, MapPin, Bus, Users, Download } from 'lucide-react';
import { type LiveHotel } from '@/hooks/useHotelbedsSearch';
import { type Package } from '@/data/travelData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import jsPDF from 'jspdf';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { addBookingDisclaimerToPDF } from '@/lib/pdfQuoteUtils';

interface BusHireHotelCardProps {
  hotel: LiveHotel;
  pkg: Package;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms: number;
  busQuoteAmount: number;
  destinationName: string;
  checkIn: string;
  checkOut: string;
  userType: 'bus-company' | 'group-organizer';
}

const getRoomCapacity = (roomCode: string, roomName: string): number => {
  const code = roomCode.toUpperCase();
  const name = roomName.toUpperCase();
  
  if (code.includes('FAM') || name.includes('FAMILY')) return 4;
  if (code.includes('SUI') || name.includes('SUITE')) return 3;
  if (code.includes('TRP') || code.includes('TPL') || name.includes('TRIPLE')) return 3;
  if (code.includes('QUA') || code.includes('QAD') || name.includes('QUAD')) return 4;
  if (code.includes('SGL') || code.includes('SIN') || name.includes('SINGLE')) return 1;
  if (name.includes('PENTHOUSE') || name.includes('APARTMENT')) return 5;
  if (name.includes('THREE BEDROOM') || name.includes('3 BEDROOM')) return 6;
  if (name.includes('TWO BEDROOM') || name.includes('2 BEDROOM')) return 4;
  
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

export function BusHireHotelCard({
  hotel,
  pkg,
  nights,
  adults,
  children,
  childrenAges,
  rooms,
  busQuoteAmount,
  destinationName,
  checkIn,
  checkOut,
  userType,
}: BusHireHotelCardProps) {
  const totalPeople = adults + children;
  const busPerPerson = totalPeople > 0 ? busQuoteAmount / totalPeople : 0;

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

  // State for selected room types
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(() => {
    const defaultRoom = roomOptions.length > 0 ? roomOptions[0].code : '';
    return Array(rooms).fill(defaultRoom);
  });

  const getRoomRate = (roomCode: string): number => {
    const roomOption = roomOptions.find(r => r.code === roomCode);
    return roomOption?.lowestRate || hotel.minRate;
  };

  // Calculate total accommodation
  const accommodationCost = useMemo(() => {
    if (roomOptions.length === 0) {
      return (hotel.minRate || 0) * Math.max(1, rooms);
    }
    
    return selectedRoomTypes.reduce((total, roomCode) => {
      return total + getRoomRate(roomCode);
    }, 0);
  }, [selectedRoomTypes, roomOptions, hotel.minRate, rooms]);

  const packageCostPerAdult = pkg.basePrice;
  const packageTotal = packageCostPerAdult * adults;

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

  // Service fees using tiered structure
  const calculateServiceFees = () => {
    const totalPeople = adults + childrenAges.length;
    
    // Groups of 25+ use flat rate
    if (totalPeople >= 25) {
      const adultFees = adults * 400;
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

  // Total without bus
  const subtotalWithoutBus = accommodationCost + packageTotal + kidsPackageCost + totalServiceFees;
  
  // Total with bus
  const totalWithBus = subtotalWithoutBus + busQuoteAmount;
  
  const pricePerPerson = totalPeople > 0 ? Math.round(totalWithBus / totalPeople) : 0;


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

    const text = `Hi! I'm interested in a group booking:\n\n` +
      `🏨 Hotel: ${hotel.name}\n` +
      `📍 Destination: ${destinationName}\n` +
      `📦 Package: ${pkg.name}\n` +
      `📅 Dates: ${new Date(checkIn).toLocaleDateString()} - ${new Date(checkOut).toLocaleDateString()}\n` +
      `📅 Duration: ${nights} nights${roomDetails}\n` +
      `👥 Group: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n` +
      `🚌 Bus Transport: ${formatCurrency(busQuoteAmount)}\n` +
      `💰 Total (incl. bus): ${formatCurrency(totalWithBus)}\n` +
      `💵 Per Person: ${formatCurrency(pricePerPerson)}\n\n` +
      `Please confirm availability and booking details.`;
    
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmail = () => {
    const roomDetails = rooms > 1 && roomOptions.length > 0
      ? `Room Types:\n${getSelectedRoomNames().map((name, i) => `- Room ${i + 1}: ${name}`).join('\n')}`
      : `Rooms: ${rooms} room${rooms > 1 ? 's' : ''}`;

    const subject = `Group Booking Enquiry: ${hotel.name} - ${pkg.shortName}`;
    const body = `Hi Travel Affordable,\n\n` +
      `I would like to enquire about a group booking:\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Destination: ${destinationName}\n` +
      `Package: ${pkg.name}\n` +
      `Check-in: ${new Date(checkIn).toLocaleDateString()}\n` +
      `Check-out: ${new Date(checkOut).toLocaleDateString()}\n` +
      `Duration: ${nights} nights\n` +
      `${roomDetails}\n` +
      `Group Size: ${adults} adults${children > 0 ? `, ${children} children` : ''}\n\n` +
      `Bus Transport Quote: ${formatCurrency(busQuoteAmount)}\n\n` +
      `Pricing Breakdown:\n` +
      `- Accommodation: ${formatCurrency(accommodationCost)}\n` +
      `- Package Activities: ${formatCurrency(packageTotal + kidsPackageCost)}\n` +
      `- Service Fees: ${formatCurrency(totalServiceFees)}\n` +
      `- Bus Transport: ${formatCurrency(busQuoteAmount)}\n` +
      `- Total: ${formatCurrency(totalWithBus)}\n` +
      `- Per Person: ${formatCurrency(pricePerPerson)}\n\n` +
      `Package Inclusions:\n${pkg.activitiesIncluded.map(a => `- ${a}`).join('\n')}\n\n` +
      `Please confirm availability and send me booking details.\n\n` +
      `Thank you`;
    
    window.open(`mailto:info@travelaffordable.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(30, 64, 175);
    pdf.text(userType === 'bus-company' ? 'Bus Company Group Quote' : 'Group Tour Quote', 20, 25);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Trip Details
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Trip Details', 20, 50);
    
    pdf.setFontSize(11);
    let y = 60;
    
    pdf.text(`Destination: ${destinationName}`, 20, y); y += 8;
    pdf.text(`Hotel: ${hotel.name}`, 20, y); y += 8;
    pdf.text(`Package: ${pkg.name}`, 20, y); y += 8;
    pdf.text(`Check-in: ${new Date(checkIn).toLocaleDateString()}`, 20, y); y += 8;
    pdf.text(`Check-out: ${new Date(checkOut).toLocaleDateString()}`, 20, y); y += 8;
    pdf.text(`Duration: ${nights} night${nights > 1 ? 's' : ''}`, 20, y); y += 8;
    pdf.text(`Group Size: ${adults} adults${children > 0 ? ` + ${children} children` : ''}`, 20, y); y += 8;
    pdf.text(`Rooms: ${rooms}`, 20, y); y += 15;
    
    // Activities
    pdf.setFontSize(14);
    pdf.text('Package Inclusions:', 20, y); y += 10;
    pdf.setFontSize(10);
    pdf.text('• Accommodation', 25, y); y += 6;
    pkg.activitiesIncluded.forEach(activity => {
      if (y < 250) {
        pdf.text(`• ${activity}`, 25, y);
        y += 6;
      }
    });
    y += 10;
    
    // Pricing
    pdf.setFontSize(14);
    pdf.text('Pricing Breakdown', 20, y); y += 10;
    pdf.setFontSize(11);
    
    pdf.text(`Accommodation: ${formatCurrency(accommodationCost)}`, 20, y); y += 8;
    pdf.text(`Activities Package: ${formatCurrency(packageTotal + kidsPackageCost)}`, 20, y); y += 8;
    pdf.text(`Service Fees: ${formatCurrency(totalServiceFees)}`, 20, y); y += 8;
    pdf.text(`Bus Transport: ${formatCurrency(busQuoteAmount)}`, 20, y); y += 10;
    
    pdf.setFontSize(13);
    pdf.setTextColor(30, 64, 175);
    pdf.text(`Total Per Person: ${formatCurrency(pricePerPerson)}`, 20, y); y += 10;
    pdf.setFontSize(14);
    pdf.text(`Grand Total: ${formatCurrency(totalWithBus)}`, 20, y);
    y += 15;
    
    // Add booking disclaimer
    addBookingDisclaimerToPDF(pdf, y);
    
    pdf.save(`group-quote-${hotel.name.toLowerCase().replace(/\s+/g, '-')}-${pkg.shortName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };
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
          {/* Bus Transport Badge */}
          {busQuoteAmount > 0 && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-blue-600 text-white border-0">
                <Bus className="w-3 h-3 mr-1" />
                Incl. Transport
              </Badge>
            </div>
          )}
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
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">Accommodation ({nights} nights)</span>
              </div>
              {pkg.activitiesIncluded.slice(0, 3).map((activity, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{activity}</span>
                </div>
              ))}
              {busQuoteAmount > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-blue-600 font-medium">
                  <Bus className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">Bus Transport Included</span>
                </div>
              )}
            </div>
            {pkg.activitiesIncluded.length > 3 && (
              <p className="text-xs text-primary mt-2">+{pkg.activitiesIncluded.length - 3} more inclusions</p>
            )}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Pricing Breakdown</p>
            <div className="space-y-1 text-xs text-blue-800">
              <div className="flex justify-between">
                <span>Accommodation:</span>
                <span>{formatCurrency(accommodationCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities Package:</span>
                <span>{formatCurrency(packageTotal + kidsPackageCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fees:</span>
                <span>{formatCurrency(totalServiceFees)}</span>
              </div>
              {busQuoteAmount > 0 && (
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>🚌 Bus Transport:</span>
                  <span>{formatCurrency(busQuoteAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Price */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Package Price (incl. transport)</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalWithBus)}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(pricePerPerson)} per person
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-foreground">{nights} nights • {rooms} room{rooms > 1 ? 's' : ''}</p>
              <p className="text-muted-foreground">{adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` • ${children} child${children > 1 ? 'ren' : ''}` : ''}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 min-w-[120px]">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleEmail} variant="outline" className="flex-1 min-w-[120px]">
              <Mail className="w-4 h-4 mr-2" />
              Request to Book
            </Button>
            <Button onClick={handleWhatsApp} className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ParsedHotelData {
  hotelName: string;
  roomType?: string;
  roomDetails?: string;
  bedConfig?: string;
  mealPlan?: string;
  cancellationPolicy?: string;
  availabilityNote?: string;
  stayDetails?: string;
  totalCost: number;
  originalPrice?: number;
  rating?: string;
  reviews?: string;
}

interface BulkHotelParserProps {
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  packageIds: string[];
  packages: Array<{ id: string; name: string; basePrice: number; kidsPrice?: number; activitiesIncluded: string[] }>;
  checkIn: string;
  checkOut: string;
  onHotelsAdded: (hotels: Array<{
    hotelName: string;
    hotelTier?: string;
    recommendation?: string;
    roomType?: string;
    bedConfig?: string;
    mealPlan?: string;
    stayDetails?: string;
    totalCost: number;
    packageId: string;
    packageName: string;
    checkInDate?: string;
    checkOutDate?: string;
  }>) => void;
}

export function BulkHotelParser({
  nights,
  adults,
  children,
  rooms,
  packageIds,
  packages,
  checkIn,
  checkOut,
  onHotelsAdded,
}: BulkHotelParserProps) {
  const [rawText, setRawText] = useState('');
  const [parsedHotels, setParsedHotels] = useState<ParsedHotelData[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  const parseBookingText = (text: string): ParsedHotelData[] => {
    const hotels: ParsedHotelData[] = [];
    
    // Split by "Opens in new window" which appears after each hotel name
    // Each hotel block typically has the hotel name appearing right before "Opens in new window"
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Find hotel names - they appear as standalone lines before the duplicate with "Opens in new window"
    // Pattern: "Hotel Name" then "Hotel NameOpens in new window"
    const hotelBlocks: { hotelName: string; content: string[] }[] = [];
    let currentHotelName = '';
    let currentContent: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if this line contains "Opens in new window" - marks the start of a hotel entry
      if (line.includes('Opens in new window')) {
        // If we have a previous hotel, save it
        if (currentHotelName && currentContent.length > 0) {
          hotelBlocks.push({ hotelName: currentHotelName, content: [...currentContent] });
        }
        
        // Extract hotel name from this line (remove "Opens in new window" suffix)
        currentHotelName = line.replace(/Opens in new window$/i, '').trim();
        currentContent = [];
        continue;
      }
      
      // Check if previous line was a standalone hotel name (appears before the "Opens in new window" version)
      // This handles the case where hotel name appears twice - once standalone, once with suffix
      if (i > 0 && !currentHotelName) {
        const prevLine = lines[i - 1];
        if (!prevLine.includes('Opens in new window') && 
            line.includes('Opens in new window') && 
            line.startsWith(prevLine)) {
          currentHotelName = prevLine;
          currentContent = [];
          continue;
        }
      }
      
      currentContent.push(line);
    }
    
    // Don't forget the last hotel
    if (currentHotelName && currentContent.length > 0) {
      hotelBlocks.push({ hotelName: currentHotelName, content: [...currentContent] });
    }
    
    // Process each hotel block
    for (const block of hotelBlocks) {
      const hotel = parseHotelBlock(block.hotelName, block.content.join('\n'));
      if (hotel && hotel.hotelName && hotel.totalCost > 0) {
        // Avoid duplicates
        if (!hotels.some(h => h.hotelName === hotel.hotelName && h.totalCost === hotel.totalCost)) {
          hotels.push(hotel);
        }
      }
    }
    
    // Limit to 20 hotels
    return hotels.slice(0, 20);
  };

  const parseHotelBlock = (hotelName: string, blockContent: string): ParsedHotelData | null => {
    const lines = blockContent.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const hotel: ParsedHotelData = {
      hotelName: hotelName,
      totalCost: 0,
    };

    // Lines to skip entirely (noise)
    const noisePatterns = [
      /Opens in new window/i,
      /Pay with Wallet/i,
      /Show on map/i,
      /^\d+\.?\d*\s*km from/i,
      /^Location\s+\d/i,
      /^Scored\s+\d/i,
      /^\d\.\d$/,
      /^(Good|Very Good|Excellent|Wonderful|Superb)\s*·/i,
      /^\d+\s*reviews?$/i,
      /Original price/i,
      /Includes taxes and fees/i,
      /Current price/i,
      /^[A-Za-z]+Show on map$/i,
    ];

    const isNoise = (line: string) => noisePatterns.some(p => p.test(line));

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip noise lines
      if (isNoise(line)) continue;
      
      // Room type - contains "Room", "Suite", "Apartment", "Chalet", "Tent", "Villa", "Cottage"
      // But NOT if it's a room details line with bullets
      if (!hotel.roomType && 
          !line.includes('•') &&
          (line.match(/\b(Room|Suite|Apartment|Chalet|Tent|Villa|Studio|Cottage|Bungalow|Lodge|Cabin)\b/i) ||
           line.match(/^(Standard|Deluxe|Superior|King|Queen|Twin|Double|Family|Luxury|One-Bedroom|Two-Bedroom|Three-Bedroom)/i))) {
        // Skip if this is clearly just bed config
        if (!line.match(/^\d+\s+(twin|full|queen|king)/i)) {
          hotel.roomType = line;
          continue;
        }
      }
      
      // Room details - "Entire chalet • 1 bedroom • 1 bathroom • 48 m²" pattern
      if (!hotel.roomDetails && 
          (line.includes('•') && (line.includes('bedroom') || line.includes('bathroom') || line.includes('m²') || line.includes('kitchen') || line.includes('living')))) {
        hotel.roomDetails = line;
        continue;
      }
      
      // Bed configuration
      if (!hotel.bedConfig && 
          (line.match(/\d+\s*(beds?|twin|full|queen|king)/i) ||
           line.match(/\b(twin|full|queen|king)\s+beds?\b/i) ||
           line.includes('crib') ||
           line.includes('sofa bed'))) {
        hotel.bedConfig = line;
        continue;
      }
      
      // Free cancellation
      if (!hotel.cancellationPolicy && line.toLowerCase().includes('free cancellation')) {
        hotel.cancellationPolicy = 'Free cancellation';
        continue;
      }
      
      // Availability note - "Only X left" or "Only X rooms left"
      if (!hotel.availabilityNote && line.match(/^Only\s+\d+/i)) {
        hotel.availabilityNote = line;
        continue;
      }
      
      // Meal plan - but not if it contains "Free breakfast for Genius" which is a promo
      if (!hotel.mealPlan && 
          (line.toLowerCase().includes('breakfast included') || 
           line.toLowerCase().includes('dinner included') ||
           line.toLowerCase().includes('& dinner included') ||
           line.toLowerCase().includes('breakfast & dinner'))) {
        hotel.mealPlan = line;
        continue;
      }
      
      // Stay details - nights/adults pattern
      const stayMatch = line.match(/(\d+)\s*nights?,?\s*(\d+)\s*adults?/i);
      if (stayMatch && !hotel.stayDetails) {
        hotel.stayDetails = line;
        continue;
      }
      
      // Price - ZAR followed by amount. Take the LOWEST price (current/discounted price)
      const priceMatches = [...line.matchAll(/ZAR\s*([\d,]+)/gi)];
      if (priceMatches.length > 0 && hotel.totalCost === 0) {
        // Parse all prices and find the lowest one (usually the discounted/current price)
        const prices = priceMatches.map(m => parseFloat(m[1].replace(/,/g, ''))).filter(p => !isNaN(p) && p > 0);
        if (prices.length > 0) {
          const lowestPrice = Math.min(...prices);
          const highestPrice = Math.max(...prices);
          hotel.totalCost = lowestPrice;
          if (prices.length >= 2 && highestPrice > lowestPrice) {
            hotel.originalPrice = highestPrice;
          }
        }
        continue;
      }
    }

    return hotel.hotelName && hotel.totalCost > 0 ? hotel : null;
  };

  const handleParse = () => {
    if (!rawText.trim()) {
      toast.error('Please paste hotel information first');
      return;
    }

    const hotels = parseBookingText(rawText);
    
    if (hotels.length === 0) {
      toast.error('Could not parse any hotels. Please check the format.');
      return;
    }

    setParsedHotels(hotels);
    setIsParsed(true);
    toast.success(`Found ${hotels.length} hotel${hotels.length > 1 ? 's' : ''}`);
  };

  const handleRemoveHotel = (index: number) => {
    setParsedHotels(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddAllToQuotes = () => {
    if (parsedHotels.length === 0) {
      toast.error('No hotels to add');
      return;
    }

    const selectedPackages = packages.filter(p => packageIds.includes(p.id));
    if (selectedPackages.length === 0) {
      toast.error('Please select at least one package first');
      return;
    }

    const allQuotes: Array<{
      hotelName: string;
      hotelTier?: string;
      recommendation?: string;
      roomType?: string;
      bedConfig?: string;
      mealPlan?: string;
      stayDetails?: string;
      totalCost: number;
      packageId: string;
      packageName: string;
      checkInDate?: string;
      checkOutDate?: string;
    }> = [];

    parsedHotels.forEach(hotel => {
      selectedPackages.forEach(pkg => {
        allQuotes.push({
          hotelName: hotel.hotelName,
          roomType: hotel.roomType,
          bedConfig: hotel.bedConfig,
          mealPlan: hotel.mealPlan,
          stayDetails: hotel.stayDetails || `${nights} night${nights > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
          totalCost: hotel.totalCost,
          packageId: pkg.id,
          packageName: pkg.name,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        });
      });
    });

    onHotelsAdded(allQuotes);
    toast.success(`Added ${parsedHotels.length} hotel${parsedHotels.length > 1 ? 's' : ''} with ${selectedPackages.length} package${selectedPackages.length > 1 ? 's' : ''} (${allQuotes.length} total quotes)`);
    
    // Reset
    setRawText('');
    setParsedHotels([]);
    setIsParsed(false);
  };

  const handleReset = () => {
    setRawText('');
    setParsedHotels([]);
    setIsParsed(false);
  };

  return (
    <div className="space-y-4">
      {!isParsed ? (
        <div className="space-y-3">
          <Label className="text-sm text-gray-700">
            Paste hotel listings (supports up to 20 hotels from Booking.com format):
          </Label>
          <Textarea
            placeholder={`Paste multiple hotels here. Example format:

Hotel Numbi & Garden SuitesOpens in new window
Pay with Wallet
Scored 7.9
Good · 865 reviews
HazyviewShow on map
0.6 km from downtown
Twin Room with Garden View
2 twin beds
Breakfast included
Free cancellation
2 nights, 2 adults
ZAR 3,180ZAR 2,862
...`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="min-h-[200px] text-sm font-mono"
          />
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!rawText.trim()}>
              Parse Hotels
            </Button>
            {rawText && (
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-gray-800">
              Parsed Hotels ({parsedHotels.length}/20) - Remove unwanted hotels before adding
            </h5>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Start Over
              </Button>
              <Button 
                size="sm" 
                onClick={handleAddAllToQuotes}
                disabled={parsedHotels.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Add {parsedHotels.length} Hotel{parsedHotels.length !== 1 ? 's' : ''} to Quotes
              </Button>
            </div>
          </div>

          {/* List of parsed hotels */}
          <div className="space-y-4">
            {parsedHotels.map((hotel, index) => (
              <Card key={index} className="border-2 border-amber-200 bg-amber-50">
                <CardContent className="p-4 md:p-5">
                  <div className="flex justify-between items-start gap-4">
                    {/* Left side - Hotel details */}
                    <div className="flex-1 min-w-0">
                      {/* Room type badge */}
                      {hotel.roomType && (
                        <span className="inline-block text-xs font-medium text-white bg-primary px-2 py-1 rounded mb-2">
                          {hotel.roomType}
                        </span>
                      )}
                      
                      {/* Hotel name */}
                      <h4 className="font-semibold text-lg text-amber-900 mb-1">{hotel.hotelName}</h4>
                      
                      {/* Availability note / room details */}
                      <div className="space-y-0.5 text-sm text-muted-foreground mb-2">
                        {hotel.availabilityNote && (
                          <p>{hotel.availabilityNote}</p>
                        )}
                        {hotel.bedConfig && (
                          <p>{hotel.bedConfig}</p>
                        )}
                      </div>
                      
                      {/* Meal plan */}
                      {hotel.mealPlan && (
                        <p className="text-green-600 font-medium text-sm mb-2">
                          <Check className="w-4 h-4 inline mr-1" />
                          {hotel.mealPlan}
                        </p>
                      )}
                      
                      {/* Cancellation policy */}
                      {hotel.cancellationPolicy && (
                        <p className="text-green-600 text-sm mb-2">
                          <Check className="w-4 h-4 inline mr-1" />
                          {hotel.cancellationPolicy}
                        </p>
                      )}
                      
                      {/* Room details */}
                      {hotel.roomDetails && (
                        <p className="text-muted-foreground text-sm mb-2">{hotel.roomDetails}</p>
                      )}
                      
                      {/* Stay details */}
                      {hotel.stayDetails && (
                        <p className="text-muted-foreground text-sm">{hotel.stayDetails}</p>
                      )}
                    </div>
                    
                    {/* Right side - Price and Remove */}
                    <div className="text-right shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHotel(index)}
                        className="h-7 text-red-600 hover:text-red-700 hover:bg-red-100 mb-2"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                      
                      {hotel.originalPrice && hotel.originalPrice > hotel.totalCost && (
                        <p className="text-sm text-muted-foreground line-through">
                          R{hotel.originalPrice.toLocaleString()}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-primary">
                        R{hotel.totalCost.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {parsedHotels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trash2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>All hotels removed. Click "Start Over" to parse again.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

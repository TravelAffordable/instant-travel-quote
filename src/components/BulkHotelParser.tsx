import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Hotel, X, Check, Coffee, Bed, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ParsedHotelData {
  hotelName: string;
  roomType?: string;
  bedConfig?: string;
  mealPlan?: string;
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
    
    // Split by hotel entries - hotels usually start with name followed by "Opens in new window"
    // or we can detect patterns that signal a new hotel entry
    const hotelBlocks: string[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let currentBlock: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      
      // Detect start of a new hotel: 
      // - Line contains "Opens in new window" (usually after hotel name)
      // - Or line followed by "Pay with Wallet" or "Scored X.X"
      // - Or line that looks like a hotel name followed by rating pattern
      const isHotelStart = 
        line.includes('Opens in new window') ||
        nextLine.includes('Pay with Wallet') ||
        nextLine.match(/^Scored\s+\d/) ||
        (currentBlock.length > 0 && line.match(/^[A-Z]/) && nextLine.match(/^(Pay with Wallet|Scored)/));
      
      if (isHotelStart && currentBlock.length > 0) {
        hotelBlocks.push(currentBlock.join('\n'));
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
    
    // Add last block
    if (currentBlock.length > 0) {
      hotelBlocks.push(currentBlock.join('\n'));
    }
    
    // If we couldn't split well, try alternative approach - split by ZAR patterns
    let blocksToProcess = hotelBlocks;
    if (hotelBlocks.length <= 1 && text.includes('ZAR')) {
      // Split by price patterns and work backwards to find hotel names
      blocksToProcess = text.split(/(?=ZAR\s*[\d,]+\s*(?:ZAR\s*[\d,]+)?)/i).filter(b => b.trim());
    }
    
    // Process each block
    for (const block of blocksToProcess) {
      const hotel = parseHotelBlock(block);
      if (hotel && hotel.hotelName && hotel.totalCost > 0) {
        // Avoid duplicates
        if (!hotels.some(h => h.hotelName === hotel.hotelName)) {
          hotels.push(hotel);
        }
      }
    }
    
    // Limit to 20 hotels
    return hotels.slice(0, 20);
  };

  const parseHotelBlock = (block: string): ParsedHotelData | null => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) return null;

    const hotel: ParsedHotelData = {
      hotelName: '',
      totalCost: 0,
    };

    // Find hotel name - usually first substantial line before "Opens in new window"
    let hotelNameFound = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip noise
      if (line.includes('Opens in new window') || 
          line.includes('Pay with Wallet') ||
          line.includes('Show on map') ||
          line.match(/^\d+\.\d+ km from/) ||
          line.match(/^Location \d/) ||
          line.match(/^Scored/) ||
          line === 'Dinner included') {
        continue;
      }
      
      // Hotel name - first line that looks like a name (contains letters, may have & or -)
      if (!hotelNameFound && 
          line.length > 3 && 
          line.match(/^[A-Za-z]/) &&
          !line.match(/^(Standard|Deluxe|Superior|King|Queen|Twin|Double|Family|Suite|Room|Entire|Breakfast|Free|Only|\d)/) &&
          !line.includes('beds') &&
          !line.includes('bathroom') &&
          !line.includes('kitchen')) {
        hotel.hotelName = line.replace(/Opens in new window$/i, '').trim();
        hotelNameFound = true;
        continue;
      }
      
      // Rating - "Scored X.X" or just "X.X" followed by description
      const ratingMatch = line.match(/(?:Scored\s+)?(\d\.\d)\s*(Good|Very Good|Excellent|Wonderful|Superb)?/i);
      if (ratingMatch && !hotel.rating) {
        hotel.rating = ratingMatch[1];
        continue;
      }
      
      // Reviews - "X reviews" or "· X reviews"
      const reviewsMatch = line.match(/·?\s*([\d,]+)\s*reviews?/i);
      if (reviewsMatch && !hotel.reviews) {
        hotel.reviews = reviewsMatch[1];
        continue;
      }
      
      // Room type - contains "Room", "Suite", "Apartment", "Chalet", "Tent", "Villa"
      if (!hotel.roomType && 
          (line.match(/\b(Room|Suite|Apartment|Chalet|Tent|Villa|Studio|Cottage)\b/i) ||
           line.match(/^(Standard|Deluxe|Superior|King|Queen|Twin|Double|Family|Luxury)/))) {
        // Skip if this is clearly just bed config
        if (!line.match(/^\d+\s+(twin|full|queen|king)/i)) {
          hotel.roomType = line;
          continue;
        }
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
      
      // Meal plan
      if (!hotel.mealPlan && 
          (line.toLowerCase().includes('breakfast') || 
           line.toLowerCase().includes('dinner') ||
           line.toLowerCase().includes('meal'))) {
        if (!line.includes('Free breakfast for Genius')) {
          hotel.mealPlan = line;
        } else {
          hotel.mealPlan = 'Breakfast included';
        }
        continue;
      }
      
      // Stay details - nights/adults pattern
      const stayMatch = line.match(/(\d+)\s*nights?,?\s*(\d+)\s*adults?/i);
      if (stayMatch && !hotel.stayDetails) {
        hotel.stayDetails = line;
        continue;
      }
      
      // Price - ZAR followed by amount. Take the LAST (current) price if two are present
      // Pattern: "ZAR 3,180ZAR 2,862" or "ZAR 2,862" or "ZAR 3,600Price ZAR 3,600"
      const priceMatches = [...line.matchAll(/ZAR\s*([\d,]+)/gi)];
      if (priceMatches.length > 0) {
        // Get the last price (current price after discount)
        const lastPrice = priceMatches[priceMatches.length - 1][1];
        const price = parseFloat(lastPrice.replace(/,/g, ''));
        if (!isNaN(price) && price > 0) {
          // If there are two prices, first is original, second is current
          if (priceMatches.length >= 2) {
            hotel.originalPrice = parseFloat(priceMatches[0][1].replace(/,/g, ''));
          }
          hotel.totalCost = price;
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

          {/* Grid of parsed hotels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {parsedHotels.map((hotel, index) => (
              <Card key={index} className="border border-border relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveHotel(index)}
                  className="absolute top-1 right-1 h-7 w-7 p-0 opacity-60 hover:opacity-100 hover:bg-red-100 hover:text-red-600 z-10"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardContent className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center shrink-0">
                      <Hotel className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h6 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">
                        {hotel.hotelName}
                      </h6>
                      {hotel.rating && (
                        <span className="text-xs text-blue-600 font-medium">
                          ★ {hotel.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    {hotel.roomType && (
                      <p className="text-gray-700 font-medium line-clamp-1">{hotel.roomType}</p>
                    )}
                    {hotel.bedConfig && (
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Bed className="w-3 h-3" />
                        <span className="line-clamp-1">{hotel.bedConfig}</span>
                      </p>
                    )}
                    {hotel.mealPlan && (
                      <p className="flex items-center gap-1 text-green-600">
                        <Coffee className="w-3 h-3" />
                        <span className="line-clamp-1">{hotel.mealPlan}</span>
                      </p>
                    )}
                    {hotel.stayDetails && (
                      <p className="text-muted-foreground line-clamp-1">{hotel.stayDetails}</p>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-baseline justify-between">
                      {hotel.originalPrice && hotel.originalPrice > hotel.totalCost && (
                        <span className="text-xs text-muted-foreground line-through">
                          R{hotel.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-base font-bold text-primary ml-auto">
                        R{hotel.totalCost.toLocaleString()}
                      </span>
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

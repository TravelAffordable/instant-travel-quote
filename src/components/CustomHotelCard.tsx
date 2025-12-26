import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Hotel, Coffee, Baby, Bed } from 'lucide-react';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

export interface CustomHotelDetails {
  hotelName: string;
  hotelTier?: string;
  recommendation?: string;
  roomType?: string;
  bedConfig?: string;
  mealPlan?: string;
  stayDetails?: string;
  totalCost: number;
}

interface CustomHotelCardProps {
  hotelName: string;
  rooms: number;
  adults: number;
  children?: number;
  nights?: number;
  onCalculate: (details: CustomHotelDetails) => void;
  initialData?: Partial<CustomHotelDetails>;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export function CustomHotelCard({ hotelName, rooms, adults, children = 0, nights = 1, onCalculate, initialData, isEditing, onCancelEdit }: CustomHotelCardProps) {
  const [hotelDetails, setHotelDetails] = useState<string>('');
  const [totalCost, setTotalCost] = useState<string>('');
  const [calculated, setCalculated] = useState(false);
  const [parsedDetails, setParsedDetails] = useState<Partial<CustomHotelDetails>>({});

  // Populate with initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      const details = [
        initialData.hotelTier,
        initialData.recommendation,
        initialData.roomType,
        initialData.bedConfig,
        initialData.mealPlan,
        initialData.stayDetails,
      ].filter(Boolean).join('\n');
      setHotelDetails(details);
      setTotalCost(initialData.totalCost?.toString() || '');
      setParsedDetails(initialData);
      setCalculated(false);
    }
  }, [initialData, isEditing]);

  const parseHotelDetails = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    const details: Partial<CustomHotelDetails> = {};
    
    for (const line of lines) {
      // Check for price line (ZAR or R followed by number)
      const priceMatch = line.match(/(?:ZAR|R)\s*([\d,]+(?:\.\d{2})?)/i);
      if (priceMatch) {
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));
        if (!isNaN(price)) {
          setTotalCost(price.toString());
        }
        continue;
      }
      
      // Check for stay details (nights, adults, children pattern)
      if (line.match(/\d+\s*night/i) || line.match(/\d+\s*adult/i)) {
        details.stayDetails = line;
        continue;
      }
      
      // Check for breakfast/meal plan
      if (line.toLowerCase().includes('breakfast') || line.toLowerCase().includes('meal') || line.toLowerCase().includes('dinner')) {
        details.mealPlan = line;
        continue;
      }
      
      // Check for bed configuration
      if (line.toLowerCase().includes('bed') || line.toLowerCase().includes('crib') || line.toLowerCase().includes('cot')) {
        details.bedConfig = line;
        continue;
      }
      
      // Check for recommendation
      if (line.toLowerCase().includes('recommended')) {
        details.recommendation = line;
        continue;
      }
      
      // Check for tier keywords
      if (['beachfront', 'oceanview', 'poolside', 'garden', 'city view', 'sea facing', 'mountain view'].some(t => line.toLowerCase().includes(t)) && line.length < 30) {
        details.hotelTier = line;
        continue;
      }
      
      // If it contains "room" or "suite" or "apartment", it's likely the room type
      if (line.toLowerCase().includes('room') || line.toLowerCase().includes('suite') || line.toLowerCase().includes('apartment')) {
        details.roomType = line;
        continue;
      }
      
      // First unmatched line could be tier
      if (!details.hotelTier && lines.indexOf(line) === 0) {
        details.hotelTier = line;
      }
    }
    
    return details;
  };

  const handleDetailsChange = (text: string) => {
    setHotelDetails(text);
    setCalculated(false);
    const parsed = parseHotelDetails(text);
    setParsedDetails(parsed);
  };

  const handleCalculate = () => {
    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost <= 0) return;
    
    setCalculated(true);
    onCalculate({
      hotelName,
      hotelTier: parsedDetails.hotelTier,
      recommendation: parsedDetails.recommendation,
      roomType: parsedDetails.roomType,
      bedConfig: parsedDetails.bedConfig,
      mealPlan: parsedDetails.mealPlan,
      stayDetails: parsedDetails.stayDetails || `${nights} night${nights > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
      totalCost: cost,
    });
  };

  return (
    <Card className="border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
            <Hotel className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{hotelName}</h4>
            <p className="text-sm text-muted-foreground">Durban, KwaZulu-Natal</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Custom Quote</span>
            </div>
          </div>
          {calculated && (
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(parseFloat(totalCost))}
              </p>
              <p className="text-xs text-muted-foreground">total stay</p>
            </div>
          )}
        </div>

        {/* Details Input */}
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div>
            <Label htmlFor={`details-${hotelName}`} className="text-sm text-muted-foreground">
              Paste hotel details (room type, meal plan, price, etc.)
            </Label>
            <Textarea
              id={`details-${hotelName}`}
              placeholder={`Example:\nBeachfront\nRecommended for your group\nDeluxe Quadruple Room 2 Bedroom Apartment\nMultiple bed types • Free crib available\nBreakfast included\n3 nights, 3 adults, 2 children\nZAR 12,370`}
              value={hotelDetails}
              onChange={(e) => handleDetailsChange(e.target.value)}
              className="mt-1 min-h-[120px] text-sm"
            />
          </div>

          {/* Parsed Preview */}
          {(parsedDetails.hotelTier || parsedDetails.roomType || parsedDetails.mealPlan) && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-medium text-xs text-muted-foreground mb-2">Parsed Details:</p>
              {parsedDetails.hotelTier && (
                <p className="text-primary font-medium">{parsedDetails.hotelTier}</p>
              )}
              {parsedDetails.recommendation && (
                <p className="text-green-600 text-xs">{parsedDetails.recommendation}</p>
              )}
              {parsedDetails.roomType && (
                <p className="font-medium">{parsedDetails.roomType}</p>
              )}
              {parsedDetails.bedConfig && (
                <p className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Bed className="w-3 h-3" /> {parsedDetails.bedConfig}
                </p>
              )}
              {parsedDetails.mealPlan && (
                <p className="flex items-center gap-1 text-green-600 text-xs">
                  <Coffee className="w-3 h-3" /> {parsedDetails.mealPlan}
                </p>
              )}
              {parsedDetails.stayDetails && (
                <p className="text-muted-foreground text-xs">{parsedDetails.stayDetails}</p>
              )}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor={`cost-${hotelName}`} className="text-sm text-muted-foreground">
                Total Cost (R)
              </Label>
              <Input
                id={`cost-${hotelName}`}
                type="number"
                placeholder="e.g. 12370"
                value={totalCost}
                onChange={(e) => {
                  setTotalCost(e.target.value);
                  setCalculated(false);
                }}
                className="mt-1"
              />
            </div>
            {isEditing && onCancelEdit && (
              <Button 
                variant="outline"
                onClick={onCancelEdit}
                className="h-10"
              >
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleCalculate}
              disabled={!totalCost || parseFloat(totalCost) <= 0}
              className="h-10"
            >
              {isEditing ? 'Update' : 'Calculate'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {rooms} room{rooms > 1 ? 's' : ''} for {adults} adult{adults > 1 ? 's' : ''}{children > 0 ? ` and ${children} child${children > 1 ? 'ren' : ''}` : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

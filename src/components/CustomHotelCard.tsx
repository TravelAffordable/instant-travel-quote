import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hotel, Bed, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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
  const [selectedMealPlan, setSelectedMealPlan] = useState<string>('none');

  // Populate with initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      const details = [
        initialData.hotelTier,
        initialData.recommendation,
        initialData.roomType,
        initialData.bedConfig,
        initialData.stayDetails,
      ].filter(Boolean).join('\n');
      setHotelDetails(details);
      setTotalCost(initialData.totalCost?.toString() || '');
      setParsedDetails(initialData);
      // Set meal plan from initial data
      if (initialData.mealPlan) {
        const mealLower = initialData.mealPlan.toLowerCase();
        if (mealLower.includes('full board') || mealLower.includes('all meals')) {
          setSelectedMealPlan('full-board');
        } else if (mealLower.includes('half board')) {
          setSelectedMealPlan('half-board');
        } else if (mealLower.includes('dinner')) {
          setSelectedMealPlan('dinner');
        } else if (mealLower.includes('lunch')) {
          setSelectedMealPlan('lunch');
        } else if (mealLower.includes('breakfast')) {
          setSelectedMealPlan('breakfast');
        } else {
          setSelectedMealPlan('none');
        }
      }
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
      
      // Skip meal plan detection from text - we now use dropdown
      
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

  const getMealPlanLabel = (value: string): string | undefined => {
    const labels: Record<string, string> = {
      'none': undefined as unknown as string,
      'breakfast': 'Breakfast included',
      'lunch': 'Lunch included',
      'dinner': 'Dinner included',
      'half-board': 'Half Board (Breakfast & Dinner)',
      'full-board': 'Full Board (All Meals)'
    };
    return labels[value];
  };

  const handleCalculate = () => {
    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost <= 0) return;
    
    setCalculated(true);
    
    // Get meal plan label if selected
    const mealPlanLabel = getMealPlanLabel(selectedMealPlan);
    
    onCalculate({
      hotelName,
      hotelTier: parsedDetails.hotelTier,
      recommendation: parsedDetails.recommendation,
      roomType: parsedDetails.roomType,
      bedConfig: parsedDetails.bedConfig,
      mealPlan: mealPlanLabel,
      stayDetails: parsedDetails.stayDetails || `${nights} night${nights > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
      totalCost: cost,
    });
  };

  const handleBeatPrice = () => {
    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Please enter a price first",
        description: "Enter the total cost and calculate your quote before requesting a price beat.",
        variant: "destructive"
      });
      return;
    }

    const mealPlanLabel = getMealPlanLabel(selectedMealPlan) || 'No meals included';
    const stayDetails = parsedDetails.stayDetails || `${nights} night${nights > 1 ? 's' : ''}, ${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`;
    
    const subject = encodeURIComponent(`Beat My Quote Request - ${hotelName}`);
    const body = encodeURIComponent(
`Hi Travel Affordable,

I would like you to beat the following quote:

Hotel: ${hotelName}
${parsedDetails.hotelTier ? `Tier: ${parsedDetails.hotelTier}\n` : ''}${parsedDetails.roomType ? `Room Type: ${parsedDetails.roomType}\n` : ''}${parsedDetails.bedConfig ? `Bed Config: ${parsedDetails.bedConfig}\n` : ''}Stay Details: ${stayDetails}
Meal Plan: ${mealPlanLabel}
Current Quote: R${cost.toLocaleString()}

Please let me know the discounted amount for accommodation and fun activities.

Thank you!`
    );

    window.open(`mailto:info@travelaffordable.co.za?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Request sent!",
      description: "Your email client should open with your beat-the-price request.",
    });
  };

  return (
    <Card className="border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Instructional Text */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> If you have a hotel that you like that is not on our system or on Hotelbeds, please put the hotel name (if it's not listed under custom hotels), put the room type and number of people and kids, then put the rate, choose the meal plan if your rate includes breakfast or other meal plan. Calculate the package cost by clicking on the Calculate button. Once you have the quote, click on "Let's see if you can beat this price" button — we will beat the price and send you the total discounted amount on your getaway including accommodation and fun activities.
          </p>
        </div>

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
              Paste hotel details (room type, bed config, price, etc.)
            </Label>
            <Textarea
              id={`details-${hotelName}`}
              placeholder={`Example:\nBeachfront\nRecommended for your group\nDeluxe Quadruple Room 2 Bedroom Apartment\nMultiple bed types • Free crib available\n3 nights, 3 adults, 2 children\nZAR 12,370`}
              value={hotelDetails}
              onChange={(e) => handleDetailsChange(e.target.value)}
              className="mt-1 min-h-[120px] text-sm"
            />
          </div>

          {/* Parsed Preview */}
          {(parsedDetails.hotelTier || parsedDetails.roomType || parsedDetails.bedConfig) && (
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
              {parsedDetails.stayDetails && (
                <p className="text-muted-foreground text-xs">{parsedDetails.stayDetails}</p>
              )}
            </div>
          )}

          {/* Meal Plan Dropdown */}
          <div>
            <Label className="text-sm text-muted-foreground">Meal Plan</Label>
            <Select value={selectedMealPlan} onValueChange={setSelectedMealPlan}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select meal plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No meals included</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="half-board">Half Board (Breakfast & Dinner)</SelectItem>
                <SelectItem value="full-board">Full Board (All Meals)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Cost Input */}
          <div>
            <Label htmlFor={`cost-${hotelName}`} className="text-sm text-muted-foreground">
              Total Stay Cost (ZAR)
            </Label>
            <Input
              id={`cost-${hotelName}`}
              type="number"
              placeholder="Enter total accommodation cost"
              value={totalCost}
              onChange={(e) => {
                setTotalCost(e.target.value);
                setCalculated(false);
              }}
              className="mt-1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleCalculate} 
              disabled={!totalCost || parseFloat(totalCost) <= 0}
              className="flex-1"
            >
              {isEditing ? 'Update Quote' : 'Calculate'}
            </Button>
            {isEditing && onCancelEdit && (
              <Button variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>

          {/* Beat This Price Button */}
          {calculated && (
            <Button 
              onClick={handleBeatPrice}
              variant="outline"
              className="w-full mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Let's see if you can beat this price
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

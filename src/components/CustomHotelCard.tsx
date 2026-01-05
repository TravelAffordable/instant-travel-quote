import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hotel, Send, Plus, Trash2 } from 'lucide-react';
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

interface CustomHotelEntry {
  id: string;
  hotelName: string;
  roomType: string;
  numberOfPeople: string;
  rate: string;
  mealPlan: string;
  calculated: boolean;
}

interface CustomHotelCardProps {
  hotelName?: string;
  rooms: number;
  adults: number;
  children?: number;
  nights?: number;
  onCalculate: (details: CustomHotelDetails) => void;
  initialData?: Partial<CustomHotelDetails>;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export function CustomHotelCard({ rooms, adults, children = 0, nights = 1, onCalculate, initialData, isEditing, onCancelEdit }: CustomHotelCardProps) {
  const [entries, setEntries] = useState<CustomHotelEntry[]>([
    {
      id: crypto.randomUUID(),
      hotelName: initialData?.hotelName || '',
      roomType: initialData?.roomType || '',
      numberOfPeople: initialData?.stayDetails || `${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
      rate: initialData?.totalCost?.toString() || '',
      mealPlan: 'none',
      calculated: false,
    }
  ]);

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

  const updateEntry = (id: string, field: keyof CustomHotelEntry, value: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, [field]: value, calculated: false }
        : entry
    ));
  };

  const addNewEntry = () => {
    setEntries(prev => [...prev, {
      id: crypto.randomUUID(),
      hotelName: '',
      roomType: '',
      numberOfPeople: `${adults} adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
      rate: '',
      mealPlan: 'none',
      calculated: false,
    }]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleCalculate = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;
    
    const cost = parseFloat(entry.rate);
    if (isNaN(cost) || cost <= 0 || !entry.hotelName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a hotel name and rate.",
        variant: "destructive"
      });
      return;
    }
    
    setEntries(prev => prev.map(e => 
      e.id === entryId ? { ...e, calculated: true } : e
    ));
    
    const mealPlanLabel = getMealPlanLabel(entry.mealPlan);
    
    onCalculate({
      hotelName: entry.hotelName,
      roomType: entry.roomType,
      mealPlan: mealPlanLabel,
      stayDetails: `${nights} night${nights > 1 ? 's' : ''}, ${entry.numberOfPeople}`,
      totalCost: cost,
    });
  };

  const handleBeatPrice = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const cost = parseFloat(entry.rate);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Please enter a price first",
        description: "Enter the rate and calculate your quote before requesting a price beat.",
        variant: "destructive"
      });
      return;
    }

    const mealPlanLabel = getMealPlanLabel(entry.mealPlan) || 'No meals included';
    const stayDetails = `${nights} night${nights > 1 ? 's' : ''}, ${entry.numberOfPeople}`;
    
    const subject = encodeURIComponent(`Beat My Quote Request - ${entry.hotelName}`);
    const body = encodeURIComponent(
`Hi Travel Affordable,

I would like you to beat the following quote:

Hotel: ${entry.hotelName}
Room Type: ${entry.roomType || 'Not specified'}
Stay Details: ${stayDetails}
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

        {/* Hotel Entries */}
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="border border-border rounded-lg p-4 relative">
              {entries.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEntry(entry.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Hotel className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Custom Hotel {entries.length > 1 ? `#${index + 1}` : ''}
                  </span>
                  {entry.calculated && entry.rate && (
                    <p className="text-xl font-bold text-primary mt-1">
                      {formatCurrency(parseFloat(entry.rate))}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Hotel Name */}
                <div>
                  <Label className="text-sm text-muted-foreground">Hotel Name</Label>
                  <Input
                    placeholder="Enter hotel name"
                    value={entry.hotelName}
                    onChange={(e) => updateEntry(entry.id, 'hotelName', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <Label className="text-sm text-muted-foreground">Type of room</Label>
                  <Input
                    placeholder="e.g., Deluxe Double Room, Family Suite"
                    value={entry.roomType}
                    onChange={(e) => updateEntry(entry.id, 'roomType', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Number of People */}
                <div>
                  <Label className="text-sm text-muted-foreground">For how many people:</Label>
                  <Input
                    placeholder="e.g., 2 adults, 1 child"
                    value={entry.numberOfPeople}
                    onChange={(e) => updateEntry(entry.id, 'numberOfPeople', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Rate */}
                <div>
                  <Label className="text-sm text-muted-foreground">How much: (ZAR)</Label>
                  <Input
                    type="number"
                    placeholder="Enter the total rate quoted to you"
                    value={entry.rate}
                    onChange={(e) => updateEntry(entry.id, 'rate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Meal Plan Dropdown */}
                <div>
                  <Label className="text-sm text-muted-foreground">Meal Plan</Label>
                  <Select 
                    value={entry.mealPlan} 
                    onValueChange={(value) => updateEntry(entry.id, 'mealPlan', value)}
                  >
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

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => handleCalculate(entry.id)} 
                    disabled={!entry.rate || parseFloat(entry.rate) <= 0 || !entry.hotelName.trim()}
                    className="flex-1"
                  >
                    {isEditing ? 'Update Quote' : 'Calculate'}
                  </Button>
                  {isEditing && onCancelEdit && index === 0 && (
                    <Button variant="outline" onClick={onCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>

                {/* Beat This Price Button */}
                {entry.calculated && (
                  <Button 
                    onClick={() => handleBeatPrice(entry.id)}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Let's see if you can beat this price
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Hotel Button */}
        <Button
          variant="outline"
          onClick={addNewEntry}
          className="w-full mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add another custom hotel
        </Button>
      </CardContent>
    </Card>
  );
}

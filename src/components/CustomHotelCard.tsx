import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Star, Hotel } from 'lucide-react';

interface CustomHotelCardProps {
  hotelName: string;
  rooms: number;
  adults: number;
  onCalculate: (hotelName: string, totalCost: number) => void;
}

export function CustomHotelCard({ hotelName, rooms, adults, onCalculate }: CustomHotelCardProps) {
  const [totalCost, setTotalCost] = useState<string>('');
  const [calculated, setCalculated] = useState(false);
  const [finalCost, setFinalCost] = useState(0);

  const handleCalculate = () => {
    const cost = parseFloat(totalCost);
    if (isNaN(cost) || cost <= 0) return;
    setFinalCost(cost);
    setCalculated(true);
    onCalculate(hotelName, cost);
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
              <div className="flex">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Custom Quote</span>
            </div>
          </div>
          {calculated && (
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                R{finalCost.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">total stay</p>
            </div>
          )}
        </div>

        {/* Cost Input */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor={`cost-${hotelName}`} className="text-sm text-muted-foreground">
                Enter total accommodation cost for this hotel
              </Label>
              <Input
                id={`cost-${hotelName}`}
                type="number"
                placeholder="e.g. 5000"
                value={totalCost}
                onChange={(e) => {
                  setTotalCost(e.target.value);
                  setCalculated(false);
                }}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleCalculate}
              disabled={!totalCost || parseFloat(totalCost) <= 0}
              className="h-10"
            >
              Calculate
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {rooms} room{rooms > 1 ? 's' : ''} for {adults} adult{adults > 1 ? 's' : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Check, X, BedDouble, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, roundToNearest10 } from '@/lib/utils';

export interface InlineHotelQuoteProps {
  hotelName: string;
  roomType?: string;
  destinationName: string;
  nights: number;
  rooms: number;
  guestsLabel: string;
  mealLabel?: string;
  total: number;
  perPerson: number;
  inclusions: string[];
  selected?: boolean;
  onRequestQuote: () => void;
  onClose?: () => void;
}

const rand = (amount: number) => `R${roundToNearest10(amount).toLocaleString('en-ZA')}`;

export function InlineHotelQuote({
  hotelName,
  roomType,
  destinationName,
  nights,
  rooms,
  guestsLabel,
  mealLabel,
  total,
  perPerson,
  inclusions,
  selected = false,
  onRequestQuote,
  onClose,
}: InlineHotelQuoteProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl md:col-span-2',
        selected ? 'border-t-4 border-t-primary ring-2 ring-primary/40' : 'ring-1 ring-border',
      )}
    >
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-primary">
              {hotelName}
              {roomType ? ` — ${roomType}` : ''}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{destinationName}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-primary" />
                {nights} night{nights === 1 ? '' : 's'}
                {rooms > 1 ? `, ${rooms} rooms` : ''}
              </span>
              {mealLabel && (
                <span className="flex items-center gap-1">
                  <Utensils className="h-3.5 w-3.5 text-primary" />
                  {mealLabel}
                </span>
              )}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close this quote"
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <h4 className="font-display text-base font-bold text-primary">
              Your {destinationName} getaway at {hotelName}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">{guestsLabel}</p>

            <div className="mt-4 rounded-xl border border-border bg-muted/40 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Your complete getaway package
              </p>
              <p className="mt-2">
                <span className="font-display text-3xl font-bold text-primary">{rand(total)}</span>{' '}
                <span className="text-sm text-muted-foreground">total</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{rand(perPerson)} per person</p>
            </div>

            <Button size="lg" className="mt-4 w-full whitespace-normal leading-snug" onClick={onRequestQuote}>
              Request Final Discounted Quote For Your Getaway
            </Button>
          </div>

          <div className="rounded-xl bg-primary/5 p-5">
            <h4 className="font-semibold text-primary">What's included</h4>
            <ul className="mt-3 space-y-2 text-sm text-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  Accommodation at {hotelName} — {nights} night{nights === 1 ? '' : 's'}
                </span>
              </li>
              {inclusions.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

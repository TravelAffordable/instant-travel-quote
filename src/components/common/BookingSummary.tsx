import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { roundToNearest10 } from '@/lib/utils';

export interface BookingSummaryProps {
  destinationName: string;
  packageTitle?: string;
  dates?: string;
  travellers: string;
  accommodationName?: string;
  roomsLabel?: string;
  packageTotal: number;
  accommodationTotal: number;
  extrasTotal?: number;
  childPriceOnRequest?: boolean;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  onRequestFinalQuote?: () => void;
  requestFinalQuoteDisabled?: boolean;
}


function rand(amount: number) {
  return `R${roundToNearest10(amount).toLocaleString('en-ZA')}`;
}

export function BookingSummary({
  destinationName,
  packageTitle,
  dates,
  travellers,
  accommodationName,
  roomsLabel,
  packageTotal,
  accommodationTotal,
  extrasTotal = 0,
  childPriceOnRequest,
  onConfirm,
  confirmDisabled,
}: BookingSummaryProps) {
  const total = packageTotal + accommodationTotal + extrasTotal;

  return (
    <Card className="rounded-2xl border-border/70 shadow-md">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your holiday</p>
          <h3 className="font-display text-xl font-bold text-foreground">{destinationName}</h3>
          {packageTitle && <p className="mt-1 text-sm text-muted-foreground">{packageTitle}</p>}
        </div>

        <dl className="space-y-1 text-sm">
          {dates && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Dates</dt>
              <dd className="text-right font-medium text-foreground">{dates}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Travellers</dt>
            <dd className="text-right font-medium text-foreground">{travellers}</dd>
          </div>
          {accommodationName && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Accommodation</dt>
              <dd className="text-right font-medium text-foreground">{accommodationName}</dd>
            </div>
          )}
          {roomsLabel && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Rooms</dt>
              <dd className="text-right font-medium text-foreground">{roomsLabel}</dd>
            </div>
          )}
        </dl>

        <div className="flex items-end justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-foreground">Complete holiday price</span>
          <span className="font-display text-2xl font-bold text-sunset">{rand(total)}</span>
        </div>

        {onConfirm && (
          <Button
            size="lg"
            className="w-full"
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            Request to confirm your booking
          </Button>
        )}

        {childPriceOnRequest && (
          <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
            Children's pricing for this experience is confirmed by our team — we'll include it with your
            booking confirmation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

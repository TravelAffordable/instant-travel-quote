import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  confirmLabel?: string;
  confirmDisabled?: boolean;
  onRequestFinalQuote?: () => void;
  requestFinalQuoteDisabled?: boolean;
}


export function BookingSummary({
  destinationName,
  packageTitle,
  dates,
  travellers,
  accommodationName,
  roomsLabel,
  childPriceOnRequest,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  onRequestFinalQuote,
  requestFinalQuoteDisabled,
}: BookingSummaryProps) {
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

        {onRequestFinalQuote && (
          <Button
            size="lg"
            className="w-full"
            disabled={requestFinalQuoteDisabled}
            onClick={onRequestFinalQuote}
          >
            Request Final quote for your getaway
          </Button>
        )}



        {onConfirm && (
          <Button
            size="lg"
            className="w-full"
            disabled={confirmDisabled}
            onClick={onConfirm}
          >
            {confirmLabel ?? 'Request to confirm your booking'}
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

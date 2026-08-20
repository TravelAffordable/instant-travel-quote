import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  PRETORIUSKOP_MONTHS,
  PRETORIUSKOP_NIGHTLY_RATE,
  getDaysInMonth,
  getMonthLabel,
  getMonthStartWeekday,
  getUnitsForDate,
} from '@/data/krugerAvailability';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const KrugerAvailabilityCalendar = () => {
  const [index, setIndex] = useState(0);
  const month = PRETORIUSKOP_MONTHS[index];
  const days = getDaysInMonth(month);
  const leadingBlanks = getMonthStartWeekday(month);
  const monthHasAvailability = Array.from({ length: days }, (_, i) => getUnitsForDate(month, i + 1)).some((u) => u > 0);

  return (
    <Card className="mt-4 text-left">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Previous month"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="font-['Anton'] text-sm uppercase tracking-wide text-navy">
            {getMonthLabel(month)}
          </p>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Next month"
            disabled={index === PRETORIUSKOP_MONTHS.length - 1}
            onClick={() => setIndex((i) => Math.min(PRETORIUSKOP_MONTHS.length - 1, i + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-center text-[11px] text-navy/70">
          Pretoriuskop Rest Camp — Hut (EB2) · {formatCurrency(PRETORIUSKOP_NIGHTLY_RATE)} per room per night incl. conservation &amp; community fees
        </p>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <span key={d} className="text-[10px] font-semibold uppercase text-navy/60">
              {d}
            </span>
          ))}
          {Array.from({ length: leadingBlanks }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1;
            const units = getUnitsForDate(month, day);
            const available = units > 0;
            return (
              <div
                key={day}
                className={`rounded-md border p-1 ${
                  available ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/60'
                }`}
                title={available ? `${units} unit(s) available` : 'No availability'}
              >
                <span className="block text-[10px] text-navy/60">{day}</span>
                <span
                  className={`block text-[10px] font-bold leading-tight ${
                    available ? 'text-primary' : 'text-navy/40'
                  }`}
                >
                  {available ? `R${PRETORIUSKOP_NIGHTLY_RATE}` : 'Sold out'}
                </span>
              </div>
            );
          })}
        </div>

        {!monthHasAvailability && (
          <p className="mt-3 text-center text-xs font-semibold text-destructive">
            No availability for {getMonthLabel(month)}. Please choose another month.
          </p>
        )}
        <p className="mt-3 text-center text-[11px] text-navy/70">
          Dates marked “Sold out” have no availability. Rates are per hut per night and include
          conservation and community fees.
        </p>
      </CardContent>
    </Card>
  );
};

import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  clearTripDetails,
  fromDateString,
  isTripComplete,
  saveTripDetails,
  toDateString,
  useTripDetails,
} from '@/lib/tripDetails';

const MAX_ADULTS = 30;
const MAX_CHILDREN = 12;

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      <div className="flex h-12 items-center justify-between rounded-xl border border-border bg-background px-3">
        <Users className="h-4 w-4 text-primary" />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label={`Fewer ${label.toLowerCase()}`}
            onClick={() => onChange(Math.max(min, value - 1))}
          >
            –
          </Button>
          <span className="w-6 text-center font-semibold">{value}</span>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label={`More ${label.toLowerCase()}`}
            onClick={() => onChange(Math.min(max, value + 1))}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Trip search at the top of a destination page. Searching saves the details so
 * every package on the page (and on any other destination page) can show the
 * cheapest total for the whole group, and the booking steps don't ask again.
 */
export function TripSearchForm() {
  const saved = useTripDetails();
  const searched = isTripComplete(saved);

  const [checkIn, setCheckIn] = useState<Date | undefined>(fromDateString(saved.checkIn));
  const [checkOut, setCheckOut] = useState<Date | undefined>(fromDateString(saved.checkOut));
  const [adults, setAdults] = useState(saved.adults);
  const [childAges, setChildAges] = useState<number[]>(saved.childAges);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [error, setError] = useState('');

  // Keep the form in step with the saved details (for example after "Clear").
  useEffect(() => {
    setCheckIn(fromDateString(saved.checkIn));
    setCheckOut(fromDateString(saved.checkOut));
    setAdults(saved.adults);
    setChildAges(saved.childAges);
  }, [saved]);

  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const setChildCount = (count: number) =>
    setChildAges((ages) =>
      count <= ages.length ? ages.slice(0, count) : [...ages, ...Array.from({ length: count - ages.length }, () => 5)],
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      setError('Please choose your check-in and check-out dates.');
      return;
    }
    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setError('');
    saveTripDetails({ checkIn: toDateString(checkIn), checkOut: toDateString(checkOut), adults, childAges });
  };

  const clear = () => {
    setError('');
    clearTripDetails();
  };

  return (
    <section className="container mx-auto px-4 pt-8">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-border/60 bg-card/95 p-5 shadow-lg md:p-6"
        aria-label="Search holiday prices for your group"
      >
        <h2 className="font-display text-2xl font-bold text-navy">When are you travelling, and who is coming?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your details once and every package shows the cheapest total price for your whole group.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-in</Label>
            <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-12 w-full justify-start rounded-xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {checkIn ? format(checkIn, 'd MMM yyyy') : 'Add date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  defaultMonth={checkIn}
                  disabled={{ before: today }}
                  onSelect={(d) => {
                    setCheckIn(d);
                    if (d) {
                      if (!checkOut || checkOut <= d) setCheckOut(addDays(d, 1));
                      setCheckInOpen(false);
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Check-out</Label>
            <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="h-12 w-full justify-start rounded-xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {checkOut ? format(checkOut, 'd MMM yyyy') : 'Add date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  defaultMonth={checkOut ?? (checkIn ? addDays(checkIn, 1) : undefined)}
                  disabled={{ before: checkIn ? addDays(checkIn, 1) : today }}
                  onSelect={(d) => {
                    setCheckOut(d);
                    if (d) setCheckOutOpen(false);
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <Stepper label="Adults" value={adults} min={1} max={MAX_ADULTS} onChange={setAdults} />
          <Stepper label="Children" value={childAges.length} min={0} max={MAX_CHILDREN} onChange={setChildCount} />
        </div>

        {childAges.length > 0 && (
          <div className="mt-4">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Children's ages
            </Label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {childAges.map((age, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-xs text-muted-foreground">Child {i + 1}</span>
                  <Select
                    value={String(age)}
                    onValueChange={(v) => setChildAges((ages) => ages.map((a, idx) => (idx === i ? Number(v) : a)))}
                  >
                    <SelectTrigger className="h-10 rounded-xl" aria-label={`Age of child ${i + 1}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {Array.from({ length: 18 }, (_, n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n === 0 ? 'Under 1' : `${n} year${n === 1 ? '' : 's'}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" className="rounded-xl px-8">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          {searched && (
            <Button type="button" variant="ghost" onClick={clear}>
              Clear my details
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

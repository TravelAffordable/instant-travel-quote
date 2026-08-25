import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { cn } from '@/lib/utils';

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-5 py-4', className)}>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export function GetawaySearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const search = () => {
    const target = slug || 'durban';
    const dest = catalogueDestinations.find((d) => d.slug === target);
    const qs = new URLSearchParams();
    if (checkIn) qs.set('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) qs.set('checkOut', format(checkOut, 'yyyy-MM-dd'));
    qs.set('adults', String(adults));
    qs.set('children', String(children));
    navigate(`/destinations/${target}?${qs.toString()}`);
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-card/97 shadow-[var(--shadow-premium)] backdrop-blur',
        className,
      )}
    >
      <p className="border-b border-border px-5 pt-5 pb-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-burgundy">
        Where do you want to go?
      </p>

      <div className="grid divide-y divide-border md:grid-cols-[1.3fr_1fr_1fr_1.1fr_auto] md:divide-x md:divide-y-0">
        <Field label="Destination">
          <Popover>
            <PopoverTrigger className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground">
              <span className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 shrink-0 text-burgundy" />
                {slug ? catalogueDestinations.find((d) => d.slug === slug)?.name : 'Choose destination'}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent align="start" className="max-h-72 w-64 overflow-y-auto p-2">
              {catalogueDestinations.map((d) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => setSlug(d.slug)}
                  className={cn(
                    'block w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted',
                    slug === d.slug && 'bg-muted font-semibold',
                  )}
                >
                  {d.name}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Check-in">
          <Popover>
            <PopoverTrigger className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground">
              {checkIn ? format(checkIn, 'd MMM yyyy') : <span className="text-muted-foreground">Select date</span>}
              <CalendarIcon className="h-4 w-4 shrink-0 text-burgundy" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Check-out">
          <Popover>
            <PopoverTrigger className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground">
              {checkOut ? format(checkOut, 'd MMM yyyy') : <span className="text-muted-foreground">Select date</span>}
              <CalendarIcon className="h-4 w-4 shrink-0 text-burgundy" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={checkIn ? { before: checkIn } : undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </Field>

        <Field label="Travellers">
          <Popover>
            <PopoverTrigger className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground">
              {adults} Adult{adults === 1 ? '' : 's'} · {children} Child{children === 1 ? '' : 'ren'}
              <User className="h-4 w-4 shrink-0 text-burgundy" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 space-y-3 p-4">
              {[
                { label: 'Adults', value: adults, set: setAdults, min: 1 },
                { label: 'Children', value: children, set: setChildren, min: 0 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full"
                      onClick={() => row.set(Math.max(row.min, row.value - 1))}
                    >
                      –
                    </Button>
                    <span className="w-5 text-center font-semibold">{row.value}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full"
                      onClick={() => row.set(Math.min(30, row.value + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </Field>

        <div className="p-3 md:p-4">
          <Button
            onClick={search}
            className="h-14 w-full rounded-xl bg-burgundy px-8 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white hover:bg-burgundy-dark md:h-full"
          >
            Search getaways
          </Button>
        </div>
      </div>
    </div>
  );
}

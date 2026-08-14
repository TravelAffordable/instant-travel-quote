import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Search, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { getPackagesByDestination } from '@/data/travelData';
import { cn } from '@/lib/utils';

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          –
        </Button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function HolidaySearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>('');
  const [packageId, setPackageId] = useState<string>('');
  const [oneDay, setOneDay] = useState(false);
  const [tourDate, setTourDate] = useState<Date>();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [infants, setInfants] = useState(0);
  const [kids, setKids] = useState(0);
  const [teens, setTeens] = useState(0);

  const selected = catalogueDestinations.find((d) => d.slug === destination);
  const packages = useMemo(
    () => (selected?.destinationId ? getPackagesByDestination(selected.destinationId) : []),
    [selected?.destinationId],
  );

  const travellersLabel = `${adults} adult${adults === 1 ? '' : 's'}${
    infants + kids + teens > 0 ? `, ${infants + kids + teens} children` : ''
  }`;

  const submit = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (packageId) params.set('package', packageId);
    params.set('adults', String(adults));
    params.set('c02', String(infants));
    params.set('c312', String(kids));
    params.set('c1317', String(teens));
    if (oneDay) {
      params.set('oneDay', '1');
      if (tourDate) params.set('date', tourDate.toISOString().slice(0, 10));
    } else {
      if (checkIn) params.set('checkIn', checkIn.toISOString().slice(0, 10));
      if (checkOut) params.set('checkOut', checkOut.toISOString().slice(0, 10));
    }
    navigate(`/book?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        'rounded-3xl border border-border/60 bg-card/95 p-5 shadow-lg backdrop-blur md:p-6',
        className,
      )}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Destination */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Where to?
          </Label>
          <Select
            value={destination}
            onValueChange={(v) => {
              setDestination(v);
              setPackageId('');
            }}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <span className="flex items-center gap-2 truncate">
                <MapPin className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Choose a destination" />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {catalogueDestinations.map((d) => (
                <SelectItem key={d.slug} value={d.slug}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Experience
          </Label>
          <Select value={packageId} onValueChange={setPackageId} disabled={!packages.length}>
            <SelectTrigger className="h-12 rounded-xl">
              <span className="flex items-center gap-2 truncate">
                <Sparkles className="h-4 w-4 text-primary" />
                <SelectValue
                  placeholder={packages.length ? 'Choose an experience' : 'Any experience'}
                />
              </span>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {packages.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.shortName || p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dates */}
        {oneDay ? (
          <div className="space-y-1.5 lg:col-span-1">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tour date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 w-full justify-start rounded-xl font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {tourDate ? format(tourDate, 'd MMM yyyy') : 'Select your day'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={tourDate} onSelect={setTourDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:col-span-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Check-in
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 w-full justify-start rounded-xl px-3 font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{checkIn ? format(checkIn, 'd MMM') : 'Add date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Check-out
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-12 w-full justify-start rounded-xl px-3 font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{checkOut ? format(checkOut, 'd MMM') : 'Add date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={checkIn ? { before: checkIn } : undefined}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Travellers */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Travellers
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-12 w-full justify-start rounded-xl font-normal">
                <Users className="mr-2 h-4 w-4 text-primary" />
                <span className="truncate">{travellersLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 space-y-3 p-4" align="end">
              <NumberField label="Adults" value={adults} onChange={setAdults} min={1} />
              <NumberField label="Children 0–2 (free)" value={infants} onChange={setInfants} />
              <NumberField label="Children 3–12" value={kids} onChange={setKids} />
              <NumberField label="Children 13–17" value={teens} onChange={setTeens} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <Checkbox checked={oneDay} onCheckedChange={(v) => setOneDay(Boolean(v))} />
          I'd like to do this experience for 1 day
        </label>
        <Button size="lg" className="h-12 rounded-xl px-8 text-base" onClick={submit}>
          <Search className="mr-2 h-4 w-4" /> Show my holiday price
        </Button>
      </div>
    </div>
  );
}

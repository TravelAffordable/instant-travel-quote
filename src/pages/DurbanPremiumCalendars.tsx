import { useEffect, useMemo, useState } from 'react';
import { addDays, endOfMonth, format, isSameMonth, isToday, parse, startOfMonth, startOfWeek } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const HOTEL_OPTIONS = [
  { key: 'blue-waters', label: 'Blue Waters Hotel' },
  { key: 'garden-court-south-beach', label: 'Garden Court South Beach' },
  { key: 'the-edward', label: 'The Edward' },
] as const;

type HotelKey = (typeof HOTEL_OPTIONS)[number]['key'];

type WeekendRate = {
  available: boolean;
  checkIn: string;
  checkOut: string;
  currency: string;
  displayNightlyRate: number | null;
  maxPeople: number | null;
  note: string | null;
  partyNightlyRate: number | null;
  ratePerNight: number | null;
  requiredRooms: number;
  roomMode: 'single_room' | 'multiple_rooms' | null;
  roomName: string | null;
  sourceUrl: string;
  totalPrice: number | null;
};

type CalendarResponse = {
  generatedAt: string;
  hotelKey: HotelKey;
  hotelName: string;
  month: string;
  weekendsByOccupancy: {
    '2_sleeper': WeekendRate[];
    '4_sleeper': WeekendRate[];
  };
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const minMonth = '2026-03';
const maxMonth = '2027-02';

function getDefaultMonth() {
  return '2026-03';
}

function formatCurrency(value: number | null, currency = 'ZAR') {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-ZA', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function buildMonthGrid(month: string) {
  const monthDate = parse(`${month}-01`, 'yyyy-MM-dd', new Date());
  const firstCell = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const lastDay = endOfMonth(monthDate);
  const weeks: Date[][] = [];

  let cursor = firstCell;
  while (cursor <= lastDay || weeks.length < 5) {
    const week = Array.from({ length: 7 }, (_, index) => addDays(cursor, index));
    weeks.push(week);
    cursor = addDays(cursor, 7);
    if (weeks.length > 6) break;
  }

  return weeks;
}

function WeekendCalendar({
  month,
  weekends,
  title,
}: {
  month: string;
  title: string;
  weekends: WeekendRate[];
}) {
  const weekendMap = useMemo(
    () => new Map(weekends.map((weekend) => [weekend.checkIn, weekend])),
    [weekends],
  );
  const monthDate = parse(`${month}-01`, 'yyyy-MM-dd', new Date());
  const weeks = useMemo(() => buildMonthGrid(month), [month]);

  return (
    <Card className="border-border/70 bg-card/80 shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-display">{title}</CardTitle>
        <CardDescription>
          Friday cells show live Booking.com weekend results for {format(monthDate, 'MMMM yyyy')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>

        <div className="mt-2 space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={`${month}-${weekIndex}`} className="grid grid-cols-7 gap-2">
              {week.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const weekend = weekendMap.get(dayKey);
                const inMonth = isSameMonth(day, monthDate);
                const isFriday = format(day, 'EEE') === 'Fri';

                return (
                  <div
                    key={dayKey}
                    className={[
                      'min-h-28 rounded-lg border p-2 text-left transition-colors',
                      inMonth ? 'border-border bg-background/70' : 'border-border/50 bg-muted/30 text-muted-foreground/60',
                      isFriday && weekend?.available ? 'border-primary/30 bg-primary/5' : '',
                      isFriday && weekend && !weekend.available ? 'border-destructive/30 bg-destructive/5' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={isToday(day) ? 'rounded-full bg-accent px-2 py-0.5 text-accent-foreground' : ''}>
                        {format(day, 'd')}
                      </span>
                      {isFriday && inMonth ? <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Weekend</span> : null}
                    </div>

                    {isFriday && weekend ? (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                          {weekend.available ? formatCurrency(weekend.displayNightlyRate, weekend.currency) : 'Unavailable'}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {weekend.roomName || 'No matching room scraped'}
                        </p>
                        {weekend.note ? (
                          <p className={weekend.available ? 'text-[11px] text-accent' : 'text-[11px] text-destructive'}>
                            {weekend.note}
                          </p>
                        ) : null}
                        <a
                          className="inline-flex text-[11px] font-medium text-primary underline-offset-4 hover:underline"
                          href={weekend.sourceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          View source
                        </a>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const DurbanPremiumCalendars = () => {
  const [selectedHotel, setSelectedHotel] = useState<HotelKey>('blue-waters');
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [data, setData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCalendar = async () => {
      setLoading(true);
      setError(null);

      const { data: response, error: invokeError } = await supabase.functions.invoke('booking-weekend-calendar', {
        body: {
          hotelKey: selectedHotel,
          month: selectedMonth,
        },
      });

      if (!active) return;

      if (invokeError) {
        setError(invokeError.message);
        setData(null);
        setLoading(false);
        return;
      }

      const typed = response as CalendarResponse | { error?: string } | null;
      if (!typed || ('error' in typed && typed.error)) {
        setError(('error' in (typed || {}) ? typed?.error : undefined) || 'Failed to load Booking.com weekend calendar.');
        setData(null);
        setLoading(false);
        return;
      }

      setData(typed as CalendarResponse);
      setLoading(false);
    };

    loadCalendar();
    return () => {
      active = false;
    };
  }, [selectedHotel, selectedMonth]);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-muted/30">
        <div className="container mx-auto px-4 py-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Live Booking.com scrape</p>
          <h1 className="mt-3 text-4xl font-display font-bold text-foreground md:text-5xl">
            Durban Premium Weekend Rate Calendars
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
            View live weekend availability and nightly rates for Durban beachfront premium hotels from the coming weekend through February 2027.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="border-border/70 bg-card/90 shadow-soft">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-display">Premium beachfront hotels</CardTitle>
                <CardDescription>
                  Tabs switch hotels; the month picker lets you browse every weekend through Feb 2027.
                </CardDescription>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="calendar-month">
                  Month
                </label>
                <Input
                  id="calendar-month"
                  max={maxMonth}
                  min={minMonth}
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                />
              </div>
            </div>

            <Tabs value={selectedHotel} onValueChange={(value) => setSelectedHotel(value as HotelKey)}>
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-auto w-max gap-2 bg-muted/70 p-1">
                  {HOTEL_OPTIONS.map((hotel) => (
                    <TabsTrigger key={hotel.key} value={hotel.key} className="px-4 py-2">
                      {hotel.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <div className="rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                Scraping Booking.com weekend data for {HOTEL_OPTIONS.find((hotel) => hotel.key === selectedHotel)?.label}…
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                {error}
              </div>
            ) : data ? (
              <>
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  <p>
                    Last refreshed: <span className="font-medium text-foreground">{new Date(data.generatedAt).toLocaleString()}</span>
                  </p>
                  <p className="mt-1">
                    2-sleeper cards show the best single-room nightly rate for 2 adults. 4-sleeper cards show the best nightly rate for fitting 4 adults, even when Booking.com requires multiple rooms.
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <WeekendCalendar
                    month={selectedMonth}
                    title="2-sleeper weekends"
                    weekends={data.weekendsByOccupancy['2_sleeper']}
                  />
                  <WeekendCalendar
                    month={selectedMonth}
                    title="4-sleeper / 4-adult weekends"
                    weekends={data.weekendsByOccupancy['4_sleeper']}
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default DurbanPremiumCalendars;

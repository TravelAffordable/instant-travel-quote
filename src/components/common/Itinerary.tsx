import type { ItineraryDay } from '@/lib/itinerary';

export function Itinerary({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="space-y-4">
      {days.map((day) => (
        <li key={day.title} className="rounded-2xl border border-border bg-card p-5">
          <h4 className="font-display text-base font-bold text-foreground">{day.title}</h4>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {day.items.filter(Boolean).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

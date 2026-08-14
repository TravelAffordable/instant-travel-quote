import type { Package } from '@/data/travelData';

export interface ItineraryDay {
  title: string;
  items: string[];
}

const EVENING_HINTS = ['dinner', 'evening', 'night', 'sunset', 'cruise dinner', 'casino', 'show'];

function isEvening(activity: string) {
  const a = activity.toLowerCase();
  return EVENING_HINTS.some((hint) => a.includes(hint));
}

function orderDayItems(activities: string[], includeBreakfast: boolean): string[] {
  const daytime = activities.filter((a) => !isEvening(a));
  const evening = activities.filter(isEvening);
  return [...(includeBreakfast ? ['Breakfast at your hotel'] : []), ...daytime, ...evening];
}

/**
 * Build a concise itinerary from package data and the customer's actual stay.
 * One-day experiences get a single-day itinerary; multi-night stays are spread
 * across arrival, experience days and departure.
 */
export function buildItinerary(
  pkg: Package,
  options: { nights: number; oneDay?: boolean; destinationName: string },
): ItineraryDay[] {
  const activities = pkg.activitiesIncluded ?? [];
  const { nights, oneDay, destinationName } = options;

  if (oneDay || nights <= 0) {
    return [
      {
        title: `Your ${destinationName} day experience`,
        items: orderDayItems(activities, false),
      },
    ];
  }

  const days: ItineraryDay[] = [];
  const totalDays = nights + 1;

  // Day 1 — arrival
  days.push({
    title: `Day 1 — Arrive & your ${destinationName} holiday begins`,
    items: ['Check in at your chosen accommodation', 'Settle in and explore nearby', ...activities.filter(isEvening).slice(0, 1)],
  });

  const experienceDays = Math.max(1, totalDays - 2);
  const daytimeActivities = activities.filter((a) => !isEvening(a));
  const eveningActivities = activities.filter(isEvening).slice(1);

  for (let i = 0; i < experienceDays; i++) {
    const slice = daytimeActivities.filter((_, idx) => idx % experienceDays === i);
    const evening = eveningActivities.filter((_, idx) => idx % experienceDays === i);
    days.push({
      title:
        experienceDays === 1
          ? `Day 2 — Experience day`
          : i === experienceDays - 1
            ? `Day ${i + 2} — ${destinationName} your way`
            : `Day ${i + 2} — Experience day`,
      items: orderDayItems([...slice, ...evening], true),
    });
  }

  if (totalDays > 1) {
    days.push({
      title: `Day ${totalDays} — Farewell`,
      items: ['Breakfast at your hotel', 'Last-minute shopping or sightseeing', 'Check out and travel home'],
    });
  }

  return days.slice(0, totalDays);
}

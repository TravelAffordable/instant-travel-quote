import type { Activity } from "@/data/activitiesData";

export interface DealActivity extends Activity {
  /** Alternatives within the same experience cannot be booked together. */
  optionGroup?: string;
  /** Per-vehicle charges scale to cover the selected adult group. */
  vehicleCapacity?: number;
}

const activity = (name: string, adult: number, child: number, freeAge = 0, optionGroup?: string): DealActivity => ({
  name, image: "", rates: { adult, child, freeAge }, optionGroup,
});
const shuttle = (name: string, cost: number, capacity?: number, optionGroup?: string): DealActivity => ({
  ...activity(name, 0, 0), isShuttle: true, shuttleBaseCost: cost,
  vehicleCapacity: capacity, optionGroup,
});

/** Owner-supplied rates from the Durban activity review; hotel deals only. */
export const durbanDealActivities: DealActivity[] = [
  activity("uShaka Marine World — Sea World & Wet ’n Wild combo ticket", 500, 380, 3),
  { ...activity("Isle of Capri — 30 minute harbour cruise", 160, 130, 3, "isle-of-capri"), rates: { adult: 160, child: 130, freeAge: 3, childAgeRange: { min: 3, max: 12 } } },
  { ...activity("Isle of Capri — 1 hour sea cruise", 220, 160, 3, "isle-of-capri"), rates: { adult: 220, child: 160, freeAge: 3, childAgeRange: { min: 3, max: 12 } } },
  activity("60 minute full body massage with hydro facilities and welcome drinks (13+)", 700, 0, 13, "spa"),
  activity("3 hour open top city tour — Ricksha Bus", 150, 80),
  { ...activity("Half-day spa experience with full body massage and drinks", 1200, 500, 0, "spa"), rates: { adult: 1200, child: 500, freeAge: 0, childAgeRange: { min: 6, max: 12 } } },
  { ...activity("Luxury canal boat cruise", 250, 150), rates: { adult: 250, child: 150, freeAge: 0, childAgeRange: { min: 0, max: 12 } } },
  shuttle("Florida Road Cubana outing — return hotel shuttle", 300),
  shuttle("Suncoast Casino outing — return hotel shuttle", 250),
  { ...activity("Moses Mabhida Stadium SkyCar", 180, 120), rates: { adult: 180, child: 120, freeAge: 0, childAgeRange: { min: 0, max: 12 } } },
  shuttle("Hotel to activities shuttle — 4 seater, 3 activities", 400, 4, "activity-shuttle"),
  shuttle("Hotel to activities shuttle — 4 seater, 5 activities", 600, 4, "activity-shuttle"),
  shuttle("Hotel to activities shuttle — 6 seater, 3 activities", 600, 6, "activity-shuttle"),
  shuttle("Hotel to activities shuttle — 6 seater, 5 activities", 800, 6, "activity-shuttle"),
  shuttle("Durban beachfront to Umhlanga Rocks Main Beach — 4 seater return trip", 800, 4, "umhlanga-shuttle"),
  shuttle("Durban beachfront to Umhlanga Rocks Main Beach — 6 seater return trip", 1200, 6, "umhlanga-shuttle"),
];
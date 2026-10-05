import type { DealActivity } from "@/data/durbanDealActivities";

const activity = (name: string, adult: number, child: number): DealActivity => ({
  name, image: "", rates: { adult, child, freeAge: 0 },
});

/** Owner-supplied final per-person rates; hotel deals only, no additional markup.
 * Robben Island and Sunset Champagne Cruise retain existing child rates because
 * the owner supplied only their adult rates in this review. */
export const capeTownDealActivities: DealActivity[] = [
  { ...activity("Robben Island Tour", 450, 250), rates: { adult: 450, child: 250, freeAge: 1, childAgeRange: { min: 5, max: 18 } } },
  { ...activity("Table Mountain Cableway Experience", 550, 270), rates: { adult: 550, child: 270, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
  activity("2 Day Cape Town Sightseeing Tour Bus includes City Tour, Sunset view tour to Signal Hill , Canal Boat Cruise, Walking tour", 700, 470),
  activity("Sunset Champagne Cruise", 980, 350),
  activity("1 Day Cape Town Sightseeing Tour Bus with walking tour", 450, 260),
  activity("Wine Route Tour Paarl, Fraschoek, Stellenbosch", 1000, 750),
  activity("Franshoek Wine Tram with tasting", 880, 650),
  activity("Canal Cruise and Harbour Cruise Combo", 280, 180),
];

export const replacedCapeTownNames = [
  "Robben Island", "Table Mountain Cableway", "2 Days Sightseeing Tour Bus",
  "Sunset Champagne Cruise", "1 Day Sightseeing Tour Bus",
  "Wine Route Tour, Paarl, Franschoek, Stellenbosch", "V&A Waterfront Harbour and Seal Cruise",
];
import type { DealActivity } from "@/data/durbanDealActivities";

const a = (name: string, adult: number, child = adult, freeAge = 0, optionGroup?: string, range?: { min: number; max: number }): DealActivity => ({
  name, image: "", rates: { adult, child, freeAge, ...(range ? { childAgeRange: range } : {}) }, optionGroup,
});
const shuttle = (name: string, cost: number, capacity: number, optionGroup?: string): DealActivity => ({
  ...a(name, 0, 0), isShuttle: true, shuttleBaseCost: cost, vehicleCapacity: capacity, optionGroup,
});

/** Owner-supplied rates (4 Oct 2026 review); markup already included. Hotel deals only. */
export const hartiesDealActivities: DealActivity[] = [
  a("2 hour sunset champagne buffet boat cruise", 700),
  a("2 hour Sunday buffet lunch boat cruise", 700),
  a("Harties Cableway", 400, 260, 4, undefined, { min: 4, max: 13 }),
  a("1 hour horse riding", 400),
  a("1 hour quad biking", 500),
  a("60 minute full body massage with hydro facilities and welcome drinks", 700),
  a("Harties Zoo Animal and Snake Park", 200, 110, 3, undefined, { min: 3, max: 12 }),
  a("Elephant Sanctuary guided elephant interaction", 1700, 700, 4, undefined, { min: 4, max: 14 }),
  a("Upside Down House", 200, 150, 3, undefined, { min: 3, max: 13 }),
  a("Little Paris", 80, 0, 12),
  a("Max jet ski fun", 700),
  a("Wake snake slider ski", 700),
  a("Water tube ride", 700),
];

export const magaliesDealActivities: DealActivity[] = [
  a("Cradle of Mankind — Maropeng / Origins Centre", 200, 150, 6, undefined, { min: 6, max: 11 }),
  a("Game drive in Rhino Lion Park incl. reptile show, Predator World and predator enclosure — 2 hours", 740, 970, 5, "rhino-lion", { min: 5, max: 12 }),
  a("Game drive in Rhino Lion Park incl. reptile show, Predator World and predator enclosure — 3 hours", 1350, 970, 5, "rhino-lion", { min: 5, max: 12 }),
  a("2 hour buffet lunch cruise", 700),
  a("2 hour champagne sunset cruise", 700, 580, 6, undefined, { min: 6, max: 12 }),
  a("60 minute full body massage with hydro facilities and welcome drinks", 700, 0, 0, "spa"),
  a("Half-day spa experience", 1200, 0, 0, "spa"),
  a("60 minute horse riding / horse trail", 400),
  a("Quad biking adventure", 500),
  a("Private romantic picnic setup with champagne", 600),
];

export const sunCityDealActivities: DealActivity[] = [
  a("Valley of the Waves — Sun City day visitor ticket", 520, 410, 3),
  a("The Maze of the Lost City", 0, 0),
  a("2 hour Sunday buffet lunch cruise", 700, 550),
  a("Quad biking", 500),
  shuttle("Shuttle from guesthouse to Sun City and back — 4 seater", 600, 4, "suncity-shuttle"),
  shuttle("Shuttle from guesthouse to Sun City and back — 16 seater", 900, 16, "suncity-shuttle"),
  a("Pilanesberg game drive", 950, 680),
  a("Half-day spa", 950, 600, 4, undefined, { min: 4, max: 12 }),
  a("Segway glides guided tour", 500),
  a("Zip line adventure (Zip 2000)", 1200),
];

/** Old shared-list names replaced by the reviewed rates above. */
export const replacedNorthWestNames = [
  "2 Hour Sunset Champagne Buffet Boat Cruise", "2 Hour Lunchtime Buffet Boat Cruise", "Harties Cableway",
  "1 Hour Horse Riding", "1 Hour Quad Biking", "60 Minute Full Body Massage", "Lion & Safari Park",
  "Sun City and Valley of the Waves Entrance", "Pilanesberg Game Drive in Safari Truck",
  "Shuttle to Sun City from Guesthouse", "Zip Slide Adventure", "Segway Tour", "1 Hour Quad Biking Fun in Harties",
];

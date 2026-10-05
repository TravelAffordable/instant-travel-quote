import type { DealActivity } from "@/data/durbanDealActivities";

const a = (name: string, adult: number, child = adult): DealActivity => ({
  name, image: "", rates: { adult, child, freeAge: 0 },
});

/** Owner-supplied final per-person rates (5 Oct 2026); hotel deals only, no markup. Vaal list is exclusive. */
export const vaalDealActivities: DealActivity[] = [
  a("2 Hour Vaal River Cruise with delicious buffet (Sundays Only)", 730, 380),
  a("Emerald Casino Aquadome Pools", 350, 270),
  a("Emerald Casino Game Drive and Animal World", 350, 270),
  a("1 Hour Leisure Cruise (Daily)", 140, 80),
];

export const belaBelaDealActivities: DealActivity[] = [
  a("Entrance to Bela Bela Warmbaths Resort with Exciting Water Park Warm pools and hot springs", 380),
  a("Game Drive in guided in Safari Truck at Ramoswe Game Reserve", 300, 220),
];

/** Old Bela-Bela shared-list entries replaced by the reviewed rates above. */
export const replacedBelaBelaNames = ["Forever Resort Hot Springs", "Game Drive at Mabalingwe"];

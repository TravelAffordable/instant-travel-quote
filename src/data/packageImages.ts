// Package-specific images for the visual package selection grid
// Maps package IDs to their representative images

import durbanUshaka from '@/assets/activities/durban-ushaka-marine.jpg';
import durbanBoatCruise from '@/assets/activities/durban-boat-cruise.jpg';
import durbanOpenTopBus from '@/assets/activities/durban-open-top-bus.jpg';
import durbanSpaMassage from '@/assets/activities/durban-spa-massage.jpg';

// Each Durban package gets an image that best represents its key activity
export const packageImages: Record<string, string> = {
  // DUR1 - Fun on the Beach (uShaka + Boat Cruise + Massage)
  'dur1': durbanUshaka,
  // DUR2 - Smiles & Sea Shells (uShaka + Open Bus + Boat Cruise)
  'dur2': durbanOpenTopBus,
  // DUR3 - Beach & Spa Ease (Spa + Canal Cruise)
  'dur3': durbanSpaMassage,
  // DUR4 - Party Vibes (Nightlife + uShaka + Cruise + Massage)
  'dur4': durbanBoatCruise,
  // DUR5 - Beach Couple uShaka
  'dur5': durbanUshaka,
  // DUR6 - Beach Couple Cruise
  'dur6': durbanBoatCruise,
  // DUR7 - Beach & Nightlife
  'dur7': durbanSpaMassage,
  // DUR8 - Open Top Bus Tour
  'dur8': durbanOpenTopBus,
};

export const getPackageImage = (packageId: string): string | undefined => {
  return packageImages[packageId];
};

/**
 * Travel Affordable — package (experience/activity) pricing per tour code.
 *
 * IMPORTANT: the prices below are the customer-facing package activity prices and
 * ALREADY INCLUDE the service fees listed in `SERVICE_FEES`. Do not add fees again
 * and do not alter these values without an explicit instruction.
 *
 * DUR1 override: adult activity cost R1 450 + R400 adult service fee = R1 850 per adult.
 */

export const SERVICE_FEES = {
  adult: 400,
  child0to2: 0,
  child3to12: 200,
  child13to17: 300,
} as const;

export type ChildBand = 'child0to2' | 'child3to12' | 'child13to17';

export interface ChildAgeTier {
  minAge: number;
  maxAge: number;
  price: number;
}

export interface PackagePrice {
  /** Per-adult package price (service fee included). */
  adult: number;
  /** Per-child price, ages 3–12 (service fee included). Null = price on request. */
  child3to12: number | null;
  /** Per-child price, ages 13–17 (service fee included). Null = price on request. */
  child13to17: number | null;
  /** Optional custom age bands. When present they override the two bands above. */
  childAgeTiers?: ChildAgeTier[];
  /** Optional override for the "children travel free" upper age. */
  freeChildMaxAge?: number;
}

/** Children 0–2 always travel free on the package. */
export const CHILD_FREE_MAX_AGE = 2;

export const PACKAGE_PRICES: Record<string, PackagePrice> = {
  HG1: { adult: 1410, child3to12: 890, child13to17: 1310 },
  HG2: { adult: 2050, child3to12: 1420, child13to17: 1730 },
  HG3: { adult: 1850, child3to12: 800, child13to17: 900 },
  HG4: { adult: 2880, child3to12: 1650, child13to17: 1750 },
  HG5: { adult: 1730, child3to12: 1140, child13to17: 1240 },
  HG6: { adult: 780, child3to12: 500, child13to17: 600 },
  HG7: { adult: 1100, child3to12: 550, child13to17: 650 },
  HG8: { adult: 950, child3to12: 500, child13to17: 600 },
  HG9: { adult: 1210, child3to12: 600, child13to17: 700 },
  HG10: { adult: 1680, child3to12: 800, child13to17: 900 },
  HG11: { adult: 1580, child3to12: 800, child13to17: 900 },
  HG12: { adult: 1800, child3to12: 800, child13to17: 900 },

  MAG1: { adult: 1300, child3to12: 1000, child13to17: 1100 },
  MAG2: { adult: 2530, child3to12: 1000, child13to17: 1100 },
  MAG3: { adult: 2350, child3to12: 1000, child13to17: 1100 },
  MAG4: { adult: 1600, child3to12: 1000, child13to17: 1100 },
  MAG5: { adult: 2730, child3to12: 1100, child13to17: 1200 },
  MAG6: { adult: 2000, child3to12: 900, child13to17: 1000 },

  // DUR1: R1 450 activity + R400 service fee = R1 850
  DUR1: { adult: 1850, child3to12: 800, child13to17: 900 },
  DUR2: { adult: 1700, child3to12: 800, child13to17: 900 },
  DUR3: { adult: 1950, child3to12: 800, child13to17: 900 },
  DUR4: { adult: 2400, child3to12: 800, child13to17: 900 },
  DUR5: { adult: 1250, child3to12: 600, child13to17: 700 },
  DUR6: { adult: 950, child3to12: 500, child13to17: 600 },
  DUR7: { adult: 800, child3to12: 400, child13to17: 500 },
  DUR8: { adult: 1000, child3to12: 550, child13to17: 650 },

  UMHLA1: { adult: 900, child3to12: 380, child13to17: 480 },
  UMHLA2: { adult: 1850, child3to12: 1100, child13to17: 1200 },
  UMHLA3: { adult: 2250, child3to12: 1000, child13to17: 1100 },
  UMHLA4: { adult: 2800, child3to12: 1100, child13to17: 1200 },

  MP1: { adult: 1720, child3to12: 1000, child13to17: 1100 },
  MP2: { adult: 2150, child3to12: 1100, child13to17: 1200 },
  MP3: { adult: 2500, child3to12: 800, child13to17: 900 },
  MP4: { adult: 3200, child3to12: 1400, child13to17: 1500 },

  // Kruger National Park Mpumalanga Budget Weekender — kids pricing on request
  // uMdloti: R600 per child 2-6 years, R850 per child 7-17 years
  UMDL001: {
    adult: 1820,
    child3to12: 600,
    child13to17: 850,
    freeChildMaxAge: 1,
    childAgeTiers: [
      { minAge: 2, maxAge: 6, price: 600 },
      { minAge: 7, maxAge: 17, price: 850 },
    ],
  },

  KRUGER001: { adult: 1140, child3to12: null, child13to17: null },

  EMER1: { adult: 1500, child3to12: 1000, child13to17: 1100 },
  EMER2: { adult: 1450, child3to12: 900, child13to17: 1000 },
  EMER3: { adult: 2100, child3to12: 1150, child13to17: 1250 },

  KNY1: { adult: 1950, child3to12: null, child13to17: null },

  BELA1: { adult: 1200, child3to12: 800, child13to17: 900 },
  BELA2: { adult: 1250, child3to12: 900, child13to17: 1000 },
  BELA3: { adult: 3600, child3to12: null, child13to17: 1900 },
  BELA4: { adult: 3000, child3to12: null, child13to17: 1600 },
  BELA5: { adult: 2000, child3to12: null, child13to17: 1100 },

  BLY1: { adult: 1600, child3to12: 800, child13to17: 900 },

  CPT1: { adult: 2200, child3to12: 1050, child13to17: 1150 },
  CPT2: { adult: 1600, child3to12: 1000, child13to17: 1100 },
  CPTFW: { adult: 2700, child3to12: null, child13to17: null },
  CPTWTCM: { adult: 3000, child3to12: null, child13to17: null },

  SUN1: { adult: 1950, child3to12: 800, child13to17: 900 },
  SUN2: { adult: 1650, child3to12: 1050, child13to17: 1150 },
  SUN3: { adult: 1250, child3to12: 750, child13to17: 850 },
  SUN4: { adult: 1950, child3to12: 950, child13to17: 1050 },
  SUN5: { adult: 2550, child3to12: 1100, child13to17: 1200 },
  SUN6: { adult: 2100, child3to12: 1000, child13to17: 1100 },
  SUN7: { adult: 1200, child3to12: 900, child13to17: 1000 },
  SUN8: { adult: 2000, child3to12: 1000, child13to17: 1100 },

  'BALI-UBUD': { adult: 3800, child3to12: null, child13to17: null },
  'DUBAI-1': { adult: 4800, child3to12: null, child13to17: null },
  'PHUKET-1': { adult: 4200, child3to12: null, child13to17: null },
};

export interface Travellers {
  adults: number;
  /** Individual child ages (0–17). */
  childrenAges?: number[];
}

export interface PackagePriceResult {
  perAdult: number;
  adultsTotal: number;
  childrenTotal: number;
  total: number;
  /** True when one or more children fall in a band with no supplied price. */
  childPriceOnRequest: boolean;
  freeChildren: number;
}

export function getChildBand(age: number): ChildBand {
  if (age <= CHILD_FREE_MAX_AGE) return 'child0to2';
  if (age <= 12) return 'child3to12';
  return 'child13to17';
}

export function getPackagePrice(code: string): PackagePrice | null {
  return PACKAGE_PRICES[code.toUpperCase()] ?? null;
}

/** Per-person "from" price for a tour code (adult price). */
export function getPackageFromPrice(code: string): number | null {
  return getPackagePrice(code)?.adult ?? null;
}

/**
 * Package (experience) cost for a group. Accommodation is priced separately
 * and added afterwards to form the complete holiday price.
 */
export function calculatePackagePrice(code: string, travellers: Travellers): PackagePriceResult | null {
  const price = getPackagePrice(code);
  if (!price) return null;

  const adults = Math.max(0, travellers.adults);
  const adultsTotal = price.adult * adults;

  let childrenTotal = 0;
  let childPriceOnRequest = false;
  let freeChildren = 0;

  const freeMaxAge = price.freeChildMaxAge ?? CHILD_FREE_MAX_AGE;

  for (const age of travellers.childrenAges ?? []) {
    if (age <= freeMaxAge) {
      freeChildren += 1;
      continue;
    }

    if (price.childAgeTiers?.length) {
      const tier = price.childAgeTiers.find((t) => age >= t.minAge && age <= t.maxAge);
      if (tier) {
        childrenTotal += tier.price;
      } else {
        childPriceOnRequest = true;
      }
      continue;
    }

    const band = getChildBand(age);
    if (band === 'child0to2') {
      freeChildren += 1;
      continue;
    }
    const bandPrice = price[band];
    if (bandPrice === null) {
      childPriceOnRequest = true;
      continue;
    }
    childrenTotal += bandPrice;
  }

  return {
    perAdult: price.adult,
    adultsTotal,
    childrenTotal,
    total: adultsTotal + childrenTotal,
    childPriceOnRequest,
    freeChildren,
  };
}

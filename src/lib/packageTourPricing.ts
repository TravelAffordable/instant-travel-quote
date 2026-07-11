// Per-person "from" prices by tour code (internal — public display only)
export const TOUR_FROM_PRICES: Record<string, number> = {
  HG1: 2410, HG2: 3050, HG3: 2850, HG4: 3880, HG5: 2730, HG6: 1780,
  HG7: 2100, HG8: 1950, HG9: 2210, HG10: 2680, HG11: 2580, HG12: 2800,
  MAG1: 2300, MAG2: 3530, MAG3: 3350, MAG4: 2600, MAG5: 3730, MAG6: 3000,
  DUR1: 2850, DUR2: 2700, DUR3: 2950, DUR4: 3400, DUR5: 2250, DUR6: 1950,
  DUR7: 1800, DUR8: 2000,
  UMHLA1: 1900, UMHLA2: 2850, UMHLA3: 3250, UMHLA4: 3800,
  MP1: 2720, MP2: 3150, MP3: 3500, MP4: 4200,
  EMER1: 2500, EMER2: 2450, EMER3: 3100,
  KNY1: 2950,
  BELA1: 2200, BELA2: 2250, BELA3: 4600, BELA4: 4000, BELA5: 3000,
  BLY1: 2600,
  SUN1: 2950, SUN2: 2650, SUN3: 2250, SUN4: 2950, SUN5: 3550, SUN6: 3100,
  SUN7: 2200, SUN8: 3000,
  CPT1: 3200, CPT2: 2600, CPTFW: 3700, CPTWTCM: 4000,
};

export function extractTourCode(name: string): string | null {
  const m = name.match(/^([A-Z]+\d*[A-Z]*)\s*-\s*/);
  return m ? m[1] : null;
}

export function getTourFromPrice(name: string): number | null {
  const code = extractTourCode(name);
  if (!code) return null;
  return TOUR_FROM_PRICES[code] ?? null;
}

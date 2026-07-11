// Per-person "from" prices by tour code (internal — public display only)
export const TOUR_FROM_PRICES: Record<string, number> = {
  HG1: 2160, HG2: 2800, HG3: 2600, HG4: 3630, HG5: 2480, HG6: 1530,
  HG7: 1850, HG8: 1700, HG9: 1960, HG10: 2430, HG11: 2330, HG12: 2550,
  MAG1: 2050, MAG2: 3280, MAG3: 3100, MAG4: 2350, MAG5: 3480, MAG6: 2750,
  DUR1: 2600, DUR2: 2450, DUR3: 2700, DUR4: 3150, DUR5: 2000, DUR6: 1700,
  DUR7: 1550, DUR8: 1750,
  UMHLA1: 1650, UMHLA2: 2600, UMHLA3: 3000, UMHLA4: 3550,
  MP1: 2470, MP2: 2900, MP3: 3250, MP4: 3950,
  EMER1: 2250, EMER2: 2200, EMER3: 2850,
  KNY1: 2700,
  BELA1: 1950, BELA2: 2000, BELA3: 4350, BELA4: 3750, BELA5: 2750,
  BLY1: 2350,
  SUN1: 2700, SUN2: 2400, SUN3: 2000, SUN4: 2700, SUN5: 3300, SUN6: 2850,
  SUN7: 1950, SUN8: 2750,
  CPT1: 2950, CPT2: 2350, CPTFW: 3450, CPTWTCM: 3750,
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

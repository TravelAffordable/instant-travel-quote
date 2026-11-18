// Per-person "from" prices by tour code (internal — public display only)
export const TOUR_FROM_PRICES: Record<string, number> = {
  HG1: 1410, HG2: 2050, HG3: 1850, HG4: 2880, HG5: 1730, HG6: 780,
  HG7: 1100, HG8: 950, HG9: 1210, HG10: 1680, HG11: 1580, HG12: 1800,
  MAG1: 1300, MAG2: 2530, MAG3: 2350, MAG4: 1600, MAG5: 2730, MAG6: 2000,
  DUR1: 1850, DUR2: 1700, DUR3: 1950, DUR4: 2400, DUR5: 1250, DUR6: 950,
  DUR7: 800, DUR8: 1000, DUR9: 1550,
  UMDL001: 1820,
  UMHLA1: 900, UMHLA2: 1850, UMHLA3: 2250, UMHLA4: 2800,
  MP1: 1720, MP2: 2150, MP3: 2500, MP4: 3200, KRUGER001: 1140,
  EMER1: 1500, EMER2: 1450, EMER3: 2100,
  KNY1: 1950,
  BELA1: 1200, BELA2: 1250, BELA3: 3600, BELA4: 3000, BELA5: 2000,
  BLY1: 1600,
  SUN1: 1950, SUN2: 1650, SUN3: 1250, SUN4: 1950, SUN5: 2550, SUN6: 2100,
  SUN7: 1200, SUN8: 2000,
  CPT1: 2200, CPT2: 1600, CPTFW: 2700, CPTWTCM: 3000,
  'BALI-UBUD': 3800, 'DUBAI-1': 4800, 'PHUKET-1': 4200,
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

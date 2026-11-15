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

type TourSource =
  | string
  | { tourCode?: unknown; id?: unknown; name?: unknown; fromPriceOverride?: unknown; basePrice?: unknown }
  | null
  | undefined;

const has = (k: string) => Object.prototype.hasOwnProperty.call(TOUR_FROM_PRICES, k);

const CODE_RE =
  /\b(?:HG|MAG|DUR|UMHLA|UMDL|MP|KRUGER|EMER|KNY|BELA|BLY|CPT|SUN)-?\d+\b|\b(?:BALI|DUBAI|PHUKET)-[A-Z0-9]+\b|\bCPT(?:FW|WTCM)\b/;

function toKey(raw: string): string {
  const up = raw.trim().toUpperCase();
  if (has(up)) return up;                              // exact match first
  const m = up.match(CODE_RE);
  if (!m) return '';
  const code = m[0];
  if (has(code)) return code;
  const compact = code.replace(/^([A-Z]+)-(\d+)$/, '$1$2'); // HG-1 -> HG1
  return has(compact) ? compact : '';
}

export function extractTourCode(src: TourSource): string {
  if (src == null) return '';
  const candidates = typeof src === 'string' ? [src] : [src.tourCode, src.id, src.name];
  for (const c of candidates) {
    if (c == null || typeof c === 'object') continue;
    const key = toKey(String(c));
    if (key) return key;                                // first candidate that yields a real key wins
  }
  return '';
}

export function getTourFromPrice(pkg: TourSource, _destinationId?: string): string {
  if (pkg == null) return 'On Request';
  
  if (typeof pkg === 'object') {
    if (pkg.fromPriceOverride != null && typeof pkg.fromPriceOverride === 'number') {
      return `From R ${pkg.fromPriceOverride.toLocaleString('en-ZA')} pp`;
    }
  }

  const code = extractTourCode(pkg);
  const price = code ? TOUR_FROM_PRICES[code] : undefined;
  
  if (price != null) {
    return `From R ${price.toLocaleString('en-ZA')} pp`;
  }

  if (typeof pkg === 'object' && pkg.basePrice != null && typeof pkg.basePrice === 'number') {
    return `From R ${pkg.basePrice.toLocaleString('en-ZA')} pp`;
  }

  return 'On Request';
}

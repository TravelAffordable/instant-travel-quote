// Official star grading for Durban properties (null = ungraded)
export const durbanHotelStars: Record<string, number | null> = {
  'The Balmoral - Halaal': 4,
  'The Balmoral': 4,
  'SatSands Hotel & Self-Catering': null,
  'Parade Hotel': 3,
  'Garden Court South Beach': 3,
  'Southern Sun Garden Court South Beach': 3,
  'Gooderson Tropicana Hotel': 3,
  'The Edward': 4,
  'Southern Sun The Edward': 4,
  'Garden Court Marine Parade': 3,
  'Southern Sun Garden Court Marine Parade': 3,
  'Southern Sun Elangeni & Maharani': 4,
  'Southern Sun Elangeni & Maharani Hotel': 4,
  'Suncoast Hotel & Towers': 5,
  'Blue Waters Hotel': 4,
  'Belaire Suites Hotel': 4,
};

export function getDurbanHotelStars(name: string): number | null | undefined {
  return durbanHotelStars[name];
}

// Generic placeholder names that must never be shown to clients
const GENERIC_NAME_PATTERNS = [
  /beachfront\s+budget\s+option/i,
  /\b(budget|affordable|premium)\b.*\boption\s*\d+/i,
  /\bsleeper\s+option\b/i,
  /\b(budget|affordable|premium)\s+hotel(\s+option)?\s+[A-J]\b/i,
];

export function isGenericHotelName(name: string): boolean {
  return GENERIC_NAME_PATTERNS.some((re) => re.test(name));
}

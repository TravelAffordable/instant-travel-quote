/**
 * Durban Golden Mile (beachfront) properties that carry the
 * "Right on the beach" label on accommodation cards.
 * Kept separate from the rate calendar so the label can cover
 * beachfront properties that are not in the calendar.
 */
const BEACHFRONT_MATCHERS = [
  'blue waters',
  'belaire',
  'marine parade',
  'south beach',
  'edward',
  'suncoast',
  'elangeni',
  'maharani',
  'parade hotel',
  'tropicana',
  'durban spa',
  'balmoral',
  'palace all-suite',
  'palace all suite',
  'silver sands',
  'silversands',
  'windemere',
  'windermere',
  'ocean reef',
  'coastlands umhlanga', // excluded below
];

/** Names that must never get the beachfront label. */
const EXCLUDE = ['coastlands umhlanga'];

export function isGoldenMileBeachfront(hotelName: string): boolean {
  const n = hotelName.toLowerCase();
  if (EXCLUDE.some((x) => n.includes(x))) return false;
  return BEACHFRONT_MATCHERS.some((m) => n.includes(m));
}

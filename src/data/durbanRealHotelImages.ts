// Real property photos supplied by the client for the main Durban beachfront hotels.
// Enhanced to a wide 16:10 landscape framing so the whole property stays visible in cards.
// These take precedence over any earlier mapping for the same property.
import balmoral from '@/assets/hotels/durban-real/balmoral.jpg';
import blueWaters from '@/assets/hotels/durban-real/blue-waters.jpg';
import elangeni from '@/assets/hotels/durban-real/elangeni.jpg';
import gcMarine from '@/assets/hotels/durban-real/gc-marine-parade.jpg';
import gcSouthBeach from '@/assets/hotels/durban-real/gc-south-beach.jpg';
import suncoast from '@/assets/hotels/durban-real/suncoast.jpg';
import tropicana from '@/assets/hotels/durban-real/tropicana.jpg';

export const durbanRealHotelImageMap: Record<string, string> = {
  'Blue Waters Hotel': blueWaters,
  'Southern Sun Elangeni & Maharani': elangeni,
  'Southern Sun Elangeni & Maharani Hotel': elangeni,
  'The Balmoral': balmoral,
  'The Balmoral - Halaal': balmoral,
  'Garden Court Marine Parade': gcMarine,
  'Southern Sun Garden Court Marine Parade': gcMarine,
  'Garden Court South Beach': gcSouthBeach,
  'Southern Sun Garden Court South Beach': gcSouthBeach,
  'Suncoast Hotel & Towers': suncoast,
  'Suncoast Hotel and Towers': suncoast,
  'Gooderson Tropicana Hotel': tropicana,
};

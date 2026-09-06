// Real property photos supplied by the client for the main Durban beachfront hotels.
// These take precedence over any earlier mapping for the same property.
import balmoral from '@/assets/hotels/durban-real/balmoral.jpg.asset.json';
import blueWaters from '@/assets/hotels/durban-real/blue-waters.jpg.asset.json';
import elangeni from '@/assets/hotels/durban-real/elangeni.jpg.asset.json';
import gcMarine from '@/assets/hotels/durban-real/gc-marine-parade.jpg.asset.json';
import gcSouthBeach from '@/assets/hotels/durban-real/gc-south-beach.jpg.asset.json';
import suncoast from '@/assets/hotels/durban-real/suncoast.jpg.asset.json';
import tropicana from '@/assets/hotels/durban-real/tropicana.jpg.asset.json';

export const durbanRealHotelImageMap: Record<string, string> = {
  'Blue Waters Hotel': blueWaters.url,
  'Southern Sun Elangeni & Maharani': elangeni.url,
  'Southern Sun Elangeni & Maharani Hotel': elangeni.url,
  'The Balmoral': balmoral.url,
  'The Balmoral - Halaal': balmoral.url,
  'Garden Court Marine Parade': gcMarine.url,
  'Southern Sun Garden Court Marine Parade': gcMarine.url,
  'Garden Court South Beach': gcSouthBeach.url,
  'Southern Sun Garden Court South Beach': gcSouthBeach.url,
  'Suncoast Hotel & Towers': suncoast.url,
  'Suncoast Hotel and Towers': suncoast.url,
  'Gooderson Tropicana Hotel': tropicana.url,
};

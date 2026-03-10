// Durban Premium Hotel Images
import blueWatersImg from '@/assets/hotels/durban-premium-blue-waters.jpg';
import gardenCourtSouthBeachImg from '@/assets/hotels/durban-premium-garden-court-south-beach.jpg';
import theEdwardImg from '@/assets/hotels/durban-premium-the-edward.jpg';
import belaireImg from '@/assets/hotels/durban-premium-belaire-suites.jpg';
import tropicanaImg from '@/assets/hotels/durban-premium-tropicana.jpg';
import elangeniImg from '@/assets/hotels/durban-premium-elangeni-maharani.jpg';
import suncoastImg from '@/assets/hotels/durban-premium-suncoast.jpg';
import gardenCourtMarineImg from '@/assets/hotels/durban-premium-garden-court-marine-parade.jpg';

export const durbanPremiumImageMap: Record<string, string> = {
  'Blue Waters Hotel': blueWatersImg,
  'Garden Court South Beach': gardenCourtSouthBeachImg,
  'The Edward': theEdwardImg,
  'The Balmoral': belaireImg, // Reuse Durban beachfront image
  'Belaire Suites Hotel': belaireImg,
  'Gooderson Tropicana Hotel': tropicanaImg,
  'Gooderson Leisure Silver Sands 2': tropicanaImg, // Reuse Gooderson image
  'First Group The Palace All-Suite': blueWatersImg, // Reuse beachfront image
  'Garden Court Marine Parade': gardenCourtMarineImg,
  'Southern Sun Elangeni & Maharani Hotel': elangeniImg,
  'Suncoast Hotel & Towers': suncoastImg,
  'Sea Esta Luxury Apartment 107': blueWatersImg,
  'Beach Hurst 303': belaireImg,
  'UshakaViews': elangeniImg,
};

export function getDurbanPremiumImage(hotelName: string): string | undefined {
  return durbanPremiumImageMap[hotelName];
}

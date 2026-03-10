// Durban Premium Hotel Images
import blueWatersImg from '@/assets/hotels/durban-premium-blue-waters.jpg';
import gardenCourtSouthBeachImg from '@/assets/hotels/durban-premium-garden-court-south-beach.jpg';
import theEdwardImg from '@/assets/hotels/durban-premium-the-edward.jpg';
import belaireImg from '@/assets/hotels/durban-premium-belaire-suites.jpg';
import tropicanaImg from '@/assets/hotels/durban-premium-tropicana.jpg';
import elangeniImg from '@/assets/hotels/durban-premium-elangeni-maharani.jpg';
import suncoastImg from '@/assets/hotels/durban-premium-suncoast.jpg';
import gardenCourtMarineImg from '@/assets/hotels/durban-premium-garden-court-marine-parade.jpg';
import balmoralImg from '@/assets/hotels/durban-premium-balmoral.jpg';
import silverSandsImg from '@/assets/hotels/durban-premium-silver-sands.jpg';
import palaceAllSuiteImg from '@/assets/hotels/durban-premium-palace-all-suite.jpg';
import seaEstaImg from '@/assets/hotels/durban-premium-sea-esta.jpg';
import beachHurstImg from '@/assets/hotels/durban-premium-beach-hurst.jpg';
import ushakaViewsImg from '@/assets/hotels/durban-premium-ushakaviews.jpg';

export const durbanPremiumImageMap: Record<string, string> = {
  // 2-sleeper hotels
  'The Balmoral': balmoralImg,
  'Belaire Suites Hotel': belaireImg,
  'Blue Waters Hotel': blueWatersImg,
  'Gooderson Tropicana Hotel': tropicanaImg,
  'Southern Sun Garden Court South Beach': gardenCourtSouthBeachImg,
  'Gooderson Leisure Silver Sands 2': silverSandsImg,
  'Southern Sun The Edward': theEdwardImg,
  'First Group The Palace All-Suite': palaceAllSuiteImg,
  'Southern Sun Garden Court Marine Parade': gardenCourtMarineImg,
  'Southern Sun Elangeni & Maharani Hotel': elangeniImg,
  'Suncoast Hotel & Towers': suncoastImg,
  // 4-sleeper hotels
  'Sea Esta Luxury Apartment 107': seaEstaImg,
  'Beach Hurst 303': beachHurstImg,
  'UshakaViews': ushakaViewsImg,
  // Alternate name variants used in family arrays
  'Garden Court South Beach': gardenCourtSouthBeachImg,
  'The Edward': theEdwardImg,
  'Garden Court Marine Parade': gardenCourtMarineImg,
  'Southern Sun Elangeni & Maharani': elangeniImg,
};

export function getDurbanPremiumImage(hotelName: string): string | undefined {
  return durbanPremiumImageMap[hotelName];
}

// Magalies premium hotel images
import cocomoImg from '@/assets/hotels/magalies-premium-cocomo.jpg';
import mountGraceImg from '@/assets/hotels/magalies-premium-mount-grace.jpg';
import cradleBoutiqueImg from '@/assets/hotels/magalies-premium-cradle-boutique.jpg';
import valleyLodgeImg from '@/assets/hotels/magalies-premium-valley-lodge.jpg';

export const magaliesPremiumImageMap: Record<string, string> = {
  'Cocomo Boutique Hotel': cocomoImg,
  'Mount Grace Hotel And Spa': mountGraceImg,
  'Mount Grace Hotel & Spa': mountGraceImg,
  'Cradle Boutique Hotel': cradleBoutiqueImg,
  'Valley Lodge & Spa': valleyLodgeImg,
  'Valley Lodge and Spa': valleyLodgeImg,
};

export function getMagaliesPremiumImage(hotelName: string): string | undefined {
  return magaliesPremiumImageMap[hotelName];
}

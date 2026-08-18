// Magalies premium hotel images (real property photos, CDN-hosted)
import cocomoAsset from '@/assets/hotels/magalies-cocomo1.jpg.asset.json';
import mountGraceAsset from '@/assets/hotels/magalies-MountGrace1.jpg.asset.json';
import cradleBoutiqueAsset from '@/assets/hotels/magalies-Cradle_Boutique_Hote.jpg.asset.json';
import valleyLodgeAsset from '@/assets/hotels/magalies-ValleLodge.jpg.asset.json';

const cocomoImg = cocomoAsset.url;
const mountGraceImg = mountGraceAsset.url;
const cradleBoutiqueImg = cradleBoutiqueAsset.url;
const valleyLodgeImg = valleyLodgeAsset.url;

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

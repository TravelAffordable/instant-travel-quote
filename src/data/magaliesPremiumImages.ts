// Magalies premium hotel images (real property photos, CDN-hosted)
import cocomoAsset from '@/assets/hotels/magalies-cocomo1.jpg.asset.json';
import mountGraceAsset from '@/assets/hotels/magalies-MountGrace1.jpg.asset.json';
import cradleBoutiqueAsset from '@/assets/hotels/magalies-Cradle_Boutique_Hote.jpg.asset.json';
import valleyLodgeAsset from '@/assets/hotels/magalies-ValleLodge.jpg.asset.json';
import glenburnAsset from '@/assets/hotels/magalies-glenburnlodge.jpg.asset.json';
import sleepoverAsset from '@/assets/hotels/magalies-SleepOverLanseria.jpg.asset.json';
import bushBohoAsset from '@/assets/hotels/magalies-26_South_Bush_Boho_Hotel.jpg.asset.json';
import palmeraAsset from '@/assets/hotels/magalies-Palmera.jpg.asset.json';
import mistyHillsAsset from '@/assets/hotels/magalies-MistyHills.jpg.asset.json';
import aviantoAsset from '@/assets/hotels/magalies-Avianto.jpg.asset.json';
import lesediAsset from '@/assets/hotels/magalies-lesedi_culturall_village.webp.asset.json';

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
  'Glenburn Lodge & Spa': glenburnAsset.url,
  'Glenburn Lodge & Spa — Dinner, Bed & Breakfast': glenburnAsset.url,
  'Sleep Over Lanseria': sleepoverAsset.url,
  '26° South Bush Boho Hotel': bushBohoAsset.url,
  'Palmera Guest House': palmeraAsset.url,
  'Misty Hills Country Hotel, Conference Centre & Spa': mistyHillsAsset.url,
  'Avianto': aviantoAsset.url,
  'aha Lesedi African Lodge & Cultural Village': lesediAsset.url,
};

export function getMagaliesPremiumImage(hotelName: string): string | undefined {
  return magaliesPremiumImageMap[hotelName];
}

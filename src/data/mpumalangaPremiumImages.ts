// Mpumalanga hotel images (real named properties only)
import blydeCanyonAsset from '@/assets/hotels/mpumalanga-BlydeCanyonForever1.jpg.asset.json';
import panoramaBoutiqueAsset from '@/assets/hotels/mpumalanga-PanoramaBoutique.avif.asset.json';
import beachIslandAsset from '@/assets/hotels/mpumalanga-BeachIsland1.jpg.asset.json';
import panoramaVillaAsset from '@/assets/hotels/mpumalanga-PanoramaVilla1.jpg.asset.json';
import panoramaChaletsAsset from '@/assets/hotels/mpumalanga-PanoramaChaletsand_Rest_Camp1.jpg.asset.json';
import graskopHotelAsset from '@/assets/hotels/mpumalanga-GraskopHotel1.jpg.asset.json';
import angelsViewAsset from '@/assets/hotels/mpumalanga-AngelsView1.jpg.asset.json';
import pretoriuskopAsset from '@/assets/hotels/mpumalanga-PretoriuskopRestCamp.jpg.asset.json';
import pretoriuskopEb3Asset from '@/assets/hotels/kruger-PretoriuskopEB3.jpg.asset.json';
import pretoriuskopEb5Asset from '@/assets/hotels/kruger-PretoriuskopEB5.jpg.asset.json';

export const mpumalangaPremiumImageMap: Record<string, string> = {
  'Blyde Canyon Forever Resort': blydeCanyonAsset.url,
  'Panorama Boutique Guesthouse': panoramaBoutiqueAsset.url,
  'Beach Island Graskop': beachIslandAsset.url,
  'Panorama Villa': panoramaVillaAsset.url,
  'Panorama Chalets and Rest Camp': panoramaChaletsAsset.url,
  'Graskop Hotel': graskopHotelAsset.url,
  'Angels View Hotel': angelsViewAsset.url,
  'Pretoriuskop Rest Camp': pretoriuskopAsset.url,
  'Pretoriuskop Rest Camp (3-Sleeper Hut - EB3)': pretoriuskopEb3Asset.url,
  'Pretoriuskop Rest Camp (4-Sleeper Hut - EB5)': pretoriuskopEb5Asset.url,
};

export function getMpumalangaPremiumImage(hotelName: string): string | undefined {
  return mpumalangaPremiumImageMap[hotelName];
}

// Sun City / Pilanesberg hotel images (real property photos from live listings)
import bakubungAsset from '@/assets/hotels/suncity-real-bakubung.jpg.asset.json';
import kingdomAsset from '@/assets/hotels/suncity-real-kingdom.jpg.asset.json';
import kwaMaritaneAsset from '@/assets/hotels/suncity-real-kwa.jpg.asset.json';
import sundownAsset from '@/assets/hotels/suncity-real-sundown.jpg.asset.json';
import gettysAsset from '@/assets/hotels/suncity-real-gettys.jpg.asset.json';
import valleyViewAsset from '@/assets/hotels/suncity-real-valley.jpg.asset.json';
import ivoryTreeAsset from '@/assets/hotels/suncity-real-ivory.jpg.asset.json';
import pilanesbergAsset from '@/assets/hotels/suncity-real-pilanesberg.jpg.asset.json';
import kedarAsset from '@/assets/hotels/suncity-real-kedar.jpg.asset.json';
import royalMarangAsset from '@/assets/hotels/suncity-real-marang.jpg.asset.json';
import cabanas2SleeperAsset from '@/assets/hotels/suncity-cabanas-2sleeper.jpg.asset.json';
import cabanas4SleeperAsset from '@/assets/hotels/suncity-cabanas-4sleeper.webp.asset.json';

export const sunCityPremiumImageMap: Record<string, string> = {
  'Bakubung Bush Lodge': bakubungAsset.url,
  'The Kingdom Resort': kingdomAsset.url,
  'Kwa Maritane Lodge': kwaMaritaneAsset.url,
  'Sundown Country Estate': sundownAsset.url,
  "Getty's Bed and Breakfast": gettysAsset.url,
  'Valley View Guest House': valleyViewAsset.url,
  'Ivory Tree Game Lodge': ivoryTreeAsset.url,
  'Pilanesberg Hotel': pilanesbergAsset.url,
  'Kedar Heritage Lodge Conference Centre & Spa': kedarAsset.url,
  'Royal Marang Hotel': royalMarangAsset.url,
  'Cabanas Hotel (Inside Sun City) — 2 Sleeper': cabanas2SleeperAsset.url,
  'Cabanas Hotel (Inside Sun City) — 4 Sleeper Family': cabanas4SleeperAsset.url,
};

export function getSunCityPremiumImage(hotelName: string): string | undefined {
  return sunCityPremiumImageMap[hotelName];
}

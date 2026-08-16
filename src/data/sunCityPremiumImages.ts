// Sun City / Pilanesberg hotel images (real named properties only)
import bakubungImg from '@/assets/hotels/suncity-premium-bakubung-bush-lodge.jpg';
import kingdomImg from '@/assets/hotels/suncity-premium-kingdom-resort.jpg';
import kwaMaritaneImg from '@/assets/hotels/suncity-premium-kwa-maritane.jpg';
import sundownImg from '@/assets/hotels/suncity-premium-sundown-country-estate.jpg';
import gettysImg from '@/assets/hotels/suncity-premium-gettys-bnb.jpg';
import valleyViewImg from '@/assets/hotels/suncity-premium-valley-view-guest-house.jpg';
import ivoryTreeImg from '@/assets/hotels/suncity-premium-ivory-tree.jpg';
import pilanesbergImg from '@/assets/hotels/suncity-premium-pilanesberg-hotel.jpg';
import kedarImg from '@/assets/hotels/suncity-premium-kedar-heritage-lodge.jpg';
import royalMarangImg from '@/assets/hotels/suncity-premium-royal-marang.jpg';

export const sunCityPremiumImageMap: Record<string, string> = {
  'Bakubung Bush Lodge': bakubungImg,
  'The Kingdom Resort': kingdomImg,
  'Kwa Maritane Lodge': kwaMaritaneImg,
  'Sundown Country Estate': sundownImg,
  "Getty's Bed and Breakfast": gettysImg,
  'Valley View Guest House': valleyViewImg,
  'Ivory Tree Game Lodge': ivoryTreeImg,
  'Pilanesberg Hotel': pilanesbergImg,
  'Kedar Heritage Lodge Conference Centre & Spa': kedarImg,
  'Royal Marang Hotel': royalMarangImg,
};

export function getSunCityPremiumImage(hotelName: string): string | undefined {
  return sunCityPremiumImageMap[hotelName];
}

// Umhlanga Premium Hotel Images
import hiltonGardenInnImg from '@/assets/hotels/umhlanga-premium-hilton-garden-inn.jpg';
import breakersResortImg from '@/assets/hotels/umhlanga-premium-breakers-resort.jpg';
import radissonBluImg from '@/assets/hotels/umhlanga-premium-radisson-blu.jpg';

export const umhlangaPremiumImageMap: Record<string, string> = {
  'Breakers Resort Apartments': breakersResortImg,
  'aha Gateway Hotel Umhlanga': hiltonGardenInnImg,
  'The Villa Umhlanga': radissonBluImg,
  'Protea Hotel by Marriott Durban Umhlanga': hiltonGardenInnImg,
  'Holiday Inn Express Durban Umhlanga': hiltonGardenInnImg,
  'Hilton Garden Inn Umhlanga Arch': hiltonGardenInnImg,
  'Premier Splendid Inn Umhlanga': breakersResortImg,
  'First Group Breakers Resort': breakersResortImg,
  'Royal Palm Hotel': radissonBluImg,
  'Regal Inn Umhlanga Gateway': hiltonGardenInnImg,
  'Premier Hotel Umhlanga': breakersResortImg,
  'Radisson Blu Hotel Durban Umhlanga': radissonBluImg,
  'The Millennial Umhlanga': radissonBluImg,
  'Breakers Resort 232': breakersResortImg,
  'Oceans Apartments Balcony Suites Radisson Blu': radissonBluImg,
  'Town Lodge Umhlanga': hiltonGardenInnImg,
  '71 Sea Lodge Beachfront Apartment': breakersResortImg,
};

export function getUmhlangaPremiumImage(hotelName: string): string | undefined {
  return umhlangaPremiumImageMap[hotelName];
}

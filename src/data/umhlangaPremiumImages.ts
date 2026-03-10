// Umhlanga Premium Hotel Images
import breakersResortImg from '@/assets/hotels/umhlanga-premium-breakers-resort.jpg';
import hiltonGardenInnImg from '@/assets/hotels/umhlanga-premium-hilton-garden-inn.jpg';
import radissonBluImg from '@/assets/hotels/umhlanga-premium-radisson-blu.jpg';
import royalPalmImg from '@/assets/hotels/umhlanga-premium-royal-palm.jpg';
import splendidInnImg from '@/assets/hotels/umhlanga-premium-splendid-inn.jpg';
import premierHotelImg from '@/assets/hotels/umhlanga-premium-premier-hotel.jpg';
import ahaGatewayImg from '@/assets/hotels/umhlanga-premium-aha-gateway.jpg';
import villaImg from '@/assets/hotels/umhlanga-premium-villa.jpg';
import proteaMarriottImg from '@/assets/hotels/umhlanga-premium-protea-marriott.jpg';
import holidayInnImg from '@/assets/hotels/umhlanga-premium-holiday-inn.jpg';
import regalInnImg from '@/assets/hotels/umhlanga-premium-regal-inn.jpg';
import millennialImg from '@/assets/hotels/umhlanga-premium-millennial.jpg';
import townLodgeImg from '@/assets/hotels/umhlanga-premium-town-lodge.jpg';
import seaLodgeImg from '@/assets/hotels/umhlanga-premium-sea-lodge.jpg';
import oceansApartmentsImg from '@/assets/hotels/umhlanga-premium-oceans-apartments.jpg';

export const umhlangaPremiumImageMap: Record<string, string> = {
  'Breakers Resort Apartments': breakersResortImg,
  'aha Gateway Hotel Umhlanga': ahaGatewayImg,
  'The Villa Umhlanga': villaImg,
  'Protea Hotel by Marriott Durban Umhlanga': proteaMarriottImg,
  'Holiday Inn Express Durban Umhlanga': holidayInnImg,
  'Hilton Garden Inn Umhlanga Arch': hiltonGardenInnImg,
  'Premier Splendid Inn Umhlanga': splendidInnImg,
  'First Group Breakers Resort': breakersResortImg,
  'Royal Palm Hotel': royalPalmImg,
  'Regal Inn Umhlanga Gateway': regalInnImg,
  'Premier Hotel Umhlanga': premierHotelImg,
  'Radisson Blu Hotel Durban Umhlanga': radissonBluImg,
  'The Millennial Umhlanga': millennialImg,
  'Breakers Resort 232': breakersResortImg,
  'Oceans Apartments Balcony Suites Radisson Blu': oceansApartmentsImg,
  'Town Lodge Umhlanga': townLodgeImg,
  '71 Sea Lodge Beachfront Apartment': seaLodgeImg,
};

export function getUmhlangaPremiumImage(hotelName: string): string | undefined {
  return umhlangaPremiumImageMap[hotelName];
}

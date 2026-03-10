// Harties Premium Hotel Images - scraped from Booking.com
import indlovukaziImg from '@/assets/hotels/harties-premium-indlovukazi.jpg';
import villaParadisoImg from '@/assets/hotels/harties-premium-villa-paradiso.jpg';
import cocomoImg from '@/assets/hotels/harties-premium-cocomo.jpg';
import riverleafImg from '@/assets/hotels/harties-premium-riverleaf.jpg';
import kosmosManorImg from '@/assets/hotels/harties-premium-kosmos-manor.jpg';
import palmSwiftImg from '@/assets/hotels/harties-premium-palm-swift.jpg';
import venueCountryImg from '@/assets/hotels/harties-premium-venue-country.jpg';
import waterfrontImg from '@/assets/hotels/harties-premium-waterfront.jpg';
import metsingImg from '@/assets/hotels/harties-premium-metsing.jpg';
import marinaViewImg from '@/assets/hotels/harties-premium-marina-view.jpg';
import cozyKosmosImg from '@/assets/hotels/harties-premium-cozy-kosmos.jpg';
import serenityImg from '@/assets/hotels/harties-premium-serenity.jpg';

// Map hotel name to its Booking.com primary image
export const hartiesPremiumImageMap: Record<string, string> = {
  'Indlovukazi Guesthouse': indlovukaziImg,
  'Villa Paradiso Hotel': villaParadisoImg,
  'Cocomo Boutique Hotel': cocomoImg,
  'The Riverleaf Hotel': riverleafImg,
  'Kosmos Manor': kosmosManorImg,
  'Palm Swift Luxury': palmSwiftImg,
  'The Venue Country Hotel and Spa': venueCountryImg,
  'Waterfront Guesthouse': waterfrontImg,
  'MetsingAt Harties': metsingImg,
  'Marina View Guesthouse': marinaViewImg,
  'Cozy Kosmos': cozyKosmosImg,
  'Serenity Guesthouse': serenityImg,
};

export function getHartiesPremiumImage(hotelName: string): string | undefined {
  return hartiesPremiumImageMap[hotelName];
}

// Cape Town hotel images (real property photos)
import seaPointApartmentAsset from '@/assets/hotels/capetown-seapoint-apartment.jpg.asset.json';
import springTideAsset from '@/assets/hotels/capetown-springtimeinn.jpg.asset.json';
import tenOnCampsBayAsset from '@/assets/hotels/capetown-10on-campsbay.jpg.asset.json';
import homeSuiteAsset from '@/assets/hotels/capetown-homesuitehotels.jpg.asset.json';
import threeOnCampsBayAsset from '@/assets/hotels/capetown-3oncampsbay.jpg.asset.json';
import capeDiamondAsset from '@/assets/hotels/capetown-capediamond.jpg.asset.json';

export const capeTownPremiumImageMap: Record<string, string> = {
  'Sea Point Apartment': seaPointApartmentAsset.url,
  'Spring Tide Inn by CTHA': springTideAsset.url,
  'Home Suite Hotels Sea Point': homeSuiteAsset.url,
  '3 On Camps Bay': threeOnCampsBayAsset.url,
  '10 On Camps Bay': tenOnCampsBayAsset.url,
  'Cape Diamond Boutique Hotel': capeDiamondAsset.url,
};

export function getCapeTownPremiumImage(hotelName: string): string | undefined {
  return capeTownPremiumImageMap[hotelName];
}

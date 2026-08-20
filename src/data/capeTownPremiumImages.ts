// Cape Town hotel images (real property photos)
import seaPointApartmentAsset from '@/assets/hotels/capetown-seapoint-apartment.jpg.asset.json';
import springTideAsset from '@/assets/hotels/capetown-springtimeinn.jpg.asset.json';
import tenOnCampsBayAsset from '@/assets/hotels/capetown-10on-campsbay.jpg.asset.json';
import homeSuiteAsset from '@/assets/hotels/capetown-homesuitehotels.jpg.asset.json';
import threeOnCampsBayAsset from '@/assets/hotels/capetown-3oncampsbay.jpg.asset.json';
import capeDiamondAsset from '@/assets/hotels/capetown-capediamond.jpg.asset.json';
import holidayInnAsset from '@/assets/hotels/capetown-holidayinnexpresscapetown.jpg.asset.json';
import hotelSkyAsset from '@/assets/hotels/capetown-hotelskycapetown.jpg.asset.json';
import crestaGrandeAsset from '@/assets/hotels/capetown-crestagrandecapetown.jpg.asset.json';
import onomoSquareAsset from '@/assets/hotels/capetown-onomohotelinnonthesquare.jpg.asset.json';
import southernSunAsset from '@/assets/hotels/capetown-southensunwaterfront.jpg.asset.json';
import proteaSeaPointAsset from '@/assets/hotels/capetown-proteahotelbymarriotcapetown.jpg.asset.json';
import bantryAsset from '@/assets/hotels/capetown-thebantryaparthotelbytot.jpg.asset.json';
import casaOnKeiAsset from '@/assets/hotels/capetown-casaonkeibytotalstay.jpg.asset.json';
import rivieraSuitesAsset from '@/assets/hotels/capetown-firstgrouprivierasuites.jpg.asset.json';
import campsBayVillageAsset from '@/assets/hotels/capetown-campsbayvillage.jpg.asset.json';
import fountainsAsset from '@/assets/hotels/capetown-fountainshotel.jpg.asset.json';
import radissonForeshoreAsset from '@/assets/hotels/capetown-radissonhotelcapetownfor.jpg.asset.json';
import onomoForeshoreAsset from '@/assets/hotels/capetown-onomohotelforeshorecapet.jpg.asset.json';
import cliftonYoloAsset from '@/assets/hotels/capetown-cliftonyolospacescapetow.jpg.asset.json';
import radissonRedAsset from '@/assets/hotels/capetown-radissonredhotelvawaterf.jpg.asset.json';
import capeGraceAsset from '@/assets/hotels/capetown-capegracevawaterfront.jpg.asset.json';
import waterfrontVillageAsset from '@/assets/hotels/capetown-waterfrontvillagevawater.jpg.asset.json';
import presidentAsset from '@/assets/hotels/capetown-presidenthotel.jpg.asset.json';
import bayHotelAsset from '@/assets/hotels/capetown-thebayhotelcampsbay.jpg.asset.json';
import marlyAsset from '@/assets/hotels/capetown-marly.jpg.asset.json';
import twelveApostlesAsset from '@/assets/hotels/capetown-twelveapostles-new.jpg.asset.json';
import capeGraceNewAsset from '@/assets/hotels/capetown-capegrace-new.jpg.asset.json';
import radissonRedNewAsset from '@/assets/hotels/capetown-radissonred-new.png.asset.json';
import firstBeach203Asset from '@/assets/hotels/capetown-firstbeach203.jpg.asset.json';
import onomoForeshoreNewAsset from '@/assets/hotels/capetown-onomoforeshore-new.jpg.asset.json';
import radissonForeshoreNewAsset from '@/assets/hotels/capetown-radissonforeshore-new.jpg.asset.json';
import campsBayStudioAsset from '@/assets/hotels/capetown-campsbaystudio.jpg.asset.json';
import campsBayBeachFrontAsset from '@/assets/hotels/capetown-campsbaybeachfront.jpg.asset.json';

export const capeTownPremiumImageMap: Record<string, string> = {
  'Sea Point Apartment': seaPointApartmentAsset.url,
  'Spring Tide Inn by CTHA': springTideAsset.url,
  'Home Suite Hotels Sea Point': homeSuiteAsset.url,
  '3 On Camps Bay': threeOnCampsBayAsset.url,
  '10 On Camps Bay': tenOnCampsBayAsset.url,
  'Cape Diamond Boutique Hotel': capeDiamondAsset.url,
  'Holiday Inn Express Cape Town City Centre': holidayInnAsset.url,
  'Hotel Sky Cape Town': hotelSkyAsset.url,
  'Cresta Grande Cape Town': crestaGrandeAsset.url,
  'ONOMO Hotel Cape Town Inn On The Square': onomoSquareAsset.url,
  'Southern Sun Waterfront': southernSunAsset.url,
  'Protea Hotel Sea Point': proteaSeaPointAsset.url,
  'The Bantry Aparthotel by Totalstay': bantryAsset.url,
  'Casa on Kei by Totalstay': casaOnKeiAsset.url,
  'First Group Riviera Suites': rivieraSuitesAsset.url,
  'Camps Bay Village': campsBayVillageAsset.url,
  'Fountains Hotel': fountainsAsset.url,
  'Radisson Hotel Cape Town Foreshore': radissonForeshoreAsset.url,
  'ONOMO Hotel Foreshore': onomoForeshoreAsset.url,
  'Clifton YOLO Spaces': cliftonYoloAsset.url,
  'Radisson RED Hotel V&A Waterfront': radissonRedAsset.url,
  'Cape Grace V&A Waterfront': capeGraceAsset.url,
  'Waterfront Village V&A Waterfront': waterfrontVillageAsset.url,
  'President Hotel': presidentAsset.url,
  'The Bay Hotel': bayHotelAsset.url,
  'Twelve Apostles Hotel & Spa': twelveApostlesAsset.url,
};


export function getCapeTownPremiumImage(hotelName: string): string | undefined {
  return capeTownPremiumImageMap[hotelName];
}

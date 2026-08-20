// uMdloti hotel images (real named properties only)
import clubMykonosAsset from '@/assets/hotels/umdloti-club-mykonos.jpg.asset.json';
import theVillaAsset from '@/assets/hotels/umdloti-the-villa.jpg.asset.json';
import cabanasAsset from '@/assets/hotels/umdloti-cabanas.jpg.asset.json';
import holidayResortAsset from '@/assets/hotels/umdloti-holiday-resort-apartments.jpg.asset.json';
import sandsBeachAsset from '@/assets/hotels/umdloti-sands-beach-breaks.jpg.asset.json';
import camarqueAsset from '@/assets/hotels/umdloti-94-camarque.jpg.asset.json';

export const umdlotiPremiumImageMap: Record<string, string> = {
  'Club Mykonos Umdloti': clubMykonosAsset.url,
  'The Villa Umdloti': theVillaAsset.url,
  'Umdloti Cabanas': cabanasAsset.url,
  'Umdloti Holiday Resort Apartments': holidayResortAsset.url,
  'Umdloti Holiday Resort Apartments — Superior Apartment': holidayResortAsset.url,
  'Sands Beach Breaks Umdloti Luxury Beach Front': sandsBeachAsset.url,
  '94 Camarque Umdloti': camarqueAsset.url,
};

export function getUmdlotiHotelImage(hotelName: string): string | undefined {
  return umdlotiPremiumImageMap[hotelName];
}

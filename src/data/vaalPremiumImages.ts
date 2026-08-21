// Vaal River hotel images (real named properties only)
import rivieraAsset from '@/assets/hotels/vaal-riviera-on-vaal.webp.asset.json';
import cliviaAsset from '@/assets/hotels/vaal-clivia-lodge.webp.asset.json';
import troasAsset from '@/assets/hotels/vaal-troas.jpg.asset.json';
import twelveOnVaalAsset from '@/assets/hotels/vaal-12-on-vaal.jpg.asset.json';
import casaAngeloAsset from '@/assets/hotels/vaal-casa-angelo.jpg.asset.json';
import emeraldAsset from '@/assets/hotels/vaal-emerald-casino-hotel.jpg.asset.json';

const emeraldRoomTypes = [
  'Queen Room',
  'Standard Twin Room',
  'One-Bedroom Chalet',
  'Two-Bedroom Chalet',
  'Bungalow',
  'Two-Bedroom Bungalow',
  'One-Bedroom Apartment (Non-Smoking)',
  'King Suite',
];

export const vaalPremiumImageMap: Record<string, string> = {
  'Riviera on the Vaal': rivieraAsset.url,
  'Clivia Lodge': cliviaAsset.url,
  'Troas Boutique Hotel': troasAsset.url,
  '12 On Vaal Drive Guesthouse': twelveOnVaalAsset.url,
  'Casa Angelo': casaAngeloAsset.url,
  'Emerald Casino Hotel': emeraldAsset.url,
  ...Object.fromEntries(
    emeraldRoomTypes.map((room) => [`Emerald Casino Hotel — ${room}`, emeraldAsset.url]),
  ),
};

export function getVaalPremiumImage(hotelName: string): string | undefined {
  return vaalPremiumImageMap[hotelName];
}

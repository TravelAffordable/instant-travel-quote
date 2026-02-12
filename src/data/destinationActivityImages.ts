// Destination Activity Images - AI-generated images depicting real activities per destination
// Used in QuoteCard carousels to show what activities are included in packages
// Each destination's images match the actual package inclusions

// Durban Activities (uShaka Marine, boat cruise, open top bus tour, spa/massage)
import durbanUshaka from '@/assets/activities/durban-ushaka-marine.jpg';
import durbanBoatCruise from '@/assets/activities/durban-boat-cruise.jpg';
import durbanOpenTopBus from '@/assets/activities/durban-open-top-bus.jpg';
import durbanSpaMassage from '@/assets/activities/durban-spa-massage.jpg';

// Umhlanga Activities (beach aerial, waterpark, Moses Mabhida, beachfront segway)
import umhlangaBeach from '@/assets/activities/umhlanga-beach.jpg';
import umhlangaGatewayMall from '@/assets/activities/umhlanga-gateway-mall.jpg';
import durbanMosesMabhida from '@/assets/activities/durban-moses-mabhida.jpg';
import durbanBeachfrontSegway from '@/assets/activities/durban-beachfront-segway.jpg';

// Hartbeespoort / Magalies Activities
import hartiesBoatCruise from '@/assets/activities/harties-boat-cruise.jpg';
import hartiesCableway from '@/assets/activities/harties-cableway.jpg';
import hartiesHorseRiding from '@/assets/activities/harties-horse-riding.jpg';
import hartiesSafariPark from '@/assets/activities/harties-safari-park.jpg';

// Magaliesburg-specific Activities (Sterkfontein Caves, Rhino Park game drive, horse riding, boat cruise)
import magaliesSterkfontein from '@/assets/activities/magalies-sterkfontein.jpg';
import magaliesGameDrive from '@/assets/activities/magalies-game-drive.jpg';

// Cape Town Activities (Table Mountain, Robben Island, canal cruise, wine route)
import capetownTableMountain from '@/assets/activities/capetown-table-mountain.jpg';
import capetownRobbenIsland from '@/assets/activities/capetown-robben-island.jpg';
import capetownCanalCruise from '@/assets/activities/capetown-canal-cruise.jpg';
import capetownWineRoute from '@/assets/activities/capetown-wine-route.jpg';

// Sun City Activities (Valley of Waves, game drive, resort, quad biking)
import suncityValleyWaves from '@/assets/activities/suncity-valley-waves.jpg';
import suncityGameDrive from '@/assets/activities/suncity-game-drive.jpg';
import suncityResort from '@/assets/activities/suncity-resort.jpg';
import suncityQuadBiking from '@/assets/activities/suncity-quad-biking.jpg';

// Mpumalanga Activities (God's Window, Kruger safari, Blyde Canyon, Graskop Gorge)
import mpumalangaGodsWindow from '@/assets/activities/mpumalanga-gods-window.jpg';
import mpumalangaKrugerSafari from '@/assets/activities/mpumalanga-kruger-safari.jpg';
import mpumalangaBlydeCanyon from '@/assets/activities/mpumalanga-blyde-canyon.jpg';
import mpumalangaGraskopGorge from '@/assets/activities/mpumalanga-graskop-gorge.jpg';

// Bela Bela Activities (waterpark, game drive, hot springs, quad biking)
import belabelaWaterpark from '@/assets/activities/belabela-waterpark.jpg';
import belabelaGameDrive from '@/assets/activities/belabela-game-drive.jpg';
import belabelaHotSprings from '@/assets/activities/belabela-hot-springs.jpg';
import belabelaQuadBiking from '@/assets/activities/belabela-quad-biking.jpg';

// Vaal River Activities (aquadome waterpark, lunch cruise, game drive, boat cruise)
import vaalAquadome from '@/assets/activities/vaal-aquadome.jpg';
import vaalLunchCruise from '@/assets/activities/vaal-lunch-cruise.jpg';
import vaalGameDrive from '@/assets/activities/vaal-game-drive.jpg';
import vaalBoatCruise from '@/assets/activities/vaal-boat-cruise.jpg';

// Knysna Activities (sunset cruise, forest quad biking, Knysna Heads, Knysna Forest)
import knysnaSunsetCruise from '@/assets/activities/knysna-sunset-cruise.jpg';
import knysnaQuadBiking from '@/assets/activities/knysna-quad-biking.jpg';
import knysnaHeads from '@/assets/activities/knysna-heads.jpg';
import knysnaForest from '@/assets/activities/knysna-forest.jpg';

// Map destination IDs to their activity images (4 images per destination for carousel)
// Images are chosen to match the most common activities across packages for each destination
export const destinationActivityImages: Record<string, string[]> = {
  // Durban: uShaka Marine World, boat cruise, open top bus tour, spa/massage
  'durban': [durbanUshaka, durbanBoatCruise, durbanOpenTopBus, durbanSpaMassage],
  
  // Umhlanga: beach aerial, waterpark, Moses Mabhida, beachfront segway
  'umhlanga': [umhlangaBeach, umhlangaGatewayMall, durbanMosesMabhida, durbanBeachfrontSegway],
  
  // Hartbeespoort: boat cruise, cableway, horse riding, animal/safari park
  'harties': [hartiesBoatCruise, hartiesCableway, hartiesHorseRiding, hartiesSafariPark],
  
  // Magaliesburg: Sterkfontein Caves, Rhino Park game drive, horse riding, boat cruise
  'magalies': [magaliesSterkfontein, magaliesGameDrive, hartiesHorseRiding, hartiesBoatCruise],
  
  // Cape Town: Table Mountain, Robben Island, canal cruise, wine route
  'cape-town': [capetownTableMountain, capetownRobbenIsland, capetownCanalCruise, capetownWineRoute],
  
  // Sun City: Valley of Waves, game drive, resort, quad biking
  'sun-city': [suncityValleyWaves, suncityGameDrive, suncityResort, suncityQuadBiking],
  
  // Mpumalanga: God's Window, Kruger safari, Blyde River Canyon, Graskop Gorge
  'mpumalanga': [mpumalangaGodsWindow, mpumalangaKrugerSafari, mpumalangaBlydeCanyon, mpumalangaGraskopGorge],
  
  // Bela Bela: waterpark, game drive, hot springs, quad biking
  'bela-bela': [belabelaWaterpark, belabelaGameDrive, belabelaHotSprings, belabelaQuadBiking],
  
  // Vaal River: aquadome waterpark, lunch cruise, game drive, boat cruise
  'vaal-river': [vaalAquadome, vaalLunchCruise, vaalGameDrive, vaalBoatCruise],
  
  // Knysna: sunset wine & oyster cruise, forest quad biking, Knysna Heads, Knysna Forest
  'knysna': [knysnaSunsetCruise, knysnaQuadBiking, knysnaHeads, knysnaForest],
};

/**
 * Get activity images for a given destination.
 * Returns 4 activity images for the carousel, or falls back to a default set.
 */
export function getActivityImagesForDestination(destination: string): string[] {
  // Normalize destination ID
  const normalized = destination.toLowerCase().replace(/\s+/g, '-');
  
  // Direct match
  if (destinationActivityImages[normalized]) {
    return destinationActivityImages[normalized];
  }
  
  // Try partial matches
  for (const [key, images] of Object.entries(destinationActivityImages)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return images;
    }
  }
  
  // Default fallback - use Harties images as generic SA travel
  return destinationActivityImages['harties'];
}

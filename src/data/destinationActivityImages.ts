// Destination Activity Images - AI-generated images depicting real activities per destination
// Used in QuoteCard carousels to show what activities are included in packages

// Durban Activities
import durbanUshaka from '@/assets/activities/durban-ushaka-marine.jpg';
import durbanBoatCruise from '@/assets/activities/durban-boat-cruise.jpg';
import durbanMosesMabhida from '@/assets/activities/durban-moses-mabhida.jpg';
import durbanBeachfrontSegway from '@/assets/activities/durban-beachfront-segway.jpg';

// Hartbeespoort / Magalies Activities
import hartiesBoatCruise from '@/assets/activities/harties-boat-cruise.jpg';
import hartiesCableway from '@/assets/activities/harties-cableway.jpg';
import hartiesHorseRiding from '@/assets/activities/harties-horse-riding.jpg';
import hartiesSafariPark from '@/assets/activities/harties-safari-park.jpg';

// Cape Town Activities
import capetownTableMountain from '@/assets/activities/capetown-table-mountain.jpg';
import capetownRobbenIsland from '@/assets/activities/capetown-robben-island.jpg';
import capetownPenguins from '@/assets/activities/capetown-penguins.jpg';
import capetownWineRoute from '@/assets/activities/capetown-wine-route.jpg';

// Sun City Activities
import suncityValleyWaves from '@/assets/activities/suncity-valley-waves.jpg';
import suncityGameDrive from '@/assets/activities/suncity-game-drive.jpg';
import suncityResort from '@/assets/activities/suncity-resort.jpg';
import suncityGolf from '@/assets/activities/suncity-golf.jpg';

// Mpumalanga Activities
import mpumalangaGodsWindow from '@/assets/activities/mpumalanga-gods-window.jpg';
import mpumalangaKrugerSafari from '@/assets/activities/mpumalanga-kruger-safari.jpg';
import mpumalangaBlydeCanyon from '@/assets/activities/mpumalanga-blyde-canyon.jpg';
import mpumalangaGraskopGorge from '@/assets/activities/mpumalanga-graskop-gorge.jpg';

// Bela Bela Activities
import belabelaHotSprings from '@/assets/activities/belabela-hot-springs.jpg';
import belabelaGameDrive from '@/assets/activities/belabela-game-drive.jpg';
import belabelaQuadBiking from '@/assets/activities/belabela-quad-biking.jpg';
import belabelaZebulaGolf from '@/assets/activities/belabela-zebula-golf.jpg';

// Vaal River Activities
import vaalBoatCruise from '@/assets/activities/vaal-boat-cruise.jpg';
import vaalWaterSkiing from '@/assets/activities/vaal-water-skiing.jpg';
import vaalJetSki from '@/assets/activities/vaal-jet-ski.jpg';
import vaalFishing from '@/assets/activities/vaal-fishing.jpg';

// Map destination IDs to their activity images (4 images per destination for carousel)
export const destinationActivityImages: Record<string, string[]> = {
  // Durban destinations
  'durban': [durbanUshaka, durbanBoatCruise, durbanMosesMabhida, durbanBeachfrontSegway],
  'umhlanga': [durbanUshaka, durbanBoatCruise, durbanMosesMabhida, durbanBeachfrontSegway],
  
  // Hartbeespoort / Magalies destinations
  'harties': [hartiesBoatCruise, hartiesCableway, hartiesHorseRiding, hartiesSafariPark],
  'magalies': [hartiesBoatCruise, hartiesCableway, hartiesHorseRiding, hartiesSafariPark],
  
  // Cape Town
  'cape-town': [capetownTableMountain, capetownRobbenIsland, capetownPenguins, capetownWineRoute],
  
  // Sun City
  'sun-city': [suncityValleyWaves, suncityGameDrive, suncityResort, suncityGolf],
  
  // Mpumalanga
  'mpumalanga': [mpumalangaGodsWindow, mpumalangaKrugerSafari, mpumalangaBlydeCanyon, mpumalangaGraskopGorge],
  
  // Bela Bela
  'bela-bela': [belabelaHotSprings, belabelaGameDrive, belabelaQuadBiking, belabelaZebulaGolf],
  
  // Vaal River
  'vaal-river': [vaalBoatCruise, vaalWaterSkiing, vaalJetSki, vaalFishing],
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

// Package-specific images for the visual package selection grid
// Maps package IDs to their representative images

// Durban Activities
import durbanUshaka from '@/assets/activities/durban-ushaka-marine.jpg';
import durbanBoatCruise from '@/assets/activities/durban-boat-cruise.jpg';
import durbanOpenTopBus from '@/assets/activities/durban-open-top-bus.jpg';
import durbanSpaMassage from '@/assets/activities/durban-spa-massage.jpg';

// Umhlanga Activities
import umhlangaBeach from '@/assets/activities/umhlanga-beach.jpg';
import umhlangaGatewayMall from '@/assets/activities/umhlanga-gateway-mall.jpg';
import durbanMosesMabhida from '@/assets/activities/durban-moses-mabhida.jpg';
import durbanBeachfrontSegway from '@/assets/activities/durban-beachfront-segway.jpg';

// Harties Activities
import hartiesBoatCruise from '@/assets/activities/harties-boat-cruise.jpg';
import hartiesCableway from '@/assets/activities/harties-cableway.jpg';
import hartiesHorseRiding from '@/assets/activities/harties-horse-riding.jpg';
import hartiesSafariPark from '@/assets/activities/harties-safari-park.jpg';
import hartiesLittleParis from '@/assets/activities/harties-little-paris.jpg';
import hartiesCoupleJetski from '@/assets/activities/harties-couple-jetski.jpg';
import hartiesRomanticHorseRiding from '@/assets/activities/harties-romantic-horse-riding.jpg';

// Magaliesburg Activities
import magaliesGameDrive from '@/assets/activities/magalies-game-drive.jpg';
import culturalVillage from '@/assets/activities/cultural-village.jpg';
import elephantExperience from '@/assets/activities/elephant-experience.jpg';
import zipliningAdventure from '@/assets/activities/ziplining-adventure.jpg';
import cheetahCentre from '@/assets/activities/cheetah-centre.jpg';
import fullBodyMassageSpa from '@/assets/activities/full-body-massage-spa.jpg';

// Cape Town Activities
import capetownTableMountain from '@/assets/activities/capetown-table-mountain.jpg';
import capetownRobbenIsland from '@/assets/activities/capetown-robben-island.jpg';
import capetownCanalCruise from '@/assets/activities/capetown-canal-cruise.jpg';
import capetownWineRoute from '@/assets/activities/capetown-wine-route.jpg';

// Sun City Activities
import suncityValleyWaves from '@/assets/activities/suncity-valley-waves.jpg';
import suncityGameDrive from '@/assets/activities/suncity-game-drive.jpg';
import suncityResort from '@/assets/activities/suncity-resort.jpg';
import suncityQuadBiking from '@/assets/activities/suncity-quad-biking.jpg';

// Mpumalanga Activities
import mpumalangaGodsWindow from '@/assets/activities/mpumalanga-gods-window.jpg';
import mpumalangaKrugerSafari from '@/assets/activities/mpumalanga-kruger-safari.jpg';
import mpumalangaBlydeCanyon from '@/assets/activities/mpumalanga-blyde-canyon.jpg';
import mpumalangaGraskopGorge from '@/assets/activities/mpumalanga-graskop-gorge.jpg';

// Bela Bela Activities
import belabelaWaterpark from '@/assets/activities/belabela-waterpark.jpg';
import belabelaGameDrive from '@/assets/activities/belabela-game-drive.jpg';
import belabelaHotSprings from '@/assets/activities/belabela-hot-springs.jpg';
import belabelaQuadBiking from '@/assets/activities/belabela-quad-biking.jpg';

// Vaal River Activities
import vaalAquadome from '@/assets/activities/vaal-aquadome.jpg';
import vaalLunchCruise from '@/assets/activities/vaal-lunch-cruise.jpg';
import vaalGameDrive from '@/assets/activities/vaal-game-drive.jpg';
import vaalBoatCruise from '@/assets/activities/vaal-boat-cruise.jpg';

// Knysna Activities
import knysnaSunsetCruise from '@/assets/activities/knysna-sunset-cruise.jpg';
import knysnaQuadBiking from '@/assets/activities/knysna-quad-biking.jpg';
import knysnaHeads from '@/assets/activities/knysna-heads.jpg';
import knysnaForest from '@/assets/activities/knysna-forest.jpg';

export const packageImages: Record<string, string> = {
  // ============= DURBAN =============
  'dur1': durbanUshaka,
  'dur2': durbanOpenTopBus,
  'dur3': durbanSpaMassage,
  'dur4': durbanBoatCruise,
  'dur5': durbanUshaka,
  'dur6': durbanBoatCruise,
  'dur7': durbanSpaMassage,
  'dur8': durbanOpenTopBus,

  // ============= UMHLANGA =============
  'umhla1': umhlangaGatewayMall,
  'umhla2': durbanUshaka,
  'umhla3': umhlangaBeach,
  'umhla4': durbanBeachfrontSegway,

  // ============= HARTIES =============
  'hg1': hartiesBoatCruise,
  'hg2': hartiesHorseRiding,
  'hg3': hartiesSafariPark,
  'hg4': elephantExperience,
  'hg5': hartiesLittleParis,
  'hg6': hartiesCableway,
  'hg7': hartiesBoatCruise,
  'hg8': hartiesSafariPark,
  'hg9': hartiesRomanticHorseRiding,
  'hg10': hartiesCoupleJetski,
  'hg11': hartiesBoatCruise,
  'hg12': fullBodyMassageSpa,

  // ============= MAGALIESBURG =============
  'mag1': culturalVillage,
  'mag2': magaliesGameDrive,
  'mag3': fullBodyMassageSpa,
  'mag4': magaliesGameDrive,
  'mag5': hartiesHorseRiding,
  'mag6': fullBodyMassageSpa,

  // ============= CAPE TOWN =============
  'cpt1': capetownRobbenIsland,
  'cpt2': capetownTableMountain,
  'cptfw': capetownWineRoute,
  'cptwtcm': capetownCanalCruise,

  // ============= SUN CITY =============
  'sun1': suncityValleyWaves,
  'sun2': suncityQuadBiking,
  'sun3': suncityValleyWaves,
  'sun4': suncityGameDrive,
  'sun5': suncityResort,
  'sun6': suncityResort,
  'sun7': suncityValleyWaves,
  'sun8': suncityQuadBiking,

  // ============= MPUMALANGA =============
  'mp1': mpumalangaBlydeCanyon,
  'mp2': mpumalangaGraskopGorge,
  'mp3': mpumalangaKrugerSafari,
  'mp4': mpumalangaGodsWindow,

  // ============= BELA BELA =============
  'bela1': belabelaWaterpark,
  'bela2': belabelaGameDrive,
  'bela3': belabelaGameDrive,
  'bela4': belabelaHotSprings,
  'bela5': belabelaQuadBiking,

  // ============= VAAL RIVER =============
  'emer1': vaalAquadome,
  'emer2': vaalBoatCruise,
  'emer3': vaalLunchCruise,

  // ============= KNYSNA =============
  'kny1': knysnaSunsetCruise,

  // ============= THE BLYDE =============
  'bly1': belabelaHotSprings,

  // ============= INTERNATIONAL =============
  'bali-ubud-6day-explorer': capetownTableMountain,
  'dubai-getaway-1': suncityResort,
  'phuket-adventure-explorer': umhlangaBeach,
};

export const getPackageImage = (packageId: string): string | undefined => {
  return packageImages[packageId];
};

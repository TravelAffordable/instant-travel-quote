// Package-specific images for the visual package selection grid
// Maps package IDs to their representative images
// RULE: Each package ID must use a UNIQUE image — no duplicates across destinations.

// Durban Activities
import durbanUshaka from '@/assets/activities/durban-ushaka-marine.jpg';
import durbanBoatCruise from '@/assets/activities/durban-boat-cruise.jpg';
import durbanOpenTopBus from '@/assets/activities/durban-open-top-bus.jpg';
import durbanSpaMassage from '@/assets/activities/durban-spa-massage.jpg';
import durbanMosesMabhida from '@/assets/activities/durban-moses-mabhida.jpg';
import durbanBeachfrontSegway from '@/assets/activities/durban-beachfront-segway.jpg';
import durbanUmhlangaTrip from '@/assets/activities/durban-umhlanga-trip.jpg';
import isleOfCapriCruise from '@/assets/activities/isle-of-capri-boat-cruise.jpg';
import luxuryCanalCruise from '@/assets/activities/luxury-canal-boat-cruise.jpg';
import gondolaBoatCruise from '@/assets/activities/gondola-boat-cruise.jpg';
import romanticBirthdayRoom from '@/assets/activities/romantic-birthday-room.jpg';
import ushakaMarineWorld from '@/assets/activities/ushaka-marine-world.jpg';

// Umhlanga Activities
import umhlangaBeach from '@/assets/activities/umhlanga-beach.jpg';
import umhlangaGatewayMall from '@/assets/activities/umhlanga-gateway-mall.jpg';
import segwayGlidesBeach from '@/assets/activities/segway-glides-beach.jpg';

// Harties Activities
import hartiesBoatCruise from '@/assets/activities/harties-boat-cruise.jpg';
import hartiesCableway from '@/assets/activities/harties-cableway.jpg';
import hartiesHorseRiding from '@/assets/activities/harties-horse-riding.jpg';
import hartiesSafariPark from '@/assets/activities/harties-safari-park.jpg';
import hartiesLittleParis from '@/assets/activities/harties-little-paris.jpg';
import hartiesCoupleJetski from '@/assets/activities/harties-couple-jetski.jpg';
import hartiesRomanticHorseRiding from '@/assets/activities/harties-romantic-horse-riding.jpg';
import hartiesLeisureDeck from '@/assets/activities/harties-leisure-deck.jpg';
import hartiesCoupleQuad from '@/assets/activities/harties-couple-quad.jpg';
import hartiesSunsetBuffetCruise from '@/assets/activities/harties-sunset-buffet-cruise.jpg';

// Magaliesburg Activities
import magaliesGameDrive from '@/assets/activities/magalies-game-drive.jpg';
import magaliesSterkfontein from '@/assets/activities/magalies-sterkfontein.jpg';
import magaliesPrivatePicnic from '@/assets/activities/magalies-private-picnic.jpg';
import magaliesBuffetCruise from '@/assets/activities/magalies-buffet-cruise.jpg';
import culturalVillage from '@/assets/activities/cultural-village.jpg';
import elephantExperience from '@/assets/activities/elephant-experience.jpg';
import zipliningAdventure from '@/assets/activities/ziplining-adventure.jpg';
import cheetahCentre from '@/assets/activities/cheetah-centre.jpg';
import fullBodyMassageSpa from '@/assets/activities/full-body-massage-spa.jpg';
import reptileShow from '@/assets/activities/reptile-show.jpg';

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
import suncityGolf from '@/assets/activities/suncity-golf.jpg';
import suncitySpa from '@/assets/activities/suncity-spa.jpg';
import airportShuttle from '@/assets/activities/airport-shuttle.jpg';

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
import belabelaZebulaGolf from '@/assets/activities/belabela-zebula-golf.jpg';

// Vaal River Activities
import vaalAquadome from '@/assets/activities/vaal-aquadome.jpg';
import vaalLunchCruise from '@/assets/activities/vaal-lunch-cruise.jpg';
import vaalGameDrive from '@/assets/activities/vaal-game-drive.jpg';
import vaalBoatCruise from '@/assets/activities/vaal-boat-cruise.jpg';

// Knysna Activities
import knysnaSunsetCruise from '@/assets/activities/knysna-sunset-cruise.jpg';

// The Blyde
import blydeResortSpa from '@/assets/activities/blyde-resort-spa.jpg';

// International Activities
import baliUbud from '@/assets/activities/bali-ubud.jpg';
import dubaiSkyline from '@/assets/activities/dubai-skyline.jpg';
import phuketBeach from '@/assets/activities/phuket-beach.jpg';

export const packageImages: Record<string, string> = {
  // ============= DURBAN =============
  'dur1': isleOfCapriCruise,        // Ushaka + Isle of Capri cruise + spa
  'dur2': durbanOpenTopBus,         // Open bus city tour
  'dur3': durbanSpaMassage,         // Spa day + canal cruise
  'dur4': durbanBoatCruise,         // Nightlife + canal boat
  'dur5': durbanUshaka,             // Couple beach + Ushaka
  'dur6': gondolaBoatCruise,        // Couple boat cruise
  'dur7': romanticBirthdayRoom,     // Couple nightlife escape
  'dur8': durbanMosesMabhida,       // Couple open top bus / city

  // ============= UMHLANGA =============
  'umhla1': umhlangaGatewayMall,    // Gateway Mall + beach
  'umhla2': luxuryCanalCruise,      // Ushaka + luxury canal cruise
  'umhla3': umhlangaBeach,          // Three beaches getaway
  'umhla4': durbanBeachfrontSegway, // Romance + Ushaka + gondola

  // ============= HARTIES =============
  'hg1': hartiesLeisureDeck,        // Leisuretime
  'hg2': hartiesHorseRiding,        // Funtime
  'hg3': hartiesSafariPark,         // Family fun weekender
  'hg4': elephantExperience,        // Elephant sanctuary + horse/quad + cableway
  'hg5': hartiesLittleParis,        // Upside down house + Little Paris
  'hg6': hartiesCableway,           // Full day cableway
  'hg7': hartiesSunsetBuffetCruise, // Couple sunset buffet cruise
  'hg8': hartiesCoupleQuad,         // Couple quad biking
  'hg9': hartiesRomanticHorseRiding,// Romance + horse + cableway
  'hg10': hartiesCoupleJetski,      // Jet ski fun
  'hg11': hartiesBoatCruise,        // Wake snake + sunset cruise
  'hg12': fullBodyMassageSpa,       // Water tube + massage

  // ============= MAGALIESBURG =============
  'mag1': culturalVillage,          // Cradle of Mankind + Sterkfontein + game drive
  'mag2': magaliesBuffetCruise,     // Lux + buffet cruise + game drive
  'mag3': cheetahCentre,            // Half day spa + game + sunset cruise
  'mag4': magaliesGameDrive,        // Budget game drive + massage
  'mag5': magaliesSterkfontein,     // Horse + quad + private picnic
  'mag6': magaliesPrivatePicnic,    // Horse + spa + picnic

  // ============= CAPE TOWN =============
  'cpt1': capetownRobbenIsland,
  'cpt2': capetownTableMountain,
  'cptfw': capetownWineRoute,
  'cptwtcm': capetownCanalCruise,

  // ============= SUN CITY =============
  'sun1': suncityValleyWaves,       // Valley of Waves + maze + Sunday lunch
  'sun2': suncityQuadBiking,        // Valley + quad biking
  'sun3': airportShuttle,           // Valley + shuttle
  'sun4': suncityGameDrive,         // Valley + game drive
  'sun5': suncitySpa,               // Half day spa + game + Valley
  'sun6': segwayGlidesBeach,        // Valley + segway
  'sun7': suncityResort,            // Valley + maze + shuttle
  'sun8': zipliningAdventure,       // Valley + zip line

  // ============= MPUMALANGA =============
  'mp1': mpumalangaBlydeCanyon,
  'mp2': mpumalangaGraskopGorge,
  'mp3': mpumalangaKrugerSafari,
  'mp4': mpumalangaGodsWindow,

  // ============= BELA BELA =============
  'bela1': belabelaWaterpark,
  'bela2': belabelaGameDrive,       // Mabalingwe + waterpark
  'bela3': belabelaZebulaGolf,      // Mabula safari (using zebula golf as distinct lodge image)
  'bela4': belabelaHotSprings,      // Zebra Lodge + spa + nature
  'bela5': belabelaQuadBiking,      // Quad + hot springs

  // ============= VAAL RIVER =============
  'emer1': vaalAquadome,
  'emer2': vaalBoatCruise,
  'emer3': vaalLunchCruise,

  // ============= KNYSNA =============
  'kny1': knysnaSunsetCruise,

  // ============= THE BLYDE =============
  'bly1': blydeResortSpa,

  // ============= INTERNATIONAL =============
  'bali-ubud-6day-explorer': baliUbud,
  'dubai-getaway-1': dubaiSkyline,
  'phuket-adventure-explorer': phuketBeach,
};

export const getPackageImage = (packageId: string): string | undefined => {
  return packageImages[packageId];
};

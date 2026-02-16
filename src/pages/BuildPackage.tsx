import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Search, Sparkles, Calculator } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { getChildServiceFeeForAge as getChildServiceFeeForAgeUtil } from '@/lib/childServiceFees';
import { useRMSHotels, type RMSHotel } from '@/hooks/useRMSHotels';
import { toast } from 'sonner';

// Import Durban activity images (DO NOT CHANGE - user confirmed these are perfect)
import ushakaMarineWorldImg from '@/assets/activities/ushaka-marine-world.jpg';
import isleOfCapriImg from '@/assets/activities/isle-of-capri-boat-cruise.jpg';
import mosesMabhidaImg from '@/assets/activities/moses-mabhida-stadium.jpg';
import fullBodyMassageImg from '@/assets/activities/full-body-massage-spa.jpg';
import openTopBusImg from '@/assets/activities/durban-open-top-bus.jpg';
import gondolaBoatImg from '@/assets/activities/gondola-boat-cruise.jpg';
import pedalBoatImg from '@/assets/activities/waterfront-pedal-boat.jpg';
import segwayGlidesImg from '@/assets/activities/segway-glides-beach.jpg';
import airportShuttleImg from '@/assets/activities/airport-shuttle.jpg';
import umhlangaTripImg from '@/assets/activities/durban-umhlanga-trip.jpg';
import romanticRoomImg from '@/assets/activities/romantic-birthday-room.jpg';
import luxuryCanalCruiseImg from '@/assets/activities/luxury-canal-boat-cruise.jpg';

// Import existing activity images for non-Durban destinations
import hartiesBoatCruiseImg from '@/assets/activities/harties-boat-cruise.jpg';
import hartiesCablewayImg from '@/assets/activities/harties-cableway.jpg';
import hartiesHorseRidingImg from '@/assets/activities/harties-horse-riding.jpg';
import hartiesSafariParkImg from '@/assets/activities/harties-safari-park.jpg';
import magaliesSterkfonteinImg from '@/assets/activities/magalies-sterkfontein.jpg';
import magaliesGameDriveImg from '@/assets/activities/magalies-game-drive.jpg';
import capetownTableMountainImg from '@/assets/activities/capetown-table-mountain.jpg';
import capetownRobbenIslandImg from '@/assets/activities/capetown-robben-island.jpg';
import capetownWineRouteImg from '@/assets/activities/capetown-wine-route.jpg';
import capetownCanalCruiseImg from '@/assets/activities/capetown-canal-cruise.jpg';
import capetownPenguinsImg from '@/assets/activities/capetown-penguins.jpg';
import suncityValleyWavesImg from '@/assets/activities/suncity-valley-waves.jpg';
import suncityGameDriveImg from '@/assets/activities/suncity-game-drive.jpg';
import suncityResortImg from '@/assets/activities/suncity-resort.jpg';
import suncityQuadBikingImg from '@/assets/activities/suncity-quad-biking.jpg';
import suncityGolfImg from '@/assets/activities/suncity-golf.jpg';
import mpumalangaGodsWindowImg from '@/assets/activities/mpumalanga-gods-window.jpg';
import mpumalangaKrugerSafariImg from '@/assets/activities/mpumalanga-kruger-safari.jpg';
import mpumalangaBlydeCanonImg from '@/assets/activities/mpumalanga-blyde-canyon.jpg';
import mpumalangaGraskopGorgeImg from '@/assets/activities/mpumalanga-graskop-gorge.jpg';
import belabelaWaterparkImg from '@/assets/activities/belabela-waterpark.jpg';
import belabelaGameDriveImg from '@/assets/activities/belabela-game-drive.jpg';
import belabelaHotSpringsImg from '@/assets/activities/belabela-hot-springs.jpg';
import belabelaQuadBikingImg from '@/assets/activities/belabela-quad-biking.jpg';
import vaalAquadomeImg from '@/assets/activities/vaal-aquadome.jpg';
import vaalLunchCruiseImg from '@/assets/activities/vaal-lunch-cruise.jpg';
import vaalGameDriveImg from '@/assets/activities/vaal-game-drive.jpg';
import vaalBoatCruiseImg from '@/assets/activities/vaal-boat-cruise.jpg';
import umhlangaBeachImg from '@/assets/activities/umhlanga-beach.jpg';
import umhlangaGatewayMallImg from '@/assets/activities/umhlanga-gateway-mall.jpg';
import durbanMosesMabhidaImg from '@/assets/activities/durban-moses-mabhida.jpg';
import durbanBeachfrontSegwayImg from '@/assets/activities/durban-beachfront-segway.jpg';
import knysnaSunsetCruiseImg from '@/assets/activities/knysna-sunset-cruise.jpg';
import knysnaQuadBikingImg from '@/assets/activities/knysna-quad-biking.jpg';
import knysnaHeadsImg from '@/assets/activities/knysna-heads.jpg';
import knysnaForestImg from '@/assets/activities/knysna-forest.jpg';

// Import newly generated AI images
import elephantExperienceImg from '@/assets/activities/elephant-experience.jpg';
import zipliningImg from '@/assets/activities/ziplining-adventure.jpg';
import culturalVillageImg from '@/assets/activities/cultural-village.jpg';
import reptileShowImg from '@/assets/activities/reptile-show.jpg';
import braaiImg from '@/assets/activities/braai-facilities.jpg';
import mabonengTourImg from '@/assets/activities/maboneng-tour.jpg';
import unionBuildingsImg from '@/assets/activities/union-buildings.jpg';
import voortrekkerMonumentImg from '@/assets/activities/voortrekker-monument.jpg';
import cheetahCentreImg from '@/assets/activities/cheetah-centre.jpg';
import emeraldResortImg from '@/assets/activities/emerald-resort.jpg';

// Import hotel images
import sunCityImage from '@/assets/sun-city.jpeg';

// Types
interface Activity {
  name: string;
  image: string;
  rates: {
    adult: number;
    child: number;
    freeAge: number;
    childAgeRange?: { min: number; max: number };
  };
  isComboEntry?: boolean;
  isShuttle?: boolean;
  shuttleBaseCost?: number;
}

// RMS destination mapping
const DESTINATION_TO_RMS: Record<string, string> = {
  'Durban Beachfront Accommodation': 'durban',
  'Harties Cruise and Cableway Accommodation': 'harties',
  'Cape Town Beachfront Accommodation': 'cape-town',
  'Mpumalanga Getaways': 'mpumalanga',
  'Magalies Getaways': 'magalies',
  'Sun City Getaways': 'sun-city',
  'Bela Bela Getaways': 'bela-bela',
  'Umhlanga Beachfront Accommodation': 'umhlanga',
  'Vaal River Getaways': 'vaal',
  'Knysna Garden Route': 'knysna',
  'Pretoria Getaways': 'pretoria',
  'The Blyde Getaways': 'mpumalanga',
};

const RMS_SUPPORTED = ['durban', 'harties', 'cape-town', 'mpumalanga', 'magalies', 'sun-city', 'bela-bela', 'umhlanga', 'vaal', 'vaal-river'];

// Destination list for the dropdown
const destinationList = [
  'Durban Beachfront Accommodation',
  'Harties Cruise and Cableway Accommodation',
  'Cape Town Beachfront Accommodation',
  'Mpumalanga Getaways',
  'Magalies Getaways',
  'Sun City Getaways',
  'Bela Bela Getaways',
  'Umhlanga Beachfront Accommodation',
  'Knysna Garden Route',
  'Vaal River Getaways',
  'Pretoria Getaways',
  'The Blyde Getaways',
  'Johannesburg, Sandton and Soweto Accommodation',
];

// Activities organized by destination with AI-generated thumbnail images
const activitiesByDestination: Record<string, Activity[]> = {
  'Durban Beachfront Accommodation': [
    { name: 'uShaka Marine World Combo Tickets for Sea World and WetnWild per Adult', image: ushakaMarineWorldImg, rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Isle Of Capri Boat Cruise per Adult', image: isleOfCapriImg, rates: { adult: 140, child: 100, freeAge: 0 } },
    { name: 'Moses Mabhida Stadium Tour and Picnic Spot per Adult', image: mosesMabhidaImg, rates: { adult: 200, child: 150, freeAge: 0 } },
    { name: '60 Minute Full Body Massage with Welcome Drinks and Steam, Sauna and Pools per Adult', image: fullBodyMassageImg, rates: { adult: 700, child: 450, freeAge: 12 } },
    { name: 'Durban Open Top Bus Tour per Adult', image: openTopBusImg, rates: { adult: 170, child: 170, freeAge: 0 } },
    { name: 'Gondola Boat Cruise With Picnic Basket for 2 per Adult', image: gondolaBoatImg, rates: { adult: 400, child: 400, freeAge: 0 } },
    { name: '1 Hour Waterfront Canal Pedal Boat for 2 per Adult', image: pedalBoatImg, rates: { adult: 250, child: 250, freeAge: 0 } },
    { name: 'Segway Glides on The Beach from Moses Mabhida to uShaka Marine World per Adult', image: segwayGlidesImg, rates: { adult: 750, child: 750, freeAge: 0 } },
    { name: 'Airport Shuttle to all of Durban and Umhlanga Hotels per Adult', image: airportShuttleImg, rates: { adult: 400, child: 400, freeAge: 0 } },
    { name: 'Trip from Durban Beachfront to Umhlanga Main Beach and Back per Adult', image: umhlangaTripImg, rates: { adult: 600, child: 600, freeAge: 0 } },
    { name: 'Romantic or Birthday Settings in Your Hotel Room per Adult', image: romanticRoomImg, rates: { adult: 1000, child: 1000, freeAge: 0 } },
    { name: 'Luxury Canal Boat Cruise per Adult', image: luxuryCanalCruiseImg, rates: { adult: 200, child: 200, freeAge: 0 } },
  ],
  'Harties Cruise and Cableway Accommodation': [
    { name: '2 Hour Sunset Champagne Buffet Boat Cruise', image: hartiesBoatCruiseImg, rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Lunchtime Buffet Boat Cruise', image: hartiesBoatCruiseImg, rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Breakfast Brunch Buffet Cruise', image: hartiesBoatCruiseImg, rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: 'The Alba Luxury Fine Dining Cruise', image: luxuryCanalCruiseImg, rates: { adult: 820, child: 620, freeAge: 6 } },
    { name: 'Harties Cableway', image: hartiesCablewayImg, rates: { adult: 350, child: 230, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: hartiesHorseRidingImg, rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: '1 Hour Horse Riding and Romantic Picnic', image: hartiesHorseRidingImg, rates: { adult: 700, child: 0, freeAge: 0 } },
    { name: '1 Hour Quad Biking', image: belabelaQuadBikingImg, rates: { adult: 500, child: 500, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: fullBodyMassageImg, rates: { adult: 600, child: 380, freeAge: 0 } },
    { name: 'Lion & Safari Park', image: hartiesSafariParkImg, rates: { adult: 460, child: 300, freeAge: 12 } },
    { name: 'Dikhololo Game Reserve Drive', image: magaliesGameDriveImg, rates: { adult: 480, child: 350, freeAge: 12 } },
  ],
  'Cape Town Beachfront Accommodation': [
    { name: 'Robben Island', image: capetownRobbenIslandImg, rates: { adult: 450, child: 250, freeAge: 1, childAgeRange: { min: 5, max: 18 } } },
    { name: 'Table Mountain Cableway', image: capetownTableMountainImg, rates: { adult: 510, child: 250, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: '2 Days Sightseeing Tour Bus', image: openTopBusImg, rates: { adult: 450, child: 320, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Cape Point and Penguin Explorer', image: capetownPenguinsImg, rates: { adult: 620, child: 420, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: '1 Day Sightseeing Tour Bus', image: openTopBusImg, rates: { adult: 330, child: 210, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Wine Route Tour, Paarl, Franschoek, Stellenbosch', image: capetownWineRouteImg, rates: { adult: 750, child: 440, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Sunset Bus Tour to Signal Hill with Picnic', image: capetownTableMountainImg, rates: { adult: 230, child: 180, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Sunset Champagne Cruise', image: capetownCanalCruiseImg, rates: { adult: 600, child: 350, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'V&A Waterfront Harbour and Seal Cruise', image: capetownCanalCruiseImg, rates: { adult: 120, child: 70, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
  ],
  'Johannesburg, Sandton and Soweto Accommodation': [
    { name: 'Johannesburg and Soweto Bus Tour', image: mabonengTourImg, rates: { adult: 750, child: 390, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Lesedi Cultural Village and Lion And Safari Park', image: culturalVillageImg, rates: { adult: 1400, child: 800, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: '2 Hour Buffet Cruise and Harties Cableway', image: hartiesBoatCruiseImg, rates: { adult: 940, child: 680, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Elephant Sanctuary and Harties Cableway', image: elephantExperienceImg, rates: { adult: 940, child: 580, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Elephant Sanctuary and 2 Hour Fine Dining Luxury Cruise', image: elephantExperienceImg, rates: { adult: 1600, child: 900, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Maboneng outing with 60 minute Swedish Massage', image: mabonengTourImg, rates: { adult: 1050, child: 750, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'The Blyde Spa - 60 Minute Hot Stone Massage', image: fullBodyMassageImg, rates: { adult: 1200, child: 600, freeAge: 0, childAgeRange: { min: 12, max: 18 } } },
  ],
  'Mpumalanga Getaways': [
    { name: 'Mpumalanga Sightseeing Tour', image: mpumalangaGodsWindowImg, rates: { adult: 1700, child: 900, freeAge: 0 } },
    { name: 'Graskop Gorge Lift', image: mpumalangaGraskopGorgeImg, rates: { adult: 300, child: 220, freeAge: 0 } },
    { name: 'Kruger National Park Tour', image: mpumalangaKrugerSafariImg, rates: { adult: 700, child: 450, freeAge: 0 } },
    { name: 'Ziplining Adventure', image: zipliningImg, rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Gorge Suspension Bridge Walk', image: mpumalangaGraskopGorgeImg, rates: { adult: 180, child: 120, freeAge: 0 } },
    { name: 'Quad Biking', image: belabelaQuadBikingImg, rates: { adult: 400, child: 320, freeAge: 0 } },
    { name: 'Blyde River Canyon Tour', image: mpumalangaBlydeCanonImg, rates: { adult: 450, child: 300, freeAge: 0 } },
    { name: "God's Window Viewpoint", image: mpumalangaGodsWindowImg, rates: { adult: 50, child: 30, freeAge: 0 } },
  ],
  'Magalies Getaways': [
    { name: 'Maropeng Cradle of Mankind Origins Centre', image: magaliesSterkfonteinImg, rates: { adult: 350, child: 200, freeAge: 4 } },
    { name: 'Wonder Caves Tour', image: magaliesSterkfonteinImg, rates: { adult: 280, child: 180, freeAge: 4 } },
    { name: 'Guided Game Drive in Safari Truck', image: magaliesGameDriveImg, rates: { adult: 450, child: 300, freeAge: 6 } },
    { name: 'Reptile and Snake Shows', image: reptileShowImg, rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Rhino and Lion Park Entry', image: hartiesSafariParkImg, rates: { adult: 380, child: 250, freeAge: 4 } },
    { name: '60 Minute Full Body Massage', image: fullBodyMassageImg, rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: '2 Hour Sunday Lunch Buffet Boat Cruise', image: hartiesBoatCruiseImg, rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Champagne Sunset Cruise with Buffet', image: hartiesBoatCruiseImg, rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: '2 Hour Spa Treatment with Champagne', image: fullBodyMassageImg, rates: { adult: 850, child: 0, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: hartiesHorseRidingImg, rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: '1 Hour Quad Biking', image: belabelaQuadBikingImg, rates: { adult: 500, child: 500, freeAge: 0 } },
    { name: 'Private Romantic Picnic', image: romanticRoomImg, rates: { adult: 650, child: 0, freeAge: 0 } },
  ],
  'Sun City Getaways': [
    { name: 'Sun City and Valley of the Waves Entrance', image: suncityValleyWavesImg, rates: { adult: 550, child: 400, freeAge: 2, childAgeRange: { min: 2, max: 16 } }, isComboEntry: true },
    { name: 'Pilanesberg Game Drive in Safari Truck', image: suncityGameDriveImg, rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Lunch Inside Sun City', image: suncityResortImg, rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Shuttle to Sun City from Guesthouse', image: airportShuttleImg, rates: { adult: 0, child: 0, freeAge: 0 }, isShuttle: true, shuttleBaseCost: 800 },
    { name: 'Sun City Golf Course', image: suncityGolfImg, rates: { adult: 1200, child: 0, freeAge: 0 } },
    { name: 'Zip Slide Adventure', image: zipliningImg, rates: { adult: 450, child: 350, freeAge: 8 } },
    { name: 'Segway Tour', image: durbanBeachfrontSegwayImg, rates: { adult: 380, child: 380, freeAge: 0 } },
    { name: '1 Hour Quad Biking Fun in Harties', image: suncityQuadBikingImg, rates: { adult: 450, child: 450, freeAge: 10, childAgeRange: { min: 10, max: 17 } } },
    { name: '1 Hour Horse Riding Experience in Harties', image: hartiesHorseRidingImg, rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: 'Upside Down House Mesmerize in Harties', image: suncityResortImg, rates: { adult: 120, child: 80, freeAge: 3 } },
    { name: 'Little Paris Allure in Harties', image: suncityResortImg, rates: { adult: 100, child: 60, freeAge: 3 } },
    { name: 'Sunday Lunch Buffet in Harties', image: hartiesBoatCruiseImg, rates: { adult: 350, child: 200, freeAge: 3 } },
    { name: '1 Hour Pleasure Cruise and Sunday Buffet Lunch in Harties', image: hartiesBoatCruiseImg, rates: { adult: 650, child: 400, freeAge: 6 } },
    { name: 'Harties Cableway', image: hartiesCablewayImg, rates: { adult: 360, child: 220, freeAge: 3 } },
    { name: 'Breakfast Sun City Area Guesthouse A', image: suncityResortImg, rates: { adult: 150, child: 75, freeAge: 0, childAgeRange: { min: 0, max: 5 } } },
  ],
  'Bela Bela Getaways': [
    { name: 'Forever Resorts Waterpark Entry', image: belabelaWaterparkImg, rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Warm Swimming Pools Access', image: belabelaHotSpringsImg, rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: 'Water Slides and Gliders', image: belabelaWaterparkImg, rates: { adult: 180, child: 150, freeAge: 4 } },
    { name: 'Guided Game Drive in Safari Truck', image: belabelaGameDriveImg, rates: { adult: 480, child: 320, freeAge: 6 } },
    { name: 'Elephant Tour and Experience', image: elephantExperienceImg, rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Braai Facilities with Shades', image: braaiImg, rates: { adult: 100, child: 50, freeAge: 0 } },
    { name: 'Hot Springs Bath Experience', image: belabelaHotSpringsImg, rates: { adult: 250, child: 150, freeAge: 3 } },
    { name: 'Quad Biking Adventure', image: belabelaQuadBikingImg, rates: { adult: 450, child: 350, freeAge: 0 } },
  ],
  'Umhlanga Beachfront Accommodation': [
    { name: 'Gateway Theatre of Dreams Shopping Mall', image: umhlangaGatewayMallImg, rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Umhlanga Rocks Main Beach', image: umhlangaBeachImg, rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'The Oceans Mall Visit', image: umhlangaGatewayMallImg, rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'uShaka Marine World Full Combo', image: ushakaMarineWorldImg, rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Point Waterfront Luxury Canal Boat Cruise', image: luxuryCanalCruiseImg, rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Boat Cruise Durban Harbour', image: isleOfCapriImg, rates: { adult: 200, child: 150, freeAge: 0 } },
    { name: 'Ballito Beach Trip', image: umhlangaBeachImg, rates: { adult: 150, child: 100, freeAge: 0 } },
    { name: 'Romantic Dinner Date', image: romanticRoomImg, rates: { adult: 650, child: 0, freeAge: 0 } },
    { name: 'Romantic Room Decor', image: romanticRoomImg, rates: { adult: 450, child: 0, freeAge: 0 } },
    { name: 'Gondola Boat Canal Cruise with Picnic', image: gondolaBoatImg, rates: { adult: 750, child: 550, freeAge: 0 } },
    { name: 'Shuttle Transport', image: airportShuttleImg, rates: { adult: 200, child: 150, freeAge: 0 } },
  ],
  'Knysna Garden Route': [
    { name: 'Knysna Wine and Oyster Luxury Lounger Sunset Cruise', image: knysnaSunsetCruiseImg, rates: { adult: 650, child: 450, freeAge: 4 } },
    { name: 'Knysna Forest Guided Quad Biking', image: knysnaQuadBikingImg, rates: { adult: 550, child: 400, freeAge: 0 } },
    { name: 'Knysna Lagoon Boat Cruise', image: knysnaSunsetCruiseImg, rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: 'Knysna Elephant Park', image: elephantExperienceImg, rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Featherbed Nature Reserve', image: knysnaHeadsImg, rates: { adult: 480, child: 320, freeAge: 4 } },
    { name: 'Monkey Land Primate Sanctuary', image: knysnaForestImg, rates: { adult: 280, child: 180, freeAge: 3 } },
    { name: 'Birds of Eden Free Flight Sanctuary', image: knysnaForestImg, rates: { adult: 280, child: 180, freeAge: 3 } },
    { name: 'Tsitsikamma Storms River Bridge Walk', image: knysnaHeadsImg, rates: { adult: 350, child: 250, freeAge: 0 } },
  ],
  'Vaal River Getaways': [
    { name: 'Aquadome Pools and Waterpark Entry', image: vaalAquadomeImg, rates: { adult: 280, child: 200, freeAge: 3 } },
    { name: 'Game Drive in Safari Truck', image: vaalGameDriveImg, rates: { adult: 380, child: 280, freeAge: 6 } },
    { name: 'Animal World Visit', image: hartiesSafariParkImg, rates: { adult: 150, child: 100, freeAge: 3 } },
    { name: '2 Hour Sunday Lunch Buffet Boat Cruise', image: vaalLunchCruiseImg, rates: { adult: 550, child: 380, freeAge: 6 } },
    { name: '1 Hour Leisure Cruise', image: vaalBoatCruiseImg, rates: { adult: 250, child: 180, freeAge: 4 } },
    { name: 'Sunday Lunch Buffet and Carvery', image: vaalLunchCruiseImg, rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: fullBodyMassageImg, rates: { adult: 600, child: 0, freeAge: 0 } },
    { name: 'Emerald Casino Resort Entry', image: emeraldResortImg, rates: { adult: 0, child: 0, freeAge: 0 } },
  ],
  'Pretoria Getaways': [
    { name: 'Union Buildings Tour', image: unionBuildingsImg, rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Voortrekker Monument', image: voortrekkerMonumentImg, rates: { adult: 120, child: 80, freeAge: 4 } },
    { name: 'National Zoological Gardens', image: hartiesSafariParkImg, rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Freedom Park', image: unionBuildingsImg, rates: { adult: 80, child: 50, freeAge: 4 } },
    { name: 'Rietvlei Nature Reserve Game Drive', image: magaliesGameDriveImg, rates: { adult: 350, child: 250, freeAge: 6 } },
    { name: 'Ann van Dyk Cheetah Centre', image: cheetahCentreImg, rates: { adult: 280, child: 200, freeAge: 4 } },
    { name: 'Cullinan Diamond Mine Tour', image: magaliesSterkfonteinImg, rates: { adult: 450, child: 350, freeAge: 6 } },
    { name: 'Irene Dairy Farm Visit', image: braaiImg, rates: { adult: 150, child: 100, freeAge: 3 } },
  ],
  'The Blyde Getaways': [
    { name: 'Graskop Gorge Lift', image: mpumalangaGraskopGorgeImg, rates: { adult: 300, child: 220, freeAge: 0 } },
    { name: 'Panorama Route Tour', image: mpumalangaGodsWindowImg, rates: { adult: 450, child: 300, freeAge: 0 } },
    { name: 'Blyde River Canyon Boat Cruise', image: mpumalangaBlydeCanonImg, rates: { adult: 350, child: 250, freeAge: 4 } },
    { name: "God's Window Viewpoint", image: mpumalangaGodsWindowImg, rates: { adult: 50, child: 30, freeAge: 0 } },
    { name: 'Quad Biking Adventure', image: belabelaQuadBikingImg, rates: { adult: 400, child: 320, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: fullBodyMassageImg, rates: { adult: 600, child: 0, freeAge: 0 } },
  ],
};

type AccommodationType = 'budget' | 'affordable' | 'premium';

const BuildPackage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form state
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);
  const [kidAges, setKidAges] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // Tier selection (replaces hotel dropdown)
  const [accommodationType, setAccommodationType] = useState<AccommodationType>('affordable');

  // Contact details
  const [guestName, setGuestName] = useState('');
  const [guestTel, setGuestTel] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  // RMS hotels
  const {
    searchHotels: searchRMSHotels,
    hotels: rmsHotels,
    isLoading: isSearchingRMS,
    clearHotels: clearRMSHotels,
  } = useRMSHotels();
  const [filteredRMSHotels, setFilteredRMSHotels] = useState<RMSHotel[]>([]);

  // Calculate total nights
  const calculateTotalNights = (checkInDate: string, checkOutDate: string) => {
    const date1 = new Date(checkInDate);
    const date2 = new Date(checkOutDate);
    const timeDifference = date2.getTime() - date1.getTime();
    return Math.max(1, Math.round(timeDifference / (1000 * 3600 * 24)));
  };

  // Handle activity selection
  const handleActivitySelect = (activityName: string) => {
    setSelectedActivities(prev =>
      prev.includes(activityName)
        ? prev.filter(a => a !== activityName)
        : [...prev, activityName]
    );
  };

  // Handle kids change
  const handleKidsChange = (numKids: number) => {
    setKids(numKids);
    if (numKids === 0) {
      setKidAges([]);
    } else {
      setKidAges(Array(numKids).fill(5));
    }
  };

  // Handle kid age change
  const handleKidAgeChange = (index: number, age: number) => {
    const newKidAges = [...kidAges];
    newKidAges[index] = age;
    setKidAges(newKidAges);
  };

  // Auto-set checkout to 2 days after check-in
  useEffect(() => {
    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 2);
      const formatted = checkInDate.toISOString().split('T')[0];
      if (!checkOut || new Date(checkOut) <= new Date(checkIn)) {
        setCheckOut(formatted);
      }
    }
  }, [checkIn]);

  // Reset when destination changes
  useEffect(() => {
    setSelectedActivities([]);
    setShowSummary(false);
    setFilteredRMSHotels([]);
    clearRMSHotels();
  }, [destination, clearRMSHotels]);

  // Calculate shuttle cost per adult based on number of adults
  const calculateShuttleCostPerAdult = (numAdults: number) => {
    if (numAdults <= 1) return 800;
    if (numAdults === 2) return 400;
    if (numAdults === 3) return 270;
    if (numAdults === 4) return 200;
    return 150;
  };

  // Calculate activity cost for ADULTS only
  const calculateAdultActivityCost = (activity: Activity) => {
    if (!activity || !activity.rates) return 0;
    if (activity.isShuttle && activity.shuttleBaseCost) {
      const shuttleCostPerAdult = calculateShuttleCostPerAdult(adults);
      return shuttleCostPerAdult * adults;
    }
    return activity.rates.adult * adults;
  };

  const calculateChildActivityCost = (activity: Activity, age: number) => {
    if (!activity || !activity.rates) return 0;
    const rates = activity.rates;
    if (age <= rates.freeAge) return 0;
    if (rates.childAgeRange) {
      if (age >= rates.childAgeRange.min && age <= rates.childAgeRange.max) return rates.child;
      return rates.adult;
    }
    return rates.child;
  };

  // Adult service fee - R200 LESS than main section
  const calculateAdditionalFee = (numAdults: number) => {
    if (numAdults === 1) return 800;       // Was 1000, now 800
    if (numAdults >= 2 && numAdults <= 3) return 650;  // Was 850, now 650
    if (numAdults >= 4 && numAdults <= 10) return 600;  // Was 800, now 600
    if (numAdults > 10) return 550;        // Was 750, now 550
    return 0;
  };

  // Child fee - same as main section (unchanged)
  const calculateChildFee = (numAdults: number, childAge: number, isFirstEligible: boolean, totalEligible: number) => {
    return getChildServiceFeeForAgeUtil(numAdults, childAge, isFirstEligible, totalEligible);
  };

  // Calculate total cost for an RMS hotel
  const calculateTotalCostRMS = (hotel: RMSHotel) => {
    if (!checkIn || !checkOut) return 0;

    const accommodationCost = hotel.totalRate * rooms;
    const costPerAdult = adults > 0 ? accommodationCost / adults : 0;
    const additionalFeePerAdult = calculateAdditionalFee(adults);

    const activities = activitiesByDestination[destination] || [];

    const totalAdultActivityCost = selectedActivities.reduce((acc, activityName) => {
      const activity = activities.find(a => a.name === activityName);
      return acc + (activity ? calculateAdultActivityCost(activity) : 0);
    }, 0);

    const totalPackageCostPerAdult =
      adults > 0 ? costPerAdult + additionalFeePerAdult + totalAdultActivityCost / adults : 0;

    const eligibleKids = kidAges.filter(age => age >= 4 && age <= 16);
    const totalEligible = eligibleKids.length;
    let eligibleChildIndex = 0;
    const totalPackageCostsPerChild = kidAges.reduce((acc, age) => {
      if (age < 4 || age > 16) return acc;
      const isFirstEligible = eligibleChildIndex === 0;
      eligibleChildIndex++;
      const feePerChild = calculateChildFee(adults, age, isFirstEligible, totalEligible);
      const childActivityCost = selectedActivities.reduce((actAcc, activityName) => {
        const activity = activities.find(a => a.name === activityName);
        return actAcc + (activity ? calculateChildActivityCost(activity, age) : 0);
      }, 0);
      return acc + childActivityCost + feePerChild;
    }, 0);

    return totalPackageCostPerAdult * adults + totalPackageCostsPerChild;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!guestName || !guestTel || !guestEmail) {
      toast.error('Please fill in your name, telephone number and email address');
      return;
    }

    const rmsCode = DESTINATION_TO_RMS[destination];
    const isRMSSupported = rmsCode && RMS_SUPPORTED.includes(rmsCode);

    if (isRMSSupported) {
      try {
        // Determine area filter
        let areaFilter: string | undefined;
        if (rmsCode === 'umhlanga') areaFilter = 'Umhlanga';
        else if (rmsCode === 'durban') areaFilter = 'Golden Mile';

        const result = await searchRMSHotels({
          destination: rmsCode,
          checkIn,
          checkOut,
          adults,
          children: kids,
          rooms,
          areaName: areaFilter,
        });

        if (result.length === 0) {
          toast.info('No hotels available for this search. Please try different dates.');
          return;
        }

        const filtered = result.filter(h => h.tier === accommodationType);
        if (filtered.length === 0) {
          const availableTiers = [...new Set(result.map(h => h.tier))];
          const tierLabels: Record<string, string> = { budget: 'Cheapest', affordable: 'Affordable', premium: 'Premium' };
          const availableTierNames = availableTiers.map(t => tierLabels[t] || t).join(', ');
          toast.info(`No ${tierLabels[accommodationType]} hotels available. Available: ${availableTierNames}`);
          return;
        }

        setFilteredRMSHotels(filtered);
        setShowSummary(true);
        toast.success(`${filtered.length} hotels found!`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Could not fetch hotels';
        toast.error(msg);
      }
    } else {
      // Non-RMS destination - show activities directly
      setShowSummary(true);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const currentActivities = activitiesByDestination[destination] || [];
  const totalNights = checkIn && checkOut ? calculateTotalNights(checkIn, checkOut) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Build Your Dream Package</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Create Your Own
              <span className="block text-primary">Custom Getaway</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your destination, pick your activities, and build the perfect package according to your budget and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!showSummary ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Destination, Check In, Check Out */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Where would you like to go? *</Label>
                      <Select
                        value={destination}
                        onValueChange={(value) => {
                          setDestination(value);
                          setSelectedActivities([]);
                          setShowSummary(false);
                        }}
                      >
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {destinationList.map((dest) => (
                            <SelectItem key={dest} value={dest}>
                              {dest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Check In *</Label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={today}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Check Out *</Label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || today}
                        className="h-11 bg-white border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Row 2: Adults, Kids, Rooms */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                      <Select value={adults.toString()} onValueChange={(v) => setAdults(Number(v))}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Number of Kids</Label>
                      <Select value={kids.toString()} onValueChange={(v) => handleKidsChange(Number(v))}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 20 }, (_, i) => i).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Rooms *</Label>
                      <Select value={rooms.toString()} onValueChange={(v) => setRooms(Number(v))}>
                        <SelectTrigger className="h-11 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50 max-h-60">
                          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Children Ages */}
                  {kids > 0 && kids < 20 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Children Ages</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {kidAges.map((age, index) => (
                          <div key={index} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Child {index + 1}</Label>
                            <Select
                              value={age.toString()}
                              onValueChange={(v) => handleKidAgeChange(index, Number(v))}
                            >
                              <SelectTrigger className="h-9 bg-white border-gray-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background border shadow-lg z-50">
                                {Array.from({ length: 18 }, (_, i) => i).map((a) => (
                                  <SelectItem key={a} value={a.toString()}>
                                    {a} years
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accommodation Type Selection - Tier Buttons */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Accommodation Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccommodationType('budget')}
                        className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                          accommodationType === 'budget'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                        }`}
                      >
                        Cheapest Options
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccommodationType('affordable')}
                        className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                          accommodationType === 'affordable'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        Affordable
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccommodationType('premium')}
                        className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                          accommodationType === 'premium'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                        }`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Your Contact Details *</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Full Name *</Label>
                        <Input
                          type="text"
                          placeholder="Your full name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="h-11 bg-white border-gray-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Telephone Number *</Label>
                        <Input
                          type="tel"
                          placeholder="e.g. 072 123 4567"
                          value={guestTel}
                          onChange={(e) => setGuestTel(e.target.value)}
                          className="h-11 bg-white border-gray-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Email Address *</Label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          className="h-11 bg-white border-gray-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow"
                    disabled={!destination || !checkIn || !checkOut || isSearchingRMS}
                  >
                    {isSearchingRMS ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Searching Hotels...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search Accommodations & Activities
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setShowSummary(false);
                  setFilteredRMSHotels([]);
                }}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>

              {/* Destination Title */}
              <h2 className="text-2xl font-bold">{destination}</h2>

              {/* RMS Hotels Display */}
              {filteredRMSHotels.length > 0 ? (
                filteredRMSHotels.map((hotel) => (
                  <Card key={hotel.code} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-xl font-bold text-primary">
                          {hotel.name}
                          {hotel.includesBreakfast && <span className="text-sm font-normal text-muted-foreground ml-2">(includes breakfast)</span>}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p><span className="font-medium">Check-in:</span> {checkIn}</p>
                          <p><span className="font-medium">Check-out:</span> {checkOut}</p>
                          <p><span className="font-medium">Room Type:</span> {hotel.roomTypeName || (hotel.capacity === '4_sleeper' ? '4 Sleeper' : '2 Sleeper')}</p>
                          <p><span className="font-medium">Guests:</span> {adults} adult{adults > 1 ? 's' : ''}{kids > 0 ? ` and ${kids} child${kids > 1 ? 'ren' : ''} (${kidAges.join(', ')})` : ''}</p>
                          <p><span className="font-medium">Tier:</span> {hotel.tier === 'budget' ? 'Cheapest' : hotel.tier === 'affordable' ? 'Affordable' : 'Premium'}</p>
                          <p><span className="font-medium">Accommodation Cost:</span> {formatCurrency(hotel.totalRate * rooms)}</p>
                          <p><span className="font-medium">Nights:</span> {totalNights}</p>
                          <p><span className="font-medium">Rooms:</span> {rooms}</p>
                        </div>
                      </div>

                      {/* Activities Section */}
                      {currentActivities.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-lg font-bold mb-4">
                            Add fun activities to make it a complete getaway package
                          </h4>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {currentActivities.map((activity) => (
                              <div
                                key={activity.name}
                                className="text-center cursor-pointer group"
                                onClick={() => handleActivitySelect(activity.name)}
                              >
                                <div
                                  className={cn(
                                    "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                    selectedActivities.includes(activity.name)
                                      ? "border-primary ring-2 ring-primary/20"
                                      : "border-transparent hover:border-muted-foreground/30"
                                  )}
                                >
                                  <img
                                    src={activity.image}
                                    alt={activity.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {selectedActivities.includes(activity.name) && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                      <Check className="w-8 h-8 text-primary bg-white rounded-full p-1" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-2">
                                    <span className="text-white text-xs font-semibold leading-tight text-center drop-shadow-lg">
                                      {activity.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Activities */}
                      {selectedActivities.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold mb-2">Selected Activities:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {selectedActivities.map((activity) => (
                              <li key={activity}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pricing Summary */}
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Price Breakdown</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Accommodation ({totalNights} nights × {rooms} room{rooms > 1 ? 's' : ''})</span>
                          <span className="font-medium">{formatCurrency(hotel.totalRate * rooms)}</span>
                        </div>
                        {selectedActivities.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Activities</span>
                            <span className="font-medium">
                              {formatCurrency(
                                calculateTotalCostRMS(hotel) - (hotel.totalRate * rooms) - 
                                (() => {
                                  const additionalFeePerAdult = calculateAdditionalFee(adults);
                                  const eligibleKids = kidAges.filter(age => age >= 4 && age <= 16);
                                  const totalEligible = eligibleKids.length;
                                  let eligibleIdx = 0;
                                  const childFees = kidAges.reduce((acc, age) => {
                                    if (age < 4 || age > 16) return acc;
                                    const isFirst = eligibleIdx === 0;
                                    eligibleIdx++;
                                    return acc + calculateChildFee(adults, age, isFirst, totalEligible);
                                  }, 0);
                                  return (additionalFeePerAdult * adults) + childFees;
                                })()
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service Fees</span>
                          <span className="font-medium">
                            {formatCurrency(
                              (() => {
                                const additionalFeePerAdult = calculateAdditionalFee(adults);
                                const eligibleKids = kidAges.filter(age => age >= 4 && age <= 16);
                                const totalEligible = eligibleKids.length;
                                let eligibleIdx = 0;
                                const childFees = kidAges.reduce((acc, age) => {
                                  if (age < 4 || age > 16) return acc;
                                  const isFirst = eligibleIdx === 0;
                                  eligibleIdx++;
                                  return acc + calculateChildFee(adults, age, isFirst, totalEligible);
                                }, 0);
                                return (additionalFeePerAdult * adults) + childFees;
                              })()
                            )}
                          </span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex flex-col items-end">
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">
                                Grand total for {adults} adult{adults > 1 ? 's' : ''}{kids > 0 ? ` and ${kids} kid${kids > 1 ? 's' : ''}` : ''}:
                              </p>
                              <p className="text-3xl font-bold text-destructive">
                                {formatCurrency(calculateTotalCostRMS(hotel))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                /* Non-RMS destination - show activities only with a generic accommodation note */
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Hotels for this destination will be confirmed separately. Please select your activities below and we'll match you with the best accommodation.
                      </p>
                    </div>

                    {currentActivities.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-bold mb-4">
                          Select your activities
                        </h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                          {currentActivities.map((activity) => (
                            <div
                              key={activity.name}
                              className="text-center cursor-pointer group"
                              onClick={() => handleActivitySelect(activity.name)}
                            >
                              <div
                                className={cn(
                                  "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                                  selectedActivities.includes(activity.name)
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-muted-foreground/30"
                                )}
                              >
                                <img
                                  src={activity.image}
                                  alt={activity.name}
                                  className="w-full h-full object-cover"
                                />
                                {selectedActivities.includes(activity.name) && (
                                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <Check className="w-8 h-8 text-primary bg-white rounded-full p-1" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-2">
                                  <span className="text-white text-xs font-semibold leading-tight text-center drop-shadow-lg">
                                    {activity.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedActivities.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-bold mb-2">Selected Activities:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {selectedActivities.map((activity) => (
                            <li key={activity}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildPackage;

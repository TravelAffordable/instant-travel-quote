import durbanAsset from "@/assets/deals/durban-deal.png.asset.json";
import capeTownAsset from "@/assets/deals/cape-town-deal.png.asset.json";
import mpumalangaAsset from "@/assets/deals/mpumalanga-deal.png.asset.json";
import hartiesAsset from "@/assets/deals/harties-deal.png.asset.json";
import magaliesAsset from "@/assets/deals/magalies-deal.png.asset.json";
import belaBelaAsset from "@/assets/deals/bela-bela-deal.png.asset.json";
import emeraldAsset from "@/assets/deals/emerald-deal.png.asset.json";
import sunCityAsset from "@/assets/deals/sun-city-deal.png.asset.json";
const emerald = emeraldAsset.url;
const sunCity = sunCityAsset.url;
const capeTown = capeTownAsset.url;
const mpumalanga = mpumalangaAsset.url;
const harties = hartiesAsset.url;
const magalies = magaliesAsset.url;
const belaBela = belaBelaAsset.url;
import { activitiesByDestination, Activity } from "@/data/activitiesData";

export interface HotelDeal {
  slug: string;
  title: string;
  destination: string;
  breakfast: string;
  /** Price per person for 2 nights (2 adults sharing). */
  pricePerPerson2Nights: number;
  /** Two-night single-occupancy total, with service fees already included. */
  soloPrice2Nights?: number;
  image: string;
  activityGroup: string;
}

export const ACTIVITY_MARKUP = 20; // per person per activity — never shown to customers
export const DEAL_ADULTS = 2;
export const DEAL_WHATSAPP = "27796813869";

export const hotelDeals: HotelDeal[] = [
  { slug: "durban-beachfront-luxury-hotel", title: "Durban Beachfront Luxury Hotel", destination: "Durban", breakfast: "Buffet breakfast included", pricePerPerson2Nights: 1790, soloPrice2Nights: 3380, image: durbanAsset.url, activityGroup: "Durban Beachfront Accommodation" },
  { slug: "cape-town-sea-point-apartment", title: "Cape Town – Sea Point Beachfront Apartment", destination: "Cape Town", breakfast: "Buffet breakfast at a nearby near-4-star hotel included", pricePerPerson2Nights: 1450, soloPrice2Nights: 2600, image: capeTown, activityGroup: "Cape Town Beachfront Accommodation" },
  { slug: "hazyview-luxury-hotel", title: "Hazyview Mpumalanga Luxury Hotel Near Kruger National Park", destination: "Mpumalanga", breakfast: "Buffet breakfast", pricePerPerson2Nights: 1970, soloPrice2Nights: 3050, image: mpumalanga, activityGroup: "Mpumalanga Getaways" },
  { slug: "emerald-casino-boutique-hotel", title: "Emerald Casino Resort Area Luxury Boutique Hotel", destination: "Vaal / Emerald Casino", breakfast: "Buffet breakfast at Emerald Casino Resort", pricePerPerson2Nights: 1620, soloPrice2Nights: 2800, image: emerald, activityGroup: "Vaal River Accommodation" },
  { slug: "harties-boutique-hotel", title: "Harties Area Luxury Boutique Hotel", destination: "Harties", breakfast: "Buffet breakfast included", pricePerPerson2Nights: 1620, soloPrice2Nights: 2400, image: harties, activityGroup: "Harties Cruise and Cableway Accommodation" },
  { slug: "magalies-misty-hills", title: "Magalies Misty Hills Boutique Hotel", destination: "Magalies", breakfast: "Buffet breakfast included", pricePerPerson2Nights: 1750, image: magalies, activityGroup: "Harties Cruise and Cableway Accommodation" },
  { slug: "bela-bela-country-hotel", title: "Bela-Bela Resort Area Luxury Country Hotel", destination: "Bela-Bela", breakfast: "Breakfast included", pricePerPerson2Nights: 1680, soloPrice2Nights: 2830, image: belaBela, activityGroup: "Bela Bela Accommodation" },
  { slug: "sun-city-guesthouse", title: "Sun City Area Luxury Guesthouse", destination: "Sun City", breakfast: "Breakfast included", pricePerPerson2Nights: 1550, soloPrice2Nights: 2900, image: sunCity, activityGroup: "Sun City Getaways" },
];

export const getDealActivities = (deal: HotelDeal): Activity[] =>
  activitiesByDestination[deal.activityGroup] || [];

export const dealRoomsRequired = (adults: number) => Math.ceil(adults / 2);

/** Pair adults in two-sleeper rooms; an unpaired adult uses the solo rate.
 * No extra service fee. Missing solo rates require a quotation, not a guess. */
export const dealHotelTotal = (deal: HotelDeal, nights: number, adults = DEAL_ADULTS): number | null => {
  const pairs = Math.floor(adults / 2);
  const solo = adults % 2;
  if (solo && deal.soloPrice2Nights === undefined) return null;
  const twoNightTotal = pairs * deal.pricePerPerson2Nights * 2
    + solo * (deal.soloPrice2Nights ?? 0);
  return Math.round(twoNightTotal * nights / 2);
};

/** Activity total for the selected adults incl. hidden R20 pp markup. */
export const dealActivityTotal = (a: Activity, adults = DEAL_ADULTS) =>
  a.isShuttle && a.shuttleBaseCost
    ? a.shuttleBaseCost + ACTIVITY_MARKUP * adults
    : (a.rates.adult + ACTIVITY_MARKUP) * adults;

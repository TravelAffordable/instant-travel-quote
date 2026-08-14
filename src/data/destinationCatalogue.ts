// Destination-first catalogue for the Travel Affordable homepage & booking flow.
// Adding a destination = adding data here (plus packages in travelData when available).

import durbanImg from '@/assets/destinations/durban.jpg';
import capeTownImg from '@/assets/destinations/cape-town.jpg';
import sunCityImg from '@/assets/destinations/sun-city.jpg';
import hartiesImg from '@/assets/destinations/hartbeespoort.jpg';
import magaliesImg from '@/assets/destinations/magaliesberg.jpg';
import mpumalangaImg from '@/assets/destinations/mpumalanga.jpg';
import umhlangaImg from '@/assets/destinations/umhlanga.jpg';
import vaalImg from '@/assets/destinations/vaal-river.jpg';
import knysnaImg from '@/assets/destinations/knysna.jpg';
import belaBelaImg from '@/assets/destinations/bela-bela.jpg';
import blydeImg from '@/assets/destinations/pretoria.jpg';
import joburgImg from '@/assets/destinations/johannesburg.jpg';
import sowetoImg from '@/assets/destinations/soweto.jpg';
import krugerImg from '@/assets/destinations/kruger.jpg';
import pilanesbergImg from '@/assets/destinations/pilanesberg.jpg';

export interface CatalogueDestination {
  /** URL slug used by /destinations/:slug and the booking flow. */
  slug: string;
  /** Matches travelData destination ids where packages exist. */
  destinationId?: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  /** Featured on the homepage grid above the fold. */
  featured: boolean;
  /** No curated packages loaded yet — customers enquire instead. */
  enquireOnly?: boolean;
}

export const catalogueDestinations: CatalogueDestination[] = [
  {
    slug: 'durban',
    destinationId: 'durban',
    name: 'Durban',
    region: 'KwaZulu-Natal',
    tagline: 'Warm ocean, Golden Mile, all-year sunshine',
    image: durbanImg,
    featured: true,
  },
  {
    slug: 'cape-town',
    destinationId: 'cape-town',
    name: 'Cape Town',
    region: 'Western Cape',
    tagline: 'Table Mountain, winelands and coastal drives',
    image: capeTownImg,
    featured: true,
  },
  {
    slug: 'sun-city',
    destinationId: 'sun-city',
    name: 'Sun City',
    region: 'North West',
    tagline: 'Valley of Waves and resort entertainment',
    image: sunCityImg,
    featured: true,
  },
  {
    slug: 'hartbeespoort',
    destinationId: 'harties',
    name: 'Harties',
    region: 'North West',
    tagline: 'Dam views, cable car and easy weekend escapes',
    image: hartiesImg,
    featured: true,
  },
  {
    slug: 'mpumalanga',
    destinationId: 'mpumalanga',
    name: 'Mpumalanga',
    region: 'Mpumalanga',
    tagline: 'Panorama Route, waterfalls and big skies',
    image: mpumalangaImg,
    featured: true,
  },
  {
    slug: 'umhlanga',
    destinationId: 'umhlanga',
    name: 'Umhlanga',
    region: 'KwaZulu-Natal',
    tagline: 'Upmarket beachfront, promenade and lagoon',
    image: umhlangaImg,
    featured: true,
  },
  {
    slug: 'magaliesburg',
    destinationId: 'magalies',
    name: 'Magalies',
    region: 'Gauteng / North West',
    tagline: 'Mountain lodges an hour from Joburg',
    image: magaliesImg,
    featured: true,
  },
  {
    slug: 'bela-bela',
    destinationId: 'bela-bela',
    name: 'Bela-Bela',
    region: 'Limpopo',
    tagline: 'Hot springs, waterparks and game drives',
    image: belaBelaImg,
    featured: true,
  },
  {
    slug: 'vaal-river',
    destinationId: 'vaal-river',
    name: 'Emerald Casino & Vaal Cruise',
    region: 'Gauteng',
    tagline: 'River cruises, aquadome and casino resort',
    image: vaalImg,
    featured: false,
  },
  {
    slug: 'knysna',
    destinationId: 'knysna',
    name: 'Knysna',
    region: 'Garden Route',
    tagline: 'Lagoon, forests and Garden Route charm',
    image: knysnaImg,
    featured: false,
  },
  {
    slug: 'the-blyde',
    destinationId: 'pretoria',
    name: 'The Blyde, Pretoria',
    region: 'Gauteng',
    tagline: 'Crystal lagoon beach day close to home',
    image: blydeImg,
    featured: false,
  },
  {
    slug: 'kruger-national-park',
    name: 'Kruger National Park',
    region: 'Mpumalanga / Limpopo',
    tagline: 'Big Five safari, sunrise game drives',
    image: krugerImg,
    featured: true,
    enquireOnly: true,
  },
  {
    slug: 'pilanesberg',
    name: 'Pilanesberg',
    region: 'North West',
    tagline: 'Malaria-free safari beside Sun City',
    image: pilanesbergImg,
    featured: false,
    enquireOnly: true,
  },
  {
    slug: 'johannesburg',
    name: 'Johannesburg',
    region: 'Gauteng',
    tagline: 'City breaks, shopping and nightlife',
    image: joburgImg,
    featured: false,
    enquireOnly: true,
  },
  {
    slug: 'soweto',
    name: 'Soweto',
    region: 'Gauteng',
    tagline: 'Heritage tours, bicycle rides and local flavour',
    image: sowetoImg,
    featured: false,
    enquireOnly: true,
  },
];

export function getCatalogueDestination(slug: string) {
  return catalogueDestinations.find((d) => d.slug === slug);
}

export function getCatalogueDestinationByDestinationId(destinationId: string) {
  return catalogueDestinations.find((d) => d.destinationId === destinationId);
}

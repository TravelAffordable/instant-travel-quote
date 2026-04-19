// SEO-focused destination landing page content
// Each destination has unique copy targeting commercial keywords
// Used by /destinations/:slug

export interface DestinationPageData {
  slug: string;
  destinationId: string; // matches Hero destinationList ids
  name: string;
  region: string;
  metaTitle: string; // <60 chars
  metaDescription: string; // <160 chars
  keywords: string;
  heroImage: string;
  intro: string;
  highlights: string[];
  whyVisit: string;
  bestTime: string;
  whoFor: string;
  startingFrom: number;
  faqs: { question: string; answer: string }[];
}

import durbanImg from '@/assets/destinations/durban.jpg';
import capeTownImg from '@/assets/destinations/cape-town.jpg';
import sunCityImg from '@/assets/destinations/sun-city.jpg';
import hartiesImg from '@/assets/destinations/hartbeespoort.jpg';
import magaliesImg from '@/assets/destinations/magaliesberg.jpg';
import mpumalangaImg from '@/assets/destinations/mpumalanga.jpg';
import umhlangaImg from '@/assets/destinations/umhlanga.jpg';
import vaalImg from '@/assets/destinations/vaal-river.jpg';
import knysnaImg from '@/assets/destinations/knysna.jpg';

export const destinationPages: DestinationPageData[] = [
  {
    slug: 'durban',
    destinationId: 'durban',
    name: 'Durban',
    region: 'KwaZulu-Natal',
    metaTitle: 'Durban Holiday Packages from R1,400pp | Beach Getaways',
    metaDescription:
      'Affordable Durban holiday packages on the Golden Mile. Beachfront hotels, uShaka Marine, Moses Mabhida & open-top bus tours. Instant quotes — book today.',
    keywords:
      'durban holiday packages, durban beachfront hotels, golden mile accommodation, durban weekend getaway, cheap durban holidays',
    heroImage: durbanImg,
    intro:
      'Durban is South Africa’s warm-water capital — 320 days of sunshine, the iconic Golden Mile, and some of the most affordable beach holidays on the continent. Travel Affordable curates packages that combine beachfront hotels with the city’s best activities at unbeatable prices.',
    highlights: [
      'Stay on or near the Golden Mile with sea-view rooms',
      'uShaka Marine World tickets included in select packages',
      'Moses Mabhida Stadium SkyCar & adventure walk',
      'Hop-on hop-off open-top bus tours of the city',
      'Sunset gondola and luxury canal cruises in Umhlanga',
      'Airport shuttle and Umhlanga day-trip add-ons',
    ],
    whyVisit:
      'Whether you’re planning a romantic weekend, a family beach holiday or a school tour, Durban delivers world-class beaches, Indian and Zulu culture, and value-for-money accommodation. Our budget tier starts under R1,500pp while premium beachfront hotels remain well below Cape Town pricing.',
    bestTime:
      'Year-round destination. Peak season runs December–January and Easter; shoulder months (April–May, September–October) offer the best rates and warm weather.',
    whoFor: 'Families, couples, school groups, church groups and corporate retreats.',
    startingFrom: 1400,
    faqs: [
      {
        question: 'How much is a Durban holiday package per person?',
        answer:
          'Travel Affordable Durban packages start from R1,400 per person sharing for budget hotels and rise to around R6,500pp for premium beachfront resorts, depending on dates and inclusions.',
      },
      {
        question: 'Which areas of Durban do you book?',
        answer:
          'We focus on the Golden Mile, North Beach, South Beach and Umhlanga — all within easy reach of the beach, restaurants and major attractions.',
      },
      {
        question: 'Do packages include activities?',
        answer:
          'Yes. Most packages include uShaka Marine World, Moses Mabhida SkyCar, an open-top bus tour and a sunset cruise. You can also book accommodation-only.',
      },
    ],
  },
  {
    slug: 'umhlanga',
    destinationId: 'umhlanga',
    name: 'Umhlanga',
    region: 'KwaZulu-Natal',
    metaTitle: 'Umhlanga Holiday Packages | Beachfront Hotels from R1,800pp',
    metaDescription:
      'Upmarket Umhlanga Rocks holiday packages with beachfront hotels, gondola cruises and Gateway shopping. Premium SA coast at affordable prices. Get an instant quote.',
    keywords:
      'umhlanga holiday packages, umhlanga rocks accommodation, umhlanga beachfront hotels, gateway umhlanga, umhlanga weekend getaway',
    heroImage: umhlangaImg,
    intro:
      'Umhlanga Rocks is the polished, palm-lined cousin of central Durban — known for its lighthouse, promenade, fine dining and the massive Gateway shopping centre. Our Umhlanga packages combine premium beachfront stays with the area’s signature canal and gondola cruises.',
    highlights: [
      'Beachfront hotels minutes from the iconic Umhlanga lighthouse',
      'Luxury canal boat cruises and gondola rides',
      'Gateway Theatre of Shopping — Africa’s largest mall',
      'Sun-soaked promenade walks and tidal pools',
      'Easy access to Durban CBD and King Shaka airport',
    ],
    whyVisit:
      'Choose Umhlanga for a more upmarket coastal break without the Cape Town price tag. It pairs beautifully with Durban activity add-ons for a full KZN experience.',
    bestTime:
      'September–November and March–May offer ideal weather without peak-season crowds.',
    whoFor: 'Couples, honeymooners, families wanting upmarket comfort, corporate stays.',
    startingFrom: 1800,
    faqs: [
      {
        question: 'Is Umhlanga more expensive than Durban?',
        answer:
          'Slightly, yes. Umhlanga packages start around R1,800pp versus R1,400pp for central Durban, reflecting the upmarket beachfront positioning.',
      },
      {
        question: 'Can I combine Umhlanga and Durban activities?',
        answer:
          'Absolutely. Many of our packages include a Durban day trip with open-top bus and uShaka Marine World tickets.',
      },
    ],
  },
  {
    slug: 'cape-town',
    destinationId: 'cape-town',
    name: 'Cape Town',
    region: 'Western Cape',
    metaTitle: 'Cape Town Holiday Packages | Table Mountain & V&A Waterfront',
    metaDescription:
      'Affordable Cape Town holiday packages within the City Sightseeing bus route. Table Mountain, V&A Waterfront, Robben Island & wine routes. Instant online quotes.',
    keywords:
      'cape town holiday packages, table mountain tour, va waterfront hotels, cheap cape town holidays, cape town weekend getaway',
    heroImage: capeTownImg,
    intro:
      'Cape Town consistently ranks among the world’s most beautiful cities — and you don’t need a luxury budget to experience it. We focus on hotels within the City Sightseeing bus route so guests can reach Table Mountain, the V&A Waterfront, Camps Bay and the wine routes effortlessly.',
    highlights: [
      'Hotels within the red-bus sightseeing route',
      'Table Mountain cableway tickets in selected packages',
      'V&A Waterfront, Two Oceans Aquarium and Robben Island',
      'Cape Point, Boulders Beach penguins and Chapman’s Peak drive',
      'Stellenbosch and Constantia wine route day trips',
    ],
    whyVisit:
      'Cape Town is bucket-list travel — and our packages strip out the markup to make it genuinely affordable for South African families.',
    bestTime:
      'October–April for warm weather; June–August for whale watching and cheaper rates.',
    whoFor: 'Couples, families, international visitors, honeymoon and anniversary trips.',
    startingFrom: 2200,
    faqs: [
      {
        question: 'How much is a Cape Town holiday package?',
        answer:
          'Cape Town packages start from R2,200pp for budget hotels and rise to R8,500pp for premium V&A Waterfront stays, excluding flights.',
      },
      {
        question: 'Are flights included?',
        answer:
          'No — packages are land-only so you can choose your own preferred airline and class. We can advise on the cheapest flight windows.',
      },
    ],
  },
  {
    slug: 'sun-city',
    destinationId: 'sun-city',
    name: 'Sun City',
    region: 'North West',
    metaTitle: 'Sun City Holiday Packages | Valley of Waves & Resort Stays',
    metaDescription:
      'Sun City resort packages with Valley of Waves access, Pilanesberg safari add-ons and family-friendly hotels. From R2,500pp. Get instant pricing online.',
    keywords:
      'sun city packages, valley of waves, pilanesberg safari, sun city accommodation, sun city family holiday',
    heroImage: sunCityImg,
    intro:
      'Sun City remains South Africa’s most loved resort destination — Valley of Waves, Gary Player golf, the Lost City and big-five safaris in adjoining Pilanesberg. Our packages bundle accommodation, park access and optional safaris at honest prices.',
    highlights: [
      'Resort hotels with full Valley of Waves access',
      'Pilanesberg game drive add-ons (open vehicle)',
      'Gary Player Country Club golf packages',
      'Lost City, casino and entertainment centre',
      'Family rooms with kids-stay-free options under 4',
    ],
    whyVisit:
      'Sun City is the easiest big resort experience in southern Africa — only two hours from Pretoria, kid-friendly, and packed with on-site activities so you never need to leave the resort.',
    bestTime: 'April–October for cooler weather; December for festive resort atmosphere.',
    whoFor: 'Families with kids, multi-generational groups, golfers, honeymooners.',
    startingFrom: 2500,
    faqs: [
      {
        question: 'Is Valley of Waves included?',
        answer:
          'Yes — most Sun City packages include Valley of Waves entry. Confirm at quote time.',
      },
      {
        question: 'Can I add a Pilanesberg safari?',
        answer:
          'Yes. We offer half-day and full-day open-vehicle game drives in adjoining Pilanesberg as a package add-on.',
      },
    ],
  },
  {
    slug: 'hartbeespoort',
    destinationId: 'harties',
    name: 'Hartbeespoort',
    region: 'North West',
    metaTitle: 'Hartbeespoort (Harties) Packages | Dam, Cableway & Cruises',
    metaDescription:
      'Affordable Hartbeespoort getaways — dam cruises, Harties cableway, Little Paris, jet ski and horse riding. Perfect Gauteng weekend escape from R1,500pp.',
    keywords:
      'hartbeespoort packages, harties weekend, hartbeespoort dam cruise, harties cableway, gauteng weekend getaway',
    heroImage: hartiesImg,
    intro:
      'Hartbeespoort — “Harties” to locals — is Gauteng’s favourite weekend escape. The dam, Magaliesberg mountains and a packed activity menu make it perfect for couples and families wanting nature without driving for hours.',
    highlights: [
      'Hartbeespoort Aerial Cableway with summit views',
      'Dam cruises — sunset, buffet and luxury options',
      'Little Paris with mini Eiffel Tower photo stop',
      'Couple jet ski rides and romantic horse trails',
      'Quad biking and family adventure activities',
    ],
    whyVisit:
      'It’s the most affordable, accessible escape from Johannesburg and Pretoria — under 90 minutes from both cities, with packages from R1,500pp including activities.',
    bestTime:
      'Year-round. Spring (Sep–Nov) and autumn (Mar–May) offer the best weather and rates.',
    whoFor: 'Couples, weekend families, friend groups, corporate team-builds.',
    startingFrom: 1500,
    faqs: [
      {
        question: 'How far is Harties from Johannesburg?',
        answer:
          'Approximately 80km — about 60 to 90 minutes by car depending on traffic.',
      },
      {
        question: 'What activities are included?',
        answer:
          'Packages typically include the Hartbeespoort cableway, a dam cruise and your choice of jet ski, horse riding or quad biking.',
      },
    ],
  },
  {
    slug: 'magaliesburg',
    destinationId: 'magalies',
    name: 'Magaliesburg',
    region: 'Gauteng / North West',
    metaTitle: 'Magaliesburg Getaway Packages | Spa, Cruises & Picnics',
    metaDescription:
      'Romantic Magaliesburg packages with private picnics, dam buffet cruises and spa stays. Mountain escape only an hour from Johannesburg. From R1,600pp.',
    keywords:
      'magaliesburg packages, magaliesburg spa weekend, romantic getaway gauteng, magaliesburg accommodation',
    heroImage: magaliesImg,
    intro:
      'Magaliesburg is Gauteng’s romantic mountain escape — one of the world’s oldest mountain ranges, with spa resorts, hot-air balloon rides and private dam picnics that punch well above the price tag.',
    highlights: [
      'Spa resorts with full-day treatment packages',
      'Private picnics on the dam shore',
      'Buffet cruises with sunset views',
      'Hot-air balloon flights at sunrise',
      'Mountain hiking and game drives',
    ],
    whyVisit:
      'It’s the perfect anniversary, honeymoon-redo or quiet couples retreat without the long Cape Town flight or price.',
    bestTime: 'April–September for cooler hiking weather; October for spring blooms.',
    whoFor: 'Couples, anniversaries, small private groups, wellness retreats.',
    startingFrom: 1600,
    faqs: [
      {
        question: 'Is Magaliesburg suitable for kids?',
        answer:
          'Yes — many resorts offer family rooms and kids’ activities, though Magaliesburg leans more romantic than Sun City.',
      },
    ],
  },
  {
    slug: 'mpumalanga',
    destinationId: 'mpumalanga',
    name: 'Mpumalanga',
    region: 'Mpumalanga',
    metaTitle: 'Mpumalanga & Blyde River Canyon Packages | Panorama Route',
    metaDescription:
      'Mpumalanga Panorama Route packages — Blyde River Canyon, God’s Window, Bourke’s Luck Potholes and Graskop. Gateway to Kruger. From R2,800pp.',
    keywords:
      'mpumalanga packages, blyde river canyon, panorama route, gods window, graskop accommodation, kruger gateway',
    heroImage: mpumalangaImg,
    intro:
      'Mpumalanga’s Panorama Route is one of the most scenic drives on Earth — Blyde River Canyon, God’s Window, the Three Rondavels and Bourke’s Luck Potholes — all within an easy loop and within reach of Kruger National Park.',
    highlights: [
      'Blyde River Canyon (third largest canyon in the world)',
      'God’s Window and the Pinnacle Rock',
      'Bourke’s Luck Potholes geological wonder',
      'Graskop village with the Big Swing and Lift',
      'Gateway access to Kruger National Park',
    ],
    whyVisit:
      'Pair Mpumalanga with a Kruger safari extension for a complete bucket-list trip — at a fraction of typical safari pricing.',
    bestTime:
      'April–September is the dry season — ideal for safaris and clear canyon views.',
    whoFor: 'Adventurers, photographers, safari-bound travellers, road trippers.',
    startingFrom: 2800,
    faqs: [
      {
        question: 'Can I add Kruger to my Mpumalanga package?',
        answer:
          'Yes — we frequently bundle a Kruger safari extension with Mpumalanga Panorama Route packages.',
      },
    ],
  },
  {
    slug: 'bela-bela',
    destinationId: 'bela-bela',
    name: 'Bela-Bela',
    region: 'Limpopo',
    metaTitle: 'Bela-Bela Hot Springs Packages | Family Resort Getaways',
    metaDescription:
      'Affordable Bela-Bela holiday packages with hot springs resorts, water parks and game lodges. Family favourite Limpopo escape from R1,700pp.',
    keywords:
      'bela bela packages, warmbaths hot springs, bela bela family resort, limpopo getaway',
    heroImage: hartiesImg, // reusing as Bela-Bela image; safe fallback
    intro:
      'Bela-Bela (formerly Warmbaths) is built around natural mineral hot springs — perfect for family holidays, school groups and anyone wanting genuine R&R at honest prices.',
    highlights: [
      'Natural hot mineral springs and water parks',
      'Family resorts with kids-stay-free options',
      'Game drives in nearby private reserves',
      'Spa treatments using mineral waters',
      'Easy 90-minute drive from Pretoria',
    ],
    whyVisit:
      'Bela-Bela is unmatched for family value — kids love the water parks, parents love the spa, and the hot springs work for every season.',
    bestTime: 'Year-round; the hot springs are especially welcome in winter (May–August).',
    whoFor: 'Families with young kids, school groups, multi-generational stays.',
    startingFrom: 1700,
    faqs: [
      {
        question: 'Are children under 4 free?',
        answer:
          'Yes — across all our destinations, children under 4 stay free when sharing with parents.',
      },
    ],
  },
  {
    slug: 'vaal-river',
    destinationId: 'vaal-river',
    name: 'Vaal River',
    region: 'Gauteng',
    metaTitle: 'Vaal River Holiday Packages | Riverside Resorts & Cruises',
    metaDescription:
      'Riverside Vaal getaways with boat cruises, paddle boats and family resorts. Quick weekend escape from Johannesburg from R1,500pp.',
    keywords:
      'vaal river packages, vaal triangle accommodation, vaal weekend getaway, vaal river cruise',
    heroImage: vaalImg,
    intro:
      'The Vaal River offers Gauteng locals a fast, affordable river escape — boat cruises, riverside resorts and weekend family fun under 90 minutes from Johannesburg.',
    highlights: [
      'Riverside resorts with private decks',
      'Sunset and lunch river cruises',
      'Paddle boats, jet skis and water-sport rentals',
      'Riverside spa and wellness packages',
      'Quick escape from Johannesburg and Pretoria',
    ],
    whyVisit:
      'When you need a fast weekend reset without the long drive — the Vaal is the answer.',
    bestTime: 'Spring and summer (September–April) for water activities.',
    whoFor: 'Weekenders, couples, family groups, corporate team-builds.',
    startingFrom: 1500,
    faqs: [
      {
        question: 'How far is the Vaal from Johannesburg?',
        answer: 'About 70km — typically a 60-minute drive.',
      },
    ],
  },
  {
    slug: 'knysna',
    destinationId: 'knysna',
    name: 'Knysna',
    region: 'Western Cape',
    metaTitle: 'Knysna Garden Route Packages | Lagoon, Forests & Heads',
    metaDescription:
      'Knysna Garden Route holiday packages — lagoon cruises, indigenous forests and the iconic Heads. Perfect honeymoon stop from R2,400pp.',
    keywords:
      'knysna packages, garden route holiday, knysna lagoon, knysna heads, garden route honeymoon',
    heroImage: knysnaImg,
    intro:
      'Knysna anchors the Garden Route — a lagoon town wrapped in indigenous forest, oysters and the dramatic Heads. Our packages cover the full Garden Route experience without the guided-tour markup.',
    highlights: [
      'Lagoon cruises with oyster and wine tastings',
      'Knysna Heads viewing decks and East Head Café',
      'Featherbed Nature Reserve eco-experiences',
      'Tsitsikamma forest canopy tours',
      'Plettenberg Bay beach add-on',
    ],
    whyVisit:
      'Knysna is the romantic heart of the Garden Route — perfect for honeymoons, anniversaries and slow-travel couples.',
    bestTime: 'October–April for warm weather; July for the Knysna Oyster Festival.',
    whoFor: 'Honeymooners, couples, slow travellers, food and wine lovers.',
    startingFrom: 2400,
    faqs: [
      {
        question: 'Should I rent a car?',
        answer:
          'Yes — the Garden Route is best self-driven so you can explore Plett, Tsitsikamma and Wilderness at your own pace.',
      },
    ],
  },
];

export const getDestinationPage = (slug: string) =>
  destinationPages.find((d) => d.slug === slug);

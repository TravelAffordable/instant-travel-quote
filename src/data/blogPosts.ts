// SEO blog posts — long-form destination guides
// Each post targets long-tail keywords to capture organic search traffic

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  heroImage: string;
  publishedAt: string; // ISO date
  readTime: string;
  category: string;
  // Body uses simple section format — rendered as semantic HTML
  body: { heading?: string; paragraphs: string[]; bullets?: string[] }[];
  ctaDestinationSlug?: string;
}

import durbanImg from '@/assets/destinations/durban.jpg';
import capeTownImg from '@/assets/destinations/cape-town.jpg';
import sunCityImg from '@/assets/destinations/sun-city.jpg';
import hartiesImg from '@/assets/destinations/hartbeespoort.jpg';
import magaliesImg from '@/assets/destinations/magaliesberg.jpg';
import mpumalangaImg from '@/assets/destinations/mpumalanga.jpg';

export const blogPosts: BlogPost[] = [
  {
    slug: 'durban-golden-mile-holiday-guide-2026',
    title: 'Durban Golden Mile Holiday Guide for 2026',
    metaTitle: 'Durban Golden Mile Guide 2026 | Best Hotels & Activities',
    metaDescription:
      'Plan the perfect Durban Golden Mile holiday — best beachfront hotels, top activities, transport tips and how to score affordable packages from R1,400pp.',
    keywords:
      'durban golden mile, durban beachfront hotels, durban holiday guide, ushaka marine, moses mabhida',
    excerpt:
      'Everything you need to plan an affordable, memorable Durban beach holiday — where to stay, what to do, and how to save up to 40% on packages.',
    heroImage: durbanImg,
    publishedAt: '2026-04-01',
    readTime: '8 min',
    category: 'Destination Guide',
    ctaDestinationSlug: 'durban',
    body: [
      {
        paragraphs: [
          'Durban’s Golden Mile is South Africa’s most iconic stretch of beach — six kilometres of warm-water surf, paved promenade, restaurants and family-friendly hotels stretching from uShaka Marine World in the south to the Suncoast Casino in the north. For locals planning a budget-friendly beach holiday, nothing beats it on price-per-experience.',
          'In this guide we cover where to stay, the must-do activities, transport tips and how Travel Affordable packages bundle everything together for as little as R1,400 per person sharing.',
        ],
      },
      {
        heading: 'Where to stay on the Golden Mile',
        paragraphs: [
          'The Golden Mile is split into three loose zones: South Beach (closer to uShaka), North Beach (the surfing hub) and the Bay of Plenty. Budget travellers should target South Beach for the best room rates, while families lean toward North Beach for its calmer swimming bays and proximity to the open-top bus stops.',
        ],
        bullets: [
          'Budget tier: from R1,400pp sharing — clean, simple, walking distance to the beach.',
          'Affordable tier: from R2,200pp — beachfront views and breakfast included.',
          'Premium tier: from R4,500pp — sea-facing suites with full resort amenities.',
        ],
      },
      {
        heading: 'Top activities to add to your package',
        paragraphs: [
          'A great Durban holiday isn’t just hotels — it’s the activity stack. Our most popular bundle includes uShaka Marine World, Moses Mabhida Stadium SkyCar, an open-top bus tour and a sunset gondola cruise in Umhlanga, with optional spa treatments and Umhlanga day trips.',
        ],
        bullets: [
          'uShaka Marine World — Africa’s biggest aquarium and water park.',
          'Moses Mabhida Stadium SkyCar and adventure walk.',
          'Hop-on hop-off open-top bus through Durban’s historic core.',
          'Sunset gondola or luxury canal cruise in Umhlanga.',
          'Full-body spa treatments at hotel spas.',
        ],
      },
      {
        heading: 'When to visit Durban',
        paragraphs: [
          'Durban is a year-round destination — average winter days hover around 22°C and summers reach 30°C with warm Indian Ocean swimming. Avoid mid-December to mid-January if you dislike crowds; instead target April–May or September–October for the best weather-to-rate ratio.',
        ],
      },
      {
        heading: 'How much should a Durban holiday cost?',
        paragraphs: [
          'For a family of four travelling for three nights with activities included, expect a fair all-in cost of R8,000 to R18,000 depending on hotel tier. Travel Affordable packages strip out agency markup so you only pay the genuine combined cost of accommodation, activities and a small service fee.',
        ],
      },
    ],
  },
  {
    slug: 'cape-town-on-a-budget-2026',
    title: 'Cape Town on a Budget: How to Visit Without Breaking the Bank',
    metaTitle: 'Cape Town on a Budget 2026 | Affordable Mother City Guide',
    metaDescription:
      'Smart tips to enjoy Cape Town on a budget — affordable hotels in the City Sightseeing route, free attractions, and packages from R2,200pp.',
    keywords:
      'cape town budget, cheap cape town holiday, table mountain budget, va waterfront affordable, cape town packages',
    excerpt:
      'Cape Town doesn’t have to be expensive. Here’s how to see Table Mountain, the V&A and Cape Point on a real-world South African budget.',
    heroImage: capeTownImg,
    publishedAt: '2026-04-02',
    readTime: '9 min',
    category: 'Budget Travel',
    ctaDestinationSlug: 'cape-town',
    body: [
      {
        paragraphs: [
          'Cape Town consistently ranks among the world’s most beautiful cities — and unfortunately also among the most marketed. International pricing for Atlantic Seaboard hotels makes it look out of reach for South African families, but with a smarter strategy you can do the full Mother City experience from R2,200 per person.',
        ],
      },
      {
        heading: 'Stay inside the City Sightseeing red-bus route',
        paragraphs: [
          'The single biggest budget hack is hotel location. Stay anywhere along the City Sightseeing red-bus loop and you eliminate the need to rent a car for the first 48 hours. The bus connects Table Mountain, Camps Bay, Hout Bay, the V&A Waterfront and the city centre — covering 80% of every visitor’s wishlist.',
        ],
      },
      {
        heading: 'Time your Table Mountain trip',
        paragraphs: [
          'Buy your cableway ticket online a day in advance to skip the queue. Aim for the first cableway up (around 8:30am) — you’ll beat the wind, the cloud and the tour bus crowds. If the cableway is closed, hike up Platteklip Gorge instead — it’s strenuous but free.',
        ],
      },
      {
        heading: 'Free and cheap activities worth your time',
        paragraphs: ['Some of Cape Town’s best experiences cost almost nothing:'],
        bullets: [
          'Sea Point promenade walk at sunset (free).',
          'Bo-Kaap colourful streets and Malay Quarter (free).',
          'Boulders Beach penguins (R190 entry — incredible value).',
          'Cape Point and Chapman’s Peak drive (fuel cost only).',
          'Company’s Garden, the National Gallery and Slave Lodge (low-cost or donation).',
        ],
      },
      {
        heading: 'Packages vs. DIY',
        paragraphs: [
          'For most South African families a Travel Affordable package will beat DIY booking by R1,500–R3,000 per person once you account for hotel, transfers and key activity tickets. We negotiate group rates with hotels even for solo and couple travellers and pass the saving on.',
        ],
      },
    ],
  },
  {
    slug: 'sun-city-weekend-itinerary',
    title: 'The Perfect Sun City Weekend Itinerary',
    metaTitle: 'Sun City Weekend Itinerary | 2-Night Family Resort Plan',
    metaDescription:
      'A two-night Sun City itinerary covering Valley of Waves, Pilanesberg safari and the Lost City. Tips, costs and packages from R2,500pp.',
    keywords:
      'sun city itinerary, sun city weekend, valley of waves, pilanesberg safari, sun city family',
    excerpt:
      'A complete Sun City weekend plan — what to do hour-by-hour, where to eat and how to fit in a Pilanesberg safari without rushing.',
    heroImage: sunCityImg,
    publishedAt: '2026-04-03',
    readTime: '7 min',
    category: 'Itinerary',
    ctaDestinationSlug: 'sun-city',
    body: [
      {
        paragraphs: [
          'Sun City is built for the long weekend — only two hours from Pretoria but immersive enough to feel like a far-flung resort. This itinerary makes the most of two nights without the kids melting down by Sunday lunch.',
        ],
      },
      {
        heading: 'Day 1 — Friday afternoon arrival',
        paragraphs: [
          'Aim to check in by 3pm to give the kids time at the resort pools before sunset. Walk the Bridge of Time, take photos at the Lost City entrance, and have an early dinner at the Palace Plaza or one of the entertainment-centre restaurants.',
        ],
      },
      {
        heading: 'Day 2 — Saturday: Valley of Waves',
        paragraphs: [
          'Be at Valley of Waves when the gates open. Hit the Roaring Lagoon and Tarantula slide before 11am, lunch poolside, then nap in the cabanas. Late afternoon try the Lazy River. Sunset cocktails at Sun Central, dinner at the Palace.',
        ],
      },
      {
        heading: 'Day 3 — Sunday: Pilanesberg morning safari, then home',
        paragraphs: [
          'Book an open-vehicle safari into adjoining Pilanesberg leaving at 5:30am. You’ll be back at the resort by 10am for breakfast, with time to pack, pay any extras and hit the road by midday.',
        ],
      },
      {
        heading: 'What it costs',
        paragraphs: [
          'A two-night Sun City weekend with Valley of Waves and a Pilanesberg morning safari typically lands between R5,500 and R9,500 per adult depending on hotel tier. Children under 4 stay free; ages 4–16 receive discounted rates.',
        ],
      },
    ],
  },
  {
    slug: 'hartbeespoort-family-getaway-guide',
    title: 'Hartbeespoort Family Getaway Guide',
    metaTitle: 'Hartbeespoort Family Getaway | Best Activities & Resorts',
    metaDescription:
      'Plan the perfect Harties family weekend — cableway, dam cruises, Little Paris and family resorts. Affordable Gauteng escape from R1,500pp.',
    keywords:
      'hartbeespoort family, harties weekend, hartbeespoort dam cruise, little paris harties, harties cableway',
    excerpt:
      'A practical Harties weekend guide for families — best activities ranked by age, where to eat, and how to package it under R6,000 for a family of four.',
    heroImage: hartiesImg,
    publishedAt: '2026-04-04',
    readTime: '7 min',
    category: 'Family Travel',
    ctaDestinationSlug: 'hartbeespoort',
    body: [
      {
        paragraphs: [
          'Hartbeespoort is Johannesburg and Pretoria’s favourite weekend valve — close enough to leave after work on Friday, scenic enough to feel genuinely away. For families, the activity menu beats almost every other Gauteng escape.',
        ],
      },
      {
        heading: 'Best activities by age',
        paragraphs: [],
        bullets: [
          'Toddlers (2–5): Animal farms, gentle dam cruises, hotel pools.',
          'Tweens (6–12): Hartbeespoort Cableway, jet boat rides, Little Paris.',
          'Teens (13+): Quad biking, jet skis, sunset cruises, zip-lining.',
          'Parents: Spa treatments, wine tastings, scenic drives.',
        ],
      },
      {
        heading: 'Don’t miss the cableway',
        paragraphs: [
          'The Hartbeespoort Aerial Cableway lifts you 200m above the dam in five minutes for some of Gauteng’s best panoramic views. Visit at sunset for golden-hour photography.',
        ],
      },
      {
        heading: 'Family budget guide',
        paragraphs: [
          'A two-night Harties weekend for a family of four — including accommodation, cableway, a dam cruise and one quad-biking session — typically lands between R5,500 and R8,500 with our packages.',
        ],
      },
    ],
  },
  {
    slug: 'magaliesburg-romantic-weekend-ideas',
    title: 'Magaliesburg Romantic Weekend Ideas',
    metaTitle: 'Magaliesburg Romantic Weekend | Spa, Picnic & Cruise Ideas',
    metaDescription:
      'Romantic Magaliesburg weekend ideas — private picnics, spa days, hot-air balloons and dam cruises. Couples escape from R1,600pp.',
    keywords:
      'magaliesburg romantic, magaliesburg spa weekend, romantic gauteng getaway, magaliesburg honeymoon',
    excerpt:
      'Five proven romantic ideas for a Magaliesburg weekend — from sunrise hot-air balloons to private dam picnics — and how to bundle them affordably.',
    heroImage: magaliesImg,
    publishedAt: '2026-04-05',
    readTime: '6 min',
    category: 'Romance',
    ctaDestinationSlug: 'magaliesburg',
    body: [
      {
        paragraphs: [
          'Magaliesburg works for romance because it’s close enough to escape on a whim, but the mountains and old-growth bushveld create a real sense of distance. Here are five ideas that consistently deliver an anniversary-quality weekend.',
        ],
      },
      {
        heading: '1. Sunrise hot-air balloon flight',
        paragraphs: [
          'The Magaliesburg balloon flights launch at first light, drift for an hour over the Cradle of Humankind, and land for a champagne breakfast. Book six weeks ahead in peak season.',
        ],
      },
      {
        heading: '2. Private dam picnic',
        paragraphs: [
          'Several resorts offer private picnic platforms on the dam shore — your own table, served by the kitchen, no other guests in earshot. Brilliant for proposals and milestone anniversaries.',
        ],
      },
      {
        heading: '3. Spa day with hydrotherapy',
        paragraphs: [
          'Magaliesburg’s mountain-spring water makes its spa scene world-class. Book a couples’ treatment with hydrotherapy circuits before dinner.',
        ],
      },
      {
        heading: '4. Sunset buffet cruise',
        paragraphs: [
          'A cliché for a reason — golden hour over the dam with a buffet table, low light and warm wind. Pair with a hotel transfer so neither of you has to drive.',
        ],
      },
      {
        heading: '5. Slow morning, late checkout',
        paragraphs: [
          'The most under-rated romance hack — book a late checkout and have breakfast in bed. Several Travel Affordable Magaliesburg packages include this as a free upgrade.',
        ],
      },
    ],
  },
  {
    slug: 'mpumalanga-panorama-route-3-day-itinerary',
    title: 'Mpumalanga Panorama Route 3-Day Itinerary',
    metaTitle: 'Mpumalanga Panorama Route 3 Days | Blyde River Canyon Plan',
    metaDescription:
      'A complete 3-day Mpumalanga Panorama Route plan — Blyde River Canyon, God’s Window, Bourke’s Luck Potholes & Graskop. Plus Kruger add-on tips.',
    keywords:
      'panorama route itinerary, blyde river canyon, gods window, bourkes luck potholes, mpumalanga 3 days',
    excerpt:
      'A practical, no-rush three-day plan for the Panorama Route — what to see, where to sleep, and how to add a short Kruger safari at the end.',
    heroImage: mpumalangaImg,
    publishedAt: '2026-04-06',
    readTime: '10 min',
    category: 'Itinerary',
    ctaDestinationSlug: 'mpumalanga',
    body: [
      {
        paragraphs: [
          'Mpumalanga’s Panorama Route is a 200km loop of cliff edges, waterfalls and geological wonders — and it’s easily one of the world’s most underrated road trips. This three-day plan covers the highlights without rushing.',
        ],
      },
      {
        heading: 'Day 1 — Drive in, Pinnacle, God’s Window',
        paragraphs: [
          'Arrive in Graskop by lunchtime. After checking in, hit Pinnacle Rock and God’s Window for late-afternoon light. Dinner at Harrie’s Pancakes — a Graskop institution.',
        ],
      },
      {
        heading: 'Day 2 — Bourke’s Luck Potholes & Three Rondavels',
        paragraphs: [
          'Early start to Bourke’s Luck Potholes when the light is still soft and the crowds haven’t arrived. Continue to the Three Rondavels viewpoint over Blyde River Canyon. Picnic lunch on site, then optional boat trip on Blyde Dam.',
        ],
      },
      {
        heading: 'Day 3 — Lisbon and Berlin Falls, then onward',
        paragraphs: [
          'Knock out the waterfall trio (Mac Mac, Lisbon, Berlin) before noon, then either drive home or transfer to Kruger for a 2-night safari extension.',
        ],
      },
      {
        heading: 'Adding a Kruger safari',
        paragraphs: [
          'Most travellers regret not adding Kruger to their Mpumalanga trip. A two-night safari extension typically costs R3,500–R8,500pp depending on lodge tier. Travel Affordable bundles both into a single quote.',
        ],
      },
    ],
  },
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);

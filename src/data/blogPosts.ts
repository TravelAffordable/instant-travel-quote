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


import durbanAdAsset from '@/assets/durban-ad1.png.asset.json';
import capeTownImg from '@/assets/destinations/cape-town.jpg';
import sunCityAdAsset from '@/assets/suncity-ad2.png.asset.json';
import hartiesImg from '@/assets/destinations/hartbeespoort.jpg';
import magaliesImg from '@/assets/destinations/magaliesberg.jpg';
import mpumalangaImg from '@/assets/destinations/mpumalanga.jpg';

export const blogPosts: BlogPost[] = [
  {
    slug: 'durban-golden-mile-holiday-guide-2026',
    title: 'Soak Up the Golden Coast: Why a Durban Beach Getaway Is Your Best Affordable Escape',
    metaTitle: 'Durban Getaways from R950pp | Travel Affordable',
    metaDescription:
      'Warm Indian Ocean waves, uShaka Marine World, harbour boat cruises and the Golden Mile promenade — complete Durban getaway packages from R950 per person.',
    keywords:
      'durban getaway, durban packages, ushaka marine world, durban boat cruise, golden mile promenade, affordable durban holiday',
    excerpt:
      'Warm Indian Ocean waves, thrilling marine adventures, ocean breezes and coastal boat cruises — all starting from just R950 per person with Travel Affordable.',
    heroImage: durbanAdAsset.url,
    publishedAt: '2026-08-31',
    readTime: '6 min',
    category: 'Destination Guide',
    ctaDestinationSlug: 'durban',
    body: [
      {
        paragraphs: [
          'Warm Indian Ocean waves, thrilling marine adventures, ocean breezes, and coastal boat cruises — all starting from just R950 per person with Travel Affordable.',
          'There is an effortless magic to Durban that you simply won’t find anywhere else in South Africa. With its year-round sunshine, sub-tropical sea breeze, golden beachfront promenade, and rich cultural rhythm, Durban is the ultimate playground for anyone craving a coastal recharge.',
          'Whether you’re looking for a romantic seaside weekend, a sun-drenched family adventure, or an unforgettable holiday with friends, organizing every piece of the puzzle shouldn’t feel like hard work.',
          'Travel Affordable makes your coastal escape simple, stylish, and genuinely affordable. With all-inclusive packages starting from just R950 per person, the Golden Mile is ready for you.',
        ],
      },
      {
        heading: 'What Awaits You on a Travel Affordable Durban Getaway?',
        paragraphs: [
          'Our packages are designed to combine relaxing beachfront accommodation with Durban’s most iconic must-do activities. When you book with Travel Affordable, here is what’s waiting for you:',
        ],
      },
      {
        heading: '🐬 1. World-Class Thrills at uShaka Marine World',
        paragraphs: [
          'Step into South Africa’s favourite marine theme park. Marvel at sharks and exotic sea life in the underground aquarium shipwrecks, watch world-renowned dolphin and seal presentations, or turn up the excitement on the slides and splash zones at Wet ‘n Wild.',
        ],
      },
      {
        heading: '🛥️ 2. Scenic Durban Harbour & Coastal Boat Cruises',
        paragraphs: [
          'Take in the stunning Durban skyline from the water. Cruise through the bustling Durban harbour or head out to sea to feel the coastal swell, spot marine life, and take in panoramic views of the coast.',
        ],
      },
      {
        heading: '🌴 3. The Iconic Beachfront Promenade & City Culture',
        paragraphs: [
          'Stroll, cycle, or skate along the famous Golden Mile promenade. Enjoy authentic Durban street food, browse vibrant beachfront craft markets, explore Moses Mabhida Stadium, or dive into the bustling nightlife along Florida Road.',
        ],
      },
      {
        heading: '🚐 4. Convenient Shuttle Options on Selected Packages',
        paragraphs: [
          'Skip the stress of navigating city traffic or hunting for parking. On selected packages, we provide safe, comfortable shuttle services connecting your accommodation directly to your scheduled activities.',
        ],
      },
      {
        heading: '🏨 5. Accommodation Matched to Your Style and Budget',
        paragraphs: [
          'From budget-friendly stays close to the action to relaxing seaside hotels, we secure vetted accommodation options tailored to your exact group size and budget.',
        ],
      },
      {
        heading: 'Complete Flexibility: Travel When and How You Want',
        paragraphs: [
          'Your holiday should fit your schedule — not the other way around. With Travel Affordable, you enjoy complete freedom:',
        ],
        bullets: [
          '📅 Choose Your Own Dates: Whether it’s a quick weekend break or an extended coastal holiday, pick any travel dates that suit you.',
          '💳 50% Deposit Secures Your Booking: Lock in your room, activities, and prices today with just a 50% deposit, and settle the balance before you travel.',
          '📋 Zero-Stress Planning: We handle the itinerary, activity vouchers, and accommodation confirmations so all you have to do is pack your sunscreen and swimwear.',
        ],
      },
      {
        heading: 'Ready for More Sunshine, More Fun, and More Memories?',
        paragraphs: [
          'The ocean is calling, and your dream beachfront holiday is only a few clicks away.',
        ],
      },
      {
        heading: 'How to Book Your Durban Getaway',
        paragraphs: [
          'Getaway packages start from just R950 p.p. Availability fills up fast on weekends and holidays — secure your spot now!',
        ],
        bullets: [
          'Visit our website: www.travelaffordable.co.za',
          'Call our travel desk: 079 681 3869',
          'Chat instantly on WhatsApp: Send a WhatsApp message to 079 681 3869 with your preferred dates and guest count, and we’ll send you a tailored quote today.',
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
      'cape town budget, affordable cape town holiday, table mountain budget, va waterfront affordable, cape town packages',
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
        heading: 'Free and affordable activities worth your time',
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
    title: 'Why Your Next Iconic Sun City Escape Is Closer (and More Affordable) Than You Think',
    metaTitle: 'Sun City Getaways from R1,290pp | Travel Affordable',
    metaDescription:
      'Valley of the Waves, Pilanesberg safaris, selected meals and shuttle options — complete Sun City getaway packages from R1,290 per person. Choose your own dates.',
    keywords:
      'sun city getaway, sun city packages, valley of the waves, pilanesberg safari, affordable sun city holiday',
    excerpt:
      'Escape the city rush, dive into the iconic Valley of the Waves, embark on a sunset safari, and create unforgettable memories — all from just R1,290 per person.',
    heroImage: sunCityAdAsset.url,
    publishedAt: '2026-08-31',
    readTime: '6 min',
    category: 'Destination Guide',
    ctaDestinationSlug: 'sun-city',
    body: [
      {
        paragraphs: [
          'Escape the city rush, dive into the iconic Valley of the Waves, embark on a sunset safari, and create unforgettable memories — all starting from just R1,290 per person with Travel Affordable.',
          'There is a reason Sun City remains South Africa’s crown jewel of holiday destinations. Tucked against the rugged, malaria-free backdrop of the Pilanesberg mountains, it offers a world of pure magic: tropical palm trees, world-class entertainment, roaring wave pools, and the thrilling call of the wild.',
          'For many, planning a getaway to this legendary kingdom feels out of reach or overwhelming to coordinate. Between sourcing comfortable accommodation, securing park entry tickets, sorting out activities, and managing meals, costs quickly spiral.',
          'At Travel Affordable, we’ve changed the game. We believe world-class travel experiences shouldn’t come with luxury-tier stress. With complete getaway packages starting from just R1,290 per person, your dream Sun City retreat is ready when you are.',
        ],
      },
      {
        heading: 'What Makes a Travel Affordable Sun City Getaway Unbeatable?',
        paragraphs: [
          'When you book with Travel Affordable, you aren’t just getting a room key — you are securing an all-in-one curated holiday experience designed for couples, families, and groups of friends.',
        ],
      },
      {
        heading: '🌊 1. Unlimited Fun at the Valley of the Waves',
        paragraphs: [
          'Feel the warm sand beneath your feet and hear the roar of the mechanical surf. Whether you’re plunging down the adrenaline-pumping slides, drifting peacefully along the Lazy River, or relaxing in a sun lounger cocktail in hand, full access to the iconic Valley of the Waves is the ultimate summer highlight.',
        ],
      },
      {
        heading: '🐘 2. Thrilling Safari & Big 5 Wildlife Drives',
        paragraphs: [
          'Sun City borders the world-renowned Pilanesberg National Park. Step aboard a guided safari open truck and journey through ancient volcanic landscapes to spot elephants, lions, rhinos, and towering giraffes in their natural habitat.',
        ],
      },
      {
        heading: '🍽️ 3. Gourmet Dining & Selected Meal Experiences',
        paragraphs: [
          'Holidays are meant for indulgence. Our curated packages include delicious selected meal experiences — from hearty buffet spreads to relaxed resort dining — so you never have to worry about where your next great meal is coming from.',
        ],
      },
      {
        heading: '🚐 4. Stress-Free Shuttle Options',
        paragraphs: [
          'Leave the driving and navigation to us. On selected packages, we offer convenient, safe, and comfortable shuttle options connecting your accommodation directly to all activities and experiences.',
        ],
      },
      {
        heading: '🏨 5. Tailored Accommodation to Suit Every Budget',
        paragraphs: [
          'Whether you want a budget-smart local lodge nearby or a premium resort stay, we source and pair the best vetted accommodation options to fit your exact group size and preference.',
        ],
      },
      {
        heading: 'Travel on Your Terms: Freedom & Flexibility',
        paragraphs: [
          'We know that one size never fits all when it comes to planning getaways. That’s why every Travel Affordable package gives you complete control:',
        ],
        bullets: [
          '📅 Choose Your Own Dates: Travel midweek for peace and quiet, or book a high-energy weekend retreat — you pick the check-in date that works for your schedule.',
          '💳 Only 50% Deposit Secures Your Spot: You don’t need the full amount right away. Lock in your dates, rates, and activities today with just a 50% deposit.',
          '✨ Complete Peace of Mind: Once booked, our team provides your full travel itinerary, hotel confirmation codes, and direct activity schedules so you can simply pack your bags and enjoy.',
        ],
      },
      {
        heading: 'Ready for More Experiences, More Memories, and More Time Together?',
        paragraphs: [
          'Life moves fast, but the memories you make with the people who matter most last forever. Don’t wait for “someday” — Sun City is calling.',
        ],
      },
      {
        heading: 'How to Book Your Getaway',
        paragraphs: [
          'Packages start from R1,290 p.p. Limited availability on peak dates — book early to secure your spot!',
        ],
        bullets: [
          'Visit our website: www.travelaffordable.co.za',
          'Call our travel desk: 079 681 3869',
          'Chat instantly on WhatsApp: Send us a message on 079 681 3869 with your preferred dates and group size, and our team will build your custom quote in minutes.',
        ],
      },
    ],
  },

  {
    slug: 'hartbeespoort-family-getaway-guide',
    title: 'Harties Family Getaway Guide',
    metaTitle: 'Harties Family Getaway | Best Activities & Resorts',
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
          'Harties is Johannesburg and Pretoria’s favourite weekend valve — close enough to leave after work on Friday, scenic enough to feel genuinely away. For families, the activity menu beats almost every other Gauteng escape.',
        ],
      },
      {
        heading: 'Best activities by age',
        paragraphs: [],
        bullets: [
          'Toddlers (2–5): Animal farms, gentle dam cruises, hotel pools.',
          'Tweens (6–12): Harties Cableway, jet boat rides, Little Paris.',
          'Teens (13+): Quad biking, jet skis, sunset cruises, zip-lining.',
          'Parents: Spa treatments, wine tastings, scenic drives.',
        ],
      },
      {
        heading: 'Don’t miss the cableway',
        paragraphs: [
          'The Harties Aerial Cableway lifts you 200m above the dam in five minutes for some of Gauteng’s best panoramic views. Visit at sunset for golden-hour photography.',
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
    title: 'Magalies Romantic Weekend Ideas',
    metaTitle: 'Magalies Romantic Weekend | Spa, Picnic & Cruise Ideas',
    metaDescription:
      'Romantic Magalies weekend ideas — private picnics, spa days, hot-air balloons and dam cruises. Couples escape from R1,600pp.',
    keywords:
      'magaliesburg romantic, magaliesburg spa weekend, romantic gauteng getaway, magaliesburg honeymoon',
    excerpt:
      'Five proven romantic ideas for a Magalies weekend — from sunrise hot-air balloons to private dam picnics — and how to bundle them affordably.',
    heroImage: magaliesImg,
    publishedAt: '2026-04-05',
    readTime: '6 min',
    category: 'Romance',
    ctaDestinationSlug: 'magaliesburg',
    body: [
      {
        paragraphs: [
          'Magalies works for romance because it’s close enough to escape on a whim, but the mountains and old-growth bushveld create a real sense of distance. Here are five ideas that consistently deliver an anniversary-quality weekend.',
        ],
      },
      {
        heading: '1. Sunrise hot-air balloon flight',
        paragraphs: [
          'The Magalies balloon flights launch at first light, drift for an hour over the Cradle of Humankind, and land for a champagne breakfast. Book six weeks ahead in peak season.',
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
          'Magalies’s mountain-spring water makes its spa scene world-class. Book a couples’ treatment with hydrotherapy circuits before dinner.',
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
          'The most under-rated romance hack — book a late checkout and have breakfast in bed. Several Travel Affordable Magalies packages include this as a free upgrade.',
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

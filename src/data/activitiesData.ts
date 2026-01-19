// Activity data structure shared between BuildPackage and LiveHotelQuoteCard
export interface Activity {
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

// Map package destination IDs to activity group keys
export const destinationToActivityKey: Record<string, string> = {
  'durban': 'Durban Beachfront Accommodation',
  'umhlanga': 'Durban Beachfront Accommodation',
  'harties': 'Harties Cruise and Cableway Accommodation',
  'magalies': 'Harties Cruise and Cableway Accommodation',
  'cape-town': 'Cape Town Beachfront Accommodation',
  'johannesburg': 'Johannesburg, Sandton and Soweto Accommodation',
  'sun-city': 'Sun City Getaways',
  'mpumalanga': 'Mpumalanga Getaways',
  'bali': 'Bali Adventure',
  'dubai': 'Dubai Luxury',
  'thailand': 'Thailand Adventure',
  'knysna': 'Garden Route Accommodation',
  'vaal-river': 'Vaal River Accommodation',
  'bela-bela': 'Bela Bela Accommodation',
  'pretoria': 'Johannesburg, Sandton and Soweto Accommodation',
};

// All activities organized by destination
export const activitiesByDestination: Record<string, Activity[]> = {
  'Durban Beachfront Accommodation': [
    { name: 'Ushaka Marine World', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 500, child: 420, freeAge: 3 } },
    { name: 'Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 150, child: 100, freeAge: 0 } },
    { name: 'Moses Mabhida Stadium', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100', rates: { adult: 80, child: 65, freeAge: 0 } },
    { name: '60 minute full body massage at a beachfront spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 700, child: 450, freeAge: 12 } },
    { name: 'Open top Bus 3 hours', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 250, child: 250, freeAge: 0 } },
    { name: 'Daily shuttle transport', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 0, child: 0, freeAge: 0 }, isShuttle: true, shuttleBaseCost: 800 },
    { name: 'Gondola Boat cruise with romantic picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 750, child: 750, freeAge: 0 } },
    { name: '1 hour Waterfront pedal boat', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 250, child: 250, freeAge: 0 } },
    { name: 'Segway Glides on the beachfront', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 750, child: 750, freeAge: 0 } },
    { name: 'Airport shuttle to Durban Hotels', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 400, child: 400, freeAge: 0 } },
    { name: 'Trip from Durban Beachfront to Umhlanga main beach and The Oceans Mall', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100', rates: { adult: 850, child: 850, freeAge: 0 } },
    { name: 'Romantic or Happy Birthday settings in room', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=100', rates: { adult: 950, child: 950, freeAge: 0 } },
  ],
  'Harties Cruise and Cableway Accommodation': [
    { name: '2 Hour Sunset Champagne Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Lunchtime Buffet Boat Cruise', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: '2 Hour Breakfast Brunch Buffet Cruise', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 600, child: 400, freeAge: 6 } },
    { name: 'The Alba Luxury Fine Dining Cruise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 820, child: 620, freeAge: 6 } },
    { name: 'Harties Cableway', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 350, child: 230, freeAge: 0 } },
    { name: '1 Hour Horse Riding', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100', rates: { adult: 350, child: 350, freeAge: 0 } },
    { name: '1 Hour Horse Riding and Romantic Picnic', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=100', rates: { adult: 700, child: 0, freeAge: 0 } },
    { name: '1 Hour Quad Biking', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 500, child: 500, freeAge: 0 } },
    { name: '60 Minute Full Body Massage', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 600, child: 380, freeAge: 0 } },
    { name: 'Lion & Safari Park', image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=100', rates: { adult: 460, child: 300, freeAge: 12 } },
    { name: 'Dikhololo Game Reserve Drive', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 480, child: 350, freeAge: 12 } },
  ],
  'Cape Town Beachfront Accommodation': [
    { name: 'Robben Island', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 450, child: 250, freeAge: 1, childAgeRange: { min: 5, max: 18 } } },
    { name: 'Table Mountain Cableway', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=100', rates: { adult: 510, child: 250, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: '2 Days Sightseeing Tour Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 450, child: 320, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Cape Point and Penguin Explorer', image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=100', rates: { adult: 620, child: 420, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: '1 Day Sightseeing Tour Bus', image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=100', rates: { adult: 330, child: 210, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Wine Route Tour, Paarl, Franschoek, Stellenbosch', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=100', rates: { adult: 750, child: 440, freeAge: 0, childAgeRange: { min: 2, max: 11 } } },
    { name: 'Sunset Bus Tour to Signal Hill with Picnic', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100', rates: { adult: 230, child: 180, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Sunset Champagne Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 600, child: 350, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'V&A Waterfront Harbour and Seal Cruise', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 120, child: 70, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
  ],
  'Johannesburg, Sandton and Soweto Accommodation': [
    { name: 'Johannesburg and Soweto Bus Tour', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100', rates: { adult: 750, child: 390, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Lesedi Cultural Village and Lion And Safari Park', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 1400, child: 800, freeAge: 0, childAgeRange: { min: 6, max: 18 } } },
    { name: 'Apartheid Museum', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=100', rates: { adult: 200, child: 100, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Gold Reef City Theme Park', image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=100', rates: { adult: 350, child: 280, freeAge: 0, childAgeRange: { min: 3, max: 12 } } },
    { name: 'Johannesburg City Tour', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=100', rates: { adult: 550, child: 300, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
  ],
  'Mpumalanga Getaways': [
    { name: 'Panorama Route Full Day Tour', image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=100', rates: { adult: 1200, child: 700, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: 'Kruger National Park Day Safari', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 1800, child: 1000, freeAge: 0, childAgeRange: { min: 4, max: 17 } } },
    { name: "God's Window and Three Rondavels", image: 'https://images.unsplash.com/photo-1580256087713-963146b8d1a3?w=100', rates: { adult: 600, child: 350, freeAge: 0 } },
    { name: 'Blyde River Canyon Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 250, child: 150, freeAge: 0 } },
    { name: 'Graskop Gorge Lift', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 180, child: 100, freeAge: 0 } },
  ],
  'Sun City Getaways': [
    { name: 'Sun City and Valley of the Waves Entrance', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 550, child: 400, freeAge: 2 }, isComboEntry: true },
    { name: 'Pilanesberg Game Drive in Safari Truck', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 650, child: 450, freeAge: 6 } },
    { name: 'Lunch Inside Sun City', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100', rates: { adult: 350, child: 250, freeAge: 0 } },
    { name: 'Shuttle to Sun City from Guesthouse', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=100', rates: { adult: 0, child: 0, freeAge: 0 }, isShuttle: true, shuttleBaseCost: 800 },
    { name: 'Sun City Golf Course', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100', rates: { adult: 1200, child: 0, freeAge: 0 } },
    { name: 'Zip Slide Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 350, freeAge: 8 } },
    { name: 'Segway Tour', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 380, child: 380, freeAge: 0 } },
    { name: '1 Hour Quad Biking Fun in Harties', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 450, child: 450, freeAge: 0, childAgeRange: { min: 10, max: 17 } } },
    { name: 'Harties Cableway', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', rates: { adult: 360, child: 220, freeAge: 3 } },
    { name: 'Breakfast Sun City Area Guesthouse A', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100', rates: { adult: 150, child: 75, freeAge: 0, childAgeRange: { min: 0, max: 5 } } },
  ],
  'Bali Adventure': [
    { name: 'Ubud Monkey Forest', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 120, child: 80, freeAge: 3 } },
    { name: 'Tegallalang Rice Terraces', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 50, child: 30, freeAge: 5 } },
    { name: 'Uluwatu Temple Sunset Tour', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=100', rates: { adult: 350, child: 200, freeAge: 5 } },
    { name: 'Bali Swing Experience', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=100', rates: { adult: 450, child: 300, freeAge: 6 } },
    { name: 'Waterbom Bali Water Park', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 650, child: 450, freeAge: 3 } },
    { name: 'Tanah Lot Temple Visit', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=100', rates: { adult: 80, child: 50, freeAge: 5 } },
    { name: 'Bali Safari and Marine Park', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 850, child: 600, freeAge: 3 } },
  ],
  'Dubai Luxury': [
    { name: 'Burj Khalifa At The Top', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 450, child: 350, freeAge: 4 } },
    { name: 'Dubai Marina Dinner Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 650, child: 450, freeAge: 4 } },
    { name: 'Desert Safari with BBQ Dinner', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=100', rates: { adult: 550, child: 400, freeAge: 4 } },
    { name: 'Aquaventure Waterpark', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 750, child: 600, freeAge: 3 } },
    { name: 'Dubai Frame Visit', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 180, child: 120, freeAge: 3 } },
    { name: 'Dubai Mall and Fountain Show', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Palm Jumeirah Monorail', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=100', rates: { adult: 80, child: 60, freeAge: 3 } },
  ],
  'Thailand Adventure': [
    { name: 'Bangkok Grand Palace Tour', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 350, child: 200, freeAge: 5 } },
    { name: 'Floating Markets Tour', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 450, child: 280, freeAge: 5 } },
    { name: 'Phi Phi Islands Day Trip', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 850, child: 550, freeAge: 4 } },
    { name: 'Thai Cooking Class', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100', rates: { adult: 550, child: 350, freeAge: 6 } },
    { name: 'Elephant Sanctuary Visit', image: 'https://images.unsplash.com/photo-1559131583-f176a2eb61db?w=100', rates: { adult: 950, child: 650, freeAge: 5 } },
    { name: 'Chiang Mai Night Market', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=100', rates: { adult: 0, child: 0, freeAge: 0 } },
    { name: 'Thai Massage Session', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 350, child: 250, freeAge: 10 } },
  ],
  'Garden Route Accommodation': [
    { name: 'Knysna Heads Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 200, freeAge: 3 } },
    { name: 'Tsitsikamma Canopy Tour', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 650, child: 450, freeAge: 7 } },
    { name: 'Bloukrans Bungee Jump', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 1200, child: 0, freeAge: 18 } },
    { name: 'Oyster Farm Tour and Tasting', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rates: { adult: 280, child: 150, freeAge: 5 } },
    { name: 'Monkeyland Primate Sanctuary', image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=100', rates: { adult: 320, child: 180, freeAge: 3 } },
  ],
  'Vaal River Accommodation': [
    { name: 'Vaal River Boat Cruise', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 450, child: 280, freeAge: 4 } },
    { name: 'Water Skiing Session', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 550, child: 400, freeAge: 8 } },
    { name: 'Jet Ski Rental (1 Hour)', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100', rates: { adult: 650, child: 0, freeAge: 16 } },
    { name: 'River Fishing Experience', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100', rates: { adult: 350, child: 200, freeAge: 5 } },
  ],
  'Bela Bela Accommodation': [
    { name: 'Forever Resort Hot Springs', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100', rates: { adult: 280, child: 180, freeAge: 3 } },
    { name: 'Zebula Golf Course', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100', rates: { adult: 950, child: 0, freeAge: 18 } },
    { name: 'Game Drive at Mabalingwe', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=100', rates: { adult: 650, child: 400, freeAge: 5 } },
    { name: 'Quad Biking Adventure', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100', rates: { adult: 500, child: 400, freeAge: 10 } },
  ],
};

// Helper function to get activities for a package destination
export const getActivitiesForDestination = (destination: string): Activity[] => {
  const activityKey = destinationToActivityKey[destination];
  return activityKey ? activitiesByDestination[activityKey] || [] : [];
};

// Helper function to find matching activity by name (fuzzy match)
export const findActivityByName = (name: string, activities: Activity[]): Activity | undefined => {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b(hours?|hrs?)\b/g, 'hour')
      .replace(/\s+/g, ' ')
      .trim();

  const n = normalize(name);
  if (!n) return undefined;

  // 1) Exact normalized match
  const exact = activities.find(a => normalize(a.name) === n);
  if (exact) return exact;

  // 2) Substring match (either direction)
  const substring = activities.find(a => {
    const an = normalize(a.name);
    return an.includes(n) || n.includes(an);
  });
  if (substring) return substring;

  // 3) Token overlap score (handles wording differences like "3 hour open bus city tour" vs "Open top Bus 3 hours")
  const tokens = new Set(n.split(' ').filter(t => t.length >= 2));
  let best: { activity: Activity; score: number } | undefined;

  for (const a of activities) {
    const an = normalize(a.name);
    const at = new Set(an.split(' ').filter(t => t.length >= 2));

    let overlap = 0;
    tokens.forEach(t => {
      if (at.has(t)) overlap += 1;
    });

    // Light domain boosts
    if (n.includes('ushaka') && an.includes('ushaka')) overlap += 3;
    if ((n.includes('bus') || n.includes('tour')) && (an.includes('bus') || an.includes('tour'))) overlap += 1;
    if (n.includes('cruise') && an.includes('cruise')) overlap += 2;
    if (n.includes('shuttle') && an.includes('shuttle')) overlap += 2;

    const score = overlap / Math.max(1, Math.min(tokens.size, at.size));
    if (!best || score > best.score) best = { activity: a, score };
  }

  return best && best.score >= 0.34 ? best.activity : undefined;
};

// Calculate activity cost for adults
export const calculateAdultActivityCost = (activity: Activity, adults: number): number => {
  if (activity.isShuttle && activity.shuttleBaseCost) {
    return activity.shuttleBaseCost;
  }
  return activity.rates.adult * adults;
};

// Calculate activity cost for a child based on age
export const calculateChildActivityCost = (activity: Activity, age: number): number => {
  if (age < activity.rates.freeAge) return 0;
  
  if (activity.rates.childAgeRange) {
    const { min, max } = activity.rates.childAgeRange;
    if (age >= min && age <= max) {
      return activity.rates.child;
    }
    return 0;
  }
  
  return activity.rates.child;
};

// Calculate total activity cost for selected activities
export const calculateTotalActivityCost = (
  selectedActivities: string[],
  activities: Activity[],
  adults: number,
  childrenAges: number[]
): number => {
  let total = 0;
  
  for (const activityName of selectedActivities) {
    const activity = findActivityByName(activityName, activities);
    if (!activity) continue;
    
    // Adult cost
    total += calculateAdultActivityCost(activity, adults);
    
    // Children cost
    for (const age of childrenAges) {
      total += calculateChildActivityCost(activity, age);
    }
  }
  
  return total;
};

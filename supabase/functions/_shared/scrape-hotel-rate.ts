/**
 * Two-step hotel rate extraction:
 * 1. Use Firecrawl SEARCH to find the hotel's direct Booking.com listing URL
 * 2. Use Firecrawl SCRAPE on that URL to extract accurate ZAR rates
 *
 * Same proven approach as premium-live-booking.ts (resolveBookingListingUrl + scrapeMarkdown).
 */

const SCRAPE_TIMEOUT_MS = 15_000;

/**
 * Get default check-in/out dates (next Friday to Sunday).
 */
function getDefaultDates(): { checkIn: string; checkOut: string } {
  const now = new Date();
  const day = now.getUTCDay();
  const daysToFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(now);
  friday.setUTCDate(friday.getUTCDate() + daysToFriday);
  const sunday = new Date(friday);
  sunday.setUTCDate(sunday.getUTCDate() + 2);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: fmt(friday), checkOut: fmt(sunday) };
}

/**
 * Step 1: Find the hotel's direct Booking.com listing URL via Firecrawl search.
 */
async function findBookingUrl(
  realName: string,
  city: string,
  apiKey: string,
): Promise<string | null> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `site:booking.com "${realName}" ${city}`,
        limit: 5,
        lang: 'en',
        country: 'za',
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.data ?? data?.results ?? [];

    // Find the direct hotel listing URL (not search results)
    for (const result of results) {
      const url = typeof result?.url === 'string' ? result.url : '';
      if (url.includes('booking.com') && url.includes('/hotel/')) {
        return url;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Step 2: Build the hotel page URL with dates and scrape it.
 */
function buildDatedUrl(baseUrl: string, checkIn: string, checkOut: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('checkin', checkIn);
  url.searchParams.set('checkout', checkOut);
  url.searchParams.set('group_adults', '2');
  url.searchParams.set('group_children', '0');
  url.searchParams.set('no_rooms', '1');
  url.searchParams.set('selected_currency', 'ZAR');
  url.searchParams.set('sb_price_type', 'total');
  url.searchParams.set('type', 'total');
  return url.toString();
}

/**
 * Scrape markdown from a URL via Firecrawl.
 */
async function firecrawlScrape(url: string, apiKey: string): Promise<string | null> {
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
        location: { country: 'ZA', languages: ['en'] },
        waitFor: 1500,
      }),
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });

    if (!response.ok) {
      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 3000));
      }
      return null;
    }

    const data = await response.json();
    return data?.data?.markdown || data?.markdown || null;
  } catch {
    return null;
  }
}

/**
 * Extract nightly rate from a hotel listing page markdown.
 * Uses the same patterns as premium-live-booking.ts parseRoomOptions.
 */
function extractNightlyRate(markdown: string, nights: number): number | null {
  const rates: number[] = [];

  // Pattern 1: "ZAR X,XXX<br>per night" (Booking.com room table format)
  const perNightPattern = /(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)\s*per\s*night/gi;
  let match;
  while ((match = perNightPattern.exec(markdown)) !== null) {
    const price = parseFloat(match[1].replace(/,/g, ''));
    if (price >= 200 && price <= 50_000) rates.push(price);
  }

  // Pattern 2: "ZAR X,XXX<br>Price" (total price, needs division)
  const totalPricePattern = /<br>(?:ZAR|R)\s*([\d,]+)<br>Price/gi;
  while ((match = totalPricePattern.exec(markdown)) !== null) {
    const total = parseFloat(match[1].replace(/,/g, ''));
    const perNight = Math.round(total / nights);
    if (perNight >= 200 && perNight <= 50_000) rates.push(perNight);
  }

  // Pattern 3: "Price for X nights: ZAR Y,YYY"
  const priceForNightsPattern = /Price\s*(?:for)?\s*(\d+)\s*nights?\s*[:\s]*(?:ZAR|R)\s*([\d,]+)/gi;
  while ((match = priceForNightsPattern.exec(markdown)) !== null) {
    const n = parseInt(match[1]);
    const total = parseFloat(match[2].replace(/,/g, ''));
    const perNight = Math.round(total / n);
    if (perNight >= 200 && perNight <= 50_000) rates.push(perNight);
  }

  if (rates.length === 0) return null;

  // Return the lowest valid nightly rate (cheapest room option)
  return Math.min(...rates);
}

function getNightCount(checkIn: string, checkOut: string): number {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

/**
 * Full pipeline: find Booking URL → scrape with dates → extract rate.
 */
export async function scrapeHotelRate(
  realName: string,
  city: string,
  apiKey: string,
  options?: { checkIn?: string; checkOut?: string },
): Promise<number | null> {
  // Step 1: Find the hotel's Booking.com listing URL
  const bookingUrl = await findBookingUrl(realName, city, apiKey);
  if (!bookingUrl) {
    console.log(`  ✗ ${realName}: no Booking.com URL found`);
    return null;
  }

  // Step 2: Add dates and scrape the hotel page
  const dates = options?.checkIn && options?.checkOut
    ? { checkIn: options.checkIn, checkOut: options.checkOut }
    : getDefaultDates();
  const nights = getNightCount(dates.checkIn, dates.checkOut);
  const datedUrl = buildDatedUrl(bookingUrl, dates.checkIn, dates.checkOut);
  const markdown = await firecrawlScrape(datedUrl, apiKey);
  if (!markdown) {
    console.log(`  ✗ ${realName}: scrape returned no markdown`);
    return null;
  }

  // Step 3: Extract the nightly rate
  const rate = extractNightlyRate(markdown, nights);
  if (rate !== null) {
    console.log(`  ✓ ${realName}: R${rate}/night for ${dates.checkIn} → ${dates.checkOut}`);
  } else {
    console.log(`  ✗ ${realName}: no rate found on listing page`);
  }

  return rate;
}

/**
 * Process hotels sequentially with delay to avoid rate limits.
 * Each hotel requires 2 Firecrawl API calls (search + scrape).
 */
export async function processHotelsSequentially(
  items: { realName: string; city: string }[],
  apiKey: string,
): Promise<Map<string, number>> {
  const rateMap = new Map<string, number>();

  for (let i = 0; i < items.length; i++) {
    const h = items[i];
    const rate = await scrapeHotelRate(h.realName, h.city, apiKey);

    if (rate !== null) {
      rateMap.set(h.realName, rate);
    }

    // Delay between hotels (2 API calls each, need breathing room)
    if (i < items.length - 1) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return rateMap;
}

/**
 * Scrape-based hotel rate extraction using Firecrawl scrape (not search).
 * Builds a Booking.com search URL for a hotel name + city, scrapes the page,
 * and extracts ZAR nightly rates from the rendered markdown.
 *
 * This is the same proven approach used in premium-live-booking.ts.
 */

const SCRAPE_TIMEOUT_MS = 15_000;

/**
 * Build a Booking.com search URL for a given hotel name, city, check-in/out dates.
 * Uses generic dates (next Friday → Sunday) if none provided.
 */
function buildBookingSearchUrl(
  hotelName: string,
  city: string,
  checkIn: string,
  checkOut: string,
): string {
  const query = `${hotelName} ${city}`;
  const url = new URL('https://www.booking.com/searchresults.en-gb.html');
  url.searchParams.set('ss', query);
  url.searchParams.set('checkin', checkIn);
  url.searchParams.set('checkout', checkOut);
  url.searchParams.set('group_adults', '2');
  url.searchParams.set('group_children', '0');
  url.searchParams.set('no_rooms', '1');
  url.searchParams.set('selected_currency', 'ZAR');
  return url.toString();
}

/**
 * Get default check-in/out dates (next Friday to Sunday).
 */
function getDefaultDates(): { checkIn: string; checkOut: string } {
  const now = new Date();
  const day = now.getUTCDay();
  const daysToFriday = (5 - day + 7) % 7 || 7; // next Friday, not today
  const friday = new Date(now);
  friday.setUTCDate(friday.getUTCDate() + daysToFriday);
  const sunday = new Date(friday);
  sunday.setUTCDate(sunday.getUTCDate() + 2);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: fmt(friday), checkOut: fmt(sunday) };
}

/**
 * Extract ZAR nightly rates from Booking.com markdown.
 * Looks for patterns like "ZAR X,XXX" or "R X,XXX" near "per night".
 */
function extractRatesFromMarkdown(markdown: string): number[] {
  const rates: number[] = [];

  // Pattern 1: "ZAR 1,234" per night style (Booking.com table format)
  const tablePattern = /(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)?\s*per\s*night/gi;
  let match;
  while ((match = tablePattern.exec(markdown)) !== null) {
    const price = parseFloat(match[1].replace(/,/g, ''));
    if (price >= 200 && price <= 50_000) rates.push(price);
  }

  // Pattern 2: "Price for X nights" with total, then divide
  // "ZAR 2,468" for 2 nights → 1,234/night
  const totalPattern = /(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)?\s*(?:Price|Total)\s*(?:for\s*(\d+)\s*nights?)?/gi;
  while ((match = totalPattern.exec(markdown)) !== null) {
    const total = parseFloat(match[1].replace(/,/g, ''));
    const nights = match[2] ? parseInt(match[2]) : 2;
    const perNight = total / nights;
    if (perNight >= 200 && perNight <= 50_000) rates.push(Math.round(perNight));
  }

  // Pattern 3: General "R 1,234" or "ZAR 1,234" near accommodation context
  const generalPattern = /(?:ZAR|R)\s*([\d,]+(?:\.\d{2})?)/gi;
  while ((match = generalPattern.exec(markdown)) !== null) {
    const price = parseFloat(match[1].replace(/,/g, ''));
    if (price >= 200 && price <= 50_000) rates.push(price);
  }

  return [...new Set(rates)];
}

/**
 * Scrape a Booking.com URL using Firecrawl and return markdown.
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
        console.warn('Rate limited by Firecrawl, waiting...');
        await new Promise((r) => setTimeout(r, 3000));
      }
      return null;
    }

    const data = await response.json();
    return data?.data?.markdown || data?.markdown || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.warn(`Scrape timed out for ${url}`);
    } else {
      console.error('Firecrawl scrape error:', error);
    }
    return null;
  }
}

/**
 * Scrape the nightly rate for a hotel from Booking.com.
 * Returns the lowest valid nightly rate found, or null.
 */
export async function scrapeHotelRate(
  realName: string,
  city: string,
  apiKey: string,
): Promise<number | null> {
  const { checkIn, checkOut } = getDefaultDates();
  const searchUrl = buildBookingSearchUrl(realName, city, checkIn, checkOut);

  console.log(`  Scraping: ${realName} (${city}) → ${searchUrl.slice(0, 80)}...`);

  const markdown = await firecrawlScrape(searchUrl, apiKey);
  if (!markdown) {
    console.log(`  ✗ ${realName}: no markdown returned`);
    return null;
  }

  const rates = extractRatesFromMarkdown(markdown);

  if (rates.length === 0) {
    console.log(`  ✗ ${realName}: no ZAR rates found in markdown`);
    return null;
  }

  // Use the lowest valid rate (most likely the base room rate)
  const lowestRate = Math.min(...rates);
  console.log(`  ✓ ${realName}: R${lowestRate} (from ${rates.length} rates found)`);
  return lowestRate;
}

/**
 * Process hotels sequentially with delay between each to avoid rate limits.
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

    // Delay between scrapes to avoid rate limits (skip after last)
    if (i < items.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return rateMap;
}

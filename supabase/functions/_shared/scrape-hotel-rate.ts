/**
 * Scrape-based hotel rate extraction using Firecrawl scrape (not search).
 * Builds a Booking.com search URL for a hotel name + city, scrapes the page,
 * and finds the specific hotel's rate in the search results markdown.
 *
 * This uses the same Firecrawl scrape approach as premium-live-booking.ts.
 */

const SCRAPE_TIMEOUT_MS = 15_000;

/**
 * Build a Booking.com search URL for a given hotel name and city.
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
  const daysToFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(now);
  friday.setUTCDate(friday.getUTCDate() + daysToFriday);
  const sunday = new Date(friday);
  sunday.setUTCDate(sunday.getUTCDate() + 2);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkIn: fmt(friday), checkOut: fmt(sunday) };
}

/**
 * Normalize a hotel name for fuzzy matching.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if two hotel names are a fuzzy match.
 * Returns true if the target name is substantially contained in the candidate.
 */
function isNameMatch(candidate: string, target: string): boolean {
  const normCandidate = normalizeName(candidate);
  const normTarget = normalizeName(target);

  // Exact match
  if (normCandidate === normTarget) return true;

  // One contains the other
  if (normCandidate.includes(normTarget) || normTarget.includes(normCandidate)) return true;

  // Word overlap: at least 60% of target words appear in candidate
  const targetWords = normTarget.split(' ').filter(w => w.length > 2);
  const candidateStr = normCandidate;
  const matchingWords = targetWords.filter(w => candidateStr.includes(w));
  if (targetWords.length > 0 && matchingWords.length / targetWords.length >= 0.6) return true;

  return false;
}

/**
 * Extract the rate for a specific hotel from Booking.com search results markdown.
 * The markdown contains multiple hotel listings — we find the one matching our target name.
 *
 * Booking.com search results markdown typically has sections per hotel like:
 * [Hotel Name](url)
 * ...
 * ZAR X,XXX per night / Price for 2 nights: ZAR Y,YYY
 */
function extractHotelRateFromSearchResults(
  markdown: string,
  targetName: string,
  nights: number,
): number | null {
  // Split markdown into sections by hotel listing headers (links)
  // Booking.com markdown typically has: [Hotel Name](booking.com/hotel/...)
  const sections = markdown.split(/(?=\[(?:[^\]]+)\]\(https?:\/\/[^\)]*booking\.com)/);

  for (const section of sections) {
    // Extract the hotel name from the section header
    const headerMatch = section.match(/^\[([^\]]+)\]/);
    if (!headerMatch) continue;

    const sectionHotelName = headerMatch[1];

    // Check if this section matches our target hotel
    if (!isNameMatch(sectionHotelName, targetName)) continue;

    // Found the right hotel section — extract its rate
    const ratePatterns = [
      // "ZAR 1,234<br>per night" or "ZAR 1,234 per night"
      /(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)?\s*per\s*night/gi,
      // Total price divided by nights
      /(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)?\s*(?:Price|Total)/gi,
    ];

    const rates: number[] = [];
    for (const pattern of ratePatterns) {
      let match;
      while ((match = pattern.exec(section)) !== null) {
        const price = parseFloat(match[1].replace(/,/g, ''));
        if (price >= 200 && price <= 50_000) {
          rates.push(price);
        }
      }
    }

    // Also try: any ZAR amount in the section (as fallback)
    if (rates.length === 0) {
      const generalPattern = /(?:ZAR|R)\s*([\d,]+(?:\.\d{2})?)/gi;
      let match;
      while ((match = generalPattern.exec(section)) !== null) {
        const price = parseFloat(match[1].replace(/,/g, ''));
        // For total prices (2 nights), divide by nights
        if (price >= 400 && price <= 100_000) {
          // Check if this looks like a total (higher than typical nightly)
          const asNightly = price / nights;
          if (asNightly >= 200 && asNightly <= 50_000) {
            rates.push(Math.round(asNightly));
          }
          if (price >= 200 && price <= 50_000) {
            rates.push(price);
          }
        } else if (price >= 200 && price <= 50_000) {
          rates.push(price);
        }
      }
    }

    if (rates.length > 0) {
      // Return the lowest rate found for this specific hotel
      return Math.min(...rates);
    }
  }

  // Fallback: if we couldn't match by hotel name sections,
  // try the first hotel result (Booking.com often returns the exact match first)
  const firstRateMatch = markdown.match(/(?:ZAR|R)\s*([\d,]+)\s*(?:<br>|\n)?\s*per\s*night/i);
  if (firstRateMatch) {
    const price = parseFloat(firstRateMatch[1].replace(/,/g, ''));
    if (price >= 200 && price <= 50_000) return price;
  }

  return null;
}

/**
 * Scrape a URL using Firecrawl and return markdown.
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
      console.warn(`Scrape timed out for URL`);
    } else {
      console.error('Firecrawl scrape error:', error);
    }
    return null;
  }
}

/**
 * Scrape the nightly rate for a specific hotel from Booking.com.
 * Returns the hotel's nightly rate, or null if not found.
 */
export async function scrapeHotelRate(
  realName: string,
  city: string,
  apiKey: string,
): Promise<number | null> {
  const { checkIn, checkOut } = getDefaultDates();
  const nights = 2; // Friday to Sunday
  const searchUrl = buildBookingSearchUrl(realName, city, checkIn, checkOut);

  const markdown = await firecrawlScrape(searchUrl, apiKey);
  if (!markdown) {
    console.log(`  ✗ ${realName}: no markdown returned`);
    return null;
  }

  const rate = extractHotelRateFromSearchResults(markdown, realName, nights);

  if (rate !== null) {
    console.log(`  ✓ ${realName}: R${rate}/night`);
  } else {
    console.log(`  ✗ ${realName}: no matching rate found in search results`);
  }

  return rate;
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

    // Delay between scrapes to avoid rate limits
    if (i < items.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return rateMap;
}

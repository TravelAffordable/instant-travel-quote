// Google Ads conversion helper — fires the "Request quote" conversion once
// per successful booking reference. Uses the global gtag installed in index.html.
const SEND_TO = 'AW-18410124842/S4LbCN690-ccEKrs0MPE';
const STORAGE_KEY = 'ta_ads_conversions_sent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const readSent = (): string[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

const writeSent = (refs: string[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(refs.slice(-50)));
  } catch {
    /* storage unavailable — in-memory guard below still applies */
  }
};

const sentThisSession = new Set<string>();

/**
 * Report a successful booking to Google Ads. Safe to call more than once:
 * a given booking reference only ever sends a single conversion.
 */
export function trackBookingConversion(reference?: string, value?: number) {
  if (typeof window === 'undefined' || !reference) return;
  if (sentThisSession.has(reference)) return;

  const stored = readSent();
  if (stored.includes(reference)) {
    sentThisSession.add(reference);
    return;
  }

  if (typeof window.gtag !== 'function') return;

  sentThisSession.add(reference);
  writeSent([...stored, reference]);

  window.gtag('event', 'conversion', {
    send_to: SEND_TO,
    transaction_id: reference,
    ...(typeof value === 'number' && value > 0 ? { value, currency: 'ZAR' } : {}),
  });
}

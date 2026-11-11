/** Normalise a South African phone number for wa.me, or return null if invalid. */
export function normaliseSaPhone(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `27${digits.slice(1)}`;
  else if (!digits.startsWith('27') && digits.length === 9) digits = `27${digits}`;
  return /^27\d{9}$/.test(digits) ? digits : null;
}

export function isValidEmail(raw?: string | null): boolean {
  return !!raw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

export const QUOTE_CONTACT_FOOTER = [
  'Booking terms: This is a quotation only and no booking is confirmed yet. Prices and discounts are subject to availability at the time of booking.',
  '',
  'Travel Affordable',
  'Email: info@travelaffordable.co.za',
  'Website: https://travelaffordable.co.za',
].join('\n');

export function buildWhatsAppUrl(phone: string, body: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
}

export function buildGmailUrl(email: string, subject: string, body: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.trim())}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Turn rendered quote text into tidy plain text lines. */
export function cleanQuoteText(text: string) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l, i, arr) => l !== '' || (i > 0 && arr[i - 1] !== ''))
    .join('\n')
    .trim();
}
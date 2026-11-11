import { useState, type RefObject } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  QUOTE_CONTACT_FOOTER,
  buildGmailUrl,
  buildWhatsAppUrl,
  cleanQuoteText,
  isValidEmail,
  normaliseSaPhone,
} from '@/lib/quoteShare';

interface QuoteShareButtonsProps {
  /** Container holding the rendered quotation; its text becomes the message body. */
  quoteRef: RefObject<HTMLElement>;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  destination: string;
  reference?: string;
}

function openSafely(url: string, setFallback: (u: string) => void) {
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) setFallback(url);
}

export function QuoteShareButtons({ quoteRef, clientName, clientPhone, clientEmail, destination, reference }: QuoteShareButtonsProps) {
  const [error, setError] = useState<string>();
  const [fallback, setFallback] = useState<string>();

  const body = () => {
    const el = quoteRef.current;
    const buttonLabels = new Set(
      Array.from(el?.querySelectorAll('button') ?? []).map((b) => b.innerText.trim()).filter(Boolean),
    );
    const quoteText = cleanQuoteText(
      (el?.innerText ?? '').split('\n').filter((l) => !buttonLabels.has(l.trim())).join('\n'),
    );
    const greeting = `Hi ${clientName?.trim() || 'there'},\n\nThank you for choosing Travel Affordable. Here is your getaway quotation:`;
    return [reference ? `Reference: ${reference}` : '', greeting, '', quoteText, '', QUOTE_CONTACT_FOOTER]
      .filter((part, i) => part !== '' || i > 0)
      .join('\n');
  };

  const sendWhatsApp = () => {
    setFallback(undefined);
    const phone = normaliseSaPhone(clientPhone);
    if (!phone) return setError('Please add a valid client phone number before sending via WhatsApp.');
    setError(undefined);
    openSafely(buildWhatsAppUrl(phone, body()), setFallback);
  };

  const sendGmail = () => {
    setFallback(undefined);
    if (!isValidEmail(clientEmail)) return setError('Please add a valid client email address before sending via Gmail.');
    setError(undefined);
    openSafely(buildGmailUrl(clientEmail!, `Your Travel Affordable Getaway Quotation – ${destination}`, body()), setFallback);
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" onClick={sendWhatsApp} className="whitespace-normal bg-[#25D366] text-white hover:bg-[#1ebe5a]">
          <MessageCircle className="mr-2 h-4 w-4" /> Send this quote via WhatsApp
        </Button>
        <Button type="button" onClick={sendGmail} variant="outline" className="whitespace-normal border-[#EA4335] text-[#EA4335] hover:bg-[#EA4335]/10 hover:text-[#EA4335]">
          <Mail className="mr-2 h-4 w-4" /> Send this quote via Gmail
        </Button>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
      {fallback && (
        <p className="text-sm text-muted-foreground">
          Your browser blocked the new window.{' '}
          <a href={fallback} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
            Tap here to open it
          </a>
        </p>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type QuoteResult } from '@/data/travelData';
import { toast } from 'sonner';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { QuoteCard } from './QuoteCard';

interface QuoteListProps {
  quotes: QuoteResult[];
  onQuoteSelected?: (quote: QuoteResult) => void;
  budget?: string;
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export function QuoteList({ quotes, onQuoteSelected, budget }: QuoteListProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());

  const toggleQuoteSelection = (hotelId: string) => {
    setSelectedQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(hotelId)) {
        newSet.delete(hotelId);
      } else {
        newSet.add(hotelId);
      }
      return newSet;
    });
  };

  const getSelectedQuotes = () => {
    return quotes.filter(q => selectedQuotes.has(q.hotelId));
  };

  const generateQuoteText = (quote: QuoteResult, guestName?: string) => {
    const nightsCount = quote.nights || Math.ceil(
      (new Date(quote.checkOut).getTime() - new Date(quote.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Filter out breakfast mentions from activities unless explicitly included
    const filteredActivities = quote.activitiesIncluded?.filter(activity => {
      const lower = activity.toLowerCase();
      return !lower.includes('breakfast at selected') && 
             !lower.includes('buffet breakfast at selected') &&
             !lower.includes('room only');
    }) || [];

    let quoteText = `TRAVEL AFFORDABLE
QUOTE REQUEST

Greetings${guestName ? ` ${guestName}` : ''}

The discounted package price for your getaway includes:
• ${nightsCount} nights accommodation
`;
    
    filteredActivities.forEach(activity => {
      if (!activity.toLowerCase().includes('accommodation')) {
        quoteText += `• ${activity}\n`;
      }
    });
    
    // Add breakfast only if explicitly included
    if (quote.includesBreakfast) {
      quoteText += `• Breakfast included\n`;
    }

    quoteText += `
Our getaways are stylish and trendy with a bit of affordable sophistication.

DESTINATION: ${quote.destination.toUpperCase()}
HOTEL: ${quote.hotelName}
PACKAGE: ${quote.packageName}

TRAVEL DETAILS
Check-in: ${formatDate(quote.checkIn)}
Check-out: ${formatDate(quote.checkOut)}
Duration: ${nightsCount} nights
Guests: ${quote.adults} Adult${quote.adults > 1 ? 's' : ''}${quote.children > 0 ? `, ${quote.children} Child${quote.children > 1 ? 'ren' : ''}` : ''}
Rooms: ${quote.rooms} x ${quote.roomType || (quote.is4SleeperRoom ? '4 Sleeper' : '2 Sleeper')}

PRICING
Grand Total: ${formatCurrency(quote.totalForGroup)}

To start with your booking process, please click on request to book button below. An email message with your booking details will open. Send the email. Our agents will then be in communication with you, then if you request we will send you the invoice for you to secure your booking.

Once payment is received we will proceed with bookings then send you a confirmation letter with all the important information including ticket information, hotel confirmation numbers, transport schedules where applicable and itineraries for your getaway.

Thank you,
Bookings,
Travel Affordable Pty Ltd

Contact Us
Email: info@travelaffordable.co.za
WhatsApp: +27 79 681 3869
Web: www.travelaffordable.co.za`;

    return quoteText.trim();
  };

  const handleRequestToBook = async (quote: QuoteResult) => {
    const quoteText = generateQuoteText(quote);
    const subject = `Quote Request - ${quote.destination} - ${quote.hotelName}`;
    const body = encodeURIComponent(quoteText);
    
    // Open email client
    const mailtoLink = `mailto:info@travelaffordable.co.za,travelaffordable2017@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    toast.success('Opening email client with your quote request');
    onQuoteSelected?.(quote);
  };

  const handleWhatsApp = (quote: QuoteResult) => {
    const text = `Hi! I'd like to request a booking:\n\n${generateQuoteText(quote)}`;
    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
    onQuoteSelected?.(quote);
  };

  const handleSendSelectedQuotes = (method: 'email' | 'whatsapp') => {
    const selected = getSelectedQuotes();
    if (selected.length === 0) {
      toast.error('Please select at least one quote');
      return;
    }

    const quotesText = selected.map(q => generateQuoteText(q)).join('\n\n---\n\n');
    
    if (method === 'email') {
      const subject = `Quote Requests - ${selected.length} option(s) selected`;
      const mailtoLink = `mailto:info@travelaffordable.co.za,travelaffordable2017@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quotesText)}`;
      window.open(mailtoLink, '_blank');
      toast.success('Opening email client with selected quotes');
    } else {
      const text = `Hi! I'm interested in these quotes:\n\n${quotesText}`;
      window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleSendAllQuotes = () => {
    const quotesText = quotes.map(q => generateQuoteText(q)).join('\n\n---\n\n');
    const subject = `Quote Requests - ${quotes.length} option(s)`;
    const mailtoLink = `mailto:info@travelaffordable.co.za,travelaffordable2017@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quotesText)}`;
    window.open(mailtoLink, '_blank');
    toast.success('Opening email client with all quotes');
  };

  if (quotes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Send All Quotes Button */}
      <Card className="border-accent/50 bg-gradient-to-br from-accent/10 to-accent/5">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Found {quotes.length} quote{quotes.length > 1 ? 's' : ''} for your search
              </p>
              <p className="text-xs text-muted-foreground">
                Send all quotes via email to compare options
              </p>
            </div>
            <Button 
              onClick={handleSendAllQuotes}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send All Quotes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selection Actions */}
      {selectedQuotes.size > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm font-medium">
                {selectedQuotes.size} quote{selectedQuotes.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={() => handleSendSelectedQuotes('email')}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Selected
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendSelectedQuotes('whatsapp')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer Notice */}
      {quotes.length > 0 && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              Please note that the images you see below are not for the hotels in the quote – they are for illustration purposes only. The price you see includes hotel accommodation and the activities associated with the package. Please select the package that you like and that fits your budget, email or WhatsApp it to us using the buttons below so we can send you an accurate quote with available hotel options that suit your budget and preferences.
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-sm text-primary font-medium leading-relaxed">
              You may select individual package/s to send to us via email or WhatsApp by selecting the package/s using the selectors located near the package tour code. To send all the packages you may use the email and WhatsApp buttons at the top of the quotes.
            </p>
          </div>
        </div>
      )}

      {/* Quote Cards - Grouped by Package */}
      {(() => {
        // Group quotes by package name
        const packageGroups: { [key: string]: QuoteResult[] } = {};
        quotes.forEach(quote => {
          if (!packageGroups[quote.packageName]) {
            packageGroups[quote.packageName] = [];
          }
          packageGroups[quote.packageName].push(quote);
        });
        
        const packageNames = Object.keys(packageGroups);
        const hasMultiplePackages = packageNames.length > 1;
        let globalIndex = 0;
        
        return packageNames.map((packageName) => (
          <div key={packageName} className="space-y-4">
            {/* Package Header - Only show if multiple packages */}
            {hasMultiplePackages && (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 mt-6 first:mt-0">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-primary text-center">
                  {packageName}
                </h2>
              </div>
            )}
            
            {packageGroups[packageName].map((quote) => {
              const index = globalIndex++;
              return (
                <QuoteCard 
                  key={`${quote.hotelId}-${quote.packageName}`}
                  quote={quote}
                  index={index}
                  isSelected={selectedQuotes.has(quote.hotelId)}
                  onToggleSelection={() => toggleQuoteSelection(quote.hotelId)}
                  onRequestToBook={() => handleRequestToBook(quote)}
                  onWhatsApp={() => handleWhatsApp(quote)}
                />
              );
            })}
          </div>
        ));
      })()}
    </div>
  );
}

import { useState } from 'react';
import { Check, Home, Package, MessageCircle, Mail, BedDouble, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { type QuoteResult } from '@/data/travelData';
import { toast } from 'sonner';

interface QuoteListProps {
  quotes: QuoteResult[];
  onQuoteSelected?: (quote: QuoteResult) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export function QuoteList({ quotes, onQuoteSelected }: QuoteListProps) {
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

  const generateQuoteText = (quote: QuoteResult) => {
    return `
Quote Request - ${quote.destination}
━━━━━━━━━━━━━━━━━━━━━━━━
Hotel: ${quote.hotelName}
Package: ${quote.packageName}
Check-in: ${formatDate(quote.checkIn)}
Check-out: ${formatDate(quote.checkOut)}
Nights: ${quote.nights}
Guests: ${quote.adults} Adults${quote.children > 0 ? `, ${quote.children} Children` : ''}
Rooms: ${quote.rooms} ${quote.is4SleeperRoom ? '(4-Sleeper)' : '(2-Sleeper)'}
${quote.includesBreakfast ? 'Breakfast: Included' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━
Total: ${formatCurrency(quote.totalForGroup)}
Per Person: ${formatCurrency(quote.totalPerPerson)}
    `.trim();
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

    const quotesText = selected.map(q => generateQuoteText(q)).join('\n\n═══════════════════════════\n\n');
    
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

  if (quotes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
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

      {/* Quote Cards */}
      {quotes.map((quote, index) => (
        <Card 
          key={`${quote.hotelId}-${quote.packageName}`}
          className={`border-0 shadow-soft transition-all ${
            selectedQuotes.has(quote.hotelId) 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'bg-gradient-to-br from-card to-muted/20'
          } ${index === 0 ? 'ring-2 ring-accent/50' : ''}`}
        >
          <CardHeader className="pb-3 bg-muted/30 border-b">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 flex-1">
                <Checkbox 
                  checked={selectedQuotes.has(quote.hotelId)}
                  onCheckedChange={() => toggleQuoteSelection(quote.hotelId)}
                  className="mt-1"
                />
                <div className="flex-1">
                  {index === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-accent text-accent-foreground px-2 py-0.5 rounded-full mb-2 inline-block">
                      Best Value
                    </span>
                  )}
                  <h3 className="text-lg font-bold uppercase tracking-wide text-foreground mb-1">
                    {quote.hotelName}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    {quote.packageName}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-primary font-display">
                  {formatCurrency(quote.totalForGroup)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(quote.totalPerPerson)}/person
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{quote.destination}</span>
              <span>•</span>
              <span>{quote.nights} nights</span>
              <span>•</span>
              <span>{quote.rooms} {quote.is4SleeperRoom ? '4-sleeper' : '2-sleeper'} room{quote.rooms > 1 ? 's' : ''}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Package Description - THE KEY INFO */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-primary mb-2">Package: {quote.packageName}</p>
                  {quote.activitiesIncluded && quote.activitiesIncluded.length > 0 && (
                    <ul className="space-y-1.5">
                      {quote.activitiesIncluded.map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Room & Additional Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>{quote.roomType}</span>
              </div>
              {quote.includesBreakfast && (
                <div className="flex items-center gap-2 text-accent">
                  <Check className="w-4 h-4" />
                  <span>Breakfast included</span>
                </div>
              )}
              {quote.is4SleeperRoom && (
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <BedDouble className="w-4 h-4" />
                  <span>4-Sleeper room for 3-4 guests</span>
                </div>
              )}
            </div>

            {/* Hotel Image */}
            <div className="rounded-lg overflow-hidden">
              <img 
                src={quote.hotelImage} 
                alt={quote.hotelName}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleRequestToBook(quote)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Request to Book
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleWhatsApp(quote)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useState, useCallback } from 'react';
import { ImagePlus, Check, Home, Package, MessageCircle, Mail, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { type QuoteResult, packages } from '@/data/travelData';
import { toast } from 'sonner';

interface QuoteListProps {
  quotes: QuoteResult[];
  onQuoteSelected?: (quote: QuoteResult) => void;
}

// Hotel Image Grid Component with Drag & Drop
function HotelImageGrid() {
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

  const handleDrop = useCallback((index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setImages(prev => {
            const newImages = [...prev];
            newImages[index] = result;
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleRemove = useCallback((index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden bg-muted/30 cursor-pointer group"
          onDrop={(e) => handleDrop(index, e)}
          onDragOver={handleDragOver}
        >
          {image ? (
            <>
              <img 
                src={image} 
                alt={`Hotel image ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
              >
                ×
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <ImagePlus className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Drop image</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
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
          key={quote.hotelId} 
          className={`border-0 shadow-soft transition-all ${
            selectedQuotes.has(quote.hotelId) 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'bg-gradient-to-br from-card to-muted/20'
          } ${index === 0 ? 'ring-2 ring-accent/50' : ''}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={selectedQuotes.has(quote.hotelId)}
                  onCheckedChange={() => toggleQuoteSelection(quote.hotelId)}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                        Best Value
                      </span>
                    )}
                    <CardTitle className="text-lg font-display">{quote.hotelName}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {quote.destination} • {quote.nights} nights • {quote.rooms} {quote.is4SleeperRoom ? '4-sleeper' : '2-sleeper'} room{quote.rooms > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary font-display">
                  {formatCurrency(quote.totalForGroup)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(quote.totalPerPerson)}/person
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>{quote.roomType}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>{quote.packageName}</span>
              </div>
              {quote.includesBreakfast && (
                <div className="flex items-center gap-2 text-accent col-span-2">
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

            {/* Hotel Images */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hotel Images</p>
              <HotelImageGrid />
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

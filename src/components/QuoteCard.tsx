import { useState, useCallback } from 'react';
import { Home, Package, MessageCircle, Mail, BedDouble, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { type QuoteResult } from '@/data/travelData';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  hartiesBudget2SleeperImages, 
  hartiesAffordable2SleeperImages 
} from '@/data/hartiesHotelImages';

interface QuoteCardProps {
  quote: QuoteResult;
  index: number;
  isSelected: boolean;
  onToggleSelection: () => void;
  onRequestToBook: () => void;
  onWhatsApp: () => void;
}

// Get hotel images - uses specific carousel images for Harties properties
const getHotelImages = (hotelImage: string, hotelName: string): string[] => {
  // Check if this is a Harties Budget 2-sleeper hotel
  const budgetMatch = hotelName.match(/Harties Budget 2 Sleeper Option (\d+)/i);
  if (budgetMatch) {
    const optionNum = parseInt(budgetMatch[1], 10);
    if (optionNum >= 1 && optionNum <= 8) {
      return hartiesBudget2SleeperImages[optionNum - 1] || [hotelImage];
    }
  }
  
  // Check if this is a Harties Affordable 2-sleeper hotel
  const affordableMatch = hotelName.match(/Harties Affordable 2 Sleeper Option (\d+)/i);
  if (affordableMatch) {
    const optionNum = parseInt(affordableMatch[1], 10);
    if (optionNum >= 1 && optionNum <= 8) {
      return hartiesAffordable2SleeperImages[optionNum - 1] || [hotelImage];
    }
  }
  
  // Default: use the main image repeated (for non-Harties hotels)
  return [hotelImage, hotelImage, hotelImage, hotelImage];
};

export function QuoteCard({ 
  quote, 
  index, 
  isSelected, 
  onToggleSelection, 
  onRequestToBook, 
  onWhatsApp 
}: QuoteCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setCurrentSlide(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setCurrentSlide(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const hotelImages = getHotelImages(quote.hotelImage, quote.hotelName);

  return (
    <Card 
      className={`border-0 shadow-soft transition-all overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-primary bg-primary/5' 
          : 'bg-gradient-to-br from-card to-muted/20'
      } ${index === 0 ? 'ring-2 ring-accent/50' : ''}`}
    >
      {/* Image Carousel at Top */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {hotelImages.map((image, idx) => (
              <div key={idx} className="flex-[0_0_100%] min-w-0">
                <img 
                  src={image} 
                  alt={`${quote.hotelName} - Image ${idx + 1}`}
                  className="w-full h-56 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-md transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground rounded-full p-2 shadow-md transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {hotelImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-background' : 'bg-background/50'
              }`}
            />
          ))}
        </div>

        {/* Best Value Badge */}
        {index === 0 && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
            Best Value
          </span>
        )}
      </div>

      <CardHeader className="pb-3 bg-muted/30 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={onToggleSelection}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold uppercase tracking-wide text-foreground mb-2">
                {quote.hotelName}
              </h3>
              <p className="text-base font-bold uppercase tracking-wide text-primary">
                {quote.packageName}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            {/* Adults only: show per person price first, then grand total */}
            {quote.children === 0 ? (
              <>
                <p className="text-2xl font-bold text-primary font-display">
                  {formatCurrency(roundToNearest10(quote.totalForGroup / quote.adults))}
                </p>
                <p className="text-xs text-muted-foreground">per person</p>
                <p className="text-sm font-semibold text-primary mt-1">
                  {formatCurrency(quote.totalForGroup)} total
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-primary font-display">
                  {formatCurrency(quote.totalForGroup)}
                </p>
                <p className="text-xs text-muted-foreground">Grand Total</p>
                <p className="text-xs text-muted-foreground">
                  {quote.adults} Adult{quote.adults > 1 ? 's' : ''}, {quote.children} Kid{quote.children > 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <span>{quote.destination}</span>
          <span>•</span>
          <span>{quote.nights} nights</span>
          <span>•</span>
          <span>{quote.rooms} x {quote.roomType || (quote.is4SleeperRoom ? '4 Sleeper' : '2 Sleeper')}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Package Description - THE KEY INFO */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Package className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-primary mb-2">Package: {quote.packageName}</p>
              {(() => {
                // Use affordableInclusions if hotel tier is affordable and package has them
                const inclusions = (quote.hotelTier === 'affordable' && quote.affordableInclusions && quote.affordableInclusions.length > 0)
                  ? quote.affordableInclusions
                  : quote.activitiesIncluded;
                
                return inclusions && inclusions.length > 0 ? (
                  <ul className="space-y-1.5">
                    {inclusions
                      .filter(activity => {
                        const lower = activity.toLowerCase();
                        return !lower.includes('breakfast at selected') &&
                               !lower.includes('buffet breakfast at selected') &&
                               !lower.includes('room only');
                      })
                      .map((activity, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    {quote.includesBreakfast && (
                      <li className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Breakfast included</span>
                      </li>
                    )}
                  </ul>
                ) : null;
              })()}
            </div>
          </div>
        </div>

        {/* Room Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Home className="w-4 h-4" />
            <span>{quote.roomType || (quote.is4SleeperRoom ? '4 Sleeper' : '2 Sleeper')}</span>
          </div>
          {quote.is4SleeperRoom && quote.roomTypeName && (
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <BedDouble className="w-4 h-4" />
              <span>{quote.roomTypeName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={onRequestToBook}
          >
            <Mail className="w-4 h-4 mr-2" />
            Request to Book
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onWhatsApp}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp Us
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

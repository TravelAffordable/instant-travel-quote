import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MapPin, Star } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
}

export function Hero({ onGetQuote }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2073&q=80"
          alt="Beautiful beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/90 text-secondary-foreground mb-6 animate-float">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">LIMITED TIME: Up to 30% OFF Selected Packages!</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight animate-slide-up">
            Discover Your
            <span className="block text-gradient-sunset bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Dream Vacation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Unbeatable prices on amazing getaways across South Africa and beyond. 
            Get an instant quote in seconds!
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-sm">15+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm">1000+ Happy Travelers</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={onGetQuote}
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-sunset-glow"
            >
              Get Instant Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-semibold border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={() => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Destinations
            </Button>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="hidden lg:block absolute right-20 top-1/2 -translate-y-1/2 animate-float">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl w-64 transform rotate-3">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=100"
              alt="Cape Town"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-semibold text-sm">Cape Town Package</p>
              <p className="text-xs text-muted-foreground">3 nights • 2 adults</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-primary">R6,400</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

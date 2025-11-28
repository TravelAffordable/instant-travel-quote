import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { QuoteCalculator } from '@/components/QuoteCalculator';
import { DestinationCard } from '@/components/DestinationCard';
import { GroupTours } from '@/components/GroupTours';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { destinations } from '@/data/travelData';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const scrollToQuote = () => {
    quoteRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewPackages = (destinationId: string) => {
    // Scroll to quote calculator and pre-select destination
    scrollToQuote();
  };

  const popularDestinations = destinations.filter(d => d.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero onGetQuote={scrollToQuote} />

      {/* Instant Quote Calculator */}
      <section id="quote" ref={quoteRef} className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
              No More Waiting
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get Your Quote Instantly
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fill in your travel details and get an accurate quote in seconds. 
              No emails, no waiting - just instant pricing for your dream getaway.
            </p>
          </div>
          <QuoteCalculator />
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our hand-picked destinations across South Africa and beyond. 
              Each location offers unique experiences at unbeatable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularDestinations.map(destination => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onViewPackages={handleViewPackages}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Group Tours */}
      <GroupTours />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default Index;

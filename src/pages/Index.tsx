import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { DestinationCard } from '@/components/DestinationCard';
import { GroupTours } from '@/components/GroupTours';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { destinations } from '@/data/travelData';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleViewPackages = (destinationId: string) => {
    // Scroll to top to use the hero form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularDestinations = destinations.filter(d => d.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Quote Form */}
      <Hero onGetQuote={() => {}} />

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

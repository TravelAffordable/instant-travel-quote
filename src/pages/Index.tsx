import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GroupTours } from '@/components/GroupTours';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import CapeTownSocialAds from '@/components/CapeTownSocialAds';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleViewPackages = (destinationId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const popularDestinations = destinations.filter(d => d.popular);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Quote Form */}
      <Hero onGetQuote={() => {}} />

      {/* Destinations section removed - now integrated into Hero */}

      {/* Cape Town Social Ads */}
      <section id="cape-town-ads" className="bg-muted/30">
        <CapeTownSocialAds />
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

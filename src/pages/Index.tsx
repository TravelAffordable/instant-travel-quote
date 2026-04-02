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


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Quote Form */}
      <Hero onGetQuote={() => {}} />

      {/* Destinations section removed - now integrated into Hero */}

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

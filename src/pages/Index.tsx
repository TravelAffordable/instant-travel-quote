import { Header } from '@/components/Header';
import { HeroStatic } from '@/components/home/HeroStatic';
import { DestinationGrid } from '@/components/home/DestinationGrid';
import { FeaturedExperiences } from '@/components/home/FeaturedExperiences';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { SEO } from '@/components/SEO';

import { useState } from 'react';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Affordable South African Holidays & Getaways | Travel Affordable"
        description="Choose your destination, pick your experience, choose where you stay and see your complete holiday price. Durban, Cape Town, Sun City, Kruger, Harties & more."
        canonical="/"
        keywords="south african holiday packages, affordable getaways, durban, cape town, sun city, kruger, harties, magalies, mpumalanga, bela bela, umhlanga, knysna, family holidays"
      />
      <Header />
      <HeroStatic />
      <DestinationGrid />
      <FeaturedExperiences />
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default Index;

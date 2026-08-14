import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { HowItWorks } from '@/components/home/HowItWorks';
import { DestinationGrid } from '@/components/home/DestinationGrid';
import { FeaturedExperiences } from '@/components/home/FeaturedExperiences';
import { ShotleftDeals } from '@/components/home/ShotleftDeals';
import { GroupTours } from '@/components/GroupTours';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
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
      <HeroCarousel />
      <HowItWorks />
      <DestinationGrid />
      <FeaturedExperiences />
      <WhyChooseUs />
      <ShotleftDeals />
      <GroupTours />
      <Testimonials />
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default Index;

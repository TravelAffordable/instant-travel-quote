import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GroupTours } from '@/components/GroupTours';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { SEO } from '@/components/SEO';


const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Travel Affordable | Cheap SA Holiday Packages from R1,400pp"
        description="Instant quotes for affordable South African holidays — Durban, Cape Town, Sun City, Hartbeespoort, Magaliesburg, Bela-Bela & more. Family, group & school trip specialists."
        canonical="/"
        keywords="cheap holiday packages south africa, affordable getaways, durban packages, cape town holidays, sun city, hartbeespoort accommodation, group tours, school trips"
      />
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

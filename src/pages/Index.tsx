import { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GroupTours } from '@/components/GroupTours';
import { Testimonials } from '@/components/Testimonials';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { HomeDestinationsShowcase } from '@/components/HomeDestinationsShowcase';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { SEO } from '@/components/SEO';



const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Affordable Weekend and Midweek Getaways and Amazing Shot Left Holiday Experiences to Harties, Sun City, Durban, Cape Town, Magalies, Bela Bela, Mpumalanga, Emerald Casino Cruise, The Blyde Crystal Beach, Knysna | Travel Affordable"
        description="Affordable Weekend and Midweek Getaways and Amazing Shot Left Holiday Experiences to Harties, Sun City, Durban, Cape Town, Magalies, Bela Bela, Mpumalanga, Emerald Casino Cruise, The Blyde Crystal Beach, Knysna, Thailand, Dubai & Bali."
        canonical="/"
        keywords="affordable weekend getaways, luxury shot left getaways, affordable accommodation shot left, durban, harties, cape town, sun city, mpumalanga, bela bela, magalies, the blyde, crystal beach, munyaka, vaal cruise, emerald casino, knysna, thailand, dubai, bali"
      />
      <Header />
      
      {/* Hero Section with Quote Form */}
      <Hero onGetQuote={() => {}} />

      {/* Destination packages showcase (mirrors destination pages) */}
      <HomeDestinationsShowcase />

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

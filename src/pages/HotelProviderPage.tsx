import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AccommodationProviderQuote } from '@/components/AccommodationProviderQuote';
import { ChatBot } from '@/components/ChatBot';
import { useState } from 'react';

const HotelProviderPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <AccommodationProviderQuote />
      </div>
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default HotelProviderPage;

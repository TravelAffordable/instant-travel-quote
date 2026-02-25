import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BusHireQuote } from '@/components/BusHireQuote';
import { ChatBot } from '@/components/ChatBot';
import { useState } from 'react';

const BusHirePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <BusHireQuote />
      </div>
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default BusHirePage;

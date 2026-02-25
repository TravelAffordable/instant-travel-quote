import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TravelAgentQuote } from '@/components/TravelAgentQuote';
import { ChatBot } from '@/components/ChatBot';
import { useState } from 'react';

const TravelAgentPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <TravelAgentQuote />
      </div>
      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default TravelAgentPage;

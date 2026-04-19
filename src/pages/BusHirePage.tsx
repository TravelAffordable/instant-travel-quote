import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BusHireQuote } from '@/components/BusHireQuote';
import { ChatBot } from '@/components/ChatBot';
import { SEO } from '@/components/SEO';
import { useState } from 'react';

const BusHirePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Bus Hire Quotes South Africa | Group Transport & Tours"
        description="Instant bus hire quotes for groups, schools, churches & companies across South Africa. Includes activities, accommodation & transport. 22, 32, 60 seater buses available."
        canonical="/bus-hire"
        keywords="bus hire south africa, group bus quotes, charter bus, school bus hire, church group transport, 60 seater bus"
      />
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

import { useState } from 'react';
import { PremiumHeader } from '@/components/premium/PremiumHeader';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { PopularDestinations } from '@/components/premium/PopularDestinations';
import { Footer } from '@/components/Footer';
import { ChatBot } from '@/components/ChatBot';
import { SEO } from '@/components/SEO';

const PROMISES = [
  { title: 'Incredible experiences', copy: 'Handpicked for you' },
  { title: 'Flexible dates', copy: 'Travel when it suits you' },
  { title: 'Handpicked stays', copy: 'For every style & budget' },
  { title: 'Great value', copy: 'Quality at the right price' },
];

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title="Affordable South African Getaways & Holiday Packages | Travel Affordable"
        description="Memories that matter. Choose your destination, pick your getaway experience, choose where you stay and see your complete price before you book."
        canonical="/"
        keywords="south african getaways, holiday packages, durban, cape town, sun city, harties, umhlanga, mpumalanga, knysna, bela-bela"
      />
      <PremiumHeader overlay />
      <PremiumHero />

      <section className="bg-burgundy-dark py-8">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {PROMISES.map((p) => (
            <div key={p.title}>
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-champagne">
                {p.title}
              </p>
              <p className="mt-1 text-sm text-white/80">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <PopularDestinations />

      <section id="deals" className="bg-cream pb-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-card p-8 shadow-md ring-1 ring-border/60 md:p-10">
            <h2 className="font-display text-2xl font-bold text-burgundy-dark md:text-3xl">
              Premium enough to desire. Affordable enough to book.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Every Travel Affordable getaway combines your experience and your stay into one clear price.
              Choose a destination, pick your getaway, tell us your dates and travellers, then choose where you
              stay — you will always see your complete price before you book.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Need help or a group quote? WhatsApp us on{' '}
              <a
                href="https://wa.me/27796813869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-burgundy underline"
              >
                079 681 3869
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
    </div>
  );
};

export default Index;

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

// Preserves the original instant-quote engine on its own route.
export default function QuotePage() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Get an instant holiday quote | Travel Affordable"
        description="Build your own South African getaway and get an instant quote for accommodation and activities."
        canonical="/quote"
      />
      <Header />
      <div className="h-16" />
      <Hero onGetQuote={() => {}} />
      <Footer />
    </div>
  );
}

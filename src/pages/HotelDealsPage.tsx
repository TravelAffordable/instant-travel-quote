import { HotelDealBooking } from "@/components/HotelDealBooking";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { hotelDeals } from "@/data/hotelDeals";

const HotelDealsPage = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Hotel Deals | Travel Affordable" description="Affordable South African hotel deals — book the hotel only or add fun activities." />
    <Header />
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground">Hotel Deals</h1>
      <div className="mt-8 space-y-14">
        {hotelDeals.map((d) => (
          <section key={d.slug} id={d.slug} aria-labelledby={`${d.slug}-heading`} className="scroll-mt-24 border-b border-border pb-12 last:border-0">
            <h2 id={`${d.slug}-heading`} className="mb-5 text-2xl md:text-3xl font-bold text-foreground">{d.destination} Hotel Deals</h2>
            <HotelDealBooking deal={d} />
          </section>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default HotelDealsPage;

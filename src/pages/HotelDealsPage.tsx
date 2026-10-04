import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { hotelDeals } from "@/data/hotelDeals";

const HotelDealsPage = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Hotel Deals | Travel Affordable" description="Affordable South African hotel deals — book the hotel only or add fun activities." />
    <Header />
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground">Hotel Deals</h1>
      <p className="text-center text-muted-foreground mt-2 mb-8">
        Click a deal to book the hotel only, or add fun activities.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotelDeals.map((d) => (
          <Link key={d.slug} to={`/hotel-deals/${d.slug}`} className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <img src={d.image} alt={d.title} loading="lazy" width={1024} height={1024} className="w-full aspect-square object-cover" />
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default HotelDealsPage;

import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { HotelDealBooking } from "@/components/HotelDealBooking";
import { hotelDeals } from "@/data/hotelDeals";
import NotFound from "./NotFound";

const HotelDealPage = () => {
  const { slug } = useParams();
  const deal = hotelDeals.find((d) => d.slug === slug);
  if (!deal) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${deal.title} | Hotel Deals`} description={`${deal.title} — ${deal.breakfast}. Book the hotel only or add fun activities.`} />
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/hotel-deals" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All hotel deals
        </Link>
        <HotelDealBooking key={deal.slug} deal={deal} />
      </main>
      <Footer />
    </div>
  );
};

export default HotelDealPage;

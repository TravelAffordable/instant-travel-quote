import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import NotFound from "./NotFound";
import { Button } from "@/components/ui/button";
import {
  hotelDeals, getDealActivities, dealHotelTotal, dealActivityTotal, DEAL_ADULTS, DEAL_WHATSAPP,
} from "@/data/hotelDeals";

const rand = (n: number) => `R${n.toLocaleString("en-ZA")}`;

const HotelDealPage = () => {
  const { slug } = useParams();
  const deal = hotelDeals.find((d) => d.slug === slug);
  const [nights, setNights] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [withActivities, setWithActivities] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const activities = useMemo(() => (deal ? getDealActivities(deal) : []), [deal]);
  if (!deal) return <NotFound />;

  const hotel = dealHotelTotal(deal, nights);
  const extras = withActivities
    ? activities.filter((a) => selected.includes(a.name)).reduce((s, a) => s + dealActivityTotal(a), 0)
    : 0;
  const total = hotel + extras;
  const chosen = withActivities ? selected : [];

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const book = () => {
    const msg = [
      `Hi Travel Affordable, I'd like to book this hotel deal:`,
      deal.title,
      `Check-in: ${checkIn || "flexible"} · ${nights} night(s) · ${DEAL_ADULTS} adults`,
      chosen.length ? `Activities: ${chosen.join(", ")}` : "Hotel only",
      `Total: ${rand(total)} (${rand(Math.round(total / DEAL_ADULTS))} per person)`,
    ].join("\n");
    window.open(`https://wa.me/${DEAL_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${deal.title} | Hotel Deals`} description={`${deal.title} — ${deal.breakfast}. Book the hotel only or add fun activities.`} />
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/hotel-deals" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> All hotel deals
        </Link>
        <img src={deal.image} alt={deal.title} width={1024} height={1024} className="w-full rounded-xl shadow-lg" />

        <h1 className="mt-6 text-2xl font-bold text-foreground">{deal.title}</h1>
        <p className="text-muted-foreground">{deal.breakfast} · {DEAL_ADULTS} adults sharing</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">Check-in date
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-medium">Number of nights
            <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} night{n > 1 ? "s" : ""}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant={withActivities ? "outline" : "default"} onClick={() => setWithActivities(false)}>
            I want to book hotel only
          </Button>
          <Button variant={withActivities ? "default" : "outline"} onClick={() => setWithActivities(true)}>
            {withActivities ? "I want to book hotel and fun activities" : "Let me add some fun activities"}
          </Button>
        </div>

        {withActivities && (
          <section className="mt-5">
            <h2 className="text-lg font-semibold text-foreground mb-2">Choose your fun activities</h2>
            <div className="flex flex-wrap gap-2">
              {activities.map((a) => {
                const on = selected.includes(a.name);
                return (
                  <button key={a.name} type="button" onClick={() => toggle(a.name)} aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-input hover:bg-muted"}`}>
                    {on && <Check className="h-3.5 w-3.5" />}
                    {a.name.charAt(0) + a.name.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <div className="sticky bottom-0 mt-6 rounded-xl border bg-card p-5 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {chosen.length ? `Hotel + ${chosen.length} activit${chosen.length > 1 ? "ies" : "y"}` : "Hotel only"} · {nights} night{nights > 1 ? "s" : ""} · {DEAL_ADULTS} adults
          </p>
          <p className="text-4xl font-bold text-primary mt-1">{rand(total)}</p>
          <p className="text-sm text-muted-foreground">{rand(Math.round(total / DEAL_ADULTS))} per person · discounts subject to availability</p>
          <Button className="mt-4 w-full" size="lg" onClick={book}>Book on WhatsApp</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HotelDealPage;

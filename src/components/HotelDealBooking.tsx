import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  type HotelDeal, getDealActivities, dealHotelTotal, dealActivityTotal, dealRoomsRequired, DEAL_ADULTS, DEAL_WHATSAPP,
} from "@/data/hotelDeals";

const rand = (n: number) => `R${n.toLocaleString("en-ZA")}`;

export const HotelDealBooking = ({ deal }: { deal: HotelDeal }) => {
  const [nights, setNights] = useState(2);
  const [adults, setAdults] = useState(DEAL_ADULTS);
  const [checkIn, setCheckIn] = useState("");
  const [withActivities, setWithActivities] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [soloNoticeOpen, setSoloNoticeOpen] = useState(false);

  const pickAdults = (n: number) => {
    setAdults(n);
    if (n === 1) setSoloNoticeOpen(true);
  };

  const activities = useMemo(() => getDealActivities(deal), [deal]);

  const rooms = dealRoomsRequired(adults);
  const hotel = dealHotelTotal(deal, nights, adults);
  const extras = withActivities
    ? activities.filter((a) => selected.includes(a.name)).reduce((s, a) => s + dealActivityTotal(a, adults), 0)
    : 0;
  const total = hotel === null ? null : hotel + extras;
  const chosen = withActivities ? selected : [];

  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));

  const book = () => {
    const msg = [
      `Hi Travel Affordable, I'd like to book this hotel deal:`,
      deal.title,
      `Check-in: ${checkIn || "flexible"} · ${nights} night(s) · ${adults} adult(s)`,
      `Accommodation: ${rooms} two-sleeper room(s)${adults % 2 ? " (one room for single occupancy)" : ""}`,
      chosen.length ? `Activities: ${chosen.join(", ")}` : "Hotel only",
      total === null ? "Please confirm the single-occupancy rate and full quotation."
        : `Total: ${rand(total)} (${rand(Math.round(total / adults))} per person)`,
    ].join("\n");
    window.open(`https://wa.me/${DEAL_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div>
        <img src={deal.image} alt={deal.title} width={1024} height={1024} className="w-full rounded-xl shadow-lg" />

        <h2 className="mt-6 text-2xl font-bold text-foreground">{deal.title}</h2>
        <p className="text-muted-foreground">{deal.breakfast} · {adults} adult{adults > 1 ? "s" : ""} · {rooms} two-sleeper room{rooms > 1 ? "s" : ""}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm font-medium">Check-in date
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" />
          </label>
          <label className="text-sm font-medium">Number of adults
            <select value={adults} onChange={(e) => pickAdults(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} adult{n > 1 ? "s" : ""}</option>)}
            </select>
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
                  <Button key={a.name} variant="outline" type="button" onClick={() => toggle(a.name)} aria-pressed={on}
                    className={`inline-flex h-auto whitespace-normal text-left items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-input hover:bg-muted"}`}>
                    {on && <Check className="h-3.5 w-3.5" />}
                    {a.name.charAt(0) + a.name.slice(1).toLowerCase()}
                  </Button>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-6 rounded-lg border bg-card p-5 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {chosen.length ? `Hotel + ${chosen.length} activit${chosen.length > 1 ? "ies" : "y"}` : "Hotel only"} · {nights} night{nights > 1 ? "s" : ""} · {adults} adult{adults > 1 ? "s" : ""} · {rooms} room{rooms > 1 ? "s" : ""}
          </p>
          <p className="text-4xl font-bold text-primary mt-1">{total === null ? "Price on request" : rand(Math.round(total / adults))}</p>
          {total !== null && <p className="text-sm text-primary">per person</p>}
          <p className="text-sm text-muted-foreground">{total === null ? "Single-occupancy rate to be confirmed" : `Total for ${adults} adult${adults > 1 ? "s" : ""}: ${rand(total)}`} · discounts subject to availability</p>
          <Button className="mt-4 w-full" size="lg" onClick={book}>Book on WhatsApp</Button>
        </div>

        <Dialog open={soloNoticeOpen} onOpenChange={setSoloNoticeOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Travelling on your own?</DialogTitle>
              <DialogDescription>
                The advertised rates are for people traveling together sharing a hotel room, single
                occupant rates are different from the 2 sleeper options.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setSoloNoticeOpen(false)}>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
};


import { HotelDealBooking } from '@/components/HotelDealBooking';
import { hotelDeals } from '@/data/hotelDeals';

/**
 * Hotel deals shown on the homepage right after the destinations grid.
 * Deals are stacked one after the other exactly as they appear on the
 * Hotel Deals page — each with its own heading and full booking section.
 */
export function HotelDealsShowcase() {
  return (
    <section id="hotel-deals" className="bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="font-display text-center text-4xl font-bold text-navy md:text-5xl">
          Our curated, discounted hotel deals. Make it possible for you and those special ones
        </h2>

        <div className="mt-10 space-y-14">
          {hotelDeals.map((d) => (
            <div key={d.slug} id={d.slug} className="scroll-mt-24">
              <h3 className="mb-5 text-2xl md:text-3xl font-bold text-foreground">
                {d.destination} Hotel Deals
              </h3>
              <HotelDealBooking deal={d} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

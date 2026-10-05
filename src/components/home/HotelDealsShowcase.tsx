import { Link } from 'react-router-dom';
import { hotelDeals } from '@/data/hotelDeals';
import { formatCurrency } from '@/lib/utils';

/**
 * Curated hotel deals shown on the homepage right after the destinations grid.
 * Each card opens that deal's booking page.
 */
export function HotelDealsShowcase() {
  return (
    <section id="hotel-deals" className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-4xl font-bold text-gold md:text-5xl">
          OUR CURATED, DISCOUNTED HOTEL DEALS. MAKE IT POSSIBLE FOR YOU AND THOSE SPECIAL ONES
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hotelDeals.map((d) => (
            <Link
              key={d.slug}
              to={`/hotel-deals/${d.slug}`}
              className="group block overflow-hidden rounded-2xl bg-card shadow-md ring-1 ring-border transition-shadow hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={`${d.title} — discounted hotel deal`}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-navy shadow">
                  {d.destination}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold leading-snug text-navy">{d.title}</h3>
                {d.breakfast && (
                  <p className="mt-1 text-sm text-navy/70">{d.breakfast}</p>
                )}
                <p className="mt-2 text-primary">
                  <span className="text-2xl font-bold">R{d.pricePerPerson2Nights.toLocaleString('en-ZA')}</span>
                  <span className="ml-1 text-sm font-medium">per person, 2 nights sharing</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

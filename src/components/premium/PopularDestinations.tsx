import { Link } from 'react-router-dom';
import { catalogueDestinations } from '@/data/destinationCatalogue';

/** Order approved in the mockup. */
const ORDER = [
  'cape-town',
  'durban',
  'umhlanga',
  'hartbeespoort',
  'sun-city',
  'mpumalanga',
  'knysna',
  'bela-bela',
];

export function PopularDestinations() {
  const items = ORDER.map((slug) => catalogueDestinations.find((d) => d.slug === slug)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );

  return (
    <section id="destinations" className="bg-cream py-14 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-burgundy">
          Popular destinations
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((d) => (
            <Link
              key={d.slug}
              to={`/destinations/${d.slug}`}
              className="group relative block overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-premium)]"
            >
              <div className="aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
                <img
                  src={d.image}
                  alt={`${d.name} getaways`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/90 via-burgundy-dark/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-sans text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white">
                  {d.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

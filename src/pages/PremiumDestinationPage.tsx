import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PremiumHeader } from '@/components/premium/PremiumHeader';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { GetawayCard } from '@/components/premium/GetawayCard';
import { getDestinationPage } from '@/data/destinationPages';
import { getCatalogueDestination } from '@/data/destinationCatalogue';
import { getPackagesByDestination } from '@/data/travelData';
import NotFound from './NotFound';

const SITE_URL = 'https://travelaffordable.co.za';

/**
 * Premium destination page (approved direction). Durban is the prototype but the
 * page is fully data-driven so the same architecture rolls out to every destination.
 */
export default function PremiumDestinationPage() {
  const params = useParams<{ slug: string }>();
  // Route may be registered without a param (e.g. /destinations/durban prototype).
  const slug = params.slug ?? 'durban';
  const data = getDestinationPage(slug);
  const catalogue = getCatalogueDestination(slug);

  if (!data) return <NotFound />;

  const packages = data.destinationId ? getPackagesByDestination(data.destinationId) : [];
  const canonical = `/destinations/${data.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: data.name,
    description: data.intro,
    url: `${SITE_URL}${canonical}`,
    address: { '@type': 'PostalAddress', addressRegion: data.region, addressCountry: 'ZA' },
  };

  return (
    <div className="min-h-screen bg-cream">
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={canonical}
        keywords={data.keywords}
        jsonLd={jsonLd}
      />
      <PremiumHeader overlay />

      {/* Hero */}
      <section className="relative">
        <div className="relative min-h-[480px] w-full md:min-h-[560px]">
          <img
            src={data.heroImage}
            alt={`${data.name} getaways`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-dark/92 via-burgundy-dark/55 to-burgundy-dark/10" />
          <div className="container relative mx-auto flex min-h-[480px] flex-col justify-center px-4 pb-16 pt-32 md:min-h-[560px]">
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.28em] text-champagne">
              {data.region}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Your {data.name}.
              <span className="block text-champagne">Your way.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90">
              Choose the experience that excites you most.
              <br className="hidden sm:block" /> We'll take care of the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Getaways */}
      <main className="container mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.24em] text-burgundy">
              Choose your getaway
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Choose the experience that excites you most. All getaways exclude accommodation — you'll choose
              your stay next and see your complete price instantly.
            </p>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-card p-8 text-center shadow-md ring-1 ring-border/60">
            <p className="font-display text-xl font-bold text-burgundy-dark">
              {data.name} getaways are arranged personally
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Tell us your dates and group size and our team will put a tailored getaway together for you.
            </p>
            <a
              href="https://wa.me/27796813869"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-burgundy px-8 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white"
            >
              WhatsApp us <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <GetawayCard
                key={pkg.id}
                pkg={pkg}
                destinationSlug={data.slug}
                fallbackImage={catalogue?.image ?? data.heroImage}
              />
            ))}
          </div>
        )}

        <section className="mt-16 rounded-2xl bg-card p-8 shadow-md ring-1 ring-border/60 md:p-10">
          <h2 className="font-display text-2xl font-bold text-burgundy-dark">Why {data.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{data.intro}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {data.highlights.slice(0, 6).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Looking for something else?{' '}
            <Link to="/#destinations" className="font-semibold text-burgundy underline">
              Browse all destinations
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

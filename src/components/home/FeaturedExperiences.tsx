import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { getPackagesByDestination } from '@/data/travelData';

// One flagship experience per featured destination — data driven, no per-destination code.
const FEATURED_SLUGS = ['durban', 'sun-city', 'hartbeespoort', 'cape-town', 'mpumalanga', 'bela-bela'];

export function FeaturedExperiences() {
  const cards = FEATURED_SLUGS.map((slug) => {
    const destination = catalogueDestinations.find((d) => d.slug === slug);
    if (!destination?.destinationId) return null;
    const pkg = getPackagesByDestination(destination.destinationId)[0];
    if (!pkg) return null;
    return { destination, pkg };
  }).filter(Boolean) as { destination: (typeof catalogueDestinations)[number]; pkg: ReturnType<typeof getPackagesByDestination>[number] }[];

  if (!cards.length) return null;

  return (
    <section id="experiences" className="bg-muted/60 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Experiences our travellers love
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every package price is per person and includes the activities listed. Accommodation is added
            in the next step, so you always see your complete holiday price.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ destination, pkg }) => (
            <ExperienceCard
              key={pkg.id}
              pkg={pkg}
              destinationName={destination.name}
              destinationSlug={destination.slug}
              fallbackImage={destination.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

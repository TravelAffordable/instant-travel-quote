import { DestinationTile } from '@/components/cards/DestinationTile';
import { catalogueDestinations } from '@/data/destinationCatalogue';
import { getPackagesByDestination } from '@/data/travelData';
import { getPackageFromPrice } from '@/data/packagePricing';

function fromPriceFor(destinationId?: string): number | null {
  if (!destinationId) return null;
  const prices = getPackagesByDestination(destinationId)
    .map((p) => getPackageFromPrice(p.id))
    .filter((p): p is number => typeof p === 'number');
  return prices.length ? Math.min(...prices) : null;
}

export function DestinationGrid() {
  return (
    <section id="destinations" className="py-16">
      <div className="container mx-auto px-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Your Favourite Destinations
          </h2>
          <p className="mt-2 text-muted-foreground">
            South Africa's favourite getaways — with everything already arranged.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {catalogueDestinations.map((d) => (
            <DestinationTile key={d.slug} destination={d} fromPrice={fromPriceFor(d.destinationId)} />
          ))}
        </div>
      </div>
    </section>
  );
}


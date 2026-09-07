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
          <h2 className="font-display text-4xl font-bold text-gold md:text-5xl">
            Your Favourite Holiday Destinations
          </h2>
          <p className="mt-2 text-lg font-medium text-navy">
            South Africa's favourite getaways — with everything already arranged.
          </p>
          <p className="mt-1 text-navy/80">
            Click on the pictures below to be taken to your next holiday destination.
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


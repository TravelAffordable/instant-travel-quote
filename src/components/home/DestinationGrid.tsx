import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? catalogueDestinations : catalogueDestinations.filter((d) => d.featured);

  return (
    <section id="destinations" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Where would you like to go?
            </h2>
            <p className="mt-2 text-muted-foreground">
              South Africa's favourite getaways — with everything already arranged.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show popular destinations' : 'View all destinations'}
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d) => (
            <DestinationTile key={d.slug} destination={d} fromPrice={fromPriceFor(d.destinationId)} />
          ))}
        </div>
      </div>
    </section>
  );
}

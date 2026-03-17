import { type Package } from '@/data/travelData';

export function calculatePackageBaseCost(
  pkg: Package,
  adults: number,
  childrenAges: number[],
  fallbackChildrenCount = 0,
): number {
  const adultCost = pkg.basePrice * adults;

  const eligibleChildrenAges = childrenAges.filter((age) => {
    const minAge = pkg.kidsMinAge ?? 4;
    return age >= minAge && age <= 17;
  });

  const childCostFromAges = eligibleChildrenAges.reduce((total, age) => {
    if (pkg.kidsPriceTiers?.length) {
      const tier = pkg.kidsPriceTiers.find((entry) => age >= entry.minAge && age <= entry.maxAge);
      if (tier) return total + tier.price;
    }

    if (typeof pkg.kidsPrice === 'number') {
      return total + pkg.kidsPrice;
    }

    return total + pkg.basePrice * 0.5;
  }, 0);

  if (eligibleChildrenAges.length > 0) {
    return adultCost + childCostFromAges;
  }

  if (fallbackChildrenCount > 0 && typeof pkg.kidsPrice === 'number') {
    return adultCost + (pkg.kidsPrice * fallbackChildrenCount);
  }

  return adultCost;
}

/**
 * Child Service Fee Calculator
 * 
 * Rules:
 * - Children under 4: FREE (no service fee)
 * - Children ages 4-16: charged service fees
 * 
 * Volume tiers (by total eligible children count):
 * - 40+ kids: R70 per child (overrides all other rules)
 * - 20-39 kids: R100 per child (overrides all other rules)
 * - 10-39 kids: R150 per child (even with 1 adult)
 * - Under 10 kids with 2+ adults: R150 per child
 * - Under 10 kids with 1 adult: first child R450, rest R150
 * - Under 10 kids with 1 adult, 1 child: R450
 */

/**
 * Get the per-child rate based on volume of eligible children.
 * Returns null if standard (non-volume) rules should apply.
 */
function getVolumeTierRate(eligibleCount: number): number | null {
  if (eligibleCount >= 40) return 70;
  if (eligibleCount >= 20) return 100;
  if (eligibleCount >= 10) return 150;
  return null;
}

/**
 * Calculate total child service fees based on adult count and children ages.
 * Returns the total kids service fee amount.
 */
export function calculateChildServiceFees(adults: number, childrenAges: number[]): number {
  const eligibleChildren = childrenAges.filter(age => age >= 4 && age <= 16);
  
  if (eligibleChildren.length === 0) return 0;
  
  // Volume tiers override all other rules
  const volumeRate = getVolumeTierRate(eligibleChildren.length);
  if (volumeRate !== null) {
    return eligibleChildren.length * volumeRate;
  }
  
  // Standard rules (under 10 eligible kids)
  if (adults >= 2) {
    return eligibleChildren.length * 150;
  }
  
  // 1 adult scenario
  if (adults === 1) {
    if (eligibleChildren.length === 1) {
      return 450;
    }
    // First child R450, rest R150
    return 450 + (eligibleChildren.length - 1) * 150;
  }
  
  // No adults (edge case) - treat same as 2+ adults
  return eligibleChildren.length * 150;
}

/**
 * Calculate the per-child fee for a single child (used in per-child iteration).
 * @param adults - number of adults
 * @param childAge - age of the child
 * @param isFirstEligibleChild - whether this is the first eligible child (for 1-adult scenario)
 * @param totalEligibleChildren - total number of eligible children in the booking (for volume tiers)
 */
export function getChildServiceFeeForAge(
  adults: number,
  childAge: number,
  isFirstEligibleChild: boolean,
  totalEligibleChildren: number = 0
): number {
  // Children under 4 are free
  if (childAge < 4 || childAge > 16) return 0;
  
  // Volume tiers override all other rules
  const volumeRate = getVolumeTierRate(totalEligibleChildren);
  if (volumeRate !== null) {
    return volumeRate;
  }
  
  // Standard rules (under 10 eligible kids)
  if (adults >= 2) {
    return 150;
  }
  
  // 1 adult scenario
  if (adults === 1) {
    return isFirstEligibleChild ? 450 : 150;
  }
  
  return 150;
}

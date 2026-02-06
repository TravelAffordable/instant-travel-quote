/**
 * Child Service Fee Calculator
 * 
 * Rules:
 * - Children under 4: FREE (no service fee)
 * - Children ages 4-16: charged service fees
 * - 2+ adults present: flat R150 per eligible child
 * - 1 adult, 1 child: R450 for that child
 * - 1 adult, multiple children: first eligible child R450, rest R150 each
 */

/**
 * Calculate total child service fees based on adult count and children ages.
 * Returns the total kids service fee amount.
 */
export function calculateChildServiceFees(adults: number, childrenAges: number[]): number {
  const eligibleChildren = childrenAges.filter(age => age >= 4 && age <= 16);
  
  if (eligibleChildren.length === 0) return 0;
  
  if (adults >= 2) {
    // Flat R150 per eligible child
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
 */
export function getChildServiceFeeForAge(
  adults: number,
  childAge: number,
  isFirstEligibleChild: boolean
): number {
  // Children under 4 are free
  if (childAge < 4 || childAge > 16) return 0;
  
  if (adults >= 2) {
    return 150;
  }
  
  // 1 adult scenario
  if (adults === 1) {
    return isFirstEligibleChild ? 450 : 150;
  }
  
  return 150;
}

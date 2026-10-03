# Accommodation-inclusive starting prices

## What will change
- Add **R700 per person** to every package’s currently advertised starting price, across all destinations and the homepage destination tiles.
- This represents **R1,400 accommodation for two people sharing, for 3 days / 2 nights**. For example, **From R800 → From R1,500 per person**.
- Under package prices, show these lines in order:
  - **Includes hotel and fun activities**
  - **Select your preferred hotel to see the final price for your holiday**
  - **discounts subject to availability at various hotels**
- Keep the existing layout and styling. Where a “was” price already appears, increase it by the same R700 so its existing difference remains unchanged.

## What stays unchanged
- Actual package/activity prices, service fees, hotel rates and final quote calculations.
- Selecting a hotel still calculates the real complete holiday price; the R700 is an advertising allowance, not another charge added to the final quote.
- No invented buffet-breakfast inclusion.

## Technical details
- Add a shared advertising-only price helper so the accommodation allowance is applied once, consistently.
- Apply it to package cards, experience cards and homepage destination starting prices, without modifying the pricing functions used by bookings or operator quotes.
- Verify the R800 → R1,500 example and displayed wording on desktop and phone-sized screens; check that base package prices remain unchanged.
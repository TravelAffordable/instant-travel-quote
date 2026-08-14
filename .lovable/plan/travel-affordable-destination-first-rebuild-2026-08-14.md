# Travel Affordable — Destination-First Rebuild

A staged rebuild of the customer-facing website: modern, warm, premium, destination-led, with a simple guided booking journey. Existing working tools (Rate Admin, Travel Agent quotes, Bus Hire, School Trips, Accommodation Provider, ChatBot, blog, destination data) stay in place and untouched.

## What exists today (verified)

- Destination data for 9 destinations (`destinationPages.ts`) plus package/hotel catalogue (`travelData.ts`, 1 600+ lines) with budget / affordable / premium hotel tiers, images and live-rate hooks.
- Homepage = long hero + a showcase that stacks every destination's package grid; pricing shown as static "From R__ pp" per tour code (`packageTourPricing.ts`).
- Quote flows: `QuoteCalculator`, `BuildPackage`, `BusHireQuote`, `TravelAgentQuote`, `AccommodationProviderQuote`, `SchoolTrips` — all preserved.
- Child fees today use a 4–16 volume-tiered model (`childServiceFees.ts`) used by group/school flows.

## Key decision to confirm

The new per-tour-code table (adult + child 3–12 + child 13–17, service fees already included) becomes the single source of truth for **package/activity pricing on the new consumer booking journey**. The old "From R__ pp" teaser numbers are replaced by the new adult prices. The existing group/school/bus-hire fee logic stays as-is so those flows keep working.

## Stage 1 — Pricing data layer (no visual change)

- New `src/data/packagePricing.ts`: every tour code with `adult`, `child3to12`, `child13to17`, plus `serviceFees = { adult: 400, child0to2: 0, child3to12: 200, child13to17: 300 }` recorded as metadata (prices already include them). DUR1 override documented (R1 450 + R400 = R1 850).
- Codes without supplied child prices (KNY1, CPTFW, CPTWTCM, BELA3/4/5 for 3–12) are marked `childPriceOnRequest` — the UI asks the customer to enquire rather than guessing a number.
- International codes BALI-UBUD, DUBAI-1, PHUKET-1 included.
- Pure helper `calculatePackagePrice(code, travellers)` returning per-person and total package cost. Unit-tested against the supplied table so nothing drifts.

## Stage 2 — Brand & design system

- Warm South African palette layered onto the existing tokens: deep plum/berry primary (current brand), warm gold accent, sunset orange for prices, soft sand neutrals. No hardcoded colours in components.
- Typography: clean modern sans for body/UI, condensed display for headlines (keep Anton where it already reads well, but no all-caps body text).
- Generous spacing, rounded 2xl cards, soft shadows, large photography.

## Stage 3 — Homepage

- Rotating hero carousel (one photo per slide, never a collage) cycling aspirational SA travellers: Black mother & child, that family with partner, white mother & child, white family activity, Indian mother & child, Indian family activity, mixed-race family. Tasteful, premium, no captions about demographics.
- Search card over the hero: Destination · Experience/package · Adults · Children (0–2, 3–12, 13–17) · dates. Checkbox **"I'd like to do this experience for 1 day"** switches the date control from check-in/check-out to a single tour date.
- "How it works" in four plain steps: Choose your destination → Choose your experience → Choose where you stay → See your total price.
- Destination grid (photo-led cards) covering Durban, Cape Town, Johannesburg, Soweto, Mpumalanga, Kruger, Sun City, Pilanesberg, Bela-Bela, Harties, Magalies, Umhlanga, Knysna, Vaal River — new destinations added as data only; ones without packages yet link to an enquiry.
- Featured experiences, family & couples sections, trust strip, testimonials, footer. The current stacked all-destinations showcase is retired from the homepage (its content still lives on destination pages).

## Stage 4 — Simple navigation

Destinations · Experiences · Deals · Family Travel · Couples · About · Contact, plus Search and My Booking. Single-level dropdown for Destinations only, no mega-menu. Mobile: full-screen simple list.

## Stage 5 — Booking journey (new route `/book`)

Steps: Destination → Experience → Dates → Travellers → Accommodation → Extras → Review → Payment → Booking Received → Booking Confirmed.

- Package price shown first: "Package from R__ per person".
- Accommodation shown after the package, as cards with photo, name, type, location, star rating, short description, room type, meal basis, price, key facilities, "Select accommodation" — grouped into Budget / Standard / Mid-range / Luxury tiers, sourced from the existing hotel catalogue.
- Running summary: Package + Accommodation = complete holiday price. Rounded totals only, no line-item supplier detail, no margins or costs anywhere in the client bundle.
- Itinerary block generated from package data: one-day experience itinerary when the 1-day option is chosen, otherwise Day 1 arrival → experience days → farewell, adapted to the actual number of nights, with breakfast first and evening activities last in each day.

## Stage 6 — Booking persistence & status

Backend tables for `bookings`, `booking_travellers`, `booking_items`, `accommodation_confirmations` with row-level security so a customer only ever sees their own booking. Status: `received` after payment → `confirmed` once accommodation is secured (accommodation is the confirmation gate; activities never block it). Confirmation view shows itinerary, accommodation, dates and reference.

## Stage 7 — Admin console foundation

Staff-only routes (role-based, roles in a separate table) listing new bookings, payment status, accommodation awaiting confirmation, with fields to confirm accommodation and capture hotel confirmation numbers. Management screens for destinations, packages, accommodation, pricing and customers build on the existing Rate Admin patterns. Customer-facing surfaces never receive supplier cost data.

## Technical notes

- Generic data-driven components only: `DestinationCard`, `ExperienceCard`, `AccommodationCard`, `PackageCard`, `TierSelector`, `ResponsiveImage`, `BookingSummary`, `Itinerary`, `LoadingState`, `ErrorState`. No per-destination components; adding a destination is a data change.
- Existing routes and quote tools keep working throughout; each stage is verified in the preview before the next begins.
- Payments: Stripe or Paddle added at Stage 6 — I'll confirm the provider with you before wiring it.

## Suggested order of delivery

Stages 1–4 first (data + look + homepage + nav) so the site is selling quickly, then 5, then 6–7.

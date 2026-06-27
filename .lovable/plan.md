# Service Fees, Commissions, Bus Hire Hotel Flow & Inclusions

## 1. Service fee changes (internal — never shown to clients)

Update the adult service fee constants across all calculators. Children fees stay as-is (`calculateChildServiceFees`).

| Flow | Old adult fee | New adult fee |
|---|---|---|
| Public site (Hero, RMSHotelQuotes, CustomQuoteActions, travelData) | tiered up to R850 | **flat R400 / adult** |
| Accommodation Provider (`/hotel-provider`) | tiered up to R850 | **flat R400 / adult** |
| Bus Hire & Group Organiser (`/bus-hire`) | tiered up to R850 | **flat R600 / adult** |
| Travel Agent (`/travel-agent`) | tiered up to R850 | **flat R600 / adult** |

The existing "groups of 25+ get R400 flat" tier is replaced by the single flat rate above (per flow). Tiered logic for 1–24 adults is removed.

## 2. Commission (internal accounting, never shown to clients)

Bus Hire, Group Organiser, and Travel Agent flows:
- 1–20 travelling adults → **R100 / adult** commission
- 21+ travelling adults → **R200 / adult** commission

Stored as an internal `commissionTotal` on the quote object. Not displayed in the UI or PDF. Used later for reporting.

## 3. Bus Hire / Group Organiser — new accommodation flow

Replace the current "Add Hotel Accommodation" step with a two-mode hotel cost input:

```
Preferred hotel cost (R) [_____________]   [x] I don't have a hotel, please find my group accommodation at the destination
```

When the checkbox is ticked:
- Hide the "preferred hotel cost" field.
- Show: **"Please write total accommodation budget for your group (R)"** input.
- Calculation uses the budget as the hotel cost placeholder for the per-person/group total.
- The on-screen quote shows: per-person package price + total group price, with a note: *"Final accommodation options will be sourced and quoted to you by our team."*

When the checkbox is **not** ticked and a hotel cost is entered:
- System adds bus quote + activities + entered hotel cost.
- Shows per-person and total group price including accommodation.

### After initial calculation — "Generate full quote with accommodation options"

Reveal the **same hotel input block used in the Travel Agent section** (up to 8 hotels, name + quote amount + meal plan, minimum 3 required per spec) plus the same client/company details form. "Generate Quote" then produces one PDF page per hotel option (reusing `generateBrochurePDF`), branded with the bus company / group organiser's details (logo, name, email, phone, website, address) — identical layout to the Travel Agent brochure.

This means Bus Hire gets:
- Company/agent details form (logo, name, address, phone, email, website, VAT, client name/email, quote validity, quote number).
- 1–8 hotel entries.
- Brochure-style on-screen preview + multi-page PDF download + share button.
- PDF re-upload (continue editing) using existing `PDFQuoteUploader`, with a new `quoteType: 'bus-hire'`.

## 4. Inclusions formatting fix

Across all generated quotes (PDF + on-screen brochure + share text + RMSHotelQuotes display) replace the bare word `Accommodation` in the inclusions list with **`Accommodation — {N} night{s}`**, where N is calculated from check-in/check-out.

Already partially done in Travel Agent PDF (`Accommodation ${nights} Night${s}`); extend the same rule to:
- `generateShareContent` (share text)
- `BrochurePreview` HTML
- Bus Hire on-screen "Package Inclusions" block
- RMSHotelQuotes inclusions display
- Any other "Accommodation" string used in a client-visible inclusions list

Activities below the accommodation line continue to come from `pkg.activitiesIncluded` exactly as authored, e.g.:
```
Accommodation — 2 nights
uShaka Marine World combo tickets (Sea World & Wet n Wild)
Isle of Capri Boat Cruise
60 minute full body massage
Shuttle transport from hotel to activities and back
```

## Technical breakdown

- `src/components/BusHireQuote.tsx` — biggest change. Add: hotel cost field, "no hotel" checkbox, budget field, hotel-entries array (reused from Travel Agent), company/client details form, brochure preview + PDF download. Replace tiered fees with flat R600/adult + R100/R200 commission.
- `src/components/TravelAgentQuote.tsx` — flat R600/adult, add commission calc.
- `src/components/AccommodationProviderQuote.tsx` — flat R400/adult.
- `src/components/Hero.tsx`, `src/components/RMSHotelQuotes.tsx`, `src/components/CustomQuoteActions.tsx`, `src/data/travelData.ts` (`serviceFeePerAdult` at line 1482) — flat R400/adult, drop tier table.
- `src/lib/pdfQuoteUtils.ts` — add `'bus-hire'` to `quoteType` and persist new bus-hire fields.
- `src/lib/travelAgentBrochure.ts` — neutralise wording so brochure works for bus-hire/group-organiser (currently OK — already agent-agnostic via `agent` block). Inclusions line "Accommodation" → "Accommodation — N nights" already supported by passing the formatted string in.

## Out of scope (confirm if you want these too)

- Commission display anywhere client-facing (kept fully internal as per memory).
- Changing the bus quote field placement, package selection UX, or any other UI element not listed above.
- Database/edge-function changes — all changes are frontend.

Confirm and I'll build it.

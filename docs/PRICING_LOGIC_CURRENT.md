# Travel Affordable — Current Pricing Logic (authoritative)

Use this to correct any older explanation. Anything that says "R850 per adult",
"R1,400 fees for 2 adults", or "activity costs summed per activity" is OUT OF DATE.

## 1. Service fees (current)

Standard package flow (per person, per booking):

| Traveller | Service fee |
|---|---|
| Adult | **R400** |
| Child 0–2 | R0 (free) |
| Child 3–12 | R200 |
| Child 13–17 | R300 |

Other flows use their own adult fee: Accommodation Only and Build-a-Package = **R250 per adult**,
Travel Agent quotes = **R600 per adult**. Bus Hire / group organiser bookings use the
group fee schedule, not this table.

Large-group child fees (school trips / group organiser flow) use volume tiers on
children aged 4–16 only: 40+ kids R70 each, 20–39 R100, 10–19 R150, under 10 with
2+ adults R150 each, under 10 with 1 adult R450 for the first child then R150 each.
Children under 4 pay no service fee.

## 2. The important correction: fees are ALREADY INSIDE the package price

Each tour code has a **fixed per-adult package price that already includes the adult
service fee**. Never add the fee again, and never sum individual activity rates.

```
adult package price (from PACKAGE_PRICES / basePrice) = activity cost + service fee
```

Example: DUR1 = R1,450 activity + R400 fee = **R1,850 per adult** (stored as 1850).

Child package prices are **package-specific** — they are not a percentage of the adult
price. Some codes have custom age bands (e.g. UMDL001: R600 ages 2–6, R850 ages 7–17)
and some have `null`, meaning **price on request**, not free.

## 3. Correct formula

```
packageTotal   = Σ adult package price × adults
                 + Σ per-child package price (by that package's age bands)
accommodation  = nightly room rate × nights × rooms required
extras         = optional extra × adults
GRAND TOTAL    = packageTotal + accommodation + extras
per person     = GRAND TOTAL ÷ (adults + paying/non-free children counted as guests)
```

Rounding: totals shown to the customer are rounded to the nearest **R10**.

### Worked example (replaces the old one)

2 adults, no children, DUR1, hotel R1,500 per night, 2 nights, 1 room:

- Package: 2 × R1,850 = **R3,700** (service fees already inside)
- Accommodation: R1,500 × 2 nights × 1 room = **R3,000**
- Grand total = **R6,700**, i.e. **R3,350 per person**

There is no separate "+ R1,400 fees" line. Adding one double-charges the customer.

## 4. Accommodation rules

- **Rooms required** = max(rooms the guest asked for, ceil(total guests ÷ room capacity)).
  Capacity therefore changes the number of rooms and the total.
- Rates supplied as **2-night totals are divided by 2** to store a nightly rate.
- **Durban Golden Mile** hotels price **night-by-night** from the seasonal rate calendar
  (check-out night excluded), so a stay crossing two rate periods is summed per night.
  Those calendar rates apply to 2-sleeper rooms; 4-sleeper family units keep their own rate.
- **No seasonal scaling** is applied anywhere else.
- Sold-out dates are excluded; sold-out stays are never quoted.
- Only stays **at or above the guest's stated budget** are listed, closest to budget first.

## 5. Display rules

- Show the rounded **complete holiday price** and per-person price only — no line-item
  breakdown of fees, activities or accommodation in the customer-facing UI.
- Package cards show "From R… pp" using the fixed adult price for that tour code.
- Quotes must list the full package description and inclusions.

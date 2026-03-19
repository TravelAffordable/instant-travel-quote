# Travel Affordable Booking System Manual

> Complete documentation for the quote calculation, pricing logic, and booking workflows.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Hotel Tier Structure](#hotel-tier-structure)
3. [Rate Management System](#rate-management-system)
4. [Room Types & Capacities](#room-types--capacities)
5. [Pricing Calculations](#pricing-calculations)
6. [Service Fees](#service-fees)
7. [Seasonal Pricing](#seasonal-pricing)
8. [Quote Generation](#quote-generation)
9. [Booking Workflow](#booking-workflow)
10. [Admin Features](#admin-features)
11. [External Integrations](#external-integrations)
12. [Output Formats](#output-formats)

---

## System Overview

Travel Affordable is an instant quote calculator for South African travel packages. The system allows users to:

- Select destinations (Durban, Cape Town, Sun City, Mpumalanga, Hartbeespoort, Magaliesburg)
- Choose accommodation tiers (Budget, Affordable, Premium)
- Select activity packages
- Generate instant quotes with PDF/Email/WhatsApp sharing
- Book and receive professional invoices

### Key URLs

| Route | Purpose |
|-------|---------|
| `/` | Main public booking interface |
| `/rate-admin?admin=true` | Admin rate management (password: `admin123`) |
| `/build-package` | Package builder |
| `/hotelbeds-test` | Hotelbeds API certification testing |
| `/hotelbeds-letter` | Hotelbeds certification letter template |

---

## Hotel Tier Structure

The system uses a **three-tier accommodation structure** with color-coded buttons:

| Tier | Price Range | Button Color | Description |
|------|-------------|--------------|-------------|
| **Budget** | R200 - R1,100/night | 🟢 Green | Basic, value-focused properties |
| **Affordable** | R1,200 - R2,100/night | 🔵 Blue | Mid-range with good amenities |
| **Premium** | R2,200 - R3,100/night | 🟣 Purple | High-end beachfront/luxury properties |

### Tier Data Sources

- **Budget & Premium**: Use real property data with specific hotel names and room configurations
- **Affordable**: Uses placeholder data (e.g., "Durban Affordable Hotel A")

### Example: Durban Golden Mile Hotels

| Hotel | Tier | 2-Sleeper Weekday | 2-Sleeper Weekend |
|-------|------|-------------------|-------------------|
| SeaIMP Budget Apartments | Budget | R574 | R650 |
| Durban Beachfront Inn | Affordable | R1,200 | R1,400 |
| The Balmoral Hotel | Premium | R2,200 | R2,500 |

---

## Rate Management System

The RMS is an internal database-driven system that controls pricing independently of external APIs.

### Database Tables

```
areas              → Geographic zones (18 total across 6 destinations)
hotels             → Hotel properties linked to areas
room_types         → Room configurations per hotel
room_rates         → Base weekday/weekend rates per room type
seasonal_periods   → Multipliers for peak/off-peak seasons
rate_overrides     → Date-specific price overrides
rate_history       → Historical rate tracking
```

### Rate Calculation Flow (Public Searches)

```
1. User submits search with specific dates
   ↓
2. Invoke hotel-live-rates edge function
   ↓
3. For each hotel: Firecrawl search → find Booking.com URL → scrape page → extract ZAR rate
   ↓
4. If live scrape fails: fall back to cached_hotel_rates table
   ↓
5. If no cached rate: fall back to hardcoded refRate
   ↓
6. Return final nightly rate for display
```

### Rate Calculation Flow (RMS/Admin)

```
1. Check for date-specific override (rate_overrides table)
   ↓ If none found
2. Determine if weekend (Friday, Saturday, Sunday)
   ↓
3. Get base rate (weekday or weekend) from room_rates
   ↓
4. Apply seasonal multiplier from seasonal_periods
   ↓
5. Return final rate: base_rate × multiplier
```

### Database Functions

```sql
-- Get rate for a specific room type on a specific date
get_room_rate(room_type_id, date) → Returns decimal

-- Get total cost for a stay (sums daily rates)
get_stay_cost(room_type_id, check_in, check_out) → Returns decimal
```

---

## Room Types & Capacities

### Capacity Categories

| Capacity | Label | Max Occupancy |
|----------|-------|---------------|
| `2_sleeper` | 2-Sleeper | 2 adults + 0-1 children |
| `4_sleeper` | 4-Sleeper | 4 adults OR 2 adults + 2 children |

### Capacity Filtering Rules

- **Groups of 1-2 people**: Show only 2-sleeper options
- **Groups of 3+ people**: Show only 4-sleeper options
- **4-sleeper maximum**: 4 people total per room

### Special Room Variants

For Premium tier, specific 4-sleeper variants exist:
- Adults-only groups (4 adults)
- Family groups (2 adults + 2 children)
- Some include breakfast tracking

---

## Pricing Calculations

### Master Formula

```
Total Cost = Accommodation Cost + Package Cost + Service Fees
```

### Accommodation Cost Calculation

```
Accommodation Cost = Nightly Rate × Number of Nights × Number of Rooms
```

**Per-Room Method**: Hotelbeds rates are per-room, not total.
- 1 room @ R1,200/night = R1,200
- 2 rooms @ R1,200/night = R2,400

**4-Sleeper Rooms**: No surcharge applied. Use standard per-room rate.

### Per-Person Calculation (Multi-Room)

Costs are distributed based on **actual room occupancy**, not averaged:

| Scenario | Calculation |
|----------|-------------|
| 1 room, 2 adults | Room cost ÷ 2 |
| 2 rooms, 2 adults each | Each room ÷ 2 (calculated separately) |
| 2 rooms, mixed (2+1 adults) | Double room ÷ 2, Single room ÷ 1 |
| 1 room (4-sleeper), 4 adults | Room cost ÷ 4 |

### Package Cost

```
Package Cost = Package Price Per Adult × Number of Adults
```

Package prices are defined in `src/data/activitiesData.ts` and vary by destination.

### Destination Starting Prices

Formula for "from R X per person" display:

```
(R700 budget accommodation × 2 nights) + (package cost × 2 adults) + (R1,700 service fees for 2)
─────────────────────────────────────────────────────────────────────────────────────────────────
                                              2 people
```

---

## Service Fees

### Standard Groups (1-24 people)

#### Adult Fees

| Adults | Fee Per Adult |
|--------|---------------|
| 1 | R1,000 |
| 2-3 | R850 |
| 4-9 | R800 |
| 10+ | R750 |

#### Child Fees

| Age Range | Fee | Notes |
|-----------|-----|-------|
| 0-2 years | FREE | |
| 3-12 years | R200 | |
| 13-17 years | R300 | |

**Special Rule**: Children aged 4-16 with only 1 adult pay R300 (not R150).

### Large Groups (25+ people)

| Quote Type | Adult Fee | Child 3-12 | Child 13-17 |
|------------|-----------|------------|-------------|
| LiveHotelQuoteCard | R550 | R100 | R200 |
| TravelAgentQuote | R400 | R100 | R200 |
| AccommodationProviderQuote | R400 | R100 | R200 |
| BusHireHotelCard | R400 | R100 | R200 |

### Display Rules

- Service fee breakdowns are **hidden** from all user-facing outputs
- Fees are calculated internally and added to total
- Only "Grand Total" is shown to clients

---

## Seasonal Pricing

### Multiplier System

Seasonal periods apply multipliers to base rates:

| Period | Typical Multiplier | Example Dates |
|--------|-------------------|---------------|
| Low Season | 0.9x | May - August |
| Standard | 1.0x | Default |
| Peak Season | 1.25x | September - November |
| Christmas/New Year | 1.5x - 1.55x | December 15 - January 5 |
| Easter | 1.3x | Varies |

### Multiplier Application

```
Final Daily Rate = Base Rate × Seasonal Multiplier
```

Multiple multipliers on same date: **Highest multiplier wins**.

---

## Quote Generation

### Required Form Fields

| Field | Required | Notes |
|-------|----------|-------|
| Destination | ✅ | Dropdown selection |
| Check-in Date | ✅ | Date picker |
| Check-out Date | ✅ | Date picker |
| Number of Adults | ✅ | Numeric input |
| Number of Children | Optional | With age selectors (3-17) |
| Number of Rooms | ✅ | Numeric input |
| Guest Full Name | ✅ | Text input |
| Telephone Number | ✅ | Text input |
| Email Address | ✅ | Text input |
| Package Selection | ✅ | Multi-select dropdown |

### Quote Display Rules

#### Adults-Only Bookings
- **Primary**: Per-person price (rounded to nearest 10)
- **Secondary**: Total below

#### Bookings with Children
- **Primary**: Grand Total
- **Secondary**: Guest count label (e.g., "2 Adults, 1 Kid")

### Rounding

All displayed amounts are rounded to the nearest R10.

### Multi-Package Quotes

When multiple packages are selected:
- Each package displays with large uppercase header
- Tour code prefix (e.g., "MP1 - MPUMALANGA INSTYLE...")
- All hotel options shown under each package header

---

## Booking Workflow

### Quote to Booking Flow

```
1. User fills form and selects tier
   ↓
2. System generates quote cards
   ↓
3. User clicks "Book Now"
   ↓
4. System collects booking details
   ↓
5. Invoice generated and emailed
   ↓
6. Confirmation sent to user and admin
```

### Invoice Details

| Field | Value |
|-------|-------|
| Bank | TYME BANK |
| Account Number | 53000430069 |
| Branch Code | 678910 |
| Recipients | travelaffordable2017@gmail.com + Client |

### Invoice Content Rules

- Shows **Grand Total only**
- **NO** itemized breakdowns for activities or fees
- Clean, professional HTML format
- "Edit Invoice" button for admin modifications

---

## Admin Features

### Access

URL: `/rate-admin?admin=true`  
Password: `admin123`

### Available Sections

1. **Areas Manager** - Geographic zones per destination
2. **Hotels Manager** - Hotel properties with tier assignment
3. **Seasons Manager** - Seasonal periods and multipliers
4. **Rates Manager** - Room types and base rates

### Admin-Only Features

| Feature | Public | Admin |
|---------|--------|-------|
| Tier button search | ✅ | ✅ |
| Custom hotel manual entry | ❌ | ✅ |
| Bulk hotel parsing | ❌ | ✅ |
| Rate management | ❌ | ✅ |

---

## External Integrations

### Live Hotel Rate Scraping (Firecrawl)

**Primary rate source for all public searches.** When a user searches for specific dates, the system performs on-demand scraping of Booking.com listing pages via the Firecrawl API to return real-time, date-specific pricing.

#### Architecture

```
User searches dates → hotel-live-rates edge function
  → For each hotel:
     1. Firecrawl Search: site:booking.com "Hotel Name" City → finds direct listing URL
     2. Firecrawl Scrape: listing page with check-in/check-out params → extracts ZAR nightly rate
  → Returns live rates per hotel
```

#### Edge Functions

| Function | Purpose |
|----------|---------|
| `hotel-live-rates` | On-demand batch live rate lookup for user searches (all tiers) |
| `booking-live-rate` | Single hotel live rate lookup |
| `booking-weekend-calendar` | Weekend rate calendar for premium hotels |
| `sync-hotel-rates` | Background crawler that refreshes `cached_hotel_rates` table |

#### Rate Priority

1. **Live scrape** (primary) — real-time Firecrawl lookup for user's selected dates
2. **Cached rates** (fallback) — `cached_hotel_rates` table, refreshed by `sync-hotel-rates` cron
3. **Reference rates** (last resort) — hardcoded `refRate` values in static hotel data

#### Shared Helper: `_shared/scrape-hotel-rate.ts`

| Function | Purpose |
|----------|---------|
| `findBookingUrl(name, city, apiKey)` | Discovers direct Booking.com listing URL via Firecrawl search |
| `scrapeHotelRate(name, city, apiKey, options?)` | Full pipeline: find URL → scrape → extract ZAR rate |
| `processHotelsSequentially(items, apiKey)` | Sequential processing with rate-limit delays |
| `extractNightlyRate(markdown, nights)` | Parses scraped markdown for lowest valid ZAR nightly rate |

### Hotelbeds API

**Usage Policy**: Restricted to specific flows only.

| Flow | Hotelbeds Used |
|------|----------------|
| Public tier searches | ❌ Uses Firecrawl live scraping |
| "Accommodation only" booking | ✅ Live search |
| Certification testing (/hotelbeds-test) | ✅ Live search |

**Rate Keys**: For accommodation-only bookings, the Hotelbeds `rateKey` is included in booking requests for reservation processing.

### Amadeus API

Available but secondary. Used for specific search scenarios when enabled.


---

## Output Formats

### Shared Content Across All Formats

All outputs (UI, PDF, Email, WhatsApp) include:

1. **Personalized Greeting**
   - All caps: "GREETINGS [GUEST NAME]"
   - For Durban: Dynamic paragraph listing selected activities

2. **Pricing Display**
   - Grand Total (primary)
   - Per-person breakdown (if adults only)
   - Guest count label

3. **Inclusions List**
   - X nights accommodation
   - Package activities
   - "Breakfast included" (if applicable)

### PDF Export

- Professional layout
- Hotel branding section
- Comprehensive disclaimer about illustrative images
- Excludes service fee breakdowns

### Email

- HTML formatted
- Same content as PDF
- Sent via Resend API

### WhatsApp

- Pre-formatted message
- Direct share link
- Condensed but complete information

---

## Durban-Specific Logic

### Dynamic Activity Grid

- Pre-selected activities highlighted with **4px red border**
- All activity names in **UPPERCASE**
- Grid state **synchronized** across all hotel cards
- Personalized greeting updates dynamically with selections

### Capacity Filtering

| Guest Count | Room Types Shown |
|-------------|------------------|
| 1-2 people | 2-sleeper only |
| 3-4 people | 4-sleeper only |
| 2 adults + 2 children | Family-specific 4-sleeper variants |

### Package Examples

| Code | Package Name |
|------|--------------|
| DBN1 | Durban uShaka Marine World Package |
| DBN2 | Durban Golden Mile Adventure |

---

## Meal Plan Logic

### Options

- Room Only
- Breakfast
- Half-Board (Breakfast + Dinner)
- Full-Board (All meals)

### Display Rules

- Only mentioned in inclusions if **explicitly included**
- Phrasing: "Breakfast included" (not "buffet breakfast at selected hotels")
- Accommodation duration: "X nights accommodation"

### Per-Hotel Selection

In Travel Agent quotes, each hotel entry has its own meal plan dropdown.

---

## Children Pricing Tiers

### Age-Based Package Costs

| Package | Age Range | Cost |
|---------|-----------|------|
| HG1 | 4-14 years | R690 |
| HG1 | 15-17 years | R1,010 |
| HG2 | 6-12 years | R1,220 |
| HG2 | 13-17 years | R1,430 |
| HG5 | All children | R940 |
| SUN3 | 13 years | R550 |

---

## Quote Types

### 1. LiveHotelQuoteCard (Public)

Standard public quote using internal RMS data.

### 2. TravelAgentQuote

- Compare up to 8 hotels
- Per-hotel meal planning
- Family split option
- Professional PDF export

### 3. AccommodationProviderQuote

- For hotels adding activity packages to guest quotes
- Multiple room categories
- Facility lists
- Hotel branding in PDF

### 4. BusHireHotelCard

- For bus companies and group tour organizers
- Combines accommodation + activities + transport
- Per-person pricing including bus costs

### 5. CustomQuoteActions (Admin Only)

- Free-text hotel names
- Custom rate inputs
- Flexible calculation

---

## Disclaimer Text

### Main Disclaimer

> "Please note that the images you see below are not for the hotels in the quote – they are for illustration purposes only. The price you see includes hotel accommodation and the activities associated with the package. Please select the package that you like and that fits your budget, email or WhatsApp it to us using the buttons below so we can send you an accurate quote with available hotel options that suit your budget and preferences."

### Secondary Instruction (Blue)

> "You may select individual package/s to send to us via email or whatsapp by selecting the package/s using the selectors located near the package tour code. To send all the packages you may use the email and WhatsApp buttons at the top of the quotes."

---

## Technical Files Reference

| File | Purpose |
|------|---------|
| `src/data/activitiesData.ts` | Activity pricing and package definitions |
| `src/data/travelData.ts` | Destination and package configurations |
| `src/components/LiveHotelQuotes.tsx` | Main quote generation UI |
| `src/components/LiveHotelQuoteCard.tsx` | Individual quote card component |
| `src/components/QuoteCalculator.tsx` | Quote calculation logic |
| `src/components/admin/RatesManager.tsx` | Admin rate management |
| `src/pages/RateAdmin.tsx` | Admin dashboard page |

---

## Database Schema Summary

```
areas
├── id (uuid)
├── destination (enum: durban, cape_town, sun_city, mpumalanga, hartbeespoort, magaliesburg)
├── name (text)
├── description (text)
└── is_active (boolean)

hotels
├── id (uuid)
├── area_id (fk → areas)
├── name (text)
├── tier (enum: budget, affordable, premium)
├── star_rating (integer)
├── includes_breakfast (boolean)
├── address (text)
├── notes (text)
└── is_active (boolean)

room_types
├── id (uuid)
├── hotel_id (fk → hotels)
├── name (text)
├── capacity (enum: 2_sleeper, 4_sleeper)
├── max_adults (integer)
├── max_children (integer)
└── is_active (boolean)

room_rates
├── id (uuid)
├── room_type_id (fk → room_types)
├── base_rate_weekday (decimal)
├── base_rate_weekend (decimal)
├── effective_from (date)
├── effective_to (date)
└── is_active (boolean)

seasonal_periods
├── id (uuid)
├── name (text)
├── start_date (date)
├── end_date (date)
├── multiplier (decimal)
├── description (text)
└── is_active (boolean)

rate_overrides
├── id (uuid)
├── room_type_id (fk → room_types)
├── override_date (date)
├── rate (decimal)
└── reason (text)
```

---

## Changelog

| Date | Change |
|------|--------|
| 2025-01-26 | Initial documentation created |

---

*This manual is maintained in `/docs/BOOKING_SYSTEM_MANUAL.md`*

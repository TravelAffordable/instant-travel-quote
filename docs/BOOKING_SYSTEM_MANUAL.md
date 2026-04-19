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

## Destinations & Packages Reference

### South African Destinations

| ID | Destination | Starting Price | Popular |
|----|-------------|---------------|---------|
| `harties` | Hartbeespoort | R1,580 pp | ✅ |
| `magalies` | Magaliesburg | R2,100 pp | ✅ |
| `durban` | Durban Beachfront | R1,600 pp | ✅ |
| `umhlanga` | Umhlanga | R1,700 pp | ✅ |
| `cape-town` | Cape Town | R2,400 pp | ✅ |
| `sun-city` | Sun City | R2,000 pp | ✅ |
| `mpumalanga` | Mpumalanga | R2,520 pp | ✅ |
| `knysna` | Knysna (Garden Route) | R2,750 pp | ❌ |
| `vaal-river` | Vaal Cruise and Emerald Casino | R2,250 pp | ❌ |
| `bela-bela` | Bela Bela | R2,600 pp | ❌ |
| `pretoria` | The Blyde FUNtastic Resort | R2,200 pp | ❌ |

### International Destinations

| ID | Destination | Country | Starting Price |
|----|-------------|---------|---------------|
| `bali` | Bali | Indonesia | R4,600 pp |
| `dubai` | Dubai | UAE | R5,600 pp |
| `thailand` | Thailand | Thailand | R5,000 pp |

---

### Hartbeespoort Packages (12 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| HG1 | Leisuretime Getaway | R1,010 | 4-14: R690, 15-17: R1,010 | 2hr sunset champagne cruise with buffet, Harties Cableway |
| HG2 | Funtime Getaway | R1,650 | 6-12: R1,220, 13-17: R1,430 | 1hr horse riding, quad biking OR massage, 2hr sunset cruise |
| HG3 | Family Fun Weekender | R1,450 | R600 | Quad biking, Harties Zoo & Snake Park, Sunday lunch cruise |
| HG4 | Elephant Sanctuary Adventure | R2,480 | R1,450 (4+) | Elephant Sanctuary, horse riding OR quad biking, Cableway |
| HG5 | Upside Down House | R1,330 | R940 | Upside Down House, Little Paris, Cableway, quad biking |
| HG6 | Cableway Experience | R380 | R300 | Full day Harties Cableway |
| HG7 | Couple Cruise Getaway | R700 | R350 | 2hr sunset boat cruise with buffet |
| HG8 | Couple Quad Adventure | R550 | R300 | 1hr quad biking |
| HG9 | Romance in the Air | R810 | R400 | 1hr horse ride, full day Cableway |
| HG10 | Jet Ski Fun | R1,280 | R600 | Jet Ski, Cableway, massage OR sunset cruise |
| HG11 | Wake Snake & Cruise | R1,180 | R600 | Wake Snake Ski slide, 2hr sunset cruise |
| HG12 | Tube Ride & Massage | R1,400 | R600 | Tube ride ski, 60min full body massage |

### Magaliesburg Packages (6 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| MAG1 | Explorer Getaway | R900 | R800 | Cradle of Mankind, Sterkfontein Caves, game drive, reptile show |
| MAG2 | Ultimate Lux | R2,130 | R800 | Buffet cruise, Cradle of Mankind, massage, game drive |
| MAG3 | Deluxe Spa Weekender | R1,950 | R800 | Half-day spa, game drive, sunset cruise |
| MAG4 | Budget Game Drive | R1,200 | R800 | Rhino and Lion Park, game drive, massage |
| MAG5 | Perfect Date | R2,330 | R900 | Horse riding, quad biking, private romantic picnic |
| MAG6 | Horse, Spa & Picnic | R1,600 | R700 | Horse trail, massage, romantic picnic |

### Durban Packages (8 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| DUR1 | Fun on the Beach | R1,800 | R600 | uShaka Marine World, Isle of Capri cruise, massage, shuttle |
| DUR2 | Smiles & Sea Shells | R1,300 | R600 | uShaka, 3hr open bus tour, Isle of Capri cruise, shuttle |
| DUR3 | Beach & Spa Ease | R1,550 | R600 | Half-day spa, luxury canal boat cruise, shuttle |
| DUR4 | Party Vibes | R2,000 | R600 | Nightlife, uShaka, luxury canal cruise, massage |
| DUR5 | Beach Couple uShaka | R850 | R400 | uShaka, Suncoast Casino, shuttle |
| DUR6 | Beach Couple Cruise | R550 | R300 | Isle of Capri cruise, Suncoast Casino, shuttle |
| DUR7 | Beach & Nightlife | R400 | R200 | Florida Road Cubana, Suncoast Casino, shuttle |
| DUR8 | Open Top Bus Tour | R600 | R350 | 3hr open top bus tour, Suncoast Casino, shuttle |

### Umhlanga Packages (4 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| UMHLA1 | Beach & Leisure | R500 | R180 | Breakfast, Gateway Theatre of Dreams, Umhlanga Beach, Oceans Mall, shuttle |
| UMHLA2 | Beach Lifestyle | R1,450 | R900 | Breakfast, uShaka Marine World, luxury canal cruise, Umhlanga Beach, shuttle |
| UMHLA3 | Three Beaches | R1,850 | R800 | Buffet breakfast, uShaka, boat cruise, Umhlanga Beach, Ballito Beach, shuttle |
| UMHLA4 | Romance Package | R2,400 | R900 | Breakfast, romantic dinner, room decor, uShaka, gondola cruise with picnic, shuttle |

### Cape Town Packages (4 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Duration | Inclusions |
|------|-----------|-----------------|------------|----------|------------|
| CPT1 | Iconic Tour | R1,800 | R850 | 3 nights | Sightseeing bus, Robben Island, Table Mountain Cableway, canal cruise |
| CPT2 | Sunset Explorer | R1,200 | R800 | 2 nights | 2-day sightseeing bus, Table Mountain, canal cruise, Signal Hill sunset |
| CPTFW | Wine Tram Getaway | R2,300 | — | 2 nights | Franschoek Wine Tram, city tour, massage, canal cruise |
| CPTWTCM | Wine & Mountain | R2,600 | — | 2-3 nights | Wine route tour, canal cruise, Table Mountain, Swedish massage |

### Sun City Packages (8 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| SUN1 | Sun City & Cruise Combo | R1,550 | R600 | Sun City entrance, Valley of Waves, lunch, Sunday lunch cruise in Harties |
| SUN2 | Valley & Quads | R1,250 | R850 | Sun City, Valley of Waves, quad biking, lunch, shuttle |
| SUN3 | Valley Getaway | R850 | R550 | Sun City, Valley of Waves, lunch, shuttle |
| SUN4 | Safari Weekender | R1,550 | R750 | Sun City, Valley of Waves, Pilanesberg game drive, lunch, shuttle |
| SUN5 | Spa & Safari | R2,150 | R900 | Sun City, Valley of Waves, half-day spa, lunch, game drive, shuttle |
| SUN6 | Valley & Segway | R1,700 | R800 | Sun City, Valley of Waves, segway glides, lunch, shuttle |
| SUN7 | Valley & Maze | R800 | R700 | Sun City, Valley of Waves, maze adventure, lunch, shuttle |
| SUN8 | Valley & Zipline | R1,600 | R800 | Sun City, Valley of Waves, zip lining, lunch, shuttle |

### Mpumalanga Packages (4 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| MP1 | InStyle Getaway | R1,320 | R800 | Blyde River Canyon boat cruise, Graskop Gorge Lift & suspension bridge |
| MP2 | Fun Adventure | R1,750 | R900 | Graskop Lift, suspension bridge, quad biking, zip lining |
| MP3 | Kruger Experience | R2,100 | R600 | Graskop Gorge Lift, suspension bridge, Kruger game drive |
| MP4 | Weekender | R2,800 | R1,200 | Kruger game drive, full day Panorama Route tour |

### Vaal Cruise and Emerald Casino Packages (3 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| EMER1 | Aquadome & Cruise | R1,100 | R800 | Aquadome waterpark, game drive, Animal World, Sunday lunch cruise |
| EMER2 | Family Fun Getaway | R1,050 | R700 | Emerald Casino, Aquadome, 1hr leisure cruise, game drive, Sunday lunch |
| EMER3 | Leisure & Spa | R1,700 | R950 | Emerald Casino, full body massage, game drive, lunch cruise |

### Knysna Package (1 package)

| Code | Short Name | Base Price/Adult | Inclusions |
|------|-----------|-----------------|------------|
| KNY1 | Boats & Quads Adventure | R1,550 | Wine & oyster sunset cruise, forest quad biking, shuttle |

### Bela Bela Packages (5 packages)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| BELA1 | Waterpark & Game Drive | R800 | R600 (4+) | Resort waterpark, safari game drive |
| BELA2 | Mabalingwe & Waterpark | R850 | R700 (4+) | Mabalingwe Nature Reserve, waterpark, horseback safari OR game drive |
| BELA3 | Mabula Safari | R3,200 | R1,600 (8+) | Mabula Game Lodge, Big 5 game drives, bush walks, all meals |
| BELA4 | Zebra Lodge Spa Retreat | R2,600 | R1,300 | Zebra Country Lodge, spa, nature walks, gourmet meals |
| BELA5 | Adventure & Hot Springs | R1,600 | R800 (12+) | Quad biking, hot springs, breakfast |

### The Blyde Package (1 package)

| Code | Short Name | Base Price/Adult | Kids Price | Inclusions |
|------|-----------|-----------------|------------|------------|
| BLY1 | Blyde Spa Getaway | R1,200 | R600 | Crystal Lagoon accommodation, 60min hot stone massage, full resort access |

> **Note**: BLY1 Budget tier is disabled. Only Affordable (outside resort) and Premium (inside resort) available.

### International Packages

| Code | Short Name | Destination | Base Price/Adult | Duration | Inclusions |
|------|-----------|-------------|-----------------|----------|------------|
| BALI-UBUD | 6-Day Ubud Explorer | Bali | R3,400 | 6 nights | Monkey Forest, rice terraces, temple, quad biking, sunset cruise |
| DUBAI-1 | Exclusive Moments | Dubai | R4,400 | 5 nights | Burj Khalifa, yacht cruise, Museum of Future, desert safari |
| PHUKET-1 | Adventure Explorer | Thailand | R3,800 | 5 nights | James Bond Island, Phi Phi Islands, waterpark, quad biking |

---

## Changelog

| Date | Change |
|------|--------|
| 2025-01-26 | Initial documentation created |
| 2026-03-19 | Added Firecrawl live rate scraping architecture, updated rate calculation flow to reflect live→cached→refRate priority, documented edge functions and shared helpers |
| 2026-03-19 | Added comprehensive Destinations & Packages Reference section with all 56 packages across 14 destinations |

---

*This manual is maintained in `/docs/BOOKING_SYSTEM_MANUAL.md`*

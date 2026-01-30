# Mpumalanga Affordable Hotels Reference

This document maps public-facing Affordable tier aliases to real hotel names and room types for the Mpumalanga destination.

## Affordable Tier - 2 Sleeper Options (Hazyview Area)

| Alias | Real Hotel Name | Room Type | Area | Rate/Night | Breakfast |
|-------|-----------------|-----------|------|------------|-----------|
| Mpumalanga Affordable 2 Sleeper Option 1 | Kruger Adventure Lodge | Standard Room | Hazyview | R1,125 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 2 | Royal Bakoena Hamiltonparks Country Lodge | Hotel Room | Hazyview | R1,242 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 3 | Mountain Creek Lodge | Entire Chalet | Hazyview | R1,260 | ✗ Not Included |
| Mpumalanga Affordable 2 Sleeper Option 4 | SleepOver Phabeni | Standard Room | Hazyview | R1,377 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 5 | Tatenda Guest House | Standard Room | Hazyview | R1,485 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 6 | Serra Azul Lodge | Private Suite | Hazyview | R1,497 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 7 | ASANTE MOUNTAIN LODGE | Standard Room | Hazyview | R1,530 | ✓ Included |

## Affordable Tier - 2 Sleeper Options (Graskop Area)

| Alias | Real Hotel Name | Room Type | Area | Rate/Night | Breakfast |
|-------|-----------------|-----------|------|------------|-----------|
| Mpumalanga Affordable 2 Sleeper Option 8 | Mogodi Lodge | Standard Room | Graskop | R1,300 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 9 | Zur Alten Mine | Entire Chalet | Graskop | R1,400 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 10 | Mosswood Bed & Breakfast | Private Suite | Graskop | R1,696 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 11 | Panorama Boutique Guest House | Standard Room | Graskop | R1,985 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 12 | Westlodge at Graskop B&B | Standard Room | Graskop | R2,145 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 13 | Dar Amane Guest House | Standard Room | Graskop | R2,180 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 14 | Graskop Hotel | Standard Room | Graskop | R2,248 | ✓ Included |
| Mpumalanga Affordable 2 Sleeper Option 15 | Panorama Villa | Standard Room | Graskop | R2,655 | ✓ Included |

## Affordable Tier - 4 Sleeper Options (Hazyview Area)

| Alias | Real Hotel Name | Room Type | Area | Rate/Night (4 Adults) | Breakfast |
|-------|-----------------|-----------|------|----------------------|-----------|
| Mpumalanga Affordable 4 Sleeper Option 1 | Royal Bakoena Hamiltonparks Country Lodge | Hotel Room (3 beds) | Hazyview | R1,750 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 2 | Kruger Adventure Lodge | Hotel Room (3 beds) | Hazyview | R2,249 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 3 | Mountain Creek Lodge | Entire Chalet (4 beds, 2 bedrooms) | Hazyview | R2,520 | ✗ Not Included |
| Mpumalanga Affordable 4 Sleeper Option 4 | SleepOver Phabeni | 2 Hotel Rooms (4 beds) | Hazyview | R2,754 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 5 | Tatenda Guest House | 2 Private Rooms (3 beds) | Hazyview | R2,849 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 6 | Hotel Numbi & Garden Suites | Private Suite (4 beds, 2 bedrooms) | Hazyview | R2,900 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 7 | Serra Azul Lodge | 2 Private Suites (2 beds) | Hazyview | R2,994 | ✓ Included |

## Affordable Tier - 4 Sleeper Options (Graskop Area)

| Alias | Real Hotel Name | Room Type | Area | Rate/Night (4 Adults) | Breakfast |
|-------|-----------------|-----------|------|----------------------|-----------|
| Mpumalanga Affordable 4 Sleeper Option 8 | Graskop Hotel | Hotel Room (3 beds) | Graskop | R3,539 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 9 | Mosswood Bed & Breakfast | 1 Private Suite + 1 Private Room (2 beds) | Graskop | R3,691 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 10 | Panorama Boutique Guest House | 2 Private Rooms (2 beds) | Graskop | R3,969 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 11 | Dar Amane Guest House | Private Room (2 beds + 2 bathrooms) | Graskop | R4,093 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 12 | Westlodge at Graskop B&B | Entire Studio (2 beds, 1 bedroom) | Graskop | R4,205 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 13 | Panorama Villa | Private Suite (2 beds, 2 bedrooms) | Graskop | R6,750 | ✓ Included |
| Mpumalanga Affordable 4 Sleeper Option 14 | Angels View Hotel | 2 Hotel Rooms (2 beds) | Graskop | R7,865 | ✓ Included |

## Area-Based Filtering Logic

The system applies automatic area filtering based on the selected package:

| Package ID | Package Name | Area Filter | Reason |
|------------|--------------|-------------|--------|
| MP1 | MPUMALANGA INSTYLE GETAWAY WITH BLYDE RIVER CANYON BOAT CRUISE | Graskop only | Graskop is closer to Blyde River Canyon cruise departure point |
| MP2, MP3, MP4 | Other Mpumalanga packages | All areas | Both Hazyview and Graskop are suitable |

## Pricing Notes

- **Weekend rates**: 1.1x multiplier applied to weekday rates (Friday-Sunday)
- **Seasonal multipliers**: Applied on top of base rates (see docs/BOOKING_SYSTEM_MANUAL.md)
- **Taxes**: All rates include taxes and charges where applicable
- **Breakfast**: Most affordable options include breakfast

## Data Source

Rates sourced from Booking.com (January 2026) for properties in Hazyview and Graskop areas.

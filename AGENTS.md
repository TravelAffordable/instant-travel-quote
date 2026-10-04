
- Bus operator portal lives under /operators (src/pages/operators) with roles in user_roles + has_role(); operators only see their own quotes, and only admins can approve operators or mark trips completed — keeps commission and approval trustworthy.
- Public holiday starting prices use the advertising-only helper in holidayTeaserPricing; never feed its accommodation allowance into booking or operator calculations, to avoid double-charging.
- Hotel deal room allocation and totals use the helpers in hotelDeals; pair adults in two-sleeper rooms and price an unpaired adult at single occupancy, returning price-on-request for missing rates to avoid invented quotes.
- Hotel deals landing and individual pages share HotelDealBooking with independent per-deal state; display total divided by adults as the prominent per-person price and the unchanged group total beneath it to keep both views consistent.
- Durban hotel-deal activity overrides live separately from shared package rates; mutually exclusive variants use optionGroup and vehicle charges scale by capacity to avoid double-booking alternatives or underquoting larger groups.

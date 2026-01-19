// Shared validation utilities for edge functions
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// HTML escape function to prevent XSS
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  return text.replace(/[&<>"'`=\/]/g, (s) => htmlEntities[s] || s);
}

// Email validation schema
export const emailSchema = z.string().email().max(255);

// Date validation (YYYY-MM-DD format)
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

// Common schemas for hotel search
export const hotelSearchSchema = z.object({
  destination: z.string().min(1).max(100),
  checkIn: dateSchema,
  checkOut: dateSchema,
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10),
  childrenAges: z.array(z.number().int().min(0).max(17)).max(10).optional(),
  rooms: z.number().int().min(1).max(10),
});

// Hotelbeds booking schemas
export const hotelbedsCheckRateSchema = z.object({
  action: z.literal('checkRate'),
  rateKey: z.string().min(1).max(2000),
});

export const hotelbedsBookingSchema = z.object({
  action: z.literal('book'),
  rateKey: z.string().min(1).max(2000),
  holder: z.object({
    name: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    surname: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/, "Surname contains invalid characters"),
  }),
  rooms: z.array(z.object({
    rateKey: z.string().min(1).max(2000),
    paxes: z.array(z.object({
      roomId: z.number().int().min(1).max(100),
      type: z.enum(['AD', 'CH']),
      name: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
      surname: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/, "Surname contains invalid characters"),
      age: z.number().int().min(0).max(120).optional(),
    })).min(1).max(20),
  })).min(1).max(10),
  clientReference: z.string().min(1).max(100),
  remark: z.string().max(500).optional(),
});

export const hotelbedsCanelSchema = z.object({
  action: z.literal('cancel'),
  bookingReference: z.string().min(1).max(100),
});

// Tweet schema
export const tweetSchema = z.object({
  tweet: z.string().min(1).max(500),
  imageBase64: z.string().max(10_000_000).optional(), // ~7.5MB max image
});

// Send ad email schema
export const sendAdEmailSchema = z.object({
  email: emailSchema,
  adName: z.string().min(1).max(200),
  adContent: z.string().min(1).max(5000),
});

// Booking invoice schema
export const bookingInvoiceSchema = z.object({
  guestName: z.string().min(1).max(200),
  guestTel: z.string().min(1).max(50),
  guestEmail: emailSchema,
  hotelName: z.string().min(1).max(200),
  roomType: z.string().max(200).optional(),
  bedConfig: z.string().max(200).optional(),
  mealPlan: z.string().max(200).optional(),
  packageName: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  checkIn: dateSchema,
  checkOut: dateSchema,
  nights: z.number().int().min(1).max(365),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10),
  childrenAges: z.array(z.number().int().min(0).max(17)).max(10),
  accommodationCost: z.number().min(0).max(10_000_000),
  packageCostTotal: z.number().min(0).max(10_000_000),
  kidsPackageCost: z.number().min(0).max(10_000_000),
  serviceFees: z.number().min(0).max(10_000_000),
  grandTotal: z.number().min(0).max(10_000_000),
  pricePerPerson: z.number().min(0).max(10_000_000),
  quoteRef: z.string().min(1).max(100),
  packageInclusions: z.array(z.string().max(500)).max(50).optional(),
});

// Allowed destinations for hotel searches
export const ALLOWED_DESTINATIONS = [
  'durban', 'umhlanga', 'ballito',
  'harties', 'hartbeespoort', 'magalies', 'magaliesburg',
  'pilanesberg', 'sun-city', 'suncity',
  'vaal', 'vaal-river',
  'mpumalanga',
  'cape-town', 'capetown',
  'knysna', 'garden-route', 'plettenberg',
  'zanzibar', 'mozambique', 'mauritius'
];

export function validateDestination(destination: string): boolean {
  return ALLOWED_DESTINATIONS.includes(destination.toLowerCase());
}

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { bookingInvoiceSchema, escapeHtml } from "../_shared/validation.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('ZAR', 'ZAR ');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateLong = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' });
};

const generateInvoiceNumber = (): string => {
  const num = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
  return `#${num}`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input using Zod schema
    const validationResult = bookingInvoiceSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation failed",
          details: validationResult.error.errors.map(e => e.message)
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = validationResult.data;

    // Sanitize all user-provided strings for HTML output
    const safeGuestName = escapeHtml(data.guestName);
    const safeHotelName = escapeHtml(data.hotelName);
    const safePackageName = escapeHtml(data.packageName);
    const safeDestination = escapeHtml(data.destination);
    const safeQuoteRef = escapeHtml(data.quoteRef);
    const safeRoomType = data.roomType ? escapeHtml(data.roomType) : '';
    const safeBedConfig = data.bedConfig ? escapeHtml(data.bedConfig) : '';
    const safeMealPlan = data.mealPlan ? escapeHtml(data.mealPlan) : '';

    const invoiceNumber = generateInvoiceNumber();
    const issueDate = formatDateLong(new Date().toISOString());
    const dueDate = formatDateLong(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    const travelDates = `${formatDate(data.checkIn)} - ${formatDate(data.checkOut)}`;

    // Generate invoice HTML with sanitized values
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>body{font-family:Arial,sans-serif;margin:0;padding:20px;}</style>
</head>
<body>
  <h1>Invoice ${invoiceNumber}</h1>
  <p>Issue Date: ${issueDate} | Due Date: ${dueDate}</p>
  <h2>Bill To: ${safeGuestName}</h2>
  <p>Email: ${escapeHtml(data.guestEmail)} | Tel: ${escapeHtml(data.guestTel)}</p>
  <h3>${safeQuoteRef} - ${safePackageName.toUpperCase()}</h3>
  <p>Hotel: ${safeHotelName}</p>
  <p>Destination: ${safeDestination}</p>
  <p>Dates: ${travelDates} (${data.nights} nights)</p>
  <p>Guests: ${data.adults} Adults${data.children > 0 ? `, ${data.children} Children` : ''}</p>
  ${safeRoomType ? `<p>Room: ${safeRoomType}${safeBedConfig ? ` - ${safeBedConfig}` : ''}</p>` : ''}
  ${safeMealPlan ? `<p>Meal Plan: ${safeMealPlan}</p>` : ''}
  <h3>Total: ${formatCurrency(data.grandTotal)}</h3>
  <p>Price per person: ${formatCurrency(data.pricePerPerson)}</p>
  <hr>
  <p><strong>Banking Details:</strong> Travel Affordable | Tyme Bank | Acc: 53000430069 | Branch: 678910</p>
  <p>Contact: info@travelaffordable.co.za | +27 79 681 3869</p>
</body>
</html>`;

    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: true, message: "Invoice prepared (email not configured)" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Travel Affordable Bookings <onboarding@resend.dev>",
        to: ["travelaffordable2017@gmail.com"],
        reply_to: data.guestEmail,
        subject: `🎫 New Booking: ${safeGuestName} - ${safeHotelName} (${safeQuoteRef})`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      console.error("Resend API error");
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Invoice email sent successfully");
    return new Response(
      JSON.stringify({ success: true, message: "Booking request sent successfully", quoteRef: data.quoteRef }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in send-booking-invoice:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingInvoiceRequest {
  // Guest details
  guestName: string;
  guestTel: string;
  guestEmail: string;
  // Quote details
  hotelName: string;
  roomType?: string;
  bedConfig?: string;
  mealPlan?: string;
  packageName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  childrenAges: number[];
  // Pricing
  accommodationCost: number;
  packageCostTotal: number;
  kidsPackageCost: number;
  serviceFees: number;
  grandTotal: number;
  pricePerPerson: number;
  // Quote reference
  quoteRef: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: BookingInvoiceRequest = await req.json();
    
    // Validate required fields
    if (!data.guestName || !data.guestEmail || !data.hotelName || !data.packageName) {
      throw new Error("Missing required booking details");
    }

    const invoiceDate = new Date().toLocaleDateString('en-ZA', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    // Generate invoice HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Invoice - ${data.quoteRef}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
      color: #333;
    }
    .invoice-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 5px 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .invoice-meta {
      display: flex;
      justify-content: space-between;
      padding: 20px 30px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .invoice-meta div {
      text-align: center;
    }
    .invoice-meta label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .invoice-meta strong {
      display: block;
      font-size: 14px;
      color: #1e293b;
      margin-top: 4px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    .guest-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dashed #e2e8f0;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #64748b;
      font-size: 13px;
    }
    .detail-value {
      font-weight: 500;
      color: #1e293b;
      font-size: 13px;
    }
    .hotel-card {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .hotel-name {
      font-size: 18px;
      font-weight: 700;
      color: #92400e;
      margin: 0 0 8px;
    }
    .hotel-detail {
      font-size: 13px;
      color: #78350f;
      margin: 4px 0;
    }
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
    }
    .pricing-table tr td {
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .pricing-table tr:last-child td {
      border-bottom: none;
    }
    .pricing-table .label {
      color: #64748b;
      font-size: 13px;
    }
    .pricing-table .amount {
      text-align: right;
      font-weight: 500;
      color: #1e293b;
      font-size: 14px;
    }
    .total-row {
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      border-radius: 8px;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }
    .total-label {
      color: white;
      font-size: 16px;
      font-weight: 600;
    }
    .total-amount {
      color: white;
      font-size: 24px;
      font-weight: 700;
    }
    .per-person {
      text-align: right;
      margin-top: 8px;
      font-size: 13px;
      color: #64748b;
    }
    .bank-details {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin-top: 25px;
    }
    .bank-details h3 {
      margin: 0 0 15px;
      font-size: 14px;
      color: #1e293b;
    }
    .bank-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    .bank-label {
      color: #64748b;
    }
    .bank-value {
      font-weight: 600;
      color: #1e293b;
    }
    .footer {
      text-align: center;
      padding: 25px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #64748b;
    }
    .footer .company {
      font-weight: 600;
      color: #1e40af;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 12px 30px;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>🌴 Travel Affordable</h1>
      <p>Booking Request Invoice</p>
    </div>
    
    <div class="invoice-meta">
      <div>
        <label>Invoice Date</label>
        <strong>${invoiceDate}</strong>
      </div>
      <div>
        <label>Quote Reference</label>
        <strong>${data.quoteRef}</strong>
      </div>
      <div>
        <label>Status</label>
        <strong style="color: #f59e0b;">Pending Payment</strong>
      </div>
    </div>
    
    <div class="content">
      <!-- Guest Details -->
      <div class="section">
        <div class="section-title">Guest Information</div>
        <div class="guest-details">
          <div>
            <div class="detail-row">
              <span class="detail-label">Name</span>
              <span class="detail-value">${data.guestName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email</span>
              <span class="detail-value">${data.guestEmail}</span>
            </div>
          </div>
          <div>
            <div class="detail-row">
              <span class="detail-label">Phone</span>
              <span class="detail-value">${data.guestTel}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${data.adults} Adult${data.adults > 1 ? 's' : ''}${data.children > 0 ? `, ${data.children} Child${data.children > 1 ? 'ren' : ''}` : ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hotel & Package -->
      <div class="section">
        <div class="section-title">Booking Details</div>
        <div class="hotel-card">
          <h2 class="hotel-name">${data.hotelName}</h2>
          ${data.roomType ? `<p class="hotel-detail">📋 ${data.roomType}</p>` : ''}
          ${data.bedConfig ? `<p class="hotel-detail">🛏️ ${data.bedConfig}</p>` : ''}
          ${data.mealPlan ? `<p class="hotel-detail">🍽️ ${data.mealPlan}</p>` : ''}
          <p class="hotel-detail">📦 ${data.packageName}</p>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Destination</span>
          <span class="detail-value">${data.destination}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Check-in</span>
          <span class="detail-value">${formatDate(data.checkIn)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Check-out</span>
          <span class="detail-value">${formatDate(data.checkOut)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration</span>
          <span class="detail-value">${data.nights} Night${data.nights > 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <!-- Pricing -->
      <div class="section">
        <div class="section-title">Pricing Breakdown</div>
        <table class="pricing-table">
          <tr>
            <td class="label">Accommodation (${data.nights} nights)</td>
            <td class="amount">${formatCurrency(data.accommodationCost)}</td>
          </tr>
          <tr>
            <td class="label">Package Cost (${data.adults} adult${data.adults > 1 ? 's' : ''})</td>
            <td class="amount">${formatCurrency(data.packageCostTotal)}</td>
          </tr>
          ${data.kidsPackageCost > 0 ? `
          <tr>
            <td class="label">Children Package Cost</td>
            <td class="amount">${formatCurrency(data.kidsPackageCost)}</td>
          </tr>
          ` : ''}
          <tr>
            <td class="label">Service & Booking Fees</td>
            <td class="amount">${formatCurrency(data.serviceFees)}</td>
          </tr>
        </table>
        
        <div class="total-row">
          <span class="total-label">Grand Total</span>
          <span class="total-amount">${formatCurrency(data.grandTotal)}</span>
        </div>
        ${data.children === 0 ? `
        <p class="per-person">${formatCurrency(data.pricePerPerson)} per person</p>
        ` : ''}
      </div>
      
      <!-- Bank Details -->
      <div class="bank-details">
        <h3>💳 Banking Details for Payment</h3>
        <div class="bank-row">
          <span class="bank-label">Bank</span>
          <span class="bank-value">First National Bank (FNB)</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Account Name</span>
          <span class="bank-value">Travel Affordable Pty Ltd</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Account Number</span>
          <span class="bank-value">62792877498</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Branch Code</span>
          <span class="bank-value">250655</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Reference</span>
          <span class="bank-value">${data.quoteRef}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p class="company">Travel Affordable Pty Ltd</p>
      <p>📧 info@travelaffordable.co.za | 📞 +27 79 681 3869</p>
      <p>🌐 www.travelaffordable.co.za</p>
      <a href="https://wa.me/27796813869" class="cta-button">📲 WhatsApp Us</a>
    </div>
  </div>
</body>
</html>
    `;

    // Send email to info@travelaffordable.co.za using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Travel Affordable Bookings <onboarding@resend.dev>",
        to: ["info@travelaffordable.co.za"],
        reply_to: data.guestEmail,
        subject: `🎫 New Booking Request: ${data.guestName} - ${data.hotelName} (${data.quoteRef})`,
        html: htmlContent,
      }),
    });

    const emailResponse = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Invoice email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Booking request sent successfully",
        quoteRef: data.quoteRef,
        data: emailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-booking-invoice function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

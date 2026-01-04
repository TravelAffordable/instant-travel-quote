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
  // Optional package inclusions for line items
  packageInclusions?: string[];
}

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
  return date.toLocaleDateString('en-ZA', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const formatDateLong = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
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
    const data: BookingInvoiceRequest = await req.json();
    
    // Validate required fields
    if (!data.guestName || !data.guestEmail || !data.hotelName || !data.packageName) {
      throw new Error("Missing required booking details");
    }

    const invoiceNumber = generateInvoiceNumber();
    const issueDate = formatDateLong(new Date().toISOString());
    const dueDate = formatDateLong(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    const travelDates = `${formatDate(data.checkIn)} - ${formatDate(data.checkOut)}`;

    // Generate invoice HTML matching the reference design
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #ffffff;
      color: #333;
      font-size: 14px;
      line-height: 1.5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
    }
    .company-info {
      flex: 1;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1a365d;
      margin-bottom: 5px;
    }
    .logo-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1a365d, #2d4a7c);
      border-radius: 8px;
      margin-right: 10px;
      position: relative;
    }
    .company-tagline {
      color: #c53030;
      font-size: 12px;
      font-style: italic;
      margin-bottom: 10px;
    }
    .company-details {
      font-size: 12px;
      color: #555;
      line-height: 1.6;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .invoice-dates {
      font-size: 12px;
      color: #666;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ddd;
    }
    .bill-to, .customer-info {
      flex: 1;
    }
    .section-label {
      font-size: 11px;
      color: #c53030;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .customer-name {
      font-weight: 600;
      color: #333;
    }
    .package-title {
      background: #fef2f2;
      border-left: 4px solid #c53030;
      padding: 15px;
      margin-bottom: 20px;
      font-weight: 600;
      color: #1a365d;
      font-size: 14px;
    }
    .line-items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .line-items-table thead {
      background: #fef2f2;
    }
    .line-items-table th {
      text-align: left;
      padding: 12px 15px;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #e2e8f0;
    }
    .line-items-table th:nth-child(2),
    .line-items-table th:nth-child(3),
    .line-items-table th:nth-child(4) {
      text-align: center;
    }
    .line-items-table th:last-child {
      text-align: right;
    }
    .line-items-table td {
      padding: 12px 15px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
    }
    .line-items-table td:nth-child(2),
    .line-items-table td:nth-child(3) {
      text-align: center;
    }
    .line-items-table td:last-child {
      text-align: right;
    }
    .item-name {
      font-weight: 500;
      color: #333;
    }
    .item-description {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    .totals-table {
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
    }
    .totals-row.subtotal {
      border-bottom: 1px solid #ddd;
      font-weight: 500;
    }
    .totals-row.total {
      font-weight: 600;
      font-size: 14px;
    }
    .balance-due {
      display: flex;
      justify-content: space-between;
      background: #fef2f2;
      border: 1px solid #fecaca;
      padding: 12px 15px;
      margin-top: 10px;
      font-weight: 700;
    }
    .balance-amount {
      color: #1a365d;
      font-size: 18px;
    }
    .banking-section {
      background: #fef2f2;
      border-top: 3px solid #c53030;
      padding: 20px;
      margin-bottom: 25px;
    }
    .banking-title {
      font-size: 12px;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .banking-details {
      font-size: 13px;
      color: #333;
      line-height: 1.8;
    }
    .important-notice {
      font-size: 12px;
      color: #333;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .important-notice strong {
      color: #c53030;
    }
    .terms-section {
      font-size: 11px;
      color: #666;
      line-height: 1.7;
      margin-bottom: 25px;
      text-align: justify;
    }
    .indemnity-section {
      font-size: 11px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .indemnity-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
      text-decoration: underline;
    }
    .edit-button-container {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f0f9ff;
      border-radius: 8px;
    }
    .edit-button {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 14px 35px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .edit-button:hover {
      background: #1d4ed8;
    }
    .edit-note {
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <div class="logo">
          <span style="color: #1a365d; font-size: 28px;">✈️</span> Travel Affordable Pty Ltd
        </div>
        <div class="company-tagline">Reliable Affordable Travel</div>
        <div class="company-details">
          <strong>Travel Affordable PTY LTD</strong><br>
          www.travelaffordable.co.za<br>
          Fax: 0865518867, Gauteng 2193<br>
          South Africa<br>
          info@travelaffordable.co.za<br>
          Phone: +27 79 681 3869
        </div>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">Invoice ${invoiceNumber}</div>
        <div class="invoice-dates">
          Issue Date: ${issueDate}<br>
          Due Date: ${dueDate}
        </div>
      </div>
    </div>

    <!-- Billing Section -->
    <div class="billing-section">
      <div class="bill-to">
        <div class="section-label">Bill to:</div>
        <div class="customer-name">${data.guestName}</div>
        <div>${travelDates}</div>
      </div>
      <div class="customer-info">
        <div class="section-label">Additional Customer Info:</div>
        <div>${data.guestEmail}</div>
        <div>Phone: ${data.guestTel}</div>
      </div>
    </div>

    <!-- Package Title -->
    <div class="package-title">
      : ${data.quoteRef} - ${data.packageName.toUpperCase()}
    </div>

    <!-- Line Items -->
    <table class="line-items-table">
      <thead>
        <tr>
          <th>Product or Service</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Line Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="item-name">${data.packageName.toUpperCase()}</div>
            <div class="item-description">${data.nights} Days ${data.nights - 1 > 0 ? data.nights - 1 : data.nights} Nights</div>
          </td>
          <td>${data.adults + data.children}</td>
          <td>${formatCurrency(data.grandTotal / (data.adults + data.children))}</td>
          <td>${formatCurrency(data.grandTotal)}</td>
        </tr>
        <tr>
          <td>
            <div class="item-name">${data.hotelName.toUpperCase()}</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        <tr>
          <td>
            <div class="item-name">DATE</div>
            <div class="item-description">${travelDates}</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        <tr>
          <td>
            <div class="item-name">${data.adults} ADULT GUEST${data.adults > 1 ? 'S' : ''}${data.children > 0 ? ` + ${data.children} CHILD${data.children > 1 ? 'REN' : ''}` : ''}</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        ${data.roomType ? `
        <tr>
          <td>
            <div class="item-name">${data.roomType.toUpperCase()}</div>
            ${data.bedConfig ? `<div class="item-description">${data.bedConfig}</div>` : ''}
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        ` : ''}
        ${data.mealPlan ? `
        <tr>
          <td>
            <div class="item-name">${data.mealPlan.toUpperCase()}</div>
            <div class="item-description">Daily (except for day of arrival)</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        ` : ''}
        <tr>
          <td>
            <div class="item-name">${data.destination.toUpperCase()}</div>
            <div class="item-description">Entrance fees included in the package</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
        <tr>
          <td>
            <div class="item-name">PAYMENT REFERENCE</div>
            <div class="item-description" style="color: #c53030;">IMPORTANT: Please use your name and surname as payment reference. Please confirm availability with us first before making payment by sending an email to info@travelaffordable.co.za. Please put the words 'Confirmation of availability' in the subject line of your email. If all is fine we will give you a go ahead to make payment then send you a confirmation letter.</div>
          </td>
          <td>1</td>
          <td>ZAR 0.00</td>
          <td>ZAR 0.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-table">
        <div class="totals-row subtotal">
          <span>Subtotal</span>
          <span>${formatCurrency(data.grandTotal)}</span>
        </div>
        <div class="totals-row">
          <span>Taxes</span>
          <span>ZAR 0.00</span>
        </div>
        <div class="totals-row total">
          <span>Invoice Total</span>
          <span>${formatCurrency(data.grandTotal)}</span>
        </div>
        <div class="totals-row">
          <span>Amount Paid</span>
          <span>ZAR 0.00</span>
        </div>
        <div class="balance-due">
          <span>Balance Due</span>
          <span class="balance-amount">${formatCurrency(data.grandTotal)}</span>
        </div>
      </div>
    </div>

    <!-- Banking Details -->
    <div class="banking-section">
      <div class="banking-title">BANKING DETAILS</div>
      <div class="banking-details">
        ACCOUNT HOLDER NAME: TRAVEL AFFORDABLE, BANK: TYME BANK,<br>
        ACCOUNT: 53000430069 &nbsp;&nbsp; BRANCH CODE: 678910 &nbsp;&nbsp; ACCOUNT TYPE: BUSINESS CHEQUE ACCOUNT
      </div>
    </div>

    <!-- Important Notice -->
    <div class="important-notice">
      <strong>NB!</strong>IMPORTANT: TO ENSURE PROMPT BOOKING, PLEASE SELECT THE 'IMMEDIATE PAYMENT' OPTION WHEN MAKING PAYMENT. THIS ALLOWS OUR BOOKINGS DEPARTMENT TO PROCESS YOUR BOOKING AS SOON AS THE FUNDS ARE RECEIVED. IF 'IMMEDIATE PAYMENT' IS NOT SELECTED, OUR TEAM WILL NEED TO WAIT FOR THE PAYMENT TO CLEAR BEFORE PROCESSING YOUR BOOKING, WHICH MAY RESULT IN DELAYS AND POTENTIALLY LEAD TO THE HOTEL BEING FULLY BOOKED BEFORE YOUR BOOKING IS CONFIRMED.
    </div>

    <!-- Terms -->
    <div class="terms-section">
      -50% deposit secures your booking. Hotel policies apply - 20% of invoiced amount is non-refundable under any circumstances - Postponement of bookings to a future date are not chargedany fees. - NB!! THIS IS VERY IMPORTANT. Unless we advise you on availability on email, before making any payment please send an email to info@travelaffordable.co.za titled 'AVAILABILITY CONFIRMATION' in the subject line of your e-mail to request that we confirm availability with the hotel. If all is in order and there is availability on your chosen dates, we would then give you a go-ahead to make payment. Once payment has been received we will proceed with bookings and send you a confirmation letter. Depending on how busy it is, your confirmation letter should reach you at least 2 days after receipt of payment. We can only confirm availability on the day that you plan to secure your booking. If we confirm availability for your dates and a day lapses with you making the required payment, you will need to re-send the request for confirmation on the day you will be securing your booking for us to check. We would like to urge all to please take the above to heart. Not confirming availability before making payment may cause that once receiving your payment and upon booking, we find that the hotels are full or hotel rates have shifted quite considerably on the dates due to high demand or high occupancy. So it is vitally important that we are 100% sure that there is availability at the correct invoiced package price before you make payment so that we could have the opportunity to inform you if there are any significant changes. Moving your booking to a future date will not incur any postponement fees or any charges.
    </div>

    <!-- Indemnity -->
    <div class="indemnity-section">
      <div class="indemnity-title">Indemnity</div>
      By accepting this invoice, you indemnify and agree that Travel Affordable, its directors, its partners, employees or representatives will not be held liable for any damage to property, loss due to theft or as a result of injury while on any of Travel Affordable holiday packages or any other travel products connected to Travel Affordable or any of its subsidiary companies.
    </div>

    <!-- Edit Button -->
    <div class="edit-button-container">
      <a href="mailto:travelaffordable2017@gmail.com?subject=Edit Invoice ${invoiceNumber} - ${data.guestName}&body=Please edit the following on invoice ${invoiceNumber}:%0D%0A%0D%0AGuest Name: ${data.guestName}%0D%0APackage: ${data.packageName}%0D%0ADates: ${travelDates}%0D%0A%0D%0AChanges requested:%0D%0A" class="edit-button">
        ✏️ Edit This Invoice
      </a>
      <div class="edit-note">Click to request changes to this invoice via email</div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Travel Affordable Pty Ltd</strong></p>
      <p>📧 info@travelaffordable.co.za | 📞 +27 79 681 3869 | 🌐 www.travelaffordable.co.za</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email using Resend API
    // Note: Using travelaffordable2017@gmail.com until domain is verified at resend.com/domains
    // Once verified, change 'to' to info@travelaffordable.co.za and 'from' to your verified domain email
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

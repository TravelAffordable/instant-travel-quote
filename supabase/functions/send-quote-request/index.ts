import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Send booking/quote requests to the Travel Affordable team inboxes.
const RECIPIENTS = ["info@travelaffordable.co.za", "travelaffordable2017@gmail.com"];

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      guestName, guestEmail, guestTel,
      destination, packageNames,
      checkIn, checkOut,
      adults, children, childrenAges,
      rooms, budget, bookingType,
      paymentOption, promoCode, specialRequests,
      reference, accommodation, totalAmount,
    } = body ?? {};

    if (!guestName || !guestEmail || !guestTel) {
      return new Response(JSON.stringify({ success: false, error: "Missing contact details" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rows: Array<[string, string]> = [
      ["Reference", reference || "—"],
      ["Name", guestName],
      ["Email", guestEmail],
      ["Telephone", guestTel],
      ["Destination", destination || "—"],
      ["Package(s)", Array.isArray(packageNames) ? packageNames.join(", ") : (packageNames || "—")],
      ["Accommodation", accommodation || "—"],
      ["Booking Type", bookingType || "—"],
      ["Payment Option", paymentOption || "—"],
      ["Check In", checkIn || "—"],
      ["Check Out", checkOut || "—"],
      ["Adults", String(adults ?? "—")],
      ["Children", String(children ?? 0)],
      ["Children Ages", childrenAges || "—"],
      ["Rooms", String(rooms ?? "—")],
      ["Total Amount (ZAR)", totalAmount ? `R${totalAmount}` : (budget ? `R${budget}` : "—")],
      ["Promo Code", promoCode || "—"],
      ["Special Requests", specialRequests || "—"],
    ];

    const html = `
      <h2 style="font-family:Arial,sans-serif;color:#0c2340">New Quotation Request</h2>
      <table style="font-family:Arial,sans-serif;border-collapse:collapse;font-size:14px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:6px 12px;border:1px solid #ddd;background:#f7f7f7;font-weight:bold">${esc(k)}</td>
            <td style="padding:6px 12px;border:1px solid #ddd">${esc(v)}</td>
          </tr>`).join("")}
      </table>
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#666;margin-top:16px">
        Sent from travelaffordable.co.za quotation form.
      </p>`;

    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ success: false, error: "Email service not configured" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Sender must be on a verified domain — the Resend sandbox address can only
    // deliver to the account owner, which silently dropped team enquiries.
    const fromAddress =
      Deno.env.get("QUOTE_FROM_EMAIL") || "quotes@travelaffordable.co.za";

    const emailPayload = {
      from: `Travel Affordable <${fromAddress}>`,

      ...(guestEmail && /^\S+@\S+\.\S+$/.test(String(guestEmail))
        ? { reply_to: String(guestEmail) }
        : {}),
      subject: `New Booking Request — ${guestName}${destination ? ` (${destination})` : ""}`,
      html,
      text,
    };

    // Send to each recipient individually so a test-mode restriction on one
    // address does not prevent delivery to the other.
    const results = await Promise.all(
      RECIPIENTS.map(async (to) => {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...emailPayload, to: [to] }),
        });
        const result = await response.json();
        if (!response.ok) {
          console.error(`Resend error for ${to}:`, result);
          return { to, ok: false, error: result };
        }
        return { to, ok: true };
      }),
    );

    const successful = results.filter((r) => r.ok);
    if (successful.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Failed to send email" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, deliveredTo: successful.map((r) => r.to) }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("send-quote-request error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

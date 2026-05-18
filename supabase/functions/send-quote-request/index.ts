import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    } = body ?? {};

    if (!guestName || !guestEmail || !guestTel) {
      return new Response(JSON.stringify({ success: false, error: "Missing contact details" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rows: Array<[string, string]> = [
      ["Name", guestName],
      ["Email", guestEmail],
      ["Telephone", guestTel],
      ["Destination", destination || "—"],
      ["Package(s)", Array.isArray(packageNames) ? packageNames.join(", ") : (packageNames || "—")],
      ["Booking Type", bookingType || "—"],
      ["Check In", checkIn || "—"],
      ["Check Out", checkOut || "—"],
      ["Adults", String(adults ?? "—")],
      ["Children", String(children ?? 0)],
      ["Children Ages", childrenAges || "—"],
      ["Rooms", String(rooms ?? "—")],
      ["Budget (ZAR)", budget ? `R${budget}` : "—"],
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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Travel Affordable <onboarding@resend.dev>",
        to: RECIPIENTS,
        reply_to: guestEmail,
        subject: `New Quotation Request — ${guestName}${destination ? ` (${destination})` : ""}`,
        html,
        text,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ success: false, error: "Failed to send email" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("send-quote-request error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});

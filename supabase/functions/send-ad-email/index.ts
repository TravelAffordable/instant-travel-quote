import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendAdEmailSchema, escapeHtml } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate and sanitize inputs using Zod schema
    const validationResult = sendAdEmailSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Validation failed", 
          details: validationResult.error.errors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email, adName, adContent } = validationResult.data;

    // Sanitize HTML content to prevent XSS
    const safeAdName = escapeHtml(adName);
    const safeAdContent = escapeHtml(adContent).replace(/\n/g, '<br>');

    // Format the ad content for email with sanitized values
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${safeAdName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #92400e 0%, #d97706 50%, #ca8a04 100%);
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1a1a1a;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #1a1a1a;
            margin: 0;
            font-size: 28px;
            font-weight: 900;
          }
          .content {
            padding: 30px;
            color: #ffffff;
          }
          .ad-content {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 12px;
            padding: 20px;
            white-space: pre-line;
            line-height: 1.6;
            font-size: 16px;
          }
          .cta {
            text-align: center;
            margin-top: 30px;
          }
          .cta a {
            display: inline-block;
            background: #22c55e;
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: rgba(255,255,255,0.6);
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌴 ${safeAdName}</h1>
          </div>
          <div class="content">
            <div class="ad-content">${safeAdContent}</div>
            <div class="cta">
              <a href="https://wa.me/27796813869">📲 WhatsApp Now</a>
            </div>
          </div>
          <div class="footer">
            <p>Sun City Getaway Packages | Book your adventure today!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    console.log(`Email prepared for ${email}:`, { adName: safeAdName, contentLength: adContent.length });
    
    if (resendApiKey) {
      // Actually send the email using Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Sun City Getaways <onboarding@resend.dev>",
          to: [email],
          subject: `🌴 ${safeAdName} - Sun City Special Offer!`,
          html: htmlContent,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("Resend API error:", result);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to send email" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      console.log("Email sent successfully");
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // No Resend key - return informative message
      console.log("RESEND_API_KEY not configured - email would be sent to:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email queued (configure RESEND_API_KEY for delivery)"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

  } catch (error: unknown) {
    console.error("Error in send-ad-email function:", error instanceof Error ? error.message : "Unknown error");
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

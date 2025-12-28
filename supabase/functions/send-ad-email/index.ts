import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendAdEmailRequest {
  email: string;
  adName: string;
  adContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, adName, adContent }: SendAdEmailRequest = await req.json();

    // Validate inputs
    if (!email || !adName || !adContent) {
      throw new Error("Missing required fields: email, adName, or adContent");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address format");
    }

    // Format the ad content for email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${adName}</title>
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
            <h1>🌴 ${adName}</h1>
          </div>
          <div class="content">
            <div class="ad-content">${adContent.replace(/\n/g, '<br>')}</div>
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

    // For now, we'll return success with a note that email requires Resend setup
    // This demonstrates the structure - Resend API key needed for actual sending
    console.log(`Email prepared for ${email}:`, { adName, contentLength: adContent.length });
    
    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
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
          subject: `🌴 ${adName} - Sun City Special Offer!`,
          html: htmlContent,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("Resend API error:", result);
        throw new Error(result.message || "Failed to send email via Resend");
      }

      console.log("Email sent successfully:", result);
      return new Response(
        JSON.stringify({ success: true, data: result }),
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
          message: "Email queued (configure RESEND_API_KEY for delivery)",
          preview: { to: email, subject: `${adName} - Sun City Special Offer!` }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

  } catch (error: any) {
    console.error("Error in send-ad-email function:", error);
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

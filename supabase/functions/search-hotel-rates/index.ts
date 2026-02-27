import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, checkIn, checkOut, adults, children, budget } = await req.json();

    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) {
      throw new Error("PERPLEXITY_API_KEY is not configured");
    }

    const searchQuery = `Find current hotel room rates and prices in ${destination}, South Africa for ${adults} adults${children ? ` and ${children} children` : ''} checking in ${checkIn} and checking out ${checkOut}. Budget is around R${budget} total. Show budget, mid-range and premium options with nightly rates in South African Rand (ZAR). Include hotel names, star ratings, and per-night prices. Focus on hotels that are actually available for these dates.`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are a hotel rate research assistant. Return current, accurate hotel pricing in South African Rand (ZAR). Always include the hotel name, star rating, nightly rate, and total estimated cost. Be concise and factual. Format prices as R followed by the amount."
          },
          { role: "user", content: searchQuery }
        ],
        search_recency_filter: "month",
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error:", response.status, errorText);
      throw new Error(`Perplexity API error [${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No results found";
    const citations = data.citations || [];

    return new Response(JSON.stringify({ 
      results: content, 
      citations,
      destination,
      checkIn,
      checkOut 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-hotel-rates error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

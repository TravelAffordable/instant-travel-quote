import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { hotels } = await req.json();
    // hotels is an array of:
    // { destination: string, area_name: string, name: string, tier: "budget"|"affordable"|"premium",
    //   star_rating: number, includes_breakfast: boolean, 
    //   room_type: string, capacity: "2_sleeper"|"4_sleeper", max_adults: number, max_children: number,
    //   weekday_rate: number, weekend_rate: number }

    if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
      throw new Error("hotels array is required");
    }

    const results: any[] = [];

    for (const h of hotels) {
      console.log(`Processing hotel: ${h.name} (${h.tier}) in ${h.destination}`);

      // 1. Find area
      const { data: area, error: areaErr } = await supabase
        .from("areas")
        .select("id")
        .eq("destination", h.destination)
        .eq("name", h.area_name)
        .single();

      if (areaErr || !area) {
        console.error(`Area not found: ${h.destination} / ${h.area_name}`, areaErr);
        results.push({ hotel: h.name, error: `Area not found: ${h.area_name}` });
        continue;
      }

      // 2. Check if hotel already exists
      const { data: existingHotel } = await supabase
        .from("hotels")
        .select("id")
        .eq("name", h.name)
        .eq("area_id", area.id)
        .maybeSingle();

      let hotelId: string;

      if (existingHotel) {
        hotelId = existingHotel.id;
        console.log(`Hotel already exists: ${h.name} (${hotelId})`);
      } else {
        // 3. Insert hotel
        const { data: newHotel, error: hotelErr } = await supabase
          .from("hotels")
          .insert({
            area_id: area.id,
            name: h.name,
            tier: h.tier,
            star_rating: h.star_rating || 3,
            includes_breakfast: h.includes_breakfast || false,
            is_active: true,
          })
          .select("id")
          .single();

        if (hotelErr || !newHotel) {
          console.error(`Failed to insert hotel: ${h.name}`, hotelErr);
          results.push({ hotel: h.name, error: hotelErr?.message });
          continue;
        }
        hotelId = newHotel.id;
      }

      // 4. Insert room type
      const { data: roomType, error: rtErr } = await supabase
        .from("room_types")
        .insert({
          hotel_id: hotelId,
          name: h.room_type || "Standard Room",
          capacity: h.capacity || "2_sleeper",
          max_adults: h.max_adults || 2,
          max_children: h.max_children || 0,
          is_active: true,
        })
        .select("id")
        .single();

      if (rtErr || !roomType) {
        console.error(`Failed to insert room type for ${h.name}`, rtErr);
        results.push({ hotel: h.name, error: rtErr?.message });
        continue;
      }

      // 5. Insert room rate
      const { error: rateErr } = await supabase
        .from("room_rates")
        .insert({
          room_type_id: roomType.id,
          base_rate_weekday: h.weekday_rate,
          base_rate_weekend: Math.round(h.weekday_rate * 1.1),
          effective_from: "2025-01-01",
          is_active: true,
        });

      if (rateErr) {
        console.error(`Failed to insert rate for ${h.name}`, rateErr);
        results.push({ hotel: h.name, error: rateErr.message });
        continue;
      }

      results.push({ hotel: h.name, status: "success", hotel_id: hotelId });
      console.log(`✅ Hotel populated: ${h.name} @ R${h.weekday_rate}/night`);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("populate-hotels error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

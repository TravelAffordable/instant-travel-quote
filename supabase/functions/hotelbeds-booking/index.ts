import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/node/crypto.ts";
import { hotelbedsCheckRateSchema, hotelbedsBookingSchema, hotelbedsCanelSchema } from "../_shared/validation.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateSignature(apiKey: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = apiKey + secret + timestamp;
  const hash = createHash('sha256');
  hash.update(signatureString);
  return hash.digest('hex') as string;
}

// EUR to ZAR conversion
const EUR_TO_ZAR = 19.5;
const MARKUP = 1.05;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('HOTELBEDS_API_KEY');
  const apiSecret = Deno.env.get('HOTELBEDS_API_SECRET');

  if (!apiKey || !apiSecret) {
    console.error('Hotelbeds API credentials not configured');
    return new Response(JSON.stringify({
      success: false,
      error: 'API credentials not configured'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    
    // Determine action and validate accordingly
    if (!body.action || typeof body.action !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing or invalid action field'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const signature = generateSignature(apiKey, apiSecret);

    console.log('='.repeat(60));
    console.log(`[HOTELBEDS BOOKING] Action: ${body.action}`);
    console.log('='.repeat(60));

    // ========== CHECK RATE ==========
    if (body.action === 'checkRate') {
      const validationResult = hotelbedsCheckRateSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors.map(e => e.message)
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { rateKey } = validationResult.data;
      console.log('[REQUEST] CheckRate');

      const checkRatePayload = {
        rooms: [{
          rateKey: rateKey
        }]
      };

      const response = await fetch('https://api.test.hotelbeds.com/hotel-api/1.0/checkrates', {
        method: 'POST',
        headers: {
          'Api-key': apiKey,
          'X-Signature': signature,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkRatePayload),
      });

      const responseText = await response.text();
      console.log('[RESPONSE STATUS]:', response.status);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'CheckRate failed'
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = JSON.parse(responseText);
      const hotel = data.hotel;
      const room = hotel?.rooms?.[0];
      const rate = room?.rates?.[0];

      const result = {
        success: true,
        checkRate: {
          hotelCode: hotel?.code,
          hotelName: hotel?.name,
          roomCode: room?.code,
          roomName: room?.name,
          rateKey: rate?.rateKey,
          netEUR: rate?.net,
          netZAR: rate?.net ? Math.round(parseFloat(rate.net) * EUR_TO_ZAR * MARKUP) : null,
          boardCode: rate?.boardCode,
          boardName: rate?.boardName,
          cancellationPolicies: rate?.cancellationPolicies,
          rateComments: rate?.rateComments,
        }
      };

      console.log('[CHECKRATE SUCCESS]');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ========== BOOKING (CONFIRMATION) ==========
    if (body.action === 'book') {
      const validationResult = hotelbedsBookingSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors.map(e => e.message)
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { holder, rooms, clientReference, remark } = validationResult.data;
      console.log('[REQUEST] Book/Confirm');

      const bookingPayload = {
        holder,
        rooms,
        clientReference,
        remark: remark || 'Booking via Travel Affordable',
      };

      const response = await fetch('https://api.test.hotelbeds.com/hotel-api/1.0/bookings', {
        method: 'POST',
        headers: {
          'Api-key': apiKey,
          'X-Signature': signature,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      const responseText = await response.text();
      console.log('[RESPONSE STATUS]:', response.status);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Booking failed'
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = JSON.parse(responseText);
      const booking = data.booking;

      const result = {
        success: true,
        booking: {
          reference: booking?.reference,
          status: booking?.status,
          creationDate: booking?.creationDate,
          clientReference: booking?.clientReference,
          holder: booking?.holder,
          hotel: {
            code: booking?.hotel?.code,
            name: booking?.hotel?.name,
            checkIn: booking?.hotel?.checkIn,
            checkOut: booking?.hotel?.checkOut,
            rooms: booking?.hotel?.rooms?.map((r: { code: string; name: string; paxes: unknown[]; rates?: Array<{ net: string; boardCode: string; boardName: string }> }) => ({
              code: r.code,
              name: r.name,
              paxes: r.paxes,
              rates: r.rates?.map((rt) => ({
                net: rt.net,
                netZAR: Math.round(parseFloat(rt.net) * EUR_TO_ZAR * MARKUP),
                boardCode: rt.boardCode,
                boardName: rt.boardName,
              }))
            }))
          },
          totalNetEUR: booking?.totalNet,
          totalNetZAR: booking?.totalNet ? Math.round(parseFloat(booking.totalNet) * EUR_TO_ZAR * MARKUP) : null,
          currency: 'EUR',
          cancellationReference: booking?.cancellationReference,
        }
      };

      console.log('[BOOKING SUCCESS] Reference:', booking?.reference);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ========== CANCELLATION ==========
    if (body.action === 'cancel') {
      const validationResult = hotelbedsCanelSchema.safeParse(body);
      if (!validationResult.success) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors.map(e => e.message)
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { bookingReference } = validationResult.data;
      console.log('[REQUEST] Cancel Booking');

      // Validate booking reference format (alphanumeric only)
      if (!/^[a-zA-Z0-9-]+$/.test(bookingReference)) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid booking reference format'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const cancelUrl = `https://api.test.hotelbeds.com/hotel-api/1.0/bookings/${encodeURIComponent(bookingReference)}?cancellationFlag=CANCELLATION`;

      const response = await fetch(cancelUrl, {
        method: 'DELETE',
        headers: {
          'Api-key': apiKey,
          'X-Signature': signature,
          'Accept': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('[RESPONSE STATUS]:', response.status);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Cancellation failed'
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = JSON.parse(responseText);
      const booking = data.booking;

      const result = {
        success: true,
        cancellation: {
          reference: booking?.reference,
          status: booking?.status,
          cancellationReference: booking?.cancellationReference,
          hotel: {
            code: booking?.hotel?.code,
            name: booking?.hotel?.name,
          }
        }
      };

      console.log('[CANCELLATION SUCCESS] Reference:', booking?.reference);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Invalid action. Use: checkRate, book, or cancel'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ERROR]:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

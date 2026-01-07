import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHash } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckRateRequest {
  action: 'checkRate';
  rateKey: string;
}

interface BookingRequest {
  action: 'book';
  rateKey: string;
  holder: {
    name: string;
    surname: string;
  };
  rooms: Array<{
    rateKey: string;
    paxes: Array<{
      roomId: number;
      type: 'AD' | 'CH';
      name: string;
      surname: string;
      age?: number;
    }>;
  }>;
  clientReference: string;
  remark?: string;
}

interface CancelRequest {
  action: 'cancel';
  bookingReference: string;
}

type HotelbedsRequest = CheckRateRequest | BookingRequest | CancelRequest;

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
    const body: HotelbedsRequest = await req.json();
    const signature = generateSignature(apiKey, apiSecret);

    console.log('='.repeat(60));
    console.log(`[HOTELBEDS BOOKING] Action: ${body.action}`);
    console.log('='.repeat(60));

    // ========== CHECK RATE ==========
    if (body.action === 'checkRate') {
      console.log('[REQUEST] CheckRate');
      console.log('Rate Key:', body.rateKey);

      const checkRatePayload = {
        rooms: [{
          rateKey: body.rateKey
        }]
      };

      console.log('[REQUEST PAYLOAD]:', JSON.stringify(checkRatePayload, null, 2));

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
      console.log('[RESPONSE BODY]:', responseText);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'CheckRate failed',
          details: responseText,
          request: checkRatePayload,
          response: { status: response.status, body: responseText }
        }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = JSON.parse(responseText);
      
      // Extract validated rate info
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
        },
        // Full logs for certification
        logs: {
          request: checkRatePayload,
          response: data
        }
      };

      console.log('[CHECKRATE SUCCESS]');
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ========== BOOKING (CONFIRMATION) ==========
    if (body.action === 'book') {
      console.log('[REQUEST] Book/Confirm');
      console.log('Holder:', body.holder);
      console.log('Client Reference:', body.clientReference);

      const bookingPayload = {
        holder: body.holder,
        rooms: body.rooms,
        clientReference: body.clientReference,
        remark: body.remark || 'Test booking for API certification',
      };

      console.log('[REQUEST PAYLOAD]:', JSON.stringify(bookingPayload, null, 2));

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
      console.log('[RESPONSE BODY]:', responseText);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Booking failed',
          details: responseText,
          request: bookingPayload,
          response: { status: response.status, body: responseText }
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
            rooms: booking?.hotel?.rooms?.map((r: any) => ({
              code: r.code,
              name: r.name,
              paxes: r.paxes,
              rates: r.rates?.map((rt: any) => ({
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
        },
        // Full logs for certification
        logs: {
          request: bookingPayload,
          response: data
        }
      };

      console.log('[BOOKING SUCCESS] Reference:', booking?.reference);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ========== CANCELLATION ==========
    if (body.action === 'cancel') {
      console.log('[REQUEST] Cancel Booking');
      console.log('Booking Reference:', body.bookingReference);

      const cancelUrl = `https://api.test.hotelbeds.com/hotel-api/1.0/bookings/${body.bookingReference}?cancellationFlag=CANCELLATION`;

      console.log('[REQUEST URL]:', cancelUrl);

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
      console.log('[RESPONSE BODY]:', responseText);

      if (!response.ok) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Cancellation failed',
          details: responseText,
          request: { bookingReference: body.bookingReference, url: cancelUrl },
          response: { status: response.status, body: responseText }
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
        },
        // Full logs for certification
        logs: {
          request: { bookingReference: body.bookingReference },
          response: data
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
    console.error('[ERROR]:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

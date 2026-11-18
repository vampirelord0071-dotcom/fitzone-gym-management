import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper for HMAC-SHA256 verification
async function verifyHmacSha256(data: string, secret: string, expectedSignature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  const hexSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hexSignature.toLowerCase() === expectedSignature.toLowerCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!razorpayKeySecret || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Server environment secrets missing.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      membershipId,
      amountPaise,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !membershipId) {
      return new Response(
        JSON.stringify({ error: 'Missing required payment verification parameters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify cryptographic signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const isValid = await verifyHmacSha256(payload, razorpayKeySecret, razorpay_signature);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment signature. Fraud attempt prevented.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Prevent duplicate processing (Idempotency check)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, receipt_number')
      .eq('external_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingPayment) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment already recorded',
          receiptNumber: existingPayment.receipt_number,
          alreadyRecorded: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique receipt number
    const timestamp = Date.now().toString().slice(-6);
    const receiptNumber = `RCP-RZP-${timestamp}`;

    // Record verified payment
    const { data: newPayment, error: insertError } = await supabase
      .from('payments')
      .insert({
        membership_id: membershipId,
        amount_paise: amountPaise,
        method: 'Razorpay',
        status: 'captured',
        payment_source: 'online',
        external_order_id: razorpay_order_id,
        external_payment_id: razorpay_payment_id,
        idempotency_key: `rzp_${razorpay_payment_id}`,
        receipt_number: receiptNumber,
        notes: `Online payment verified via Razorpay (${razorpay_payment_id})`,
        recorded_by: 'Razorpay Gateway',
      })
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to record payment: ' + insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment: newPayment,
        receiptNumber,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

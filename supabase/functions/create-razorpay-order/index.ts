import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!razorpayKeyId || !razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay server credentials are not configured.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { membershipId, amountPaise, receipt } = await req.json();

    if (!membershipId || !amountPaise || amountPaise <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid membership ID or amount.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Connect with Supabase service role to verify membership outstanding dues
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { data: membership, error: membError } = await supabase
      .from('memberships')
      .select('id, total_due_paise, payments(amount_paise, status)')
      .eq('id', membershipId)
      .single();

    if (membError || !membership) {
      return new Response(
        JSON.stringify({ error: 'Membership record not found.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate verified outstanding balance
    const validPayments = (membership.payments || [])
      .filter((p: any) => p.status === 'captured')
      .reduce((sum: number, p: any) => sum + Number(p.amount_paise), 0);

    const outstandingPaise = Math.max(0, Number(membership.total_due_paise) - validPayments);

    if (amountPaise > outstandingPaise) {
      return new Response(
        JSON.stringify({ 
          error: `Payment amount ₹${(amountPaise / 100).toFixed(2)} exceeds outstanding balance of ₹${(outstandingPaise / 100).toFixed(2)}.` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Razorpay Order
    const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const orderPayload = {
      amount: amountPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${membershipId.slice(0, 8)}_${Date.now()}`,
      notes: {
        membershipId,
      },
    };

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await rzpRes.json();

    if (!rzpRes.ok) {
      return new Response(
        JSON.stringify({ error: orderData.error?.description || 'Failed to create Razorpay order' }),
        { status: rzpRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: razorpayKeyId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

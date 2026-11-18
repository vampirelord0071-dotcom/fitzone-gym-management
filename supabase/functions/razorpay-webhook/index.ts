import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Helper for HMAC-SHA256 signature verification against raw body
async function verifyWebhookSignature(rawBody: string, secret: string, expectedSignature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBytes = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(rawBody));
  const hexSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hexSignature.toLowerCase() === expectedSignature.toLowerCase();
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('Missing webhook configuration secrets');
      return new Response('Server configuration missing', { status: 500 });
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return new Response('Missing webhook signature', { status: 400 });
    }

    const rawBody = await req.text();
    const isValid = await verifyWebhookSignature(rawBody, webhookSecret, signature);

    if (!isValid) {
      console.warn('Invalid Razorpay webhook signature received');
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || `${event.event}_${Date.now()}`;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Deduplication check in payment_events table
    const { data: existingEvent } = await supabase
      .from('payment_events')
      .select('id, processing_status')
      .eq('event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      // Event already received and handled
      return new Response(JSON.stringify({ status: 'already_processed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Process event
    let processingStatus: 'success' | 'failed' | 'ignored' = 'ignored';

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const notes = paymentEntity?.notes || {};
      const membershipId = notes.membershipId;
      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id;
      const amountPaise = paymentEntity?.amount;

      if (membershipId && paymentId) {
        // Check if payment already exists
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('id')
          .eq('external_payment_id', paymentId)
          .maybeSingle();

        if (!existingPayment) {
          const receiptNumber = `RCP-WH-${Date.now().toString().slice(-6)}`;
          const { error: insertErr } = await supabase.from('payments').insert({
            membership_id: membershipId,
            amount_paise: amountPaise,
            method: 'Razorpay',
            status: 'captured',
            payment_source: 'online',
            external_order_id: orderId,
            external_payment_id: paymentId,
            idempotency_key: `wh_${paymentId}`,
            receipt_number: receiptNumber,
            notes: `Webhook capture (${paymentId})`,
            recorded_by: 'Razorpay Webhook',
          });

          if (!insertErr) {
            processingStatus = 'success';
          } else {
            console.error('Error inserting webhook payment:', insertErr);
            processingStatus = 'failed';
          }
        } else {
          processingStatus = 'success';
        }
      }
    }

    // Record event in payment_events audit table
    await supabase.from('payment_events').insert({
      provider: 'razorpay',
      event_id: eventId,
      payload: event,
      processing_status: processingStatus,
    });

    return new Response(JSON.stringify({ received: true, status: processingStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    return new Response('Webhook handling error: ' + error.message, { status: 500 });
  }
});

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { getOrCreateCustomer } from '@/features/account/controllers/get-or-create-customer';
import { sendOrderConfirmation } from '@/features/emails/controllers/send-order-confirmation';

const relevantEvents = new Set(['checkout.session.completed']);

export async function POST(req: Request) {
  console.log('--- RELOADED WEBHOOK: VERSION 2 ---');
  const body = await req.text();
      const sig = req.headers.get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripeAdmin.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const checkoutSession = event.data.object;
          const supabase = supabaseAdminClient;

          // Prevent duplicate orders
          const { data: existingOrder } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_checkout_session_id', checkoutSession.id)
            .single();

          if (existingOrder) {
            console.log(`Order with session ID ${checkoutSession.id} already exists. Skipping.`);
            return new Response('Webhook Handled', { status: 200 });
          }

          const customerId = await getOrCreateCustomer({
            userId: checkoutSession.metadata?.userId ?? null,
            email: checkoutSession.customer_details?.email as string,
          });

          const lineItems = await stripeAdmin.checkout.sessions.listLineItems(checkoutSession.id, { expand: ['data.price.product'] });

          // Create order in DB
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: checkoutSession.metadata?.userId || null,
              stripe_checkout_session_id: checkoutSession.id,
              amount_total: checkoutSession.amount_total,
              currency: checkoutSession.currency,
              status: 'paid',
              email: checkoutSession.customer_details?.email,
            })
            .select()
            .single();

          if (orderError) {
            console.error('Order creation error:', orderError);
            throw new Error(`Failed to create order: ${orderError.message}`);
          }

          // Create order items in DB
          const orderItemsToInsert = lineItems.data.map((item) => {
            const product = item.price?.product as Stripe.Product;
            return {
              order_id: order.id,
              product_id: product.id,
              price_id: item.price?.id ?? '',
              quantity: item.quantity ?? 0,
            };
          });

          const { data: createdOrderItems, error: orderItemsError } = await supabase
            .from('order_items')
            .insert(orderItemsToInsert)
            .select();

          if (orderItemsError) {
            throw new Error(`Failed to create order items: ${orderItemsError.message}`);
          }

          if (!createdOrderItems) {
            throw new Error('Failed to retrieve created order items.');
          }

          let invoiceUrl: string | null = null;

          if (checkoutSession.payment_intent) {
            const paymentIntent = await stripeAdmin.paymentIntents.retrieve(
              checkoutSession.payment_intent as string
            );
            if (paymentIntent.invoice) {
              const invoice = await stripeAdmin.invoices.retrieve(paymentIntent.invoice as string);
              invoiceUrl = invoice.hosted_invoice_url ?? null;
            }
          }

          // Send confirmation email
          await sendOrderConfirmation(
            {
              ...order,
              id: order.id, // ID is already a string (UUID)
              invoiceUrl,
            },
            createdOrderItems
          );

          break;
        }
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new NextResponse('Webhook handler failed. View your nextjs function logs.', { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}

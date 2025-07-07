import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    // Retrieve the subscription details from Stripe.
    // const subscription = await stripe.subscriptions.retrieve(
    //   session.subscription as string
    // );

    // Update the user stripe into in our database.
    // Since this is a one-time payment, we will just log it for now.
    console.log('✅ Payment successful!', session);

    // TODO: Create order in your database.
  }

  // Handle other event types
  // switch (event.type) {
  //   case 'invoice.payment_succeeded':
  //     // ...
  //     break;
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  return new NextResponse(null, { status: 200 });
}

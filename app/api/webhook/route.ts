import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

type CartItemMetadata = {
  productId: string;
  quantity: number;
  price: number;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = await createClient();

    try {
      const cartItems: CartItemMetadata[] = JSON.parse(
        session.metadata?.cart || '[]'
      );
      const customerEmail = session.customer_details?.email;
      const totalPrice = (session.amount_total || 0) / 100;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_price: totalPrice,
          customer_email: customerEmail,
          stripe_session_id: session.id,
          is_paid: true,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      console.log(`Order ${order.id} created successfully.`);

    } catch (dbError: unknown) {
      // Log the full, detailed error object to Vercel logs
      console.error('[DB_INSERT_ERROR]', JSON.stringify(dbError, null, 2));

      // Return a more detailed error in the response for easier debugging
      const errorMessage = dbError instanceof Error ? dbError.message : 'An unknown error occurred';
      return new NextResponse(`Database Error: ${errorMessage}. Details: ${JSON.stringify(dbError)}`, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}

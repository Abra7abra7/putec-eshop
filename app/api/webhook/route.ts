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
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = await createClient();

    try {
      const cartItems: CartItemMetadata[] = JSON.parse(session.metadata?.cart || '[]');
      const totalPrice = (session.amount_total || 0) / 100;

      // 1. Vytvorenie záznamu v tabuľke 'orders' podľa novej schémy
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_price: totalPrice,
          status: 'paid', // Predpokladáme, že 'paid' je platná hodnota
          payment_method: 'card', // Predpokladáme, že 'card' je platná hodnota
          customer_details: session.customer_details,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shipping_details: (session as any).shipping_details || {},
        })
        .select('id') // Potrebujeme len ID novej objednávky
        .single();

      if (orderError) throw orderError;

      // 2. Vytvorenie záznamov v tabuľke 'order_items'
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_per_unit: item.price, // Použijeme správny názov stĺpca
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      console.log(`Order ${order.id} created successfully.`);

    } catch (dbError: unknown) {
      console.error('[DB_INSERT_ERROR]', JSON.stringify(dbError, null, 2));
      const errorMessage = dbError instanceof Error ? dbError.message : 'An unknown error occurred';
      return new NextResponse(`Database Error: ${errorMessage}. Details: ${JSON.stringify(dbError)}`, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';

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
          payment_method: 'stripe', // Použijeme správnu hodnotu z enum
          stripe_session_id: session.id,
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

      // --- Odoslanie potvrdzujúceho e-mailu ---
      if (session.customer_details?.email) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          
          // Potrebujeme načítať názvy produktov, pretože ich nemáme v metadátach
          const productIds = cartItems.map(item => item.productId);
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .in('id', productIds);

          if (productsError) throw productsError;

          const orderItemsWithNames = cartItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              ...item,
              name: product?.name || 'Neznámy produkt',
              price_per_unit: item.price,
            };
          });

          await resend.emails.send({
            from: 'Putec Eshop <onboarding@resend.dev>', // Pre testovanie používame Resend onboarding doménu
            to: [session.customer_details.email],
            subject: `Potvrdenie objednávky č. ${order.id}`,
            react: OrderConfirmationEmail({
              orderId: order.id,
              orderDate: new Date().toLocaleDateString('sk-SK'),
              customerName: session.customer_details.name || '',
              orderItems: orderItemsWithNames,
              totalPrice: totalPrice,
            }),
          });

          console.log(`Confirmation email sent for order ${order.id}`);

        } catch (emailError: unknown) {
          console.error('[EMAIL_SEND_ERROR]', JSON.stringify(emailError, null, 2));
          // Nechceme, aby chyba pri odosielaní e-mailu zhodila celý proces,
          // takže ju len zalogujeme a pokračujeme.
        }
      } else {
        console.log('Customer details or email not found, skipping confirmation email.');
      }

    } catch (dbError: unknown) {
      console.error('[DB_INSERT_ERROR]', JSON.stringify(dbError, null, 2));
      const errorMessage = dbError instanceof Error ? dbError.message : 'An unknown error occurred';
      return new NextResponse(`Database Error: ${errorMessage}. Details: ${JSON.stringify(dbError)}`, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}

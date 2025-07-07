import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/hooks/use-cart-store';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not set');
      return new NextResponse('Application URL is not configured', {
        status: 500,
      });
    }

    if (!items || items.length === 0) {
      return new NextResponse('No items in cart', { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: CartItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100), // Cena v centoch
        },
        quantity: item.quantity,
      })
    );

        const metadata = {
      cart: JSON.stringify(
        items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price, // Uloženie ceny v čase nákupu
        }))
      ),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${appUrl}/dakujeme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/kosik`,
      metadata: metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse(errorMessage, { status: 500 });
  }
}

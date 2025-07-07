import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/hooks/use-cart-store';
import Stripe from 'stripe';

// Typ pre dáta z formulára, mal by zodpovedať Zod schéme na frontende
interface CustomerDetails {
  customerType: 'individual' | 'company';
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  icDph?: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingStreet?: string;
  shippingCity?: string;
  shippingZip?: string;
}

interface RequestBody {
  cartItems: CartItem[];
  customerDetails: CustomerDetails;
  deliveryCost: number;
}

export async function POST(req: Request) {
  try {
    const { cartItems, customerDetails, deliveryCost } = (await req.json()) as RequestBody;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not set');
      return new NextResponse('Application URL is not configured', {
        status: 500,
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse('No items in cart', { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map(
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

    // Pridanie dopravy ako samostatnej položky, ak je cena > 0
    if (deliveryCost > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Doprava a balné',
          },
          unit_amount: Math.round(deliveryCost * 100),
        },
        quantity: 1,
      });
    }

    // Uloženie všetkých potrebných dát do metadát
    const metadata = {
      cart: JSON.stringify(
        cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }))
      ),
      customerDetails: JSON.stringify(customerDetails),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${appUrl}/dakujeme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pokladna`, // Návrat do pokladne, nie do košíka
      customer_email: customerDetails.email, // Predvyplnenie e-mailu
      metadata,
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

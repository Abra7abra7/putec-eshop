'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';

import { CartItem } from '@/features/cart/store/use-cart-store';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function createCheckoutSession(cartItems: CartItem[]) {
  try {
    if (cartItems.length === 0) {
      throw new Error('Košík je prázdny');
    }

    // Vytvoriť Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            description: `${item.wine_category || 'Víno'}${item.vintage ? ` - Ročník ${item.vintage}` : ''}${item.region ? ` - ${item.region}` : ''}`,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: item.price, // už v centoch
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        cart_items: JSON.stringify(cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))),
      },
      customer_email: undefined, // bude nastavené po autentifikácii
      locale: 'sk',
      currency: 'eur',
    });

    if (!session.url) {
      throw new Error('Nepodarilo sa vytvoriť checkout session');
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Checkout error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Nepodarilo sa vytvoriť checkout session' 
    };
  }
}

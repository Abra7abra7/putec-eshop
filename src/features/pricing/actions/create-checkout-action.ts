'use server';

import { getSession } from '@/features/account/controllers/get-session';
import { ProductWithPrices } from '@/features/pricing/types';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

interface CartItem extends ProductWithPrices {
  quantity: number;
}

export async function createCheckoutAction({ cartItems }: { cartItems: CartItem[] }): Promise<{ checkoutUrl?: string; error?: string; redirectTo?: string }> {
  const session = await getSession();

  if (cartItems.length === 0) {
    return { error: 'Cart is empty' };
  }

  const line_items = cartItems.map((item) => ({
    price: item.prices[0].id,
    quantity: item.quantity,
  }));

  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items,
    mode: 'payment',
    invoice_creation: { enabled: true },
    allow_promotion_codes: true,
    success_url: `${getURL()}/?success=true`,
    cancel_url: `${getURL()}/cart`,
    ...(session?.user
      ? { client_reference_id: session.user.id, metadata: { userId: session.user.id } }
      : { metadata: { userId: null } }),
  });

  if (!checkoutSession || !checkoutSession.url) {
    throw Error('checkoutSession is not defined');
  }

  // 4. Redirect to checkout url
  return { checkoutUrl: checkoutSession.url };
}

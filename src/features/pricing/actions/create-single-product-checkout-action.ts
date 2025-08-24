'use server';

import { getSession } from '@/features/account/controllers/get-session';
import { ProductWithPrices } from '@/features/pricing/types';
import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { getURL } from '@/utils/get-url';

export async function createSingleProductCheckoutAction({
  product,
}: {
  product: ProductWithPrices;
}): Promise<{ checkoutUrl?: string; error?: string }> {
  const session = await getSession();

  if (!product.prices?.[0]?.id) {
    return { error: 'Product price is not available.' };
  }

  const line_items = [
    {
      price: product.prices[0].id,
      quantity: 1,
    },
  ];

  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: `${getURL()}/?success=true`,
    cancel_url: `${getURL()}/`,
    ...(session?.user
      ? { client_reference_id: session.user.id, metadata: { userId: session.user.id } }
      : { metadata: { userId: null } }),
  });

  if (!checkoutSession || !checkoutSession.url) {
    return { error: 'Could not create checkout session.' };
  }

  return { checkoutUrl: checkoutSession.url };
}

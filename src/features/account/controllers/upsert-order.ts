import Stripe from 'stripe';

import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

const getUserIdByCustomerId = async (customerId: string) => {
  const { data, error } = await supabaseAdminClient
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error) {
    console.error('Error fetching user ID for customer:', error.message);
    throw new Error(`Could not find user for customer ${customerId}`);
  }

  return data.id;
};

export const upsertOrder = async (checkoutSession: Stripe.Checkout.Session) => {
  if (checkoutSession.mode !== 'payment' || !checkoutSession.customer) {
    return;
  }

  const userId = await getUserIdByCustomerId(checkoutSession.customer as string);

  const orderData = {
    user_id: userId,
    amount_total: checkoutSession.amount_total,
    currency: checkoutSession.currency,
    status: checkoutSession.payment_status,
    stripe_checkout_session_id: checkoutSession.id,
  };

  const { data: order, error: orderError } = await supabaseAdminClient
    .from('orders')
    .insert(orderData)
    .select('id')
    .single();

  if (orderError) {
    console.error('Error inserting order:', orderError.message);
    throw new Error('Could not insert order');
  }

  const lineItems = await stripeAdmin.checkout.sessions.listLineItems(checkoutSession.id);

  const orderItemsData = lineItems.data.map((item) => ({
    order_id: order.id,
    product_id: item.price?.product as string,
    price_id: item.price?.id as string,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabaseAdminClient.from('order_items').insert(orderItemsData);

  if (itemsError) {
    console.error('Error inserting order items:', itemsError.message);
    throw new Error('Could not insert order items');
  }

  console.log(`Order ${order.id} created successfully for user ${userId}.`);
};

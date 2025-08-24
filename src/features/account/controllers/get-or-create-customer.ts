import { stripeAdmin } from '@/libs/stripe/stripe-admin';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export async function getOrCreateCustomer({ userId, email }: { userId: string | null; email: string }) {
  // If the user is not logged in, we'll create a new customer in Stripe
  if (!userId || userId === '') {
    const customer = await stripeAdmin.customers.create({ email });
    return customer.id;
  }

  // If the user is logged in, try to find an existing customer
  const { data, error } = await supabaseAdminClient.from('customers').select('stripe_customer_id').eq('id', userId).single();

  // If there's an error or the customer doesn't exist, create one
  if (error || !data?.stripe_customer_id) {
    const customerData = {
      email,
      metadata: {
        userId,
      },
    } as const;

    const customer = await stripeAdmin.customers.create(customerData);

    // Insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdminClient
      .from('customers')
      .insert([{ id: userId, stripe_customer_id: customer.id }]);

    if (supabaseError) {
      throw supabaseError;
    }

    return customer.id;
  }

  // Return the existing customer ID
  return data.stripe_customer_id;
}

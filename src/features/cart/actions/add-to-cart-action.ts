'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/features/account/controllers/get-session';
import { Price } from '@/features/pricing/types';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';

export async function addToCartAction({ price }: { price: Price }): Promise<{ error?: string; success?: boolean; redirectTo?: string }> {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();

  if (!session?.user) {
    return { redirectTo: `${getURL()}/login` };
  }

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', session.user.id)
    .eq('price_id', price.id)
    .single();

    if (!price.product_id) {
    return { error: 'Product ID is missing' };
  }

  if (existingItem) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + 1 })
      .eq('id', existingItem.id);

    if (error) {
      return { error: 'Could not update cart item' };
    }
  } else {
    const { error } = await supabase.from('cart_items').insert([
      {
        user_id: session.user.id,
        product_id: price.product_id,
        price_id: price.id,
        quantity: 1,
      },
    ]);

    if (error) {
      return { error: 'Could not add to cart' };
    }
  }

  revalidatePath('/');
  revalidatePath('/cart');

  return { success: true };
}

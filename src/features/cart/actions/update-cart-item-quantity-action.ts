'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/features/account/controllers/get-session';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function updateCartItemQuantityAction({ itemId, quantity }: { itemId: number; quantity: number }) {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Not authenticated' };
  }

  if (quantity < 1) {
    return { error: 'Quantity cannot be less than 1' };
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', session.user.id);

  if (error) {
    return { error: 'Could not update cart item quantity' };
  }

  revalidatePath('/cart');

  return { success: true };
}

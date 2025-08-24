'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/features/account/controllers/get-session';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function removeCartItemAction({ itemId }: { itemId: number }) {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', session.user.id);

  if (error) {
    return { error: 'Could not remove cart item' };
  }

  revalidatePath('/cart');

  return { success: true };
}

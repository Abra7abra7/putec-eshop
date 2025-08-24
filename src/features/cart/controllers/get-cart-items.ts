'use server';

import { getSession } from '@/features/account/controllers/get-session';
import { CartItemWithDetails } from '@/features/cart/types';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function getCartItems(): Promise<CartItemWithDetails[]> {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();

  if (!session?.user) {
    return [];
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*), prices(*)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cart items:', error.message);
    return [];
  }

  return data || [];
}

'use server';

import { getSession } from '@/features/account/controllers/get-session';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { Order } from '@/features/account/types';

export async function getOrders(): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  const session = await getSession();

  if (!session?.user) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*, prices(*)))')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }

  return data || [];
}

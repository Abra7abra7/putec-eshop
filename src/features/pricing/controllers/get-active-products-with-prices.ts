'use server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

import { ProductWithPrices } from '../types';

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrices[]> => {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, prices!prices_product_id_fkey(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index');

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

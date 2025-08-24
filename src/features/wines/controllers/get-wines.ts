import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import type { ProductWithPrices } from '../types';

export async function getWines(): Promise<ProductWithPrices[]> {
  const supabase = await createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      wine_category: wine_categories(name, color),
      prices(*)
    `)
    .eq('active', true)
    .order('name');

  if (error) {
    console.error('Error fetching wines:', error);
    return [];
  }

  return products || [];
}

export async function getWineById(id: string): Promise<ProductWithPrices | null> {
  const supabase = await createSupabaseServerClient();

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      wine_category: wine_categories(name, color),
      prices(*)
    `)
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching wine:', error);
    return null;
  }

  return product;
}

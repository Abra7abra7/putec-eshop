import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/product-form';

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return notFound();
  }

  return product;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditProductPage({ params }: any) {
  const product = await getProduct(params.id);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upraviť produkt</h1>
        <p className="text-gray-500">Aktualizujte údaje o existujúcom produkte.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}

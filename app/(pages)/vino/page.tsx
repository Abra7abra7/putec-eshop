import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { Product } from '@/lib/types';

export default async function VinoPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return <p className="text-center text-red-500">Nastala chyba pri načítaní produktov.</p>;
  }

  if (!products || products.length === 0) {
    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold mb-8">Naša ponuka vín</h1>
            <p className="text-center">Momentálne nemáme v ponuke žiadne vína.</p>
        </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Naša ponuka vín</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {(products as Product[]).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
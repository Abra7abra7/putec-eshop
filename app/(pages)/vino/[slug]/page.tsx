import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '../../../../components/products/add-to-cart-button';

export const dynamic = 'force-dynamic'; // Vynúti dynamické renderovanie

// Funkcia na načítanie produktu podľa slug
async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

// Komponent stránky
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <p className="text-2xl font-semibold text-red-600 mb-4">{product.price.toFixed(2)} €</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <AddToCartButton product={product} />

        </div>
      </div>
    </div>
  );
}

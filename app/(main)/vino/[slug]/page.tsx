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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductDetailPage({ params }: { params: any }) {
  const slug = params.slug as string;
  const product = await getProductBySlug(slug);

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

          <div className="border-t pt-4 mt-4 mb-6 space-y-4">
            {product.rocnik && (
              <p className="text-sm text-gray-800">
                <strong>Ročník:</strong> {product.rocnik}
              </p>
            )}
            {product.wine_region && (
              <p className="text-sm text-gray-800">
                <strong>Vinohradnícka oblasť:</strong> {product.wine_region}
              </p>
            )}
            {product.alcohol_percentage && (
              <p className="text-sm text-gray-800">
                <strong>Alkohol:</strong> {product.alcohol_percentage}%
              </p>
            )}
            {product.farba_vina && (
              <p className="text-sm text-gray-800">
                <strong>Farba:</strong> {product.farba_vina.charAt(0).toUpperCase() + product.farba_vina.slice(1)}
              </p>
            )}
            {product.zvyskovy_cukor && (
              <p className="text-sm text-gray-800">
                <strong>Zvyškový cukor:</strong> {product.zvyskovy_cukor.charAt(0).toUpperCase() + product.zvyskovy_cukor.slice(1)}
              </p>
            )}
            {product.residual_sugar && (
              <p className="text-sm text-gray-800">
                <strong>Zvyškový cukor:</strong> {product.residual_sugar}
              </p>
            )}
            {product.acids && (
              <p className="text-sm text-gray-800">
                <strong>Kyseliny:</strong> {product.acids} g/l
              </p>
            )}
            {product.volume && (
              <p className="text-sm text-gray-800">
                <strong>Objem:</strong> {product.volume} l
              </p>
            )}
            {product.farba_popis && (
              <p className="text-sm text-gray-800">
                <strong>Popis farby:</strong> {product.farba_popis}
              </p>
            )}
            {product.vona && (
              <p className="text-sm text-gray-800">
                <strong>Vôňa:</strong> {product.vona}
              </p>
            )}
            {product.chut && (
              <p className="text-sm text-gray-800">
                <strong>Chuť:</strong> {product.chut}
              </p>
            )}
            {product.ean && (
              <p className="text-sm text-gray-800">
                <strong>EAN:</strong> {product.ean}
              </p>
            )}
            {product.attributes && (
              <div className="text-sm text-gray-800">
                <strong>Zatriedenie:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {value as string}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <AddToCartButton product={product} />

        </div>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteProductButton } from './_components/delete-product-button';
import { PlusCircle } from 'lucide-react';

async function getProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Správa produktov</h1>
        <Link href="/admin/products/new" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Pridať nový produkt
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrázok</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Názov</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Akcie</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">Bez obrázku</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price} €</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
                  </Button>
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import UploadForm from './_components/upload-form';

async function getProducts() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return products;
}

export default async function UploadPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nahrávanie produktových obrázkov</h1>
      <div className="max-w-2xl mx-auto">
        <UploadForm products={products} />
      </div>
    </div>
  );
}

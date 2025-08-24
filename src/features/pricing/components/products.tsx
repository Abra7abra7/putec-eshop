import { getActiveProductsWithPrices } from '@/features/pricing/controllers/get-active-products-with-prices';
import { ProductCard } from './product-card';

export async function Products() {
  const products = await getActiveProductsWithPrices();

  return (
    <section id='produkty' className='w-full bg-black py-20'>
      <div className='container mx-auto'>
        <h2 className='text-center text-4xl font-bold text-white'>Naša Ponuka</h2>
        <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// Definovanie typov pre parametre vyhľadávania
interface VinoPageProps {
  searchParams: {
    typ?: 'biele' | 'cervene' | 'ruzove';
  };
}

export default async function VinoPage({ searchParams }: VinoPageProps) {
  const supabase = await createClient();
  const { typ } = searchParams;

  // Vytvorenie query s počiatočným filtrom
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  // Ak je zadaný typ, pridáme ďalší filter
  if (typ) {
    query = query.eq('category', typ);
  }

  // Zoradenie výsledkov
  query = query.order('name', { ascending: true });

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    // Zobrazenie chybovej hlášky v novom dizajne
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Oops!</h2>
        <p className="text-muted-foreground mt-2">Nastala chyba pri načítaní produktov.</p>
      </div>
    );
  }

  const filters = [
    { label: 'Všetky', value: undefined },
    { label: 'Biele', value: 'biele' },
    { label: 'Červené', value: 'cervene' },
    { label: 'Ružové', value: 'ruzove' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/degustacie/dubove-sudy.webp"
          alt="Pivnica plná sudov s vínom"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Naša ponuka vín</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Objavte plody našej práce – vína s jedinečným charakterom a dušou nášho vinárstva.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Filter Controls */}
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-12 flex-wrap">
            {filters.map(filter => (
              <Link 
                key={filter.label}
                href={filter.value ? `/vino?typ=${filter.value}` : '/vino'}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'transition-all',
                  (typ === filter.value || (!typ && !filter.value)) 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                    : 'bg-transparent'
                )}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {(products as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">Žiadne vína sa nenašli</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Skúste, prosím, zvoliť inú kategóriu alebo sa pozrite neskôr. Priebežne dopĺňame našu ponuku.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
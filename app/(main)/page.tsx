import { Hero } from "@/components/hero";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";

export default async function Home() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("Error fetching products:", error);
    // Handle error appropriately
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-1 flex-col gap-16 max-w-6xl px-4 py-16 lg:py-24">
        <Hero />
        <section id="products-section">
          <h2 className="text-2xl font-bold text-center mb-8">
            Naša ponuka
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

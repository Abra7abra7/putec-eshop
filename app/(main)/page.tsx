import { Hero } from "@/components/hero";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default async function Home() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4); // Znížil som počet na 4 pre čistejší vzhľad

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="flex w-full flex-col items-center">
      <Hero />

      {/* Sekcia s produktami */}
      <section id="products-section" className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Ochutnajte to najlepšie z našej pivnice
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              Vyberáme pre vás tie najkvalitnejšie vína, ktoré v sebe nesú pečať nášho terroir a poctivej práce.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/vino">Zobraziť všetky vína</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sekcia O nás */}
      <section className="w-full py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1557697199-4315e21419a4?q=80&w=1935&auto=format&fit=crop" 
              alt="Naše vinice" 
              layout="fill" 
              objectFit="cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Príbeh rodinného vinárstva</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Sme malé rodinné vinárstvo, kde sa tradícia a láska k vínu dedí z generácie na generáciu. Každá fľaša je výsledkom našej celoročnej starostlivosti, rešpektu k prírode a poctivej práce v pivnici. Naším cieľom je prinášať vám vína s jedinečným charakterom a dušou.
            </p>
            <Button asChild variant="outline" className="mt-6" size="lg">
              <Link href="/o-nas">Spoznajte nás viac</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sekcia Ubytovanie */}
      <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-last md:order-first">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Oddych s výhľadom na vinice</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Doprajte si dokonalý relax a prespite v našich útulných izbách priamo v srdci vinárstva. Prebuďte sa do tichého rána s pohľadom na nekonečné rady viniča a vychutnajte si pokojnú atmosféru, ktorú ponúka len naše rodinné sídlo.
            </p>
            <Button asChild variant="outline" className="mt-6" size="lg">
              <Link href="/ubytovanie">Preskúmať možnosti ubytovania</Link>
            </Button>
          </div>
          <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1585412727339-3490d9d68e8e?q=80&w=2070&auto=format&fit=crop" 
              alt="Ubytovanie v našom vinárstve" 
              layout="fill" 
              objectFit="cover"
            />
          </div>
        </div>
      </section>

      {/* Sekcia Zážitky */}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Nezabudnuteľné zážitky
            </h2>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
              U nás to nie je len o víne. Ponorte sa do sveta chutí na našich degustáciách alebo si doprajte oddych s výhľadom na vinice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/degustacie" className="block group relative rounded-xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop" alt="Degustácie" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
                <h3 className="text-white text-4xl font-bold tracking-tighter">Degustácie</h3>
              </div>
            </Link>
            <Link href="/ubytovanie" className="block group relative rounded-xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop" alt="Ubytovanie" layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
                <h3 className="text-white text-4xl font-bold tracking-tighter">Ubytovanie</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

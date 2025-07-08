import { Hero } from "@/components/hero";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/product-card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="flex w-full flex-col items-center">
      <Hero />

      {/* Sekcia s produktami */}
      <section id="products-section" className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Ochutnajte to najlepšie z našej pivnice
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
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
              <Link href="/vino">Zobraziť všetky vína <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sekcia O nás */}
      <section className="w-full py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-80 md:h-[450px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="/images/ubytovanie/dvor s kostolom.webp" 
              alt="Rodinné vinárstvo Pútec"
              fill 
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Príbeh Píše Tradícia a Vášeň</h2>
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
      <section className="w-full py-16 md:py-24 bg-background">
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
          <div className="relative w-full h-80 md:h-[450px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="/images/ubytovanie/Izba interier.webp" 
              alt="Ubytovanie vo vinárstve Pútec" 
              fill 
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Sekcia Zážitky */}
      <section className="w-full py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
              Nezabudnuteľné zážitky
            </h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              U nás to nie je len o víne. Ponorte sa do sveta chutí na našich degustáciách alebo si doprajte oddych s výhľadom na vinice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Degustácie Card */}
            <div className="bg-background rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="relative w-full h-64">
                <Image src="/images/degustacie/degustácia-x.webp" alt="Degustácia vo vinárstve" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-3xl font-bold text-primary mb-4">Degustácie</h3>
                <p className="text-muted-foreground flex-grow mb-6">Prehliadka pivnice s odborným výkladom a ochutnávka starostlivo vybraných vzoriek našich najobľúbenejších vín. Ideálne pre tých, ktorí sa chcú zoznámiť s našou produkciou.</p>
                <Button asChild size="lg" className="mt-auto">
                  <Link href="/degustacie">Zobraziť ponuku degustácií</Link>
                </Button>
              </div>
            </div>
            {/* Ubytovanie Card */}
            <div className="bg-background rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="relative w-full h-64">
                <Image src="/images/ubytovanie/Altánok.webp" alt="Ubytovanie vo vinárstve" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-3xl font-bold text-primary mb-4">Ubytovanie</h3>
                <p className="text-muted-foreground flex-grow mb-6">Prebuďte sa do tichého rána s pohľadom na nekonečné rady viniča a vychutnajte si pokojnú atmosféru nášho rodinného vinárstva v našich útulných izbách a apartmánoch.</p>
                <Button asChild size="lg" className="mt-auto">
                  <Link href="/ubytovanie">Preskúmať ubytovanie</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

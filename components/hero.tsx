import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
        Objavte svet kvalitných vín
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Prehliadnite si našu exkluzívnu kolekciu vín z najlepších svetových regiónov. Každá fľaša rozpráva svoj vlastný príbeh.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild size="lg" className="rounded-full">
          <Link href="#products-section">
            Zobraziť ponuku
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/o-nas">
            Náš príbeh
          </Link>
        </Button>
      </div>
    </div>
  );
}

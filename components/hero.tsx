import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src="/images/hero/hero.webp"
        alt="Vinice Pútec pri západe slnka"
        fill
        style={{ objectFit: 'cover' }}
        className="z-0"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-10" />
      <div className="relative z-20 px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
          Víno s dušou, príbeh v každej fľaši
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Sme rodinné vinárstvo, kde sa tradícia a láska k vínu dedí z generácie na generáciu. Objavte s nami poctivé vína s jedinečným charakterom.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="#products-section">
              Naše vína
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
            <Link href="/o-nas">
              Náš príbeh
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

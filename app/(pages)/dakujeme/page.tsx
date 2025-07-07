import Link from 'next/link';

export default function DakujemePage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Ďakujeme za Váš nákup!</h1>
      <p className="text-lg text-muted-foreground mb-8">Vaša objednávka bola úspešne prijatá a bude čoskoro spracovaná.</p>
      <Link href="/vino" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90">
        Pokračovať v nákupe
      </Link>
    </div>
  );
}

import { Products } from '@/features/pricing/components/products';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <div
        className='w-full bg-cover bg-center pt-48'
        style={{ backgroundImage: "url('/section-bg.png')" }}
      >
        <div className='container mx-auto flex flex-col items-center justify-center text-center'>
          <h1 className='text-5xl font-bold text-white md:text-7xl'>VÍNO S PRÍBEHOM</h1>
          <p className='mt-4 max-w-2xl text-lg text-white md:text-xl'>
            Objavte poctivé vína z nášho rodinného vinárstva, kde sa tradícia snúbi s moderným prístupom.
          </p>
        </div>
      </div>

      <Products />

      {/* Accommodation Section */}
      <div id='ubytovanie' className='w-full bg-zinc-900 py-20'>
        <div className='container mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white'>Ubytovanie v Srdci Viníc</h2>
          <p className='mt-4 max-w-3xl mx-auto text-lg text-zinc-300'>
            Zažite neopakovateľnú atmosféru nášho vinárstva a ubytujte sa v komfortných apartmánoch s výhľadom na vinice.
          </p>
          <a
            href='https://www.booking.com/hotel/sk/putec-apartmany.sk.html'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-8 inline-block rounded-md bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700'
          >
            Zistiť Viac a Rezervovať
          </a>
        </div>
      </div>
    </main>
  );
}


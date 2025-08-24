import { getWines } from '../controllers/get-wines';
import { WineCard } from './wine-card';

export async function Wines() {
  const wines = await getWines();

  if (wines.length === 0) {
    return (
      <section id='vina' className='w-full bg-black py-20'>
        <div className='container mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white'>Naše Vína</h2>
          <p className='mt-4 text-zinc-400'>Momentálne nemáme žiadne vína v ponuke.</p>
        </div>
      </section>
    );
  }

  return (
    <section id='vina' className='w-full bg-black py-20'>
      <div className='container mx-auto'>
        <h2 className='text-center text-4xl font-bold text-white'>Naše Vína</h2>
        <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {wines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </div>
    </section>
  );
}

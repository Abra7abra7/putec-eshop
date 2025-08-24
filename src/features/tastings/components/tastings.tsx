import { getTastingPackages, getAvailableTimeSlots } from '../controllers/get-tastings';
import { TastingsCalendar } from './tastings-calendar';

export async function Tastings() {
  const packages = await getTastingPackages();
  const timeSlots = await getAvailableTimeSlots();

  if (packages.length === 0) {
    return (
      <section id='degustacia' className='w-full bg-black py-20'>
        <div className='container mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white'>Degustácie</h2>
          <p className='mt-4 text-zinc-400'>Momentálne nemáme žiadne degustácie v ponuke.</p>
        </div>
      </section>
    );
  }

  return (
    <section id='degustacia' className='w-full bg-black py-20'>
      <div className='container mx-auto'>
        <h2 className='text-center text-4xl font-bold text-white mb-12'>Degustácie</h2>
        <TastingsCalendar packages={packages} timeSlots={timeSlots} />
      </div>
    </section>
  );
}

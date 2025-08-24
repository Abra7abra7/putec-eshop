import { redirect } from 'next/navigation';
import { CartView } from '@/features/cart/components/cart-view';

export default function CartPage() {
  return (
    <section className='py-xl'>
      <h1 className='text-4xl font-bold'>Váš nákupný košík</h1>
      <CartView />
    </section>
  );
}

import { CartView } from '@/features/cart/components/cart-view';

export default function CartPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between bg-black'>
      <div className='container mx-auto py-20'>
        <h1 className='mb-8 text-center text-4xl font-bold text-white'>Košík</h1>
        <div className='mx-auto max-w-4xl rounded-lg border border-zinc-700 bg-zinc-800'>
          <CartView />
        </div>
      </div>
    </main>
  );
}

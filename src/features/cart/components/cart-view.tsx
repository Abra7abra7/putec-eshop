'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/features/cart/store/use-cart-store';
import { createCheckoutAction } from '@/features/pricing/actions/create-checkout-action';

export function CartView() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cart.reduce((acc, item) => {
    return acc + (item.prices[0].unit_amount || 0) * item.quantity;
  }, 0);

    const handleCheckout = async () => {
    setIsLoading(true);
    const response = await createCheckoutAction({ cartItems: cart });

    if (response.redirectTo) {
      router.push(response.redirectTo);
      return;
    }

    if (response.checkoutUrl) {
      router.push(response.checkoutUrl);
      clearCart();
    } else if (response.error) {
      // TODO: Add toast notification for error
      console.error(response.error);
    }
    setIsLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className='mt-8 text-center'>
        <p className='text-lg'>Váš košík je prázdny.</p>
        <Button asChild className='mt-4'>
          <Link href='/'>Pokračovať v nákupe</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3'>
      <div className='lg:col-span-2'>
        <ul className='divide-y divide-zinc-700'>
          {cart.map((item) => (
            <li key={item.id} className='flex items-center gap-4 py-4'>
              <Image
                src={item.image || '/images/wine-placeholder.jpg'}
                alt={item.name || 'Obrázok produktu'}
                width={80}
                height={80}
                className='rounded-md'
              />
              <div className='flex-1'>
                <p className='font-semibold'>{item.name}</p>
                <p className='text-zinc-400'>€{(item.prices[0].unit_amount || 0) / 100}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                />
                <Button variant='outline' size='icon' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
              </div>
              <Button variant='destructive' onClick={() => removeFromCart(item.id)}>🗑️</Button>
            </li>
          ))}
        </ul>
      </div>
      <div className='rounded-lg border border-zinc-700 bg-zinc-800 p-6'>
        <h2 className='text-2xl font-bold'>Súhrn objednávky</h2>
        <div className='mt-4 flex justify-between'>
          <span>Medzisúčet</span>
          <span>€{subtotal / 100}</span>
        </div>
        <Button
          className='mt-6 w-full'
          variant='sexy'
          disabled={isLoading}
          onClick={handleCheckout}
        >
          {isLoading ? 'Spracúva sa...' : 'Pokračovať k platbe'}
        </Button>
      </div>
    </div>
  );
}

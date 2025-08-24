'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/store/use-cart-store';

import { createSingleProductCheckoutAction } from '../actions/create-single-product-checkout-action';
import { ProductWithPrices } from '../types';

interface ProductCardProps {
  product: ProductWithPrices;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    // TODO: Add toast notification for success
    console.log('Product added to cart');
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    const { checkoutUrl, error } = await createSingleProductCheckoutAction({ product });

    if (checkoutUrl) {
      router.push(checkoutUrl);
    } else if (error) {
      // TODO: Add toast notification for error
      console.error(error);
    }
    setIsBuyingNow(false);
  };

  return (
    <div className='flex flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800'>
      <div className='relative h-64 w-full'>
        <Image
          src={product.image || '/images/wine-placeholder.jpg'}
          alt={product.name || 'Obrázok produktu'}
          fill
          className='object-cover'
        />
      </div>
      <div className='flex flex-1 flex-col p-6'>
        <h3 className='text-2xl font-bold text-white'>{product.name || 'Názov produktu'}</h3>
        <p className='mt-2 text-zinc-400'>{product.description || 'Popis produktu...'}</p>
        <div className='mt-auto pt-6'>
          {product.prices?.length > 0 ? (
            <>
              <p className='text-3xl font-bold text-white'>
                €{(product.prices[0].unit_amount || 0) / 100}
              </p>
              <div className='mt-4 flex flex-col gap-2'>
                <Button onClick={handleAddToCart} variant='sexy' className='w-full'>
                  Pridať do košíka
                </Button>
                <Button onClick={handleBuyNow} variant='outline' className='w-full' disabled={isBuyingNow}>
                  {isBuyingNow ? 'Spracúva sa...' : 'Kúpiť hneď'}
                </Button>
              </div>
            </>
          ) : (
            <p className='text-zinc-400'>Cena nie je momentálne dostupná.</p>
          )}
        </div>
      </div>
    </div>
  );
}

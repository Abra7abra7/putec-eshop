'use client';

import Image from 'next/image';
import { ProductWithPrices } from '../types';
import { useCartStore } from '@/features/cart/store/use-cart-store';
import { useToast } from '@/components/ui/use-toast';

interface WineCardProps {
  wine: ProductWithPrices;
}

export function WineCard({ wine }: WineCardProps) {
  const price = wine.prices?.[0];
  const category = wine.wine_category;
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  return (
    <div className='flex flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800'>
      <div className='relative h-64 w-full'>
        <Image
          src={wine.image || 'https://via.placeholder.com/400x300/F4E4BC/722F37?text=Wine+Placeholder'}
          alt={wine.name}
          fill
          className='object-cover'
        />
        {category && (
          <div
            className='absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white'
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col p-6'>
        <h3 className='text-2xl font-bold text-white'>{wine.name}</h3>

        {wine.vintage && (
          <p className='mt-2 text-sm text-zinc-400'>Ročník: {wine.vintage}</p>
        )}

        {wine.region && (
          <p className='text-sm text-zinc-400'>Oblasť: {wine.region}</p>
        )}

        {wine.sweetness_level && (
          <p className='text-sm text-zinc-400'>Sladkosť: {wine.sweetness_level}</p>
        )}

        <p className='mt-3 text-zinc-400 line-clamp-3'>{wine.description}</p>

        <div className='mt-auto pt-6'>
          {price ? (
            <>
              <p className='text-3xl font-bold text-white'>
                €{(price.unit_amount || 0) / 100}
              </p>
              <div className='mt-4 flex flex-col gap-2'>
                <button 
                  className='w-full rounded-md bg-amber-600 px-4 py-2 font-semibold text-white transition hover:bg-amber-700'
                  onClick={() => {
                    addItem({
                      id: wine.id,
                      name: wine.name,
                      price: price?.unit_amount || 0,
                      image: wine.image,
                      wine_category: wine.wine_category?.name,
                      vintage: wine.vintage || undefined,
                      region: wine.region || undefined,
                    });
                    
                    toast({
                      title: "🍷 Víno pridané do košíka!",
                      description: `${wine.name} bolo úspešne pridané do košíka.`,
                      variant: "default",
                    });
                  }}
                >
                  Pridať do košíka
                </button>
                <button className='w-full rounded-md border border-zinc-600 px-4 py-2 font-semibold text-white transition hover:bg-zinc-700'>
                  Kúpiť hneď
                </button>
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

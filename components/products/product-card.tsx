'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCartStore, CartState } from '@/hooks/use-cart-store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const addItemToCart = useCartStore((state: CartState) => state.addItem);

  return (
    <div className="border rounded-lg overflow-hidden group">
      <Link href={`/vino/${product.id}`}>
        <div className="relative w-full h-64 bg-gray-200">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill={true}
              style={{objectFit: 'cover'}}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Obrázok nie je k dispozícii
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{product.year} | {product.wine_region}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold">{product.price.toFixed(2)} €</p>
          <Button onClick={() => addItemToCart(product)}>Do košíka</Button>
        </div>
      </div>
    </div>
  );
};
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCartStore, CartItem } from '@/hooks/use-cart-store';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { items, addItem, decreaseQuantity } = useCartStore();

  const cartItem = items.find((item: CartItem) => item.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} bol pridaný do košíka.`);
  };

  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="relative w-full h-64 bg-gray-200">
        {product.slug ? (
            <Link href={`/vino/${product.slug}`}>
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
            </Link>
        ) : (
            <>
                {product.image_url ? (
                    <Image
                    src={product.image_url}
                    alt={product.name}
                    fill={true}
                    style={{objectFit: 'cover'}}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Obrázok nie je k dispozícii
                    </div>
                )}
            </>
        )}
      </div>
      <div className="p-4">
        {product.slug ? (
          <Link href={`/vino/${product.slug}`}>
            <h3 className="text-lg font-semibold truncate hover:underline">{product.name}</h3>
          </Link>
        ) : (
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        )}
        <p className="text-sm text-muted-foreground mt-1">{product.year} | {product.wine_region}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold">{product.price.toFixed(2)} €</p>
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => decreaseQuantity(product.id)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-5 text-center">{cartItem.quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addItem(product)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddToCart}>Do košíka</Button>
          )}
        </div>
      </div>
    </div>
  );
};
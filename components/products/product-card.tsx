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
    <div className="bg-card text-card-foreground rounded-xl border flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <Link href={product.slug ? `/vino/${product.slug}` : '#'} className="block overflow-hidden">
        <div className="relative w-full aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Image
              src="/images/degustacie/degustačná-x.webp"
              alt="Záložný obrázok produktu"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-4">
          <p className="text-sm text-muted-foreground">{product.year} | {product.wine_region}</p>
          <h3 className="text-lg font-semibold truncate mt-1">
            <Link href={product.slug ? `/vino/${product.slug}` : '#'} className="transition-colors hover:text-primary">
              {product.name}
            </Link>
          </h3>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-2xl font-bold text-primary">{product.price.toFixed(2)} €</p>
          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => decreaseQuantity(product.id)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-6 text-center">{cartItem.quantity}</span>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => addItem(product)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={handleAddToCart} className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Do košíka
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
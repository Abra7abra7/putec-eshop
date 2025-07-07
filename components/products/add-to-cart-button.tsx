'use client';

import { useCartStore } from '@/hooks/use-cart-store';
import { Product } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { items, addItem, decreaseQuantity } = useCartStore();
  const cartItem = items.find((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} bol pridaný do košíka.`);
  };

  return (
    <div>
      {cartItem ? (
        <div className="flex items-center gap-4">
          <Button variant="outline" size="lg" onClick={() => decreaseQuantity(product.id)}>-</Button>
          <span className="text-xl font-semibold">{cartItem.quantity}</span>
          <Button variant="outline" size="lg" onClick={handleAddToCart}>+</Button>
        </div>
      ) : (
        <Button size="lg" onClick={handleAddToCart}>Do košíka</Button>
      )}
    </div>
  );
}

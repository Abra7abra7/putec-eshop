'use client';

import { useCartStore, CartItem } from '@/hooks/use-cart-store';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';

export default function KosikPage() {
  const { items, removeItem, clearCart, addItem, decreaseQuantity } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/pokladna');
  };

  const totalPrice = items.reduce((total: number, item: CartItem) => {
    return total + item.product.price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Váš košík</h1>
        <p>Váš nákupný košík je prázdny.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Váš košík</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-4">
                    {items.map(({ product, quantity }: CartItem) => (
            <div key={product.id} className="flex items-center justify-between border p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded">
                  {product.image_url && (
                    <Image src={product.image_url} alt={product.name} fill style={{objectFit: 'contain'}} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(product.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-4 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => addItem(product)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">{(product.price * quantity).toFixed(2)} €</p>
                <Button variant="destructive" size="sm" onClick={() => removeItem(product.id)}>
                  Odstrániť
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="border p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Súhrn objednávky</h2>
            <div className="flex justify-between mb-2">
              <span>Medzisúčet</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Doprava</span>
              <span>Vypočíta sa v pokladni</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Celkom</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
                        <Button className="w-full mt-6" onClick={handleCheckout} disabled={items.length === 0}>
              Pokračovať do pokladne
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={clearCart}>Vyprázdniť košík</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

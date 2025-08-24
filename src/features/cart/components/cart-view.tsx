'use client';

import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '../store/use-cart-store';
import { Button } from '@/components/ui/button';

export function CartView() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-zinc-400" />
        <h3 className="mt-4 text-lg font-medium text-white">Košík je prázdny</h3>
        <p className="mt-2 text-sm text-zinc-400">
          Pridajte si vína do košíka a začnite nakupovať.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between border-b border-zinc-700 pb-4">
        <h3 className="text-lg font-medium text-white">Košík ({items.length} položiek)</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-zinc-400 hover:text-white"
        >
          Vyčistiť
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-lg border border-zinc-700 p-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded object-cover"
              />
            )}
            
            <div className="flex-1">
              <h4 className="font-medium text-white">{item.name}</h4>
              {item.vintage && (
                <p className="text-sm text-zinc-400">Ročník: {item.vintage}</p>
              )}
              {item.region && (
                <p className="text-sm text-zinc-400">Oblasť: {item.region}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center text-white">{item.quantity}</span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <p className="font-medium text-white">
                €{((item.price * item.quantity) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-zinc-400">
                €{(item.price / 100).toFixed(2)} / ks
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-zinc-700 pt-4">
        <div className="flex items-center justify-between text-lg font-medium text-white">
          <span>Celková suma:</span>
          <span>€{(getTotalPrice() / 100).toFixed(2)}</span>
        </div>
        
        <div className="mt-4 space-y-2">
          <Button className="w-full bg-amber-600 hover:bg-amber-700">
            Pokračovať v objednávke
          </Button>
          <Button variant="outline" className="w-full">
            Pokračovať v nákupe
          </Button>
        </div>
      </div>
    </div>
  );
}

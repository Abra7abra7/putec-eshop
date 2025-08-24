'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/use-cart-store';

export function CartIcon() {
  const totalItems = useCartStore(state => state.getTotalItems());

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-white" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}

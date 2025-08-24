'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ShoppingCart } from 'lucide-react';

import { useCartStore } from '@/features/cart/store/use-cart-store';

export function CartIcon() {
  const cart = useCartStore((state) => state.cart);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!isMounted) {
    return null;
  }

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-white" />
      {totalQuantity > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}

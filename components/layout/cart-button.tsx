'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/use-cart-store';

export const CartButton = () => {
  const { items } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <Button variant="ghost" size="icon" disabled>
            <ShoppingCart className="h-5 w-5" />
        </Button>
    );
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/kosik">
      <Button variant="ghost" size="icon" className="relative">
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
            {totalItems}
          </span>
        )}
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Nákupný košík</span>
      </Button>
    </Link>
  );
};

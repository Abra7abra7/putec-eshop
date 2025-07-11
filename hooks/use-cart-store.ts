import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/types';

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        const currentItems = get().items;
                const existingItem = currentItems.find((item: CartItem) => item.product.id === product.id);

        if (existingItem) {
          set({
                        items: currentItems.map((item: CartItem) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }] });
        }
      },
      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item: CartItem) => item.product.id !== productId),
        });
      },
      decreaseQuantity: (productId: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === productId);

        if (existingItem && existingItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          // Odstráni položku, ak je jej množstvo 1
          set({
            items: currentItems.filter((item) => item.product.id !== productId),
          });
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { Price, Product } from '@/features/pricing/types';

export interface CartItem {
  id: number;
  user_id: string;
  product_id: string;
  price_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithDetails {
  id: number;
  user_id: string;
  product_id: string;
  price_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  products: Product;
  prices: Price;
}

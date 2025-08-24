import { CartItemWithDetails } from '@/features/cart/types';

export interface Order {
  id: number;
  user_id: string;
  created_at: string;
  total_amount: number;
  currency: string;
  status: string;
  stripe_checkout_id: string;
  order_items: OrderItem[];
}

export interface OrderItem extends CartItemWithDetails {}

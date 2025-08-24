import { Tables } from '@/libs/supabase/types';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

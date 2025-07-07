// Tento súbor bude obsahovať TypeScript typy pre dáta z databázy.

export type Product = {
  id: string; // uuid
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  name: string; // text
  slug: string; // text
  description: string | null; // text
  price: number; // numeric(10, 2)
  stock: number; // integer
  sku: string; // text
  image_url: string | null; // text
  gallery_urls: string[] | null; // text[]
  is_active: boolean; // boolean
  category_id: string | null; // uuid
  year: number | null; // integer
  wine_region: string | null; // text
  alcohol_percentage: number | null; // numeric(4, 1)
  attributes: Record<string, unknown> | null; // jsonb
};

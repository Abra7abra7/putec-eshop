// Definuje štruktúru dát pre produkt v celej aplikácii.
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
  rocnik: number | null; // integer (pôvodne 'year')
  wine_region: string | null; // text
  alcohol_percentage: number | null; // numeric(4, 1)
  attributes: Record<string, unknown> | null; // jsonb

  // Doplnené špecifické polia pre víno
  farba_vina?: string | null;
  zvyskovy_cukor?: string | null;
  vona?: string | null;
  chut?: string | null;
  farba_popis?: string | null;
  ean?: string | null;
};

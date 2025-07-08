// Definuje štruktúru dát pre produkt v celej aplikácii.
export type Product = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  gallery_urls: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string | null;
  stock: number | null;
  sku: string | null;
  year: number | null;
  wine_region: string | null;
  alcohol_percentage: number | null;
  attributes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  rocnik: number | null; // Duplicitné, ponechané pre prípadnú spätnú kompatibilitu
  farba_vina: string | null;
  zvyskovy_cukor: string | null;
  vona: string | null;
  chut: string | null;
  farba_popis: string | null;
  ean: string | null;
};

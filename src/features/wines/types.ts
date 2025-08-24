export interface WineProduct {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
  image: string | null;
  metadata: any;
  wine_category_id: number | null;
  vintage: number | null;
  region: string | null;
  alcohol_content: number | null;
  sweetness_level: string | null;
  gs1_code: string | null;
  stock_quantity: number;
  wine_category?: WineCategory;
  prices?: Price[];
}

export interface WineCategory {
  id: number;
  name: string;
  color: string;
}

export interface Price {
  id: string;
  product_id: string;
  active: boolean;
  description: string | null;
  unit_amount: number | null;
  currency: string;
  type: string;
  metadata: any;
}

export interface ProductWithPrices extends WineProduct {
  prices: Price[];
}

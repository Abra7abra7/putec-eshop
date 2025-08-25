export interface WineFormData {
  // Základné informácie
  name: string;
  category: 'red_wine' | 'white_wine' | 'rose_wine';
  quality: string;
  region: string;
  designation?: string;
  vintage: string;
  
  // Senzorické vlastnosti
  color: string;
  aroma: string;
  taste: string;
  servingTemp: string;
  
  // Technické údaje
  batch: string;
  fillingDate: string;
  acidity: string;
  residualSugar: string;
  sugar: string;
  alcohol: string;
  storageTemp: string;
  sulfites: boolean;
  
  // Výroba
  producer: string;
  address: string;
  gs1Code: string;
  country: string;
  
  // Obchodné informácie
  price: number;
  stockQuantity: number;
  active: boolean;
  images: string[];
}

export interface AdminWineProduct {
  id: string;
  stripe_id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, any>;
  image?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface AdminWinePrice {
  id: string;
  stripe_id: string;
  product_id: string;
  currency: string;
  unit_amount: number;
  active: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AdminWineWithPrice extends AdminWineProduct {
  prices: AdminWinePrice[];
}

// Image upload types
export interface ImageUploadData {
  file: File;
  preview: string;
  uploadProgress: number;
  isUploading: boolean;
  error?: string;
}

export interface SupabaseImageUpload {
  path: string;
  url: string;
  size: number;
  mimeType: string;
}

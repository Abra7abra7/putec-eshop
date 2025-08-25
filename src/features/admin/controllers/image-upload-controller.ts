'use server';

import { createClient } from '@supabase/supabase-js';
import type { SupabaseImageUpload } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function uploadWineImage(
  file: File,
  wineName: string
): Promise<{ success: boolean; data?: SupabaseImageUpload; error?: string }> {
  try {
    console.log('🖼️ Uploadujem obrázok pre víno:', wineName);
    
    // Validácia súboru
    if (!file) {
      return { success: false, error: 'Žiadny súbor na upload' };
    }
    
    // Kontrola veľkosti (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'Súbor je príliš veľký. Maximálna veľkosť je 5MB.' };
    }
    
    // Kontrola typu súboru
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Nepodporovaný typ súboru. Povolené sú: JPEG, PNG, WebP.' };
    }
    
    // Generovanie unikátneho názvu súboru
    const timestamp = Date.now();
    const sanitizedName = wineName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${sanitizedName}-${timestamp}.${fileExtension}`;
    const filePath = `wines/${fileName}`;
    
    console.log('📁 Uploadujem súbor:', filePath);
    
    // Upload do Supabase Storage
    const { data, error } = await supabase.storage
      .from('wine-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Chyba pri uploadu:', error);
      return { success: false, error: `Upload zlyhal: ${error.message}` };
    }
    
    // Získať public URL
    const { data: urlData } = supabase.storage
      .from('wine-images')
      .getPublicUrl(filePath);
    
    if (!urlData.publicUrl) {
      return { success: false, error: 'Nepodarilo sa získať public URL' };
    }
    
    const uploadResult: SupabaseImageUpload = {
      path: filePath,
      url: urlData.publicUrl,
      size: file.size,
      mimeType: file.type
    };
    
    console.log('✅ Obrázok úspešne uploadovaný:', uploadResult.url);
    
    return { 
      success: true, 
      data: uploadResult 
    };
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba pri uploadu:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Neočakávaná chyba pri uploadu' 
    };
  }
}

export async function deleteWineImage(imagePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🗑️ Mažem obrázok:', imagePath);
    
    const { error } = await supabase.storage
      .from('wine-images')
      .remove([imagePath]);
    
    if (error) {
      console.error('❌ Chyba pri mazaní obrázka:', error);
      return { success: false, error: `Mazanie zlyhalo: ${error.message}` };
    }
    
    console.log('✅ Obrázok úspešne vymazaný:', imagePath);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba pri mazaní:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Neočakávaná chyba pri mazaní' 
    };
  }
}

export async function getWineImageUrl(imagePath: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from('wine-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl || null;
  } catch (error) {
    console.error('❌ Chyba pri získavaní URL:', error);
    return null;
  }
}

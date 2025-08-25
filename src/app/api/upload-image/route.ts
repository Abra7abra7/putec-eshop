import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const wineName = formData.get('wineName') as string;

    if (!file || !wineName) {
      return NextResponse.json(
        { success: false, error: 'Chýba súbor alebo názov vína' },
        { status: 400 }
      );
    }

    console.log('🖼️ Uploadujem obrázok pre víno:', wineName);
    console.log('📁 Súbor:', file.name, file.size, file.type);

    // Validácia súboru
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Nepodporovaný typ súboru. Povolené sú: JPEG, PNG, WebP.' },
        { status: 400 }
      );
    }

    // Kontrola veľkosti (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Súbor je príliš veľký. Maximálna veľkosť je 5MB.' },
        { status: 400 }
      );
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
    
    // Konverzia File na Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload do Supabase Storage
    const { data, error } = await supabase.storage
      .from('wine-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('❌ Chyba pri uploadu:', error);
      return NextResponse.json(
        { success: false, error: `Upload zlyhal: ${error.message}` },
        { status: 500 }
      );
    }
    
    // Získať public URL
    const { data: urlData } = supabase.storage
      .from('wine-images')
      .getPublicUrl(filePath);
    
    if (!urlData.publicUrl) {
      return NextResponse.json(
        { success: false, error: 'Nepodarilo sa získať public URL' },
        { status: 500 }
      );
    }
    
    console.log('✅ Obrázok úspešne uploadovaný:', urlData.publicUrl);
    
    return NextResponse.json({
      success: true,
      data: {
        path: filePath,
        url: urlData.publicUrl,
        size: file.size,
        mimeType: file.type
      }
    });
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba pri uploadu:', error);
    return NextResponse.json(
      { success: false, error: 'Neočakávaná chyba pri uploadu' },
      { status: 500 }
    );
  }
}

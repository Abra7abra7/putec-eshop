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

export async function DELETE(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: 'Chýba imagePath' },
        { status: 400 }
      );
    }

    console.log('🗑️ Mažem obrázok:', imagePath);
    
    const { error } = await supabase.storage
      .from('wine-images')
      .remove([imagePath]);
    
    if (error) {
      console.error('❌ Chyba pri mazaní obrázka:', error);
      return NextResponse.json(
        { success: false, error: `Mazanie zlyhalo: ${error.message}` },
        { status: 500 }
      );
    }
    
    console.log('✅ Obrázok úspešne vymazaný:', imagePath);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba pri mazaní:', error);
    return NextResponse.json(
      { success: false, error: 'Neočakávaná chyba pri mazaní' },
      { status: 500 }
    );
  }
}

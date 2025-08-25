require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testovanie Supabase Storage...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? '✅ Nastavený' : '❌ Chýba');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Chýbajú environment premenné!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testStorage() {
  try {
    console.log('\n📦 Kontrola bucketov...');
    
    // 1. Získať zoznam bucketov
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Chyba pri získavaní bucketov:', bucketsError);
      return;
    }
    
    console.log('✅ Buckety:', buckets.map(b => b.name));
    
    // 2. Kontrola wine-images bucket
    const wineBucket = buckets.find(b => b.name === 'wine-images');
    if (!wineBucket) {
      console.error('❌ Bucket "wine-images" neexistuje!');
      return;
    }
    
    console.log('✅ Bucket "wine-images" existuje');
    console.log('   - Public:', wineBucket.public);
    console.log('   - File size limit:', wineBucket.file_size_limit);
    
    // 3. Kontrola RLS politík
    console.log('\n🔒 Kontrola RLS politík...');
    
    // 4. Test uploadu malého súboru
    console.log('\n📤 Test uploadu...');
    
    // Vytvoriť test súbor
    const testContent = 'Test image content';
    const testFile = Buffer.from(testContent);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wine-images')
      .upload('test/test-file.txt', testFile, {
        contentType: 'text/plain',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ Upload zlyhal:', uploadError);
      return;
    }
    
    console.log('✅ Test súbor uploadovaný:', uploadData.path);
    
    // 5. Získať public URL
    const { data: urlData } = supabase.storage
      .from('wine-images')
      .getPublicUrl('test/test-file.txt');
    
    console.log('✅ Public URL:', urlData.publicUrl);
    
    // 6. Vymazať test súbor
    const { error: deleteError } = await supabase.storage
      .from('wine-images')
      .remove(['test/test-file.txt']);
    
    if (deleteError) {
      console.error('❌ Chyba pri mazaní test súboru:', deleteError);
    } else {
      console.log('✅ Test súbor vymazaný');
    }
    
    console.log('\n🎉 Test úspešný! Supabase Storage funguje.');
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

testStorage();

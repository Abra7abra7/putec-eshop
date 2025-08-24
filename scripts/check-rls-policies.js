require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkRLSPolicies() {
  try {
    console.log('🔒 Kontrolujem RLS politiky...');
    
    // Najprv získať skutočné session ID
    console.log('📅 Hľadám dostupné termíny...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('tasting_sessions')
      .select('id, start_time, status')
      .limit(5);
    
    if (sessionsError) {
      console.error('❌ Chyba pri načítaní termínov:', sessionsError);
      return;
    }
    
    if (!sessions || sessions.length === 0) {
      console.log('⚠️  Žiadne termíny nenájdené');
      return;
    }
    
    console.log('📋 Dostupné termíny:', sessions);
    
    // Použiť prvý dostupný termín
    const testSessionId = sessions[0].id;
    console.log(`🧪 Používam session ID: ${testSessionId}`);
    
    // Testovať vloženie záznamu
    const testData = {
      session_id: testSessionId,
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '+421123456789',
      number_of_people: 1,
      special_requests: 'Test request',
      total_price: 2500,
      status: 'pending'
    };
    
    console.log('🧪 Testujem vloženie záznamu...');
    const { data: insertResult, error: insertError } = await supabase
      .from('tasting_bookings')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Chyba pri vložení:', insertError);
      
      // Skontrolovať RLS status
      console.log('🔒 Kontrolujem RLS status...');
      const { data: rlsData, error: rlsError } = await supabase
        .from('tasting_bookings')
        .select('*')
        .limit(1);
      
      if (rlsError) {
        console.error('❌ RLS chyba:', rlsError);
      } else {
        console.log('✅ RLS funguje, môžeme čítať:', rlsData);
      }
    } else {
      console.log('✅ Test vloženia úspešný:', insertResult);
      
      // Vymazať test záznam
      const { error: deleteError } = await supabase
        .from('tasting_bookings')
        .delete()
        .eq('customer_email', 'test@example.com');
      
      if (deleteError) {
        console.log('⚠️  Nepodarilo sa vymazať test záznam:', deleteError);
      } else {
        console.log('🗑️  Test záznam vymazaný');
      }
    }
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

checkRLSPolicies();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testBooking() {
  try {
    console.log('🧪 Testujem vytvorenie rezervácie...');
    
    // 1. Získať dostupný termín
    const { data: sessions, error: sessionsError } = await supabase
      .from('tasting_sessions')
      .select('id, start_time, status, max_capacity, current_bookings')
      .eq('status', 'available')
      .limit(1);
    
    if (sessionsError || !sessions || sessions.length === 0) {
      console.error('❌ Žiadne dostupné termíny:', sessionsError);
      return;
    }
    
    const session = sessions[0];
    console.log('✅ Termín nájdený:', session);
    
    // 2. Získať degustáciu
    const { data: packages, error: packagesError } = await supabase
      .from('tasting_packages')
      .select('*')
      .eq('active', true)
      .limit(1);
    
    if (packagesError || !packages || packages.length === 0) {
      console.error('❌ Žiadne degustácie:', packagesError);
      return;
    }
    
    const package_ = packages[0];
    console.log('✅ Degustácia nájdená:', package_);
    
    // 3. Vytvoriť test rezerváciu
    const testFormData = {
      customer_name: 'Test User',
      customer_email: 'test@example.com',
      customer_phone: '+421123456789',
      number_of_people: 1,
      special_requests: 'Test request'
    };
    
    console.log('📝 Test form data:', testFormData);
    
    // 4. Vypočítať cenu
    const totalPrice = package_.price * testFormData.number_of_people;
    console.log('💰 Celková cena:', totalPrice);
    
    // 5. Vložiť rezerváciu
    const { data: booking, error: bookingError } = await supabase
      .from('tasting_bookings')
      .insert({
        session_id: session.id,
        customer_name: testFormData.customer_name,
        customer_email: testFormData.customer_email,
        customer_phone: testFormData.customer_phone,
        number_of_people: testFormData.number_of_people,
        special_requests: testFormData.special_requests,
        total_price: totalPrice,
        status: 'pending'
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error('❌ Chyba pri vytváraní rezervácie:', bookingError);
      return;
    }
    
    console.log('✅ Rezervácia vytvorená:', booking);
    
    // 6. Vymazať test rezerváciu
    const { error: deleteError } = await supabase
      .from('tasting_bookings')
      .delete()
      .eq('id', booking.id);
    
    if (deleteError) {
      console.log('⚠️  Nepodarilo sa vymazať test rezerváciu:', deleteError);
    } else {
      console.log('🗑️  Test rezervácia vymazaná');
    }
    
    console.log('🎉 Test úspešný! Všetko funguje správne.');
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

testBooking();

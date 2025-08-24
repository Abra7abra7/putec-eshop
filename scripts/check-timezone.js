require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkTimezone() {
  try {
    console.log('🌍 Kontrolujem časové pásmo databázy...');
    
    // Skontrolovať časové pásmo
    const { data: timezoneData, error: timezoneError } = await supabase
      .rpc('show_timezone');
    
    if (timezoneError) {
      console.log('ℹ️  Skúšam alternatívny spôsob...');
      
      // Alternatívny spôsob
      const { data, error } = await supabase
        .from('tasting_sessions')
        .select('start_time')
        .limit(1);
      
      if (error) {
        console.error('❌ Chyba pri načítaní:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const session = data[0];
        console.log('📅 Príklad termínu:', session.start_time);
        console.log('🕐 Lokálny čas:', new Date(session.start_time).toLocaleString('sk-SK'));
        console.log('🌍 UTC čas:', new Date(session.start_time).toISOString());
      }
    } else {
      console.log('⏰ Časové pásmo databázy:', timezoneData);
    }
    
    // Skontrolovať aktuálny čas databázy
    const { data: currentTimeData, error: currentTimeError } = await supabase
      .rpc('now');
    
    if (currentTimeError) {
      console.log('ℹ️  Skúšam alternatívny spôsob pre aktuálny čas...');
      
      // Vytvoriť test termín
      const testDate = new Date();
      const testTime = '10:00';
      const testTimestamp = (testDate.toISOString().split('T')[0] + ' ' + testTime + ':00') + '+02:00';
      
      console.log('🧪 Test timestamp:', testTimestamp);
      console.log('📅 Parsed date:', new Date(testTimestamp));
      console.log('🕐 Lokálny čas:', new Date(testTimestamp).toLocaleString('sk-SK'));
      
    } else {
      console.log('⏰ Aktuálny čas databázy:', currentTimeData);
    }
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

checkTimezone();

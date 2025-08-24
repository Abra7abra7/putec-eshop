require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function generateTastingSessions() {
  try {
    console.log('🍷 Generujem termíny pre degustácie...');
    
    // Spustiť funkciu pre generovanie termínov
    const { data, error } = await supabase.rpc('generate_available_sessions');
    
    if (error) {
      console.error('❌ Chyba pri generovaní termínov:', error);
      return;
    }
    
    console.log('✅ Termíny úspešne vygenerované!');
    
    // Overiť, koľko termínov bolo vytvorených
    const { data: sessions, error: sessionsError } = await supabase
      .from('tasting_sessions')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .lte('start_time', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
    
    if (sessionsError) {
      console.error('❌ Chyba pri načítaní termínov:', sessionsError);
      return;
    }
    
    console.log(`📅 Vytvorených ${sessions.length} termínov pre najbližších 30 dní`);
    
    // Zobraziť prvých 5 termínov
    if (sessions.length > 0) {
      console.log('\n📋 Prvých 5 termínov:');
      sessions.slice(0, 5).forEach(session => {
        const date = new Date(session.start_time);
        console.log(`   - ${date.toLocaleDateString('sk-SK')} ${date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })} (ID: ${session.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
  }
}

generateTastingSessions();

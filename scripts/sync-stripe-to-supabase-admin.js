require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncStripeToSupabase() {
  try {
    console.log('🔄 Začínam synchronizáciu Stripe → Supabase...');
    
    // 1. Získať všetky produkty zo Stripe
    console.log('📥 Načítavam produkty zo Stripe...');
    const products = await stripe.products.list({ limit: 100, active: true });
    console.log(`✅ Načítaných ${products.data.length} produktov zo Stripe`);
    
    // 2. Získať všetky ceny zo Stripe
    console.log('📥 Načítavam ceny zo Stripe...');
    const prices = await stripe.prices.list({ limit: 100, active: true });
    console.log(`✅ Načítaných ${prices.data.length} cien zo Stripe`);
    
    // 3. Synchronizovať každý produkt
    for (const product of products.data) {
      console.log(`\n🍷 Synchronizujem produkt: ${product.name} (${product.id})`);
      
      // Extrahovať metadáta
      const metadata = product.metadata;
      
      // Vytvoriť alebo aktualizovať produkt v Supabase
      const { error: productError } = await supabase
        .from('products')
        .upsert({
          stripe_id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          images: product.images,
          metadata: {
            wine_type: metadata.wine_type,
            vintage: metadata.vintage,
            region: metadata.region,
            quality: metadata.quality,
            designation: metadata.designation,
            color: metadata.color,
            aroma: metadata.aroma,
            taste: metadata.taste,
            serving_temp: metadata.serving_temp,
            batch: metadata.batch,
            filling_date: metadata.filling_date,
            acidity: metadata.acidity,
            residual_sugar: metadata.residual_sugar,
            sugar: metadata.sugar,
            alcohol: metadata.alcohol,
            storage_temp: metadata.storage_temp,
            sulfites: metadata.sulfites,
            producer: metadata.producer,
            address: metadata.address,
            gs1_code: metadata.gs1_code,
            country: metadata.country,
            inventory_quantity: metadata.inventory_quantity,
            inventory_type: metadata.inventory_type
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_id'
        });
      
      if (productError) {
        console.error(`❌ Chyba pri synchronizácii produktu ${product.name}:`, productError);
      } else {
        console.log(`✅ Produkt ${product.name} synchronizovaný`);
      }
    }
    
    // 4. Synchronizovať ceny
    console.log('\n💰 Synchronizujem ceny...');
    for (const price of prices.data) {
      console.log(`💵 Synchronizujem cenu: ${price.id} (${price.unit_amount} ${price.currency})`);
      
      const { error: priceError } = await supabase
        .from('prices')
        .upsert({
          stripe_id: price.id,
          product_id: price.product,
          currency: price.currency,
          unit_amount: price.unit_amount,
          active: price.active,
          metadata: price.metadata,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_id'
        });
      
      if (priceError) {
        console.error(`❌ Chyba pri synchronizácii ceny ${price.id}:`, priceError);
      } else {
        console.log(`✅ Cena ${price.id} synchronizovaná`);
      }
    }
    
    console.log('\n🎉 Synchronizácia dokončená!');
    
    // 5. Zobraziť súhrn
    const { data: supabaseProducts } = await supabase
      .from('products')
      .select('*');
    
    const { data: supabasePrices } = await supabase
      .from('prices')
      .select('*');
    
    console.log('\n📊 SÚHRN SYNCHRONIZÁCIE:');
    console.log(`Stripe produkty: ${products.data.length}`);
    console.log(`Stripe ceny: ${prices.data.length}`);
    console.log(`Supabase produkty: ${supabaseProducts?.length || 0}`);
    console.log(`Supabase ceny: ${supabasePrices?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Chyba pri synchronizácii:', error);
  }
}

// Spustiť synchronizáciu
syncStripeToSupabase();

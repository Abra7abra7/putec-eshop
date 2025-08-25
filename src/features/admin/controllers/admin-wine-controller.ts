'use server';

import Stripe from 'stripe';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import type { WineFormData, AdminWineWithPrice } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createWineProduct(wineData: WineFormData) {
  try {
    console.log('🍷 Vytváram nové víno:', wineData.name);
    console.log('🖼️ Obrázky pre produkt:', wineData.images);
    
    // 1. Vytvoriť Stripe Product (presne podľa API dokumentácie)
    const product = await stripe.products.create({
      name: wineData.name,
      description: `${wineData.name} - ${wineData.quality} víno z ${wineData.region}`,
      images: wineData.images && wineData.images.length > 0 ? wineData.images : undefined,
      metadata: {
        wine_type: wineData.category,
        vintage: wineData.vintage,
        region: wineData.region,
        quality: wineData.quality,
        designation: wineData.designation || '',
        color: wineData.color,
        aroma: wineData.aroma,
        taste: wineData.taste,
        serving_temp: wineData.servingTemp,
        batch: wineData.batch,
        filling_date: wineData.fillingDate,
        acidity: wineData.acidity,
        residual_sugar: wineData.residualSugar,
        sugar: wineData.sugar,
        alcohol: wineData.alcohol,
        storage_temp: wineData.storageTemp,
        sulfites: wineData.sulfites.toString(),
        producer: wineData.producer,
        address: wineData.address,
        gs1_code: wineData.gs1Code,
        country: wineData.country,
        inventory_quantity: wineData.stockQuantity.toString(),
        inventory_type: 'finite'
      },
      active: wineData.active,
      shippable: false, // Víno sa neposiela
      unit_label: 'bottle'
    });

    console.log('✅ Stripe product vytvorený:', product.id);
    console.log('🖼️ Obrázky v Stripe produkte:', product.images);

    // 2. Vytvoriť Stripe Price (presne podľa API dokumentácie)
    const price = await stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: Math.round(wineData.price * 100), // EUR na centy
      // recurring: null - odstránené, default je one-time payment
      metadata: {
        price_type: 'retail',
        tax_rate: '20%',
        bulk_discount: '10%_for_6+_bottles'
      }
    });

    console.log('✅ Stripe price vytvorený:', price.id);

    // 3. Nastaviť inventory (presne podľa API dokumentácie)
    await stripe.products.update(product.id, {
      metadata: {
        ...product.metadata,
        inventory_quantity: wineData.stockQuantity.toString(),
        inventory_type: 'finite'
      }
    });

    console.log('✅ Inventory nastavený');

    return { 
      success: true, 
      productId: product.id, 
      priceId: price.id,
      message: 'Víno bolo úspešne vytvorené v Stripe'
    };

  } catch (error) {
    console.error('❌ Chyba pri vytváraní vína:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Nepodarilo sa vytvoriť víno' 
    };
  }
}

export async function updateWineProduct(stripeProductId: string, wineData: WineFormData) {
  try {
    console.log('🍷 Aktualizujem víno:', wineData.name);
    
    // 1. Aktualizovať Stripe Product
    const product = await stripe.products.update(stripeProductId, {
      name: wineData.name,
      description: `${wineData.name} - ${wineData.quality} víno z ${wineData.region}`,
      images: wineData.images && wineData.images.length > 0 ? wineData.images : undefined,
      metadata: {
        wine_type: wineData.category,
        vintage: wineData.vintage,
        region: wineData.region,
        quality: wineData.quality,
        designation: wineData.designation || '',
        color: wineData.color,
        aroma: wineData.aroma,
        taste: wineData.taste,
        serving_temp: wineData.servingTemp,
        batch: wineData.batch,
        filling_date: wineData.fillingDate,
        acidity: wineData.acidity,
        residual_sugar: wineData.residualSugar,
        sugar: wineData.sugar,
        alcohol: wineData.alcohol,
        storage_temp: wineData.storageTemp,
        sulfites: wineData.sulfites.toString(),
        producer: wineData.producer,
        address: wineData.address,
        gs1_code: wineData.gs1Code,
        country: wineData.country,
        inventory_quantity: wineData.stockQuantity.toString(),
        inventory_type: 'finite'
      },
      active: wineData.active
    });

    console.log('✅ Stripe product aktualizovaný');

    // 2. Aktualizovať cenu ak sa zmenila
    const prices = await stripe.prices.list({ product: stripeProductId, active: true });
    if (prices.data.length > 0) {
      const currentPrice = prices.data[0];
      const newAmount = Math.round(wineData.price * 100);
      
      if (currentPrice.unit_amount !== newAmount) {
        // Deaktivovať starú cenu
        await stripe.prices.update(currentPrice.id, { active: false });
        
        // Vytvoriť novú cenu
        await stripe.prices.create({
          product: stripeProductId,
          currency: 'eur',
          unit_amount: newAmount,
          // recurring: null - odstránené, default je one-time payment
          metadata: {
            price_type: 'retail',
            tax_rate: '20%',
            bulk_discount: '10%_for_6+_bottles'
          }
        });
        
        console.log('✅ Nová cena vytvorená');
      }
    }

    return { 
      success: true, 
      message: 'Víno bolo úspešne aktualizované' 
    };

  } catch (error) {
    console.error('❌ Chyba pri aktualizácii vína:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Nepodarilo sa aktualizovať víno' 
    };
  }
}

export async function deleteWineProduct(stripeProductId: string) {
  try {
    console.log('🍷 Deaktivujem víno:', stripeProductId);

    // 1. Najprv deaktivovať všetky ceny
    const prices = await stripe.prices.list({
      product: stripeProductId,
      active: true
    });

    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
      console.log('✅ Cena deaktivovaná:', price.id);
    }

    // 2. Potom deaktivovať produkt (namiesto mazania)
    const updatedProduct = await stripe.products.update(stripeProductId, { 
      active: false 
    });
    console.log('✅ Víno deaktivované v Stripe:', updatedProduct.id);

    return {
      success: true,
      message: 'Víno bolo úspešne deaktivované',
      productId: updatedProduct.id
    };
  } catch (error) {
    console.error('❌ Chyba pri deaktivácii vína:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nepodarilo sa deaktivovať víno'
    };
  }
}

export async function getAllWines(): Promise<AdminWineWithPrice[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: products, error } = await supabase
      .from('products')
      .select(`*, prices (*)`)
      .order('created_at', { ascending: false }); // Zobraziť všetky vína, nie len aktívne

    if (error) {
      console.error('❌ Chyba pri načítaní vín:', error);
      return [];
    }

    // Map Supabase data to AdminWineWithPrice
    return (products || []).map(product => ({
      id: product.id,
      stripe_id: product.id,
      name: product.name || '',
      description: product.description || '',
      active: product.active || false,
      metadata: typeof product.metadata === 'object' ? product.metadata as Record<string, any> : {},
      image: product.image || undefined,
      images: product.image ? [product.image] : [], // Populate images array from single image field
      created_at: new Date().toISOString(), // Default value since column doesn't exist
      updated_at: new Date().toISOString(), // Default value since column doesn't exist
      prices: (product.prices || []).map(price => ({
        id: price.id,
        stripe_id: price.id,
        product_id: price.product_id || '',
        currency: price.currency || 'eur',
        unit_amount: price.unit_amount || 0,
        active: price.active || false,
        metadata: typeof price.metadata === 'object' ? price.metadata as Record<string, any> : {},
        created_at: new Date().toISOString() // Default value since column doesn't exist
      }))
    }));
  } catch (error) {
    console.error('❌ Neočakávaná chyba pri načítaní vín:', error);
    return [];
  }
}

export async function getWineById(stripeProductId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        prices (*)
      `)
      .eq('stripe_id', stripeProductId)
      .single();

    if (error) {
      console.error('❌ Chyba pri načítaní vína:', error);
      return null;
    }

    return product;
  } catch (error) {
    console.error('❌ Neočakávaná chyba:', error);
    return null;
  }
}

export async function toggleWineStatus(stripeProductId: string, newStatus: boolean) {
  try {
    console.log(`🍷 ${newStatus ? 'Aktivujem' : 'Deaktivujem'} víno:`, stripeProductId);

    // 1. Aktualizovať status produktu
    const updatedProduct = await stripe.products.update(stripeProductId, { 
      active: newStatus 
    });
    console.log(`✅ Víno ${newStatus ? 'aktivované' : 'deaktivované'} v Stripe:`, updatedProduct.id);

    // 2. Aktualizovať status všetkých cien
    const prices = await stripe.prices.list({
      product: stripeProductId
    });

    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: newStatus });
      console.log(`✅ Cena ${newStatus ? 'aktivovaná' : 'deaktivovaná'}:`, price.id);
    }

    return {
      success: true,
      message: `Víno bolo úspešne ${newStatus ? 'aktivované' : 'deaktivované'}`,
      productId: updatedProduct.id
    };
  } catch (error) {
    console.error(`❌ Chyba pri ${newStatus ? 'aktivácii' : 'deaktivácii'} vína:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Nepodarilo sa ${newStatus ? 'aktivovať' : 'deaktivovať'} víno`
    };
  }
}

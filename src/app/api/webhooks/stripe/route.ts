import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ Webhook event received:', event.type);

    try {
      switch (event.type) {
        case 'product.created':
          await handleProductSync(event.data.object as Stripe.Product);
          break;
        case 'product.updated':
          await handleProductSync(event.data.object as Stripe.Product);
          break;
        case 'product.deleted':
          await handleProductDeletion(event.data.object as Stripe.Product);
          break;
        case 'price.created':
          await handlePriceSync(event.data.object as Stripe.Price);
          break;
        case 'price.updated':
          await handlePriceSync(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await handlePriceDeletion(event.data.object as Stripe.Price);
          break;
        default:
          console.log('⚠️ Unhandled event type:', event.type);
      }
    } catch (error) {
      console.error('❌ Chyba pri spracovaní webhook eventu:', error);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Neočakávaná chyba v webhook handleri:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleProductSync(product: Stripe.Product) {
  try {
    console.log('🔄 Synchronizujem produkt:', product.id);

    // Aktualizovať alebo vytvoriť produkt v Supabase
    const { error } = await supabaseAdminClient
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images?.[0] || null,
        active: product.active,
        metadata: product.metadata,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('❌ Chyba pri synchronizácii produktu:', error);
      throw error;
    }

    console.log('✅ Produkt synchronizovaný:', product.id);
  } catch (error) {
    console.error('❌ Chyba pri synchronizácii produktu:', error);
    throw error;
  }
}

async function handleProductDeletion(product: Stripe.Product) {
  try {
    console.log('🗑️ Mažem produkt:', product.id);

    // Vymazať produkt zo Supabase
    const { error } = await supabaseAdminClient
      .from('products')
      .delete()
      .eq('id', product.id);

    if (error) {
      console.error('❌ Chyba pri mazaní produktu:', error);
      throw error;
    }

    console.log('✅ Produkt vymazaný:', product.id);
  } catch (error) {
    console.error('❌ Chyba pri mazaní produktu:', error);
    throw error;
  }
}

async function handlePriceSync(price: Stripe.Price) {
  try {
    console.log('🔄 Synchronizujem cenu:', price.id);

    // Aktualizovať alebo vytvoriť cenu v Supabase
    const { error } = await supabaseAdminClient
      .from('prices')
      .upsert({
        id: price.id,
        product_id: price.product as string,
        currency: price.currency,
        unit_amount: price.unit_amount,
        active: price.active,
        metadata: price.metadata,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('❌ Chyba pri synchronizácii ceny:', error);
      throw error;
    }

    console.log('✅ Cena synchronizovaná:', price.id);
  } catch (error) {
    console.error('❌ Chyba pri synchronizácii ceny:', error);
    throw error;
  }
}

async function handlePriceDeletion(price: Stripe.Price) {
  try {
    console.log('🗑️ Mažem cenu:', price.id);

    // Vymazať cenu zo Supabase
    const { error } = await supabaseAdminClient
      .from('prices')
      .delete()
      .eq('id', price.id);

    if (error) {
      console.error('❌ Chyba pri mazaní ceny:', error);
      throw error;
    }

    console.log('✅ Cena vymazaná:', price.id);
  } catch (error) {
    console.error('❌ Chyba pri mazaní ceny:', error);
    throw error;
  }
}

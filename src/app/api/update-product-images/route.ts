import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { images, wineName } = await request.json();

    if (!images || !wineName) {
      return NextResponse.json(
        { success: false, error: 'Chýbajú obrázky alebo názov vína' },
        { status: 400 }
      );
    }

    console.log('🔄 Aktualizujem Stripe produkt s obrázkami:', { wineName, images });

    // 1. Nájsť Stripe produkt podľa názvu
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });

    const wineProduct = products.data.find(product => 
      product.name.toLowerCase().includes(wineName.toLowerCase())
    );

    if (!wineProduct) {
      console.log('❌ Stripe produkt nenájdený pre:', wineName);
      return NextResponse.json(
        { success: false, error: 'Stripe produkt nenájdený' },
        { status: 404 }
      );
    }

    console.log('✅ Nájdený Stripe produkt:', wineProduct.id);

    // 2. Aktualizovať Stripe produkt s novými obrázkami
    const updatedProduct = await stripe.products.update(wineProduct.id, {
      images: images
    });

    console.log('✅ Stripe produkt aktualizovaný s obrázkami:', updatedProduct.images);

    return NextResponse.json({
      success: true,
      productId: updatedProduct.id,
      images: updatedProduct.images
    });

  } catch (error) {
    console.error('❌ Chyba pri aktualizácii Stripe produktu:', error);
    return NextResponse.json(
      { success: false, error: 'Neočakávaná chyba pri aktualizácii' },
      { status: 500 }
    );
  }
}

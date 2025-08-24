'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { createTastingBooking } from '../controllers/create-tasting-booking';
import type { BookingFormData } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function createTastingCheckout(
  sessionId: number,
  formData: BookingFormData
) {
  try {
    // Najprv vytvoriť rezerváciu
    const bookingResult = await createTastingBooking(sessionId, formData);
    
    if (!bookingResult.success) {
      return { success: false, error: bookingResult.error };
    }
    
    // Vytvoriť Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Degustácia - ${formData.customer_name}`,
              description: `Rezervácia pre ${formData.number_of_people} osôb`,
            },
            unit_amount: bookingResult.totalPrice, // už v centoch
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tasting/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingResult.bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#degustacia`,
      metadata: {
        booking_id: bookingResult.bookingId.toString(),
        session_id: sessionId.toString(),
        customer_email: formData.customer_email,
        customer_name: formData.customer_name,
        number_of_people: formData.number_of_people.toString(),
      },
      customer_email: formData.customer_email,
      locale: 'sk',
      currency: 'eur',
    });

    if (!session.url) {
      throw new Error('Nepodarilo sa vytvoriť checkout session');
    }

    return { success: true, url: session.url };
  } catch (error) {
    console.error('Checkout error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Nepodarilo sa vytvoriť checkout session' 
    };
  }
}

'use server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import type { BookingFormData } from '../types';

export async function createTastingBooking(
  sessionId: number,
  formData: BookingFormData
) {
  try {
    console.log('🍷 Vytváram rezerváciu pre session:', sessionId);
    console.log('📝 Form data:', formData);
    
    const supabase = await createSupabaseServerClient();
    
    // Overiť, či je termín stále dostupný
    const { data: session, error: sessionError } = await supabase
      .from('tasting_sessions')
      .select('*, package:tasting_packages(*)')
      .eq('id', sessionId)
      .single();
    
    if (sessionError || !session) {
      console.error('❌ Session error:', sessionError);
      return { success: false, error: 'Termín nebol nájdený' };
    }
    
    console.log('✅ Session nájdený:', session);
    
    if (session.status === 'fully_booked') {
      return { success: false, error: 'Termín je už plne obsadený' };
    }
    
    if (session.current_bookings + formData.number_of_people > session.max_capacity) {
      return { success: false, error: 'Nedostatok miest pre požadovaný počet osôb' };
    }
    
    // Vypočítať celkovú cenu
    const totalPrice = (session.package?.price || 0) * formData.number_of_people;
    console.log('💰 Celková cena:', totalPrice);
    
    // Vytvoriť rezerváciu
    const bookingData = {
      session_id: sessionId,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      customer_phone: formData.customer_phone,
      number_of_people: formData.number_of_people,
      special_requests: formData.special_requests,
      total_price: totalPrice,
      status: 'pending'
    };
    
    console.log('📝 Vkladám booking data:', bookingData);
    
    const { data: booking, error: bookingError } = await supabase
      .from('tasting_bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (bookingError) {
      console.error('❌ Error creating booking:', bookingError);
      return { success: false, error: 'Nepodarilo sa vytvoriť rezerváciu' };
    }
    
    console.log('✅ Booking vytvorený:', booking);
    
    return { 
      success: true, 
      bookingId: booking.id,
      totalPrice,
      message: 'Rezervácia bola úspešne vytvorená'
    };
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error: 'Neočakávaná chyba pri vytváraní rezervácie' };
  }
}

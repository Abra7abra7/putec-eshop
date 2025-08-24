export interface TastingPackage {
  id: number;
  name: string;
  description: string | null;
  price: number; // in cents
  duration_minutes: number;
  max_people: number;
  includes_food: boolean;
  includes_accommodation: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TastingSession {
  id: number;
  package_id: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
  status: 'available' | 'fully_booked' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
  package?: TastingPackage;
}

export interface TastingBooking {
  id: number;
  session_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  number_of_people: number;
  special_requests: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number; // in cents
  stripe_payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  session?: TastingSession;
}

export interface TastingSessionWithPackage extends TastingSession {
  package: TastingPackage;
}

export interface BookingFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  special_requests: string;
}

export interface AvailableTimeSlot {
  date: string;
  time: string;
  sessions: TastingSessionWithPackage[];
}

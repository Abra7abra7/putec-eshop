import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import type { TastingPackage, TastingSessionWithPackage, AvailableTimeSlot } from '../types';

export async function getTastingPackages(): Promise<TastingPackage[]> {
  const supabase = await createSupabaseServerClient();

  const { data: packages, error } = await supabase
    .from('tasting_packages')
    .select('*')
    .eq('active', true)
    .order('price');

  if (error) {
    console.error('Error fetching tasting packages:', error);
    return [];
  }

  return packages || [];
}

export async function getAvailableSessions(
  startDate: Date,
  endDate: Date
): Promise<TastingSessionWithPackage[]> {
  const supabase = await createSupabaseServerClient();

  const { data: sessions, error } = await supabase
    .from('tasting_sessions')
    .select(`
      *,
      package:tasting_packages(*)
    `)
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())
    .in('status', ['available', 'fully_booked'])
    .order('start_time');

  if (error) {
    console.error('Error fetching available sessions:', error);
    return [];
  }

  return sessions || [];
}

export async function getAvailableTimeSlots(
  startDate: Date = new Date(),
  days: number = 30
): Promise<AvailableTimeSlot[]> {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  const sessions = await getAvailableSessions(startDate, endDate);
  
  // Group sessions by date and time
  const timeSlots: { [key: string]: TastingSessionWithPackage[] } = {};
  
  sessions.forEach(session => {
    const date = new Date(session.start_time);
    const dateKey = date.toISOString().split('T')[0];
    const timeKey = date.toTimeString().split(' ')[0].substring(0, 5);
    const slotKey = `${dateKey}_${timeKey}`;
    
    if (!timeSlots[slotKey]) {
      timeSlots[slotKey] = [];
    }
    timeSlots[slotKey].push(session);
  });

  // Convert to array format
  return Object.entries(timeSlots).map(([slotKey, sessions]) => {
    const [date, time] = slotKey.split('_');
    return {
      date,
      time,
      sessions
    };
  }).sort((a, b) => {
    // Sort by date first, then by time
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  });
}

export async function getTastingPackageById(id: number): Promise<TastingPackage | null> {
  const supabase = await createSupabaseServerClient();

  const { data: package_, error } = await supabase
    .from('tasting_packages')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching tasting package:', error);
    return null;
  }

  return package_;
}

export async function getTastingSessionById(id: number): Promise<TastingSessionWithPackage | null> {
  const supabase = await createSupabaseServerClient();

  const { data: session, error } = await supabase
    .from('tasting_sessions')
    .select(`
      *,
      package:tasting_packages(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tasting session:', error);
    return null;
  }

  return session;
}

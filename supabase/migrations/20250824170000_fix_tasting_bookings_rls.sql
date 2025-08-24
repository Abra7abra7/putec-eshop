-- Migration: Fix RLS policies for tasting_bookings
-- Date: 2025-08-24

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON tasting_bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON tasting_bookings;

-- Create new policies that allow anyone to insert bookings (for public booking)
CREATE POLICY "Anyone can insert tasting bookings" ON tasting_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view tasting bookings" ON tasting_bookings
  FOR SELECT USING (true);

-- Allow users to update their own bookings (if they have email)
CREATE POLICY "Users can update their own bookings" ON tasting_bookings
  FOR UPDATE USING (customer_email = auth.jwt() ->> 'email');

-- Allow users to delete their own bookings (if they have email)
CREATE POLICY "Users can delete their own bookings" ON tasting_bookings
  FOR DELETE USING (customer_email = auth.jwt() ->> 'email');

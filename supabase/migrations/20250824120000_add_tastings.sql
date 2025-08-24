-- Migration: Add tastings functionality with calendar booking
-- Date: 2025-08-24

-- 1. Tasting packages table
CREATE TABLE IF NOT EXISTS tasting_packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  duration_minutes INTEGER NOT NULL DEFAULT 90,
  max_people INTEGER NOT NULL DEFAULT 6,
  includes_food BOOLEAN DEFAULT false,
  includes_accommodation BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tasting sessions table (calendar bookings)
CREATE TABLE IF NOT EXISTS tasting_sessions (
  id SERIAL PRIMARY KEY,
  package_id INTEGER REFERENCES tasting_packages(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_capacity INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'available', -- available, fully_booked, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tasting bookings table
CREATE TABLE IF NOT EXISTS tasting_bookings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES tasting_sessions(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  number_of_people INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  total_price INTEGER NOT NULL, -- in cents
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default tasting packages
INSERT INTO tasting_packages (name, description, price, duration_minutes, max_people, includes_food, includes_accommodation) VALUES
  ('Základná degustácia', 'Degustácia 6 vín s odborným výkladom someliéra. Ideálne pre začiatočníkov.', 2500, 90, 6, false, false),
  ('Premium degustácia', 'Degustácia 8 vín s občerstvením a odborným výkladom. Pre pokročilých milovníkov vína.', 4500, 120, 6, true, false),
  ('VIP degustácia s ubytovaním', 'Exkluzívna degustácia 10 vín s večerou a ubytovaním v našom penzióne.', 8900, 180, 4, true, true);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasting_sessions_start_time ON tasting_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_tasting_sessions_status ON tasting_sessions(status);
CREATE INDEX IF NOT EXISTS idx_tasting_bookings_session_id ON tasting_bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_tasting_bookings_customer_email ON tasting_bookings(customer_email);

-- 6. Enable Row Level Security
ALTER TABLE tasting_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasting_bookings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Tasting packages: anyone can read active packages
CREATE POLICY "Anyone can view active tasting packages" ON tasting_packages
  FOR SELECT USING (active = true);

-- Tasting sessions: anyone can view available sessions
CREATE POLICY "Anyone can view available tasting sessions" ON tasting_sessions
  FOR SELECT USING (status IN ('available', 'fully_booked'));

-- Tasting bookings: users can only see their own bookings
CREATE POLICY "Users can view their own bookings" ON tasting_bookings
  FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own bookings" ON tasting_bookings
  FOR INSERT WITH CHECK (customer_email = auth.jwt() ->> 'email');

-- 8. Create function to update session capacity
CREATE OR REPLACE FUNCTION update_session_capacity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tasting_sessions 
    SET current_bookings = current_bookings + NEW.number_of_people,
        status = CASE 
          WHEN current_bookings + NEW.number_of_people >= max_capacity THEN 'fully_booked'
          ELSE 'available'
        END
    WHERE id = NEW.session_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tasting_sessions 
    SET current_bookings = current_bookings - OLD.number_of_people,
        status = CASE 
          WHEN current_bookings - OLD.number_of_people < max_capacity THEN 'available'
          ELSE 'fully_booked'
        END
    WHERE id = OLD.session_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for automatic capacity updates
CREATE TRIGGER trigger_update_session_capacity
  AFTER INSERT OR DELETE ON tasting_bookings
  FOR EACH ROW EXECUTE FUNCTION update_session_capacity();

-- 10. Create function to generate available sessions for next 30 days
CREATE OR REPLACE FUNCTION generate_available_sessions()
RETURNS void AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  session_date DATE;
  session_time TIME;
  package_record RECORD;
BEGIN
  -- Generate sessions for next 30 days
  FOR session_date IN SELECT generate_series(current_date, current_date + INTERVAL '30 days', INTERVAL '1 day')
  LOOP
    -- Skip Mondays (closed)
    IF EXTRACT(DOW FROM session_date) != 1 THEN
      -- Generate sessions at 10:00, 14:00, and 18:00
      FOR session_time IN SELECT unnest(ARRAY['10:00'::time, '14:00'::time, '18:00'::time])
      LOOP
        -- For each package, create a session
        FOR package_record IN SELECT * FROM tasting_packages WHERE active = true
        LOOP
          INSERT INTO tasting_sessions (package_id, start_time, end_time, max_capacity)
          VALUES (
            package_record.id,
            (session_date + session_time)::timestamp with time zone,
            (session_date + session_time + (package_record.duration_minutes || ' minutes')::interval)::timestamp with time zone,
            package_record.max_people
          )
          ON CONFLICT DO NOTHING;
        END LOOP;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

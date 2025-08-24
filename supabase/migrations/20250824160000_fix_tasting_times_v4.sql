-- Migration: Fix tasting session times v4 - explicit timezone
-- Date: 2025-08-24

-- Drop existing function and recreate with explicit timezone handling
DROP FUNCTION IF EXISTS generate_available_sessions();

-- Create function to generate available sessions for next 30 days with correct times
CREATE OR REPLACE FUNCTION generate_available_sessions()
RETURNS void AS $$
DECLARE
  current_date DATE := CURRENT_DATE;
  session_date DATE;
  session_time_str TEXT;
  package_record RECORD;
BEGIN
  -- Generate sessions for next 30 days
  FOR session_date IN SELECT generate_series(current_date, current_date + INTERVAL '30 days', INTERVAL '1 day')
  LOOP
    -- Skip Mondays (closed)
    IF EXTRACT(DOW FROM session_date) != 1 THEN
      -- Generate sessions at 10:00, 14:00, and 18:00 (local time)
      FOR session_time_str IN SELECT unnest(ARRAY['08:00', '12:00', '16:00'])
      LOOP
        -- For each package, create a session
        FOR package_record IN SELECT * FROM tasting_packages WHERE active = true
        LOOP
          INSERT INTO tasting_sessions (package_id, start_time, end_time, max_capacity)
          VALUES (
            package_record.id,
            (session_date || ' ' || session_time_str || ':00+00:00')::timestamp with time zone,
            (session_date || ' ' || session_time_str || ':00+00:00')::timestamp with time zone + (package_record.duration_minutes || ' minutes')::interval,
            package_record.max_people
          )
          ON CONFLICT DO NOTHING;
        END LOOP;
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

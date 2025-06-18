-- Part 1: Create the table and basic structure
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  details TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Add dashboard access control fields
  dashboard_access BOOLEAN DEFAULT false,
  access_start_time TIMESTAMP WITH TIME ZONE,
  access_end_time TIMESTAMP WITH TIME ZONE,
  access_granted_by UUID REFERENCES auth.users(id),
  access_granted_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admins to read all logs" ON public.auth_logs;
DROP POLICY IF EXISTS "Allow admins to update access" ON public.auth_logs;
DROP POLICY IF EXISTS "Allow users to read their own logs" ON public.auth_logs;

-- Create new policies
CREATE POLICY "Allow admins to read all logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to update access"
  ON public.auth_logs
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow users to read their own logs"
  ON public.auth_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS auth_logs_user_id_created_at_idx ON public.auth_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS auth_logs_event_type_idx ON public.auth_logs (event_type);
CREATE INDEX IF NOT EXISTS auth_logs_dashboard_access_idx ON public.auth_logs (dashboard_access);
CREATE INDEX IF NOT EXISTS auth_logs_access_times_idx ON public.auth_logs (access_start_time, access_end_time);

-- Part 2: Create the trigger function with error handling
CREATE OR REPLACE FUNCTION public.handle_auth_event()
RETURNS TRIGGER AS $$
DECLARE
  _event_type TEXT;
  _details TEXT;
BEGIN
  -- Determine event type and details
  _event_type := CASE 
        WHEN TG_OP = 'INSERT' THEN 'SIGN_UP'
        WHEN TG_OP = 'DELETE' THEN 'DELETE_ACCOUNT'
        WHEN NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN 'SIGN_IN'
        ELSE 'UPDATE'
  END;

  _details := CASE 
        WHEN TG_OP = 'INSERT' THEN 'Method: ' || COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
        WHEN TG_OP = 'DELETE' THEN 'Account deleted'
        WHEN NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at 
          THEN 'Method: ' || COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
        ELSE 'Profile updated'
  END;

  -- Insert basic auth log
  INSERT INTO public.auth_logs (
    user_id,
    event_type,
    details,
    success
  )
  VALUES (
    CASE 
      WHEN TG_OP = 'INSERT' THEN NEW.id
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    _event_type,
    _details,
      true
    );
  
  -- Always return the NEW record to allow the auth operation to proceed
  RETURN COALESCE(NEW, OLD);
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error but don't block the auth operation
    RAISE WARNING 'Failed to log auth event: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for auth events (only if function exists)
DO $$
BEGIN
  -- Drop existing triggers if they exist
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
  DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

  -- Create new triggers
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_event();

  CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_event();

  CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_auth_event();
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create triggers: %', SQLERRM;
END;
$$;

-- Add insert policy for admin
CREATE POLICY "Allow admins to insert logs"
  ON public.auth_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
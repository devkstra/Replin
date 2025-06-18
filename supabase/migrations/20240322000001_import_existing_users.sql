-- Import existing users from auth.users
INSERT INTO public.users (id, email)
SELECT 
  id,
  email
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE users.id = auth.users.id
);

-- Update dashboard_access based on latest auth_logs entries
WITH latest_logs AS (
  SELECT DISTINCT ON (user_id)
    user_id,
    dashboard_access,
    created_at
  FROM auth_logs
  ORDER BY user_id, created_at DESC
)
UPDATE public.users
SET 
  dashboard_access = latest_logs.dashboard_access,
  updated_at = latest_logs.created_at
FROM latest_logs
WHERE users.id = latest_logs.user_id; 
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users
SET raw_app_meta_data = 
  CASE 
    WHEN raw_app_meta_data IS NULL THEN 
      jsonb_build_object('role', 'admin')
    ELSE 
      raw_app_meta_data || jsonb_build_object('role', 'admin')
  END
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, raw_app_meta_data
FROM auth.users
WHERE email = 'your-email@example.com'; 
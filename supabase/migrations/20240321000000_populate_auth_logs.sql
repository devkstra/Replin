-- Populate auth_logs with existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users in auth.users
    FOR user_record IN SELECT * FROM auth.users
    LOOP
        -- Insert a SIGN_UP event for each user
        INSERT INTO public.auth_logs (
            user_id,
            event_type,
            details,
            success,
            created_at
        )
        VALUES (
            user_record.id,
            'SIGN_UP',
            'Method: ' || COALESCE(user_record.raw_app_meta_data->>'provider', 'email'),
            true,
            user_record.created_at
        );

        -- If the user has signed in before, add a SIGN_IN event
        IF user_record.last_sign_in_at IS NOT NULL THEN
            INSERT INTO public.auth_logs (
                user_id,
                event_type,
                details,
                success,
                created_at
            )
            VALUES (
                user_record.id,
                'SIGN_IN',
                'Method: ' || COALESCE(user_record.raw_app_meta_data->>'provider', 'email'),
                true,
                user_record.last_sign_in_at
            );
        END IF;

        -- For demo users or early adopters, grant them initial dashboard access
        -- You can modify this condition based on your requirements
        IF user_record.created_at < NOW() - INTERVAL '1 day' THEN
            INSERT INTO public.auth_logs (
                user_id,
                event_type,
                details,
                success,
                created_at,
                dashboard_access,
                access_start_time,
                access_end_time,
                access_granted_by,
                access_granted_at
            )
            VALUES (
                user_record.id,
                'GRANT_DASHBOARD_ACCESS',
                'Initial access grant during migration',
                true,
                NOW(),
                true,
                NOW(),
                NOW() + INTERVAL '30 days',
                user_record.id, -- self-granted during migration
                NOW()
            );
        END IF;
    END LOOP;
END;
$$; 
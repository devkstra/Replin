'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdmin, cleanAuthRedirectUrl } from '@/lib/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session if this is an OAuth callback
        await supabase.auth.getSession();

        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No session found');
        }

        // Get the redirect URL from query params or default to dashboard
        const redirectTo = searchParams.get('redirectTo') || '/dashboard';
        const isDemo = searchParams.get('mode') === 'demo';

        // Handle demo mode
        if (isDemo) {
          router.replace('/demo');
          return;
        }

        // Check admin routes
        if (redirectTo.startsWith('/admin')) {
          if (!isAdmin(session.user)) {
            router.replace('/');
            return;
          }
        }

        // Clean the URL and redirect
        const cleanUrl = cleanAuthRedirectUrl(redirectTo);
        router.replace(cleanUrl);

      } catch (error) {
        console.error('Error during auth callback:', error);
        const redirectTo = searchParams.get('redirectTo');
        const redirectParam = redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : '';
        router.replace(`/signin?error=auth${redirectParam}`);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl font-medium mb-4">Completing sign in...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto" />
      </div>
    </div>
  );
} 
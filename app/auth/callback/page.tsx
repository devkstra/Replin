'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error during auth callback:', error);
        router.push('/signin?error=auth');
        return;
      }

      if (session) {
        // Check if the original sign-in was for demo mode
        const isDemo = searchParams.get('demo') === 'true';
        
        if (isDemo) {
          router.push('/demo'); // Redirect to demo page
        } else {
          router.push('/dashboard'); // Default redirect
        }
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
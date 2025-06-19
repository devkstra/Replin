import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard';
  const isDemo = requestUrl.searchParams.get('mode') === 'demo';

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Check if user exists in users table
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('first_login, dashboard_access')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        // First time user - create user record
        await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            first_login: true,
            dashboard_access: false
          }
        ]);
        
        // Redirect to onboarding for first-time users
        const onboardingUrl = new URL('/onboarding', requestUrl.origin);
        onboardingUrl.searchParams.set('redirectTo', isDemo ? '/demo' : '/dashboard');
        return NextResponse.redirect(onboardingUrl);
      } else if (existingUser.first_login) {
        // Update first_login to false
        await supabase
          .from('users')
          .update({ first_login: false })
          .eq('id', user.id);

        // Check if user has completed onboarding
        const { data: onboardingData } = await supabase
          .from('user_onboarding')
          .select('completed_at')
          .eq('id', user.id)
          .single();

        if (!onboardingData?.completed_at) {
          // Redirect to onboarding if not completed
          const onboardingUrl = new URL('/onboarding', requestUrl.origin);
          onboardingUrl.searchParams.set('redirectTo', isDemo ? '/demo' : '/dashboard');
          return NextResponse.redirect(onboardingUrl);
        }
      }
    }
  }

  // For returning users or if something goes wrong, redirect to the specified redirect path
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
} 
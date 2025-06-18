import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdmin } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Check auth session
  const { data: { session } } = await supabase.auth.getSession();

  // Handle admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not authenticated at all, redirect to sign in
    if (!session) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated but not admin, redirect to home
    if (!isAdmin(session.user)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/signin', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      // Check auth logs for dashboard access
      const { data: authLogs, error: logsError } = await supabase
        .from('auth_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('dashboard_access', true)
        .lte('access_start_time', new Date().toISOString())
        .gte('access_end_time', new Date().toISOString())
        .single();

      if (logsError) throw logsError;

      // If no valid access found, redirect to home
      if (!authLogs) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Add access info to the response headers for the client
      res.headers.set('X-Access-Start', authLogs.access_start_time);
      res.headers.set('X-Access-End', authLogs.access_end_time);
      
    } catch (error) {
      console.error('Error checking auth logs:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
} 
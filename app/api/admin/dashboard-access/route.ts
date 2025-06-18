import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if the current user is an admin
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { userId, grantAccess, startTime, endTime } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (grantAccess && (!startTime || !endTime)) {
      return NextResponse.json({ error: 'Start time and end time are required when granting access' }, { status: 400 });
    }

    // Update or create auth log entry
    const { data, error } = await supabase
      .from('auth_logs')
      .upsert({
        user_id: userId,
        dashboard_access: grantAccess,
        access_start_time: grantAccess ? startTime : null,
        access_end_time: grantAccess ? endTime : null,
        access_granted_by: session.user.id,
        access_granted_at: new Date().toISOString(),
        event_type: grantAccess ? 'GRANT_DASHBOARD_ACCESS' : 'REVOKE_DASHBOARD_ACCESS',
        details: `Dashboard access ${grantAccess ? 'granted' : 'revoked'} by admin`
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error managing dashboard access:', error);
    return NextResponse.json({ error: 'Failed to manage dashboard access' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if the current user is an admin
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users with dashboard access
    const { data, error } = await supabase
      .from('auth_logs')
      .select('user_id, dashboard_access, access_start_time, access_end_time, access_granted_by, access_granted_at')
      .eq('dashboard_access', true);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching dashboard access:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard access' }, { status: 500 });
  }
} 
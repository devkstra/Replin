import { User } from '@supabase/supabase-js';

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.user_metadata?.role === 'admin';
}

export function hasValidSession(user: User | null): boolean {
  return !!user;
}

// Clean any auth-related parameters from URLs
export function cleanAuthRedirectUrl(url: string): string {
  try {
    const cleanUrl = new URL(url, window.location.origin);
    // Remove any auth-related parameters
    cleanUrl.searchParams.delete('access_token');
    cleanUrl.searchParams.delete('refresh_token');
    cleanUrl.searchParams.delete('token_type');
    cleanUrl.searchParams.delete('type');
    cleanUrl.searchParams.delete('expires_in');
    return cleanUrl.pathname + cleanUrl.search;
  } catch (error) {
    // If URL parsing fails, return the original path
    return url;
  }
} 
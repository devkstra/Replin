import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Store the contact form submission in Supabase
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ email, message, created_at: new Date().toISOString() }]);

    if (error) {
      throw error;
    }

    // Here you could also add email notification logic
    // For example, using a service like SendGrid or AWS SES

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 
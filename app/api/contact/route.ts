import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured');
      // Return success for now, but log to console
      return NextResponse.json({ 
        success: true,
        message: 'Message received (Development mode)'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ 
        success: false,
        error: 'Email and message are required' 
      }, { status: 400 });
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('contacts')
      .insert([{ email, message }]);

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to send message'
    }, { status: 500 });
  }
} 
"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const isDemo = searchParams.get('mode') === 'demo';
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}${isDemo ? '&mode=demo' : ''}`,
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to verify page
      router.push(`/verify?email=${encodeURIComponent(email)}${isDemo ? '&mode=demo' : ''}&redirectTo=${encodeURIComponent(redirectTo)}`);
    } catch (error) {
      console.error('Email sign in error:', error);
      toast.error('Failed to send login link. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}${isDemo ? '&mode=demo' : ''}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      });

      if (error) {
        throw error;
      }

      // The redirect will happen automatically
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Back Button */}
        <Link 
          href="/"
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Sign In Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/Logo_image.png" 
                alt="Replin AI Logo" 
                width={40} 
                height={40}
                className="rounded"
              />
              <span className="text-xl font-medium">Replin AI</span>
            </Link>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-medium">
            {isDemo ? 'Try Replin AI Demo' : 'Welcome to Replin AI'}
          </h1>
          <p className="mb-8 text-center text-white/60">
            {isDemo 
              ? 'Experience the power of AI voice agents'
              : 'Sign in to get started'
            }
          </p>

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            className="mb-4 w-full bg-white text-black hover:bg-white/90"
            disabled={isLoading}
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-white/60">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Sending link...' : 'Continue with Email'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 
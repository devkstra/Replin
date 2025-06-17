'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const isDemo = searchParams.get('mode') === 'demo';
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    // Here you would implement the resend logic
    router.push(`/signin${isDemo ? '?mode=demo' : ''}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        {/* Back Button */}
        <Link 
          href={`/signin${isDemo ? '?mode=demo' : ''}`}
          className="absolute left-6 top-6 flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {/* Content Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
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

          {/* Email Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="mb-4 text-3xl font-medium">
            Check your email
          </h1>
          <p className="mb-2 text-lg text-white/60">
            We've sent a sign-in link to
          </p>
          <p className="mb-8 text-lg font-medium">
            {email || 'your email address'}
          </p>

          {/* Instructions */}
          <div className="mb-8 rounded-lg border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-4 text-lg font-medium">What's next?</h2>
            <ul className="space-y-2 text-white/80">
              <li>1. Check your email inbox</li>
              <li>2. Click the sign-in link in the email</li>
              <li>3. You'll be automatically signed in</li>
            </ul>
          </div>

          {/* Resend Button */}
          <Button
            variant="outline"
            className="w-full border-white/10 text-white hover:bg-white/5"
            onClick={handleResendEmail}
            disabled={countdown > 0}
          >
            {countdown > 0 
              ? `Resend email (${countdown}s)`
              : 'Resend email'
            }
          </Button>

          {/* Help Text */}
          <p className="mt-6 text-sm text-white/60">
            Can't find the email? Check your spam folder or{' '}
            <Link 
              href={`/signin${isDemo ? '?mode=demo' : ''}`} 
              className="text-primary hover:text-primary/80"
            >
              try another method
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 
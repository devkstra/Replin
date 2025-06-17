'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function ThankYouPage() {
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>

          {/* Message */}
          <h1 className="mb-4 text-4xl font-medium">
            Thank you for reaching out!
          </h1>
          <p className="mb-8 text-xl text-white/60">
            We've received your message and will get back to you within 24 hours.
          </p>

          {/* What's Next */}
          <div className="mx-auto mb-8 max-w-md rounded-lg border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="mb-4 text-lg font-medium">What's next?</h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Our team will review your inquiry
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                You'll receive a confirmation email shortly
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                We'll respond with detailed information
              </li>
            </ul>
          </div>

          {/* Return Home */}
          <Link 
            href="/"
            className="text-primary hover:text-primary/80"
          >
            Return to homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 
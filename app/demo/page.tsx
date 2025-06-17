"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function DemoPage() {
  const router = useRouter();
  const [videoSrc, setVideoSrc] = useState("https://www.youtube.com/embed/UHVppAMUBAg?si=CS3ZbrsXbGjheRit");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/signin?mode=demo');
        return;
      }

      setUserEmail(session.user.email || null);
    };

    checkAuth();

    // Original video autoplay logic
    const timer = setTimeout(() => {
      setVideoSrc("https://www.youtube.com/embed/UHVppAMUBAg?si=CS3ZbrsXbGjheRit&autoplay=1&mute=1");
    }, 3500);
    return () => clearTimeout(timer);
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Header with Auth Info */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/Logo_image.png" 
                  alt="Replin AI Logo" 
                  width={32} 
                  height={32}
                  className="rounded"
                />
                <span className="text-lg font-medium text-white">Replin AI</span>
              </Link>
              {userEmail && (
                <span className="text-sm text-white/60">{userEmail}</span>
              )}
            </div>
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-24 md:pt-32 px-4">
        <div className="w-full max-w-4xl flex mb-4 md:mb-8">
          <button
            className="border border-white/40 rounded-md px-4 md:px-6 py-2 hover:bg-white/10 transition-colors shadow-md self-stretch text-sm md:text-base text-white"
            onClick={() => router.push("/")}
          >
            Back
          </button>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-xl md:rounded-2xl p-6 md:p-10 max-w-4xl w-full mb-6 md:mb-10 shadow-2xl backdrop-blur-md relative">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white">Thank You for Showing Interest in Replin AI!</h1>
            <div className="text-base md:text-xl text-white/90 mb-2">You've successfully joined the beta waitlist.</div>
            <div className="text-sm md:text-lg text-white/80 mb-2 space-y-2 md:space-y-3">
              <p>We truly appreciate your interest and can't wait to show you what we're building.</p>
              <p>Your spot is reserved</p>
            </div>
          </div>
          <div className="absolute bottom-3 md:bottom-4 right-4 md:right-6 text-xs md:text-sm text-white/50 italic">
            — Sahil G, Founder
          </div>
        </div>
        <div className="bg-[#111111] border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 max-w-4xl w-full flex flex-col items-center shadow-2xl backdrop-blur-md">
          {/* YouTube Video Embed */}
          <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
            <iframe
              width="560"
              height="315"
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
} 
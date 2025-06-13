"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black">
      <div className="absolute top-8 left-8">
        <button
          className="border border-white/40 rounded-md px-6 py-2 hover:bg-white/10 transition-colors shadow-md"
          onClick={() => router.push("/")}
        >
          Back
        </button>
      </div>
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 max-w-md w-full mx-auto flex flex-col items-center shadow-2xl mt-12 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">Sign in</h1>
        <p className="text-white/80 text-center mb-8 text-sm">
          Join your voice agent's journey — configure, launch, and track with ease.<br />
        </p>
        <button className="flex items-center justify-center w-full bg-white text-black rounded-md h-14 mb-4 text-lg font-medium shadow hover:bg-white/90 transition-colors focus:ring-2 focus:ring-blue-400">
          <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>
        <div className="flex items-center w-full my-4">
          <div className="flex-1 h-px bg-white/20" />
          <span className="mx-4 text-white/50 text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>
        <div className="w-full flex items-center bg-black/60 border border-white/30 rounded-md h-14 px-4 focus-within:ring-2 focus-within:ring-blue-400 transition-shadow">
          <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <polyline points="3,7 12,13 21,7" />
          </svg>
          <input
            type="email"
            placeholder="Just enter your email"
            className="bg-transparent outline-none border-none text-white placeholder:text-white/70 w-full h-full text-lg"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
} 
'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReplinLogo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleTryDemo = () => {
    router.push('/demo');
  };

  const handleContactSales = () => {
    router.push('/contact');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const MobileHeroSection = () => (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="/image6.png" 
          alt="Background" 
          fill 
          className="object-cover brightness-[0.7]"
          priority 
        />
      </div>

      {/* Main Content Container with side gaps */}
      <div className="mx-4 mt-24 flex flex-col min-h-screen relative z-10">
        {/* Heading Section */}
        <div className="flex flex-col mt-8">
          <div className="flex items-start gap-3">
            <h1 className="text-[2.8rem] leading-none font-bold">
              AI Voice
              <br />
              Agents
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-[2px] h-20 bg-white/90 mt-2"></div>
              <div className="flex flex-col items-start text-[2rem] leading-tight font-normal">
                <span>In 3</span>
                <span>Steps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Image */}
        <div className="flex-1 flex items-center justify-center mt-2 mb-[-40px] relative z-10">
          <Image
            src="/images/hero-person.png"
            alt="AI Assistant"
            width={300}
            height={400}
            className="object-contain"
            priority
          />
        </div>

        {/* Bottom Black Container */}
        <div className="mb-12 relative z-20">
          <div className="bg-black/90 backdrop-blur-sm rounded-3xl p-6">
            <h3 className="text-2xl font-medium mb-6">
              Providing <span className="font-bold">Voice Agents</span> as service
            </h3>

            <div className="space-y-4">
              {/* Email Input with Google Button */}
              <div className="flex gap-2">
                <div className="flex-1 bg-black/80 rounded-xl border border-white/20">
                  <input
                    type="email"
                    placeholder="Just enter the Email Id to get the demo"
                    className="w-full h-12 px-4 bg-transparent text-white placeholder:text-white/60 outline-none rounded-xl"
                  />
                </div>
                <Button 
                  className="bg-white text-black hover:bg-white/90 h-12 px-4 rounded-xl flex items-center justify-center min-w-[48px]"
                  onClick={handleSignIn}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </Button>
              </div>
              
              {/* Try Demo Button */}
              <Button 
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl text-base font-medium"
                onClick={handleTryDemo}
              >
                Try Demo
              </Button>
            </div>

            <p className="text-sm text-center text-white/80 mt-4">
              Join 150+ Innovators — Due to high demand, access is limited. Enter your email or sign in with Google to request your demo.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );

  const MobileProblemSection = () => (
    <section className="relative min-h-[70vh] mt-8 mb-12">
      <div className="mx-4">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl font-bold mb-2">Help's on Snooze</h2>
          <p className="text-lg text-white/80">Support feels slow, disconnected, and expensive.</p>
        </motion.div>

        {/* Main Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl mx-auto max-w-sm"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/image8.png" 
              alt="Background" 
              fill 
              className="object-cover brightness-[0.7]"
              priority 
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Headings Container - Side by Side */}
            <motion.div className="flex items-center justify-between mb-6">
              <div className="w-[42%]">
                <h2 className="text-2xl font-bold leading-relaxed">
                  Manual
                  <br />
                  support
                  <br />
                  kills time
                </h2>
              </div>
              <div className="w-[2px] h-28 bg-white/90 mx-2"></div>
              <div className="w-[42%]">
                <h3 className="text-2xl leading-relaxed">
                  AI
                  <br />
                  answers
                  <br />
                  instantly
                </h3>
              </div>
            </motion.div>

            {/* Description Container */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/80 rounded-xl p-5"
            >
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-white/90 leading-relaxed"
              >
                Manual support is slow, repetitive, and costly. With Replin AI's fast and easy agent creation, you get instant, intelligent responses — anytime.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Steps - Outside Container */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-black/80 rounded-xl p-5 mt-4 mx-auto max-w-sm"
        >
          <div className="flex flex-wrap gap-4 justify-center text-sm font-medium">
            <div className="flex items-center gap-3">
              <span>Delay</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Holds</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Chaos</span>
              
            </div>
            <div className="flex items-center gap-3">
              <span>Support</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Overload</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center">
              <span>Frustration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const MobileFeatureSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
      {
        title: "From data to agents: Fast",
        description: "Our platform transforms your documents and data into intelligent voice agents in minutes, not weeks."
      },
      {
        title: "One prompt, many agents",
        description: "Create multiple specialized agents from a single prompt, each tailored to different customer needs."
      },
      {
        title: "No coding, start configuring",
        description: "Our intuitive interface lets you customize agent behavior without any technical expertise."
      }
    ];

    // Auto-slide functionality
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change slide every 3 seconds

      return () => clearInterval(timer);
    }, []);

    return (
      <section className="relative min-h-[70vh] mt-8 mb-12">
        <div className="mx-4">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl font-bold mb-2">Smart - Fast - Yours</h2>
            <p className="text-lg text-white/80">Configure, customize, and deploy — in minutes.</p>
          </motion.div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl mx-auto max-w-sm"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image 
                src="/image9.png" 
                alt="Background" 
                fill 
                className="object-cover brightness-[0.7]"
                priority 
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Headings Container - Side by Side */}
              <motion.div className="flex items-center mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold">
                    Manual
                    <br />
                    setup is
                    <br />
                    complex
                  </h2>
                </div>
                <div className="w-[1.5px] h-28 bg-white/90 mx-6 self-center"></div>
                <div className="flex-1">
                  <h3 className="text-3xl">
                    Replin
                    <br />
                    makes
                    <br />
                    it Easy
                  </h3>
                </div>
              </motion.div>

              {/* Slideshow Container */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-black/80 rounded-xl p-5 mb-4 min-h-[160px]"
              >
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <h4 className="text-xl font-medium text-white">
                    {slides[currentSlide].title}
                  </h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </motion.div>
              </motion.div>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-white' : 'bg-white/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom Steps */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center gap-4 mt-6 text-sm font-medium flex-wrap"
          >
            <div className="flex items-center gap-2">
              <span>Upload PDF</span>
              <div className="h-px w-6 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-2">
              <span>Craft Prompt</span>
              <div className="h-px w-6 bg-white/50"></div>
            </div>
            <div className="flex items-center">
              <span>Go Live</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const MobileSocialSection = () => (
    <section className="relative min-h-[70vh] mt-8 mb-12">
      <div className="mx-4">
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-4xl font-bold mb-2">The Hype Is Building !</h2>
          <p className="text-lg text-white/80">The momentum is real — join the wave.</p>
        </motion.div>

        {/* Main Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl mx-auto max-w-sm"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image 
              src="/image6.png" 
              alt="Background" 
              fill 
              className="object-cover brightness-[0.7]"
              priority 
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Headings Container - Side by Side */}
            <motion.div className="flex items-center justify-between mb-6">
              <div className="w-[42%]">
                <h2 className="text-2xl font-bold leading-relaxed">
                Fueling
                  <br />
                  Future Of
                  <br />
                  Fast Support
                </h2>
              </div>
              <div className="w-[2px] h-28 bg-white/90 mx-2"></div>
              <div className="w-[42%]">
                <h3 className="text-2xl leading-relaxed">
                  AI
                  <br />
                  Built for
                  <br />
                  tomorrow
                </h3>
              </div>
            </motion.div>

            {/* Description Container */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/80 rounded-xl p-5"
            >
              <motion.div className="space-y-4">
                <div>
                  <h4 className="text-xl font-medium mb-3">Join the early community shaping next AI</h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    When you join us in the first phase, you help shape the future of voice AI and secure early adopter benefits.
                  </p>
                </div>
                
                {/* Social Icons */}
                <div className="pt-4 flex justify-center items-center gap-6">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.12 18.461h-2.189v-3.425c0-.866-.018-1.982-1.208-1.982-1.21 0-1.396.946-1.396 1.921v3.486H8.13V9.91h2.099v.965h.029c.31-.588 1.07-1.207 2.2-1.207 2.35 0 2.79 1.549 2.79 3.562v4.231zM6.58 8.945c-.712 0-1.29-.578-1.29-1.29 0-.713.578-1.291 1.29-1.291.713 0 1.292.578 1.292 1.29 0 .713-.579 1.291-1.292 1.291zM7.68 18.46H5.484V9.91H7.68v8.55z"/>
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Steps */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-black/80 rounded-xl p-5 mt-4 mx-auto max-w-sm"
        >
          <div className="flex flex-wrap gap-4 justify-center text-sm font-medium">
            <div className="flex items-center gap-3">
              <span>Buzz</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Momentum</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Trust</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Hype</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center gap-3">
              <span>Adoption</span>
              <div className="h-px w-3 bg-white/50"></div>
            </div>
            <div className="flex items-center">
              <span>Community</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  const MobilePricingSection = () => {
    const [selectedPlan, setSelectedPlan] = useState('free'); // 'free' or 'pro'

    return (
      <section className="relative min-h-[70vh] mt-8 mb-12">
        <div className="mx-4">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl font-bold mb-2">Built for Scale</h2>
            <p className="text-lg text-white/80">Early access, enterprise-ready.</p>
          </motion.div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl mx-auto max-w-sm"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image 
                src="/image12.png" 
                alt="Background" 
                fill 
                className="object-cover brightness-[0.7]"
                priority 
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Plans Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-bold mb-6"
              >
                Plans
              </motion.h2>

              {/* Plan Switcher */}
              <div className="bg-black/40 p-1 rounded-lg flex mb-6">
                <button
                  onClick={() => setSelectedPlan('free')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    selectedPlan === 'free' 
                      ? 'bg-black text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Free Tier
                </button>
                <button
                  onClick={() => setSelectedPlan('pro')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    selectedPlan === 'pro' 
                      ? 'bg-black text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Replin Pro
                </button>
              </div>

              {/* Plan Details */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-black/80 rounded-xl p-6"
              >
                <motion.div
                  key={selectedPlan}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold">
                    {selectedPlan === 'free' ? 'Free Tier' : 'Replin Pro'}
                  </h3>
                  <p className="text-lg text-white/90">
                    {selectedPlan === 'free' 
                      ? 'Limited access to get you started'
                      : 'Unlimited access, premium features, team-ready, priority support.'
                    }
                  </p>
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium text-base"
                      onClick={() => selectedPlan === 'free' ? handleTryDemo() : handleContactSales()}
                    >
                      {selectedPlan === 'free' ? 'Try now' : 'Contact Sales'}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const MobileContactSection = () => {
    return (
      <section className="relative min-h-[70vh] mt-8 mb-12">
        <div className="mx-4">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl font-bold mb-2">Let's Talk AI</h2>
            <p className="text-lg text-white/80">Support feels slow, disconnected, and expensive.</p>
          </motion.div>

          {/* Main Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl mx-auto max-w-sm"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image 
                src="/image7.png" 
                alt="Background" 
                fill 
                className="object-cover brightness-[0.7]"
                priority 
              />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Title and Description */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-4xl font-bold mb-4">
                  Limited spots
                  <br />
                  available
                </h2>
                <p className="text-xl text-white/90">
                  Be among the first to experience Replin AI
                </p>
              </motion.div>

              {/* Email Input and Demo Button */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col gap-3 mb-8"
              >
                <div className="bg-black/80 rounded-lg p-4">
                  <input
                    type="email"
                    placeholder="Just enter the Email Id to get the demo"
                    className="w-full bg-transparent text-white placeholder:text-white/60 outline-none text-base"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTryDemo}
                  className="bg-white text-black py-3 px-6 rounded-lg font-medium text-base w-full"
                >
                  Try Demo
                </motion.button>
              </motion.div>

              {/* Enterprise Contact */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-lg text-white/90">
                  For Queries related to enterprise plans please reach out to our sales
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactSales}
                  className="bg-black/80 text-white py-3 px-6 rounded-lg font-medium text-base"
                >
                  Contact Sales
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-8">
      {/* Header/Navigation */}
      <header className="fixed top-4 left-4 right-4 z-[60]">
        <nav className="max-w-[1400px] mx-auto bg-black rounded-2xl py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/Logo_image.png" alt="Replin Logo" width={40} height={40} className="mr-2" />
                <span className="text-white text-xl font-semibold">Replin</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <Link href="#manual-support" className="text-base font-medium hover:text-gray-300">
                Problem
              </Link>
              <Link href="#manual-setup" className="text-base font-medium hover:text-gray-300">
                Features
              </Link>
              <Link href="#trusted-tech" className="text-base font-medium hover:text-gray-300">
                Social
              </Link>
              <Link href="#beta-now" className="text-base font-medium hover:text-gray-300">
                Pricing
              </Link>
              <Link href="#limited-spots" className="text-base font-medium hover:text-gray-300">
                Contact
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="lg" className="bg-black text-white border-white/30 hover:bg-white/10 rounded-md px-6" onClick={handleSignIn}>
                Sign in
              </Button>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-md px-6" onClick={handleTryDemo}>
                Try Demo
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors relative z-[70]"
              aria-label="Toggle menu"
            >
              <motion.div 
                animate={isMobileMenuOpen ? "open" : "closed"}
                className="flex flex-col space-y-1.5 w-6"
              >
                <motion.span 
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 }
                  }}
                  className="w-6 h-0.5 bg-white block"
                ></motion.span>
                <motion.span 
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-6 h-0.5 bg-white block"
                ></motion.span>
                <motion.span 
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 }
                  }}
                  className="w-6 h-0.5 bg-white block"
                ></motion.span>
              </motion.div>
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-40 ${
              isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <div className="fixed inset-0 bg-black"></div>
            <div className="relative z-10 flex flex-col h-full p-6">
              {/* Menu Items */}
              <div className="flex-1 flex flex-col justify-center space-y-8">
                <Link 
                  href="#manual-support" 
                  className="text-2xl font-medium hover:text-gray-300 px-4 py-2 rounded-lg hover:bg-white/10 text-center"
                  onClick={closeMobileMenu}
                >
                  Problem
                </Link>
                <Link 
                  href="#manual-setup" 
                  className="text-2xl font-medium hover:text-gray-300 px-4 py-2 rounded-lg hover:bg-white/10 text-center"
                  onClick={closeMobileMenu}
                >
                  Features
                </Link>
                <Link 
                  href="#trusted-tech" 
                  className="text-2xl font-medium hover:text-gray-300 px-4 py-2 rounded-lg hover:bg-white/10 text-center"
                  onClick={closeMobileMenu}
                >
                  Social
                </Link>
                <Link 
                  href="#beta-now" 
                  className="text-2xl font-medium hover:text-gray-300 px-4 py-2 rounded-lg hover:bg-white/10 text-center"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
                <Link 
                  href="#limited-spots" 
                  className="text-2xl font-medium hover:text-gray-300 px-4 py-2 rounded-lg hover:bg-white/10 text-center"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
              </div>

              {/* Bottom Buttons */}
              <div className="space-y-4 w-full pt-8 pb-4">
                <Button 
                  variant="outline" 
                  className="w-full bg-black text-white border-white/30 hover:bg-white/10 rounded-xl py-4 text-lg"
                  onClick={() => {
                    handleSignIn();
                    closeMobileMenu();
                  }}
                >
                  Sign in
                </Button>
                <Button 
                  className="w-full bg-white text-black hover:bg-white/90 rounded-xl py-4 text-lg"
                  onClick={() => {
                    handleTryDemo();
                    closeMobileMenu();
                  }}
                >
                  Try Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </nav>
      </header>

      {/* Conditional Hero Section Rendering */}
      {isMobile ? (
        <div className="-mx-8 -mt-8">
          <MobileHeroSection />
        </div>
      ) : (
        <section className="relative h-screen mb-48 mt-16 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0 flex flex-col justify-start">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full h-full pt-16 md:pt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full relative">
                <div className="flex flex-col justify-start">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold leading-tight"
                    >
                      <span className="whitespace-nowrap">AI Voice</span>
                      <br />
                      <span>Agents</span>
                    </motion.h1>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "11rem" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="hidden md:block w-1.5 bg-white opacity-100" 
                      style={{ minWidth: '6px' }}
                    ></motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-normal leading-tight"
                    >
                      In 3
                      <br />
                      Steps
                    </motion.h2>
                  </div>
                </div>
                <div className="hidden md:flex items-start justify-start -ml-0 sm:-ml-24 md:-ml-48 lg:-ml-72">
                  <Image
                    src="/images/hero-person.png"
                    alt="AI Assistant"
                    width={1000}
                    height={1100}
                    className="object-contain -mt-8 sm:-mt-16 md:-mt-24 lg:-mt-32"
                  />
                </div>
                {/* Mobile Image */}
                <div className="flex md:hidden items-center justify-center mt-8">
                  <Image
                    src="/images/hero-person.png"
                    alt="AI Assistant"
                    width={400}
                    height={440}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-black rounded-t-xl sm:rounded-t-2xl py-8 sm:py-12 px-4 sm:px-8 md:px-10 max-w-5xl mx-auto">
                <div className="-mt-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg sm:text-xl md:text-2xl font-medium text-center mb-4 sm:mb-6"
                  >
                    Providing <span className="font-bold">Voice Agents</span> as service
                  </motion.h3>
                  <div className="flex flex-col md:flex-row justify-center max-w-2xl mx-auto space-y-4 md:space-y-0">
                    <div className="relative flex w-full items-center">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-full"
                      >
                        <Input
                          type="email"
                          placeholder="Just enter your email to get a demo"
                          className="bg-transparent border border-white/30 text-white placeholder:text-white/70 rounded-md h-10 md:h-14 text-sm md:text-base lg:text-lg w-full"
                        />
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="absolute right-2 flex flex-col md:flex-row items-center gap-2"
                      >
                        <button className="flex items-center justify-center bg-white hover:bg-white/90 rounded-md h-8 md:h-10 px-3 md:px-4 transition-colors w-full md:w-auto">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 mr-2" aria-hidden="true">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          <span className="text-black text-xs md:text-sm font-medium">Google</span>
                        </button>
                        <Button className="bg-white text-black hover:bg-white/90 h-16 px-8 rounded-lg text-base font-medium">
                          Try Demo
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="text-xs md:text-sm text-center text-white/80 max-w-2xl mx-auto mt-4 pb-4"
                  >
                    Join 150+ Innovators — Due to high demand, access is limited. Enter your email or sign in with Google to
                    request your demo.
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Problem Section Heading */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center mt-12 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Help's on Snooze</h2>
          <h3 className="text-xl sm:text-2xl font-regular text-center mb-4 sm:mb-6">Support feels slow, disconnected, and expensive.</h3>
        </motion.div>
      )}

      {/* Conditional Problem Section Rendering */}
      {isMobile ? (
        <div className="-mx-8">
          <MobileProblemSection />
        </div>
      ) : (
        <section id="manual-support" className="relative h-screen mb-48 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-8 w-full">
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mt-24"
                  >
                    Manual
                    <br />
                    support
                    <br />
                    kills
                    <br />
                    time
                  </motion.h2>
                </div>
                <div className="flex items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "600px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-0.5 bg-white opacity-100 -ml-8 mr-8 self-start mt-8"
                  ></motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-normal leading-tight"
                    >
                      AI answers
                      <br />
                      instantly
                    </motion.h2>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="bg-black p-6 rounded-lg mb-16 max-w-md mt-12"
                    >
                      <p className="text-base">
                        Manual support is slow, repetitive, and expensive. AI voice agents can handle routine inquiries,
                        freeing up your team for complex issues.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex justify-center items-center space-x-8 mt-16"
              >
                {/* Existing items with individual animations */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Delay</p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.3 }}
                  className="h-px bg-white/50"
                ></motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.4 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Hold Time</p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.5 }}
                  className="h-px bg-white/50"
                ></motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.6 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Manual Chaos</p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.7 }}
                  className="h-px bg-white/50"
                ></motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.8 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Slow Support</p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.9 }}
                  className="h-px bg-white/50"
                ></motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 2.0 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Overload</p>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "4rem" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 2.1 }}
                  className="h-px bg-white/50"
                ></motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 2.2 }}
                  className="text-center"
                >
                  <p className="font-medium text-xl">Frustration</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section Heading */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center mt-12 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Smart - Fast - Yours</h2>
          <h3 className="text-xl sm:text-2xl font-regular text-center mb-4 sm:mb-6">Configure, customize, and deploy — in minutes.</h3>
        </motion.div>
      )}

      {/* Conditional Features Section Rendering */}
      {isMobile ? (
        <div className="-mx-8">
          <MobileFeatureSection />
        </div>
      ) : (
        <section id="manual-setup" className="relative h-screen mb-48 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-8 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mt-12"
                  >
                    Manual
                    <br />
                    setup is
                    <br />
                    complex
                  </motion.h2>
                </div>
                <div className="flex items-center -ml-32">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "600px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-2.5 bg-white opacity-100 -ml-8 mr-8 self-start mt-4"
                  ></motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight"
                    >
                      Replin AI makes it
                      <br />
                      effortless and
                      <br />
                      instant.
                    </motion.h2>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="grid grid-cols-3 gap-4 mt-12"
                    >
                      {/* Feature Cards */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="bg-black p-6 rounded-lg"
                      >
                        <h3 className="font-medium text-xl mb-4">From data to agents: Fast</h3>
                        <p className="text-base text-white/80">
                          Our platform transforms your documents and data into intelligent voice agents in minutes, not weeks.
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="bg-black p-6 rounded-lg"
                      >
                        <h3 className="font-medium text-xl mb-4">One prompt, many agents</h3>
                        <p className="text-base text-white/80">
                          Create multiple specialized agents from a single prompt, each tailored to different customer needs.
                        </p>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        className="bg-black p-6 rounded-lg"
                      >
                        <h3 className="font-medium text-xl mb-4">No coding, start configuring</h3>
                        <p className="text-base text-white/80">
                          Our intuitive interface lets you customize agent behavior without any technical expertise.
                        </p>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="flex justify-center items-center space-x-8 mt-16"
              >
                <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 1.8 }} className="text-center">
                  <p className="font-medium text-xl">Upload PDF</p>
                </motion.div>
                <motion.div initial={{ width: 0 }} whileInView={{ width: "4rem" }} transition={{ duration: 0.3, delay: 1.9 }} className="h-px bg-white/50"></motion.div>
                <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 2.0 }} className="text-center">
                  <p className="font-medium text-xl">Craft Prompt</p>
                </motion.div>
                <motion.div initial={{ width: 0 }} whileInView={{ width: "4rem" }} transition={{ duration: 0.3, delay: 2.1 }} className="h-px bg-white/50"></motion.div>
                <motion.div whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 2.2 }} className="text-center">
                  <p className="font-medium text-xl">Go Live</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Social Section Heading */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center mt-12 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">The Hype Is Building !</h2>
          <h3 className="text-xl sm:text-2xl font-regular text-center mb-4 sm:mb-6">The momentum is real — join the wave.</h3>
        </motion.div>
      )}

      {/* Conditional Social Section Rendering */}
      {isMobile ? (
        <div className="-mx-8">
          <MobileSocialSection />
        </div>
      ) : (
        <section id="trusted-tech" className="relative h-screen mb-48 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-8 w-full">
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mt-24"
                  >
                    Fueling the
                    <br />
                    Future Of
                    <br />
                    Fast Support
                  </motion.h2>
                </div>
                <div className="flex items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "600px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-0.5 bg-white opacity-100 -ml-8 mr-8 self-start mt-8"
                  ></motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-normal leading-tight"
                    >
                      Built for
                      <br />
                      tomorrow.
                    </motion.h2>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="bg-black p-6 rounded-lg mb-16 max-w-md mt-12"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-xl mb-4">Join the early community shaping next AI</h3>
                          <p className="text-base text-white/80">
                            When you join us in the first phase, you help shape the future of voice AI and secure early adopter benefits.
                          </p>
                        </div>
                        
                        {/* Social Icons */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 1 }}
                          className="flex justify-center items-center gap-8 pt-4 border-t border-white/10"
                        >
                          <motion.a 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href="#"
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </motion.a>
                          <motion.a 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href="#"
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.12 18.461h-2.189v-3.425c0-.866-.018-1.982-1.208-1.982-1.21 0-1.396.946-1.396 1.921v3.486H8.13V9.91h2.099v.965h.029c.31-.588 1.07-1.207 2.2-1.207 2.35 0 2.79 1.549 2.79 3.562v4.231zM6.58 8.945c-.712 0-1.29-.578-1.29-1.29 0-.713.578-1.291 1.29-1.291.713 0 1.292.578 1.292 1.29 0 .713-.579 1.291-1.292 1.291zM7.68 18.46H5.484V9.91H7.68v8.55z"/>
                            </svg>
                          </motion.a>
                          <motion.a 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            href="#"
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                            </svg>
                          </motion.a>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-8 mt-16">
                <div className="text-center">
                  <p className="font-medium text-xl">Buzz</p>
                </div>
                <div className="h-px w-16 bg-white/50"></div>
                <div className="text-center">
                  <p className="font-medium text-xl">Momentum</p>
                </div>
                <div className="h-px w-16 bg-white/50"></div>
                <div className="text-center">
                  <p className="font-medium text-xl">Trust</p>
                </div>
                <div className="h-px w-16 bg-white/50"></div>
                <div className="text-center">
                  <p className="font-medium text-xl">Hype </p>
                </div>
                <div className="h-px w-16 bg-white/50"></div>
                <div className="text-center">
                  <p className="font-medium text-xl">Adoption</p>
                </div>
                <div className="h-px w-16 bg-white/50"></div>
                <div className="text-center">
                  <p className="font-medium text-xl">Community</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section Heading */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center mt-12 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Built for Scale</h2>
          <h3 className="text-xl sm:text-2xl font-regular text-center mb-4 sm:mb-6">Early access, enterprise-ready.</h3>
        </motion.div>
      )}

      {/* Conditional Pricing Section Rendering */}
      {isMobile ? (
        <div className="-mx-8">
          <MobilePricingSection />
        </div>
      ) : (
        <section id="beta-now" className="relative h-screen mb-48 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1400px] mx-auto px-8 w-full">
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mt-12"
                  >
                    Beta
                    <br />
                    now
                  </motion.h2>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-24"
                  >
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="bg-black p-8 rounded-lg"
                    >
                      <h3 className="font-medium text-2xl mb-4">Free Tier</h3>
                      <p className="text-lg text-white/80 mb-8">Limited access to get you started.</p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-md px-6" onClick={handleTryDemo}>
                          Try Now
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
                <div className="flex items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "600px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-0.5 bg-white opacity-100 -ml-8 mr-8 self-start mt-18"
                  ></motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-normal leading-tight mt-18"
                    >
                      Flexible pricing later
                    </motion.h2>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="mt-24"
                    >
                      <motion.div 
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="bg-black p-8 rounded-lg"
                      >
                        <h3 className="font-medium text-2xl mb-4">Replin Pro</h3>
                        <p className="text-lg text-white/80 mb-8">
                          Unlimited access, premium features, team-ready, priority support.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="lg"
                            className="bg-black text-white border-white/30 hover:bg-white/10 rounded-md px-6"
                            onClick={handleContactSales}
                          >
                            Contact Sales
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section Heading */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center mt-12 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Let's Talk AI</h2>
          <h3 className="text-xl sm:text-2xl font-regular text-center mb-4 sm:mb-6">Support feels slow, disconnected, and expensive.</h3>
        </motion.div>
      )}

      {/* Conditional Contact Section Rendering */}
      {isMobile ? (
        <div className="-mx-8">
          <MobileContactSection />
        </div>
      ) : (
        <section id="limited-spots" className="relative h-screen mb-24 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/image2.png" alt="Background" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-start pt-32">
            <div className="max-w-[1400px] mx-auto px-8 w-full">
              <div className="grid grid-cols-2 gap-16">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
                  >
                    Limited
                  <br />
                  spots
                  <br />
                  available
                </motion.h2>
                </div>
                <div className="flex items-start">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "300px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-0.5 bg-white opacity-100 -ml-8 mr-8"
                  ></motion.div>
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-5xl md:text-6xl lg:text-7xl font-normal leading-tight"
                    >
                      Be among the
                      <br />
                      first to experience
                      <br />
                      Replin AI
                    </motion.h2>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-16 max-w-[1400px] mx-auto"
              >
                <div className="relative flex items-center gap-4">
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "calc(50% - 2rem)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="w-[calc(50%-2rem)]"
                  >
                    <Input
                      type="email"
                      placeholder="Just enter your email to get a demo"
                      className="bg-black/80 border border-white/30 text-white placeholder:text-gray-400 rounded-lg h-16 text-lg w-full"
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="flex items-center gap-4"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center bg-white hover:bg-white/90 rounded-lg h-16 px-6 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" aria-hidden="true">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-black text-base font-medium">Google</span>
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-white text-black hover:bg-white/90 h-16 px-8 rounded-lg text-base font-medium">
                        Try Demo
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="text-sm text-white/80 text-left mt-4"
                >
                  Join 150+ Innovators — Due to high demand, access is limited. Enter your email or sign in with Google to request your demo.
                </motion.p>
              </motion.div>

              {/* Contact Sales Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-[320px]"
              >
                <div className="space-y-2">
                  <p className="text-sm text-white/90">
                    For enterprise plan queries, reach out to our sales team
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactSales}
                    className="bg-black text-white border border-white/20 py-2 px-4 rounded-md text-sm hover:bg-white/10 transition-colors w-full"
                  >
                    Contact Sales
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/90 backdrop-blur-sm py-12 px-6 md:px-8 rounded-2xl">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Logo Section */}
            <div className="mb-8 md:mb-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/Logo_image.png" 
                  alt="Replin Logo" 
                  width={40} 
                  height={40} 
                  className="mr-2" 
                />
                <span className="text-white text-xl font-semibold">Replin</span>
              </Link>
              <p className="text-sm text-white/70 mt-4">© 2025 Replin AI. All rights reserved.</p>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full md:w-auto">
              <div>
                <h3 className="font-medium text-lg mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#api" className="text-sm text-white/70 hover:text-white transition-colors">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#about" className="text-sm text-white/70 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#blog" className="text-sm text-white/70 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#careers" className="text-sm text-white/70 hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="font-medium text-lg mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#terms" className="text-sm text-white/70 hover:text-white transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#privacy" className="text-sm text-white/70 hover:text-white transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#cookies" className="text-sm text-white/70 hover:text-white transition-colors">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Links - Mobile Only */}
            <div className="flex justify-center gap-6 mt-8 md:hidden">
              <Link href="#twitter" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="#linkedin" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.12 18.461h-2.189v-3.425c0-.866-.018-1.982-1.208-1.982-1.21 0-1.396.946-1.396 1.921v3.486H8.13V9.91h2.099v.965h.029c.31-.588 1.07-1.207 2.2-1.207 2.35 0 2.79 1.549 2.79 3.562v4.231zM6.58 8.945c-.712 0-1.29-.578-1.29-1.29 0-.713.578-1.291 1.29-1.291.713 0 1.292.578 1.292 1.29 0 .713-.579 1.291-1.292 1.291zM7.68 18.46H5.484V9.91H7.68v8.55z"/>
                </svg>
              </Link>
              <Link href="#instagram" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

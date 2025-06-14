'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReplinLogo } from "@/components/ui/logo"
import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// At the top of the file, after the imports
const scrollbarHideStyles = {
  scrollbarWidth: 'none',  // Firefox
  msOverflowStyle: 'none',  // IE 10+
  '&::-webkit-scrollbar': {
    display: 'none'  // Chrome, Safari, newer versions of Opera
  }
} as const;

// Add this keyframe animation at the top of the file after imports
const borderGlowKeyframes = {
  '0%': { backgroundPosition: '0% 0%' },
  '100%': { backgroundPosition: '200% 0%' }
} as const;

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFeatureSectionHovered, setIsFeatureSectionHovered] = useState(false);
  const [featureScrollProgress, setFeatureScrollProgress] = useState(0);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current || isFeatureSectionHovered) return;
      
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight * 2; // Adjust this value to control scroll length
      const progress = Math.min(Math.max(scrollPosition / maxScroll, 0), 1);
      
      setScrollProgress(progress);
      
      // Only update video time if we have a valid progress value
      if (isFinite(progress) && videoRef.current.duration) {
      videoRef.current.currentTime = progress * videoRef.current.duration;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFeatureSectionHovered]);

  useEffect(() => {
    const handleScroll = () => {
      if (!featureSectionRef.current) return;
      
      const rect = featureSectionRef.current.getBoundingClientRect();
      // Check if the section is near the viewport top
      if (rect.top <= 50 && rect.top >= -50 && !isFeatureSectionHovered) {
        setIsFeatureSectionHovered(true);
        document.body.style.overflow = 'hidden';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFeatureSectionHovered]);

  useEffect(() => {
    const handleFeatureScroll = (e: WheelEvent) => {
      if (!featureSectionRef.current || !isFeatureSectionHovered) return;
      
      e.preventDefault();
      
      // Check if enough time has passed since last scroll
      const now = Date.now();
      if (now - lastScrollTime.current < 150) { // Adjust this value to control sensitivity
        return;
      }
      lastScrollTime.current = now;

      const delta = e.deltaY;
      const isScrollingDown = delta > 0;
      
      // Only allow exiting the section when at the last feature and scrolling down
      // or at the first feature and scrolling up
      if ((isScrollingDown && currentFeatureIndex === 2) || 
          (!isScrollingDown && currentFeatureIndex === 0)) {
        setIsFeatureSectionHovered(false);
        document.body.style.overflow = '';
        
        setTimeout(() => {
          const scrollOffset = isScrollingDown ? 100 : -100;
          window.scrollBy({ top: scrollOffset, behavior: 'smooth' });
        }, 100);
        return;
      }
      
      // Update feature index
      if (isScrollingDown && currentFeatureIndex < 2) {
        setCurrentFeatureIndex(prev => prev + 1);
      } else if (!isScrollingDown && currentFeatureIndex > 0) {
        setCurrentFeatureIndex(prev => prev - 1);
      }
    };

    const featureSection = featureSectionRef.current;
    if (isFeatureSectionHovered && featureSection) {
      featureSection.addEventListener('wheel', handleFeatureScroll, { passive: false });
      return () => {
        featureSection.removeEventListener('wheel', handleFeatureScroll);
      };
    }
  }, [isFeatureSectionHovered, currentFeatureIndex]);

  const handleFeatureIndicatorClick = (index: number) => {
    if (index !== currentFeatureIndex) {
      setCurrentFeatureIndex(index);
    }
  };

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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-[4.5rem] font-medium leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Beta now
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Flexible pricing later
              </motion.span>
            </h2>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-2 gap-8 max-w-5xl">
            {/* Free Tier Card */}
          <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <motion.div 
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-2xl p-8 h-full 
                transition-all duration-300
                before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                before:bg-[length:200%_100%]
                before:animate-borderGlow
                after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                group-hover:before:opacity-100 before:opacity-40
                flex flex-col justify-between z-10"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative z-10">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-[2.5rem] font-medium mb-4"
                >
                  Free Tier
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-xl text-white/80 leading-relaxed"
                  >
                    Your Voice Agent,
                    <br />
                    On Us
                  </motion.p>
              </div>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleTryDemo}
                  className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-base font-medium 
                  transition-colors mt-8 self-start
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Try Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Pro Tier Card */}
              <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              className="relative group"
              >
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <motion.div
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-2xl p-8 h-full 
                transition-all duration-300
                before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                before:bg-[length:200%_100%]
                before:animate-borderGlow
                after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                group-hover:before:opacity-100 before:opacity-40
                flex flex-col justify-between z-10"
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative z-10">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="text-[2.5rem] font-medium mb-4"
                  >
                    Replin Pro
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="text-xl text-white/80 leading-relaxed"
                  >
                    Enterprise-grade
                    <br />
                    power. Request
                    <br />
                    access to learn more
                    <br />
                    & unlock early access
                  </motion.p>
                </div>
                    <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                      whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={handleContactSales}
                  className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-base font-medium 
                  transition-colors mt-8 self-start
                  hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Contact Sales
                    </motion.button>
                </motion.div>
              </motion.div>
            </div>
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

  const handleFeatureMouseEnter = () => {
    if (featureSectionRef.current) {
      const rect = featureSectionRef.current.getBoundingClientRect();
      if (rect.top <= 100 && rect.top >= -100) {
        setIsFeatureSectionHovered(true);
        document.body.style.overflow = 'hidden';
      }
    }
  };

  const handleFeatureMouseLeave = () => {
    setIsFeatureSectionHovered(false);
    document.body.style.overflow = '';
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
              <Image src="/Logo_image.png" alt="Replin Logo" width={64} height={64} className="mr-4" />
              <span className="text-white text-2xl font-bold">Replin</span>
              </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/70 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#contact" className="text-white/70 hover:text-white transition-colors">
                Contact
              </Link>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                className="px-4 py-1.5 rounded-full text-sm font-medium
                          border-2 border-white/30 text-white
                          hover:bg-white/5 hover:border-white
                          transition-all duration-300"
              >
                Sign In
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Conditional Hero Section Rendering */}
      {isMobile ? (
        <div className="-mx-8 -mt-8">
          <MobileHeroSection />
        </div>
      ) : (
        <section className="relative min-h-[300vh] -mx-8 -mt-8">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Video Background */}
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/video2.mp4"
              muted
              playsInline
              preload="auto"
            >
              <source src="/video2.mp4" type="video/mp4" />
            </video>

            {/* Dynamic Bottom-Up Overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent transition-transform duration-300 z-[2]"
              style={{ 
                transform: `translateY(${80 - (scrollProgress * 80)}%)` 
              }}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end pb-16 items-center text-white z-[1]">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight whitespace-nowrap flex items-center justify-center gap-3"
              >
                <span className="font-light">Providing</span>
                <span className="font-bold">AI Voice Agents</span>
                <span className="font-light">as service</span>
                    </motion.h1>
            </div>
          </div>
        </section>
      )}

      {/* Problem Section */}
      {!isMobile && (
        <section className="relative h-[85vh] bg-black py-18 mt-48">
          <div className="max-w-[1400px] mx-auto px-8">
            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Main Text Content - Takes 8 columns */}
              <div className="col-span-8">
        <motion.div 
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
              className="space-y-8"
                  >
                  <h2 className="text-[5rem] leading-none font-bold">
                    Manual support kills time — AI answers instantly
              </h2>
              
              <p className="text-2xl max-w-3xl text-white/90">
                Manual support is slow, repetitive, and costly. With Replin 
                AI's fast and easy agent creation, you get instant, intelligent 
                responses—anytime.
                      </p>
                    </motion.div>
              </div>

              {/* CTA Section - Takes 4 columns */}
              <div className="col-span-4 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-3"
                >
                  {/* Try Demo Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTryDemo}
                    className="w-[160px] bg-white text-black py-2 px-4 rounded-full font-medium text-sm
                    transition-all duration-300 relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Try Demo</span>
                  </motion.button>

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignIn}
                    className="w-[160px] bg-transparent text-white py-2 px-4 rounded-full font-medium text-sm
                    border-2 border-white/30 transition-all duration-300
                    hover:bg-white/5 hover:border-white group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Sign In</span>
                  </motion.button>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="pt-5 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">60% Faster</h4>
                        <p className="text-sm text-white/60">Response Time</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium">150+</h4>
                        <p className="text-sm text-white/60">Active Users</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Animated News Strip */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-[20%] left-0 right-0 py-6 border-t border-white/10"
            >
              <div className="flex whitespace-nowrap animate-marquee">
                <div className="flex items-center gap-8 mx-4">
                  <span className="text-xl">Delay</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Hold Time</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Manual Chaos</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Slow Support</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Overload</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Frustration</span>
            </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center gap-8 mx-4">
                  <span className="text-xl">Delay</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Hold Time</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Manual Chaos</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Slow Support</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Overload</span>
                  <div className="w-4 h-px bg-white/30"></div>
                  <span className="text-xl">Frustration</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!isMobile && (
        <section className="relative bg-black min-h-screen py-24 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8">
          {/* Section Title */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
              <motion.h2 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="text-[4.5rem] font-medium mb-4"
              >
                Smart - Fast - Yours
              </motion.h2>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-2xl text-white/70"
              >
                Configure, customize, and deploy — in minutes
              </motion.p>
            </motion.div>

            {/* Interactive Features Display */}
            <div className="relative">
              {/* Central Circular Element */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full blur-[50px]"></div>
                <div className="absolute inset-0 border border-white/20 rounded-full"></div>
                <div className="absolute inset-[2px] border border-white/10 rounded-full"></div>
              </motion.div>

              {/* Features Container */}
              <div className="relative grid grid-cols-3 gap-24 items-center">
                {/* Feature 1 - Left */}
                  <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative bg-black rounded-3xl p-8 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                      <div>
                        <h3 className="text-2xl font-medium mb-4">From Docs to Agents—Fast</h3>
                        <p className="text-white/60 leading-relaxed">
                          Upload your documents and watch as they transform into intelligent voice agents in minutes. No complex setup required.
                    </p>
                  </div>
                </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-[1px] bg-gradient-to-r from-white/40 to-transparent mt-6"
                    ></motion.div>
                  </motion.div>
                </motion.div>

                {/* Feature 2 - Center */}
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative bg-black rounded-3xl p-8 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                      <div>
                        <h3 className="text-2xl font-medium mb-4">One prompt. Agent live.</h3>
                        <p className="text-white/60 leading-relaxed">
                          Define your agent's personality and behavior with a single prompt. Watch it come to life instantly.
                    </p>
                  </div>
                </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-[1px] bg-gradient-to-r from-white/40 to-transparent mt-6"
                    ></motion.div>
                  </motion.div>
                </motion.div>

                {/* Feature 3 - Right */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative bg-black rounded-3xl p-8 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                  </div>
                      <div>
                        <h3 className="text-2xl font-medium mb-4">Skip coding. Start Configuring</h3>
                        <p className="text-white/60 leading-relaxed">
                          No coding needed. Just configure your agent's settings through our intuitive interface and go live.
                    </p>
              </div>
                </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className="h-[1px] bg-gradient-to-r from-white/40 to-transparent mt-6"
                    ></motion.div>
                </motion.div>
                </motion.div>
              </div>

              {/* Interactive Elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Animated Lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1 }}
                    d="M200 300 L600 300"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                    d="M600 300 L1000 300"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Bottom Stats */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="mt-24 grid grid-cols-3 gap-8"
              >
                <div className="text-center">
                  <h4 className="text-3xl font-bold mb-2">3 Steps</h4>
                  <p className="text-white/60">To Go Live</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold mb-2">1 Minute</h4>
                  <p className="text-white/60">Setup Time</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold mb-2">24/7</h4>
                  <p className="text-white/60">Always Available</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Social Section */}
      {!isMobile && (
        <section className="relative bg-black min-h-screen py-24 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8">
            {/* Section Title */}
        <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-24"
            >
                  <motion.h2 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                className="text-[4.5rem] font-medium mb-4"
              >
                The Hype Is Building!
                  </motion.h2>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="text-2xl text-white/70"
              >
                Join the wave of innovation
              </motion.p>
            </motion.div>

            {/* Main Content */}
            <div className="relative">
              {/* Circular Glow Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-full blur-[100px]"></div>
                </div>

              {/* Content Grid */}
              <div className="grid grid-cols-3 gap-8 relative">
                {/* Left Column - Community Stats */}
                  <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  className="space-y-8"
                >
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                    >
                      <h3 className="text-4xl font-bold mb-2">150+</h3>
                      <p className="text-white/60">Active Beta Users</p>
                    </motion.div>
                        </div>
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                    >
                      <h3 className="text-4xl font-bold mb-2">10k+</h3>
                      <p className="text-white/60">Waitlist Members</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Center Column - Social Links */}
                        <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                  className="relative"
                        >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl blur-xl"></div>
                  <div className="relative bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-2xl font-medium mb-8">Connect With Us</h3>
                    <div className="grid grid-cols-2 gap-4">
                          <motion.a 
                        href="#twitter"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </div>
                        <span>Twitter</span>
                          </motion.a>
                          <motion.a 
                        href="#linkedin"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.12 18.461h-2.189v-3.425c0-.866-.018-1.982-1.208-1.982-1.21 0-1.396.946-1.396 1.921v3.486H8.13V9.91h2.099v.965h.029c.31-.588 1.07-1.207 2.2-1.207 2.35 0 2.79 1.549 2.79 3.562v4.231zM6.58 8.945c-.712 0-1.29-.578-1.29-1.29 0-.713.578-1.291 1.29-1.291.713 0 1.292.578 1.292 1.29 0 .713-.579 1.291-1.292 1.291zM7.68 18.46H5.484V9.91H7.68v8.55z"/>
                            </svg>
                        </div>
                        <span>LinkedIn</span>
                          </motion.a>
                          <motion.a 
                        href="#discord"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </div>
                        <span>Discord</span>
                          </motion.a>
                      <motion.a
                        href="#github"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                      </div>
                        <span>GitHub</span>
                      </motion.a>
                  </div>
                </div>
                </motion.div>

                {/* Right Column - Community Highlights */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
                  className="space-y-8"
                >
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                    >
                      <h3 className="text-4xl font-bold mb-2">24/7</h3>
                      <p className="text-white/60">Community Support</p>
                    </motion.div>
              </div>
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm"
                    >
                      <h3 className="text-4xl font-bold mb-2">95%</h3>
                      <p className="text-white/60">User Satisfaction</p>
                    </motion.div>
                </div>
                </motion.div>
                </div>

              {/* Bottom Marquee */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-24 overflow-hidden py-8 border-t border-white/10"
              >
                <div className="flex whitespace-nowrap animate-marquee">
                  <div className="flex items-center gap-12 mx-4">
                    <span className="text-xl text-white/60">Innovation</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Community</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Growth</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Support</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Future</span>
                </div>
                  {/* Duplicate for seamless loop */}
                  <div className="flex items-center gap-12 mx-4">
                    <span className="text-xl text-white/60">Innovation</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Community</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Growth</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Support</span>
                    <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    <span className="text-xl text-white/60">Future</span>
                </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {!isMobile && (
        <section className="relative bg-black min-h-screen py-24">
          <div className="max-w-[1400px] mx-auto px-8">
            {/* Section Title */}
        <motion.div 
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-[4.5rem] font-medium leading-tight mb-4">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  >
                  Beta now
                </motion.span>
                    <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Flexible pricing later
                </motion.span>
              </h2>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-2 gap-8 max-w-5xl">
              {/* Free Tier Card */}
                  <motion.div 
                initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
                  >
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl p-8 h-full 
                  transition-all duration-300
                  before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                  before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                  before:bg-[length:200%_100%]
                  before:animate-borderGlow
                  after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                  group-hover:before:opacity-100 before:opacity-40
                  flex flex-col justify-between z-10"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative z-10">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="text-[2.5rem] font-medium mb-4"
                    >
                      Free Tier
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="text-xl text-white/80 leading-relaxed"
                    >
                      Your Voice Agent,
                      <br />
                      On Us
                    </motion.p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={handleTryDemo}
                    className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-base font-medium 
                    transition-colors mt-8 self-start
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Try Demo
                  </motion.button>
                      </motion.div>
                    </motion.div>

              {/* Pro Tier Card */}
                  <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <motion.div 
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl p-8 h-full 
                  transition-all duration-300
                  before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                  before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                  before:bg-[length:200%_100%]
                  before:animate-borderGlow
                  after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                  group-hover:before:opacity-100 before:opacity-40
                  flex flex-col justify-between z-10"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative z-10">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="text-[2.5rem] font-medium mb-4"
                    >
                      Replin Pro
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="text-xl text-white/80 leading-relaxed"
                    >
                      Enterprise-grade
                      <br />
                      power. Request
                      <br />
                      access to learn more
                      <br />
                      & unlock early access
                    </motion.p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={handleContactSales}
                    className="relative z-10 bg-white text-black px-8 py-4 rounded-full text-base font-medium 
                    transition-colors mt-8 self-start
                    hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                          >
                            Contact Sales
                  </motion.button>
                      </motion.div>
                    </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {!isMobile && (
        <section className="relative bg-black min-h-screen py-24">
          <div className="max-w-[1400px] mx-auto px-8">
            {/* Section Title */}
        <motion.div 
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-[4.5rem] font-medium leading-tight mb-4">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  >
                  Let's Talk AI
                </motion.span>
                  <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-white/70"
                >
                  Join the future of voice
                </motion.span>
              </h2>
            </motion.div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-2 gap-8 max-w-5xl">
              {/* Demo Request Card */}
                  <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <motion.div 
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl p-8 h-full 
                            transition-all duration-300
                            before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                            before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                            before:bg-[length:200%_100%]
                            before:animate-borderGlow
                            after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                            group-hover:before:opacity-100 before:opacity-40
                            flex flex-col justify-between z-10"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative z-10">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="text-[2.5rem] font-medium mb-6"
                    >
                      Limited spots
                      <br />
                      available
                    </motion.h3>
                    <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="text-xl text-white/80 leading-relaxed mb-8"
              >
                      Be among the first to experience
                      <br />
                      Replin AI's voice revolution
                    </motion.p>
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="space-y-4"
                  >
                      <div className="relative">
                        <input
                      type="email"
                          placeholder="Enter your email for demo access"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/40
                                   focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                        />
                      </div>
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        onClick={handleTryDemo}
                        className="w-full bg-white text-black px-8 py-4 rounded-xl text-base font-medium 
                                 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                      >
                        Request Demo Access
                    </motion.button>
                  </motion.div>
                </div>
                </motion.div>
              </motion.div>

              {/* Enterprise Contact Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <motion.div 
                  whileHover={{ scale: 1.02, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative rounded-2xl p-8 h-full 
                            transition-all duration-300
                            before:absolute before:inset-0 before:p-[2px] before:rounded-2xl before:content-['']
                            before:bg-[linear-gradient(90deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.3)_100%)]
                            before:bg-[length:200%_100%]
                            before:animate-borderGlow
                            after:absolute after:inset-[2px] after:rounded-2xl after:bg-black
                            group-hover:before:opacity-100 before:opacity-40
                            flex flex-col justify-between z-10"
                  style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative z-10">
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="text-[2.5rem] font-medium mb-6"
                    >
                      Enterprise
                      <br />
                      Solutions
                    </motion.h3>
                <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="text-xl text-white/80 leading-relaxed"
                    >
                      Looking for a custom solution?
                      <br />
                      Our enterprise team is here to help
                      <br />
                      build the perfect voice AI for
                      <br />
                      your business needs.
                </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="mt-8 space-y-6"
                    >
                      <div className="flex items-center gap-4 text-white/60">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        <span>Custom AI Model Training</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/60">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        <span>Dedicated Support Team</span>
                      </div>
                      <div className="flex items-center gap-4 text-white/60">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                        <span>API Integration Support</span>
                      </div>
                  <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                    whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={handleContactSales}
                        className="w-full bg-white text-black px-8 py-4 rounded-xl text-base font-medium 
                                 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] mt-8"
                  >
                        Contact Enterprise Team
                  </motion.button>
                    </motion.div>
                </div>
                </motion.div>
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

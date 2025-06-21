'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, useInView } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { FileText, Zap, Code, Brain, Mic, ArrowRight, Check, Mail, MessageSquare, Menu, X, Clock, Users, DollarSign, Scale } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { 
  DocumentIcon,
  SparklesIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

interface FeatureBlockProps {
  title: string;
  image: string;
  className?: string;
}

const FeatureBlock = ({ title, image, className = "" }: FeatureBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative w-full h-full bg-[#111111] overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-50"
        />
      </motion.div>

      {/* Small Circle */}
      <div className="absolute top-6 left-6 w-2 h-2 rounded-full border border-white/20" />

      {/* Title */}
      <h3 className="absolute bottom-12 left-12 text-[32px] font-medium leading-tight z-10">
        {title}
      </h3>
    </motion.div>
  );
};

const FeatureCard = ({ title, description, icon, index }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm p-8 hover:bg-white/60 transition-colors
        ${index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-black/5 backdrop-blur-sm border border-black/10">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-black/5 via-transparent to-transparent" />
          <div className="relative z-10 text-black">
            {icon}
          </div>
        </div>
        <h3 className="mb-4 text-2xl font-medium text-black">{title}</h3>
        <p className="text-lg text-black/70">{description}</p>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 bg-black/5 blur-3xl" />
    </motion.div>
  );
};

const PricingCard = ({ 
  plan, 
  price, 
  description, 
  features, 
  isPopular,
  ctaText,
  index,
  onAction
}: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  index: number;
  onAction: () => void;
}) => {
  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute right-6 top-6">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Popular
          </span>
        </div>
      )}

      {/* Gradient Background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 transition-opacity duration-300
          ${isPopular ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-2 text-xl font-medium text-white">{plan}</h3>
        <p className="mb-6 text-base text-white/60">{description}</p>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-white">₹{price}</span>
        </div>

        <div className="mb-8 space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/20 p-1">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-white/80">{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={onAction}
          className={`w-full ${
            isPopular 
              ? 'bg-primary text-black hover:bg-primary/90' 
              : plan === 'Free'
                ? 'bg-white/5 hover:bg-white/10 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          {ctaText}
        </Button>
      </div>

      {/* Corner Decoration */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rotate-12 ${
        isPopular ? 'bg-primary/20' : 'bg-white/5'
      } blur-3xl transition-all duration-300`} />
    </motion.div>
  );
};

const ContactCard = ({ 
  icon, 
  title, 
  description, 
  action, 
  link 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Gradient Background */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {icon}
          </div>
          <h3 className="mb-3 text-xl font-medium text-white">{title}</h3>
          <p className="mb-6 text-base text-white/60">{description}</p>
          
          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm font-medium">{action}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Corner Decoration */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 bg-primary/10 blur-3xl transition-all duration-300" />
      </motion.div>
    </Link>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleScroll}
      className="group relative px-3 py-2"
    >
      <span className="relative z-10 text-sm text-gray-600 transition-colors group-hover:text-black">
        {children}
      </span>
      <div className="absolute inset-0 -z-10 rounded-full bg-gray-100 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
    </Link>
  );
};

const StatCard = ({ 
  number, 
  label, 
  description 
}: { 
  number: string; 
  label: string;
  description: string;
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 text-4xl font-bold text-primary">
          {number}
        </div>
        <h3 className="mb-2 text-xl font-medium text-white">
          {label}
        </h3>
        <p className="text-sm text-white/70">
          {description}
        </p>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 bg-primary/10 blur-3xl" />
    </motion.div>
  );
};

const ProblemPoint = ({ 
  title, 
  description,
  icon
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10">
          {icon}
        </div>
      </div>
      <div className="relative flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        <div className="relative z-10">
          <h3 className="mb-2 text-lg font-medium text-white">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-white/70">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ContactForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Redirect to thank you page
      router.push('/thank-you');
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative z-10">
        <h3 className="mb-6 text-2xl font-medium text-white">Send us a message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white/60">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="mb-2 block text-sm text-white/60">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tell us about your needs..."
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-primary text-black hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>

      <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 bg-primary/10 blur-3xl" />
    </motion.div>
  );
};

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check authentication status
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        setIsAuthenticated(true);
        if (session.user?.email) {
          setUserEmail(session.user.email);
        }
      }
    };

    checkAuth();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleTryDemo = async () => {
    if (isAuthenticated) {
      // Check if user is a first-time user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('first_login')
          .eq('id', user.id)
          .single();

        if (userData?.first_login) {
          router.push('/demo');
          return;
        }
      }
      // For returning users, go to dashboard
      router.push('/dashboard');
    } else {
      router.push('/signin?mode=demo');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push('/');
  };

  const handleContactSales = (plan: string) => {
    router.push(`/sales?plan=${plan}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Update the desktop navigation buttons
  const desktopNavButtons = (
    <div className="ml-8 flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-gray-600">{userEmail}</span>
          <Button 
            variant="ghost"
            className="text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="group relative overflow-hidden rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Dashboard
            <motion.div
              className="absolute inset-0 -z-10 translate-y-[100%] bg-white/10 transition-transform duration-300 group-hover:translate-y-0"
            />
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="ghost"
            className="text-sm text-gray-600 hover:bg-gray-100 hover:text-black"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <Button 
            onClick={handleTryDemo}
            className="group relative overflow-hidden rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Try Demo
            <motion.div
              className="absolute inset-0 -z-10 translate-y-[100%] bg-white/10 transition-transform duration-300 group-hover:translate-y-0"
            />
          </Button>
        </>
      )}
    </div>
  );

  // Update the mobile navigation
  const mobileNavContent = (
    <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
      <Link 
        href="#solution" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Home
      </Link>
      <Link 
        href="#features" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Features
      </Link>
      <Link 
        href="#replin-fm" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Replin FM
      </Link>
      <Link 
        href="#problem" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Why Us
      </Link>
      <Link 
        href="#pricing" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Pricing
      </Link>
      <Link 
        href="#about" 
        className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
      >
        Contact
      </Link>
      <div className="border-t border-gray-200 pt-4">
        {isAuthenticated ? (
          <>
            <div className="px-4 py-2 text-sm text-gray-600">{userEmail}</div>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-black text-white hover:bg-black/90 mb-2"
            >
              Dashboard
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-100"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleTryDemo}
            className="w-full bg-black text-white hover:bg-black/90"
          >
            Try Demo
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Updated Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10">
        {/* Backdrop Blur */}
        <div className="absolute inset-0 -z-10 backdrop-blur-xl">
          <div className="absolute inset-0 bg-white/70" />
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Email */}
            <div className="flex items-center space-x-12">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/Logo_image.png" 
                  alt="Replin AI Logo" 
                  width={40} 
                  height={40}
                  className="rounded"
                />
                <span className="text-xl font-medium text-black">Replin AI</span>
              </Link>
              <motion.span 
                className="hidden text-sm text-gray-600 lg:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                sahil@replinai.com
              </motion.span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-4 md:flex">
              <div className="flex items-center space-x-2">
                <NavLink href="#solution">Home</NavLink>
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#replin-fm">Replin FM</NavLink>
                <NavLink href="#problem">Why Us</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
                <NavLink href="#about">Contact</NavLink>
              </div>

              {desktopNavButtons}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-black md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {mobileNavContent}
          </motion.div>
        </nav>

        {/* Progress Bar */}
        <motion.div 
          className="h-[2px] bg-black"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "0%" }}
        />
      </header>

      <main>
        {/* Hero Section */}
        <section id="solution" className="relative min-h-screen">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/backg2.png"
              alt="Wave Background"
              fill 
              className="object-cover"
              priority 
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-32">
            <div className="flex flex-col lg:flex-row justify-between items-start">
              {/* Left Content */}
              <div className="max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-6xl sm:text-[80px] font-medium leading-none tracking-tight mb-6 text-black">
                    AI Voice Agents
                  </h1>
                  <p className="text-xl text-black/80 mb-8">
                    Create Voice agents like never before
                  </p>
                  <Button 
                    onClick={handleTryDemo}
                    className="px-6 py-3 text-white bg-black hover:bg-black/90 transition-colors inline-flex items-center gap-2"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Try Demo'}
                    <svg className="w-4 h-4 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </motion.div>
              </div>

              {/* Right Content - New Release Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 lg:mt-0"
              >
                <Link href="#replin-fm" className="block">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-sm border border-black/10 hover:bg-white/90 transition-all transform hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-sm overflow-hidden relative">
                        <Image 
                          src="/backg3.png"
                          alt="Replin FM 2.0"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-red-500">NEW RELEASE</span>
                        <h3 className="text-sm font-medium mt-1 text-black">Replin Fm 2.0</h3>
                        <p className="text-xs text-black/60">AI Voice Agent Generation</p>
                      </div>
                      <svg className="w-4 h-4 text-black/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative overflow-hidden bg-white py-24">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="mb-16 max-w-2xl">
              <motion.h2 
                className="mb-6 text-5xl font-medium text-black"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Features that make AI voice agents effortless
              </motion.h2>
              <motion.p 
                className="text-xl text-black/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Transform your customer interactions with powerful AI capabilities
              </motion.p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FeatureCard
                title="From Docs to Agents"
                description="Upload your documents and instantly create intelligent voice agents that understand your business"
                icon={<DocumentIcon className="w-7 h-7" />}
                index={0}
              />
              <FeatureCard
                title="One Prompt Setup"
                description="Get your agent up and running with a single prompt. No complex training required"
                icon={<SparklesIcon className="w-7 h-7" />}
                index={1}
              />
              <FeatureCard
                title="Skip Coding"
                description="Focus on your business logic while we handle the technical complexities"
                icon={<CodeBracketIcon className="w-7 h-7" />}
                index={2}
              />
              <FeatureCard
                title="Real-time Learning"
                description="Your agents continuously learn and improve from each interaction"
                icon={<CpuChipIcon className="w-7 h-7" />}
                index={3}
              />
              <FeatureCard
                title="Voice Customization"
                description="Choose from a variety of voices or create your own custom voice identity"
                icon={<SpeakerWaveIcon className="w-7 h-7" />}
                index={4}
              />
            </div>

            {/* Call to Action */}
            <motion.div 
              className="mt-16 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                onClick={handleTryDemo}
                className="group flex items-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-medium text-white hover:bg-black/90"
              >
                Try it yourself
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>

          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
          </div>
        </section>

        {/* Replin FM 2.0 Section */}
        <section id="replin-fm" className="relative overflow-hidden bg-white py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Left Column - Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <span className="text-sm font-medium text-red-500 mb-4 block">INTRODUCING</span>
                  <h2 className="mb-6 text-5xl font-medium leading-tight text-black">
                    Replin FM 2.0
                    <span className="block text-2xl mt-2 text-black/60">AI Voice Agent Generation Framework</span>
                  </h2>
                  <p className="text-xl text-black/70">
                    Create powerful AI voice agents in minutes, not hours. Upload your knowledge base, 
                    write a prompt, and launch your agent with just a few clicks.
                  </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black mb-2">Upload Knowledge Base</h3>
                      <p className="text-black/60">Simply upload your documentation, FAQs, or any text-based knowledge.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black mb-2">Write Your Prompt</h3>
                      <p className="text-black/60">Define your agent's personality and behavior with a simple prompt.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black mb-2">Launch Your Agent</h3>
                      <p className="text-black/60">Choose between Web Call or Voice STD Call and go live instantly.</p>
                    </div>
                  </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12"
                >
                  <div className="inline-flex gap-4">
                    <Button
                      onClick={handleTryDemo}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      Try it Now
                    </Button>
                    <Link 
                      href="https://youtu.be/y2gZcudwM1Q?si=MLNpqz8FPhOa4cR2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="border-black bg-black text-white hover:bg-black/90"
                      >
                        Watch Demo
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Interactive Demo */}
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm p-8"
                >
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">Choose Deployment Type</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-black/10 rounded-lg p-4 cursor-pointer hover:bg-black/5">
                          <h4 className="font-medium text-black">Web Call</h4>
                          <p className="text-sm text-black/60">Browser-based voice interactions</p>
                        </div>
                        <div className="border border-black/10 rounded-lg p-4 cursor-pointer hover:bg-black/5">
                          <h4 className="font-medium text-black">Voice STD Call</h4>
                          <p className="text-sm text-black/60">Standard telephone integration</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">Configuration Time</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-black" />
                        <span className="text-2xl font-bold text-black">2 minutes</span>
                        <span className="text-black/60">average setup time</span>
                      </div>
                    </div>

                    <div className="bg-black/5 rounded-lg p-4">
                      <h4 className="font-medium text-black mb-2">Quick Start Guide</h4>
                      <ul className="space-y-2 text-sm text-black/60">
                        <li>✓ Upload your PDF, DOC, or TXT files</li>
                        <li>✓ Configure agent personality</li>
                        <li>✓ Select voice type and language</li>
                        <li>✓ Choose deployment method</li>
                        <li>✓ Start taking calls</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Background Decoration */}
                <div className="absolute -z-10 inset-0 bg-gradient-to-r from-black/5 to-transparent rounded-2xl transform translate-x-4 translate-y-4" />
              </div>
            </div>
          </div>

          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
          </div>
        </section>

        {/* Problem Statement Section */}
        <section id="problem" className="relative overflow-hidden bg-black py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Left Column - Problem Statement */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="mb-6 text-5xl font-medium leading-tight">
                    Traditional customer support is{' '}
                    <span className="text-primary">broken</span>
                  </h2>
                  <p className="text-xl text-white/60">
                    Businesses struggle with scaling support operations while maintaining quality. 
                    Here's why current solutions fall short:
                  </p>
                </motion.div>

                <div className="space-y-8">
                  <ProblemPoint
                    icon={<Clock className="h-5 w-5 text-primary" />}
                    title="Time-Consuming Training"
                    description="Traditional agent training takes weeks or months, leading to high costs and delayed deployment of support staff."
                  />
                  <ProblemPoint
                    icon={<Users className="h-5 w-5 text-primary" />}
                    title="Inconsistent Responses"
                    description="Human agents provide varying levels of service quality, leading to inconsistent customer experiences."
                  />
                  <ProblemPoint
                    icon={<DollarSign className="h-5 w-5 text-primary" />}
                    title="High Operational Costs"
                    description="Maintaining a large support team with 24/7 coverage requires significant investment in hiring and infrastructure."
                  />
                  <ProblemPoint
                    icon={<Scale className="h-5 w-5 text-primary" />}
                    title="Limited Scalability"
                    description="Traditional support models struggle to handle sudden spikes in demand without compromising service quality."
                  />
                </div>
              </div>

              {/* Right Column - Stats and Solution */}
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <StatCard
                    number="85%"
                    label="Cost Reduction"
                    description="Lower operational costs compared to traditional support teams"
                  />
                  <StatCard
                    number="24/7"
                    label="Availability"
                    description="Round-the-clock support without additional staffing"
                  />
                  <StatCard
                    number="< 1min"
                    label="Setup Time"
                    description="Quick deployment of new AI agents from existing documents"
                  />
                  <StatCard
                    number="99.9%"
                    label="Consistency"
                    description="Uniform responses across all customer interactions"
                  />
                </div>

                {/* Solution Statement */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="relative z-10">
                    <h3 className="mb-4 text-2xl font-medium text-white">
                      Replin AI solves these challenges
                    </h3>
                    <p className="mb-6 text-white/60">
                      Our AI voice agents provide instant, scalable, and consistent support while 
                      significantly reducing operational costs. Transform your customer service 
                      with intelligent automation.
                    </p>
                    <Button
                      onClick={handleTryDemo}
                      className="group flex items-center gap-2 bg-primary text-black hover:bg-primary/90"
                    >
                      See How It Works
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                  <div className="absolute -right-4 -top-4 h-32 w-32 rotate-12 bg-primary/20 blur-3xl" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative overflow-hidden bg-black py-24">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <motion.h2 
                className="mb-6 text-5xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Simple, transparent pricing
              </motion.h2>
              <motion.p 
                className="mx-auto max-w-2xl text-xl text-white/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Start with our free plan and scale as you grow. No hidden fees or surprises.
              </motion.p>
            </div>

            {/* Pricing Grid */}
            <div className="grid gap-8 md:grid-cols-3">
              <PricingCard
                plan="Free Demo"
                price="0"
                description="Perfect for trying out Replin AI"
                features={[
                  "One to one Demo",
                  "Special mentoring on using Replin AI",
                  "Exploration of tools & Features"
                ]}
                isPopular={false}
                ctaText="Start Free Trial"
                index={0}
                onAction={handleTryDemo}
              />
              <PricingCard
                plan="Pay as you go"
                price="6 per minute"
                description="Ideal for growing businesses"
                features={[
                  "Minutes per request",
                  "1/more AI agents",
                  "Advanced training",
                  "Priority support",
                  "Embedding support", 
                  "API access"
                ]}
                isPopular={true}
                ctaText="Contact Sales"
                index={1}
                onAction={() => handleContactSales('Pro')}
              />
              <PricingCard
                plan="Enterprise"
                price="Custom"
                description="For large-scale deployments"
                features={[
                  "Custom minutes",
                  "Custom AI agents",
                  "Custom voice development",
                  "24/7 dedicated support",
                  "Custom integrations"
                ]}
                isPopular={false}
                ctaText="Contact Sales"
                index={2}
                onAction={() => handleContactSales('Enterprise')}
              />
            </div>

            {/* FAQ Note */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-white/60">
                Have questions? Check out our{' '}
                <Link href="#faq" className="text-primary hover:text-primary/80">
                  FAQ
                </Link>
                {' '}or{' '}
                <Link href="#contact" className="text-primary hover:text-primary/80">
                  contact us
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </section>

        {/* Contact Section */}
        <section id="about" className="relative overflow-hidden bg-black py-24">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <motion.h2 
                className="mb-6 text-5xl font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Get in touch
              </motion.h2>
              <motion.p 
                className="mx-auto max-w-2xl text-xl text-white/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Have questions? We're here to help you get started with Replin AI
              </motion.p>
            </div>

            {/* Contact Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column - Contact Form */}
              <ContactForm />

              {/* Right Column - Contact Cards */}
              <div className="space-y-8">
                <ContactCard
                  icon={<Mail className="h-6 w-6 text-primary" />}
                  title="Email us"
                  description="Drop us a line anytime. We'll get back to you within 24 hours."
                  action="sahil@replinai.com"
                  link="mailto:sahil@replinai.com"
                />
                <ContactCard
                  icon={<FileText className="h-6 w-6 text-primary" />}
                  title="Documentation"
                  description="Explore our comprehensive guides and API documentation."
                  action="View documentation"
                  link="#docs"
                />
              </div>
            </div>

            {/* Social Links */}
            <motion.div 
              className="mt-16 flex justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                href="#twitter" 
                className="text-white/60 hover:text-white transition-colors"
              >
                Twitter
              </Link>
              <Link 
                href="#linkedin" 
                className="text-white/60 hover:text-white transition-colors"
              >
                LinkedIn
              </Link>
              <Link 
                href="#github" 
                className="text-white/60 hover:text-white transition-colors"
              >
                GitHub
              </Link>
            </motion.div>
          </div>

          {/* Background Decorations */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Image src="/Logo_image.png" alt="Replin Logo" width={32} height={32} className="rounded" />
                <span className="text-lg font-medium text-white">Replin AI</span>
              </div>
              <p className="text-sm text-white/60">
                Revolutionizing customer support with AI-powered voice agents. Transform your business communication today.
              </p>
              <div className="flex space-x-4">
                <Link href="#twitter" className="text-white/40 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#linkedin" className="text-white/40 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#github" className="text-white/40 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#features" className="text-sm text-white/60 hover:text-white">Features</Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-white/60 hover:text-white">Pricing</Link>
                </li>
                <li>
                  <Link href="#docs" className="text-sm text-white/60 hover:text-white">Documentation</Link>
                </li>
                <li>
                  <Link href="#api" className="text-sm text-white/60 hover:text-white">API Reference</Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#about" className="text-sm text-white/60 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link href="#blog" className="text-sm text-white/60 hover:text-white">Blog</Link>
                </li>
                <li>
                  <Link href="#careers" className="text-sm text-white/60 hover:text-white">Careers</Link>
                </li>
                <li>
                  <Link href="#contact" className="text-sm text-white/60 hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#privacy" className="text-sm text-white/60 hover:text-white">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#terms" className="text-sm text-white/60 hover:text-white">Terms of Service</Link>
                </li>
                <li>
                  <Link href="#security" className="text-sm text-white/60 hover:text-white">Security</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-center text-sm text-white/60">
              © {new Date().getFullYear()} Replin AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

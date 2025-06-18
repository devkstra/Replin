"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ArrowRight,
  Phone,
  Upload,
  FileText,
  BarChart,
  Settings,
  ShoppingCart,
  HelpCircle,
  Mic,
  User,
  Bot,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Section = 'upload' | 'select-number' | 'buy-number' | 'transcripts' | 'usage-stats' | 'configure' | 'control' | 'collections' | 'settings' | 'help';

type SidebarProps = {
  onBackToHome: () => void;
  onSectionChange: (section: Section) => void;
  activeSection: Section;
};

export default function Sidebar({ onBackToHome, onSectionChange, activeSection }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    if (!isMounted) return;
    
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setExpanded(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSectionChange = (section: Section) => {
    onSectionChange(section);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        className="lg:hidden fixed top-5 left-2 z-50 p-2 bg-background rounded-lg border shadow-sm"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ 
          x: isMobileMenuOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -320,
          width: expanded ? 250 : 80 
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed lg:relative h-screen bg-background border-r border-border flex flex-col z-50",
          expanded ? "items-start" : "items-center",
          "shadow-xl lg:shadow-none"
        )}
      >
        <div className={cn(
          "flex items-center h-16 border-b border-border w-full px-4",
          expanded ? "justify-between" : "justify-center"
        )}>
          {expanded ? (
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/Logo.png"
                  alt="Replin.ai Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold">Replin.ai</span>
            </div>
          ) : (
            <div className="relative h-8 w-8">
              <Image
                src="/Logo.png"
                alt="Replin.ai Logo"
                fill
                className="object-contain"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            className="h-8 w-8 hidden lg:flex"
          >
            {expanded ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 w-full py-4 overflow-y-auto">
          <div className="space-y-2 px-3">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className={cn(
                "w-full justify-start",
                !expanded && "justify-center px-0"
              )}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {expanded && <span>Back to Home</span>}
            </Button>
            
            <div className={cn(
              "h-px bg-border my-4",
              !expanded && "mx-2"
            )} />
            
            <NavItem 
              icon={<Phone />} 
              label="Select Number" 
              expanded={expanded}
              onClick={() => handleSectionChange('select-number')}
              active={activeSection === 'select-number'}
            />

            <NavItem 
              icon={<ShoppingCart />} 
              label="Buy a Number" 
              expanded={expanded}
              onClick={() => handleSectionChange('buy-number')}
              active={activeSection === 'buy-number'}
            />

            <NavItem 
              icon={<Bot />} 
              label="Build the Agent" 
              expanded={expanded}
              onClick={() => handleSectionChange('upload')}
              active={activeSection === 'upload'}
            />

            <NavItem 
              icon={<FileText />} 
              label="Transcripts" 
              expanded={expanded}
              onClick={() => handleSectionChange('transcripts')}
              active={activeSection === 'transcripts'}
            />

            <NavItem 
              icon={<BarChart />} 
              label="Usage Stats" 
              expanded={expanded}
              onClick={() => handleSectionChange('usage-stats')}
              active={activeSection === 'usage-stats'}
            />
            
            <div className={cn(
              "h-px bg-border my-4",
              !expanded && "mx-2"
            )} />
            
            <NavItem 
              icon={<Settings />} 
              label="Settings" 
              expanded={expanded}
              onClick={() => handleSectionChange('settings')}
              active={activeSection === 'settings'}
            />

            <NavItem 
              icon={<HelpCircle />} 
              label="Help & Support" 
              expanded={expanded}
              onClick={() => handleSectionChange('help')}
              active={activeSection === 'help'}
            />
          </div>
        </div>
        
        <div className={cn(
          "p-4 border-t border-border w-full",
          expanded ? "" : "flex justify-center"
        )}>
          {expanded ? (
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">User Account</div>
                <div className="text-xs text-muted-foreground">Free Trial User</div>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({ icon, label, expanded, active, onClick }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        !expanded && "justify-center px-0",
        active && "bg-secondary"
      )}
      onClick={onClick}
    >
      <span className={expanded ? "mr-2" : ""}>{icon}</span>
      {expanded && <span>{label}</span>}
    </Button>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Upload, Bot, PlayCircle, X } from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Upload Documents",
    description: "Start by uploading your documents. These will be used to train your AI agent.",
    icon: <Upload className="w-6 h-6 text-primary" />
  },
  {
    id: 2,
    title: "Build the Agent",
    description: "Configure your agent's personality, voice, and behavior to match your needs.",
    icon: <Bot className="w-6 h-6 text-primary" />
  },
  {
    id: 3,
    title: "Control Agent",
    description: "Finally, control and interact with your AI agent through voice or text.",
    icon: <PlayCircle className="w-6 h-6 text-primary" />
  }
];

export default function TutorialHints() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem('tutorialSeen');
      
      // Show tutorial if user hasn't seen it
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowHint(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Reset tutorial for testing (remove in production)
  const resetTutorial = () => {
    localStorage.removeItem('tutorialSeen');
    setDismissed(false);
    setShowHint(true);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('tutorialSeen', 'true');
    // Animate out
    setTimeout(() => {
      setShowHint(false);
    }, 300);
  };

  // For development: Add a button to reset tutorial (remove in production)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 't') {
        resetTutorial();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!showHint || dismissed) return null;

  const currentHint = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100]"
        onClick={handleDismiss}
      />

      {/* Tutorial Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed lg:absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[110] w-full max-w-sm px-4"
        style={{
          marginLeft: 'calc(var(--sidebar-width, 0px) / 2)' // Adjust for sidebar
        }}
      >
        <div className="bg-background/95 backdrop-blur-sm rounded-xl shadow-lg border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                {currentHint.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-2">{currentHint.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{currentHint.description}</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1.5">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
              >
                Skip
              </Button>
              <Button
                size="sm"
                onClick={handleNext}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Got it' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 
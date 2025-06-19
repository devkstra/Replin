"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type UserType = 'student' | 'professional' | 'business' | 'other';
type ReferralSource = 'search' | 'social_media' | 'friend' | 'advertisement' | 'other';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isDeveloper, setIsDeveloper] = useState<boolean>(false);
  const [interestedInAI, setInterestedInAI] = useState<boolean>(false);
  const [referralSource, setReferralSource] = useState<ReferralSource | null>(null);

  // Get the final destination from the next parameter
  const nextDestination = searchParams.get('next') || '/dashboard';
  const isDemo = searchParams.get('mode') === 'demo';

  // Check if user needs onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/signin');
          return;
        }

        // Check if user has already completed onboarding
        const { data: onboardingData } = await supabase
          .from('user_onboarding')
          .select('completed_at')
          .eq('id', user.id)
          .single();

        if (onboardingData?.completed_at) {
          // User has already completed onboarding, redirect to final destination
          router.push(nextDestination);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast.error('Something went wrong. Please try again.');
        router.push('/signin');
      }
    };

    checkOnboarding();
  }, [router, nextDestination]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Save responses
      const { error } = await supabase
        .from('user_onboarding')
        .insert([
          {
            id: user.id,
            user_type: userType,
            is_developer: isDeveloper,
            interested_in_ai: interestedInAI,
            referral_source: referralSource,
            completed_at: new Date().toISOString(),
            skipped: false
          }
        ]);

      if (error) throw error;

      // Redirect to the final destination
      router.push(nextDestination);
    } catch (error) {
      console.error('Error saving onboarding responses:', error);
      toast.error('Failed to save responses. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Mark as skipped
      const { error } = await supabase
        .from('user_onboarding')
        .insert([
          {
            id: user.id,
            skipped: true,
            completed_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Redirect to the final destination
      router.push(nextDestination);
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast.error('Failed to skip. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-black" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2">
              <Image 
                src="/Logo_image.png" 
                alt="Replin AI Logo" 
                width={40} 
                height={40}
                className="rounded"
              />
              <span className="text-xl font-medium">Replin AI</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-center text-3xl font-medium">
            Help us personalize your experience
          </h1>
          <p className="mb-8 text-center text-white/60">
            Answer a few quick questions to get started (optional)
          </p>

          <div className="space-y-8">
            {/* User Type */}
            <div className="space-y-4">
              <Label>I am a...</Label>
              <RadioGroup
                value={userType || ''}
                onValueChange={(value) => setUserType(value as UserType)}
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'student', label: 'Student' },
                    { value: 'professional', label: 'Professional' },
                    { value: 'business', label: 'Business' },
                    { value: 'other', label: 'Other' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value}>{label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Developer Status */}
            <div className="flex items-center justify-between">
              <Label>Are you a developer?</Label>
              <Switch
                checked={isDeveloper}
                onCheckedChange={setIsDeveloper}
              />
            </div>

            {/* AI Interest */}
            <div className="flex items-center justify-between">
              <Label>Interested in AI/ML?</Label>
              <Switch
                checked={interestedInAI}
                onCheckedChange={setInterestedInAI}
              />
            </div>

            {/* Referral Source */}
            <div className="space-y-4">
              <Label>How did you hear about us?</Label>
              <RadioGroup
                value={referralSource || ''}
                onValueChange={(value) => setReferralSource(value as ReferralSource)}
              >
                <div className="space-y-2">
                  {[
                    { value: 'search', label: 'Search Engine' },
                    { value: 'social_media', label: 'Social Media' },
                    { value: 'friend', label: 'Friend/Colleague' },
                    { value: 'advertisement', label: 'Advertisement' },
                    { value: 'other', label: 'Other' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`ref-${value}`} />
                      <Label htmlFor={`ref-${value}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-primary text-black hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-white/60 hover:text-white"
                disabled={isLoading}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
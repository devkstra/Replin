"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function SalesInquiry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') || 'Pro';
  
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [contactPreference, setContactPreference] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('sales_inquiries')
        .insert([
          {
            name,
            email,
            company,
            plan_type: planType,
            contact_preference: contactPreference,
            phone_number: phoneNumber,
            preferred_time: preferredTime,
            additional_info: additionalInfo,
            status: 'new'
          }
        ]);

      if (error) throw error;

      toast.success("Thank you for your interest! We'll contact you soon.");
      router.push('/thank-you?type=sales');
    } catch (error) {
      console.error('Error submitting sales inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-medium mb-2">Contact Sales</h1>
          <p className="text-white/60 mb-8">
            Tell us about your needs and we'll get back to you shortly
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10"
                  required
                  disabled={!!session}
                />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div>
                <Label>Preferred Contact Method</Label>
                <RadioGroup 
                  value={contactPreference} 
                  onValueChange={setContactPreference}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                </RadioGroup>
              </div>

              {contactPreference === "phone" && (
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="time">Best Time to Contact</Label>
                <Select value={preferredTime} onValueChange={setPreferredTime}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="info">Additional Information</Label>
                <Textarea
                  id="info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="bg-white/5 border-white/10"
                  placeholder="Tell us about your specific needs or questions..."
                  rows={4}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 
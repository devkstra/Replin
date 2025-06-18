"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/dashboard/Sidebar";
import DocumentUpload from "@/components/dashboard/DocumentUpload";
import CallTypeSelector from "@/components/dashboard/CallTypeSelector";
import AgentConfig from '@/components/dashboard/AgentConfig';
import AgentControl from '@/components/dashboard/AgentControl';
import CollectionsList from '@/components/dashboard/CollectionsList';
import { Lock, Mail, Shield } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import TutorialHints from "@/components/dashboard/TutorialHints";
import { supabase } from "@/lib/supabase";

type Section = 'upload' | 'select-number' | 'buy-number' | 'transcripts' | 'usage-stats' | 'configure' | 'control' | 'collections' | 'settings' | 'help';

export default function Dashboard() {
  const router = useRouter();
  const [callType, setCallType] = useState("inbound");
  const [userId, setUserId] = useState("100xEngineers");
  const [activeSection, setActiveSection] = useState<Section>('upload');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/signin');
        return;
      }

      // Set the user ID from the authenticated user's email
      setUserId(session.user.email || session.user.id);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleCallTypeChange = (type: string) => {
    setCallType(type);
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const ComingSoonSection = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-card rounded-lg border p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{title}</h2>
      <p className="text-lg sm:text-xl text-muted-foreground text-center">
        Coming Soon! We're working hard to bring you this feature.
      </p>
    </div>
  );

  const ProFeatureSection = ({ title, description }: { title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[300px] sm:h-[500px] bg-card rounded-lg border p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center">{title}</h2>
      </div>
      <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-2xl">
        You are currently using the free plan. This feature is available for Pro users only.
      </p>
      <p className="text-base sm:text-lg text-muted-foreground text-center mt-2 max-w-2xl">
        {description}
      </p>
      <Button className="mt-8" size="lg">
        Upgrade to Pro
      </Button>
    </div>
  );

  const SettingsSection = () => (
    <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Settings</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-semibold">Privacy Settings</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="privacy-mode">Privacy Mode</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, your data will not be used for enhancing your experience
              </p>
            </div>
            <Switch
              id="privacy-mode"
              checked={privacyMode}
              onCheckedChange={setPrivacyMode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HelpSupportSection = () => (
    <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Help & Support</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-semibold">Contact Support</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-lg mb-4">
            Need help? Our support team is here to assist you.
          </p>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-lg overflow-hidden">
            <Mail className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground text-sm sm:text-base truncate">support@replinai.com</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'select-number':
        return <ComingSoonSection title="Select Your Number" />;
      case 'buy-number':
        return <ComingSoonSection title="Buy a Number" />;
      case 'transcripts':
        return (
          <ProFeatureSection 
            title="Call Transcripts" 
            description="Access detailed transcripts of all your calls, with advanced search and analysis features."
          />
        );
      case 'usage-stats':
        return (
          <ProFeatureSection 
            title="Usage Statistics" 
            description="Get detailed insights into your usage patterns, call analytics, and performance metrics."
          />
        );
      case 'upload':
        return (
          <div className="space-y-6">
            <Tabs value={activeTab} defaultValue="upload" className="space-y-4" onValueChange={handleTabChange}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="upload" className="text-sm">Upload Documents</TabsTrigger>
                  <TabsTrigger value="build" className="text-sm">Build the Agent</TabsTrigger>
                  <TabsTrigger value="control" className="text-sm">Agent Control</TabsTrigger>
                  <TabsTrigger value="collections" className="text-sm">Collections</TabsTrigger>
                </TabsList>
                <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md whitespace-nowrap">
                  Upload → Build → Control
                </div>
              </div>

              <TabsContent value="upload" className="space-y-4">
                <div className="bg-card p-2 sm:p-4 rounded-lg border">
                  <DocumentUpload userId={userId} onNavigateTab={handleTabChange} />
                </div>
              </TabsContent>

              <TabsContent value="build" className="space-y-4">
                <AgentConfig userId={userId} onNavigateTab={handleTabChange} />
              </TabsContent>

              <TabsContent value="control" className="space-y-4">
                <AgentControl userId={userId} />
              </TabsContent>

              <TabsContent value="collections" className="space-y-4">
                <CollectionsList userId={userId} />
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'settings':
        return <SettingsSection />;
      case 'help':
        return <HelpSupportSection />;
      default:
        return null;
    }
  };

  // Don't render until mounted and auth is checked
  if (!isMounted || isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background" style={{ '--sidebar-width': '250px' } as any}>
      <Sidebar 
        onBackToHome={handleBackToHome} 
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="p-4 border-b space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold pl-12 lg:pl-0">Replin Ai Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto max-w-xs">
                <Label htmlFor="userId" className="whitespace-nowrap text-sm">User ID:</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={handleUserIdChange}
                  className="h-8 text-sm"
                  placeholder="Enter User ID"
                  disabled
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="h-8"
              >
                Sign Out
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <CallTypeSelector 
              selectedType={callType} 
              onTypeChange={handleCallTypeChange} 
            />
          </div>
        </div>
        
        <div className="flex-1 p-2 sm:p-4 overflow-auto">
          {renderContent()}
        </div>

        {/* Tutorial Hints */}
        <TutorialHints />
      </div>
    </div>
  );
} 
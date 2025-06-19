'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { configureAgent, fetchUserConfig } from "@/utils/api";
import { AgentConfigFormData, UserIdProps } from '@/types';
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, CheckCircle2, Info, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';

interface AgentConfigProps extends UserIdProps {
  onNavigateTab?: (tab: string) => void;
}

export default function AgentConfig({ userId, onNavigateTab }: AgentConfigProps) {
  const [configTab, setConfigTab] = useState<string>("behavior");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedConfig, setSavedConfig] = useState<AgentConfigFormData | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AgentConfigFormData>({
    defaultValues: {
      system_prompt: 'You are a helpful assistant. Provide accurate and concise information based on the documents provided.',
      voice: 'alloy',
      model: 'gpt-4o-mini',
      agent_name: 'Assistant',
      language: 'en',
    }
  });
  
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const loadUserConfig = async () => {
      try {
        setLoading(true);
        const config = await fetchUserConfig(userId);
        setSavedConfig(config);
        reset(config);
      } catch (error) {
        // If it's a 404 error, this is just the first time a user is configuring
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log('No existing configuration found, using defaults');
        } else {
          console.error('Error fetching configuration:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserConfig();
  }, [userId, reset]);

  const onSubmit: SubmitHandler<AgentConfigFormData> = async (data) => {
    try {
      const result = await configureAgent(userId, data);
      setResult({ success: true, message: result.message });
      setSavedConfig(data);
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: error.response?.data?.detail || error.message 
      });
    }
  };

  return (
    <div className="relative">
      <Card>
        <CardHeader>
          <CardTitle>Configure Agent</CardTitle>
          <CardDescription>
            Configure your AI voice agent's behavior and API credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={configTab} onValueChange={setConfigTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="behavior">Agent Behavior</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="behavior" className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="system_prompt">System Prompt</Label>
                  <Textarea
                    id="system_prompt"
                    rows={4}
                    {...register('system_prompt', { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
                  <Select defaultValue="alloy" {...register('voice')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy</SelectItem>
                      <SelectItem value="echo">Echo</SelectItem>
                      <SelectItem value="fable">Fable</SelectItem>
                      <SelectItem value="nova">Nova</SelectItem>
                      <SelectItem value="shimmer">Shimmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select defaultValue="gpt-4o-mini" {...register('model')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agent_name">Agent Name</Label>
                  <Input
                    id="agent_name"
                    placeholder="Assistant"
                    {...register('agent_name')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en" {...register('language')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="api" className="space-y-4 mb-6">
                <div className="mb-4">
                  <Alert>
                    <Key className="h-4 w-4" />
                    <AlertDescription>
                      These API keys are stored securely and used for your voice agent to function. Your credentials are never shared.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                  <Input
                    id="openai_api_key"
                    type="password"
                    placeholder="sk-..."
                    {...register('openai_api_key')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deepgram_api_key">Deepgram API Key</Label>
                  <Input
                    id="deepgram_api_key"
                    type="password"
                    placeholder="dg-..."
                    {...register('deepgram_api_key')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cartesia_api_key">Cartesia API Key</Label>
                  <Input
                    id="cartesia_api_key"
                    type="password"
                    placeholder="cart-..."
                    {...register('cartesia_api_key')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livekit_url">LiveKit URL</Label>
                  <Input
                    id="livekit_url"
                    placeholder="wss://your-project.livekit.cloud"
                    {...register('livekit_url')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livekit_api_key">LiveKit API Key</Label>
                  <Input
                    id="livekit_api_key"
                    type="password"
                    placeholder="API key"
                    {...register('livekit_api_key')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livekit_api_secret">LiveKit API Secret</Label>
                  <Input
                    id="livekit_api_secret"
                    type="password"
                    placeholder="API secret"
                    {...register('livekit_api_secret')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sip_trunk_id">SIP Trunk ID</Label>
                  <Input
                    id="sip_trunk_id"
                    placeholder="Optional SIP trunk ID"
                    {...register('sip_trunk_id')}
                  />
                </div>
              </TabsContent>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sticky Success Bar */}
      {result && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 transition-transform duration-300 transform ${result ? 'translate-y-0' : 'translate-y-full'} bg-background/80 backdrop-blur-sm z-[100] border-t`}>
          <div className="max-w-4xl mx-auto">
            <div className={`flex items-center justify-between gap-4 p-4 rounded-lg shadow-lg ${result.success ? 'bg-background border border-primary' : 'bg-background border border-destructive'}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Info className="h-5 w-5 text-destructive shrink-0" />
                )}
                <p className={`text-sm font-medium truncate ${result.success ? 'text-primary' : 'text-destructive'}`}>
                  {result.message}
                </p>
              </div>
              
              {result.success && onNavigateTab && (
                <Button
                  onClick={() => onNavigateTab('control')}
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" }),
                    "shrink-0"
                  )}
                >
                  Control Agent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
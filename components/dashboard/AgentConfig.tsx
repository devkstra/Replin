'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { configureAgent } from "@/utils/api";
import { AgentConfigFormData, UserIdProps } from '@/types';
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentConfigProps extends UserIdProps {
  onNavigateTab?: (tab: string) => void;
}

export default function AgentConfig({ userId, onNavigateTab }: AgentConfigProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AgentConfigFormData>({
    defaultValues: {
      system_prompt: 'You are a helpful assistant. Provide accurate and concise information based on the documents provided.',
      voice: 'alloy',
      model: 'Nova-2 (General)',
      agent_name: 'Assistant',
      openai_key: '',
      deepgram_key: '',
      cartesia_key: '',
    }
  });
  
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const onSubmit: SubmitHandler<AgentConfigFormData> = async (data) => {
    try {
      const result = await configureAgent(userId, data);
      setResult({ success: true, message: result.message });
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
          <p className="text-sm text-muted-foreground">
            Customize your agent's behavior and connect required services
          </p>
        </CardHeader>
        <CardContent className="pb-20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="voice">Voice Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    These API keys are required for the agent to function properly. Keys are stored securely and only used to power your agent.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="openai_key">OpenAI API Key</Label>
                    <Input
                      id="openai_key"
                      type="password"
                      placeholder="sk-..."
                      {...register('openai_key')}
                    />
                    <p className="text-xs text-muted-foreground">Required for language model access</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deepgram_key">Deepgram API Key</Label>
                    <Input
                      id="deepgram_key"
                      type="password"
                      placeholder="Your Deepgram API Key"
                      {...register('deepgram_key')}
                    />
                    <p className="text-xs text-muted-foreground">Required for speech recognition</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cartesia_key">Cartesia API Key</Label>
                    <Input
                      id="cartesia_key"
                      type="password"
                      placeholder="Your Cartesia API Key"
                      {...register('cartesia_key')}
                    />
                    <p className="text-xs text-muted-foreground">Required for text-to-speech</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="speech_model">Speech-to-Text Model</Label>
                  <Select defaultValue="nova-2" {...register('model')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nova-2">Nova-2 (General)</SelectItem>
                      <SelectItem value="nova-2-medical">Nova-2 (Medical)</SelectItem>
                      <SelectItem value="nova-2-finance">Nova-2 (Finance)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Speech recognition model specialized for different domains</p>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              disabled={isSubmitting}
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
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { startAgent, stopAgent, listAgents, listCollections, testStartAgent } from "@/utils/api";
import { Collection, AgentControlFormData, UserIdProps } from '@/types';
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertTriangle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Helper function to generate unique IDs for keys
const generateId = () => Math.random().toString(36).substring(2, 9);

export default function AgentControl({ userId }: UserIdProps) {
  const { register, handleSubmit, formState: { isSubmitting }, watch, setValue } = useForm<AgentControlFormData>({
    defaultValues: {
      agent_type: 'voice'
    }
  });
  
  const [result, setResult] = useState<{
    success?: boolean;
    loading?: boolean;
    message: string;
    errorDetails?: string;
    status?: string;
  } | null>(null);
  
  const [collections, setCollections] = useState<Collection[]>([]);
  const [agentRunning, setAgentRunning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Generate stable keys for collections that won't change on re-render
  const [collectionKeys] = useState(() => 
    Array(20).fill(0).map(() => generateId())
  );
  
  const currentAgentType = watch('agent_type');
  
  // Fetch collections when component mounts
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch collections
        const collectionsData = await listCollections(userId);
        setCollections(collectionsData.collections || []);
        
        // Check if any agent is already running for this user
        const agentsData = await listAgents();
        const userAgent = agentsData.agents.find(agent => agent.user_id === userId);
        setAgentRunning(Boolean(userAgent));
        
      } catch (error) {
        console.error("Failed to load initial data:", error);
        // Still proceed with empty collections if there's an error
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [userId]);
  
  const onStartAgent: SubmitHandler<AgentControlFormData> = async (data) => {
    try {
      setResult({ loading: true, message: "Starting agent..." });
      console.log("Sending data to server:", {
        userId,
        collection_name: data.collection_name || null,
        phone_number: data.phone_number || null,
        agent_type: data.agent_type
      });
      const result = await startAgent(
        userId,
        data.collection_name || null,
        data.phone_number || null,
        data.agent_type
      );
      
      setResult({
        success: true,
        message: result.status === 'already_running' 
          ? 'Agent is already running'
          : data.agent_type === 'voice'
            ? 'Agent started successfully. You can call on +19592142164'
            : 'Agent started successfully. You can access the web interface at https://front-six-gules.vercel.app/voice-chat'
      });
      
      setAgentRunning(true);
    } catch (error: any) {
      console.error("Error starting agent:", error);
      const errorDetail = error.response?.data?.detail || error.message || 'Failed to start agent';
      console.error("Error detail:", errorDetail);
      setResult({ 
        success: false, 
        message: 'Error starting agent',
        errorDetails: JSON.stringify(errorDetail, null, 2)
      });
    }
  };
  
  const onStopAgent = async () => {
    try {
      setResult({ loading: true, message: "Stopping agent..." });
      const result = await stopAgent(userId);
      
      setResult({
        success: true,
        message: 'Agent stopped successfully'
      });
      
      setAgentRunning(false);
    } catch (error: any) {
      console.error("Error stopping agent:", error);
      setResult({ 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Failed to stop agent' 
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Control</CardTitle>
      </CardHeader>
      <CardContent>
        {!agentRunning ? (
          <form onSubmit={handleSubmit(onStartAgent)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Select 
                onValueChange={(value) => setValue('collection_name', value)}
                defaultValue={collections.length > 0 ? collections[0].name : "default"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.length === 0 ? (
                    <SelectItem key="default-collection" value="default">
                      Default Collection
                    </SelectItem>
                  ) : (
                    collections.map((collection, index) => (
                      <SelectItem 
                        key={index < collectionKeys.length ? collectionKeys[index] : generateId()} 
                        value={collection.name}
                      >
                        {collection.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="flex items-center gap-2">
                Phone Number (for outbound calls)
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Coming Soon</span>
              </Label>
              <Input
                id="phone_number"
                placeholder="+1234567890"
                {...register('phone_number')}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Agent Type</Label>
              <RadioGroup 
                value={watch('agent_type')} 
                onValueChange={(value: 'voice' | 'web') => setValue('agent_type', value)} 
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voice" id="voice" />
                  <Label htmlFor="voice">Voice Agent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="web" id="web-agent" />
                  <Label htmlFor="web-agent">Web Agent</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Agent...
                </>
              ) : (
                'Start Agent'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Agent is currently running
              </AlertDescription>
            </Alert>
            <Button
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "w-full"
              )}
              onClick={onStopAgent}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stopping Agent...
                </>
              ) : (
                'Stop Agent'
              )}
            </Button>
          </div>
        )}
        
        {result && !result.loading && (
          <Alert
            variant={result.success ? "default" : "destructive"}
            className="mt-4"
          >
            <AlertDescription>
              {result.status === 'already_running' ? (
                'Agent is already running'
              ) : result.success && currentAgentType === 'web' ? (
                <div className="flex items-center gap-2">
                  <span>Agent started successfully. Access the web interface at: </span>
                  <a 
                    href="https://front-six-gules.vercel.app/voice-chat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline flex items-center gap-1"
                  >
                    Web Interface
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <Button
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "h-6 w-6"
                    )}
                    onClick={() => {
                      navigator.clipboard.writeText('https://front-end-mahasahyak.vercel.app/voice-chat');
                      toast.success('Link copied to clipboard!');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : result.success ? (
                <div>Agent started successfully. You can call on +19592142164</div>
              ) : (
                <>
                  {result.message}
                  {result.errorDetails && (
                    <pre className="mt-2 p-2 bg-muted/50 rounded-md text-sm overflow-auto">
                      {result.errorDetails}
                    </pre>
                  )}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full mt-4"
          )}
          onClick={async () => {
            try {
              setResult({ loading: true, message: "Testing API..." });
              await testStartAgent(userId);
              setResult({ success: true, message: "API test successful" });
            } catch (error: any) {
              console.error("Test API error:", error);
              const errorDetail = error.response?.data?.detail || error.message || 'Unknown error';
              setResult({ 
                success: false, 
                message: `API test failed`,
                errorDetails: JSON.stringify(errorDetail, null, 2)
              });
            }
          }}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Test API (Debug)
        </Button>
      </CardContent>
    </Card>
  );
} 
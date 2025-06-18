'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { uploadDocuments } from "@/utils/api";
import { DocumentUploadFormData, UserIdProps } from '@/types';
import FileInput from "@/components/dashboard/FileInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, FileText, Info, ArrowRight, CheckCircle2 } from "lucide-react";

interface DocumentUploadProps extends UserIdProps {
  onNavigateTab?: (tab: string) => void;
}

export default function DocumentUpload({ userId, onNavigateTab }: DocumentUploadProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Omit<DocumentUploadFormData, 'documents'>>();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const addSampleFile = async () => {
    try {
      const response = await fetch('/banking_ai_kb.md');
      const text = await response.text();
      const file = new File([text], 'banking_ai_kb.md', { type: 'text/markdown' });
      setSelectedFiles(prev => [...prev, file]);
    } catch (error) {
      console.error('Error loading sample file:', error);
      setResult({ 
        success: false, 
        message: 'Failed to load sample file' 
      });
    }
  };

  const onSubmit: SubmitHandler<Omit<DocumentUploadFormData, 'documents'>> = async (data) => {
    try {
      if (selectedFiles.length === 0) {
        setResult({ 
          success: false, 
          message: 'Please select at least one document to upload' 
        });
        return;
      }

      const fileList = Object.assign(selectedFiles, {
        item: (index: number) => selectedFiles[index],
        length: selectedFiles.length
      }) as unknown as FileList;

      const result = await uploadDocuments(
        userId, 
        fileList, 
        data.collectionName
      );
      
      setResult({ success: true, message: result.message });
      setSelectedFiles([]);
      reset();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      
      setResult({ 
        success: false, 
        message: error.response?.data?.detail || error.message || 'Upload failed'
      });
    }
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  return (
    <div className="relative">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent className="pb-20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collectionName">
                Collection Name (optional)
              </Label>
              <Input
                id="collectionName"
                placeholder="Default Collection"
                {...register('collectionName')}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Documents</Label>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Want to try? Add our sample banking application file
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSampleFile}
                  className="text-xs"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Add Sample Banking File
                </Button>
              </div>
              <FileInput 
                onFilesSelected={handleFilesSelected} 
                multiple={true} 
                accept=".pdf,.doc,.docx,.txt,.md"
                selectedFiles={selectedFiles}
              />
              <p className="text-sm text-muted-foreground">
                Accepted file types: PDF, DOC, DOCX, TXT, MD
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting || selectedFiles.length === 0}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Documents'
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
                  onClick={() => onNavigateTab('build')}
                  className="shrink-0"
                  size="sm"
                >
                  Build the Agent
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
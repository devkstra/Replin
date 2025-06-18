'use client';

import { useState, useEffect } from 'react';
import { listCollections } from "@/utils/api";
import { Collection, UserIdProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FolderIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CollectionsList({ userId }: UserIdProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCollections() {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await listCollections(userId);
        setCollections(data.collections || []);
        setError(null);
      } catch (err) {
        setError('Failed to load collections');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCollections();
  }, [userId]);
  
  if (loading) return (
    <Card>
      <CardHeader>
        <CardTitle>Document Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
  
  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Document Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
  
  if (collections.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Document Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>No collections found.</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {collections.map((collection) => (
            <div key={collection.name} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                    <FolderIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{collection.name}</p>
                    <p className="text-sm text-muted-foreground">{collection.path}</p>
                  </div>
                </div>
                {collection.is_default && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
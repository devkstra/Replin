'use client';

import React, { useState } from 'react';

interface FileInputProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  selectedFiles?: File[];
}

export default function FileInput({ 
  onFilesSelected, 
  multiple = false, 
  accept, 
  selectedFiles = [] 
}: FileInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected([...selectedFiles, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              Upload your documents here
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple={multiple}
            accept={accept}
          />
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-destructive hover:text-destructive/80"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
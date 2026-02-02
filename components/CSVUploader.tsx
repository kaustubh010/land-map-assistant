"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileText, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CSVUploaderProps {
  onUploadSuccess?: () => void;
}

export function CSVUploader({ onUploadSuccess }: CSVUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    details?: string[];
  }>({ type: null, message: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file type. Please upload a CSV file.'
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parcels/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadStatus({
          type: 'error',
          message: data.error || 'Upload failed',
          details: data.details
        });
        
        toast({
          title: "Upload failed",
          description: data.error || 'Failed to upload CSV',
          variant: "destructive"
        });
      } else {
        setUploadStatus({
          type: 'success',
          message: data.message || `Successfully uploaded ${data.count} parcels`
        });
        
        toast({
          title: "Upload successful",
          description: `${data.count} parcels uploaded successfully`
        });

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Notify parent component
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
      
      toast({
        title: "Upload failed",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const downloadDemo = () => {
    const link = document.createElement('a');
    link.href = '/demo.csv';
    link.download = 'demo.csv';
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Parcel Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
          
          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop your CSV file here, or
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleButtonClick}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {uploadStatus.type && (
          <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              <p className="font-medium">{uploadStatus.message}</p>
              {uploadStatus.details && uploadStatus.details.length > 0 && (
                <ul className="mt-2 text-xs space-y-1">
                  {uploadStatus.details.slice(0, 5).map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                  {uploadStatus.details.length > 5 && (
                    <li>• ... and {uploadStatus.details.length - 5} more</li>
                  )}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Download Demo */}
        <div className="pt-2 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadDemo}
            className="w-full text-xs"
          >
            <Download className="mr-2 h-3 w-3" />
            Download Demo CSV
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">CSV Format:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Required columns: plot_id, owner_name, area_record</li>
            <li>Area should be in hectares (positive number)</li>
            <li>No duplicate plot IDs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

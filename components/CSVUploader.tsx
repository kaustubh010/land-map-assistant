"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CSVUploaderProps {
  onUploadSuccess?: () => void;
}

export function CSVUploader({ onUploadSuccess }: CSVUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ================= LOGIN GATE =================
  if (!user) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3 text-center">
          <p className="text-sm font-medium">Login required</p>

          <p className="text-xs text-muted-foreground">
            Please login or create an account to upload parcel data.
          </p>

          <div className="flex gap-2">
            <Button size="sm" className="w-full" asChild>
              <a href="/login">Login</a>
            </Button>

            <Button size="sm" variant="outline" className="w-full" asChild>
              <a href="/register">Sign up</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ================= FILE HANDLING =================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setUploadStatus({
        type: "error",
        message: "Please upload a CSV file only."
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parcels/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setUploadStatus({
          type: "error",
          message: data.error || "Upload failed"
        });

        toast({
          title: "Upload failed",
          description: data.error || "CSV upload failed",
          variant: "destructive"
        });
      } else {
        setUploadStatus({
          type: "success",
          message: `${data.count} parcels uploaded`
        });

        toast({
          title: "Upload successful",
          description: `${data.count} parcels uploaded`
        });

        if (fileInputRef.current) fileInputRef.current.value = "";

        onUploadSuccess?.();
      }
    } catch {
      setUploadStatus({
        type: "error",
        message: "Network error. Try again."
      });

      toast({
        title: "Upload failed",
        description: "Network error",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload CSV
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        <Button
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </>
          )}
        </Button>

        {uploadStatus.type && (
          <Alert
            variant={uploadStatus.type === "error" ? "destructive" : "default"}
          >
            <AlertDescription className="text-xs">
              {uploadStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          Required: plot_id, owner_name, area_record
        </p>
      </CardContent>
    </Card>
  );
}

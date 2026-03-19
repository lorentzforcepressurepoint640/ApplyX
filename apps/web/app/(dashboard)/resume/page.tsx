"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchName() {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
            const data = await res.json();
            if (data.name) setFullName(data.name);
            if (data.portfolioUrl) setPortfolioUrl(data.portfolioUrl);
        }
    }
    fetchName();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("portfolioUrl", portfolioUrl);
    formData.append("fullName", fullName);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Profile saved and resume uploaded!");
        setSuccess(true);
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to upload resume");
      }
    } catch (e) {
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Manage Profile</h1>
      <p className="text-muted-foreground">
        Complete your profile to personalize your job outreach. 
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
          <CardDescription>Keep these updated for the best AI outreach.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name (Used in email subject)</Label>
            <Input 
              id="full-name" 
              placeholder="e.g. Sahil Sharma" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio-url">Portfolio/Personal Website (Optional)</Label>
            <Input 
              id="portfolio-url" 
              placeholder="https://your-portfolio.com" 
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-muted/5 border-2 border-dashed rounded-lg">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <Label htmlFor="resume-upload" className="mb-2 cursor-pointer text-primary hover:underline font-medium">
              Click to select Resume PDF
            </Label>
            <Input 
              id="resume-upload" 
              type="file" 
              accept="application/pdf"
              className="hidden" 
              onChange={handleFileChange}
            />
            {file && (
              <div className="mt-4 flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300">
                <FileText className="h-4 w-4" />
                {file.name}
              </div>
            )}
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            disabled={!file || uploading} 
            onClick={handleUpload}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              "Save and Upload Profile"
            )}
          </Button>

          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/10 p-3 rounded-md border border-green-200 animate-in slide-in-from-top duration-500">
              <CheckCircle2 className="h-5 w-5" />
              <span>Resume is stored and ready to use!</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-muted/20 border-none">
        <CardHeader>
          <CardTitle className="text-sm">Why PDF?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Our AI parser is optimized for PDF documents. It preserves the structure of your professional experience, education, and skills, ensuring highly accurate personalized email drafts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

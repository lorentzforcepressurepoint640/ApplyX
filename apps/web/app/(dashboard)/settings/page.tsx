"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/user/api-key")
      .then(res => res.json())
      .then(data => setApiKey(data.apiKey))
      .catch(console.error);
  }, []);

  const handleCopyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKey = async () => {
    if (!confirm("Are you sure? This will break your current extension connection.")) return;
    try {
      const res = await fetch("/api/user/api-key", { method: "POST" });
      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
      <p className="text-muted-foreground">Manage your connections and account preferences.</p>

      <Card className="border-none bg-muted/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle>Gmail Connection</CardTitle>
          </div>
          <CardDescription>Status of your Gmail API integration for sending outreach emails.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Gmail Connected</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{session?.user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>Reconnect</Button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 rounded-lg flex gap-3 text-blue-800 dark:text-blue-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="text-xs leading-relaxed space-y-2">
              <p className="font-semibold">Security Information</p>
              <p>Your OAuth tokens are stored securely in our database and are used exclusively to send outreach emails on your behalf when you explicitly click the "Send Email" button.</p>
              <p>Requested scopes: <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">gmail.send</code>, <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">email</code>, <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">profile</code>.</p>
            </div>
          </div>
        </CardContent>
      </Card>
 
      <Card className="border-none bg-muted/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <CardTitle>Chrome Extension</CardTitle>
          </div>
          <CardDescription>Use this key to connect your extension if it's not logged in automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
             <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Your Extension Key</label>
             <div className="flex gap-2">
               <div className="flex-1 bg-background border px-4 py-2 rounded-lg font-mono text-xs flex items-center overflow-hidden">
                 {apiKey ? `●●●●●●●●●●●●●●●●${apiKey.slice(-8)}` : "Loading..."}
               </div>
               <Button variant="outline" size="sm" onClick={handleCopyKey}>
                 {copied ? "Copied!" : "Copy"}
               </Button>
               <Button variant="ghost" size="sm" onClick={handleRotateKey} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                 Rotate
               </Button>
             </div>
             <p className="text-[10px] text-muted-foreground italic px-1 pt-1">Keep this key secret. If you suspect it's compromised, click Rotate.</p>
          </div>
        </CardContent>
      </Card>
 
      <Card className="border-none bg-muted/20">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Information about your Google account sync.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex justify-between py-2 border-b border-muted/50 text-sm">
             <span className="text-muted-foreground font-medium">Full Name</span>
             <span>{session?.user?.name || "N/A"}</span>
           </div>
           <div className="flex justify-between py-2 border-b border-muted/50 text-sm">
             <span className="text-muted-foreground font-medium">Email Address</span>
             <span>{session?.user?.email || "N/A"}</span>
           </div>
           <div className="flex justify-between py-2 border-b border-muted/50 text-sm">
             <span className="text-muted-foreground font-medium">Primary Resume</span>
             <span className="text-primary hover:underline cursor-pointer">View resume data</span>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}

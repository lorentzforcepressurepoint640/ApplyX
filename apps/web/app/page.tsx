"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight, Mail, Wand2, Chrome } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary">
          Instant Job <span className="text-secondary-foreground">Apply</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          AI-Powered Personalization for Job Outreach. Send emails directly from LinkedIn posts.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
            <Mail className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/your-username/your-repo">
              Learn More <MoveRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <Card className="bg-muted border-none bg-opacity-50">
            <CardHeader>
              <Wand2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Personalized</CardTitle>
              <CardDescription>Generated emails matching your resume and LinkedIn posts.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted border-none bg-opacity-50">
            <CardHeader>
              <Chrome className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Chrome Extension</CardTitle>
              <CardDescription>One-click email drafting directly on your favorite platform.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-muted border-none bg-opacity-50">
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Gmail Integration</CardTitle>
              <CardDescription>Send emails with attachments via your own Gmail account securely.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

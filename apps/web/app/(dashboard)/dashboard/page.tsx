'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, XCircle, Send, Users, ExternalLink, Mail, ArrowUpRight, BarChart2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SentEmail {
  _id: string;
  to: string;
  subject: string;
  createdAt: string;
  threadId: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [resumeStored, setResumeStored] = useState<boolean | null>(null);
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resumeRes, emailsRes] = await Promise.all([
          fetch("/api/resume/status"),
          fetch("/api/emails")
        ]);

        if (resumeRes.ok) {
          const data = await resumeRes.json();
          setResumeStored(data.exists);
        }
        if (emailsRes.ok) {
          const data = await emailsRes.json();
          setEmails(data.emails || []);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">
            Hi {(session?.user?.name || 'User').split(' ')[0]}, tracking your application journey.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full font-bold">
            <BarChart2 className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button className="rounded-full font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
            New Outreach
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Resume Card */}
        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={80} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-500" /> Resume Profile
            </CardTitle>
            <CardDescription className="font-semibold">Contextual engine status</CardDescription>
          </CardHeader>
          <CardContent>
            {resumeStored === null ? (
              <div className="h-20 flex items-center justify-center animate-pulse bg-slate-100 rounded-xl" />
            ) : resumeStored ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-700 bg-green-50 px-4 py-3 rounded-2xl border border-green-100">
                  <CheckCircle2 className="h-6 w-6" />
                  <span className="font-bold">Active & Ready</span>
                </div>
                <Button variant="ghost" className="w-full text-blue-600 font-bold hover:bg-blue-50" asChild>
                  <Link href="/resume">Update Config <ArrowUpRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-amber-700 bg-amber-50 px-4 py-3 rounded-2xl border border-amber-100">
                  <XCircle className="h-6 w-6" />
                  <span className="font-bold">Setup Required</span>
                </div>
                <Button className="w-full bg-slate-900 text-white font-bold rounded-xl" asChild>
                  <Link href="/resume">Upload PDF</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Send size={80} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Send className="h-5 w-5 text-indigo-500" /> Outreach Log
            </CardTitle>
            <CardDescription className="font-semibold">Total communications sent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <h2 className="text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                {emails.length}
              </h2>
              <span className="text-slate-400 font-bold text-lg">Sent</span>
            </div>
            <p className="text-sm text-slate-500 font-bold mt-4">
              Across {new Set(emails.map(e => e.to)).size} unique recruiting leads.
            </p>
          </CardContent>
        </Card>

        {/* New Tracking Card */}
        <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-lg opacity-80 uppercase tracking-widest font-black">Engagement</CardTitle>
            <CardDescription className="text-white/70 font-bold">Reply tracking enabled</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-5xl font-black">Beta 🛰️</h2>
            <p className="text-sm text-white/80 font-bold mt-4">
              Smart follow-ups and reply detection are arriving soon.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Emails Table */}
      <Card className="border-none shadow-2xl shadow-slate-300/40 dark:shadow-none bg-white dark:bg-slate-950 rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-50 px-8 py-6">
          <CardTitle className="text-2xl font-black flex items-center justify-between">
            Recent Timeline
            <Button variant="ghost" className="text-blue-600 font-bold">View History</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Recipient</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest">Subject Line</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest text-center">Date</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-10 h-20 bg-slate-50/20" />
                    </tr>
                  ))
                ) : emails.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-400">
                          <Mail size={40} />
                        </div>
                        <p className="text-slate-500 font-black text-xl">No outreach history yet.</p>
                        <p className="text-slate-400 max-w-xs font-semibold">Start your journey by clicking the Outreach button on any LinkedIn post.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  emails.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                            {item.to.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white leading-none">{item.to}</p>
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">gmail verified</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-slate-600 dark:text-slate-300 font-bold line-clamp-1 italic">"{item.subject}"</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-sm text-slate-500 font-black">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`https://mail.google.com/mail/u/0/#all/${item.threadId}`}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-blue-600 font-black hover:underline"
                        >
                          OPEN <ExternalLink size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

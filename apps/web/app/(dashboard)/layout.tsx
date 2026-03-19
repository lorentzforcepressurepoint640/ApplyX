"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Settings, LogOut, MailSearch } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (status === "unauthenticated") {
    redirect("/");
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Resume", href: "/resume", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <MailSearch className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">JobApply AI</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "font-semibold")}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t px-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center text-primary-foreground text-xs">
              {session?.user?.name?.[0] || session?.user?.email?.[0]}
            </div>
            <div className="flex-1 truncate overflow-hidden">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

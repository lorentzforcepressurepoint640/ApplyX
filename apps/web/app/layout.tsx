import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Instant Job Apply | AI Job Outreach",
  description: "Generate and send AI-personalized job outreach emails directly from LinkedIn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, fontMono.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Player from "@/components/player/Player";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/QueryProvider";
import { getServerSession } from "next-auth";
import { AuthProvider } from "@/lib/SessionProvider";
import { authOptions } from "@/server/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropPod",
  description: "Listen to your favourite podcasts for free!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(inter.className, "flex h-full flex-col")}
        suppressHydrationWarning
      >
        <AuthProvider session={session}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header className="box-border flex-shrink-0 flex-grow-0" />
              <main className="box-border flex-1 overflow-y-auto py-8">
                <div className="container">{children}</div>
              </main>
              <Player className="box-border flex-shrink-0 flex-grow-0" />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

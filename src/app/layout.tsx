import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout";
import { Toaster } from "@/components/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Flow Meter",
    template: "%s | Flow Meter",
  },

  description: "Utility Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl bg-purple-300/20 dark:bg-blue-500/20 animate-pulse-slow" />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            />
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollAnimations } from "@/components/ui/ScrollAnimations";
import { AuthProvider } from "@/contexts/auth-context";
import ToastProvider from "@/components/providers/ToastProvider";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname?.startsWith("/login") || 
                     pathname?.startsWith("/forgot-password") || 
                     pathname?.startsWith("/verify-otp") ||
                     pathname?.startsWith("/reset-password") ||
                     pathname?.startsWith("/signup");
  const isDashboardPage = pathname?.startsWith("/dashboard");
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/rx-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/rx-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/rx-logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <meta name="theme-color" content="#0066ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dr. George" />
      </head>
      <body
        suppressHydrationWarning
        className={`antialiased`}
      >
        <AuthProvider>
          <ToastProvider />
          <PwaInstallPrompt />
          {!isAdminPage && !isAuthPage && !isDashboardPage && <Navbar />}
          <div className="overflow-x-hidden w-full relative">
            <ScrollAnimations>
              {children}
            </ScrollAnimations>
          </div>
          {!isAdminPage && !isAuthPage && !isDashboardPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}

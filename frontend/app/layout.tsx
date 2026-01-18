"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollAnimations } from "@/components/ui/ScrollAnimations";
import { AuthProvider } from "@/contexts/auth-context";
import ToastProvider from "@/components/providers/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider />
          {!isAdminPage && !isAuthPage && !isDashboardPage && <Navbar />}
          <ScrollAnimations>
            {children}
          </ScrollAnimations>
          {!isAdminPage && !isAuthPage && !isDashboardPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}

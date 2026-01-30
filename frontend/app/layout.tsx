"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollAnimations } from "@/components/ui/ScrollAnimations";
import { AuthProvider } from "@/contexts/auth-context";
import ToastProvider from "@/components/providers/ToastProvider";
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
      <body
        suppressHydrationWarning
        className={`antialiased`}
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

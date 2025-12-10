"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  FileText,
  Video,
  Settings,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
  { name: "Blog Posts", href: "/admin/blog", icon: FileText },
  { name: "Media Content", href: "/admin/media", icon: Video },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-muted/30">
          {/* Sidebar */}
          <aside className="hidden md:flex w-64 flex-col border-r bg-card">
            <div className="p-6 border-b">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Admin Panel</span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Back to Site
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-medium text-foreground">Dr. George</span>
                </span>
              </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

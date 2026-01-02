"use client";

import { useState } from "react";
import Image from "next/image";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Page Title - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">My Dashboard</h1>
            </div>

            {/* Right Side: Notifications & Profile */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Notification Bell */}
              <button className="p-2.5 hover:bg-gray-100 rounded-lg relative transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Premium Member</div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#0066ff]/30">
                  <div className="w-full h-full bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </main>
    </div>
  );
}

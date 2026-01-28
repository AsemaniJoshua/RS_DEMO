"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requireAdmin>
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="flex-1 lg:ml-64">
        {/* Static Navbar */}
        <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button + Title */}
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button - visible on mobile only */}
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
              
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Monday, December 23, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 hover:bg-gray-100 rounded-lg relative transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* Notification Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button className="text-xs text-[#00d4aa] font-medium hover:text-[#00bfa6]">Mark all as read</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {/* Empty State */}
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-medium mb-1">No new notifications</p>
                            <p className="text-sm text-gray-500">We'll let you know when something important arrives.</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/50 rounded-b-xl">
                        <Link href="/admin/notifications" className="block text-center text-sm text-gray-600 hover:text-[#00d4aa] font-medium transition-colors">
                            View all notifications
                        </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#00d4aa]">
                    <Image 
                      src="/dr-george.png" 
                      alt="Dr. George" 
                      width={40} 
                      height={40} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</div>
                      <div className="text-xs text-gray-500">{user?.role}</div>
                    </div>
                    <Link href="/admin/brand" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
}

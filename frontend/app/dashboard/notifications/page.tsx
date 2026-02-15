"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";

export default function NotificationsPage() {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/dashboard"
                    className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with your appointments and activities</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    You're all caught up! New notifications about your appointments, courses, and updates will appear here.
                </p>
                <Link href="/dashboard">
                    <button className="px-6 py-2.5 bg-[#0066ff] text-white rounded-xl hover:bg-[#0052cc] transition-colors font-medium">
                        Return to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}

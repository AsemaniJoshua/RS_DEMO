"use client";

import { useState, useEffect } from "react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import Link from "next/link";
import { dashboardService } from "@/services/dashboard-service";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardHome() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localName, setLocalName] = useState<string | null>(null);
    const { user: authUser } = useAuth();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setLocalName(parsed.first_name || parsed.name || null);
                } catch {}
            }
        }
    }, []);

    useEffect(() => {
        async function fetchDashboard() {
            setLoading(true);
            setError(null);
            try {
                const data = await dashboardService.fetchUserDashboard();
                setDashboard(data);
            } catch (err: any) {
                setError(err?.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    // Use authenticated user's name if available
    const displayName = localName || authUser?.first_name || "User";

    // Fallbacks for dashboard data
    const stats = dashboard?.stats || { coursesEnrolled: 0, scheduledAppointments: 0, purchasedEbooks: 0, registeredLiveSessions: 0 };
    const recentActivity = dashboard?.recentActivity || [];
    const nextAppointment = dashboard?.nextAppointment || null;
    const purchasedEbooks = stats.purchasedEbooks ?? 0;
    const registeredLiveSessions = stats.registeredLiveSessions ?? 0;
    const scheduledAppointments = stats.scheduledAppointments ?? 0;

    if (loading) {
        return <DashboardSkeleton />;
    }
    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }
    return (
        <div className="p-4 md:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Welcome back, {displayName}!
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="9" cy="9" r="1" fill="white"/>
                        <circle cx="15" cy="9" r="1" fill="white"/>
                    </svg>
                </h1>
                <p className="text-gray-600">Here's your learning progress and upcoming activities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#0066ff] to-[#0052cc] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{stats.coursesEnrolled}</div>
                            <div className="text-sm opacity-90">Enrolled Courses</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{scheduledAppointments}</div>
                            <div className="text-sm opacity-90">Scheduled Appointments</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{purchasedEbooks}</div>
                            <div className="text-sm opacity-90">Purchased Ebooks</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{registeredLiveSessions}</div>
                            <div className="text-sm opacity-90">Registered Live Sessions</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H11c-1.1 0-2 .9-2 2z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M11 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H11c-1.1 0-2 .9-2 2z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M11 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H11c-1.1 0-2 .9-2 2z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M11 2v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H11c-1.1 0-2 .9-2 2z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity Section */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                        <p className="text-sm text-gray-500 mt-1">Your latest learning journey milestones</p>
                    </div>
                    <div className="space-y-3">
                        {recentActivity.length ? (
                            recentActivity.slice(0, 5).map((activity, idx) => {
                                const getActivityIcon = (type: string) => {
                                    switch(type) {
                                        case 'course':
                                            return (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeWidth="2" strokeLinecap="round"/>
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            );
                                        case 'appointment':
                                            return (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
                                                    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
                                                    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
                                                </svg>
                                            );
                                        case 'ebook':
                                            return (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round"/>
                                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2"/>
                                                </svg>
                                            );
                                        case 'liveSession':
                                            return (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <rect x="2" y="7" width="20" height="15" rx="2" strokeWidth="2"/>
                                                    <polyline points="17 2 12 7 7 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            );
                                        default:
                                            return (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                                    <path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            );
                                    }
                                };

                                const getActivityColor = (type: string) => {
                                    switch(type) {
                                        case 'course': return 'from-blue-500 to-blue-600';
                                        case 'appointment': return 'from-teal-500 to-teal-600';
                                        case 'ebook': return 'from-amber-500 to-amber-600';
                                        case 'liveSession': return 'from-purple-500 to-purple-600';
                                        default: return 'from-gray-500 to-gray-600';
                                    }
                                };

                                const getActivityLabel = (type: string) => {
                                    switch(type) {
                                        case 'course': return 'Course Enrolled';
                                        case 'appointment': return 'Appointment Booked';
                                        case 'ebook': return 'Ebook Purchased';
                                        case 'liveSession': return 'Session Registered';
                                        default: return 'Activity';
                                    }
                                };

                                return (
                                    <div key={idx} className="relative flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    activity.type === 'course' ? 'bg-blue-100 text-blue-700' :
                                                    activity.type === 'appointment' ? 'bg-teal-100 text-teal-700' :
                                                    activity.type === 'ebook' ? 'bg-amber-100 text-amber-700' :
                                                    activity.type === 'liveSession' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {getActivityLabel(activity.type)}
                                                </span>
                                                {activity.status && (
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        activity.status === 'SUCCESS' || activity.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                        activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {activity.status}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{activity.title || activity.type || 'Activity'}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <path d="M12 6v6l4 2"/>
                                                </svg>
                                                <span>{activity.date ? new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                        <path d="M12 8v4l3 3"/>
                                        <circle cx="12" cy="12" r="10"/>
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No recent activity</p>
                                <p className="text-sm text-gray-400 mt-1">Your activities will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* Next Appointment */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Next Appointment</h2>
                    {nextAppointment ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-[#00d4aa]/10 to-[#00bfa6]/10 border border-[#00d4aa]/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 bg-[#00d4aa] rounded-lg flex items-center justify-center text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{nextAppointment.type}</div>
                                        <div className="text-sm text-gray-600">{nextAppointment.mode}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {nextAppointment.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {nextAppointment.time}
                                    </div>
                                    <div className="pt-2">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {nextAppointment.status}
                                        </span>
                                    </div>
                                </div>
                                {nextAppointment.mode === "Virtual" && nextAppointment.meetingLink && (
                                    <button className="w-full mt-4 px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors text-sm font-medium">
                                        Join Meeting
                                    </button>
                                )}
                            </div>
                            <Link href="/dashboard/appointments">
                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                    View All Appointments
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No upcoming appointments</p>
                    )}
                </div>
            </div>

        </div>
    );
}

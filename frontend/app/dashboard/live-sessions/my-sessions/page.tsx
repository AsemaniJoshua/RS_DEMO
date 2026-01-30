"use client";

import { useState, useEffect } from "react";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";

export default function MySessionsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]); // Using any for now to avoid strict type refactoring of the whole file, but ideally SessionRegistration
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMySessions();
    }, []);

    const fetchMySessions = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getMySessions();
            // apiFetch likely returns the array directly based on the service definition
            // But if there is a wrapper, we effectively need the list of registrations
            // The service says: return apiFetch<SessionRegistration[]>('/live-sessions/my/sessions');
            // So response IS the array.
            setRegistrations(Array.isArray(response) ? response : []); 
        } catch (error: any) {
            toast.error(error.message || 'Failed to load your sessions');
        } finally {
            setLoading(false);
        }
    };

    // ... helper functions ...

    // ...

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <BackButton label="Back to All Sessions" href="/dashboard/live-sessions" />
                    
                    <h1 className="text-3xl font-bold text-gray-900">My Registered Sessions</h1>
                    <p className="text-gray-600 mt-2">View and manage your session registrations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {registrations.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        {/* ... empty state icon ... */}
                         <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Registered Sessions</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            You haven't registered for any live sessions yet. Browse available sessions to get started.
                        </p>
                        <Link
                            href="/dashboard/live-sessions"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium"
                        >
                            Browse Sessions
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {registrations.map((registration) => {
                            const session = registration.session;
                            if (!session) return null;
                            
                            return (
                            <Link
                                key={session.id}
                                href={`/dashboard/live-sessions/${session.id}`}
                                className="block bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                    {session.status}
                                                </span>
                                                {session.status === 'LIVE' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-pulse"></span>
                                                        Live Now
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#0066ff] transition-colors">
                                                {session.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {session.description || 'No description provided'}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                                    </svg>
                                                    {formatDate(session.scheduled_date)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    {formatTime(session.scheduled_date)}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    {session.duration_minutes} min
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-6 flex-shrink-0">
                                            {session.meeting_link && (session.status === 'UPCOMING' || session.status === 'LIVE') && (
                                                <a
                                                    href={session.meeting_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                                    </svg>
                                                    Join Meeting
                                                </a>
                                            )}
                                            {session.status === 'COMPLETED' && session.recording_url && (
                                                <a
                                                    href={session.recording_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polygon points="10 8 16 12 10 16 10 8"/>
                                                    </svg>
                                                    Watch Recording
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Registration Info */}
                                    {registration.registration_date && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                                            Registered on {formatDate(registration.registration_date)}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        )})} 
                    </div>
                )}
            </div>
        </div>
    );
}

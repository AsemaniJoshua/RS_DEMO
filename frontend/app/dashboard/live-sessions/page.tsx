"use client";

import { useState, useEffect } from "react";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UserLiveSessionsPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'past'>('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getPublicSessions();
            setSessions(response.data || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'UPCOMING':
                return 'bg-green-100 text-green-800';
            case 'LIVE':
                return 'bg-blue-100 text-blue-800 animate-pulse';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calculate counts for each tab
    const upcomingCount = sessions.filter(s => s.status === 'UPCOMING').length;
    const liveCount = sessions.filter(s => s.status === 'LIVE').length;
    const pastCount = sessions.filter(s => s.is_past || s.status === 'COMPLETED').length;
    const allCount = sessions.filter(s => s.status !== 'CANCELLED').length;
    const myRegisteredSessions = sessions.filter(s => s.is_registered && s.status !== 'CANCELLED');

    const filteredSessions = sessions.filter(session => {
        if (filter === 'all') return session.status !== 'CANCELLED';
        if (filter === 'upcoming') return session.status === 'UPCOMING';
        if (filter === 'live') return session.status === 'LIVE';
        if (filter === 'past') return session.is_past || session.status === 'COMPLETED';
        return true;
    });

    if (loading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Live Sessions</h1>
                    <p className="text-gray-600 mt-2">Join live sessions with Dr. George and access recordings</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* My Registered Sessions Section */}
                {myRegisteredSessions.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">My Registered Sessions</h2>
                                <p className="text-gray-600 text-sm mt-1">Sessions you've registered for</p>
                            </div>
                            <Link
                                href="/dashboard/live-sessions/my-sessions"
                                className="text-[#0066ff] hover:text-[#0052cc] font-medium text-sm flex items-center gap-1"
                            >
                                View All
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRegisteredSessions.slice(0, 3).map((session) => (
                                <Link
                                    key={session.id}
                                    href={`/dashboard/live-sessions/${session.id}`}
                                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-shadow overflow-hidden group"
                                >
                                    <div className="p-6">
                                        {/* Status Badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                </svg>
                                                Registered
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066ff] transition-colors">
                                            {session.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {session.description ? session.description.replace(/<[^>]*>/g, '') : 'No description provided'}
                                        </p>

                                        {/* Date & Time */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_date)}
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <polyline points="12 6 12 12 16 14"/>
                                            </svg>
                                            {session.duration_minutes} minutes
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Sessions Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">All Sessions</h2>
                    
                    {/* Filter Tabs */}
                    <div className="inline-flex gap-2 mb-6 bg-white p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            filter === 'upcoming'
                                ? 'bg-[#0066ff] text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Upcoming
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            filter === 'upcoming'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {upcomingCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('live')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            filter === 'live'
                                ? 'bg-[#0066ff] text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Live Now
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            filter === 'live'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {liveCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            filter === 'past'
                                ? 'bg-[#0066ff] text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Past Sessions
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            filter === 'past'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {pastCount}
                        </span>
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            filter === 'all'
                                ? 'bg-[#0066ff] text-white'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        All Sessions
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            filter === 'all'
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {allCount}
                        </span>
                    </button>
                </div>

                {/* Sessions Grid */}
                {filteredSessions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'live' ? 'No live sessions at the moment' : 'Check back later for new sessions'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSessions.map((session) => (
                            <Link
                                key={session.id}
                                href={`/dashboard/live-sessions/${session.id}`}
                                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden group"
                            >
                                <div className="p-6">
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                        {session.is_registered && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                </svg>
                                                Registered
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066ff] transition-colors">
                                        {session.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {session.description ? session.description.replace(/<[^>]*>/g, '') : 'No description provided'}
                                    </p>

                                    {/* Date & Time */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        {formatDate(session.scheduled_date)} at {formatTime(session.scheduled_date)}
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                        {session.duration_minutes} minutes
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                <circle cx="9" cy="7" r="4"/>
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                            </svg>
                                            {session.registration_count || 0}
                                            {session.max_participants && ` / ${session.max_participants}`}
                                        </div>

                                        {session.is_full && !session.is_registered && (
                                            <span className="text-xs text-red-600 font-medium">Full</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                </div>
            </div>
        </div>
    );
}

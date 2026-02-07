"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { liveSessionsService, type LiveSession, type SessionStatus } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Users, 
    Video, 
    Play, 
    ExternalLink,
    AlertCircle
} from "lucide-react";

    const getStatusColor = (status: SessionStatus) => {
        switch (status) {
            case 'LIVE':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'UPCOMING':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'COMPLETED':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CANCELLED':
                return 'bg-gray-50 text-gray-700 border-gray-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/live-sessions"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                    
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Registered Sessions</h1>
                <p className="text-gray-600">View and manage your session registrations</p>
            </div>

            <div>
                {registrations.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Registered Sessions</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            You haven't registered for any live sessions yet. Browse available sessions to get started.
                        </p>
                        <Link
                            href="/dashboard/live-sessions"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4aa] text-white rounded-xl hover:bg-[#00bfa6] transition-colors font-semibold shadow-lg hover:shadow-xl"
                        >
                            Browse Sessions
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {registrations.map((registration) => {
                            const session = registration.session;
                            if (!session) return null;
                            
                            return (
                            <Link
                                key={session.id}
                                href={`/dashboard/live-sessions/${session.id}`}
                                className="block bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all overflow-hidden group"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(session.status)}`}>
                                                    {session.status === 'LIVE' && <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>}
                                                    {session.status}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#00d4aa] transition-colors">
                                                {session.title}
                                            </h3>
                                            
                                            <p className="text-gray-600 mb-6 line-clamp-2">
                                                {session.description || 'No description provided'}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-medium">{formatDate(session.scheduled_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">{formatTime(session.scheduled_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    <span className="font-medium">{session.duration_minutes} min</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">{session.meeting_link && (session.status === 'UPCOMING' || session.status === 'LIVE') && (
                                                <a
                                                    href={session.meeting_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 px-4 py-3 bg-[#00d4aa] text-white rounded-xl hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl font-semibold"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Join Meeting</span>
                                                </a>
                                            )}
                                            {session.status === 'COMPLETED' && session.recording_url && (
                                                <a
                                                    href={session.recording_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                                                >
                                                    <Play className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Watch Recording</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Registration Info */}
                                    {registration.registration_date && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Registered on {formatDate(registration.registration_date)}</span>
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

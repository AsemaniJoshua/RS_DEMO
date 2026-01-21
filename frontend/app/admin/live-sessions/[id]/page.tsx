"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { liveSessionsService, type LiveSession, type SessionRegistration } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LiveSessionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;
    
    const [session, setSession] = useState<LiveSession | null>(null);
    const [registrations, setRegistrations] = useState<SessionRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessionDetails();
        fetchRegistrations();
    }, [sessionId]);

    const fetchSessionDetails = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getSessionById(sessionId);
            setSession(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load session');
            router.push('/admin/live-sessions');
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        try {
            const response = await liveSessionsService.getSessionRegistrations(sessionId);
            setRegistrations(response.data.registrations);
        } catch (error: any) {
            console.error('Failed to load registrations:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
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
                return 'bg-blue-100 text-blue-800';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading session details...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link 
                    href="/admin/live-sessions"
                    className="text-[#0066ff] hover:underline flex items-center gap-1 mb-4"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12l7 7m-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Live Sessions
                </Link>
                
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                                {session.status}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{formatDate(session.scheduled_date)} at {formatTime(session.scheduled_date)}</span>
                        </div>
                    </div>
                    <Link
                        href={`/admin/live-sessions/${sessionId}/edit`}
                        className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                    >
                        Edit Session
                    </Link>
                </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h2>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Description</label>
                            <p className="text-gray-900 mt-1">{session.description || 'No description provided'}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Duration</label>
                                <p className="text-gray-900 mt-1">{session.duration_minutes} minutes</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Max Participants</label>
                                <p className="text-gray-900 mt-1">{session.max_participants || 'Unlimited'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Meeting Link</label>
                            {session.meeting_link ? (
                                <a 
                                    href={session.meeting_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[#0066ff] hover:underline flex items-center gap-1 mt-1"
                                >
                                    Join Meeting
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" 
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                            ) : (
                                <p className="text-gray-400 mt-1">Not set</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Created By</label>
                            <p className="text-gray-900 mt-1">
                                {session.createdBy?.first_name} {session.createdBy?.last_name}
                                <span className="text-gray-500 ml-2">({session.createdBy?.role})</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recording Information</h2>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Recording URL</label>
                            {session.recording_url ? (
                                <a 
                                    href={session.recording_url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[#0066ff] hover:underline flex items-center gap-1 mt-1"
                                >
                                    View Recording
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" 
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                            ) : (
                                <p className="text-gray-400 mt-1">No recording uploaded yet</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Recording Price</label>
                            <p className="text-gray-900 mt-1">
                                {session.recording_price ? `₦${Number(session.recording_price).toLocaleString()}` : 'Free'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">*Registered users always get free access</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">Recording Purchases</label>
                            <p className="text-gray-900 mt-1">{session._count?.recordingPurchases || 0} purchases</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registrations Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Registrations ({registrations.length}{session.max_participants && `/${session.max_participants}`})
                    </h2>
                </div>

                {registrations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No registrations yet for this session.
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Email</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Phone</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Registered</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Attended</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {reg.user?.first_name} {reg.user?.last_name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {reg.user?.email}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {reg.user?.phoneNumber}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {formatDate(reg.registration_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    reg.attended 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {reg.attended ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

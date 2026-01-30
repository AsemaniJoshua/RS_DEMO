"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";

export default function LiveSessionDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;
    
    const [session, setSession] = useState<LiveSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getSessionById(sessionId);
            setSession(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load session');
            router.push('/dashboard/live-sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            await liveSessionsService.registerForSession(sessionId);
            toast.success('Successfully registered for the session!');
            fetchSession(); // Refresh to update registration status
        } catch (error: any) {
            toast.error(error.message || 'Failed to register for session');
        } finally {
            setRegistering(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!confirm('Are you sure you want to cancel your registration?')) return;

        try {
            setCancelling(true);
            await liveSessionsService.cancelRegistration(sessionId);
            toast.success('Registration cancelled successfully');
            fetchSession();
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel registration');
        } finally {
            setCancelling(false);
        }
    };

    const handlePurchaseRecording = async () => {
        try {
            setPurchasing(true);
            const response = await liveSessionsService.purchaseRecording(sessionId);
            
            // Redirect to Paystack payment page
            if (response.data?.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else {
                toast.error('Failed to initialize payment');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to purchase recording');
            setPurchasing(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
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

    if (!session) return null;

    const canRegister = session.status === 'UPCOMING' && !session.is_registered && !session.is_full;
    const canJoin = (session.status === 'UPCOMING' || session.status === 'LIVE') && session.is_registered && session.meeting_link;
    const hasRecording = session.status === 'COMPLETED' && session.recording_url;
    const canAccessRecording = hasRecording && (session.is_registered || session.has_purchased_recording);
    const canPurchaseRecording = hasRecording && !session.is_registered && !session.has_purchased_recording && session.recording_price;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <BackButton label="Back to Live Sessions" href="/dashboard/live-sessions" />
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                                    {session.status}
                                </span>
                                {session.is_registered && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                        </svg>
                                        You're Registered
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.title}</h1>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    {formatDate(session.scheduled_date)}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    {formatTime(session.scheduled_date)} ({session.duration_minutes} min)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Session</h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {session.description || 'No description provided for this session.'}
                            </p>
                        </div>

                        {/* Meeting Details (if registered) */}
                        {session.is_registered && session.meeting_link && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                    Meeting Information
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    You're registered for this session! Use the link below to join when it's time.
                                </p>
                                {canJoin && (
                                    <a
                                        href={session.meeting_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                                        </svg>
                                        Join Meeting
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Recording Section (if completed) */}
                        {hasRecording && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Recording</h3>
                                
                                {canAccessRecording ? (
                                    <div>
                                        <p className="text-gray-700 mb-4">
                                            {session.is_registered 
                                                ? 'Thank you for attending! Access the recording below.'
                                                : 'You have purchased access to this recording.'}
                                        </p>
                                        <a
                                            href={session.recording_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <polygon points="10 8 16 12 10 16 10 8"/>
                                            </svg>
                                            Watch Recording
                                        </a>
                                    </div>
                                ) : canPurchaseRecording ? (
                                    <div>
                                        <p className="text-gray-700 mb-4">
                                            Purchase access to the recording for ₦{Number(session.recording_price).toLocaleString()}
                                        </p>
                                        <button
                                            onClick={handlePurchaseRecording}
                                            disabled={purchasing}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="9" cy="21" r="1"/>
                                                <circle cx="20" cy="21" r="1"/>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                                            </svg>
                                            {purchasing ? 'Processing...' : 'Purchase Recording'}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-600">
                                        {!session.recording_price 
                                            ? 'This recording is free for registered participants.'
                                            : 'Recording is available for registered participants or for purchase.'}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Participants</span>
                                    <span className="font-medium text-gray-900">
                                        {session.registration_count || 0}
                                        {session.max_participants && ` / ${session.max_participants}`}
                                    </span>
                                </div>

                                {session.is_full && !session.is_registered && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                        This session is full
                                    </div>
                                )}

                                {canRegister && (
                                    <button
                                        onClick={handleRegister}
                                        disabled={registering}
                                        className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium disabled:opacity-50"
                                    >
                                        {registering ? 'Registering...' : 'Register for Session'}
                                    </button>
                                )}

                                {session.is_registered && session.status === 'UPCOMING' && (
                                    <button
                                        onClick={handleCancelRegistration}
                                        disabled={cancelling}
                                        className="w-full px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                                    >
                                        {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Session Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
                            <dl className="space-y-3 text-sm">
                                <div>
                                    <dt className="text-gray-600">Duration</dt>
                                    <dd className="font-medium text-gray-900">{session.duration_minutes} minutes</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-600">Status</dt>
                                    <dd className="font-medium text-gray-900">{session.status}</dd>
                                </div>
                                {session.recording_price && (
                                    <div>
                                        <dt className="text-gray-600">Recording Price</dt>
                                        <dd className="font-medium text-gray-900">
                                            ₦{Number(session.recording_price).toLocaleString()}
                                        </dd>
                                        <dd className="text-xs text-gray-500 mt-1">Free for registered participants</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Users, 
    Video, 
    Play, 
    ShoppingCart,
    CheckCircle,
    XCircle,
    AlertCircle,
    ExternalLink
} from "lucide-react";

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
            const response = await liveSessionsService.getPublicSessionById(sessionId);
            if (response.data) {
                setSession(response.data);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
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
        } catch (err: unknown) {
            const error = err as { message?: string };
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
        } catch (err: unknown) {
            const error = err as { message?: string };
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
        } catch (err: unknown) {
            const error = err as { message?: string };
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
                return 'bg-green-50 text-green-700 border-green-100';
            case 'LIVE':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'COMPLETED':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CANCELLED':
                return 'bg-gray-50 text-gray-700 border-gray-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading session details...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const isPastOrCompleted = (session.status === 'COMPLETED' || session.is_past);
    const canRegister = session.status === 'UPCOMING' && !session.is_registered && !session.is_full;
    const canJoin = (session.status === 'UPCOMING' || session.status === 'LIVE') && session.is_registered && session.meeting_link;
    const hasRecording = isPastOrCompleted && session.recording_url;
    const canAccessRecording = hasRecording && (session.is_registered || session.has_purchased_recording);
    // Show purchase button if session is past/completed, has a price, user is not registered, and has not purchased
    const canPurchaseRecording = isPastOrCompleted && session.recording_price && !session.is_registered && !session.has_purchased_recording;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/live-sessions"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Hero Banner */}
            <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(session.status)}`}>
                        {session.status === 'LIVE' && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>}
                        {session.status}
                    </span>
                    {session.is_registered && (
                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Video className="w-5 h-5 text-[#00d4aa]" />
                            About This Session
                        </h2>
                        {session.description ? (
                            <div className="overflow-hidden">
                                <div 
                                    className="prose prose-sm prose-blue max-w-none text-gray-700 overflow-x-auto [word-break:break-word]"
                                    dangerouslySetInnerHTML={{ __html: session.description }}
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No description provided for this session.</p>
                        )}
                    </div>

                    {/* Meeting Details (if registered) */}
                    {session.is_registered && session.meeting_link && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Video className="w-5 h-5 text-blue-600" />
                                Meeting Information
                            </h3>
                            <p className="text-gray-700 mb-6">
                                You're registered for this session! Use the link below to join when it's time.
                            </p>
                            {canJoin && (
                                <a
                                    href={session.meeting_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#00d4aa] text-white rounded-xl font-semibold hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Join Meeting
                                </a>
                            )}
                        </div>
                    )}

                    {/* Recording Section (if completed) */}
                    {hasRecording && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Play className="w-5 h-5 text-purple-600" />
                                Session Recording
                            </h3>
                            
                            {canAccessRecording ? (
                                <div>
                                    <p className="text-gray-700 mb-6">
                                        {session.is_registered 
                                            ? 'Thank you for attending! Access the recording below.'
                                            : 'You have purchased access to this recording.'}
                                    </p>
                                    <a
                                        href={session.recording_url || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        <Play className="w-5 h-5" />
                                        Watch Recording
                                    </a>
                                </div>
                            ) : canPurchaseRecording ? (
                                <div>
                                    <p className="text-gray-700 mb-6">
                                        Purchase access to the recording for GHS {Number(session.recording_price).toLocaleString()}
                                    </p>
                                    <button
                                        onClick={handlePurchaseRecording}
                                        disabled={purchasing}
                                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {purchasing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                Purchase Recording
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : isPastOrCompleted && session.recording_url && session.recording_price ? (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-gray-600 text-sm">
                                        {'Recording is available for registered participants or for purchase.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                    <p className="text-gray-600 text-sm">
                                        {!session.recording_price 
                                            ? 'This recording is free for registered participants.'
                                            : 'Recording is not yet available.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Registration</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Participants
                                </label>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#00d4aa]" />
                                    <span className="font-medium text-gray-900">
                                        {session.registration_count || 0}
                                        {session.max_participants && ` / ${session.max_participants}`}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Duration
                                </label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{session.duration_minutes} minutes</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Scheduled
                                </label>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {formatDate(session.scheduled_date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {formatTime(session.scheduled_date)}
                                    </span>
                                </div>
                            </div>

                            {session.recording_price && (
                                <>
                                    <div className="h-px bg-gray-100"></div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                            Recording Price
                                        </label>
                                        <div className="font-bold text-gray-900 text-lg mb-1">
                                            GHS {Number(session.recording_price).toLocaleString()}
                                        </div>
                                        <p className="text-xs text-gray-500">Free for registered participants</p>
                                    </div>
                                </>
                            )}

                            <div className="h-px bg-gray-100"></div>

                            {session.is_full && !session.is_registered && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-red-900 text-sm">Session Full</p>
                                        <p className="text-xs text-red-700 mt-1">This session has reached capacity</p>
                                    </div>
                                </div>
                            )}

                            {canRegister && (
                                <button
                                    onClick={handleRegister}
                                    disabled={registering}
                                    className="w-full px-6 py-3 bg-[#00d4aa] text-white rounded-xl font-semibold hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {registering ? 'Registering...' : 'Register for Session'}
                                </button>
                            )}

                            {session.is_registered && session.status === 'UPCOMING' && (
                                <button
                                    onClick={handleCancelRegistration}
                                    disabled={cancelling}
                                    className="w-full px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                                </button>
                            )}

                            {session.is_registered && (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                                        <CheckCircle className="w-5 h-5" />
                                        Registered
                                    </div>
                                    <p className="text-sm text-green-600">You're registered for this session</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

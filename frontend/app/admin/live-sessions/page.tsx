"use client";

import { useState, useEffect } from "react";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLiveSessionsPage() {
    const [sessions, setSessions] = useState<LiveSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<LiveSession | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getAllSessions();
            setSessions(response.data?.sessions || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async () => {
        if (!sessionToDelete) return;

        try {
            setDeleting(true);
            await liveSessionsService.deleteSession(sessionToDelete.id);
            toast.success('Session deleted successfully!');
            setShowDeleteModal(false);
            setSessionToDelete(null);
            fetchSessions();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete session');
        } finally {
            setDeleting(false);
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
                    <p className="mt-4 text-gray-600">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Sessions</h1>
                    <p className="text-gray-600">Manage upcoming and past live sessions</p>
                </div>
                <Link
                    href="/admin/live-sessions/create"
                    className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Create Live Session
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Registrations</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            <p>No live sessions found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr 
                                        key={session.id} 
                                        onClick={() => window.location.href = `/admin/live-sessions/${session.id}`}
                                        className="hover:bg-gray-50 cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <Link 
                                                href={`/admin/live-sessions/${session.id}`}
                                                className="font-medium text-gray-900 hover:text-[#0066ff]"
                                            >
                                                {session.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(session.scheduled_date)}<br/>
                                            {formatTime(session.scheduled_date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {session.duration_minutes} min
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link 
                                                href={`/admin/live-sessions/${session.id}`}
                                                className="text-sm text-[#0066ff] hover:underline"
                                            >
                                                {session._count?.registrations || 0} registered
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/live-sessions/${session.id}/edit`}
                                                    className="px-3 py-1 text-sm text-[#0066ff] hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setSessionToDelete(session);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Live Session</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{sessionToDelete?.title}"? This action cannot be undone and will also remove all registrations.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSessionToDelete(null);
                                }}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSession}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {deleting && (
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                )}
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

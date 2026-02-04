"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { liveSessionsService, type LiveSession } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditLiveSessionPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [session, setSession] = useState({
        title: "",
        description: "",
        scheduled_date: "",
        duration_minutes: 60,
        meeting_link: "",
        recording_url: "",
        recording_price: "",
        max_participants: ""
    });

    useEffect(() => {
        fetchSession();
    }, [sessionId]);

    const fetchSession = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.getSessionById(sessionId);
            const data = response.data;
            
            if (!data) {
                toast.error("Session not found");
                router.push('/admin/live-sessions');
                return;
            }

            setSession({
                title: data.title,
                description: data.description || "",
                scheduled_date: data.scheduled_date.slice(0, 16),
                duration_minutes: data.duration_minutes,
                meeting_link: data.meeting_link || "",
                recording_url: data.recording_url || "",
                recording_price: data.recording_price?.toString() || "",
                max_participants: data.max_participants?.toString() || ""
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to load session');
            router.push('/admin/live-sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // No date-in-the-future validation for scheduled_date
        try {
            setSaving(true);
            const updateData = {
                ...session,
                duration_minutes: Number(session.duration_minutes),
                recording_price: session.recording_price ? Number(session.recording_price) : undefined,
                max_participants: session.max_participants ? Number(session.max_participants) : undefined
            };

            await liveSessionsService.updateSession(sessionId, updateData);
            toast.success('Session updated successfully!');
            router.push(`/admin/live-sessions/${sessionId}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to update session');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex gap-2">
                    <Link 
                        href={`/admin/live-sessions`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-colors font-medium"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12l7 7m-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to All Sessions
                    </Link>
                    <Link
                                                href={`/admin/live-sessions/${sessionId}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg shadow-sm transition-colors font-medium"
                                                title="View Session"
                                        >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" fill="currentColor"/>
                                                </svg>
                                                View Session
                                        </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Live Session</h1>
                    <p className="text-gray-600 mt-2">Update session information and settings</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Session Title <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                        value={session.title}
                        onChange={e => setSession({...session, title: e.target.value})}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea 
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none resize-none text-gray-900 placeholder-gray-500"
                        placeholder="Provide details about the session..."
                        value={session.description}
                        onChange={e => setSession({...session, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Scheduled Date & Time <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
                            value={session.scheduled_date}
                            onChange={e => setSession({...session, scheduled_date: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="number" 
                            required
                            min="15"
                            max="480"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                            value={session.duration_minutes}
                            onChange={e => setSession({...session, duration_minutes: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Meeting Link <span className="text-red-500">*</span></label>
                    <input 
                        type="url" 
                        required
                        placeholder="https://meet.google.com/..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                        value={session.meeting_link}
                        onChange={e => setSession({...session, meeting_link: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1">Zoom, Google Meet, or any video conferencing link (required)</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recording Settings</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Recording URL</label>
                            <input 
                                type="url" 
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                                value={session.recording_url}
                                onChange={e => setSession({...session, recording_url: e.target.value})}
                            />
                            <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or any video hosting URL</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Recording Price (GHS)</label>
                            <input 
                                type="number" 
                                min="0"
                                step="0.01"
                                placeholder="Leave empty for free access"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                                value={session.recording_price}
                                onChange={e => setSession({...session, recording_price: e.target.value})}
                            />
                            <p className="text-xs text-gray-500 mt-1">Price for non-registered users. Registered users always get free access.</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Settings</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Maximum Participants</label>
                        <input 
                            type="number" 
                            min="1"
                            placeholder="Leave empty for unlimited capacity"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-500"
                            value={session.max_participants}
                            onChange={e => setSession({...session, max_participants: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Set a limit to control session size, or leave empty for unlimited</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Link
                        href={`/admin/live-sessions/${sessionId}`}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

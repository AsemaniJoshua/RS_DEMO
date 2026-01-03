"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminLiveSessionsPage() {
    const [sessions, setSessions] = useState([
        {
            id: 1,
            title: "Weekly Q&A with Dr. George",
            date: "2026-01-10",
            time: "14:00",
            duration: "1 hour",
            description: "Open session to discuss general health questions and upcoming courses.",
            meetingLink: "https://meet.google.com/abc-defg-hij",
            status: "upcoming",
            attendees: 12
        },
        {
            id: 2,
            title: "Diabetes Management Workshop",
            date: "2026-01-15",
            time: "10:00",
            duration: "2 hours",
            description: "Deep dive into dietary planning and blood sugar monitoring.",
            meetingLink: "https://meet.google.com/xyz-uvw-rst",
            "status": "upcoming",
            attendees: 45
        },
        {
            id: 3,
            title: "New Year Health Resolutions",
            date: "2025-12-28",
            time: "18:00",
            duration: "1 hour",
            description: "Planning for a healthy year ahead.",
            meetingLink: "",
            status: "completed",
            recordingLink: "https://youtube.com/watch?v=example",
            attendees: 89
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSession, setNewSession] = useState({
        title: "",
        date: "",
        time: "",
        duration: "",
        meetingLink: "",
        description: ""
    });

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault();
        const session = {
            id: sessions.length + 1,
            ...newSession,
            status: "upcoming",
            attendees: 0
        };
        setSessions([session, ...sessions]);
        setShowCreateModal(false);
        setNewSession({ title: "", date: "", time: "", duration: "", meetingLink: "", description: "" });
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Sessions</h1>
                    <p className="text-gray-600">Manage upcoming and past live sessions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors flex items-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Create Live Session
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Meeting Link</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Attendees</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sessions.map((session) => (
                                <tr key={session.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{session.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{session.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div>{session.date}</div>
                                        <div className="text-xs text-gray-500">{session.time}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{session.duration}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {session.meetingLink ? (
                                            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-[#0066ff] hover:underline flex items-center gap-1">
                                                Join
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            session.status === 'upcoming' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{session.attendees}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreateModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Live Session</h3>
                            <form onSubmit={handleCreateSession} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                        value={newSession.title}
                                        onChange={e => setNewSession({...newSession, title: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                            value={newSession.date}
                                            onChange={e => setNewSession({...newSession, date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <input 
                                            type="time" 
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                            value={newSession.time}
                                            onChange={e => setNewSession({...newSession, time: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 1 hour"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                            value={newSession.duration}
                                            onChange={e => setNewSession({...newSession, duration: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                                        <input 
                                            type="url" 
                                            placeholder="https://meet.google.com/..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                            value={newSession.meetingLink}
                                            onChange={e => setNewSession({...newSession, meetingLink: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none resize-none"
                                        value={newSession.description}
                                        onChange={e => setNewSession({...newSession, description: e.target.value})}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                                    >
                                        Create Session
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

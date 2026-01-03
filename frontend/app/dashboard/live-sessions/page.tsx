"use client";

import { useState } from "react";
import liveSessionsData from "@/data/dashboard/live-sessions.json";

export default function UserLiveSessionsPage() {
    // Cast the imported JSON data to the correct type or use it directly
    const [activeTab, setActiveTab] = useState("upcoming");

    // Filter sessions based on status logic (mock logic here based on 'status' field)
    const upcomingSessions = liveSessionsData.sessions.filter(s => s.status === "upcoming");
    const pastSessions = liveSessionsData.sessions.filter(s => s.status === "completed" || s.status === "past");

    const displayedSessions = activeTab === "upcoming" ? upcomingSessions : pastSessions;

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Live Sessions</h1>
                <p className="text-gray-600">Join upcoming live sessions with Dr. George or watch past recordings.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            activeTab === "upcoming" 
                                ? "text-[#0066ff]" 
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Upcoming Sessions
                        {activeTab === "upcoming" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066ff] rounded-t-full"></span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`pb-4 text-sm font-medium transition-colors relative ${
                            activeTab === "past" 
                                ? "text-[#0066ff]" 
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Past Sessions
                        {activeTab === "past" && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066ff] rounded-t-full"></span>
                        )}
                    </button>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedSessions.length > 0 ? (
                    displayedSessions.map((session) => (
                        <div key={session.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-32 bg-linear-to-r from-[#0066ff] to-[#00bfa6] p-6 relative">
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                                    {session.duration}
                                </div>
                                <div className="text-white/80 text-sm font-medium mb-1">{session.date} • {session.time}</div>
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{session.title}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">
                                    {session.description}
                                </p>
                                
                                {activeTab === "upcoming" ? (
                                    <div className="space-y-3">
                                        <a 
                                            href={session.meetingLink} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className={`block w-full py-2.5 text-center rounded-lg font-medium transition-colors ${
                                                session.meetingLink 
                                                    ? 'bg-[#0066ff] text-white hover:bg-[#0052cc]' 
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {session.meetingLink ? "Join Session" : "Link Coming Soon"}
                                        </a>
                                        <div className="text-center text-xs text-gray-500">
                                            {session.attendees} people registered
                                        </div>
                                    </div>
                                ) : (
                                    // Past Session Actions
                                    <button 
                                        className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                        disabled={!session.recordingLink}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Watch Recording
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M15 10l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M4 4v7a4 4 0 004 4h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions found</h3>
                        <p>There are no {activeTab} live sessions at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

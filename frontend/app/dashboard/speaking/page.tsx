"use client";

import Link from "next/link";

// Mock Data
const SPEAKING_EVENTS = [
    {
        id: "1",
        title: "Global Health Summit 2025",
        date: "Nov 15, 2025",
        location: "London, UK",
        type: "Keynote",
        description: "Discussing the role of AI in predictive medicine.",
        image: "/event-1.jpg"
    },
    {
        id: "2",
        title: "TechMed Conference",
        date: "Dec 05, 2025",
        location: "San Francisco, CA",
        type: "Panel Discussion",
        description: "Panel on the ethics of genetic editing.",
        image: "/event-2.jpg"
    },
    {
        id: "3",
        title: "Vitality Webinar Series",
        date: "Jan 20, 2026",
        location: "Online",
        type: "Webinar",
        description: "Interactive session on holistic wellness strategies.",
        image: "/event-3.jpg"
    }
];

export default function SpeakingPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Speaking Events</h1>
                <p className="text-gray-600">Upcoming appearances and past talks by Dr. George</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SPEAKING_EVENTS.map((event) => (
                    <Link key={event.id} href={`/dashboard/speaking/${event.id}`} className="group">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-gray-100 relative">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-[#0066ff]">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    {event.date}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066ff] transition-colors">{event.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    {event.location}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

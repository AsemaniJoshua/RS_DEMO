"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DeleteModal from "@/components/dashboard/DeleteModal";

// Mock Data
const SPEAKING_EVENTS = [
    {
        id: "1",
        title: "Global Health Summit 2025",
        date: "Nov 15, 2025",
        time: "10:00 AM - 12:00 PM",
        location: "London, UK",
        type: "Keynote",
        description: "Discussing the role of AI in predictive medicine and the future of healthcare technology.",
        organizer: "World Health Organization",
        status: "Upcoming"
    },
    // ...
];

export default function SpeakingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Mock fetch
    const event = SPEAKING_EVENTS.find(e => e.id === params.id) || SPEAKING_EVENTS[0];

    const handleDelete = () => {
        console.log("removing event:", event.id);
        setIsDeleteModalOpen(false);
        router.push("/dashboard/speaking");
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/speaking" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Back to Events
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="relative h-64 bg-gray-900 flex items-center justify-center text-white p-8 text-center">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                     <div className="relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-semibold mb-4 backdrop-blur-sm">
                            {event.type}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                        <div className="flex items-center justify-center gap-6 text-sm md:text-base opacity-90">
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                {event.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                {event.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">About the Event</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                            
                            <h3 className="font-semibold text-gray-900 mb-2">Organizer</h3>
                            <p className="text-gray-600 mb-6">{event.organizer}</p>

                             <h3 className="font-semibold text-gray-900 mb-2">Schedule</h3>
                             <p className="text-gray-600 mb-6">{event.date} at {event.time}</p>
                        </div>
                        
                        <div className="md:col-span-1">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-[#0066ff] text-white px-4 py-2 rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                        Register / Attend
                                    </button>
                                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                                        Add to Calendar
                                    </button>
                                    <button 
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="w-full border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Remove from List
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Remove Event"
                message="Are you sure you want to remove this event from your list?"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

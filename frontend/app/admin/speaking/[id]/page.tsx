"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import speakingData from "@/data/admin/speaking.json";
import DeleteSpeakingEventModal from "@/components/admin/DeleteSpeakingEventModal";

export default function ViewSpeakingEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [event, setEvent] = useState<any>(null);

    // Load event data
    useEffect(() => {
        const foundEvent = speakingData.engagements.find(e => e.id === parseInt(eventId));
        
        if (foundEvent) {
            setEvent(foundEvent);
            setIsLoading(false);
        } else {
            toast.error("Event not found");
            router.push("/admin/speaking");
        }
    }, [eventId, router]);

    const handleDelete = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log("Deleting event:", eventId);
            
            toast.success("Event deleted successfully!");
            router.push("/admin/speaking");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                    <p className="text-gray-600">Loading event...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/admin/speaking"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{event.title}</h1>
                            <p className="text-sm text-gray-600 mt-1">{event.venue}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={`/admin/speaking/${eventId}/edit`}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit Event
                        </Link>
                        <button
                            onClick={() => setDeleteModal(true)}
                            className="p-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete event"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    event.status === "Upcoming" ? "bg-green-50 text-green-700" :
                    event.status === "Completed" ? "bg-blue-50 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                }`}>
                    {event.status}
                </span>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Event Information</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                                <p className="text-gray-900">{event.category}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Date</label>
                                <p className="text-gray-900">{new Date(event.date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
                                <p className="text-gray-900">{event.location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description Section (when available) */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">About This Event</h2>
                        <p className="text-gray-600">
                            Event description and details would appear here. This includes information about topics to be covered, 
                            live stream links, and any other relevant details for patients.
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Event Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                            </div>


                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Location</p>
                                    <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href={`/admin/speaking/${eventId}/edit`}
                                className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit Details
                            </Link>
                            <button
                                onClick={() => setDeleteModal(true)}
                                className="w-full px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Delete Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteSpeakingEventModal
                isOpen={deleteModal}
                onCancel={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                eventTitle={event.title}
            />
        </div>
    );
}

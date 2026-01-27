"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { speakingService, SpeakingEvent, Category } from "@/services/speaking-service";
import DeleteSpeakingEventModal from "@/components/admin/DeleteSpeakingEventModal";
import CategoryManagementModal from "@/components/admin/CategoryManagementModal";
import toast from "react-hot-toast";

export default function SpeakingEventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; title: string }>({
        show: false,
        id: null,
        title: ""
    });
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [events, setEvents] = useState<SpeakingEvent[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch events and categories
    useEffect(() => {
        fetchEventsAndCategories();
    }, []);

    const fetchEventsAndCategories = async () => {
        try {
            setIsLoading(true);
            const [eventsData, categoriesData] = await Promise.all([
                speakingService.getAllEvents(),
                speakingService.getAllCategories()
            ]);
            setEvents(eventsData);
            setCategories(categoriesData);
        } catch (error: any) {
            toast.error(error.message || "Failed to load events");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter events
    const filteredSpeaking = events.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
        const matchesStatus = statusFilter === "All Statuses" || 
            (statusFilter === "Upcoming" && item.status === "UPCOMING") ||
            (statusFilter === "Completed" && item.status === "COMPLETED") ||
            (statusFilter === "Cancelled" && item.status === "CANCELLED");
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Calculate stats
    const speakingStats = {
        total: events.length,
        upcoming: events.filter(e => e.status === "UPCOMING").length,
        completed: events.filter(e => e.status === "COMPLETED").length
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteModal({ show: true, id, title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.id) return;
        
        setIsDeleting(true);
        try {
            await speakingService.deleteEvent(deleteModal.id);
            toast.success("Event deleted successfully");
            setDeleteModal({ show: false, id: null, title: "" });
            fetchEventsAndCategories(); // Refresh list
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModal({ show: false, id: null, title: "" });
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Speaking Events</h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Share upcoming speaking events with your patients. They can watch live or attend in person - all events are free!
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{speakingStats.total}</div>
                            <div className="text-sm text-gray-600">Total Events</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{speakingStats.upcoming}</div>
                            <div className="text-sm text-gray-600">Upcoming Events</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{speakingStats.completed}</div>
                            <div className="text-sm text-gray-600">Past Events</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                            title="Manage categories"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <Link href="/admin/speaking/new">
                        <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                            + Add Event
                        </button>
                    </Link>
                </div>
            </div>

            {/* Speaking Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-600">Loading events...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSpeaking.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-600">
                                        No events found
                                    </td>
                                </tr>
                            ) : (
                                filteredSpeaking.map((engagement, idx) => (
                                    <tr key={engagement.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                                    {engagement.image ? (
                                                        <img 
                                                            src={engagement.image} 
                                                            alt={engagement.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM11 13.5l2.5 3.01L17 12l4 5H3l4-6 4 7.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{engagement.title}</div>
                                                    <div className="text-sm text-gray-600">{engagement.venue}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                {engagement.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{new Date(engagement.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{engagement.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                engagement.status === "UPCOMING" ? "bg-green-50 text-green-700" :
                                                engagement.status === "COMPLETED" ? "bg-blue-50 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {engagement.status === "UPCOMING" ? "Upcoming" :
                                                 engagement.status === "COMPLETED" ? "Completed" :
                                                 "Cancelled"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/speaking/${engagement.id}`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="View event">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/speaking/${engagement.id}/edit`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="Edit event">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(engagement.id, engagement.title)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                                                    title="Delete event"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
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

            {/* Empty State */}
            {!isLoading && filteredSpeaking.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600 mb-4">Start sharing your speaking events with your patients!</p>
                    <Link href="/admin/speaking/new">
                        <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium">
                            Add Your First Event
                        </button>
                    </Link>
                </div>
            )}

            {/* Delete Modal */}
            <DeleteSpeakingEventModal
                isOpen={deleteModal.show}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                eventTitle={deleteModal.title}
                isDeleting={isDeleting}
            />

            {/* Category Management Modal */}
            <CategoryManagementModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                categories={categories}
                onCategoryChange={fetchEventsAndCategories}
            />
        </div>
    );
}

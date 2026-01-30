"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { speakingService, SpeakingEvent } from "@/services/speaking-service";
import DeleteSpeakingEventModal from "@/components/admin/DeleteSpeakingEventModal";
import { 
    Calendar, 
    MapPin, 
    Tag, 
    Edit2, 
    Trash2, 
    ArrowLeft,
    Clock,
    Globe,
    Info,
    ImageIcon
} from "lucide-react";

export default function ViewSpeakingEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [event, setEvent] = useState<SpeakingEvent | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await speakingService.getEventById(eventId);
                if (!data) throw new Error("Event not found");
                setEvent(data);
                setIsLoading(false);
            } catch (error: any) {
                toast.error(error.message || "Failed to load event");
                router.push("/admin/speaking");
            }
        };
        fetchEvent();
    }, [eventId, router]);

    const handleDelete = async () => {
        try {
            await speakingService.deleteEvent(eventId);
            toast.success("Event deleted successfully!");
            router.push("/admin/speaking");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPCOMING': return 'bg-green-50 text-green-700 border-green-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/speaking"
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>ID: {event.id.slice(0, 8)}...</span>
                            <span>•</span>
                            <span>Created {new Date(event.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/speaking/${eventId}/edit`}>
                        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 shadow-sm">
                            <Edit2 className="w-4 h-4" />
                            Edit Event
                        </button>
                    </Link>
                    <button 
                        onClick={() => setDeleteModal(true)}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Hero Banner (Image) */}
            {event.image ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-64 md:h-[400px] object-cover"
                    />
                </div>
            ) : (
                <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No event image provided</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                                <p className="text-gray-500 text-lg">{event.venue}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(event.status)}`}>
                                {event.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Date</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {new Date(event.date).toLocaleDateString(undefined, { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Location</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Info className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">About This Event</h3>
                        </div>
                        
                        {event.description ? (
                            <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {event.description}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No description provided.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Event Metadata</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Category
                                </label>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#00d4aa]" />
                                    <span className="font-medium text-gray-900">{event.category}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Venue
                                </label>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{event.venue}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Last Updated
                                </label>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(event.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteSpeakingEventModal
                isOpen={deleteModal}
                onCancel={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                eventTitle={event.title}
            />
        </div>
    );
}

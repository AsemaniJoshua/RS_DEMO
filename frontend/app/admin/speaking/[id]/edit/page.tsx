"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { speakingService, SpeakingEvent, Category } from "@/services/speaking-service";
import DeleteSpeakingEventModal from "@/components/admin/DeleteSpeakingEventModal";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditSpeakingEventPage() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        venue: "",
        category: "",
        date: "",
        location: "",
        image: "",
        imagePublicId: "",
        description: "",
        status: "UPCOMING" as "UPCOMING" | "COMPLETED" | "CANCELLED"
    });

    // Load event data and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [event, cats] = await Promise.all([
                    speakingService.getEventById(eventId),
                    speakingService.getAllCategories()
                ]);
                
                if (event) {
                    setFormData({
                        title: event.title,
                        venue: event.venue,
                        category: event.category,
                        date: event.date.split('T')[0], // Convert to YYYY-MM-DD format
                        location: event.location,
                        image: event.image,
                        imagePublicId: event.imagePublicId,
                        description: event.description || "",
                        status: event.status
                    });
                }
                setCategories(cats);
                setIsLoading(false);
            } catch (error: any) {
                toast.error(error.message || "Failed to load event");
                router.push("/admin/speaking");
            }
        };
        fetchData();
    }, [eventId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            toast.error("Event title is required");
            return;
        }
        if (!formData.venue.trim()) {
            toast.error("Venue is required");
            return;
        }
        if (!formData.date) {
            toast.error("Event date is required");
            return;
        }

        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            toast.error("Event date must be in the future");
            return;
        }
        if (!formData.location.trim()) {
            toast.error("Location is required");
            return;
        }

        setIsSubmitting(true);

        try {
            await speakingService.updateEvent(eventId, formData);
            toast.success("Speaking event updated successfully!");
            router.push("/admin/speaking");
        } catch (error: any) {
            toast.error(error.message || "Failed to update event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await speakingService.deleteEvent(eventId);
            toast.success("Event deleted successfully!");
            router.push("/admin/speaking");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
            setIsDeleting(false); // Only set to false on error, as success redirects
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

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Link 
                        href="/admin/speaking"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Speaking Event</h1>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                    Update event details
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 space-y-6">
                    {/* Event Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Healthcare Innovation Summit 2024"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Event Image <span className="text-red-500">*</span>
                        </label>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => {
                                if (typeof url === 'string') {
                                    setFormData(prev => ({ ...prev, image: url }));
                                }
                            }}
                            onUploadComplete={(data) => setFormData(prev => ({ 
                                ...prev, 
                                image: data.url,
                                imagePublicId: data.public_id 
                            }))}
                            label="Update Event Image"
                        />
                    </div>

                    {/* Venue */}
                    <div>
                        <label htmlFor="venue" className="block text-sm font-semibold text-gray-900 mb-2">
                            Venue <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                            placeholder="Specific Building/Room (e.g., Convention Center, Room 204)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            required
                        />
                    </div>

                    {/* Category and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >

                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                <option value="UPCOMING">Upcoming</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                            Event Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State (e.g., Austin, TX)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            required
                        />
                    </div>


                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                            Description / Details
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide details about the event, topics to be covered, live stream link, etc."
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 resize-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Updating..." : "Update Event"}
                        </button>
                        <Link
                            href="/admin/speaking"
                            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setDeleteModal(true)}
                        className="px-6 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                        Delete Event
                    </button>
                </div>
            </form>

            {/* Delete Modal */}
            <DeleteSpeakingEventModal
                isOpen={deleteModal}
                onCancel={() => !isDeleting && setDeleteModal(false)}
                onConfirm={handleDelete}
                eventTitle={formData.title}
                isDeleting={isDeleting}
            />
        </div>
    );
}

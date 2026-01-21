"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { liveSessionsService } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateLiveSessionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        scheduled_date: "",
        duration_minutes: 60,
        meeting_link: "",
        recording_price: "",
        max_participants: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const payload = {
                ...formData,
                duration_minutes: parseInt(formData.duration_minutes.toString()) || 60,
                recording_price: formData.recording_price ? parseFloat(formData.recording_price) : null,
                max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
            };

            await liveSessionsService.createSession(payload);
            toast.success("Live session created successfully!");
            router.push("/admin/live-sessions");
        } catch (error: any) {
            toast.error(error.message || "Failed to create session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link 
                        href="/admin/live-sessions"
                        className="text-[#0066ff] hover:underline flex items-center gap-1 mb-4"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12l7 7m-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to Live Sessions
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Live Session</h1>
                    <p className="text-gray-600 mt-2">Schedule a new live session with Dr. George</p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Session Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter session title"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Enter session description"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Scheduled Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="scheduled_date"
                                    value={formData.scheduled_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Duration (minutes) *
                                </label>
                                <input
                                    type="number"
                                    name="duration_minutes"
                                    value={formData.duration_minutes}
                                    onChange={handleChange}
                                    required
                                    min="15"
                                    placeholder="60"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Meeting Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Meeting Link
                            </label>
                            <input
                                type="url"
                                name="meeting_link"
                                value={formData.meeting_link}
                                onChange={handleChange}
                                placeholder="https://zoom.us/j/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                            />
                            <p className="text-sm text-gray-500 mt-1">You can add this later if not available yet</p>
                        </div>

                        {/* Recording Price and Max Participants */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Recording Price (₦)
                                </label>
                                <input
                                    type="number"
                                    name="recording_price"
                                    value={formData.recording_price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Free for registered participants"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">Price for non-registrants to purchase recording</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    name="max_participants"
                                    value={formData.max_participants}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Unlimited"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                                />
                                <p className="text-sm text-gray-500 mt-1">Leave empty for unlimited capacity</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/live-sessions")}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Session"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

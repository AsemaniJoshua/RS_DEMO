"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import speakingData from "@/data/admin/speaking.json";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditSpeakingEngagementPage() {
    const router = useRouter();
    const params = useParams();
    const engagementId = parseInt(params.id as string);

    const engagement = speakingData.engagements.find(e => e.id === engagementId);

    const [formData, setFormData] = useState({
        title: engagement?.title || "",
        category: engagement?.category || "Healthcare Conference",
        date: engagement?.date || "",
        location: engagement?.location || "",
        venue: engagement?.venue || "",
        attendees: engagement?.attendees.toString() || "",
        duration: engagement?.duration || "",
        fee: engagement?.fee.toString() || "",
        status: engagement?.status || "Upcoming",
        description: engagement?.description || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated speaking engagement:", formData);
        router.push("/admin/speaking");
    };

    if (!engagement) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Engagement Not Found</h2>
                    <p className="text-gray-600 mb-4">The speaking engagement you're looking for doesn't exist.</p>
                    <Link href="/admin/speaking">
                        <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                            Back to Speaking & Consulting
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Speaking Engagement</h1>
                    <p className="text-gray-600">Update engagement information</p>
                </div>
                <Link href="/admin/speaking">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Engagement Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{engagement.attendees.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Expected Attendees</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{engagement.duration}</div>
                            <div className="text-xs text-gray-600">Duration</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {engagement.fee > 0 ? `$${engagement.fee.toLocaleString()}` : "Free"}
                            </div>
                            <div className="text-xs text-gray-600">Speaking Fee</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Future of Healthcare: AI and Pharmacy"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Category and Status */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                {speakingData.categories.filter(c => c !== "All Categories").map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                {speakingData.statuses.filter(s => s !== "All Statuses").map((status, idx) => (
                                    <option key={idx} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date and Duration */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Event Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 45 min"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Location and Venue */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Boston, MA"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Venue <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Boston Convention Center"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Expected Attendees and Speaking Fee */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Expected Attendees <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="attendees"
                                value={formData.attendees}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 850"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Speaking Fee ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="fee"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            placeholder="Describe the speaking engagement, topics to be covered, audience, etc..."
                            minHeight="200px"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Update Engagement
                        </button>
                        <Link href="/admin/speaking">
                            <button
                                type="button"
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

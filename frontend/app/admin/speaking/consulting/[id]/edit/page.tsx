"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import consultingData from "@/data/admin/consulting.json";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditConsultingProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = parseInt(params.id as string);

    const project = consultingData.projects.find(p => p.id === projectId);

    const [formData, setFormData] = useState({
        title: project?.title || "",
        client: project?.client || "",
        category: project?.category || "Strategy Consulting",
        startDate: project?.startDate || "",
        endDate: project?.endDate || "",
        status: project?.status || "Active",
        budget: project?.budget.toString() || "",
        completion: project?.completion.toString() || "0",
        description: project?.description || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated consulting project:", formData);
        router.push("/admin/speaking");
    };

    if (!project) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-600 mb-4">The consulting project you're looking for doesn't exist.</p>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Consulting Project</h1>
                    <p className="text-gray-600">Update project information</p>
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Project Statistics</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{project.client}</div>
                            <div className="text-xs text-gray-600">Client</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">${project.budget.toLocaleString()}</div>
                            <div className="text-xs text-gray-600">Budget</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{project.completion}%</div>
                            <div className="text-xs text-gray-600">Completion</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${
                                project.status === "Active" ? "text-green-600" :
                                project.status === "Completed" ? "text-blue-600" :
                                "text-yellow-600"
                            }`}>
                                {project.status}
                            </div>
                            <div className="text-xs text-gray-600">Status</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Project Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Retail Pharmacy Digital Transformation"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Client and Category */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Client Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                                placeholder="e.g., MedCare Pharmacy Chain"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
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
                                {consultingData.categories.filter(c => c !== "All Categories").map((cat, idx) => (
                                    <option key={idx} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Budget, Status, and Completion */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Budget ($) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                    placeholder="45000"
                                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
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
                                {consultingData.statuses.filter(s => s !== "All Statuses").map((status, idx) => (
                                    <option key={idx} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Completion (%) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="completion"
                                    value={formData.completion}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="100"
                                    placeholder="0"
                                    className="w-full px-4 pr-10 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Project Progress
                        </label>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#00d4aa] transition-all duration-300"
                                style={{ width: `${formData.completion}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formData.completion}% Complete</p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Project Description <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            placeholder="Describe the consulting project scope, objectives, deliverables, etc..."
                            minHeight="250px"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Update Project
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

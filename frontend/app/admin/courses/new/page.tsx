"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";

export default function AddCoursePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // File states
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [courseFile, setCourseFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        duration: "",
        description: "",
        status: "DRAFT"
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await courseService.getCategories();
            // courseService.getCategories returns the array directly
            setCategories(res || []);
        } catch (error) {
            console.error("Failed to load categories", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price.toString());
            data.append("categoryId", formData.category);
            data.append("status", formData.status);
            data.append("duration", formData.duration);
            
            if (thumbnail) data.append("thumbnail", thumbnail);
            if (courseFile) data.append("courseFile", courseFile);

            await courseService.createCourse(data);
            toast.success("Course created successfully!");
            router.push("/admin/courses");
        } catch (error: any) {
            console.error("Error creating course", error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Course</h1>
                    <p className="text-gray-600">Create a new course for your students</p>
                </div>
                <Link href="/admin/courses">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Course Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Course Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Diabetes Management Fundamentals"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Category and Price */}
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
                                <option value="">Select Category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">GHS</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    placeholder="99"
                                    className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Duration and Status */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Duration (Hours) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                placeholder="e.g., 2"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
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
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={6}
                            placeholder="Describe what students will learn in this course..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 resize-none"
                        />
                    </div>

                    {/* Course Thumbnail */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Course Thumbnail
                        </label>
                        <ImageUpload
                            label=""
                            value={thumbnail ? URL.createObjectURL(thumbnail) : ""}
                            onChange={(file) => {
                                if (file === null || file instanceof File) {
                                    setThumbnail(file);
                                }
                            }}
                        />
                    </div>

                    {/* Course File (ZIP) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Course Content (ZIP)
                        </label>
                        <FileUpload
                            label="Upload Course ZIP"
                            accept={ { 'application/zip': ['.zip'], 'application/x-zip-compressed': ['.zip'], 'application/x-7z-compressed': ['.7z'], 'application/x-rar-compressed': ['.rar'] } }
                            value={courseFile}
                            onChange={(file) => setCourseFile(file)}
                            onRemove={() => setCourseFile(null)}
                            maxSize={1024 * 1024 * 1024} // 1GB
                        />
                         <p className="text-xs text-gray-500 mt-1">Max size: 1GB</p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating..." : "Create Course"}
                        </button>
                        <Link href="/admin/courses">
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

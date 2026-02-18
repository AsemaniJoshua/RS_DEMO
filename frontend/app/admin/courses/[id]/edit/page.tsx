"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Loading initial data
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        duration: "", 
        description: "",
        status: "DRAFT"
    });
    
    // File states - for uploads
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [courseFile, setCourseFile] = useState<File | null>(null);
    
    // Existing file URLs for display
    const [existingThumbnail, setExistingThumbnail] = useState<string>("");
    const [existingFile, setExistingFile] = useState<string>("");

    useEffect(() => {
        const init = async () => {
            if (id) {
                await Promise.all([loadCategories(), loadCourse()]);
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const loadCategories = async () => {
        try {
            const res = await courseService.getCategories();
            setCategories(res || []);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const loadCourse = async () => {
        try {
            const course: any = await courseService.getCourseById(id);
            if (course) {
                setFormData({
                    title: course.title,
                    category: course.categoryId,
                    price: course.price,
                    // Parse "X hours" to just "X"
                    duration: course.duration ? course.duration.replace(" hours", "") : "",
                    description: course.description,
                    status: course.status
                });
                setExistingThumbnail(course.thumbnailUrl || "");
                // For course file, we might not have a direct clickable URL for raw files easily previewable, but we can show it exists
                setExistingFile(course.fileUrl || "");
            }
        } catch (error) {
            console.error("Failed to load course", error);
            toast.error("Failed to load course details");
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

            // Only send new thumbnail if it's a File
            if (thumbnail instanceof File) data.append("thumbnail", thumbnail);
            // Only send new courseFile if it's a File
            if (courseFile instanceof File) data.append("courseFile", courseFile);

            await courseService.updateCourse(id, data);
            toast.success("Course updated successfully!");
            router.push("/admin/courses");
        } catch (error: any) {
            console.error("Error updating course", error);
            toast.error(error.response?.data?.message || "Failed to update course");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Course</h1>
                    <p className="text-gray-600">Update course details and content</p>
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
                                {categories.length === 0 && <option value="">Loading categories...</option>}
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Price (GHS) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
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
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) => setFormData({ ...formData, description: value })}
                            placeholder="Describe what students will learn in this course..."
                            minHeight="300px"
                        />
                    </div>

                    {/* Course Thumbnail */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Course Thumbnail
                        </label>
                        <ImageUpload
                            label="Change Thumbnail"
                            value={thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail}
                            onChange={(val) => {
                                if (val === null || val instanceof File) {
                                    setThumbnail(val);
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
                            label="Change Course ZIP"
                            accept={ { 'application/zip': ['.zip'], 'application/x-zip-compressed': ['.zip'], 'application/x-7z-compressed': ['.7z'], 'application/x-rar-compressed': ['.rar'] } }
                            value={courseFile || existingFile}
                            onChange={(file) => setCourseFile(file)}
                            onRemove={() => { setCourseFile(null); setExistingFile(""); }} // Note: Removing existing file logic needs backend support if we want to explicitly delete without replacing. But here we just clear selection.
                            maxSize={1024 * 1024 * 1024} // 1GB
                        />
                         <p className="text-xs text-gray-500 mt-1">Max size: 1GB</p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting && (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {submitting ? "Updating..." : "Update Course"}
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

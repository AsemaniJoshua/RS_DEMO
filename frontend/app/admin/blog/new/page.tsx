"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import blogData from "@/data/admin/blog.json";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewBlogPostPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "Health Education",
        excerpt: "",
        content: "",
        tags: "",
        status: "Draft"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Blog post data:", formData);
        router.push("/admin/blog");
    };

    // Generate slug from title
    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setFormData({ ...formData, slug });
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
                    <p className="text-gray-600">Write and publish a new blog post</p>
                </div>
                <Link href="/admin/blog">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Post Title <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.title}
                            onChange={(value) => setFormData({ ...formData, title: value })}
                            placeholder="e.g., Understanding Diabetes: A Comprehensive Guide"
                            minHeight="60px"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            URL Slug <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="understanding-diabetes-guide"
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={generateSlug}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Generate from Title
                            </button>
                        </div>
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
                                {blogData.categories.filter(c => c !== "All Categories").map((cat, idx) => (
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
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Excerpt <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.excerpt}
                            onChange={(value) => setFormData({ ...formData, excerpt: value })}
                            placeholder="Brief summary of the post (appears in listings)"
                            minHeight="120px"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Brief description for post preview
                        </p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Tags
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="Separate tags with commas (e.g., Diabetes, Health, Prevention)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(value) => setFormData({ ...formData, content: value })}
                            placeholder="Write your blog post content here..."
                            minHeight="400px"
                        />
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Featured Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00d4aa] transition-colors cursor-pointer">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-gray-400">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <p className="text-sm text-gray-600 mb-1">Click to upload featured image</p>
                            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            {formData.status === "Published" ? "Publish Post" : "Save Draft"}
                        </button>
                        <Link href="/admin/blog">
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

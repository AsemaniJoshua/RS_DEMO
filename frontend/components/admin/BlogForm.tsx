"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogService, CreateBlogData, Blog } from "@/services/blog-service";
import RichTextEditor from "@/components/admin/RichTextEditor";
import BlogCategorySelect from "@/components/admin/BlogCategorySelect";
import BlogTagInput from "@/components/admin/BlogTagInput";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface BlogFormProps {
    initialData?: Blog;
    isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [formData, setFormData] = useState<CreateBlogData>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featured_image: "",
        status: "DRAFT",
        meta_title: "",
        meta_description: "",
        categories: [],
        tags: []
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                featured_image: initialData.featured_image || "",
                status: initialData.status,
                meta_title: initialData.meta_title || "",
                meta_description: (initialData.meta_description || "").replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
                categories: initialData.categories?.map(c => ({ name: c.name, slug: c.slug })) || [],
                tags: initialData.tags?.map(t => ({ name: t.name })) || []
            });
            setPreviewUrl(initialData.featured_image || "");
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates: Partial<CreateBlogData> = { [name]: value };
            
            // Auto-update meta fields if they're empty or match the previous source value
            // For simplicity and user expectation, we'll sync them while typing
            if (name === 'title') {
                updates.meta_title = value;
            }

            
            return {
                ...prev,
                ...updates
            };
        });
    };

    const handleCategoriesChange = (categories: { name: string; slug: string }[]) => {
        setFormData(prev => ({ ...prev, categories }));
    };

    const handleTagsChange = (tags: { name: string }[]) => {
        setFormData(prev => ({ ...prev, tags }));
    };

    const handleImageChange = (value: string | File | null) => {
        if (typeof value === 'string') {
            setFormData(prev => ({ ...prev, featured_image: value }));
            setPreviewUrl(value);
        } else if (value instanceof File) {
            setPreviewUrl(URL.createObjectURL(value));
        } else if (value === null) {
            setFormData(prev => ({ ...prev, featured_image: '' }));
            setPreviewUrl("");
        }
    };

    const handleFileSelect = (file: File | null) => {
        setImageFile(file);
    };

    const handleGenerateSlug = () => {
        if (!formData.title) return;
        const slug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Only include imageFile if a new file is selected (not a string URL)
            let dataToSubmit: any = { ...formData };
            if (imageFile && imageFile instanceof File) {
                dataToSubmit.imageFile = imageFile;
            }

            if (isEditing && initialData) {
                await blogService.updateBlog(initialData.id, dataToSubmit);
                toast.success("Blog updated successfully!");
            } else {
                await blogService.createBlog(dataToSubmit);
                toast.success("Blog created successfully!");
            }
            router.push("/admin/blog");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditing ? "Edit Blog Post" : "Create New Post"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isEditing ? "Update your existing blog post" : "Write and publish a new blog post"}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/blog">
                        <button type="button" className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                        )}
                        {isEditing ? "Update Post" : "Create Post"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Post Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter post title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-lg font-medium text-gray-900"
                        />
                    </div>

                    {/* Slug */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                                placeholder="post-url-slug"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent bg-gray-50 text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={handleGenerateSlug}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                            placeholder="Write your amazing content here..."
                            minHeight="400px"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Excerpt
                        </label>
                        <RichTextEditor
                            value={formData.excerpt || ""}
                            onChange={(value) => {
                                setFormData(prev => ({
                                    ...prev,
                                    excerpt: value,
                                    meta_description: value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
                                }));
                            }}
                            placeholder="Brief summary of the post..."
                            minHeight="150px"
                        />
                        <p className="text-sm text-gray-500 mt-1">Appears in blog listings and search results.</p>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    placeholder="SEO Title"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    name="meta_description"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="SEO Description"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent resize-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Publishing */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                        <ImageUpload 
                            value={previewUrl || formData.featured_image}
                            onChange={handleImageChange}
                            onFileSelect={handleFileSelect}
                        />
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                        <BlogCategorySelect 
                            selectedCategories={formData.categories || []}
                            onChange={handleCategoriesChange}
                        />
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                        <BlogTagInput 
                            selectedTags={formData.tags || []}
                            onChange={handleTagsChange}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

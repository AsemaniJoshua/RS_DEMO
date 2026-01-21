"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogService, Blog } from "@/services/blog-service";
import toast from "react-hot-toast";
import { ArrowLeft, Edit, Calendar, User, Tag, Folder, Eye } from "lucide-react";

export default function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await blogService.getBlogById(id);
                setBlog((response.data as any).blog);
            } catch (error: any) {
                toast.error("Failed to load blog details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    const getStatusBadge = (status: string) => {
        const styles = {
            PUBLISHED: "bg-green-100 text-green-800 border-green-200",
            DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
            ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200"
        };
        return styles[status as keyof typeof styles] || styles.DRAFT;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
                <p className="text-gray-600 mb-4">The blog post you are looking for does not exist.</p>
                <Link href="/admin/blog" className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc]">
                    Back to Blog List
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(blog.status)}`}>
                                {blog.status}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(blog.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{blog.title}</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/admin/blog/${blog.id}/edit`}>
                        <button className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Post
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Featured Image */}
                    {blog.featured_image && (
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                            <img 
                                src={blog.featured_image} 
                                alt={blog.title} 
                                className="w-full h-auto object-cover max-h-[400px]" 
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div 
                            className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#0066ff]"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Meta Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Author</label>
                                <div className="flex items-center gap-2 text-gray-900">
                                    <User className="w-4 h-4 text-gray-400" />
                                    {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Unknown'}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">URL Slug</label>
                                <div className="text-sm text-gray-600 break-all bg-gray-50 p-2 rounded border border-gray-100">
                                    /{blog.slug}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Excerpt</label>
                                <p className="text-sm text-gray-600 italic">
                                    {blog.excerpt || "No excerpt provided."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Categories & Tags */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Folder className="w-4 h-4 text-gray-500" />
                                Categories
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.categories && blog.categories.length > 0 ? (
                                    blog.categories.map((cat: any) => (
                                        <span key={cat.id} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {cat.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">Uncategorized</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" />
                                Tags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags && blog.tags.length > 0 ? (
                                    blog.tags.map((tag: any) => (
                                        <span key={tag.id} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                            {tag.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">No tags</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SEO Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Metadata</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Meta Title</label>
                                <div className="text-sm text-gray-900">{blog.meta_title || "-"}</div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Meta Description</label>
                                <div className="text-sm text-gray-600">{blog.meta_description || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

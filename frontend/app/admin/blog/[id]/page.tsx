"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogService, Blog } from "@/services/blog-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Edit2, 
    Calendar, 
    User, 
    Tag, 
    Folder, 
    Globe, 
    Type, 
    AlignLeft, 
    ImageIcon 
} from "lucide-react";

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-green-50 text-green-700 border-green-100';
            case 'DRAFT': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'ARCHIVED': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading post details...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
                <p className="text-gray-600 mb-4">The blog post you are looking for does not exist.</p>
                <Link href="/admin/blog" className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                    Back to Blog List
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/blog"
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>ID: {blog.id.slice(0, 8)}...</span>
                            <span>•</span>
                            <span>Created {new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/blog/${blog.id}/edit`}>
                        <button className="px-5 py-2.5 bg-[#00d4aa] text-white rounded-xl hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2 shadow-sm shadow-teal-500/20">
                            <Edit2 className="w-4 h-4" />
                            Edit Post
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Image */}
                    {blog.featured_image ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <img 
                                src={blog.featured_image} 
                                alt={blog.title} 
                                className="w-full h-64 md:h-96 object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                            <span className="text-sm font-medium">No featured image</span>
                        </div>
                    )}

                    {/* Content Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(blog.status)}`}>
                                    {blog.status}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-blue max-w-none text-gray-700 bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Meta Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Post Metadata</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Author
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {blog.author ? (blog.author.first_name[0] + blog.author.last_name[0]) : 'U'}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    URL Slug
                                </label>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600 break-all border border-gray-100">
                                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                    {blog.slug}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Categories
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {blog.categories && blog.categories.length > 0 ? (
                                        blog.categories.map((cat: any) => (
                                            <span key={cat.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                <Folder className="w-3 h-3" />
                                                {cat.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Uncategorized</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags && blog.tags.length > 0 ? (
                                        blog.tags.map((tag: any) => (
                                            <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                <Tag className="w-3 h-3" />
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">No tags</span>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                             <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Excerpt
                                </label>
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                    {blog.excerpt || "No excerpt provided."}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <h3 className="text-sm font-bold text-gray-900">SEO Metadata</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Meta Title</div>
                                <div className="text-sm text-gray-900 font-medium">{blog.meta_title || "-"}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Meta Description</div>
                                <div className="text-sm text-gray-600">{blog.meta_description || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

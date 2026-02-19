"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userBlogService, BlogPost } from "@/services/user-blog-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tag, Clock, Folder, ImageIcon } from "lucide-react";

export default function BlogDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlog(params.id as string);
        }
    }, [params.id]);

    const fetchBlog = async (id: string) => {
        try {
            const data = await userBlogService.getBlogById(id);
            if (data) {
                setBlog(data);
            }
        } catch (error) {
            console.error("Failed to fetch blog details", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading article...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Blog post not found</h2>
                <p className="text-gray-600 mb-4">The article you are looking for does not exist.</p>
                <Link href="/dashboard/blog" className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                    Back to Blog
                </Link>
            </div>
        );
    }

    // Estimate read time (words / 200)
    const wordCount = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href="/dashboard/blog"
                    className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blog Article</h1>
                    <p className="text-sm text-gray-500 mt-1">Published on {new Date(blog.published_at || blog.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Featured Image Banner */}
            {blog.featured_image ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative h-64 md:h-[400px] w-full">
                        <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No featured image</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Card */}
                    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            {blog.categories && blog.categories.length > 0 && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0066ff]/10 text-[#0066ff] border border-[#0066ff]/20">
                                    {blog.categories[0].name}
                                </span>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{readTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{blog.author?.first_name} {blog.author?.last_name}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <div 
                                className="text-lg text-gray-600 italic mb-8 pb-6 border-b border-gray-100 prose prose-sm max-w-none overflow-x-auto break-words"
                                dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                            />
                        )}

                        {/* Content */}
                        <div 
                            className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-[#0066ff] prose-img:rounded-xl overflow-x-auto break-words"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-10 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map(tag => (
                                        <span 
                                            key={tag.id} 
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Article Info</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Author
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                        {blog.author ? (blog.author.first_name[0] + blog.author.last_name[0]) : 'U'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Unknown'}
                                        </div>
                                        <div className="text-xs text-gray-500">Author</div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Published
                                </label>
                                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Reading Time
                                </label>
                                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {readTime} minute{readTime !== 1 ? 's' : ''}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

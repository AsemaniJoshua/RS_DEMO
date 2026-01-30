"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { userBlogService, BlogPost } from "@/services/user-blog-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";

import BackButton from "@/components/ui/BackButton";

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
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900">Blog post not found</h2>
                <button 
                    onClick={() => router.back()}
                    className="mt-4 text-[#0066ff] hover:underline"
                >
                    Go back
                </button>
            </div>
        );
    }

    // Estimate read time (words / 200)
    const wordCount = blog.content ? blog.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <BackButton href="/dashboard/blog" label="Back to Articles" />

            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-[300px] md:h-[400px] w-full bg-gray-100">
                    {blog.featured_image ? (
                        <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-lg">No cover image</span>
                        </div>
                    )}
                </div>

                <div className="p-6 md:p-10">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                        {blog.categories && blog.categories.length > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0066ff]/10 text-[#0066ff]">
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {blog.title}
                    </h1>

                    {/* Content */}
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-[#0066ff] prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map(tag => (
                                    <span 
                                        key={tag.id} 
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
                                    >
                                        <Tag className="w-3 h-3 mr-2" />
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}

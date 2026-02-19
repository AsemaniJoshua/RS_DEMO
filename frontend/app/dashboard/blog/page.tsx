"use client";

import { useState, useEffect } from "react";
import { userBlogService, BlogPost } from "@/services/user-blog-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Search, BookOpen } from "lucide-react";

export default function BlogEventsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const data = await userBlogService.getBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Blog & Articles</h1>
                <p className="text-gray-600">Latest insights, news and articles.</p>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] text-gray-900 bg-white"
                    />
                </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                    <Link
                        key={blog.id}
                        href={`/dashboard/blog/${blog.id}`} 
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full bg-gray-100 shrink-0">
                            {blog.featured_image ? (
                                <Image
                                    src={blog.featured_image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <BookOpen className="w-12 h-12" />
                                </div>
                            )}
                            {blog.categories && blog.categories.length > 0 && (
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#0066ff]">
                                        {blog.categories[0].name}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0066ff] transition-colors">
                                {blog.title}
                            </h3>
                            <div 
                                className="text-gray-600 text-sm mb-4 line-clamp-3 grow"
                                dangerouslySetInnerHTML={{ __html: blog.excerpt?.replace(/<[^>]*>/g, '') || "No excerpt available." }}
                            />
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    <span>{blog.author?.first_name} {blog.author?.last_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                        {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredBlogs.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

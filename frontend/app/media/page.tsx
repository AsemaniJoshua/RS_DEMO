"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { publicService, PublicMedia, PublicBlog } from "@/services/public-service";
import { useAuth } from "@/contexts/auth-context";

// Note: Metadata export not possible in client components
// SEO handled through layout.tsx or consider server component wrapper

export default function MediaPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [activeFilter, setActiveFilter] = useState("All");
    const [mediaItems, setMediaItems] = useState<PublicMedia[]>([]);
    const [featuredBlogs, setFeaturedBlogs] = useState<PublicBlog[]>([]);
    const [loading, setLoading] = useState(true);

    const filters = ["All", "Image", "Video", "Document"];

    // Fetch media on mount and when filter changes
    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const response = await publicService.getAllMedia(activeFilter);
                if (response.status === 'success' && response.data) {
                    setMediaItems(response.data.media || []);
                }
            } catch (error) {
                console.error('Failed to fetch media:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [activeFilter]);

    // Fetch featured blogs for press section
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await publicService.getPublicBlogs();
                if (response.status === 'success' && response.data?.blogs) {
                    setFeaturedBlogs(response.data.blogs.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    // Handle media click - redirect to public detail page
    const handleMediaClick = (mediaId: string) => {
        router.push(`/media/${mediaId}`);
    };

    // Handle blog navigation - redirect to public blog detail page
    const handleBlogNavigation = (blogId: string) => {
        router.push(`/blog/${blogId}`);
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Get first category
    const getFirstCategory = (blog: PublicBlog) => {
        return blog.categories[0]?.name || 'Health';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm font-medium">Media & Appearances</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Video Library{" "}
                            <span className="text-[#0066ff]">& Press</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Watch TV appearances, listen to radio interviews, and explore educational videos on drug safety and health topics.
                        </p>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`h-11 px-6 rounded-full font-medium transition-all duration-200 ${activeFilter === filter
                                        ? "bg-[#0066ff] text-white shadow-lg"
                                        : "border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading State */}
            {loading && (
                <section className="py-20 bg-gray-50">
                    <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading media...</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Media Grid */}
            {!loading && (
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mediaItems.map((item) => (
                            <article 
                                key={item.id} 
                                onClick={() => handleMediaClick(item.id)}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                {/* Thumbnail Area */}
                                <div className="relative h-48 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
                                    {/* Media Preview */}
                                    {item.file_type === 'IMAGE' && (
                                        <Image
                                            src={item.url}
                                            alt={item.original_name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    {item.file_type === 'VIDEO' && (
                                        <>
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
                                                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0066ff] ml-1">
                                                        <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {item.duration && (
                                                <div className="absolute bottom-4 right-4 px-2 py-1 bg-gray-900/80 rounded text-white text-xs font-medium">
                                                    {item.duration}
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {item.file_type === 'DOCUMENT' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Category Icon - Top */}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                        {item.file_type === 'VIDEO' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {item.file_type === 'IMAGE' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                                <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {item.file_type === 'DOCUMENT' && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Category Label */}
                                    <div className="text-xs font-bold text-[#0066ff] uppercase mb-2 tracking-wide">
                                        {item.file_type}
                                    </div>

                                    {/* Description */}
                                    {item.description && (
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{formatDate(item.created_at)}</span>
                                        {item.dimensions && <span>{item.dimensions}</span>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* No results message */}
                    {mediaItems.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">No media items found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
            )}

            {/* Featured Press - Blog Posts */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Featured <span className="text-[#0066ff]">Press</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Read the latest articles and insights from Dr. George on health and wellness.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredBlogs.map((blog) => (
                            <div 
                                key={blog.id} 
                                onClick={() => handleBlogNavigation(blog.id)}
                                className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-[#0066ff] transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-xl flex items-center justify-center text-white mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[#0066ff] mb-2">{getFirstCategory(blog)}</h3>
                                <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                                <p className="text-sm text-gray-500">{formatDate(blog.published_at)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Interested in a Media Collaboration?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Available for interviews, guest appearances, and expert commentary on health and medication topics.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200 cursor-pointer">
                                Contact for Media Inquiries
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                Download Media Kit
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

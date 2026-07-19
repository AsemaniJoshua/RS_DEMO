"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { publicService, PublicBlog } from "@/services/public-service";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [blog, setBlog] = useState<PublicBlog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await publicService.getPublicBlogById(id);
                const blogData = (response.data as any)?.blog || response.data;
                if (blogData) {
                    setBlog(blogData);
                } else {
                    setError("Blog post not found");
                }
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                setError("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getAuthorName = (author: PublicBlog['author']) => {
        if (!author) return 'Dr. George';
        return `${author.first_name || ''} ${author.last_name || ''}`.trim() || 'Dr. George';
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
        if (!blog) return;
        
        const url = window.location.href;
        const cleanExcerpt = blog.excerpt?.replace(/<[^>]*>/g, '') || '';
        const text = `${blog.title} - ${cleanExcerpt}`;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl p-8 sm:p-12 max-w-md shadow-xl border border-gray-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                            <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                            <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist."}</p>
                    <Link href="/blog">
                        <button className="h-12 px-6 rounded-full bg-[#0066ff] text-white hover:bg-[#0052cc] transition-all cursor-pointer font-medium">
                            Back to Blog
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 py-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
                        <Link href="/" className="hover:text-[#0066ff] transition-colors">Home</Link>
                        <span className="text-gray-300">/</span>
                        <Link href="/blog" className="hover:text-[#0066ff] transition-colors">Blog</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{blog.title}</span>
                    </div>
                </div>
            </div>

            {/* Hero / Header Section */}
            <section className="relative overflow-hidden bg-white pt-10 pb-20 border-b border-gray-100">
                {/* Glowing decorative background lights */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#0066ff]/5 to-[#00bfa6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-[#0066ff]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Category Badges */}
                    {blog.categories && blog.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {blog.categories.map((cat) => (
                                <span 
                                    key={cat.id} 
                                    className="px-4 py-1.5 bg-[#E0F2FE] text-[#0066ff] rounded-full text-xs font-bold uppercase tracking-wider shadow-xs"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6 break-words [word-break:break-word]">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <div 
                            className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed font-light border-l-4 border-[#0066ff]/50 pl-4 py-1 break-words [word-break:break-word]"
                            dangerouslySetInnerHTML={{ __html: blog.excerpt }}
                        />
                    )}

                    {/* Meta info & Sharing */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-gray-100">
                        {/* Author Profile */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#0066ff]/10">
                                {blog.author?.first_name?.[0] || 'D'}{blog.author?.last_name?.[0] || 'G'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{getAuthorName(blog.author)}</p>
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        {formatDate(blog.published_at)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {blog.reading_time || '5 min read'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/70 p-1.5 rounded-full border border-gray-100 transition-colors self-start sm:self-auto">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-3 mr-2">Share</span>
                            <button 
                                onClick={() => handleShare('twitter')}
                                className="w-8 h-8 rounded-full bg-white hover:bg-[#1DA1F2] hover:text-white text-gray-600 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer"
                                aria-label="Share on Twitter"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleShare('linkedin')}
                                className="w-8 h-8 rounded-full bg-white hover:bg-[#0A66C2] hover:text-white text-gray-600 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer"
                                aria-label="Share on LinkedIn"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleShare('whatsapp')}
                                className="w-8 h-8 rounded-full bg-white hover:bg-[#25D366] hover:text-white text-gray-600 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer"
                                aria-label="Share on WhatsApp"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image & Article Body */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
                {/* Featured Image */}
                {blog.featured_image && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 mb-12 border-4 border-white bg-gray-100">
                        <Image
                            src={blog.featured_image}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Article Content Container */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-100/20">
                    <div 
                        className="prose prose-lg max-w-none text-gray-800
                            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-[#0066ff] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900 prose-strong:font-bold
                            prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-ul:mb-6
                            prose-li:text-gray-700 prose-li:mb-2 prose-li:marker:text-[#0066ff]
                            prose-blockquote:border-l-4 prose-blockquote:border-[#0066ff] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-gray-600
                            prose-code:text-[#0066ff] prose-code:bg-gray-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
                            overflow-x-auto break-words [word-break:break-word]"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span 
                                        key={tag.id} 
                                        className="px-3.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-100 hover:border-gray-200 transition-all cursor-pointer"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium CTA Section */}
            <section className="relative py-20 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6] text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Want More Health Insights?
                    </h2>
                    <p className="text-lg text-white/95 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                        Explore more evidence-based articles on medications, supplements, and chronic disease management.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/blog">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-[#0066ff] font-semibold hover:bg-gray-50 hover:shadow-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                                View All Articles
                            </button>
                        </Link>
                        <Link href="/booking">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                                Book a Consultation
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

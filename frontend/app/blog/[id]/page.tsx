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
                if (response.data) {
                    setBlog(response.data);
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
        return `${author.first_name} ${author.last_name}`;
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
        if (!blog) return;
        
        const url = window.location.href;
        const text = `${blog.title} - ${blog.excerpt}`;
        
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                            <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                            <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist."}</p>
                    <Link href="/blog">
                        <button className="h-12 px-6 rounded-full bg-[#0066ff] text-white hover:bg-[#0052cc] transition-all">
                            Back to Blog
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <section className="py-6 bg-white border-b border-gray-200">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-[#0066ff]">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-[#0066ff]">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium line-clamp-1">{blog.title}</span>
                    </div>
                </div>
            </section>

            {/* Article Header */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-12">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.categories.map((cat) => (
                            <span key={cat.id} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                {cat.name}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {blog.excerpt}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center text-white font-bold">
                                {blog.author?.first_name?.[0] || 'D'}{blog.author?.last_name?.[0] || 'G'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{getAuthorName(blog.author)}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>{formatDate(blog.published_at)}</span>
                                    <span>•</span>
                                    <span>{blog.reading_time || '5 min read'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-gray-600 mr-2">Share:</span>
                            <button 
                                onClick={() => handleShare('twitter')}
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center"
                                aria-label="Share on Twitter"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleShare('linkedin')}
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center"
                                aria-label="Share on LinkedIn"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => handleShare('whatsapp')}
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#25D366] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center"
                                aria-label="Share on WhatsApp"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blog.featured_image && (
                        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden">
                            <Image
                                src={blog.featured_image}
                                alt={blog.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Article Content */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-12">
                    <div 
                        className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-a:text-[#0066ff] prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900 prose-strong:font-semibold
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-li:text-gray-700 prose-li:marker:text-[#0066ff]
                            prose-blockquote:border-l-4 prose-blockquote:border-[#0066ff] prose-blockquote:pl-4 prose-blockquote:italic
                            prose-code:text-[#0066ff] prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-gray-900 prose-pre:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Want More Health Insights?
                    </h2>
                    <p className="text-white/90 mb-8">
                        Explore more evidence-based articles on medications, supplements, and chronic disease management.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/blog">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200">
                                View All Articles
                            </button>
                        </Link>
                        <Link href="/services">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200">
                                Book a Consultation
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { publicService, PublicMedia } from "@/services/public-service";

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [media, setMedia] = useState<PublicMedia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const response = await publicService.getPublicMediaById(id);
                // Backend may return { status: 'success', data: { media } } or direct data
                const mediaData = (response.data as any)?.media || response.data;
                if (mediaData) {
                    setMedia(mediaData);
                } else {
                    setError("Media not found");
                }
            } catch (err) {
                console.error("Failed to fetch media:", err);
                setError("Failed to load media");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMedia();
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

    const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
        if (!media) return;
        
        const url = window.location.href;
        const cleanDescription = media.description?.replace(/<[^>]*>/g, '') || 'Check out this media';
        const text = `${media.original_name} - ${cleanDescription}`;
        
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
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading media...</p>
                </div>
            </div>
        );
    }

    if (error || !media) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Media Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "The media you're looking for doesn't exist."}</p>
                    <Link href="/media">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors">
                            Back to Media Library
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <section className="py-12 bg-white border-b border-gray-200">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-12">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-[#0066ff]">Home</Link>
                        <span>/</span>
                        <Link href="/media" className="hover:text-[#0066ff]">Media</Link>
                        <span>/</span>
                        <span className="text-gray-900">{media.original_name}</span>
                    </div>

                    {/* Header Content */}
                    <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            {/* Type Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-4">
                                {media.file_type === 'VIDEO' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {media.file_type === 'IMAGE' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                        <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {media.file_type === 'DOCUMENT' && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">{media.file_type}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                {media.original_name}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>{formatDate(media.created_at)}</span>
                                </div>
                                {media.duration && (
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span>{media.duration}</span>
                                    </div>
                                )}
                                {media.dimensions && (
                                    <div className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span>{media.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2">
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
                </div>
            </section>

            {/* Media Content Section */}
            <section className="py-12 bg-white">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-12">
                    {/* Media Display */}
                    <div className="mb-8">
                        {media.file_type === 'IMAGE' && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                                <Image
                                    src={media.url}
                                    alt={media.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}

                        {media.file_type === 'VIDEO' && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900">
                                <video
                                    src={media.url}
                                    controls
                                    className="w-full h-full"
                                    poster={media.url}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}

                        {media.file_type === 'DOCUMENT' && (
                            <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                                <div className="w-20 h-20 rounded-full bg-[#0066ff] flex items-center justify-center mb-6">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{media.original_name}</h3>
                                <p className="text-gray-600 mb-6">{media.mime_type}</p>
                                <a 
                                    href={media.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors font-medium"
                                >
                                    Download Document
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {media.description && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Media</h2>
                            <div 
                                className="prose prose-lg max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: media.description }}
                            />
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">File Name</h3>
                            <p className="text-gray-900">{media.original_name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">File Type</h3>
                            <p className="text-gray-900">{media.mime_type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Upload Date</h3>
                            <p className="text-gray-900">{formatDate(media.created_at)}</p>
                        </div>
                        {media.dimensions && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Dimensions</h3>
                                <p className="text-gray-900">{media.dimensions}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Explore More Media Content
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Browse our complete media library for more videos, images, and educational resources.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/media">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200">
                                Back to Media Library
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

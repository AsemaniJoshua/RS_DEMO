"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDynamicParam } from "@/hooks/useDynamicParam";
import Image from "next/image";
import Link from "next/link";
import { publicService, PublicMedia } from "@/services/public-service";

export default function MediaDetailPublicClient() {
    const id = useDynamicParam("id");
    const router = useRouter();
    const [media, setMedia] = useState<PublicMedia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const response = await publicService.getPublicMediaById(id);
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
                    <p className="text-gray-600 font-medium">Loading media...</p>
                </div>
            </div>
        );
    }

    if (error || !media) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl p-8 sm:p-12 max-w-md shadow-xl border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "The media you're looking for doesn't exist."}</p>
                    <Link href="/media">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors font-semibold cursor-pointer">
                            Back to Media Library
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
                        <Link href="/media" className="hover:text-[#0066ff] transition-colors">Media</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{media.original_name}</span>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <section className="relative overflow-hidden bg-white pt-10 pb-16 border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#0066ff]/5 to-[#00bfa6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            {/* Type Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-4 shadow-xs">
                                {media.file_type === 'VIDEO' && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="23 7 16 12 23 17 23 7" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                    </svg>
                                )}
                                {media.file_type === 'IMAGE' && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                )}
                                {media.file_type === 'DOCUMENT' && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                )}
                                <span className="text-xs font-bold uppercase tracking-wider">{media.file_type}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4 break-words [word-break:break-word]">
                                {media.original_name}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>{formatDate(media.created_at)}</span>
                                </div>
                                {media.duration && (
                                    <div className="flex items-center gap-1.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                                        </svg>
                                        <span>{media.duration}</span>
                                    </div>
                                )}
                                {media.dimensions && (
                                    <div className="flex items-center gap-1.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <line x1="9" y1="3" x2="9" y2="21" />
                                        </svg>
                                        <span>{media.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Share */}
                        <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100/70 p-1.5 rounded-full border border-gray-100 transition-colors self-start md:self-auto">
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

            {/* Media Content Section */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 pb-24">
                {/* Media Display Card */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xl shadow-gray-100/30 mb-10">
                    {media.file_type === 'IMAGE' && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                            <Image
                                src={media.url}
                                alt={media.name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    )}

                    {media.file_type === 'VIDEO' && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-950 shadow-inner">
                            <video
                                src={media.url}
                                controls
                                className="w-full h-full object-contain"
                                poster={media.url}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {media.file_type === 'DOCUMENT' && (
                        <div className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 rounded-full bg-[#E0F2FE] text-[#0066ff] flex items-center justify-center mb-6 shadow-md shadow-[#0066ff]/5">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{media.original_name}</h3>
                            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-semibold">{media.mime_type}</p>
                            <a 
                                href={media.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] hover:shadow-lg hover:shadow-[#0066ff]/20 transition-all duration-300 font-semibold cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Document
                            </a>
                        </div>
                    )}
                </div>

                {/* Description & Details Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left: Description */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Media</h2>
                        {media.description ? (
                            <div 
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed [word-break:break-word] overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: media.description }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">No description provided for this media asset.</p>
                        )}
                    </div>

                    {/* Right: Technical Metadata Info Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/10 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">File Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">File Name</h4>
                                <p className="text-sm font-semibold text-gray-900 break-all">{media.original_name}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">MIME Type</h4>
                                <p className="text-sm font-semibold text-gray-800 break-all">{media.mime_type || 'Unknown'}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Upload Date</h4>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(media.created_at)}</p>
                            </div>
                            {media.dimensions && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dimensions</h4>
                                    <p className="text-sm font-semibold text-gray-800">{media.dimensions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium CTA Section */}
            <section className="relative py-20 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6] text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Explore More Media Content
                    </h2>
                    <p className="text-lg text-white/95 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                        Browse our complete media library for more videos, images, and educational resources.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/media">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-[#0066ff] font-semibold hover:bg-gray-50 hover:shadow-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                                Back to Media Library
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

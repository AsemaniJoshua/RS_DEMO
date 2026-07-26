"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDynamicParam } from "@/hooks/useDynamicParam";
import Image from "next/image";
import Link from "next/link";
import { publicService, PublicSpeaking } from "@/services/public-service";

export default function SpeakingDetailPublicClient() {
    const id = useDynamicParam("id");
    const router = useRouter();
    const [event, setEvent] = useState<PublicSpeaking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await publicService.getSpeakingEventById(id);
                const eventData = (response.data as any)?.event || response.data;
                if (eventData) {
                    setEvent(eventData);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
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

    const getStatusBadge = (status: string) => {
        const isUpcoming = status === 'UPCOMING';
        
        return (
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isUpcoming 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
                {isUpcoming ? 'Upcoming' : 'Past Event'}
            </span>
        );
    };

    const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
        if (!event) return;
        
        const url = window.location.href;
        const text = `${event.title} at ${event.venue} - ${event.location}`;
        
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
                    <p className="text-gray-600 font-medium">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl p-8 sm:p-12 max-w-md shadow-xl border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
                    <Link href="/speaking">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors font-semibold cursor-pointer">
                            Back to Speaking Events
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
                        <Link href="/speaking" className="hover:text-[#0066ff] transition-colors">Speaking</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{event.title}</span>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <section className="relative overflow-hidden bg-white pt-10 pb-16 border-b border-gray-100">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-[#0066ff]/5 to-[#00bfa6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex-1">
                            {/* Category & Status Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {event.category && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] shadow-xs">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                                            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-wider">{event.category}</span>
                                    </div>
                                )}
                                {getStatusBadge(event.status)}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4 break-words [word-break:break-word]">
                                {event.title}
                            </h1>

                            {/* Venue */}
                            <p className="text-xl text-[#0066ff] font-semibold mb-6">{event.venue}</p>

                            {/* Event Details */}
                            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span className="text-gray-800 font-semibold">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-gray-800 font-semibold">{event.location}</span>
                                </div>
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

            {/* Event Content Section */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 pb-24">
                {/* Event Image */}
                {event.image && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 mb-10 border-4 border-white bg-gray-100">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* About & Metadata Grid */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Left Description Column */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                        {event.description ? (
                            <div 
                                className="prose prose-lg max-w-none text-gray-700 leading-relaxed [word-break:break-word] overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">No description provided for this speaking engagement.</p>
                        )}
                    </div>

                    {/* Right Details Info Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/10 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Engagement Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Venue</h4>
                                <p className="text-sm font-semibold text-gray-900 break-words">{event.venue}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                                <p className="text-sm font-semibold text-gray-900 break-words">{event.location}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</h4>
                                <p className="text-sm font-semibold text-gray-800">{formatDate(event.date)}</p>
                            </div>
                            {event.category && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</h4>
                                    <p className="text-sm font-semibold text-gray-800">{event.category}</p>
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                                <div className="mt-1 inline-block">{getStatusBadge(event.status)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium CTA Section */}
            <section className="relative py-20 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6] text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 tracking-tight">
                        {event.status === 'UPCOMING' 
                            ? 'Interested in Attending?' 
                            : 'Book Your Own Speaking Engagement'}
                    </h2>
                    <p className="text-lg text-white/95 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        {event.status === 'UPCOMING'
                            ? 'Contact us for more information about this event or to book Dr. George for your next engagement.'
                            : 'Learn how Dr. George can bring expertise and insight to your next event.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-[#0066ff] font-semibold hover:bg-gray-50 hover:shadow-xl shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                                Book a Speaking Engagement
                            </button>
                        </Link>
                        <Link href="/speaking">
                            <button className="w-full sm:w-auto h-12 px-8 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                                View All Events
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

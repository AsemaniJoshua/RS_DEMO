"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { publicService, PublicSpeaking } from "@/services/public-service";

export default function SpeakingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<PublicSpeaking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await publicService.getSpeakingEventById(id);
                // Backend may return { status: 'success', data: { event } } or direct data
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
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
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
                    <Link href="/speaking">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors">
                            Back to Speaking Events
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
                        <Link href="/speaking" className="hover:text-[#0066ff]">Speaking</Link>
                        <span>/</span>
                        <span className="text-gray-900">{event.title}</span>
                    </div>

                    {/* Header Content */}
                    <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            {/* Category & Status */}
                            <div className="flex items-center gap-3 mb-4">
                                {event.category && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <span className="text-sm font-medium">{event.category}</span>
                                    </div>
                                )}
                                {getStatusBadge(event.status)}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                {event.title}
                            </h1>

                            {/* Venue */}
                            <p className="text-xl text-[#0066ff] font-semibold mb-6">{event.venue}</p>

                            {/* Event Details */}
                            <div className="flex flex-wrap items-center gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <span className="font-medium">{formatDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <span className="font-medium">{event.location}</span>
                                </div>
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

                    {/* Event Image */}
                    {event.image && (
                        <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden">
                            <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Event Description */}
            <section className="py-12 bg-white overflow-hidden">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-12">
                    {event.description && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
                            <div 
                                className="prose prose-lg max-w-none text-gray-900 overflow-x-auto break-words"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </div>
                    )}

                    {/* Event Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6 p-8 bg-gray-50 rounded-2xl">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Venue</h3>
                            <p className="text-lg text-gray-900 font-medium">{event.venue}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Location</h3>
                            <p className="text-lg text-gray-900 font-medium">{event.location}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Date</h3>
                            <p className="text-lg text-gray-900 font-medium">{formatDate(event.date)}</p>
                        </div>
                        {event.category && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Category</h3>
                                <p className="text-lg text-gray-900 font-medium">{event.category}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Status</h3>
                            <div className="inline-block">{getStatusBadge(event.status)}</div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Added</h3>
                            <p className="text-lg text-gray-900 font-medium">{formatDate(event.created_at)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        {event.status === 'UPCOMING' 
                            ? 'Interested in Attending?' 
                            : 'Book Your Own Speaking Engagement'}
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        {event.status === 'UPCOMING'
                            ? 'Contact us for more information about this event or to book Dr. George for your next engagement.'
                            : 'Learn how Dr. George can bring expertise and insight to your next event.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200">
                                Book a Speaking Engagement
                            </button>
                        </Link>
                        <Link href="/speaking">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200">
                                View All Events
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicService, PublicMedia } from "@/services/public-service";

// Icons
const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
);

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DocumentIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface ContentCard {
    icon: React.ReactNode;
    category: string;
    title: string;
    description: string;
    link: string;
}

export default function FeaturedContent() {
    const [contentCards, setContentCards] = useState<ContentCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await publicService.getFeaturedMedia();
                if (response.data && response.data.media && response.data.media.length > 0) {
                    const mappedMedia = response.data.media.slice(0, 3).map((item) => ({
                        icon: getIconForType(item.file_type),
                        category: item.file_type,
                        title: item.name,
                        description: "Click to view this resource on our products page.", 
                        link: "/products"
                    }));
                    setContentCards(mappedMedia);
                } else {
                    setContentCards([]);
                }
            } catch (error) {
                console.error("Failed to fetch featured content", error);
                setContentCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getIconForType = (type: string) => {
        switch (type) {
            case 'VIDEO': return <PlayIcon />;
            case 'DOCUMENT': return <DocumentIcon />;
            case 'IMAGE': return <BookIcon />; // Or specific image icon
            default: return <BookIcon />;
        }
    };

    if (loading) return <div className="py-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div></div>;

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            Featured Content
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                            Explore our latest videos, eBooks, and resources designed to empower your health decisions.
                        </p>
                    </div>
                </div>

                {/* Content */}
                {contentCards.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contentCards.map((card, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-gray-100"
                            >
                                {/* Card Header with Icon */}
                                <div className="h-32 bg-linear-to-br from-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0066ff] group-hover:scale-110 transition-transform duration-300">
                                        {card.icon}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Category Badge */}
                                    <span className="text-xs font-bold text-[#0066ff] tracking-wider mb-3 block">
                                        {card.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                                        {card.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                                        {card.description}
                                    </p>

                                    {/* Learn More Link */}
                                    <Link
                                        href={card.link}
                                        className="inline-flex items-center gap-2 text-[#0066ff] font-medium hover:gap-3 transition-all duration-200"
                                    >
                                        Learn More
                                        <ArrowRightIcon />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <BookIcon />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Content Yet</h3>
                        <p className="text-gray-600 max-w-sm mx-auto mb-6">
                            We are currently updating our library. Check back soon for new videos, ebooks, and resources.
                        </p>
                        <Link
                            href="/products"
                             className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
                        >
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

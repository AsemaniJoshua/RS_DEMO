"use client";

import { useState } from "react";

export default function MediaPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "TV", "Radio", "Press", "Explainers"];

    const mediaItems = [
        {
            category: "TV",
            title: "Medication Safety Tips on Good Morning Health",
            description: "Dr. George shares essential medication safety tips for seniors on this morning show segment.",
            date: "Dec 12, 2024",
            duration: "8:45",
            thumbnail: "/media-tv-1.jpg",
            platform: "ABC Health Network"
        },
        {
            category: "Radio",
            title: "The Dangers of Drug Interactions - Health Radio",
            description: "In-depth discussion about common drug interactions and how to prevent them.",
            date: "Dec 8, 2024",
            duration: "25:30",
            thumbnail: "/media-radio-1.jpg",
            platform: "HealthTalk FM"
        },
        {
            category: "Explainers",
            title: "Understanding Your Prescription Labels",
            description: "A detailed breakdown of what everything on your medication bottle means.",
            date: "Dec 5, 2024",
            duration: "6:20",
            thumbnail: "/media-explainer-1.jpg",
            platform: "YouTube"
        },
        {
            category: "TV",
            title: "Diabetes Management: Beyond Medication",
            description: "Live interview discussing holistic approaches to diabetes management.",
            date: "Nov 30, 2024",
            duration: "12:15",
            thumbnail: "/media-tv-2.jpg",
            platform: "Health Channel"
        },
        {
            category: "Press",
            title: "Local Pharmacist Fights Teen Drug Abuse",
            description: "Featured article in City Health Magazine about community education programs.",
            date: "Nov 28, 2024",
            duration: "Article",
            thumbnail: "/media-press-1.jpg",
            platform: "City Health Magazine"
        },
        {
            category: "Explainers",
            title: "How to Choose Quality Supplements",
            description: "Evidence-based guide to selecting safe and effective dietary supplements.",
            date: "Nov 25, 2024",
            duration: "9:40",
            thumbnail: "/media-explainer-2.jpg",
            platform: "YouTube"
        }
    ];

    const filteredMedia = activeFilter === "All"
        ? mediaItems
        : mediaItems.filter(item => item.category === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
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

            {/* Media Grid */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredMedia.map((item, index) => (
                            <article key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                                {/* Thumbnail Area */}
                                <div className="relative h-48 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
                                    {/* Category Icon - Top */}
                                    <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                        {item.category === "TV" && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
                                                <polyline points="17 2 12 7 7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {item.category === "Radio" && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        )}
                                        {item.category === "Press" && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {item.category === "Explainers" && (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                                                <rect x="8" y="2" width="8" height="20" fill="currentColor" opacity="0.2" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Large Play Button - Center */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {item.category === "Press" ? (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            ) : (
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0066ff] ml-1">
                                                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Duration Badge - Bottom Right */}
                                    {item.category !== "Press" && (
                                        <div className="absolute bottom-4 right-4 px-2 py-1 bg-gray-900/80 rounded text-white text-xs font-medium">
                                            {item.duration}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Category Label */}
                                    <div className="text-xs font-bold text-[#0066ff] uppercase mb-2 tracking-wide">
                                        {item.category}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
                                        {item.title}
                                    </h3>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{item.platform}</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* No results message */}
                    {filteredMedia.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">No media items found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Press Mentions */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Featured <span className="text-[#0066ff]">Press</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Dr. George has been featured in leading health publications and media outlets.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                publication: "Health Today Magazine",
                                title: "10 Pharmacists Leading the Future of Healthcare",
                                date: "December 2024"
                            },
                            {
                                publication: "Medical News Daily",
                                title: "Expert Insights on Medication Management",
                                date: "November 2024"
                            },
                            {
                                publication: "Wellness Journal",
                                title: "The Role of Pharmacists in Chronic Disease Care",
                                date: "October 2024"
                            }
                        ].map((press, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-[#0066ff] transition-all duration-300">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-xl flex items-center justify-center text-white mb-4">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-[#0066ff] mb-2">{press.publication}</h3>
                                <h4 className="text-lg font-bold text-gray-900 mb-2">{press.title}</h4>
                                <p className="text-sm text-gray-500">{press.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Interested in a Media Collaboration?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Available for interviews, guest appearances, and expert commentary on health and medication topics.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200">
                            Contact for Media Inquiries
                        </button>
                        <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200">
                            Download Media Kit
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

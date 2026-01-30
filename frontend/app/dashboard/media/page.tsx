"use client";

import Link from "next/link";

// Mock Data
const MEDIA_ITEMS = [
    {
        id: "1",
        title: "Understanding Gut Health",
        type: "Video",
        duration: "15:30",
        date: "Sep 10, 2025",
        thumbnail: "/media-1.jpg"
    },
    {
        id: "2",
        title: "Daily Meditation Guide",
        type: "Audio",
        duration: "20:00",
        date: "Sep 05, 2025",
        thumbnail: "/media-2.jpg"
    },
    {
        id: "3",
        title: "Immunity Boosting Smoothie Recipes",
        type: "Document",
        duration: "5 pages",
        date: "Aug 28, 2025",
        thumbnail: "/media-3.jpg"
    }
];

export default function MediaLibraryPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
                <p className="text-gray-600">Exclusive videos, audio guides, and resources</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MEDIA_ITEMS.map((item) => (
                    <Link key={item.id} href={`/dashboard/media/${item.id}`} className="group">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video bg-gray-100 relative group-hover:opacity-90 transition-opacity">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    {item.type === 'Video' && (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                                        </svg>
                                    )}
                                    {item.type === 'Audio' && (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                           <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                           <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                           <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                    {item.type === 'Document' && (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                                            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    {item.duration}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                        item.type === 'Video' ? 'bg-red-100 text-red-600' :
                                        item.type === 'Audio' ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#0066ff] transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

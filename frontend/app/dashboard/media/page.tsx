"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mediaService, MediaItem, MediaStats } from "@/services/media-service";
import toast from "react-hot-toast";

export default function MediaLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<MediaStats>({
        totalFiles: 0,
        images: 0,
        videos: 0,
        documents: 0
    });

    useEffect(() => {
        fetchMedia();
    }, [typeFilter]); // Reload when filter changes

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedia();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchMedia = async () => {
        try {
            setIsLoading(true);
            const data = await mediaService.getAllMedia(1, 100, typeFilter, searchQuery);
            setMediaItems(data.media);
            setStats(data.stats);
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to load media library");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
                    <p className="text-gray-600">Access exclusive videos, documents, and resources.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-blue-600 text-sm font-semibold mb-1">Total Files</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalFiles}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-purple-600 text-sm font-semibold mb-1">Videos</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.videos}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="text-green-600 text-sm font-semibold mb-1">Documents</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.documents}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="text-orange-600 text-sm font-semibold mb-1">Images</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.images}</div>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                 <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0066ff] text-gray-900 bg-white"
                    />
                </div>
                <div className="flex gap-2 overflows-x-auto">
                    {['all', 'VIDEO', 'DOCUMENT', 'IMAGE'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                                typeFilter === type
                                    ? "bg-[#0066ff] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {type === 'all' ? 'All Files' : type.toLowerCase() + 's'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : mediaItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No media found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mediaItems.map((item) => (
                        <Link href={`/dashboard/media/${item.id}`} key={item.id} className="group block h-full">
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                <div className="aspect-video bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                                    {item.file_type === 'IMAGE' ? (
                                        <img 
                                            src={item.url} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">
                                            {item.file_type === 'VIDEO' ? (
                                                 <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-white opacity-80">
                                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                                </svg>
                                            ) : (
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                    {/* Type Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold backdrop-blur-md ${
                                            item.file_type === 'VIDEO' ? 'bg-black/50 text-white' :
                                            item.file_type === 'DOCUMENT' ? 'bg-blue-500/80 text-white' :
                                            'bg-gray-900/50 text-white'
                                        }`}>
                                            {item.file_type}
                                        </span>
                                    </div>
                                     {item.duration && (
                                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            {item.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#0066ff] transition-colors">
                                        {item.original_name || item.name}
                                    </h3>
                                    {item.description && (
                                        <div 
                                            className="text-sm text-gray-600 line-clamp-2 mt-1"
                                            dangerouslySetInnerHTML={{ __html: item.description.replace(/<[^>]*>/g, '') }}
                                        />
                                    )}
                                    
                                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        <span>{mediaService.formatFileSize(item.size)}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mediaService, MediaItem } from "@/services/media-service";
import toast from "react-hot-toast";

import BackButton from "@/components/ui/BackButton";

export default function MediaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMediaDetails = async () => {
            try {
                const data = await mediaService.getMediaById(params.id as string);
                setItem(data);
            } catch (error: any) {
                console.error(error);
                toast.error("Failed to load media details");
                router.push("/dashboard/media"); // Redirect on error
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchMediaDetails();
        }
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <BackButton label="Back to Library" />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                 {/* Media Preview / Player */}
                <div className="w-full bg-gray-900 relative">
                    {/* Banner: Always show the event file as banner */}
                    {item.file_type === 'IMAGE' ? (
                        <div className="bg-checkered min-h-[300px] flex items-center justify-center p-4">
                            <img src={item.url} alt={item.description || item.name} className="w-full max-h-[70vh] object-cover rounded" />
                        </div>
                    ) : item.file_type === 'VIDEO' ? (
                        <div className="aspect-video flex items-center justify-center bg-black">
                            <video 
                                src={item.url} 
                                controls 
                                className="w-full h-full max-h-[60vh]" 
                                poster={item.url.replace(/\.[^/.]+$/, ".jpg")} // Try to get thumb from cloudinary by changing ext
                            />
                        </div>
                    ) : (
                        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-white">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-80">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <p className="text-lg font-medium opacity-90">{item.description || item.original_name}</p>
                            <p className="text-sm opacity-60 mt-1">Preview not available for documents</p>
                        </div>
                    )}
                </div>

                <div className="p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                item.file_type === 'VIDEO' ? 'bg-red-50 text-red-600' :
                                item.file_type === 'DOCUMENT' ? 'bg-blue-50 text-blue-600' :
                                'bg-purple-50 text-purple-600'
                            }`}>
                                {item.file_type}
                            </span>
                            {item.duration && <span className="text-xs text-gray-500">• {item.duration}</span>}
                            <span className="text-xs text-gray-500">• {mediaService.formatFileSize(item.size)}</span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.description || item.name}</h1>
                        
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Uploaded Date</span>
                                {new Date(item.created_at).toLocaleDateString()}
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">File Type</span>
                                {item.mime_type}
                            </div>
                             {item.dimensions && (
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Dimensions</span>
                                    {item.dimensions}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col justify-start">
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(item.url);
                                    const blob = await response.blob();
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = item.description || item.name || 'media-file';
                                    document.body.appendChild(a);
                                    a.click();
                                    a.remove();
                                    window.URL.revokeObjectURL(url);
                                } catch (err) {
                                    toast.error('Failed to download file');
                                }
                            }}
                            className="bg-[#0066ff] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#0052cc] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mb-4"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Download File
                        </button>
                        <p className="text-xs text-gray-400 text-center">
                            Secure download provided by RxWithDrGeorge
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

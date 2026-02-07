"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mediaService, MediaItem } from "@/services/media-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Download, 
    Calendar, 
    File, 
    HardDrive, 
    Image as ImageIcon, 
    Video, 
    FileText,
    Clock
} from "lucide-react";

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
                router.push("/dashboard/media");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchMediaDetails();
        }
    }, [params.id, router]);

    const handleDownload = async () => {
        if (!item) return;
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
            toast.success('Download started');
        } catch (err) {
            toast.error('Failed to download file');
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading media...</p>
                </div>
            </div>
        );
    }

    if (!item) return null;

    const getFileTypeIcon = (type: string) => {
        switch (type) {
            case 'IMAGE': return <ImageIcon className="w-5 h-5" />;
            case 'VIDEO': return <Video className="w-5 h-5" />;
            case 'DOCUMENT': return <FileText className="w-5 h-5" />;
            default: return <File className="w-5 h-5" />;
        }
    };

    const getFileTypeColor = (type: string) => {
        switch (type) {
            case 'IMAGE': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'VIDEO': return 'bg-red-50 text-red-700 border-red-100';
            case 'DOCUMENT': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/media"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Media Preview Banner */}
            {item.file_type === 'IMAGE' ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative h-64 md:h-[400px] w-full bg-gray-50">
                        <img 
                            src={item.url} 
                            alt={item.description || item.name} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            ) : item.file_type === 'VIDEO' ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative aspect-video w-full bg-black">
                        <video 
                            src={item.url} 
                            controls 
                            className="w-full h-full" 
                            poster={item.url.replace(/\.[^/.]+$/, ".jpg")}
                        />
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400">
                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Document Preview Not Available</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Type */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {item.description || item.name}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {item.original_name || item.name}
                                </p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${getFileTypeColor(item.file_type)}`}>
                                {getFileTypeIcon(item.file_type)}
                                {item.file_type}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Upload Date</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {new Date(item.created_at).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <HardDrive className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">File Size</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {mediaService.formatFileSize(item.size)}
                                    </div>
                                </div>
                            </div>

                            {item.duration && (
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-3 bg-white rounded-lg shadow-sm text-green-600">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium mb-1">Duration</div>
                                        <div className="font-bold text-gray-900 text-lg">
                                            {item.duration}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {item.dimensions && (
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 font-medium mb-1">Dimensions</div>
                                        <div className="font-bold text-gray-900 text-lg">
                                            {item.dimensions}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Download Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Download File</h3>
                        <p className="text-gray-600 mb-6">
                            Download this file to your device for offline access.
                        </p>
                        <button
                            onClick={handleDownload}
                            className="w-full bg-[#00d4aa] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            <Download className="w-5 h-5" />
                            Download File
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">File Details</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    File Name
                                </label>
                                <div className="flex items-center gap-2">
                                    <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="font-medium text-gray-900 text-sm break-all">
                                        {item.original_name || item.name}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    MIME Type
                                </label>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900 text-sm">
                                        {item.mime_type}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    File Type
                                </label>
                                <div className="flex items-center gap-2">
                                    {getFileTypeIcon(item.file_type)}
                                    <span className="font-medium text-gray-900">
                                        {item.file_type}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Uploaded
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {new Date(item.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

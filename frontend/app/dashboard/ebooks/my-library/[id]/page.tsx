"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ebookService, Ebook } from "@/services/ebook-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Download, 
    BookOpen, 
    Calendar, 
    FileText, 
    Globe, 
    Tag,
    User,
    CheckCircle,
    AlertCircle
} from "lucide-react";

export default function MyLibraryEbookDetailsPage() {
    const { id } = useParams();
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchasedEbook();
    }, []);

    const fetchPurchasedEbook = async () => {
        try {
            setLoading(true);
            // Fetch from /user/ebooks/my-library and filter by id
            const response = await ebookService.getMyLibrary();
            const found = response.data?.ebooks?.find((b: Ebook) => b.id === id);
            if (!found) {
                toast.error("Ebook not found in your library.");
            }
            setEbook(found || null);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch ebook details");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!ebook?.fileUrl) {
            toast.error('Download unavailable');
            return;
        }
        try {
            window.open(ebook.fileUrl, '_blank');
            toast.success('Download started');
        } catch (err) {
            toast.error('Failed to download ebook');
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading ebook...</p>
                </div>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Ebook Not Found</h2>
                    <p className="text-gray-500 mb-6">This ebook is not in your library.</p>
                    <Link href="/dashboard/ebooks/my-library">
                        <button className="px-6 py-2.5 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium">
                            Back to My Library
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/ebooks/my-library"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Cover Image Banner */}
            <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative h-64 md:h-[400px] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {ebook.coverImage ? (
                        <img 
                            src={ebook.coverImage} 
                            alt={ebook.title} 
                            className="h-full w-auto object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <BookOpen className="w-20 h-20 mb-3 opacity-50" />
                            <span className="text-sm font-medium">No cover image available</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                {ebook.category?.name || 'Education'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-100 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                In Your Library
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{ebook.title}</h1>
                        <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-5 h-5" />
                            <span className="text-lg font-medium">by {ebook.author}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Published</div>
                                    <div className="font-bold text-gray-900">
                                        {ebook.created_at ? new Date(ebook.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Pages</div>
                                    <div className="font-bold text-gray-900">{ebook.pages || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Format</div>
                                    <div className="font-bold text-gray-900">{ebook.format || 'PDF'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#00d4aa]" />
                            About This Book
                        </h3>
                        <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {ebook.description || 'No description available.'}
                        </div>
                    </div>

                    {/* Status Warning */}
                    {ebook.status !== "PUBLISHED" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-yellow-900 mb-2">Status Notice</h3>
                                <p className="text-yellow-800">This ebook is no longer available for public sale, but you can still access it in your library.</p>
                            </div>
                        </div>
                    )}

                    {/* Download Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Download Your Ebook</h3>
                        <p className="text-gray-600 mb-6">
                            You own this ebook. Click below to download it to your device for offline reading.
                        </p>
                        {ebook.fileUrl ? (
                            <button
                                onClick={handleDownload}
                                className="w-full bg-[#00d4aa] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                            >
                                <Download className="w-5 h-5" />
                                Download Ebook
                            </button>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <span className="text-red-800 font-medium">Download currently unavailable</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Book Details</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Category
                                </label>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{ebook.category?.name || 'Education'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Author
                                </label>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-500" />
                                    <span className="font-medium text-gray-900">{ebook.author}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Format
                                </label>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-900">{ebook.format || 'PDF'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Language
                                </label>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-green-500" />
                                    <span className="font-medium text-gray-900">English</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Published
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {ebook.created_at ? new Date(ebook.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>
                            
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                                    <CheckCircle className="w-5 h-5" />
                                    Owned
                                </div>
                                <p className="text-sm text-green-600">This ebook is in your library</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

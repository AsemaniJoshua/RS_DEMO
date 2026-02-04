"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ebookService, Ebook } from "@/services/ebook-service";
import toast from "react-hot-toast";

export default function EbookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchEbook(params.id as string);
        }
    }, [params.id]);

    const fetchEbook = async (id: string) => {
        try {
            setIsLoading(true);
            const response = await ebookService.getAdminEbookById(id);
            // Fix: response.data.ebook, not response.ebook
            setEbook((response as any).data?.ebook || (response as any).ebook);
        } catch (error: any) {
            toast.error(error.message || "Failed to load ebook details");
            router.push("/admin/ebooks");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!ebook || !confirm("Are you sure you want to delete this ebook?")) return;

        setIsDeleting(true);
        try {
            await ebookService.deleteEbook(ebook.id);
            toast.success("Ebook deleted successfully");
            router.push("/admin/ebooks");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete ebook");
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading ebook details...</p>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">Ebook Not Found</h2>
                <Link href="/admin/ebooks" className="text-[#00d4aa] hover:underline mt-4 block">
                    Back to Ebooks
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/ebooks" className="flex items-center text-gray-600 hover:text-[#00d4aa] transition-colors mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Ebooks
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{ebook.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                ebook.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                            }`}>
                                {ebook.status === "PUBLISHED" ? "Published" : "Draft"}
                            </span>
                        </div>
                        <p className="text-lg text-gray-600">by {ebook.author}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={`/admin/ebooks/${ebook.id}/edit`}>
                            <button className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Cover Image Banner */}
            <div className="mb-8 bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-hidden">
                <div className="md:h-96 rounded-lg overflow-hidden bg-gray-100 relative">
                     {ebook.coverImage ? (
                        <img 
                            src={ebook.coverImage} 
                            alt={ebook.title}
                            className="w-full h-full object-cover"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <div className="flex flex-col items-center gap-2">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-sm font-medium">No cover image</span>
                             </div>
                        </div>
                     )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                        <div className="prose max-w-none text-gray-600">
                            {ebook.description ? (
                                <p className="whitespace-pre-wrap">{ebook.description}</p>
                            ) : (
                                <p className="italic text-gray-400">No description provided.</p>
                            )}
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Book Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Category</label>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    {ebook.category?.name || "Uncategorized"}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Price</label>
                                <div className="font-medium text-gray-900">
                                    {ebook.price === 0 ? "Free" : `GHS ${ebook.price}`}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Format</label>
                                <div className="font-medium text-gray-900">{ebook.format}</div>
                            </div>
                             <div>
                                <label className="text-sm text-gray-500 block mb-1">Pages</label>
                                <div className="font-medium text-gray-900">{ebook.pages || "-"}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Downloads</label>
                                <div className="font-medium text-gray-900">{ebook.downloads}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Rating</label>
                                <div className="font-medium text-gray-900 flex items-center gap-1">
                                    <span>{ebook.rating || 0}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* File Info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">File Information</h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {ebook.title}.{ebook.format?.toLowerCase() || 'pdf'}
                                </p>
                            </div>
                        </div>
                        <a 
                            href={(() => {
                                if (ebook.fileUrl && ebook.fileUrl.includes('res.cloudinary.com')) {
                                    // For raw files, use only fl_attachment (no filename)
                                    return ebook.fileUrl.replace(
                                        /\/upload(?!\/fl_attachment)/,
                                        '/upload/fl_attachment'
                                    );
                                }
                                return ebook.fileUrl;
                            })()}
                            download
                            className="block w-full py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            Download File
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

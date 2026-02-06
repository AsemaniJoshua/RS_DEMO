"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ebookService, Ebook } from "@/services/ebook-service";
import toast from "react-hot-toast";

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

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="p-8 text-center text-gray-500">Ebook not found in your library.</div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    {ebook.coverImage ? (
                        <img src={ebook.coverImage} alt={ebook.title} className="rounded-xl w-48 h-64 object-cover" />
                    ) : (
                        <div className="w-48 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{ebook.title}</h1>
                    <p className="text-gray-700 mb-2">By {ebook.author}</p>
                    <span className="text-sm font-medium text-[#0066ff] bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                        {ebook.category?.name || "Education"}
                    </span>
                    <div className="mt-4 mb-4">
                        <p className="text-gray-600">{ebook.description}</p>
                    </div>
                    {ebook.status !== "PUBLISHED" && (
                        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded mb-4">
                            This ebook is no longer available for public sale.
                        </div>
                    )}
                    <div className="mt-6">
                        {ebook.fileUrl ? (
                            <a
                                href={ebook.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-[#0066ff] text-white px-4 py-2 rounded font-semibold hover:bg-[#0052cc] transition-colors"
                            >
                                Download Ebook
                            </a>
                        ) : (
                            <span className="text-gray-400">Download unavailable.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

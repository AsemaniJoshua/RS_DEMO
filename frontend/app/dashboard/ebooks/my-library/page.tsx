"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ebookService, type Ebook } from "@/services/ebook-service";
import toast from "react-hot-toast";

export default function MyLibraryPage() {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyEbooks();
    }, []);

    const fetchMyEbooks = async () => {
        try {
            setLoading(true);
            const response = await ebookService.getMyLibrary();
            setEbooks(response.data?.ebooks || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch your ebooks');
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

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Library</h1>
                <Link href="/dashboard/ebooks">
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm">
                        All Ebooks
                    </button>
                </Link>
            </div>

            {ebooks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Purchased Ebooks</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        You have not purchased any ebooks yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ebooks.map((book) => (
                        book.status === "PUBLISHED" ? (
                            <Link key={book.id} href={`/dashboard/ebooks/my-library/${book.id}`} className="group">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ height: 180, width: '100%' }}>
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={book.title}
                                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', margin: 'auto', display: 'block' }}
                                            />
                                        ) : (
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#0066ff] transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-[#0066ff] bg-blue-50 px-2 py-1 rounded">
                                                {book.category?.name || 'Education'}
                                            </span>
                                            <span className="font-bold text-gray-900">
                                                {book.price > 0 ? `GHS ${book.price}` : 'Free'}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <a
                                                href={book.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-[#0066ff] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-[#0052cc] transition-colors"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div key={book.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ height: 180, width: '100%' }}>
                                    {book.coverImage ? (
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover', margin: 'auto', display: 'block' }}
                                        />
                                    ) : (
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-[#0066ff] bg-blue-50 px-2 py-1 rounded">
                                            {book.category?.name || 'Education'}
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {book.price > 0 ? `GHS ${book.price}` : 'Free'}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <a
                                            href={book.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-[#0066ff] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-[#0052cc] transition-colors"
                                        >
                                            Download
                                        </a>
                                    </div>
                                    <div className="mt-2">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                            This ebook is no longer available for public sale.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

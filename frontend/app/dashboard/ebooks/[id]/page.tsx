"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DeleteModal from "@/components/dashboard/DeleteModal";

// Mock Data (In a real app, fetch from API)
const EBOOKS = [
    {
        id: "1",
        title: "Mastering React",
        author: "Dr. George",
        coverImage: "/placeholder-book.jpg",
        price: 29.99,
        category: "Development",
        description: "A comprehensive guide to React development. Learn hooks, context, and advanced patterns.",
        publishDate: "2024-05-20",
        pages: 350,
        language: "English"
    },
    // ... other books (matches list page)
];

import BackButton from "@/components/ui/BackButton";

export default function EbookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Mock fetch
    const ebook = EBOOKS.find(b => b.id === params.id) || EBOOKS[0]; // Fallback to first for demo

    const handleDelete = () => {
        // Implement delete logic here (API call)
        console.log("Deleting ebook:", ebook.id);
        setIsDeleteModalOpen(false);
        router.push("/dashboard/ebooks");
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <BackButton href="/dashboard/ebooks" label="Back to Ebooks" />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Cover Image Section */}
                    <div className="w-full md:w-1/3 bg-gray-100 min-h-[400px] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 p-8">
                        <div className="w-48 h-64 bg-white shadow-xl flex items-center justify-center text-gray-400">
                             <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm font-semibold text-[#0066ff] uppercase tracking-wide mb-2">
                                    {ebook.category}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ebook.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">by {ebook.author}</p>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">${ebook.price}</div>
                        </div>

                        <div className="prose max-w-none text-gray-600 mb-8">
                            <p>{ebook.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Published</div>
                                <div className="font-semibold text-gray-900">{ebook.publishDate}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Pages</div>
                                <div className="font-semibold text-gray-900">{ebook.pages}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Language</div>
                                <div className="font-semibold text-gray-900">{ebook.language}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Format</div>
                                <div className="font-semibold text-gray-900">PDF, ePub</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-[#0066ff] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Download
                            </button>
                            <button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="px-6 py-3 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Remove Ebook"
                message="Are you sure you want to remove this ebook from your library? You may need to purchase it again to access it."
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

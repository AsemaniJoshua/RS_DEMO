"use client";

import Link from "next/link";

// Mock Data
const EBOOKS = [
    {
        id: "1",
        title: "Mastering React",
        author: "Dr. George",
        coverImage: "/placeholder-book.jpg",
        price: 29.99,
        category: "Development",
        description: "A comprehensive guide to React development."
    },
    {
        id: "2",
        title: "Advanced Node.js",
        author: "Dr. George",
        coverImage: "/placeholder-book-2.jpg",
        price: 34.99,
        category: "Backend",
        description: "Deep dive into Node.js architecture."
    },
    {
        id: "3",
        title: "Digital Health Revolution",
        author: "Dr. George",
        coverImage: "/placeholder-book-3.jpg",
        price: 19.99,
        category: "Health",
        description: "How technology is transforming healthcare."
    }
];

export default function EbooksPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Ebooks</h1>
                <p className="text-gray-600">Access your purchased ebooks and discover new ones</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {EBOOKS.map((book) => (
                    <Link key={book.id} href={`/dashboard/ebooks/${book.id}`} className="group">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-[3/4] bg-gray-100 relative">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#0066ff] transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#0066ff] bg-blue-50 px-2 py-1 rounded">
                                        {book.category}
                                    </span>
                                    <span className="font-bold text-gray-900">${book.price}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

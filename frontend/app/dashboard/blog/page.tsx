"use client";

import Link from "next/link";

// Mock Data
const BLOG_POSTS = [
    {
        id: "1",
        title: "The Future of Telemedicine",
        excerpt: "Exploring how remote consultations are reshaping user care.",
        category: "Healthcare",
        date: "Oct 15, 2025",
        readTime: "5 min read",
        image: "/blog-1.jpg"
    },
    {
        id: "2",
        title: "Mental Health in the Digital Age",
        excerpt: "Strategies for improved well-being in a connected world.",
        category: "Wellness",
        date: "Oct 12, 2025",
        readTime: "8 min read",
        image: "/blog-2.jpg"
    },
    {
        id: "3",
        title: "Nutrition Myths Debunked",
        excerpt: "Separating fact from fiction in modern nutritional science.",
        category: "Nutrition",
        date: "Oct 10, 2025",
        readTime: "6 min read",
        image: "/blog-3.jpg"
    }
];

export default function BlogPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Blog</h1>
                <p className="text-gray-600">Latest insights, health tips, and news</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BLOG_POSTS.map((post) => (
                    <Link key={post.id} href={`/dashboard/blog/${post.id}`} className="group">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                            <div className="aspect-video bg-gray-100 relative">
                                {/* Placeholder for Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                        <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3 text-xs font-medium uppercase tracking-wider text-[#0066ff]">
                                    {post.category}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066ff] transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DeleteModal from "@/components/dashboard/DeleteModal";

// Mock Data
const BLOG_POSTS = [
    {
        id: "1",
        title: "The Future of Telemedicine",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
        category: "Healthcare",
        date: "Oct 15, 2025",
        author: "Dr. George",
        readTime: "5 min read",
        image: "/blog-1.jpg"
    },
    // ...
];

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Mock fetch
    const post = BLOG_POSTS.find(p => p.id === params.id) || BLOG_POSTS[0];

    const handleDelete = () => {
        console.log("Deleting blog post:", post.id);
        setIsDeleteModalOpen(false);
        router.push("/dashboard/blog");
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <Link href="/dashboard/blog" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Back to Blog
                </Link>
                
                {/* Admin/User Controls - Assuming User can delete their "saved" or "draft" post? Or strictly assuming user dashboard behavior requested */}
                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                </button>
            </div>

            <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 w-full relative flex items-center justify-center text-gray-400">
                     <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                        <polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
                
                <div className="p-8">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="text-[#0066ff] font-semibold bg-blue-50 px-3 py-1 rounded-full">
                            {post.category}
                        </span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
                    
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <div className="font-semibold text-gray-900">{post.author}</div>
                            <div className="text-xs text-gray-500">Author</div>
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <p>{post.content}</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            </article>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Delete Blog Post"
                message="Are you sure you want to remove this post? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}

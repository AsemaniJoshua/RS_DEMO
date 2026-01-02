"use client";

import { useState } from "react";
import Link from "next/link";
import userData from "@/data/dashboard/user-profile.json";

export default function BookmarksPage() {
    const { bookmarks } = userData;
    const [activeTab, setActiveTab] = useState<"blogs" | "courses" | "resources">("blogs");

    const currentItems = bookmarks[activeTab];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Bookmarks</h1>
                <p className="text-gray-600">Manage your saved content and resources</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{bookmarks.blogs.length}</div>
                    <div className="text-sm text-gray-600">Saved Blogs</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{bookmarks.courses.length}</div>
                    <div className="text-sm text-gray-600">Saved Courses</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{bookmarks.resources.length}</div>
                    <div className="text-sm text-gray-600">Saved Resources</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("blogs")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "blogs"
                                ? "text-[#0066ff] border-b-2 border-[#0066ff]"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Blogs ({bookmarks.blogs.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("courses")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "courses"
                                ? "text-[#0066ff] border-b-2 border-[#0066ff]"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Courses ({bookmarks.courses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("resources")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "resources"
                                ? "text-[#0066ff] border-b-2 border-[#0066ff]"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Resources ({bookmarks.resources.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {Array.isArray(currentItems) && currentItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                            <p className="text-gray-600">Start bookmarking content to see it here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.isArray(currentItems) && currentItems.map((item: any) => (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#0066ff] transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <button className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                    {item.excerpt && <p className="text-sm text-gray-600 mb-3">{item.excerpt}</p>}
                                    {item.instructor && <p className="text-sm text-gray-600 mb-3">By {item.instructor}</p>}
                                    {item.type && <p className="text-sm text-gray-600 mb-3">Type: {item.type}</p>}
                                    {item.category && (
                                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs mb-3">
                                            {item.category}
                                        </span>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        Saved {new Date(item.savedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

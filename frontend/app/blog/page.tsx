"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import blogPostsData from "@/data/blogPosts.json";

// Note: Metadata export not possible in client components
// Consider moving to a server component wrapper if SEO is critical

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [visiblePosts, setVisiblePosts] = useState(6);

    const categories = ["All", "Drug Safety", "Supplements", "Diabetes", "Teen Drug Abuse", "Wellness"];

    const blogPosts = blogPostsData;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === "All" || post.category === activeCategory;
        const matchesSearch = debouncedSearch === "" ||
            post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Get featured post or first post
    const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0];
    const otherPosts = featuredPost
        ? filteredPosts.filter(post => post !== featuredPost).slice(0, visiblePosts - 1)
        : filteredPosts.slice(1, visiblePosts);

    const hasMorePosts = filteredPosts.length > visiblePosts;

    const handleLoadMore = () => {
        setVisiblePosts(prev => prev + 3);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Health Insights{" "}
                            <span className="text-[#0066ff]">& Articles</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Evidence-based health articles covering drug safety, supplements, chronic disease management, and more.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`h-10 px-5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category
                                        ? "bg-[#0066ff] text-white shadow-lg"
                                        : "border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Content with Sidebar */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2">
                            {/* Featured Post */}
                            {featuredPost && (
                                <article className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#0066ff] hover:shadow-xl transition-all duration-300 mb-8">
                                    {/* Featured Image */}
                                    <div className="relative h-80 bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] flex items-center justify-center">
                                        <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#0066ff] rounded-full text-white text-xs font-bold">
                                            {featuredPost.category}
                                        </div>
                                        {/* Featured Badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-[#00bfa6] rounded-full text-white text-xs font-bold flex items-center gap-1">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                            </svg>
                                            Featured
                                        </div>
                                    </div>

                                    {/* Featured Content */}
                                    <div className="p-8">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4 hover:text-[#0066ff] transition-colors duration-200">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-600 mb-6 leading-relaxed">
                                            {featuredPost.excerpt}
                                        </p>

                                        {/* Meta and Social Share */}
                                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center text-white text-sm font-bold">
                                                        DG
                                                    </div>
                                                    <span className="font-medium text-gray-700">{featuredPost.author}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{featuredPost.date}</span>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    <span>{featuredPost.readTime}</span>
                                                </div>
                                            </div>

                                            {/* Social Share Buttons */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 mr-2">Share:</span>
                                                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                                    </svg>
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#0A66C2] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                                        <circle cx="4" cy="4" r="2" />
                                                    </svg>
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#25D366] hover:text-white text-gray-600 transition-all duration-200 flex items-center justify-center">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                    <Link href={`/blog/${featuredPost.slug}`}>
                                        <button className="text-[#0066ff] font-medium hover:underline flex items-center gap-2 cursor-pointer">
                                            Read Full Article
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </Link>
                                    </div>
                                </article>
                            )}

                            {/* Other Posts - List View */}
                            <div className="space-y-6">
                                {otherPosts.map((post, index) => (
                                    <article key={index} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#0066ff] hover:shadow-lg transition-all duration-300">
                                        <div className="flex gap-6">
                                            {/* Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] rounded-xl flex items-center justify-center">
                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="text-xs font-semibold text-[#0066ff] uppercase mb-2">
                                                    {post.category}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-[#0066ff] transition-colors duration-200">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>{post.author}</span>
                                                    <span>•</span>
                                                    <span>{post.date}</span>
                                                    <span>•</span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasMorePosts && filteredPosts.length > 0 && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
                                    >
                                        Load More Articles
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 5v14m-7-7l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Improved Empty State */}
                            {filteredPosts.length === 0 && (
                                <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100">
                                    {/* Icon */}
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="11" y1="16" x2="11.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>

                                    {/* Message */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        No Articles Found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any articles matching{" "}
                                        {debouncedSearch ? `"${debouncedSearch}"` : "your search"}
                                        {activeCategory !== "All" && ` in ${activeCategory}`}.
                                    </p>

                                    {/* Suggestions */}
                                    <div className="max-w-md mx-auto">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Try browsing these categories:</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {categories.filter(cat => cat !== "All" && cat !== activeCategory).map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() => {
                                                        setActiveCategory(category);
                                                        setSearchQuery("");
                                                    }}
                                                    className="px-4 py-2 rounded-full border-2 border-[#0066ff] text-[#0066ff] text-sm font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer"
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                        {(debouncedSearch || activeCategory !== "All") && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setActiveCategory("All");
                                                }}
                                                className="mt-4 text-[#0066ff] font-medium hover:underline cursor-pointer"
                                            >
                                                Clear all filters
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Right Side */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Featured Newsroom */}
                                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Newsroom</h3>
                                    <div className="space-y-4">
                                        {blogPosts.slice(0, 3).map((post, index) => (
                                            <div key={index} className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 last:border-0">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-900 hover:text-[#0066ff] transition-colors duration-200 cursor-pointer mb-1">
                                                        {post.category}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">{post.date}</p>
                                                </div>
                                                <Link href={`/blog/${post.slug}`}>
                                                    <button className="text-[#0066ff] text-xs font-medium hover:underline whitespace-nowrap cursor-pointer">
                                                        View
                                                    </button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/blog">
                                        <button className="w-full mt-4 h-10 rounded-full border-2 border-[#0066ff] text-[#0066ff] text-sm font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                            View Full Newsroom
                                        </button>
                                    </Link>
                                </div>

                                {/* Need Personal Guidance CTA */}
                                <div className="bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-2xl p-6 text-white">
                                    <h3 className="text-xl font-bold mb-3">Need Personal Guidance?</h3>
                                    <p className="text-white/90 text-sm mb-4">
                                        Book a consultation for personalized health advice tailored to your needs.
                                    </p>
                                <Link href="/booking">
                                    <button className="w-full h-10 rounded-full bg-white text-[#0066ff] text-sm font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                                        Book Consultation
                                    </button>
                                </Link>
                                </div>

                                {/* Categories */}
                                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        {categories.filter(cat => cat !== "All").map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveCategory(category)}
                                                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeCategory === category
                                                    ? "bg-[#0066ff] text-white"
                                                    : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-2xl p-12 text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Get Health Insights Delivered
                        </h2>
                        <p className="text-white/90 mb-8">
                            Subscribe to receive evidence-based health articles and updates directly to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 h-12 px-4 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white"
                            />
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Need Personalized Guidance?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                        Book a consultation for expert advice tailored to your specific health needs.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-xl transition-all duration-200 cursor-pointer">
                                Book a Consultation
                            </button>
                        </Link>
                        <Link href="/blog">
                            <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                Browse All Articles
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

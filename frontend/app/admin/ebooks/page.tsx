"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ebookService, Ebook, EbookCategory } from "@/services/ebook-service";
import EbookCategoryManagementModal from "@/components/admin/ebooks/EbookCategoryManagementModal";
import toast from "react-hot-toast";

export default function EbooksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    
    // Core data
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [categories, setCategories] = useState<EbookCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Fetch data
    useEffect(() => {
        fetchEbooks();
        fetchCategories();
    }, []);

    const fetchEbooks = async () => {
        try {
            // Only set loading true if it's the initial load or we want global loading
            // For now, we'll keep it simple but separate
            const ebooksData = await ebookService.getAllEbooks();
            setEbooks((ebooksData as any)?.data?.ebooks || []);
        } catch (error: any) {
            console.error("Failed to load ebooks", error);
            // Don't show toast for every background refresh to avoid spam, 
            // but for initial load it might be useful. 
            // We'll trust the UI to show empty state if needed.
            // toast.error("Failed to load ebooks"); 
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesData = await ebookService.getAllCategories();
            setCategories((categoriesData as any)?.data?.categories || []);
        } catch (error: any) {
            console.error("Failed to load categories", error);
            toast.error("Failed to load categories");
        }
    };
    
    // Combined refresh for manual actions if needed, or just call both
    const refreshAll = () => {
        fetchEbooks();
        fetchCategories();
    };

    // Filter
    const filteredEbooks = ebooks.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.author.toLowerCase().includes(searchQuery.toLowerCase());
        
        // categoryFilter holds the category NAME for display
        const matchesCategory = categoryFilter === "All Categories" || item.category?.name === categoryFilter;
        
        const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter.toUpperCase();
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Stats
    const stats = {
        total: ebooks.length,
        published: ebooks.filter(e => e.status === "PUBLISHED").length,
        draft: ebooks.filter(e => e.status === "DRAFT").length
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        setIsDeleting(id);
        try {
            await ebookService.deleteEbook(id);
            toast.success("Ebook deleted successfully");
            await ebookService.deleteEbook(id);
            toast.success("Ebook deleted successfully");
            fetchEbooks();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete ebook");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ebooks</h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Manage your digital library, upload new ebooks, and track downloads.
                    </p>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                 <button 
                    onClick={() => setShowCategoryModal(true)}
                    className="text-sm text-[#00d4aa] hover:text-[#00bfa6] font-medium flex items-center gap-1 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Manage Categories
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Ebooks</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
                            <div className="text-sm text-gray-600">Published</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
                            <div className="text-sm text-gray-600">Drafts</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All Categories">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                    </select>
                    <Link href="/admin/ebooks/new">
                        <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                            + Add Ebook
                        </button>
                    </Link>
                </div>
            </div>

            {/* Ebooks Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Format</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-gray-600">Loading ebooks...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEbooks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                                        No ebooks found
                                    </td>
                                </tr>
                            ) : (
                                filteredEbooks.map((book, idx) => (
                                    <tr key={book.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-14 relative rounded overflow-hidden shrink-0 bg-gray-100 shadow-sm">
                                                    {book.coverImage ? (
                                                        <img 
                                                            src={book.coverImage} 
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900 line-clamp-2 max-w-[200px]" title={book.title}>{book.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {book.author}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                {book.category?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                            {book.format}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {book.price === 0 ? "Free" : `GHS ${book.price}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                book.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                                            }`}>
                                                {book.status === "PUBLISHED" ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/ebooks/${book.id}`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="View details">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/ebooks/${book.id}/edit`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="Edit ebook">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(book.id, book.title)}
                                                    disabled={isDeleting === book.id}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 disabled:opacity-50" 
                                                    title="Delete ebook"
                                                >
                                                     {isDeleting === book.id ? (
                                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            <EbookCategoryManagementModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                categories={categories}
                onCategoryChange={fetchCategories}
            />
        </div>
    );
}

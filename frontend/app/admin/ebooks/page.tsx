"use client";

import { useState } from "react";
import Link from "next/link";
import ebooksData from "@/data/admin/ebooks.json";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";

export default function EbooksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; ebookId: number | null; ebookName: string }>({
        isOpen: false,
        ebookId: null,
        ebookName: ""
    });

    const { ebooks, categories } = ebooksData;

    // Filter ebooks
    const filteredEbooks = ebooks.filter(ebook => {
        const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ebook.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || ebook.category === selectedCategory;
        const matchesStatus = selectedStatus === "All" || ebook.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDeleteClick = (ebookId: number, ebookName: string) => {
        setDeleteModal({ isOpen: true, ebookId, ebookName });
    };

    const handleDeleteConfirm = () => {
        console.log("Deleting eBook:", deleteModal.ebookId);
        setDeleteModal({ isOpen: false, ebookId: null, ebookName: "" });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, ebookId: null, ebookName: "" });
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">eBooks Management</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage your digital publications and resources</p>
                </div>
                <Link href="/admin/ebooks/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Add New eBook
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total eBooks</span>
                        <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{ebooks.length}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Published</span>
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{ebooks.filter(e => e.status === "Published").length}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Downloads</span>
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{ebooks.reduce((sum, e) => sum + e.downloads, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Avg Rating</span>
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {(ebooks.filter(e => e.rating > 0).reduce((sum, e) => sum + e.rating, 0) / ebooks.filter(e => e.rating > 0).length).toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search eBooks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* eBooks Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[768px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">eBook</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Pages</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Downloads</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEbooks.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    No eBooks found
                                </td>
                            </tr>
                        ) : (
                            filteredEbooks.map((ebook) => (
                                <tr key={ebook.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-16 bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] rounded flex items-center justify-center text-white font-bold text-xs">
                                                {ebook.format}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{ebook.title}</div>
                                                <div className="text-sm text-gray-500">{ebook.pages} pages</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{ebook.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{ebook.pages}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{ebook.downloads.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{ebook.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ebook.rating > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                                                </svg>
                                                <span className="text-sm text-gray-900 font-medium">{ebook.rating}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            ebook.status === "Published" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {ebook.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/ebooks/${ebook.id}/edit`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteClick(ebook.id, ebook.title)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
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

            {/* Delete Modal - Reusing course modal with updated text */}
            <DeleteCourseModal
                isOpen={deleteModal.isOpen}
                courseName={deleteModal.ebookName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}

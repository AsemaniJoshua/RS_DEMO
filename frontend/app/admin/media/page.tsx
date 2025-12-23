"use client";

import { useState } from "react";
import Link from "next/link";
import mediaData from "@/data/admin/media.json";
import DeleteMediaModal from "@/components/admin/DeleteMediaModal";

export default function MediaLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fileId: number | null; fileName: string }>({
        isOpen: false,
        fileId: null,
        fileName: ""
    });

    const { mediaFiles, stats } = mediaData;

    // Filter media files
    const filteredFiles = mediaFiles.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === "all" || file.type === selectedType;
        return matchesSearch && matchesType;
    });

    const getFileIcon = (type: string) => {
        switch (type) {
            case "image":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            case "video":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
                    </svg>
                );
            case "document":
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const handleDeleteClick = (fileId: number, fileName: string) => {
        setDeleteModal({ isOpen: true, fileId, fileName });
    };

    const handleDeleteConfirm = () => {
        console.log("Deleting file:", deleteModal.fileId);
        setDeleteModal({ isOpen: false, fileId: null, fileName: "" });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, fileId: null, fileName: "" });
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage your media files and resources</p>
                </div>
                <Link href="/admin/media/upload">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Upload Files
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Files</span>
                        <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalFiles}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Images</span>
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.images}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Videos</span>
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.videos}</div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                        {/* Search */}
                        <div className="flex-1 max-w-md relative w-full">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        >
                            <option value="all">All Types</option>
                            <option value="image">Images</option>
                            <option value="video">Videos</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                                <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
                                <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
                                <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
                                <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Files Grid/List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                        <div 
                            key={file.id} 
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => setSelectedFile(file.id)}
                        >
                            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                                {getFileIcon(file.type)}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(file.id, file.name);
                                        }}
                                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="font-semibold text-gray-900 text-sm mb-1 truncate">{file.name}</div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{file.size}</span>
                                    <span>{file.uploadDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Size</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Upload Date</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredFiles.map((file) => (
                                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {getFileIcon(file.type)}
                                            <span className="font-medium text-gray-900">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 capitalize">{file.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">{file.size}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{file.uploadDate}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(file.id, file.name)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Modal */}
            <DeleteMediaModal
                isOpen={deleteModal.isOpen}
                fileName={deleteModal.fileName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}

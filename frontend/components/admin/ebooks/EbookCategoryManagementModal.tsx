"use client";

import { useState } from "react";
import { ebookService, EbookCategory } from "@/services/ebook-service";
import toast from "react-hot-toast";

interface EbookCategoryManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: EbookCategory[];
    onCategoryChange: () => void;
}

export default function EbookCategoryManagementModal({
    isOpen,
    onClose,
    categories,
    onCategoryChange
}: EbookCategoryManagementModalProps) {
    const [newCategory, setNewCategory] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; name: string }>({ 
        open: false, 
        id: null, 
        name: "" 
    });

    if (!isOpen) return null;

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedCategory = newCategory.trim();
        
        // Validation
        if (!trimmedCategory) {
            toast.error("Category name cannot be empty");
            return;
        }

        if (categories.some(cat => cat.name === trimmedCategory)) {
            toast.error("Category already exists");
            return;
        }

        setIsCreating(true);
        try {
            await ebookService.createCategory(trimmedCategory);
            toast.success("Category added successfully");
            setNewCategory("");
            await onCategoryChange(); // Refresh categories
        } catch (error: any) {
            toast.error(error.message || "Failed to add category");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!deleteModal.id) return;

        setDeletingId(deleteModal.id);
        try {
            await ebookService.deleteCategory(deleteModal.id);
            toast.success("Category deleted successfully");
            setDeleteModal({ open: false, id: null, name: "" });
            onCategoryChange(); // Refresh categories
        } catch (error: any) {
            toast.error(error.message || "Failed to delete category");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Manage Ebook Categories</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm">
                        Add, edit, or remove ebook categories
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Add Category Form */}
                    <form onSubmit={handleAddCategory} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Category
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter category name..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d4aa] focus:border-transparent outline-none text-gray-900"
                                disabled={isCreating}
                            />
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {isCreating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Add"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Categories List */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Existing Categories ({categories.length})
                        </h3>
                        
                        {categories.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-gray-300">
                                    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <p className="text-sm">No categories yet</p>
                                <p className="text-xs text-gray-400 mt-1">Add your first category above</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                                                    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <span className="text-gray-900 font-medium">{category.name}</span>
                                                {category._count && category._count.ebooks > 0 && (
                                                    <span className="ml-2 text-xs text-gray-500">({category._count.ebooks} ebooks)</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: category.id, name: category.name })}
                                            disabled={deletingId === category.id}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete category"
                                        >
                                            {deletingId === category.id ? (
                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Category</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete <span className="font-semibold">{deleteModal.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
                                disabled={deletingId === deleteModal.id}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                                onClick={handleDeleteCategory}
                                disabled={deletingId === deleteModal.id}
                            >
                                {deletingId === deleteModal.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

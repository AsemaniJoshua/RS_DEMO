"use client";

import { useState, useEffect } from "react";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";

interface CategoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void; // Trigger refresh of categories in parent
}

export default function CategoryManagerModal({ isOpen, onClose, onUpdate }: CategoryManagerModalProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const res = await courseService.getCategories();
            setCategories(res || []);
        } catch (error) {
            console.error("Failed to load categories", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            setAdding(true);
            await courseService.createCategory(newCategory.trim());
            toast.success("Category added");
            setNewCategory("");
            loadCategories();
            onUpdate();
        } catch (error: any) {
            console.error("Failed to add category", error);
            toast.error(error.response?.data?.error || "Failed to add category"); // Backend returns { error: message } or { message: ... }? Controller says { error: error.message }
        } finally {
            setAdding(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Add New Form */}
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category name"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            disabled={adding}
                        />
                        <button 
                            type="submit" 
                            disabled={adding || !newCategory.trim()}
                            className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors disabled:opacity-50 font-medium"
                        >
                            {adding ? "Adding..." : "Add"}
                        </button>
                    </form>

                    {/* List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {loading ? (
                            <p className="text-center text-gray-500 text-sm py-4">Loading categories...</p>
                        ) : categories.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-4">No categories found.</p>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                    <span className="text-gray-700 font-medium">{cat.name}</span>
                                    <button 
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this category?')) {
                                                try {
                                                    await courseService.deleteCategory(cat.id);
                                                    toast.success('Category deleted');
                                                    loadCategories();
                                                    onUpdate();
                                                } catch (error) {
                                                    console.error("Failed to delete category", error);
                                                    toast.error('Failed to delete category');
                                                }
                                            }
                                        }}
                                        className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                        title="Delete Category"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

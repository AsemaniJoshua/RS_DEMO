"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ebookService, EbookCategory } from "@/services/ebook-service";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import toast from "react-hot-toast";

export default function NewEbookPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<EbookCategory[]>([]);
    
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        categoryId: "",
        price: "",
        pages: "",
        status: "DRAFT",
        format: "PDF",
        description: "",
        coverImage: "",
        coverImagePublicId: "",
        fileUrl: "",
        filePublicId: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await ebookService.getAllCategories();
            // Assuming structure is consistent with other API calls
            setCategories((response as any).data.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load categories");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (!formData.title || !formData.author || !formData.categoryId) {
            toast.error("Please fill in all required fields (Title, Author, Category)");
            return;
        }

        if (!formData.coverImage) {
            toast.error("Please upload a cover image");
            return;
        }

        if (!formData.fileUrl) {
            toast.error("Please upload the ebook file");
            return;
        }

        setIsLoading(true);
        try {
            await ebookService.createEbook(formData);
            toast.success("Ebook created successfully");
            router.push("/admin/ebooks");
        } catch (error: any) {
            toast.error(error.message || "Failed to create ebook");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/ebooks">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Ebook</h1>
                    <p className="text-sm text-gray-600">Upload a new digital book to the library</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#00d4aa] rounded-full"></span>
                        Basic Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:ring-4 focus:ring-[#00d4aa]/10 outline-none transition-all"
                                placeholder="E.g. The Complete Guide to Dental Hygiene"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                                placeholder="E.g. Dr. George"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                                placeholder="0.00"
                            />
                            <p className="text-xs text-gray-500 mt-1">Set to 0 for free ebooks</p>
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pages</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.pages}
                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                                placeholder="Total pages"
                            />
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                        Details & Format
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                            <select
                                value={formData.format}
                                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                            >
                                <option value="PDF">PDF</option>
                                <option value="EPUB">EPUB</option>
                                <option value="MOBI">MOBI</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none"
                            >
                                <option value="DRAFT">Draft (Hidden)</option>
                                <option value="PUBLISHED">Published (Visible)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none resize-none"
                            placeholder="Describe what the ebook is about..."
                        />
                    </div>
                </div>

                {/* Files Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cover Image */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                            Cover Image *
                        </h2>
                        <ImageUpload
                            value={formData.coverImage}
                            onChange={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                            onUploadComplete={({ url, public_id }) => setFormData(prev => ({ 
                                ...prev, 
                                coverImage: url,
                                coverImagePublicId: public_id 
                            }))}
                            label="Upload Cover"
                        />
                        <p className="text-xs text-center text-gray-500 mt-2">Recommended size: 600x900px</p>
                    </div>

                    {/* Ebook File */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                         <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                            Ebook File *
                        </h2>
                        <FileUpload
                            value={formData.fileUrl}
                            onChange={(url, publicId) => setFormData({ ...formData, fileUrl: url, filePublicId: publicId })}
                            onRemove={() => setFormData({ ...formData, fileUrl: "", filePublicId: "" })}
                            label="Upload Book File"
                        />
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    <Link href="/admin/ebooks">
                        <button
                            type="button"
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-all shadow-lg shadow-[#00d4aa]/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            "Create Ebook"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

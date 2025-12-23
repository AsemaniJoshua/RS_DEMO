"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadMediaPage() {
    const router = useRouter();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles([...uploadedFiles, ...files]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles([...uploadedFiles, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        console.log("Uploading files:", uploadedFiles);
        router.push("/admin/media");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Media</h1>
                    <p className="text-gray-600">Upload images, videos, or documents to your library</p>
                </div>
                <Link href="/admin/media">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <div className="max-w-4xl">
                {/* Upload Area */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                            isDragging 
                                ? 'border-[#00d4aa] bg-[#00d4aa]/5' 
                                : 'border-gray-300 hover:border-[#00d4aa]'
                        }`}
                    >
                        <div className="w-16 h-16 bg-[#00d4aa]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {isDragging ? 'Drop files here' : 'Drag and drop files'}
                        </h3>
                        <p className="text-gray-600 mb-4">or</p>
                        <label className="inline-block">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,video/*,.pdf,.doc,.docx"
                            />
                            <span className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors cursor-pointer inline-block font-medium">
                                Browse Files
                            </span>
                        </label>
                        <p className="text-sm text-gray-500 mt-4">
                            Supported formats: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC)
                        </p>
                    </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Files to Upload ({uploadedFiles.length})
                        </h3>
                        <div className="space-y-3">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">{file.name}</div>
                                            <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload Settings */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Folder
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900">
                                <option>Root Directory</option>
                                <option>Course Materials</option>
                                <option>Blog Images</option>
                                <option>eBook Covers</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="optimize" className="w-4 h-4 text-[#00d4aa]" defaultChecked />
                            <label htmlFor="optimize" className="text-sm text-gray-700">
                                Automatically optimize images for web
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="backup" className="w-4 h-4 text-[#00d4aa]" />
                            <label htmlFor="backup" className="text-sm text-gray-700">
                                Create backup of original files
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={uploadedFiles.length === 0}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            uploadedFiles.length > 0
                                ? 'bg-[#00d4aa] text-white hover:bg-[#00bfa6]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`} Files
                    </button>
                    <Link href="/admin/media">
                        <button className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

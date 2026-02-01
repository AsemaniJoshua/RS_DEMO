"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mediaService } from "@/services/media-service";
import toast from "react-hot-toast";

export default function UploadMediaPage() {
    const router = useRouter();
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    const MAX_FILES = 10; // Maximum 10 files per upload

    const validateAndAddFiles = (files: File[]) => {
        const validFiles: File[] = [];
        const invalidFiles: string[] = [];

        // Check if adding these files would exceed the max limit
        if (uploadedFiles.length + files.length > MAX_FILES) {
            setError(`You can only upload a maximum of ${MAX_FILES} files at once. Currently selected: ${uploadedFiles.length}`);
            return;
        }

        files.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push(`${file.name} (${formatFileSize(file.size)})`);
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFiles.length > 0) {
            setError(`The following files exceed the 50MB limit and were not added: ${invalidFiles.join(", ")}`);
        } else {
            setError("");
        }

        if (validFiles.length > 0) {
            setUploadedFiles([...uploadedFiles, ...validFiles]);
        }
    };

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
        validateAndAddFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            validateAndAddFiles(files);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
        setError(""); // Clear error when removing files
    };

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) {
            toast.error('Please select at least one file to upload');
            return;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);

            // Simulate progress (you can implement actual progress tracking if needed)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await mediaService.uploadMediaAdmin(uploadedFiles);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.status === 'success') {
                toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
                
                // Wait a moment to show 100% progress
                setTimeout(() => {
                    router.push("/admin/media");
                }, 500);
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload files');
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileTypeIcon = (file: File) => {
        if (file.type.startsWith('image/')) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                </svg>
            );
        } else if (file.type.startsWith('video/')) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
                </svg>
            );
        } else {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2"/>
                </svg>
            );
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Media</h1>
                    <p className="text-gray-600">Upload images, videos, or documents to your library (Max {MAX_FILES} files)</p>
                </div>
                <Link href="/admin/media">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" disabled={isUploading}>
                        Cancel
                    </button>
                </Link>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-4xl mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                        <button 
                            onClick={() => setError("")}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

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
                        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
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
                                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp"
                                disabled={isUploading}
                            />
                            <span className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors cursor-pointer inline-block font-medium">
                                Browse Files
                            </span>
                        </label>
                        <p className="text-sm text-gray-500 mt-4">
                            Supported formats: Images (JPG, PNG, GIF, WEBP, SVG), Videos (MP4, MOV, AVI, MKV), Documents (PDF, DOC, DOCX, XLS, XLSX, CSV, PPT, PPTX, TXT, RTF, ODT, ODS, ODP)
                            <br />
                            <span className="font-medium">Maximum file size: 50MB per file | Maximum {MAX_FILES} files per upload</span>
                        </p>
                    </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Files to Upload ({uploadedFiles.length}/{MAX_FILES})
                        </h3>
                        <div className="space-y-3">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
                                            {getFileTypeIcon(file)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">{file.name}</div>
                                            <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                        disabled={isUploading}
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

                {/* Upload Progress */}
                {isUploading && (
                    <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Uploading files...</span>
                            <span className="text-sm font-medium text-[#00d4aa]">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-[#00d4aa] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleUpload}
                        disabled={uploadedFiles.length === 0 || isUploading}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                            uploadedFiles.length > 0 && !isUploading
                                ? 'bg-[#00d4aa] text-white hover:bg-[#00bfa6]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Uploading...
                            </>
                        ) : (
                            `Upload ${uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ''} Files`
                        )}
                    </button>
                    <Link href="/admin/media">
                        <button 
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

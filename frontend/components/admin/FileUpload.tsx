"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

interface FileUploadProps {
    value?: string;
    onChange: (url: string, publicId: string) => void;
    onRemove: () => void;
    accept?: Record<string, string[]>;
    maxSize?: number; // in bytes
    label?: string;
}

export default function FileUpload({
    value,
    onChange,
    onRemove,
    accept = {
        'application/pdf': ['.pdf'],
        'application/epub+zip': ['.epub'],
        'application/x-mobipocket-ebook': ['.mobi']
    },
    maxSize = 10 * 1024 * 1024, // 10MB default
    label = "Upload File"
}: FileUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsLoading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rs_demo_unsigned");
        // Important for non-image files like PDFs
        formData.append("resource_type", "auto"); 

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
                        );
                        setUploadProgress(percentCompleted);
                    }
                }
            );

            onChange(response.data.secure_url, response.data.public_id);
            toast.success("File uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
        maxSize,
        multiple: false
    });

    return (
        <div className="w-full">
            {value ? (
                <div className="relative w-full p-4 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">File Uploaded</p>
                            <a 
                                href={value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-[#00d4aa] hover:underline truncate block"
                            >
                                View File
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500"
                        title="Remove file"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`
                        relative w-full cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
                        ${isDragActive ? 'border-[#00d4aa] bg-[#00d4aa]/5' : 'border-gray-300 hover:border-[#00d4aa] hover:bg-gray-50'}
                    `}
                >
                    <input {...getInputProps()} />
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-gray-600 font-medium">{uploadProgress}% Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700 text-center mb-1">
                                {isDragActive ? "Drop the file here" : label}
                            </p>
                            <p className="text-xs text-gray-500 text-center">
                                PDF, EPUB, MOBI (max {Math.round(maxSize / 1024 / 1024)}MB)
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

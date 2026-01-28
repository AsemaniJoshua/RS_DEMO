"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";

interface FileUploadProps {
    value?: File | string | null;
    onChange: (file: File | null) => void;
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
    maxSize = 500 * 1024 * 1024, // 500MB default
    label = "Upload File"
}: FileUploadProps) {
    
    // Helper to display file name
    const getDisplayValue = () => {
        if (!value) return null;
        if (value instanceof File) return value.name;
        // If it's a string URL, extract filename or show generic text
        return "Existing File";
    };

    const isFileObject = value instanceof File;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            onChange(file);
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
                            <p className="text-sm font-medium text-gray-900 truncate">{getDisplayValue()}</p>
                            {!isFileObject && typeof value === 'string' && (
                                <a 
                                    href={value} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#00d4aa] hover:underline truncate block"
                                >
                                    View Current File
                                </a>
                            )}
                            {isFileObject && (
                                <p className="text-xs text-green-600">Ready to upload</p>
                            )}
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
                </div>
            )}
        </div>
    );
}

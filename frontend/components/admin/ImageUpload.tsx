import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { blogService } from '@/services/blog-service';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onFileSelect?: (file: File | null) => void;
    label?: string;
    className?: string;
}

export default function ImageUpload({ value, onChange, onFileSelect, label = "Featured Image", className = "" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        // Create local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // If onFileSelect is provided, just pass the file back and skip upload
        if (onFileSelect) {
            onFileSelect(file);
            return;
        }

        try {
            setIsUploading(true);
            const response = await blogService.uploadImage(file);
            console.log("Upload response:", response);

            if (response.status === 'success' && response.data?.url) {
                onChange(response.data.url);
                toast.success('Image uploaded successfully');
            } else if (response.data?.url) {
                // Fallback if response structure is different but has url
                onChange(response.data.url);
                toast.success('Image uploaded successfully');
            } else {
                toast.error('Upload failed: No URL returned');
                setPreviewUrl(""); // Clear preview on failure
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            setPreviewUrl(""); // Clear preview on failure
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreviewUrl('');
        if (onFileSelect) {
            onFileSelect(null);
        }
    };

    // Use value (server URL) if available, otherwise use previewUrl (local)
    const displayUrl = value || previewUrl;

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            
            {displayUrl ? (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-gray-200 group">
                    <img
                        src={displayUrl} 
                        alt="Uploaded image" 
                        className="object-cover w-full h-full"
                    />
                    
                    {/* Overlay for uploading state */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-sm font-medium">Uploading...</span>
                        </div>
                    )}

                    {/* Remove button (only show if not uploading) */}
                    {!isUploading && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-gray-300 
                        hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer
                        flex flex-col items-center justify-center
                    `}
                >
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );
}

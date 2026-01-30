import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { blogService } from '@/services/blog-service';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface ImageUploadProps {
    value?: File | string | null;
    onChange: (value: File | string | null) => void;
    onUploadComplete?: (data: { url: string; public_id: string }) => void;
    onFileSelect?: (file: File | null) => void;
    label?: string;
    className?: string;
}

export default function ImageUpload({ value, onChange, onUploadComplete, onFileSelect, label = "Featured Image", className = "" }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    // Initialize preview if value is a string (URL)
    // If value is a File, create object URL
    const getDisplayUrl = () => {
        if (!value) return "";
        if (typeof value === 'string') return value;
        if (value instanceof File) return URL.createObjectURL(value);
        return "";
    };

    const displayUrl = getDisplayUrl();

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

        // Handle upload if onUploadComplete is provided
        if (onUploadComplete) {
            const loadingToast = toast.loading('Uploading image...');
            try {
                const response = await blogService.uploadImage(file);
                // Cast response to any to access public_id if it exists, or just pass empty string if not typed
                const responseData = response.data as any;
                
                onUploadComplete({
                    url: responseData.url,
                    public_id: responseData.public_id || ''
                });
                onChange(responseData.url);
                toast.dismiss(loadingToast);
                toast.success('Image uploaded successfully');
            } catch (error) {
                toast.dismiss(loadingToast);
                toast.error('Failed to upload image');
                console.error(error);
            }
        } else {
            // Default behavior if no upload handler
            onChange(file);
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = () => {
        onChange(null);
        if (onFileSelect) {
            onFileSelect(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            
            {displayUrl ? (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-gray-200 group">
                    <img
                        src={displayUrl} 
                        alt="Uploaded preview" 
                        className="object-cover w-full h-full"
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {value instanceof File && (
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow">
                            Ready to upload
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
            />
        </div>
    );
}

import { api, ApiResponse } from '@/lib/api';

// Media interfaces
export interface MediaUploader {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Media {
    id: string;
    name: string;
    original_name: string;
    file_type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    mime_type: string;
    size: number;
    url: string;
    cloudinary_id: string;
    dimensions?: string;
    duration?: string;
    uploaded_by: string;
    created_at: string;
    updated_at: string;
    uploader?: MediaUploader;
}

export interface MediaStats {
    totalFiles: number;
    images: number;
    videos: number;
    documents: number;
}

export interface MediaPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetAllMediaResponse {
    media: Media[];
    stats: MediaStats;
    pagination: MediaPagination;
}

// Media Service
export const mediaService = {
    /**
     * Get all media files (with pagination and filtering)
     * GET /api/v1/admin/media
     */
    async getAllMedia(params?: {
        page?: number;
        limit?: number;
        file_type?: string;
        search?: string;
    }): Promise<ApiResponse<GetAllMediaResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.file_type) queryParams.append('file_type', params.file_type);
        if (params?.search) queryParams.append('search', params.search);

        const endpoint = `/admin/media${queryParams.toString() ? `?${queryParams}` : ''}`;
        return api.get<GetAllMediaResponse>(endpoint);
    },

    /**
     * Get single media file by ID
     * GET /api/v1/admin/media/:id
     */
    async getMediaById(id: string): Promise<ApiResponse<Media>> {
        return api.get<Media>(`/admin/media/${id}`);
    },

    /**
     * Upload media files (multiple files)
     * POST /api/v1/admin/media/upload
     */
    async uploadMedia(files: File[]): Promise<ApiResponse<Media[]>> {
        const formData = new FormData();
        
        // Append all files with the same field name 'files'
        files.forEach(file => {
            formData.append('files', file);
        });

        return api.post<Media[]>('/admin/media/upload', formData);
    },

    /**
     * Delete media file
     * DELETE /api/v1/admin/media/:id
     */
    async deleteMedia(id: string): Promise<ApiResponse<any>> {
        return api.delete<any>(`/admin/media/${id}`);
    },

    /**
     * Format file size from bytes to human-readable format
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    /**
     * Get file type display name
     */
    getFileTypeLabel(type: string): string {
        const typeMap: Record<string, string> = {
            'IMAGE': 'Images',
            'VIDEO': 'Videos',
            'DOCUMENT': 'Documents'
        };
        return typeMap[type.toUpperCase()] || type;
    }
};

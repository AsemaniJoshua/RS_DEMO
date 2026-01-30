import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface MediaItem {
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
    created_at: string;
    updated_at: string;
    uploader?: {
        first_name: string;
        last_name: string;
    };
}

export interface MediaStats {
    totalFiles: number;
    images: number;
    videos: number;
    documents: number;
}

export interface MediaResponse {
    media: MediaItem[];
    stats: MediaStats;
}

class MediaService {
    private getAuthHeader() {
        if (typeof window !== 'undefined') {
             const token = localStorage.getItem('auth_token');
             // Add check to ensure token exists, otherwise might need redirect or let interceptor handle
             return {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
        }
        return {};
    }

    // Get all media (User Route)
    async getAllMedia(page = 1, limit = 20, type = 'all', search?: string): Promise<MediaResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                file_type: type
            });
            
            if (search) {
                params.append('search', search);
            }

            const response = await axios.get(
                `${API_BASE_URL}/user/media?${params}`,
                this.getAuthHeader()
            );
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching media:', error);
             throw new Error(error.response?.data?.message || 'Failed to fetch media');
        }
    }

    // Get single media by ID (User Route)
    async getMediaById(id: string): Promise<MediaItem> {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/user/media/${id}`,
                this.getAuthHeader()
            );
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching media details:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch media details');
        }
    }

    // Format file size
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export const mediaService = new MediaService();

    // Update media with file (Admin Route)
    export async function updateMediaAdminWithFile(id: string, formData: FormData): Promise<{ status: string; message: string; data: MediaItem }> {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.put(
                `${API_BASE_URL}/admin/media/${id}`,
                formData,
                {
                    headers: {
                        ...headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error updating media (admin, file):', error);
            throw new Error(error.response?.data?.message || 'Failed to update media');
        }
    }
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
    description: string;
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

    // Get all media (Admin Route)
    async getAllMediaAdmin(page = 1, limit = 20, type = 'all', search?: string): Promise<MediaResponse> {
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
                `${API_BASE_URL}/admin/media?${params}`,
                this.getAuthHeader()
            );
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching admin media:', error);
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

    // Upload media (User Route)
    async uploadMedia(files: File[]): Promise<{ status: string; message: string; data: MediaItem[] }> {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const response = await axios.post(
                `${API_BASE_URL}/user/media/upload`,
                formData,
                {
                    ...this.getAuthHeader(),
                    headers: {
                        ...this.getAuthHeader().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
             console.error('Error uploading media:', error);
             throw new Error(error.response?.data?.message || 'Failed to upload media');
        }
    }

    // Upload media (Admin Route)
    async uploadMediaAdmin(files: File[], descriptions: string[]): Promise<{ status: string; message: string; data: MediaItem[] }> {
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append('files', file);
                formData.append('descriptions', descriptions[index]);
            });

            const response = await axios.post(
                `${API_BASE_URL}/admin/media/upload`,
                formData,
                {
                    ...this.getAuthHeader(),
                    headers: {
                        ...this.getAuthHeader().headers,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error: any) {
             console.error('Error uploading media (admin):', error);
             throw new Error(error.response?.data?.message || 'Failed to upload media');
        }
    }

    // Update media details (Admin Route)
    async updateMediaAdmin(id: string, data: { description: string }): Promise<{ status: string; message: string; data: MediaItem }> {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/admin/media/${id}`,
                data,
                this.getAuthHeader()
            );
            return response.data;
        } catch (error: any) {
             console.error('Error updating media (admin):', error);
             throw new Error(error.response?.data?.message || 'Failed to update media');
        }
    }



    // Delete media (User Route)
    async deleteMedia(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/user/media/${id}`,
                this.getAuthHeader()
            );
            return response.data;
        } catch (error: any) {
             console.error('Error deleting media:', error);
             throw new Error(error.response?.data?.message || 'Failed to delete media');
        }
    }

    // Delete media (Admin Route)
    async deleteMediaAdmin(id: string): Promise<{ status: string; message: string }> {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/admin/media/${id}`,
                this.getAuthHeader()
            );
            return response.data;
        } catch (error: any) {
             console.error('Error deleting media (admin):', error);
             throw new Error(error.response?.data?.message || 'Failed to delete media');
        }
    }
}

export const mediaService = new MediaService();

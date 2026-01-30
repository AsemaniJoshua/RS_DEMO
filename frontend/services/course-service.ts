
import { api } from "@/lib/api";

export interface CourseCategory {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    price: string | number;
    categoryId: string;
    category?: CourseCategory;
    thumbnailUrl?: string;
    fileUrl?: string; // Only available if purchased or admin
    status: 'DRAFT' | 'PUBLISHED';
    students?: number;
    rating?: number; // Placeholder
    duration?: string; // Placeholder
    isPurchased?: boolean;
    created_at: string;
    updated_at: string;
}

export const courseService = {
    // Categories
    getCategories: async () => {
        const response = await api.get<any[]>('/admin/courses/categories');
        return response.data;
    },

    createCategory: async (name: string) => {
        const response = await api.post('/admin/courses/categories', { name });
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete(`/admin/courses/categories/${id}`);
        return response.data;
    },

    // Courses
    getAllCourses: async (status?: string, category?: string, search?: string) => {
        const params = new URLSearchParams();
        if (status && status !== 'All') params.append('status', status);
        if (category && category !== 'All Categories') params.append('category', category);
        if (search) params.append('search', search);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<any[]>(`/admin/courses${queryString}`);
        return response.data;
    },

    getCourseById: async (id: string) => {
        const response = await api.get(`/admin/courses/${id}`);
        return response.data;
    },

    createCourse: async (formData: FormData): Promise<any> => {
        const response = await api.post('/admin/courses', formData);
        return response.data;
    },

    updateCourse: async (id: string, formData: FormData): Promise<any> => {
        const response = await api.put(`/admin/courses/${id}`, formData);
        return response.data;
    },

    deleteCourse: async (id: string) => {
        const response = await api.delete(`/admin/courses/${id}`);
        return response.data;
    },

    downloadCourse: async (id: string) => {
        // We get the URL from the backend
        const response = await api.get<any>(`/admin/courses/${id}/download`);
        
        if (response.data.success && response.data.downloadUrl) {
            // Initiate download by opening in new tab or creating link
            // For zip files, direct window open might be best or a hidden anchor
            
            // Create a hidden anchor to force download
            const link = document.createElement('a');
            link.href = response.data.downloadUrl;
            link.setAttribute('download', ''); // hint to download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        return response.data;
    }
};

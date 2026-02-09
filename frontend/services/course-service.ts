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

    // =====================
    // USER DASHBOARD ENDPOINTS
    // =====================

    /**
     * Get all published courses (user dashboard)
     * GET /api/v1/user/courses
     */
    getUserCourses: async (category?: string, level?: string, search?: string) => {
        const params = new URLSearchParams();
        if (category && category !== 'All Categories') params.append('category', category);
        if (level && level !== 'All Levels') params.append('level', level);
        if (search) params.append('search', search);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<any>(`/user/courses${queryString}`);
        return response.data?.courses || [];
    },

    /**
     * Get single course details (user dashboard)
     * GET /api/v1/user/courses/:id
     */
    getUserCourseById: async (id: string) => {
        const response = await api.get<any>(`/user/courses/${id}`);
        return response.data;
    },

    /**
     * Get user's purchased/enrolled courses (user dashboard)
     * GET /api/v1/user/courses/my-library
     */
    getMyCourses: async () => {
        const response = await api.get<any>(`/user/courses/my-library`);
        return response.data?.courses || [];
    },

    /**
     * Purchase/initiate payment for a course (user dashboard)
     * POST /api/v1/user/courses/:id/purchase
     */
    purchaseCourse: async (id: string, email: string, callback_url: string) => {
        const response = await api.post<any>(`/user/courses/${id}/purchase`, { email, callback_url });
        return response.data;
    },

    /**
     * Verify course payment (user dashboard)
     * GET /api/v1/user/courses/verify/:reference
     */
    verifyCoursePayment: async (reference: string) => {
        const response = await api.get<any>(`/user/courses/verify/${reference}`);
        return response.data;
    },

    /**
     * Download purchased course (user dashboard)
     * GET /api/v1/user/courses/:id/download
     */
    downloadUserCourse: async (id: string) => {
        const response = await api.get<any>(`/user/courses/${id}/download`);
        let url = response.data?.downloadUrl || response.data?.fileUrl || response.fileUrl;
        if (url) {
            if (url.includes('res.cloudinary.com') && url.includes('/raw/')) {
                url = url.replace(/\/upload(?!\/fl_attachment)/, '/upload/fl_attachment');
            }
            // Try to extract filename from url
            let filename = url.split('/').pop()?.split('?')[0] || 'course.zip';
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
            // Fallback: open in new tab if download attribute is ignored
            setTimeout(() => {
                window.open(url, '_blank');
            }, 500);
            return { fileUrl: url };
        } else {
            throw new Error('No file URL received');
        }
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
        let url = response.data?.downloadUrl || response.data?.fileUrl || response.fileUrl;
        if (url) {
            // If Cloudinary raw file, force download with fl_attachment
            if (url.includes('res.cloudinary.com') && url.includes('/raw/')) {
                // Insert fl_attachment after /upload if not present
                url = url.replace(/\/upload(?!\/fl_attachment)/, '/upload/fl_attachment');
            }
            // Try to extract filename from url
            let filename = url.split('/').pop()?.split('?')[0] || 'course.zip';
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
            // Fallback: open in new tab if download attribute is ignored
            setTimeout(() => {
                window.open(url, '_blank');
            }, 500);
            return { downloadUrl: url };
        } else {
            throw new Error('No download URL received');
        }
    }
};

import { api } from '@/lib/api';

export interface Ebook {
    id: string;
    title: string;
    author: string;
    categoryId: string;
    category?: EbookCategory;
    price: string; // Decimal comes as string from JSON often, or number
    pages: number;
    status: 'PUBLISHED' | 'DRAFT';
    format: 'PDF' | 'EPUB' | 'MOBI';
    description: string;
    coverImage: string;
    coverImagePublicId: string;
    fileUrl: string;
    filePublicId: string;
    downloads: number;
    rating: number;
    created_at: string;
    updated_at: string;
}

export interface EbookCategory {
    id: string;
    name: string;
    _count?: {
        ebooks: number;
    };
    created_at: string;
    updated_at: string;
}

export const ebookService = {
    // Ebooks
    getAllEbooks: async (params?: { status?: string; category?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        const response = await api.get(`/admin/ebooks?${query}`);
        return response;
    },

    getEbookById: async (id: string) => {
        const response = await api.get(`/admin/ebooks/${id}`);
        return response;
    },

    createEbook: async (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if ((key === 'coverImage' || key === 'file') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, String(data[key]));
            }
        });
        
        // Ensure we're not sending "undefined" string for missing files
        if (!data.coverImage) formData.delete('coverImage');
        if (!data.file) formData.delete('file');

        const response = await api.post('/admin/ebooks', formData);
        return response;
    },

    updateEbook: async (id: string, data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if ((key === 'coverImage' || key === 'file') && data[key] instanceof File) {
                formData.append(key, data[key]);
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, String(data[key]));
            }
        });

        const response = await api.put(`/admin/ebooks/${id}`, formData);
        return response;
    },

    deleteEbook: async (id: string) => {
        const response = await api.delete(`/admin/ebooks/${id}`);
        return response;
    },

    // Categories
    getAllCategories: async () => {
        const response = await api.get(`/admin/ebook-categories?t=${new Date().getTime()}`);
        return response;
    },

    createCategory: async (name: string) => {
        const response = await api.post('/admin/ebook-categories', { name });
        return response;
    },

    updateCategory: async (id: string, name: string) => {
        const response = await api.patch(`/admin/ebook-categories/${id}`, { name });
        return response;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete(`/admin/ebook-categories/${id}`);
        return response.data;
    }
};

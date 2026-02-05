import { apiFetch } from '@/lib/api';

export interface Ebook {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    pages: number;
    language?: string;
    publishDate?: string;
    coverImage: string;
    coverImagePublicId: string;
    category: {
        id: string;
        name: string;
    };
    status: 'DRAFT' | 'PUBLISHED';
    downloads?: number;
    rating?: number;
    created_at?: string;
    format?: string;
    fileUrl?: string;
}

export interface EbookCategory {
    id: string;
    name: string;
    description?: string;
    count?: number;
    _count?: {
        ebooks: number;
    };
}

export interface EbookPurchase {
    id: string;
    ebookId: string;
    paymentReference: string;
    amount: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    purchasedAt: string;
    ebook: Ebook;
}

export interface PaystackInitResponse {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface VerifyPurchaseResponse {
    status: string;
    message: string;
}

export interface DownloadResponse {
    downloadUrl: string;
}

class EbookService {
    /**
     * Get all published ebooks
     */
    async getEbooks(category?: string, search?: string) {
        const queryParams = new URLSearchParams();
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        
        const endpoint = `/user/ebooks?${queryParams.toString()}`;
        return apiFetch<{ ebooks: Ebook[] }>(endpoint);
    }

    /**
     * Get single ebook details
     */
    async getEbookById(id: string) {
        return apiFetch<{ ebook: Ebook; isPurchased: boolean }>(`/user/ebooks/${id}`);
    }

    /**
     * Get user's purchased ebooks
     */
    async getMyLibrary() {
        return apiFetch<{ ebooks: Ebook[] }>('/user/ebooks/my-library');
    }

    /**
     * Initialize purchase
     */
    async purchaseEbook(id: string, callbackUrl?: string) {
        return apiFetch<PaystackInitResponse>(`/user/ebooks/${id}/purchase`, {
            method: 'POST',
            body: JSON.stringify({ callback_url: callbackUrl })
        });
    }

    /**
     * Verify purchase
     */
    async verifyPurchase(reference: string) {
        return apiFetch<VerifyPurchaseResponse>(`/user/ebooks/verify/${reference}`);
    }

    /**
     * Download ebook
     */
    /**
     * Download ebook
     */
    async downloadEbook(id: string) {
        return apiFetch<DownloadResponse>(`/user/ebooks/${id}/download`);
    }

    // ==========================================
    // Admin Methods
    // ==========================================

    /**
     * Get all ebooks (Admin)
     */
    async getAllEbooks() {
        return apiFetch<{ ebooks: Ebook[] }>('/admin/ebooks');
    }

    /**
     * Get all categories
     */
    async getAllCategories() {
        return apiFetch<{ categories: EbookCategory[] }>('/admin/ebook-categories');
    }

    /**
     * Create new ebook
     */
    async createEbook(data: any) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        return apiFetch('/admin/ebooks', {
            method: 'POST',
            body: formData,
            // Header is automatically set by browser for FormData
        });
    }

    /**
     * Create category
     */
    async createCategory(name: string) {
        return apiFetch('/admin/ebook-categories', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Delete category
     */
    async deleteCategory(id: string) {
        return apiFetch(`/admin/ebook-categories/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Update ebook
     */
    async updateEbook(id: string, data: any) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                 formData.append(key, data[key]);
            }
        });

        return apiFetch(`/admin/ebooks/${id}`, {
            method: 'PUT',
            body: formData,
        });
    }

    /**
     * Get ebook for admin (includes drafts)
     */
    async getAdminEbookById(id: string) {
        return apiFetch<{ ebook: Ebook }>(`/admin/ebooks/${id}`);
    }

    /**
     * Delete ebook
     */
    async deleteEbook(id: string) {
        return apiFetch(`/admin/ebooks/${id}`, {
            method: 'DELETE'
        });
    }
}

export const ebookService = new EbookService();

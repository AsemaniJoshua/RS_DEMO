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
    async downloadEbook(id: string) {
        return apiFetch<DownloadResponse>(`/user/ebooks/${id}/download`);
    }
}

export const ebookService = new EbookService();

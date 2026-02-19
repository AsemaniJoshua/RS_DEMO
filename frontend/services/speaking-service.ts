import { api } from "@/lib/api";

export interface SpeakingEvent {
    id: string;
    title: string;
    venue: string;
    category: string;
    date: string;
    location: string;
    image: string;
    imagePublicId: string;
    description?: string;
    status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
    updated_at: string;
}

export interface SpeakingEventFilters {
    category?: string;
    status?: string;
    search?: string;
}

export interface Category {
    id: string;
    name: string;
    count?: number;
    _count?: {
        events: number;
    };
}

export const speakingService = {
    // ... existing user methods ...
    async getSpeakingEvents(filters?: SpeakingEventFilters): Promise<SpeakingEvent[]> {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);

        const response: any = await api.get(`/user/speaking?${params.toString()}`);
        return response.events || response.data?.events || [];
    },

    async getSpeakingEventById(id: string): Promise<SpeakingEvent | undefined> {
        const response: any = await api.get(`/user/speaking/${id}`);
        return response.event || response.data?.event;
    },
    // ==========================================
    // Admin Methods
    // ==========================================

    async getAllEvents() {
        const response: any = await api.get('/admin/speaking');
        // Backend returns { success: true, events: [...] } directly
        return response.events || response.data?.events || [];
    },

    async getEventById(id: string) {
        const response: any = await api.get(`/admin/speaking/${id}`);
        // Backend returns { success: true, event: {...} } directly
        return response.event || response.data?.event;
    },


    async createEvent(data: FormData | Partial<SpeakingEvent>) {
        const response: any = await api.post('/admin/speaking', data);
        return response.event || response.data?.event || response.data || response;
    },

    async updateEvent(id: string, data: FormData | Partial<SpeakingEvent>) {
        const response: any = await api.put(`/admin/speaking/${id}`, data);
        return response.event || response.data?.event || response.data || response;
    },

    async deleteEvent(id: string) {
        const response: any = await api.delete(`/admin/speaking/${id}`);
        return response.data || response;
    },

    // ==========================================
    // Category Methods
    // ==========================================

    async getAllCategories() {
        const response: any = await api.get('/admin/speaking/categories');
        // Backend returns { success: true, categories: [...] } directly
        return response.categories || response.data?.categories || [];
    },

    async createCategory(name: string) {
        const response: any = await api.post('/admin/speaking/categories', { name });
        // Backend returns { success: true, categories: [...] } directly
        return response.categories || response.data?.categories || [];
    },

    async deleteCategory(id: string) {
        const response: any = await api.delete(`/admin/speaking/categories/${id}`);
        return response.data || response;
    }
};

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

        const response = await api.get<{ events: SpeakingEvent[] }>(`/user/speaking?${params.toString()}`);
        return response.data?.events || [];
    },

    async getSpeakingEventById(id: string): Promise<SpeakingEvent | undefined> {
        const response = await api.get<{ event: SpeakingEvent }>(`/user/speaking/${id}`);
        return response.data?.event;
    },
    // ==========================================
    // Admin Methods
    // ==========================================

    async getAllEvents() {
        const response = await api.get<{ events: SpeakingEvent[] }>('/admin/speaking');
        return response.data?.events || [];
    },

    async getEventById(id: string) {
        const response = await api.get<{ event: SpeakingEvent }>(`/admin/speaking/${id}`);
        return response.data?.event;
    },


    async createEvent(data: FormData | Partial<SpeakingEvent>) {
        const body = data instanceof FormData ? data : undefined;
        const response = await api.post('/admin/speaking', body || data);
        return response.data;
    },

    async updateEvent(id: string, data: FormData | Partial<SpeakingEvent>) {
        const body = data instanceof FormData ? data : undefined;
        const response = await api.put(`/admin/speaking/${id}`, body || data);
        return response.data;
    },

    async deleteEvent(id: string) {
        const response = await api.delete(`/admin/speaking/${id}`);
        return response.data;
    },

    // ==========================================
    // Category Methods
    // ==========================================

    async getAllCategories() {
        const response = await api.get<{ categories: Category[] }>('/admin/speaking/categories');
        return response.categories || [];
    },

    async createCategory(name: string) {
        const response = await api.post('/admin/speaking/categories', { name });
        return response.data;
    },

    async deleteCategory(id: string) {
        const response = await api.delete(`/admin/speaking/categories/${id}`);
        return response.data;
    }
};

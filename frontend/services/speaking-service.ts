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
    createdAt: string;
    updatedAt: string;
}

export interface SpeakingEventFilters {
    category?: string;
    status?: string;
    search?: string;
}

export const speakingService = {
    async getSpeakingEvents(filters?: SpeakingEventFilters): Promise<SpeakingEvent[]> {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get<{ events: SpeakingEvent[] }>(`/user/speaking?${params.toString()}`);
        return response.data?.events || [];
    },

    async getSpeakingEventById(id: string): Promise<SpeakingEvent> {
        const response = await api.get<{ event: SpeakingEvent }>(`/user/speaking/${id}`);
        return response.data?.event;
    }
};

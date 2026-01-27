import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

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

export interface CreateSpeakingEventData {
  title: string;
  venue: string;
  category: string;
  date: string;
  location: string;
  image: string;
  imagePublicId: string;
  description?: string;
  status?: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
}

export interface SpeakingEventFilters {
  category?: string;
  status?: string;
  search?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

class SpeakingService {
  private getAuthHeader() {
    const token = localStorage.getItem('auth_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // Get all speaking events with optional filters
  async getAllEvents(filters?: SpeakingEventFilters): Promise<SpeakingEvent[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await axios.get(
        `${API_BASE_URL}/admin/speaking?${params.toString()}`,
        this.getAuthHeader()
      );

      return response.data.events;
    } catch (error: any) {
      console.error('Error fetching speaking events:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch speaking events');
    }
  }

  // Get single speaking event by ID
  async getEventById(id: string): Promise<SpeakingEvent> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/speaking/${id}`,
        this.getAuthHeader()
      );

      return response.data.event;
    } catch (error: any) {
      console.error('Error fetching speaking event:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch speaking event');
    }
  }

  // Create new speaking event
  async createEvent(data: CreateSpeakingEventData): Promise<SpeakingEvent> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/speaking`,
        data,
        this.getAuthHeader()
      );

      return response.data.event;
    } catch (error: any) {
      console.error('Error creating speaking event:', error);
      throw new Error(error.response?.data?.message || 'Failed to create speaking event');
    }
  }

  // Update speaking event
  async updateEvent(id: string, data: CreateSpeakingEventData): Promise<SpeakingEvent> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/speaking/${id}`,
        data,
        this.getAuthHeader()
      );

      return response.data.event;
    } catch (error: any) {
      console.error('Error updating speaking event:', error);
      throw new Error(error.response?.data?.message || 'Failed to update speaking event');
    }
  }

  // Delete speaking event
  async deleteEvent(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/speaking/${id}`,
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error deleting speaking event:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete speaking event');
    }
  }

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/speaking/categories`,
        this.getAuthHeader()
      );

      return response.data.categories;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Create new category
  async createCategory(name: string): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/speaking/categories`,
        { name },
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error creating category:', error);
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/speaking/categories/${id}`,
        this.getAuthHeader()
      );
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
}

export const speakingService = new SpeakingService();

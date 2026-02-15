import { api, ApiResponse } from '@/lib/api';


// We can define minimal types here if generic types are not available globally
export interface CredentialCertification {
    id: string;
    title: string;
    institution: string;
    issueDate: string;
}

export interface AchievementAward {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
}


export interface AreaOfExpertise {
    id: string;
    name: string;
}

export interface Profile {
    fullName: string;
    professional_title?: string;
    tagline: string;
    email: string;
    phoneNumber: string;
    location: string;
    short_bio: string;
    full_bio: string;
    profile_image_url: string;
}

export interface SocialMedia {
    linkedin?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
}

export interface PublicPersonalBrand {
    profile?: Profile;
    socialMedia?: SocialMedia;
    areasOfExpertise: AreaOfExpertise[];
    credentialCertifications: CredentialCertification[];
    achievementAwards: AchievementAward[];
}

export interface PublicMedia {
    id: string;
    name: string;
    original_name: string;
    file_type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    mime_type: string;
    url: string;
    cloudinary_id: string;
    description: string | null;
    duration?: string | null;
    dimensions?: string | null;
    created_at: string;
}

export interface PublicEbook {
    id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    pages: number;
    coverImage: string;
    category: {
        id: string;
        name: string;
    };
    status: 'DRAFT' | 'PUBLISHED';
}

export interface PublicCourse {
    id: string;
    title: string;
    description: string;
    price: string | number;
    thumbnailUrl?: string;
    status: 'DRAFT' | 'PUBLISHED';
    category?: {
        id: string;
        name: string;
    };
    duration?: string;
}

export interface PublicBlog {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    slug?: string;
    featured_image?: string;
    reading_time?: string;
    status: 'DRAFT' | 'PUBLISHED';
    published_at: string;
    created_at: string;
    author: {
        id: string;
        first_name: string;
        last_name: string;
    };
    categories: Array<{
        id: string;
        name: string;
    }>;
    tags: Array<{
        id: string;
        name: string;
    }>;
}

export interface PublicSpeaking {
    id: string;
    title: string;
    venue: string;
    category: string;
    date: string;
    location: string;
    image?: string;
    description?: string;
    status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
    created_at: string;
}

export const publicService = {
    /**
     * Get public personal brand data
     * GET /api/v1/public/personal-brand
     */
    async getPersonalBrand(): Promise<ApiResponse<PublicPersonalBrand>> {
        return api.get<PublicPersonalBrand>('/public/personal-brand');
    },

    /**
     * Get public media (featured content)
     * GET /api/v1/public/media
     */
    async getFeaturedMedia(): Promise<ApiResponse<{ media: PublicMedia[] }>> {
        // We can request a limit if backend supports it, backend defaults to 20 which is fine, we slice 3 on frontend
        return api.get<{ media: PublicMedia[] }>('/public/media?limit=3');
    },

    /**
     * Get all public media with optional type filter
     * GET /api/v1/public/media
     */
    async getAllMedia(fileType?: string): Promise<ApiResponse<{ media: PublicMedia[] }>> {
        const params = new URLSearchParams();
        if (fileType && fileType !== 'All') {
            params.append('file_type', fileType.toUpperCase());
        }
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return api.get<{ media: PublicMedia[] }>(`/public/media${queryString}`);
    },

    /**
     * Get public ebooks (limited to 6 for products page)
     * GET /api/v1/public/ebooks
     */
    async getPublicEbooks(limit: number = 6): Promise<ApiResponse<PublicEbook[]>> {
        return api.get<PublicEbook[]>(`/public/ebooks?status=PUBLISHED&limit=${limit}`);
    },

    /**
     * Get single public ebook by ID
     * GET /api/v1/public/ebooks/:id
     */
    async getPublicEbookById(id: string): Promise<ApiResponse<PublicEbook>> {
        return api.get<PublicEbook>(`/public/ebooks/${id}`);
    },

    /**
     * Get public courses (limited to 6 for products page)
     * GET /api/v1/public/courses
     */
    async getPublicCourses(limit: number = 6): Promise<ApiResponse<PublicCourse[]>> {
        return api.get<PublicCourse[]>(`/public/courses?status=PUBLISHED&limit=${limit}`);
    },

    /**
     * Get single public course by ID
     * GET /api/v1/public/courses/:id
     */
    async getPublicCourseById(id: string): Promise<ApiResponse<PublicCourse>> {
        return api.get<PublicCourse>(`/public/courses/${id}`);
    },

    /**
     * Get public blog posts
     * GET /api/v1/public/blog
     */
    async getPublicBlogs(category?: string, search?: string): Promise<ApiResponse<{ blogs: PublicBlog[] }>> {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.append('category', category);
        if (search) params.append('search', search);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return api.get<{ blogs: PublicBlog[] }>(`/public/blog${queryString}`);
    },

    /**
     * Get single public blog by ID
     * GET /api/v1/public/blog/:id
     */
    async getPublicBlogById(id: string): Promise<ApiResponse<PublicBlog>> {
        return api.get<PublicBlog>(`/public/blog/${id}`);
    },

    /**
     * Get blog categories
     * GET /api/v1/public/blog-categories
     */
    async getBlogCategories(): Promise<ApiResponse<string[]>> {
        return api.get<string[]>('/public/blog-categories');
    },

    /**
     * Subscribe to newsletter
     * POST /api/v1/public/subscribe
     */
    async subscribeToNewsletter(email: string): Promise<ApiResponse<{ message: string }>> {
        return api.post<{ message: string }>('/public/subscribe', { email });
    },

    /**
     * Unsubscribe from newsletter
     * POST /api/v1/public/unsubscribe
     */
    async unsubscribeFromNewsletter(email: string): Promise<ApiResponse<{ message: string }>> {
        return api.post<{ message: string }>('/public/unsubscribe', { email });
    },

    /**
     * Get public speaking events
     * GET /api/v1/public/speaking
     */
    async getSpeakingEvents(category?: string, search?: string, status?: string): Promise<ApiResponse<{ events: PublicSpeaking[] }>> {
        const params = new URLSearchParams();
        if (category && category !== 'All Categories') params.append('category', category);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return api.get<{ events: PublicSpeaking[] }>(`/public/speaking${queryString}`);
    },

    /**
     * Get single speaking event by ID
     * GET /api/v1/public/speaking/:id
     */
    async getSpeakingEventById(id: string): Promise<ApiResponse<{ event: PublicSpeaking }>> {
        return api.get<{ event: PublicSpeaking }>(`/public/speaking/${id}`);
    },

    /**
     * Get speaking event categories
     * GET /api/v1/public/speaking-categories
     */
    async getSpeakingCategories(): Promise<ApiResponse<{ categories: Array<{ id: string; name: string }> }>> {
        return api.get<{ categories: Array<{ id: string; name: string }> }>('/public/speaking-categories');
    },

    /**
     * Submit contact form
     * POST /api/v1/public/contact
     */
    async submitContactForm(data: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<ApiResponse<{ message: string }>> {
        return api.post<{ message: string }>('/public/contact', data);
    }
};


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
     * Get public ebooks (limited to 6 for products page)
     * GET /api/v1/public/ebooks
     */
    async getPublicEbooks(limit: number = 6): Promise<ApiResponse<PublicEbook[]>> {
        return api.get<PublicEbook[]>(`/public/ebooks?status=PUBLISHED&limit=${limit}`);
    },

    /**
     * Get public courses (limited to 6 for products page)
     * GET /api/v1/public/courses
     */
    async getPublicCourses(limit: number = 6): Promise<ApiResponse<PublicCourse[]>> {
        return api.get<PublicCourse[]>(`/public/courses?status=PUBLISHED&limit=${limit}`);
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
    }
};


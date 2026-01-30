import { api } from "@/lib/api";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    featured_image_public_id: string;
    status: 'DRAFT' | 'PUBLISHED';
    published_at: string;
    author: {
        id: string;
        first_name: string;
        last_name: string;
    };
    categories: {
        id: string;
        name: string;
        slug: string;
    }[];
    tags: {
        id: string;
        name: string;
    }[];
    created_at: string;
    updated_at: string;
}

export interface BlogFilters {
    category?: string;
    search?: string;
}

export const userBlogService = {
    async getBlogs(filters?: BlogFilters): Promise<BlogPost[]> {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.search) params.append('search', filters.search);

        const response = await api.get<{ blogs: BlogPost[] }>(`/user/blog?${params.toString()}`);
        return response.data?.blogs || [];
    },

    async getBlogById(id: string): Promise<BlogPost> {
        const response = await api.get<{ blog: BlogPost }>(`/user/blog/${id}`);
        return response.data?.blog;
    }
};

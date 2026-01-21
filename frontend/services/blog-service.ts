import { api, ApiResponse } from '@/lib/api';

// Blog interfaces
export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface BlogTag {
    id: string;
    name: string;
    created_at: string;
}

export interface BlogAuthor {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    published_at?: string;
    author_id: string;
    created_at: string;
    updated_at: string;
    meta_title?: string;
    meta_description?: string;
    author?: BlogAuthor;
    categories?: BlogCategory[];
    tags?: BlogTag[];
}

export interface BlogPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface CreateBlogData {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    meta_title?: string;
    meta_description?: string;
    categories?: { name: string; slug: string }[];
    tags?: { name: string }[];
}

export interface UpdateBlogData extends Partial<CreateBlogData> {}

// Blog Service
export const blogService = {
    /**
     * Get all blogs (with pagination and filtering)
     * GET /api/v1/admin/blog
     */
    async getAllBlogs(params?: {
        page?: number;
        limit?: number;
        status?: string;
        author_id?: string;
        search?: string;
    }): Promise<ApiResponse<{ blogs: Blog[]; pagination: BlogPagination }>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.author_id) queryParams.append('author_id', params.author_id);
        if (params?.search) queryParams.append('search', params.search);

        const endpoint = `/admin/blog${queryParams.toString() ? `?${queryParams}` : ''}`;
        return api.get<{ blogs: Blog[]; pagination: BlogPagination }>(endpoint);
    },

    /**
     * Get single blog by ID
     * GET /api/v1/admin/blog/:id
     */
    async getBlogById(id: string): Promise<ApiResponse<Blog>> {
        return api.get<Blog>(`/admin/blog/${id}`);
    },

    /**
     * Create new blog
     * POST /api/v1/admin/blog
     */
    async createBlog(data: CreateBlogData): Promise<ApiResponse<Blog>> {
        return api.post<Blog>('/admin/blog', data);
    },

    /**
     * Update blog
     * PUT /api/v1/admin/blog/:id
     */
    async updateBlog(id: string, data: UpdateBlogData): Promise<ApiResponse<Blog>> {
        return api.patch<Blog>(`/admin/blog/${id}`, data);
    },

    /**
     * Delete blog
     * DELETE /api/v1/admin/blog/:id
     */
    async deleteBlog(id: string): Promise<ApiResponse<any>> {
        return api.delete<any>(`/admin/blog/${id}`);
    },

    /**
     * Publish blog
     * PATCH /api/v1/admin/blog/:id/publish
     */
    async publishBlog(id: string): Promise<ApiResponse<Blog>> {
        return api.patch<Blog>(`/admin/blog/${id}/publish`, {});
    },

    /**
     * Unpublish blog (set to draft)
     * PATCH /api/v1/admin/blog/:id/unpublish
     */
    async unpublishBlog(id: string): Promise<ApiResponse<Blog>> {
        return api.patch<Blog>(`/admin/blog/${id}/unpublish`, {});
    },
};

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
    status: 'DRAFT' | 'PUBLISHED';
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
    status?: 'DRAFT' | 'PUBLISHED';
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
    async createBlog(data: CreateBlogData & { imageFile?: File }): Promise<ApiResponse<Blog>> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'imageFile' && data.imageFile) {
                formData.append('image', data.imageFile);
            } else if (key === 'categories' || key === 'tags') {
                formData.append(key, JSON.stringify((data as any)[key]));
            } else if (data[key as keyof CreateBlogData] !== undefined && data[key as keyof CreateBlogData] !== null) {
                formData.append(key, String(data[key as keyof CreateBlogData]));
            }
        });

        return api.post<Blog>('/admin/blog', formData);
    },

    /**
     * Update blog
     * PUT /api/v1/admin/blog/:id
     */
    async updateBlog(id: string, data: UpdateBlogData & { imageFile?: File }): Promise<ApiResponse<Blog>> {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'imageFile' && data.imageFile) {
                formData.append('image', data.imageFile);
            } else if (key === 'categories' || key === 'tags') {
                formData.append(key, JSON.stringify((data as any)[key]));
            } else if (data[key as keyof UpdateBlogData] !== undefined && data[key as keyof UpdateBlogData] !== null) {
                formData.append(key, String(data[key as keyof UpdateBlogData]));
            }
        });

        return api.put<Blog>(`/admin/blog/${id}`, formData);
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

    /**
     * Get all categories
     * GET /api/v1/admin/blog/categories
     */
    async getAllCategories(): Promise<ApiResponse<string[]>> {
        return api.get<string[]>('/admin/blog/categories');
    },

    /**
     * Get all tags
     * GET /api/v1/admin/blog/tags
     */
    async getAllTags(): Promise<ApiResponse<string[]>> {
        return api.get<string[]>('/admin/blog/tags');
    },

    /**
     * Upload blog image
     * POST /api/v1/admin/blog/upload-image
     */
    async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
        const formData = new FormData();
        formData.append('image', file);
        
        // We need to handle multipart/form-data manually if api wrapper doesn't support it directly
        // Assuming api wrapper handles headers correctly or we might need a specific call
        // For now using api.post but looking at how axios handles FormData
        return api.post<{ url: string }>('/admin/blog/upload-image', formData);
    },
};

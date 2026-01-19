import { api, ApiResponse } from '@/lib/api';

// User type based on API docs
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    role: 'ADMIN' | 'PATIENT' | 'EDITOR';
    account_status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    created_at: string;
    updated_at: string;
}

export interface UserStats {
    total: number;
    byStatus: {
        active: number;
        suspended: number;
    };
    byRole: {
        admin: number;
        editor: number;
        patient: number;
    };
}
export interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    role: string;
    password: string;
    confirmedPassword: string;
    account_status: string;
}

export interface UpdateUserData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    account_status?: string;
    password?: string;
}

// Admin Users Service
export const usersService = {
    /**
     * Get all users (Admin only)
     * GET /api/v1/admin/users/get-all-users
     */
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        return api.get<User[]>('/admin/users/get-all-users');
    },

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<ApiResponse<UserStats>> {
        return api.get<UserStats>('/admin/users/stats');
    },

    /**
     * Create a new user (Admin only)
     * POST /api/v1/admin/users/create-user
     */
    async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
        return api.post<User>('/admin/users/create-user', data);
    },

    /**
     * Update user by ID (Admin only)
     * PATCH /api/v1/admin/users/update-user-by-id/:id
     */
    async updateUserById(id: string, data: UpdateUserData): Promise<ApiResponse<User>> {
        return api.patch<User>(`/admin/users/update-user-by-id/${id}`, data);
    },

    /**
     * Update user by email (Admin only)
     * PATCH /api/v1/admin/users/update-user-by-email/:email
     */
    async updateUserByEmail(email: string, data: UpdateUserData): Promise<ApiResponse<User>> {
        return api.patch<User>(`/admin/users/update-user-by-email/${encodeURIComponent(email)}`, data);
    },

    /**
     * Delete user by ID (Admin only)
     * DELETE /api/v1/admin/users/delete-user-by-id/:id
     */
    async deleteUserById(id: string): Promise<ApiResponse<User>> {
        return api.delete<User>(`/admin/users/delete-user-by-id/${id}`);
    },
};

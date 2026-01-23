import { api, setAuthToken, removeAuthToken, ApiResponse } from '@/lib/api';

// User type based on API docs
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    role: string;
    account_status?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface LoginResponse {
    status: 'success';
    message: string;
    token: string;
    data: User;
}

// Auth Service
export const authService = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post<User>('/auth/login', credentials);
        
        if (response.token) {
            setAuthToken(response.token);
            // Store user data
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
        }
        
        return response as LoginResponse;
    },

    /**
     * Register a new user
     */
    async signup(data: SignupData): Promise<ApiResponse<User>> {
        return api.post<User>('/auth/signup', data);
    },

    /**
     * Logout user and clear tokens
     */
    logout(): void {
        removeAuthToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr) as User;
        } catch {
            return null;
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('auth_token');
    },

    /**
     * Check if user has a specific role
     */
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.role?.toUpperCase() === role.toUpperCase();
    },

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.hasRole('ADMIN');
    },

    /**
     * Request OTP for password reset
     */
    async requestOTP(email: string): Promise<ApiResponse<any>> {
        return api.post('/auth/request-otp', { email });
    },

    /**
     * Verify OTP
     */
    async verifyOTP(email: string, otp: string): Promise<ApiResponse<any>> {
        return api.post('/auth/verify-otp', { email, otp });
    },

    /**
     * Reset Password
     */
    async resetPassword(data: any): Promise<ApiResponse<any>> {
        return api.post('/auth/reset-password', data);
    },
};

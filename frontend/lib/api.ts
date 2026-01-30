// API Client Configuration

// Use localhost for API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = unknown> {
    status: 'success' | 'error';
    message: string;
    data?: T;
    token?: string;
    statusCode?: number; 
}

export interface ApiError {
    status: 'error';
    message: string;
    statusCode: number;
}

// Get token from localStorage (client-side only)
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}

// Set token in localStorage and Cookie
export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        // Set cookie for middleware access (expires in 7 days)
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
}

// Remove token from localStorage and Cookie
export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        // Remove cookie
        document.cookie = 'auth_token=; path=/; max-age=0';
    }
}

// Generic fetch wrapper with auth headers
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();
    
    // Determine headers
    const headers: HeadersInit = {
        ...options.headers,
    };

    // Only set Content-Type to json if body is NOT FormData
    if (!(options.body instanceof FormData)) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    // Only add Authorization header if token is valid
    if (token && token !== 'undefined' && token !== 'null' && token.trim() !== '') {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
        throw {
            status: 'error',
            message: data.message || 'An error occurred',
            statusCode: response.status,
        } as ApiError;
    }

    return data;
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
    
    post: <T>(endpoint: string, body: unknown) => 
        apiFetch<T>(endpoint, { 
            method: 'POST', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),
    
    put: <T>(endpoint: string, body: unknown) => 
        apiFetch<T>(endpoint, { 
            method: 'PUT', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),

    patch: <T>(endpoint: string, body: unknown) => 
        apiFetch<T>(endpoint, { 
            method: 'PATCH', 
            body: body instanceof FormData ? body : JSON.stringify(body) 
        }),
    
    delete: <T>(endpoint: string) => 
        apiFetch<T>(endpoint, { method: 'DELETE' }),
};

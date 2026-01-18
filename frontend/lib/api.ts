// API Client Configuration

// Try localhost first, fallback to Render if not available
const LOCALHOST_API = 'http://localhost:3000/api/v1';
const PRODUCTION_API = 'https://dr-george-backend.onrender.com/api/v1';

// Check if we should use localhost (development environment)
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      process.env.NEXT_PUBLIC_USE_LOCALHOST === 'true';

// Use environment variable if set, otherwise use smart fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
                     (isDevelopment ? LOCALHOST_API : PRODUCTION_API);

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

// Set token in localStorage
export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
}

// Remove token from localStorage
export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
    }
}

// Generic fetch wrapper with auth headers
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getAuthToken();
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // Helper function to make the actual fetch
    const makeRequest = async (baseUrl: string): Promise<ApiResponse<T>> => {
        const response = await fetch(`${baseUrl}${endpoint}`, {
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
    };

    try {
        // Try primary URL (localhost in dev, production otherwise)
        return await makeRequest(API_BASE_URL);
    } catch (error) {
        // If using localhost and it fails, automatically try production as fallback
        if (isDevelopment && API_BASE_URL === LOCALHOST_API) {
            console.warn('Localhost API failed, falling back to production:', error);
            try {
                return await makeRequest(PRODUCTION_API);
            } catch (fallbackError) {
                // Both failed, throw the fallback error
                if ((fallbackError as ApiError).status === 'error') {
                    throw fallbackError;
                }
                throw {
                    status: 'error',
                    message: 'Network error. Please try again.',
                    statusCode: 500,
                } as ApiError;
            }
        }
        
        // Not using localhost or other error, handle normally
        if ((error as ApiError).status === 'error') {
            throw error;
        }
        throw {
            status: 'error',
            message: 'Network error. Please try again.',
            statusCode: 500,
        } as ApiError;
    }
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
    
    post: <T>(endpoint: string, body: unknown) => 
        apiFetch<T>(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(body) 
        }),
    
    patch: <T>(endpoint: string, body: unknown) => 
        apiFetch<T>(endpoint, { 
            method: 'PATCH', 
            body: JSON.stringify(body) 
        }),
    
    delete: <T>(endpoint: string) => 
        apiFetch<T>(endpoint, { method: 'DELETE' }),
};

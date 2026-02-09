import { apiFetch } from '@/lib/api';

// ============================================
// TypeScript Interfaces
// ============================================

export type SessionStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface LiveSession {
    id: string;
    title: string;
    description: string | null;
    scheduled_date: string;
    duration_minutes: number;
    meeting_link: string | null;
    recording_url: string | null;
    recording_price: number | null;
    thumbnail_url: string | null;
    status: SessionStatus;
    max_participants: number | null;
    created_by_id: string;
    created_at: string;
    updated_at: string;
    
    // Relations
    createdBy?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        role?: string;
    };
    registrations?: SessionRegistration[];
    _count?: {
        registrations: number;
        recordingPurchases: number;
    };
    
    // Computed fields for user view
    registration_count?: number;
    is_registered?: boolean;
    is_full?: boolean;
    is_past?: boolean;
    user_attended?: boolean;
    has_purchased_recording?: boolean;
}

export interface SessionRegistration {
    id: string;
    session_id: string;
    user_id: string;
    registration_date: string;
    attended: boolean;
    reminder_24h_sent: boolean;
    reminder_1h_sent: boolean;
    created_at: string;
    
    // Relations
    session?: LiveSession;
    user?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phoneNumber: string;
    };
}

export interface RecordingPurchase {
    id: string;
    session_id: string;
    user_id: string;
    amount: number;
    payment_reference: string;
    payment_status: PaymentStatus;
    purchased_at: string;
}

export interface CreateSessionData {
    title: string;
    description?: string;
    scheduled_date: string;
    duration_minutes?: number;
    meeting_link?: string;
    recording_price?: number;
    max_participants?: number;
}

export interface UpdateSessionData {
    title?: string;
    description?: string;
    scheduled_date?: string;
    duration_minutes?: number;
    meeting_link?: string;
    recording_price?: number;
    max_participants?: number;
}

export interface PaginatedResponse<T> {
    sessions: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface RecordingAccessResponse {
    hasAccess: boolean;
    recording_url: string | null;
    needsPurchase: boolean;
    price: number | null;
    reason: string | null;
    message?: string;
}

export interface PaystackInitResponse {
    authorization_url: string;
    reference: string;
    access_code: string;
}

// ============================================
// Admin API Functions
// ============================================

class LiveSessionsService {
    /**
     * Get all live sessions (Admin)
     * GET /admin/live-sessions
     */
    async getAllSessions(params?: {
        status?: SessionStatus;
        page?: number;
        limit?: number;
        sort?: string;
    }) {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.sort) queryParams.append('sort', params.sort);

        const query = queryParams.toString();
        const endpoint = `/admin/live-sessions${query ? `?${query}` : ''}`;
        
        return apiFetch<PaginatedResponse<LiveSession>>(endpoint);
    }

    /**
     * Get single session by ID (Admin)
     * GET /admin/live-sessions/:id
     */
    async getSessionById(id: string) {
        return apiFetch<LiveSession>(`/admin/live-sessions/${id}`);
    }

    /**
     * Create new live session (Admin)
     * POST /admin/live-sessions
     */
    async createSession(data: CreateSessionData) {
        return apiFetch<LiveSession>('/admin/live-sessions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update live session (Admin)
     * PATCH /admin/live-sessions/:id
     */
    async updateSession(id: string, data: UpdateSessionData) {
        return apiFetch<LiveSession>(`/admin/live-sessions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete live session (Admin)
     * DELETE /admin/live-sessions/:id
     */
    async deleteSession(id: string) {
        return apiFetch<{ message: string }>(`/admin/live-sessions/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Update session status (Admin)
     * PATCH /admin/live-sessions/:id/status
     */
    async updateSessionStatus(id: string, status: SessionStatus) {
        return apiFetch<LiveSession>(`/admin/live-sessions/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }

    /**
     * Add recording to session (Admin)
     * POST /admin/live-sessions/:id/recording
     */
    async addRecording(id: string, recording_url: string, recording_price?: number) {
        return apiFetch<LiveSession>(`/admin/live-sessions/${id}/recording`, {
            method: 'POST',
            body: JSON.stringify({ recording_url, recording_price })
        });
    }

    /**
     * Get session registrations (Admin)
     * GET /admin/live-sessions/:id/registrations
     */
    async getSessionRegistrations(id: string) {
        return apiFetch<{ registrations: SessionRegistration[]; count: number }>(
            `/admin/live-sessions/${id}/registrations`
        );
    }

    /**
     * Mark attendance (Admin)
     * PATCH /admin/live-sessions/:sessionId/registrations/:registrationId/attendance
     */
    async markAttendance(sessionId: string, registrationId: string, attended: boolean) {
        return apiFetch<SessionRegistration>(
            `/admin/live-sessions/${sessionId}/registrations/${registrationId}/attendance`,
            {
                method: 'PATCH',
                body: JSON.stringify({ attended })
            }
        );
    }

    // ============================================
    // User API Functions
    // ============================================

    /**
     * Get public sessions (User)
     * GET /live-sessions
     */
    async getPublicSessions() {
        return apiFetch<LiveSession[]>('/live-sessions');
    }

    /**
     * Get single public session (User)
     * GET /live-sessions/:id
     */
    async getPublicSessionById(id: string) {
        return apiFetch<LiveSession>(`/live-sessions/${id}`);
    }

    /**
     * Register for session (User - PATIENT)
     * POST /live-sessions/:id/register
     */
    async registerForSession(id: string) {
        return apiFetch<SessionRegistration>(`/live-sessions/${id}/register`, {
            method: 'POST'
        });
    }

    /**
     * Cancel registration (User - PATIENT)
     * DELETE /live-sessions/:id/register
     */
    async cancelRegistration(id: string) {
        return apiFetch<{ message: string }>(`/live-sessions/${id}/register`, {
            method: 'DELETE'
        });
    }

    /**
     * Check recording access (User - PATIENT)
     * GET /live-sessions/:id/recording-access
     */
    async checkRecordingAccess(id: string) {
        return apiFetch<RecordingAccessResponse>(`/live-sessions/${id}/recording-access`);
    }

    /**
     * Purchase recording (User - PATIENT)
     * POST /live-sessions/:id/purchase-recording
     */
    async purchaseRecording(id: string, callback_url?: string) {
        return apiFetch<PaystackInitResponse>(`/live-sessions/${id}/purchase-recording`, {
            method: 'POST',
            body: JSON.stringify({ callback_url })
        });
    }

    /**
     * Verify recording purchase (User - PATIENT)
     * GET /live-sessions/recording-purchase/verify/:reference
     */
    async verifyRecordingPurchase(reference: string) {
        return apiFetch<{ recording_url: string; session_title: string }>(
            `/live-sessions/recording-purchase/verify/${reference}`
        );
    }

    /**
     * Get user's registered sessions (User - PATIENT)
     * GET /live-sessions/my/sessions
     */
    async getMySessions() {
        return apiFetch<SessionRegistration[]>('/live-sessions/my/sessions');
    }
}

// Export singleton instance
export const liveSessionsService = new LiveSessionsService();

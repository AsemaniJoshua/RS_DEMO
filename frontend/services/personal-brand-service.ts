// Personal Brand Service
// Handles all API calls for personal brand management

import { api } from '../lib/api';

// ========================
// TypeScript Interfaces
// ========================

export interface PersonalBrand {
    id: string;
    created_at: string;
    updated_at: string;
    profile?: Profile;
    socialMedia?: SocialMedia;
    credentialCertifications?: CredentialCertification[];
    areasOfExpertise?: AreaOfExpertise[];
    achievementAwards?: AchievementAward[];
}

export interface Profile {
    id: string;
    profile_image_url?: string;
    fullName: string;
    professional_title?: string;
    tagline: string;
    email: string;
    phoneNumber: string;
    location: string;
    short_bio: string;
    full_bio: string;
    personal_brand_id: string;
    created_at: string;
    updated_at: string;
}

export interface SocialMedia {
    id: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    personal_brand_id: string;
    created_at: string;
    updated_at: string;
}

export interface CredentialCertification {
    id: string;
    title: string;
    institution: string;
    issueDate: string;
    personal_brand_id: string;
    created_at: string;
    updated_at: string;
}

export interface AreaOfExpertise {
    id: string;
    name: string;
    personal_brand_id: string;
    created_at: string;
    updated_at: string;
}

export interface AchievementAward {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    personal_brand_id: string;
    created_at: string;
    updated_at: string;
}

// Request/Response Types
export interface CreateCredentialData {
    title: string;
    institution: string;
    issueDate: string;
}

export interface CreateExpertiseData {
    name: string;
}

export interface CreateAchievementData {
    title: string;
    issuer: string;
    issueDate: string;
}

export interface UpdateProfileData {
    fullName: string;
    professional_title?: string;
    tagline: string;
    email: string;
    phoneNumber: string;
    location: string;
    short_bio: string;
    full_bio: string;
}

export interface UpdateSocialMediaData {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
}

// ========================
// Service Functions
// ========================

export const personalBrandService = {
    /**
     * Create Personal Brand (One-time)
     * POST /admin/personal-brand/create
     */
    async createPersonalBrand() {
        return api.post<PersonalBrand>('/admin/personal-brand/create', {});
    },

    /**
     * Get Personal Brand with all relations
     * GET /admin/personal-brand
     */
    async getPersonalBrand() {
        return api.get<PersonalBrand>('/admin/personal-brand');
    },

    // ==================
    // Profile Section
    // ==================

    /**
     * Update Profile with optional image
     * PATCH /admin/personal-brand/profile
     */
    async updateProfile(data: UpdateProfileData, profileImage?: File) {
        // Use FormData for file uploads
        const formData = new FormData();
        
        // Append all profile fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        // Append image if provided
        if (profileImage) {
            formData.append('profile_image', profileImage);
        }

        // Use fetch directly for multipart/form-data
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/admin/personal-brand/profile`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        return result;
    },

    // ==================
    // Social Media Section
    // ==================

    /**
     * Update Social Media
     * PATCH /admin/personal-brand/social-media
     */
    async updateSocialMedia(data: UpdateSocialMediaData) {
        return api.patch<SocialMedia>('/admin/personal-brand/social-media', data);
    },

    // ==================
    // Credentials Section
    // ==================

    /**
     * Create Credential
     * POST /admin/personal-brand/credentials
     */
    async createCredential(data: CreateCredentialData) {
        return api.post<CredentialCertification>('/admin/personal-brand/credentials', data);
    },

    /**
     * Update Credential
     * PATCH /admin/personal-brand/credentials/:id
     */
    async updateCredential(id: string, data: CreateCredentialData) {
        return api.patch<CredentialCertification>(`/admin/personal-brand/credentials/${id}`, data);
    },

    /**
     * Delete Credential
     * DELETE /admin/personal-brand/credentials/:id
     */
    async deleteCredential(id: string) {
        return api.delete<void>(`/admin/personal-brand/credentials/${id}`);
    },

    // ==================
    // Expertise Section
    // ==================

    /**
     * Create Expertise
     * POST /admin/personal-brand/expertise
     */
    async createExpertise(data: CreateExpertiseData) {
        return api.post<AreaOfExpertise>('/admin/personal-brand/expertise', data);
    },

    /**
     * Update Expertise
     * PATCH /admin/personal-brand/expertise/:id
     */
    async updateExpertise(id: string, data: CreateExpertiseData) {
        return api.patch<AreaOfExpertise>(`/admin/personal-brand/expertise/${id}`, data);
    },

    /**
     * Delete Expertise
     * DELETE /admin/personal-brand/expertise/:id
     */
    async deleteExpertise(id: string) {
        return api.delete<void>(`/admin/personal-brand/expertise/${id}`);
    },

    // ==================
    // Achievements Section
    // ==================

    /**
     * Create Achievement
     * POST /admin/personal-brand/achievements
     */
    async createAchievement(data: CreateAchievementData) {
        return api.post<AchievementAward>('/admin/personal-brand/achievements', data);
    },

    /**
     * Update Achievement
     * PATCH /admin/personal-brand/achievements/:id
     */
    async updateAchievement(id: string, data: CreateAchievementData) {
        return api.patch<AchievementAward>(`/admin/personal-brand/achievements/${id}`, data);
    },

    /**
     * Delete Achievement
     * DELETE /admin/personal-brand/achievements/:id
     */
    async deleteAchievement(id: string) {
        return api.delete<void>(`/admin/personal-brand/achievements/${id}`);
    }
};

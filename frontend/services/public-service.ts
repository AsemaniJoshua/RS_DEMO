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
    full_bio: string;
    profile_image_url: string;
}

export interface PublicPersonalBrand {
    profile?: Profile;
    areasOfExpertise: AreaOfExpertise[];
    credentialCertifications: CredentialCertification[];
    achievementAwards: AchievementAward[];
}

export interface PublicMedia {
    id: string;
    name: string;
    file_type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    url: string;
    cloudinary_id: string;
    created_at: string;
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
    }
};

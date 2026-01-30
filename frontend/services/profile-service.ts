
import { api } from "@/lib/api";

export interface UserProfile {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phoneNumber: string;
    joinedDate: string;
    subscription: string;
    stats: {
        coursesEnrolled: number;
        upcomingAppointments: number;
        totalLearningHours: number;
    };
}

export const profileService = {
    async getProfile(): Promise<UserProfile> {
        const response = await api.get<{ user: UserProfile }>('/user/profile');
        return response.data?.user as UserProfile;
    },

    async updateProfile(data: { 
        first_name?: string; 
        last_name?: string; 
        phoneNumber?: string;
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }): Promise<any> {
        return await api.put('/user/profile', data);
    }
};

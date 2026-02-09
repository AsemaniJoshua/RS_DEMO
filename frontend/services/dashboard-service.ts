import { api } from "@/lib/api";


export const dashboardService = {
    async getStats() {
        try {
            const response = await api.get("/admin/dashboard/stats");
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },
    async fetchUserDashboard() {
        try {
            const response = await api.get("/user/dashboard");
            // If backend wraps data in { data: { ... } }, unwrap it
            if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object') {
                return response.data;
            }
            return response;
        } catch (error) {
            console.error("Error fetching user dashboard:", error);
            throw error;
        }
    }
};

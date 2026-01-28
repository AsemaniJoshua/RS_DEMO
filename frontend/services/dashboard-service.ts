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
    }
};

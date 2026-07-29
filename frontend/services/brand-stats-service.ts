// Service to manage customizable brand statistics for Hero & About sections

export interface BrandStats {
    happyPatients: string;
    yearsExperience: string;
    resources: string;
    expertTopics: string;
    speakingEventsOverride?: string;
}

export const DEFAULT_BRAND_STATS: BrandStats = {
    happyPatients: "10K+",
    yearsExperience: "15+",
    resources: "500+",
    expertTopics: "50+",
    speakingEventsOverride: ""
};

export const brandStatsService = {
    getStats(): BrandStats {
        if (typeof window === 'undefined') return DEFAULT_BRAND_STATS;
        try {
            const saved = localStorage.getItem('dr_george_brand_stats');
            if (saved) {
                return { ...DEFAULT_BRAND_STATS, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load brand stats', e);
        }
        return DEFAULT_BRAND_STATS;
    },

    saveStats(stats: BrandStats): void {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem('dr_george_brand_stats', JSON.stringify(stats));
            window.dispatchEvent(new Event('brand_stats_updated'));
        } catch (e) {
            console.error('Failed to save brand stats', e);
        }
    }
};

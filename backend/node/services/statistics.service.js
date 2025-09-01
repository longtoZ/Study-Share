import Statistics from "../models/statistics.model.js";

class StatisticsService {
    static async getGeneralStats() {
        try {
            const totalMaterials = await Statistics.getTotalMaterials();
            const totalLessons = await Statistics.getTotalLessons();
            const totalUsers = await Statistics.getTotalUsers();
            const totalDownloads = await Statistics.getTotalDownloads();

            return {
                totalMaterials,
                totalLessons,
                totalUsers,
                totalDownloads
            };
        } catch (error) {
            throw new Error('Failed to fetch general statistics');
        }
    }

    static async getTopMaterials(from, to) {
        try {
            const mostViewed = await Statistics.getMostViewedMaterials(from, to);
            const mostDownloaded = await Statistics.getMostDownloadedMaterials(from, to);

            return {
                mostViewed,
                mostDownloaded
            };
        } catch (error) {
            throw new Error('Failed to fetch top materials', error);
        }
    }
};

export default StatisticsService
import Statistics from "../models/statistics.model.js";
import redisClient from "../config/redis.config.js";
import { REDIS_TTL } from "../constants/constant.js";

class StatisticsService {
    static async getGeneralStats() {
        // Check Redis cache first
        const cachedStats = await redisClient.get("generalStats");
        if (cachedStats) {
            console.log("General statistics fetched from cache");
            return JSON.parse(cachedStats);
        }

        try {
            const totalMaterials = await Statistics.getTotalMaterials();
            const totalLessons = await Statistics.getTotalLessons();
            const totalUsers = await Statistics.getTotalUsers();
            const totalDownloads = await Statistics.getTotalDownloads();

            // Cache the statistics in Redis for future requests
            await redisClient.setEx("generalStats", REDIS_TTL, JSON.stringify({ 
                totalMaterials,
                totalLessons,
                totalUsers,
                totalDownloads
            }));

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
        // Check Redis cache first
        const fromEpoch = new Date(from).getTime();
        const toEpoch = new Date(to).getTime();
        const cacheKey = `topMaterials:${fromEpoch}:${toEpoch}`;
        const cachedTopMaterials = await redisClient.get(cacheKey);

        if (cachedTopMaterials) {
            console.log("Top materials fetched from cache");
            return JSON.parse(cachedTopMaterials);
        }

        try {
            const mostViewed = await Statistics.getMostViewedMaterials(from, to);
            const mostDownloaded = await Statistics.getMostDownloadedMaterials(from, to);

            // Cache the top materials in Redis for future requests
            await redisClient.setEx(cacheKey, REDIS_TTL, JSON.stringify({ 
                mostViewed,
                mostDownloaded 
            }));

            return {
                mostViewed,
                mostDownloaded
            };
        } catch (error) {
            throw new Error('Failed to fetch top materials', error);
        }
    }

    static async getTopContributors() {
        // Check Redis cache first
        const cachedContributors = await redisClient.get("topContributors");
        if (cachedContributors) {
            console.log("Top contributors fetched from cache");
            return JSON.parse(cachedContributors);
        }

        try {
            const topContributors = await Statistics.getTopContributors();

            // Cache the top contributors in Redis for future requests
            await redisClient.setEx("topContributors", REDIS_TTL, JSON.stringify(topContributors));

            return topContributors;
        } catch (error) {
            throw new Error('Failed to fetch top contributors', error);
        }
    }
};

export default StatisticsService
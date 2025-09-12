import StatisticsService from "../services/statistics.service.js";
import Statistics from "../models/statistics.model.js";

class StatisticsController {
    static async getGeneralStats(req, res) {
        try {
            const stats = await StatisticsService.getGeneralStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopMaterials(req, res) {
        try {
            const { from, to } = req.query;
            const topMaterials = await StatisticsService.getTopMaterials(from, to);
            res.json(topMaterials);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTopContributors(req, res) {
        try {
            const topContributors = await StatisticsService.getTopContributors();
            res.json(topContributors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default StatisticsController;
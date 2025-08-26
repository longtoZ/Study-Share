import HistoryService from "../services/history.service.js";
import History from "../models/history.model.js";

class HistoryController {
    static async addEntry(req, res) {
        try {
            const data = req.body;
            await HistoryService.addEntry(data);
            res.status(201).json({ message: "History entry added/updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteEntry(req, res) {
        try {
            const { user_id, material_id, lesson_id } = req.body;
            await History.deleteHistory(user_id, material_id, lesson_id);
            res.status(200).json({ message: "History entry deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listEntries(req, res) {
        try {
            const { user_id, filter } = req.body;
            const entries = await History.listEntries(user_id, filter);
            res.status(200).json({ message: "History entries retrieved successfully", entries });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default HistoryController;

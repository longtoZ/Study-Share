import History from "../models/history.model.js";

class HistoryService {
    static async addEntry(data) {
        const existingHistory = await History.getHistory(data.user_id, data.material_id, data.lesson_id);

        if (existingHistory.length > 0) {
            await History.updateHistory(data.user_id, data.material_id, data.lesson_id, data.viewed_date);
        } else {
            await History.addHistory(data);
        }
    }
}

export default HistoryService;
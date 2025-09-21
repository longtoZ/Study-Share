import Task from "../models/task.model.js";

class TaskController {
    static async getRecentTasks(req, res) {
        const userId = req.user.user_id;
        const limit = parseInt(req.query.limit) || 5;

        try {
            const tasks = await Task.getRecentTasks(userId, limit);
            res.status(200).json({ tasks });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}

export default TaskController;
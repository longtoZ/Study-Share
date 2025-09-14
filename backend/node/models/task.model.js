import supabase from '../config/database.config.js';
import { TABLES } from '../constants/constant.js';

class Task {
    static async getRecentTasks(limit = 5) {
        const { data, error } = await supabase
            .from(TABLES.TASK)
            .select('*')
            .order('created_date', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(`Error fetching recent tasks: ${error.message}`);
        }

        return data;
    }
}

export default Task;

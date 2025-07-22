import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Subject {
    static async getAll() {
        const { data, error } = await supabase
            .from(TABLES.SUBJECT)
            .select('*')
        
        if (error) throw error;
        return data;
    }
}

export default Subject;
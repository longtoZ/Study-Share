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

    static async getById(subject_id) {
        const { data, error } = await supabase
            .from(TABLES.SUBJECT)
            .select('*')
            .eq('subject_id', subject_id)
            .single();
        
        if (error) throw error;
        return data;
    }
}

export default Subject;
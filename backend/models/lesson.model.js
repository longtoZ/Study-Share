import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Lesson {
    static async getLessonsByUserId(user_id) {
        const { data, error } = supabase
            .from(TABLES.LESSON)
            .select('*')
            .eq('user_id', user_id);
        
        if (error && error.code !== 'PGRST116') throw error;

        if (!data || data.length === 0) {
            return [];
        }
        
        return data;
    }
}

export default Lesson;
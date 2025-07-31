import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Lesson {
    static async getLessonsByUserId(user_id) {
        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .select('*')
            .eq('user_id', user_id);
        
        if (error && error.code !== 'PGRST116') throw error;

        if (!data || data.length === 0) {
            return [];
        }
        
        return data;
    }

    static async createLesson(info) {
        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .insert({
                lesson_id: info.lesson_id,
                name: info.name,
                description: info.description,
                created_date: info.created_date,
                last_updated: info.last_updated,
                material_count: info.material_count,
                user_id: info.user_id,
                is_public: info.is_public
            })
            .select('*')
            .single();
        
        console.log('Creating lesson with data:', data);
        
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) {
            throw new Error('Failed to create lesson');
        }
        return data;
    }
}

export default Lesson;
import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Lesson {
    static async getLessonsByUserId(user_id, order) {
        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .select('*')
            .eq('user_id', user_id)
            .order('created_date', { ascending: order === 'oldest' });

        if (error && error.code !== 'PGRST116') throw error;
        
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

    static async getAllMaterialsByLessonId(lesson_id) {
        const { data, error } = await supabase
            .from(TABLES.MATERIAL)
            .select('*')
            .eq('lesson_id', lesson_id);

        if (error) throw error;

        return data;
    }

    static async addMaterialToLesson(lesson_id, material_id) {
        const { data: materialData, error: materialError } = await supabase
            .from(TABLES.MATERIAL)
            .update({ lesson_id })
            .eq('material_id', material_id)
            .select('*')
            .single();

        if (materialError) throw materialError;

        const { data: currentLessonData, error: lessonError } = await supabase
            .from(TABLES.LESSON)
            .select('*')
            .eq('lesson_id', lesson_id)
            .single();

        if (lessonError) throw lessonError;

        const newMaterialCount = currentLessonData.material_count + 1;

        const { data: updatedLessonData, error: updateError } = await supabase
            .from(TABLES.LESSON)
            .update({ material_count: newMaterialCount })
            .eq('lesson_id', lesson_id)
            .select('*')
            .single();

        if (updateError) throw updateError;

        return { materialData, lessonData: updatedLessonData };
    }
}

export default Lesson;
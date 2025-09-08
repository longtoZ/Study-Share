import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Lesson {
    static async getLessonsByUserId(user_id, order, from, to) {
        const { data, error } = await supabase
            .rpc('get_lessons_user_info')
            .select('*', { count: 'exact' })
            .eq('user_id', user_id)
            .order('created_date', { ascending: order === 'oldest' })
            .range(from, to);

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
                is_public: info.is_public,
                view_count: 0
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

    static async getAllMaterialsByLessonId(lesson_id, order) {
        const { data: lessonData, error: lessonError } = await supabase
            .from(TABLES.LESSON)
            .select('user_id, name')
            .eq('lesson_id', lesson_id)
            .single();

        const { data, error } = await supabase
            .rpc('get_materials_user_info')
            .select('*')
            .eq('lesson_id', lesson_id)
            .order('upload_date', { ascending: order === 'oldest' });

        if (error) throw error;

        return {
            materials: data,
            authorId: lessonData.user_id,
            lessonName: lessonData.name
        }
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

    static async getLessonById(lesson_id) {
        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .select('*')
            .eq('lesson_id', lesson_id)
            .single();

        if (error) throw error;

        return data;
    }

    static async updateLesson(lesson_id, updatedData) {
        // Only allow specific fields to be updated
        const allowed = ['name', 'description', 'is_public'];
        const payload = Object.fromEntries(
            Object.entries(updatedData).filter(([k]) => allowed.includes(k))
        );

        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .update(payload)
            .eq('lesson_id', lesson_id)
            .select('*')
            .single();

        if (error) throw error;

        return data;
    }

    static async searchLesson(query, filters) {
        const { from, to, author: user_id, sort_by, order } = filters;
        console.log('Search Filters:', filters);

        const databaseQuery = supabase
            .rpc('get_lessons_user_info')
            .select('*')
            .ilike('name', `%${query}%`)
            .gte('created_date', from)
            .lte('created_date', to)

        if (user_id) databaseQuery.eq('user_id', user_id);

        const { data, error } = await databaseQuery
            .order(sort_by, { ascending: order === 'asc' });

        console.log('Search Lesson Data:', data);

        if (error) throw error;

        return data;
    }

    static async deleteLesson(lesson_id) {
        const { data, error } = await supabase
            .from(TABLES.LESSON)
            .delete()
            .eq('lesson_id', lesson_id);

        if (error) throw error;
        return data;
    }
}

export default Lesson;
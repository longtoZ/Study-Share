import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class History {
    static async getHistory(user_id, material_id, lesson_id) {
        const query = supabase
            .from(TABLES.HISTORY)
            .select('*')
            .eq('user_id', user_id)
        
        if (material_id) query.eq('material_id', material_id);
        if (lesson_id) query.eq('lesson_id', lesson_id);

        const { data, error } = await query.order('viewed_date', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }

    static async addHistory(data) {
        const { error } = await supabase
            .from(TABLES.HISTORY)
            .insert([data]);

        if (error) {
            throw error;
        }
    }

    static async updateHistory(user_id, material_id, lesson_id, viewed_date) {
        const query = supabase
            .from(TABLES.HISTORY)
            .update({ viewed_date })
            .eq('user_id', user_id)

        if (material_id) query.eq('material_id', material_id);
        if (lesson_id) query.eq('lesson_id', lesson_id);

        const { error } = await query;

        if (error) {
            throw error;
        }
    }

    static async deleteHistory(user_id, material_id, lesson_id) {
        const query = supabase
            .from(TABLES.HISTORY)
            .delete()
            .eq('user_id', user_id)
        
        if (material_id) query.eq('material_id', material_id);
        if (lesson_id) query.eq('lesson_id', lesson_id);

        const { error } = await query;

        if (error) {
            throw error;
        }

        console.log('Delete result:', data);
    }

    static async listEntries(user_id, filter) {
        const query = supabase
            .from(TABLES.HISTORY)
            .select('*')
            .eq('user_id', user_id);

        if (filter.from) query.gte('viewed_date', filter.from);
        if (filter.to) query.lte('viewed_date', filter.to);
        if (filter.type) {
            if (filter.type !== 'all') query.eq('type', filter.type);
        }

        const { data, error } = await query.order('viewed_date', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }
}

export default History;
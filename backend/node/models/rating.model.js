import supabase from '../config/database.config.js';
import { TABLES } from '../constants/constant.js';

class Rating {
    static async rateMaterial(material_id, star_level) {
        const { data: prevData, error } = await supabase
            .from(TABLES.RATING)
            .select('*')
            .eq('material_id', material_id)
            .eq('star_level', star_level)
            .single();

        if (error) throw error;

        if (prevData) {
            // If rating exists, update it
            const { data, error: updateError } = await supabase
                .from(TABLES.RATING)
                .update({ count: prevData.count + 1 })
                .eq('material_id', material_id)
                .eq('star_level', star_level);

            if (updateError) throw updateError;
            return data;
        }

        return null;
    }

    static async createRatingLog(user_id, material_id, star_level, rated_date) {
        const { data, error } = await supabase
            .from(TABLES.RATING_LOG)
            .insert([{ user_id, material_id, star_level, rated_date }]);

        if (error) throw error;
        return data;
    }

    static async getMaterialRating(material_id) {
        const { data, error } = await supabase
            .from(TABLES.RATING)
            .select('*')
            .eq('material_id', material_id);

        if (error) throw error;
        return data;
    }

    static async checkUserRating(material_id, user_id) {
        const { data, error } = await supabase
            .from(TABLES.RATING_LOG)
            .select('*')
            .eq('material_id', material_id)
            .eq('user_id', user_id)
            .maybeSingle();

        if (error) throw error;
        return data || null;
    }
}

export default Rating;
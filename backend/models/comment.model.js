import supabase from '../config/database.js';
import { TABLES } from '../constants/constant.js';

class Comment {
    static async createComment(data) {

        const { data: comment, error } = await supabase
            .from(TABLES.COMMENT)
            .insert([{ ...data }])
            .single();

        if (error) throw error;
        return comment;
    }

    static async getCommentsByMaterialId(material_id) {
        const { data: comments, error } = await supabase
            .from(TABLES.COMMENT)
            .select('*')
            .eq('material_id', material_id);

        if (error) throw error;
        return comments;
    }

    static async deleteComment(comment_id) {
        const { data, error } = await supabase
            .from(TABLES.COMMENT)
            .delete()
            .eq('id', comment_id);

        if (error) throw error;
        return data;
    }
}

export default Comment;
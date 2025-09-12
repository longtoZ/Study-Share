import supabase from '../config/database.config.js';
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

    static async getCommentsByMaterialId(material_id, order, start, end) {
        // Order by newest
        if (order == 'newest') {
            const { data: comments, error } = await supabase
                .rpc('get_comments_user_info')
                .select('*')
                .eq('material_id', material_id)
                .order('created_date', { ascending: false })
                .range(start, end);

            if (error) throw error;
            return comments;
        }

        // Order by popularity
        const { data: comments, error } = await supabase
            .rpc('get_comments_user_info')
            .select('*')
            .eq('material_id', material_id)
            .range(start, end);

        if (error) throw error;

        comments.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
        return comments;
    }

    static async deleteComment(comment_id) {
        const { error } = await supabase
            .from(TABLES.COMMENT)
            .delete()
            .eq('comment_id', comment_id);

        if (error) throw error;
    }

    static async voteComment(user_id, comment_id, vote) {
        // Fetch current comment
        const { data: comment, error: fetchError } = await supabase
            .from(TABLES.COMMENT)
            .select('upvote')
            .eq('comment_id', comment_id)
            .single();

        if (fetchError) throw fetchError;
        if (!comment) throw new Error('Comment not found');

        let newUpvote = comment.upvote;

        if (vote === "upvote") {
            newUpvote += 1;
        } else if (vote === "cancel-upvote") {
            newUpvote = Math.max(newUpvote - 1, 0);
        }

        const { data, error } = await supabase
            .from(TABLES.COMMENT)
            .update({
                upvote: newUpvote
            })
            .eq('comment_id', comment_id);

        if (error) throw error;

        // Vote comment (if user hasn't voted yet)
        const existingRecord = await this.checkUpvoteRecord(user_id, comment_id);
        if (!existingRecord) {
            await this.createUpvoteRecord(user_id, comment_id, new Date());
        } else {
            await this.removeUpvoteRecord(user_id, comment_id);
        }
        
        return data;
    }

    static async checkUpvoteRecord(user_id, comment_id) {
        const { data, error } = await supabase
            .from(TABLES.UPVOTE)
            .select('*')
            .eq('user_id', user_id)
            .eq('comment_id', comment_id)
            .maybeSingle();

        if (error) throw error;
        return data || null;
    }

    static async createUpvoteRecord(user_id, comment_id, vote_date) {
        const { data, error } = await supabase
            .from(TABLES.UPVOTE)
            .insert([{ user_id, comment_id, vote_date }])
            .single();

        if (error) throw error;
        return data;
    }

    static async removeUpvoteRecord(user_id, comment_id) {
        const { data, error } = await supabase
            .from(TABLES.UPVOTE)
            .delete()
            .eq('user_id', user_id)
            .eq('comment_id', comment_id);

        if (error) throw error;
        return data;
    }
}

export default Comment;
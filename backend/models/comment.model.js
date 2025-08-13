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

    static async getCommentsByMaterialId(material_id, order) {
        if (order == 'newest') {
            const { data: comments, error } = await supabase
                .from(TABLES.COMMENT)
                .select('*')
                .eq('material_id', material_id)
                .order('created_date', { ascending: false });

            if (error) throw error;
            return comments;
        }

        // Order by popularity
        const { data: comments, error } = await supabase
            .from(TABLES.COMMENT)
            .select('*')
            .eq('material_id', material_id)

        if (error) throw error;

        comments.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
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

    static async voteComment(comment_id, vote, type) {
        // Fetch current comment
        const { data: comment, error: fetchError } = await supabase
            .from(TABLES.COMMENT)
            .select('upvote, downvote')
            .eq('comment_id', comment_id)
            .single();

        if (fetchError) throw fetchError;
        if (!comment) throw new Error('Comment not found');

        let newUpvote = comment.upvote;
        let newDownvote = comment.downvote;

        if (vote === "upvote") {
            newUpvote = type === 'up' ? newUpvote + 1 : Math.max(newDownvote - 1, 0);
        } else if (vote === "downvote") {
            newDownvote = type === 'down' ? newDownvote + 1 : Math.max(newUpvote - 1, 0);
        }

        console.log(`New upvote: ${newUpvote}; New downvote: ${newDownvote}`);

        const { data, error } = await supabase
            .from(TABLES.COMMENT)
            .update({
                upvote: newUpvote,
                downvote: newDownvote
            })
            .eq('comment_id', comment_id);

        if (error) throw error;
        return data;
    }
}

export default Comment;
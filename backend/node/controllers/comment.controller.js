import Comment from "../models/comment.model.js";

class CommentController {
    static async createComment(req, res) {
        try {
            const comment = await Comment.createComment(req.body);
            res.status(201).json({ message: "Comment created successfully", comment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCommentsByMaterialId(req, res) {
        const { material_id } = req.params;
        const { order } = req.query;

        try {
            const comments = await Comment.getCommentsByMaterialId(material_id, order);
            res.status(200).json({ message: "Comments retrieved successfully", comments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteComment(req, res) {
        const userId = req.user.id; // Assuming AuthMiddleware sets req.user
        const { authorId } = req.body; // Assuming authorId is sent in the body

        if (authorId && userId !== authorId) {
            return res.status(403).json({ error: "You are not authorized to delete this comment" });
        }

        try {
            await Comment.deleteComment(req.params.comment_id);
            res.status(200).json({ message: "Comment deleted successfully"});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async voteComment(req, res) {
        const { comment_id } = req.params;
        const { user_id, vote } = req.body;

        try {
            const result = await Comment.voteComment(user_id, comment_id, vote);
            res.status(200).json({ message: "Comment voted successfully", result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async checkUpvoteRecord(req, res) {
        const { user_id, comment_id } = req.params;

        try {
            const isUpvoted = await Comment.checkUpvoteRecord(user_id, comment_id);
            res.status(200).json({ message: "Upvote record checked successfully", isUpvoted });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CommentController;

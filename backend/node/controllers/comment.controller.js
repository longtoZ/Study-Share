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
        try {
            const result = await Comment.deleteComment(req.params.id);
            res.status(200).json({ message: "Comment deleted successfully", result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async voteComment(req, res) {
        const { comment_id } = req.params;
        const { vote, type } = req.body;

        try {
            const result = await Comment.voteComment(comment_id, vote, type);
            res.status(200).json({ message: "Comment voted successfully", result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CommentController;

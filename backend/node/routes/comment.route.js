import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';

const router = Router();

router.post('/create', CommentController.createComment);
router.get('/:material_id', CommentController.getCommentsByMaterialId);
router.delete('/:id', CommentController.deleteComment);
router.post('/:comment_id/vote', CommentController.voteComment);

export default router;

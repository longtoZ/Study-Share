import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/create', CommentController.createComment);
router.get('/:material_id', CommentController.getCommentsByMaterialId);
router.delete('/:comment_id/delete', AuthMiddleware.verifyUser, CommentController.deleteComment);
router.post('/:comment_id/vote', CommentController.voteComment);
router.get('/:user_id/:comment_id/check', CommentController.checkUpvoteRecord);

export default router;

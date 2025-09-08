import { Router } from 'express';
import LessonController from '../controllers/lesson.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();
router.get('/user/:userId', LessonController.getLessonsByUserId);
router.post('/create-lesson', LessonController.createLesson);
router.get('/:lessonId/all-materials', LessonController.getAllMaterialsByLessonId);
router.post('/:lessonId/add-material', LessonController.addMaterialToLesson);
router.get('/:lessonId', LessonController.getLessonById);
router.put('/:lessonId', AuthMiddleware.verifyUser, LessonController.updateLesson);
router.post('/search', LessonController.searchLesson);
router.delete('/:lessonId', AuthMiddleware.verifyUser, LessonController.deleteLesson);

export default router;
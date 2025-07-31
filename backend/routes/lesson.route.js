import { Router } from 'express';
import LessonController from '../controllers/lesson.controller.js';

const router = Router();
router.get('/user/:userId', LessonController.getLessonsByUserId);
router.post('/create-lesson', LessonController.createLesson);

export default router;
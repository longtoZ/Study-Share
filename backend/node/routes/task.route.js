import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';
const router = Router();

router.get('/recent-tasks', AuthMiddleware.verifyUser, TaskController.getRecentTasks);

export default router;
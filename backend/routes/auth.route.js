import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/verify', authMiddleware, AuthController.verifyUser);

export default router;

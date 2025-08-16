import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/verify', AuthMiddleware.verifyUser, AuthController.verifyUser);

export default router;

import { Router } from 'express';
import AIChatController from '../controllers/ai-chat.controller.js';

const router = Router();

router.post('/generate-response', AIChatController.generateResponse);
router.post('/clear-session', AIChatController.clearSession);

export default router;
import { Router } from 'express';
const router = Router();
import register from '../controllers/authController';

router.post('/register', register);

export default router;
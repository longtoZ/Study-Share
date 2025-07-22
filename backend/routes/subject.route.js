import { Router } from 'express';
import SubjectController from '../controllers/subject.controller.js';
const router = Router();

router.get('/get-all', SubjectController.getAllSubject);
export default router;

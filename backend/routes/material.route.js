import { Router } from 'express';
import MaterialController from '../controllers/material.controller.js';
const router = Router();

router.post('/upload', MaterialController.upload);
export default router;

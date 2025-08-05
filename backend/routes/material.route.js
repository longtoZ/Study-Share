import { Router } from 'express';
import multer from 'multer';
import MaterialController from '../controllers/material.controller.js';

const router = Router();
const upload = multer({ dest: 'uploads/'});

router.post('/upload', upload.single('file'), MaterialController.upload);
router.get('/statistics/:userId', MaterialController.getStatistics);
router.get('/user/:userId', MaterialController.getMaterialByUserId);
router.get('/material/:materialId/page/:page', MaterialController.getMaterialPage);

export default router;

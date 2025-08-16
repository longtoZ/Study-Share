import { Router } from 'express';
import multer from 'multer';
import MaterialController from '../controllers/material.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/'});

router.post('/upload', upload.single('file'), MaterialController.upload);
router.get('/statistics/:userId', MaterialController.getStatistics);
router.get('/user/:userId', MaterialController.getMaterialByUserId);
router.get('/:materialId', MaterialController.getMaterialById);
router.get('/:materialId/page/:page', MaterialController.getMaterialPage);
router.put('/:materialId', AuthMiddleware.verifyUser, MaterialController.updateMaterial);

export default router;

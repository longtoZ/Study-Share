import { Router } from 'express';
import multer from 'multer';
import MaterialController from '../controllers/material.controller.js';
import AuthMiddleware from '../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ dest: 'uploads/'});

router.post('/upload', upload.single('file'), MaterialController.upload);
router.get('/statistics/:userId', MaterialController.getStatistics);
router.get('/user/:userId', MaterialController.getMaterialsByUserId);
router.get('/:materialId', MaterialController.getMaterialById);
router.get('/url/:materialId', MaterialController.getMaterialUrlById);
router.get('/:materialId/page/:page', MaterialController.getMaterialPage);
router.put('/:materialId', AuthMiddleware.verifyUser, MaterialController.updateMaterial);
router.post('/search', MaterialController.searchMaterial);
router.delete('/:materialId', AuthMiddleware.verifyUser, MaterialController.deleteMaterial);

export default router;

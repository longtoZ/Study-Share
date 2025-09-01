import { Router } from 'express';
import StatisticsController from '../controllers/statistics.controller.js';

const router = Router();

router.get('/general', StatisticsController.getGeneralStats);
router.get('/top-materials', StatisticsController.getTopMaterials);
router.get('/top-contributors', StatisticsController.getTopContributors);

export default router;
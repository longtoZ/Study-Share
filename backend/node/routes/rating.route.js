import { Router } from 'express';
import RatingController from '../controllers/rating.controller.js';

const router = Router();

router.post('/rate', RatingController.createRating);
router.get('/:material_id', RatingController.getMaterialRating);
router.get('/:material_id/check', RatingController.checkUserRating);

export default router;

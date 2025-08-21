import { Router } from 'express';
import RatingController from '../controllers/rating.controller.js';

const router = Router();

router.post('/rate', RatingController.createRating);
router.get('/:material_id', RatingController.getMaterialRating);

export default router;

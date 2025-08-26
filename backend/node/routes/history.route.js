import { Router } from 'express';
import HistoryController from '../controllers/history.controller.js';

const router = Router();

router.post('/add', HistoryController.addEntry);
router.delete('/delete', HistoryController.deleteEntry);
router.post('/list', HistoryController.listEntries);

export default router;

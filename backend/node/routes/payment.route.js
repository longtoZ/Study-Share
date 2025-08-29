import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware.js';
import PaymentController from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-payment-intent', AuthMiddleware.verifyUser, PaymentController.createPaymentIntent);
router.post('/create-connected-account', PaymentController.createConnectedAccount);

export default router;
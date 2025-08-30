import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware.js';
import PaymentController from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-connected-account', PaymentController.createConnectedAccount);
router.post('/redirect-to-checkout', AuthMiddleware.verifyUser, PaymentController.redirectToCheckout);
router.get('/success', PaymentController.paymentSuccess);
router.get('/oauth/callback', PaymentController.accountAuthorizationCallback);

export default router;
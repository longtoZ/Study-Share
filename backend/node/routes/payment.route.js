import { Router } from 'express';
import AuthMiddleware from '../middleware/auth.middleware.js';
import PaymentController from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-connected-account', PaymentController.createConnectedAccount);
router.post('/redirect-to-checkout', AuthMiddleware.verifyUser, PaymentController.redirectToCheckout);
router.get('/success', PaymentController.paymentSuccess);
router.get('/oauth/callback', PaymentController.accountAuthorizationCallback);
router.get('/check-material-payment', AuthMiddleware.verifyUser, PaymentController.checkMaterialPayment);
router.post('/payment-history', AuthMiddleware.verifyUser, PaymentController.getPaymentHistory);

export default router;
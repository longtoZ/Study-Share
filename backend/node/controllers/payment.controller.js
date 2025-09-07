import PaymentService from "../services/payment.service.js";
import Payment from "../models/payment.model.js";
import stripe from "../config/stripe.js";

class PaymentController {
    static async createConnectedAccount(req, res) {
        const { email } = req.body;

        try {
            const account = await stripe.accounts.create({
                type: "express",
                country: "US",
                email: email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });

            res.status(200).json({ accountId: account.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async redirectToCheckout(req, res) {
          try {
            const session = await PaymentService.redirectToCheckout(req.body);
            res.status(200).json({ url: session.url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async paymentSuccess(req, res) {
        const { session_id } = req.query;

        try {
            const fileUrl = await PaymentService.savePaymentDetails(session_id);
            res.redirect(fileUrl);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async accountAuthorizationCallback(req, res) {
        const { code, state } = req.query;

        try {
            const response = await stripe.oauth.token({
                grant_type: "authorization_code",
                code: code,
            });

            console.log("OAuth Response:", response);
            const connectedAccountId = response.stripe_user_id;

            // Extract user_id from state parameter (passed from frontend)
            const user_id = state;
            
            // Save connectedAccountId to your database, associated with the user
            await Payment.updateStripeAccountId(user_id, connectedAccountId);

            res.redirect(`${process.env.FRONTEND_ORIGIN}/dashboard?connected_account_id=${connectedAccountId}`);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async checkMaterialPayment(req, res) {
        const userId = req.user.user_id;
        const materialId = req.query.material_id;

        try {
            const payment = await Payment.checkMaterialPayment(userId, materialId);
            res.status(200).json(payment);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async getPaymentHistory(req, res) {
        const userId = req.user.user_id;
        const { filter } = req.body;

        try {
            const payments = await Payment.getPaymentsByUserId(userId, filter || {});
            res.status(200).json({ payments });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
}

export default PaymentController;
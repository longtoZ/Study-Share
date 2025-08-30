import Stripe from "stripe";
import PaymentService from "../services/payment.service.js";
import Payment from "../models/payment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

            res.json({ accountId: account.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async redirectToCheckout(req, res) {
          try {
            const session = await PaymentService.redirectToCheckout(req.body);
            res.json({ url: session.url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }

    static async paymentSuccess(req, res) {
        const { session_id } = req.query;
        try {
            const paymentRecord = await PaymentService.savePaymentDetails(session_id);
            res.json(paymentRecord);
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
};

export default PaymentController;
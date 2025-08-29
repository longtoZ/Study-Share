import Stripe from "stripe";

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

    static async createPaymentIntent(req, res) {
          try {
            const { productName, amount, sellerAccountId } = req.body;

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card"],
                line_items: [
                    {
                    price_data: {
                        currency: "usd",
                        product_data: { name: productName },
                        unit_amount: amount,
                    },
                    quantity: 1,
                    },
                ],
                payment_intent_data: {
                    application_fee_amount: 200, // your commission
                    transfer_data: {
                        destination: sellerAccountId, // money goes to seller
                    },
                },
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
            });
            res.json({ url: session.url });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
};

export default PaymentController;
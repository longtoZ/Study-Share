import Payment from "../models/payment.model.js";

class PaymentService {
    static async redirectToCheckout(info) {
        const { material_id, name, buyer_id, seller_id, amount, currency } = info;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: { name: name },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                    metadata: {
                        material_id: material_id,
                        buyer_id: buyer_id,
                        seller_id: seller_id,
                    },
                },
            ],
            payment_intent_data: {
                application_fee_amount: Math.round(amount * 0.1 * 100), // takes 10% commission
                transfer_data: {
                    destination: sellerAccountId, // money goes to seller
                },
            },
            success_url: "http://localhost:3000/api/payment/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:3000/cancel",
        });

        return session;
    }

    static async savePaymentDetails(session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["payment_intent"],
        });

        const paymentRecord = {
            payment_id: session.payment_intent.id,
            material_id: session.metadata.material_id,
            buyer_id: session.metadata.buyer_id,
            seller_id: session.metadata.seller_id,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: session.payment_status,
            created_date: new Date(),
        }

        const newPaymentRecord = await Payment.createPaymentRecord(paymentRecord);
        return newPaymentRecord;
    }
};

export default PaymentService;
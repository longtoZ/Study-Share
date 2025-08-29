import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const PAYMENT_INTENT_ENDPOINT = import.meta.env.VITE_PAYMENT_INTENT_ENDPOINT;

const makePayment = async (data: any) => {
    const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    const token = localStorage.getItem('user_token');

    const response = await fetch(PAYMENT_INTENT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create checkout session');
    }

    const session = await response.json();

    window.location.href = session.url;
};

export { makePayment };
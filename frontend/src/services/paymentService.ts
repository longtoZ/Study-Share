const REDIRECT_TO_CHECKOUT = import.meta.env.VITE_REDIRECT_TO_CHECKOUT;
const CHECK_MATERIAL_PAYMENT = import.meta.env.VITE_CHECK_MATERIAL_PAYMENT;
const PAYMENT_HISTORY = import.meta.env.VITE_PAYMENT_HISTORY;

const makePayment = async (data: any) => {
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(REDIRECT_TO_CHECKOUT, {
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

const checkMaterialPayment = async (materialId: string) => {
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(`${CHECK_MATERIAL_PAYMENT}?material_id=${materialId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to check material payment');
    }

    return await response.json();
};

const getPaymentHistory = async (filter: any) => {
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(PAYMENT_HISTORY, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filter }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch payment history');
    }

    return (await response.json()).payments;
};

export { makePayment, checkMaterialPayment, getPaymentHistory };
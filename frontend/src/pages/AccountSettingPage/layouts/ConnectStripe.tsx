import { useState, useEffect } from 'react'
import StripeLogo from '../images/stripe_logo.png';

import { retrieveUserData, updateUserProfile } from '@/services/userService';

const STRIPE_CLIENT_ID = import.meta.env.VITE_STRIPE_CLIENT_ID;
const STRIPE_REDIRECT_URI = import.meta.env.VITE_STRIPE_REDIRECT_URI;

const ConnectStripe = () => {
    const userId = localStorage.getItem('user_id') || '';
    const [stripeAccountId, setStripeAccountId] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await retrieveUserData(userId);
            console.log('Fetched user data:', userData);
            if (userData && userData.stripe_account_id) {
                setStripeAccountId(userData.stripe_account_id);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleUpdateStripeAccount = async () => {
        if (!userId) return;

        const form = new FormData();
        form.append('metadata', JSON.stringify({ stripe_account_id: '' }));

        try {
            await updateUserProfile(userId, form);
            setStripeAccountId('');
            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error('Failed to disconnect Stripe account:', error);
        }
    };

    return (
        <div className="py-6 px-8">
            <h2 className="text-xl font-semibold mb-6">Stripe Account</h2>
            <div className='border-b border-zinc-300 my-6'></div>
            <div className="flex items-center space-x-4">
                { stripeAccountId ? (
                    <div className=''>
                        <h1 className="font-semibold mb-2">Connected: {stripeAccountId}</h1>
                        <button
                            className='border-2 border-red-500 rounded-xl py-2 px-4 flex items-center gap-3 cursor-pointer hover:bg-red-50 transition-all duration-100 ease-in-out'
                            onClick={handleUpdateStripeAccount}
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        className="border-2 border-indigo-500 rounded-xl py-2 px-4 flex items-center gap-3 cursor-pointer hover:bg-indigo-50 transition-all duration-100 ease"
                        onClick={() => {
                            window.location.href = `https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${STRIPE_REDIRECT_URI}&state=${userId}`;
                        }}
                    >
                        <img src={StripeLogo} alt="Stripe Logo" className="h-5" />
                        <span className="font-semibold border-l border-indigo-600 py-1 pl-3">Connect with Stripe</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default ConnectStripe;
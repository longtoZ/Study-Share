import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from './layouts/PersonalInfo';
import ConnectStripe from './layouts/ConnectStripe';
import DeleteAccount from './layouts/DeleteAccount';
import ResetPassword from './layouts/ResetPassword';

import { verifyUser } from '@services/authService';

const AccountSettingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('personal');
    const userId = localStorage.getItem('user_id') || '';
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserVerification = async () => {
            try {
                const user = await verifyUser(userId);
                console.log('User verification successful:', user);
            } catch (error) {
                console.error('User verification failed:', error);
                navigate('/login');
            }
        };
        checkUserVerification();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'personal':
                return ( <PersonalInfo/> );
            case 'stripe':
                return ( <ConnectStripe/> );
            case 'reset-password':
                return ( <ResetPassword/> );
            case 'delete':
                return ( <DeleteAccount/> );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-secondary p-6 overflow-y-auto scrollbar-hide h-[100vh] pb-36">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
                <div className="flex bg-primary shadow-xl rounded-2xl">
                    {/* Left Sidebar */}
                    <div className="w-64 p-4 my-8 border-r border-zinc-200">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                                    activeTab === 'personal'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Personal Information
                            </button>
                            <button
                                onClick={() => setActiveTab('stripe')}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                                    activeTab === 'stripe'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Stripe
                            </button>
                            <button
                                onClick={() => setActiveTab('reset-password')}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                                    activeTab === 'reset-password'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Reset Password
                            </button>
                            <button
                                onClick={() => setActiveTab('delete')}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                                    activeTab === 'delete'
                                        ? 'bg-red-100 text-red-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Delete Account
                            </button>
                        </nav>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingPage;
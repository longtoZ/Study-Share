
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface AccountStepProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNextStep: () => void;
    isLoading: boolean;
    emailRef: React.RefObject<HTMLInputElement | null>;
    passwordRef: React.RefObject<HTMLInputElement | null>;
    retypePasswordRef: React.RefObject<HTMLInputElement | null>;
    emailValidRef: React.RefObject<HTMLParagraphElement | null>;
    passwordValidRef: React.RefObject<HTMLParagraphElement | null>;
    retypePasswordValidRef: React.RefObject<HTMLParagraphElement | null>;
    navigate: (path: string) => void;
}

const AccountStep: React.FC<AccountStepProps> = ({
    formData,
    handleInputChange,
    handleNextStep,
    isLoading,
    emailRef,
    passwordRef,
    retypePasswordRef,
    emailValidRef,
    passwordValidRef,
    retypePasswordValidRef,
    navigate
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Let's get started!</h2>
            <p className='text-gray-600 mb-6'>
                Please enter your email and create a password to sign up
            </p>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailRef}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder='Enter your email address'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className='text-xs text-red-500 mt-1' ref={emailValidRef}></p>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder='Enter your password'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className='text-xs text-red-500 mt-1' ref={passwordValidRef}></p>
            </div>
            <div className="mb-6">
                <label htmlFor="retypePassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Retype Password *
                </label>
                <input
                    type="password"
                    id="retypePassword"
                    name="retypePassword"
                    ref={retypePasswordRef}
                    value={formData.retypePassword}
                    onChange={handleInputChange}
                    required
                    placeholder='Retype your password'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <p className='text-xs text-red-500 mt-1' ref={retypePasswordValidRef}></p>
            </div>
            <button
                type="button"
                onClick={handleNextStep}
                className="w-full button-primary py-3 px-4 rounded-lg font-medium flex items-center justify-center"
            >
                {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Next'}
            </button>
            <p className='mt-10 text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <span
                    className="font-semibold hover:underline cursor-pointer"
                    onClick={() => navigate('/login')}
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default AccountStep;

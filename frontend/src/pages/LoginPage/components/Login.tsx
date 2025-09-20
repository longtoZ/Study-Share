import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/userSlice';
import { loginUser, googleLogin } from '@/services/userService';

import CircularProgress from '@mui/material/CircularProgress';

const Login = ({ email, setEmail, setMode } : { email: string, setEmail: (email: string) => void, setMode: (mode: string) => void }) => {
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailErrorMessage('');
        setPasswordErrorMessage('');

        if (email.length === 0) {
            setEmailErrorMessage('Email is required');
            return;
        }

        if (password.length === 0) {
            setPasswordErrorMessage('Password is required');
            return;
        }
        
        try {
            setIsLoading(true);
            const userData = await loginUser({ email, password });
            console.log(userData)
            dispatch(login({ user_id: userData.user.user_id, token: userData.token, auth_provider: userData.user.auth_provider }));
            navigate('/');
        } catch (error: any) {
            const message = error.message || 'Login failed. Please try again.';
            if (message.includes('Email is not valid')) {
                setEmailErrorMessage(message);
            }
            if (message.includes('Password is not correct')) {
                setPasswordErrorMessage(message);
            } else if (message.includes('This email is registered via')) {
                setEmailErrorMessage(message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async () => {
        // Handle Google login success
        try {
            const userData = await googleLogin();
            console.log(userData);
            // dispatch(login({ user_id: userData.user_id, token: userData.token }));
            // navigate('/');
        } catch (error: any) {
            console.error('Error logging in with Google:', error);
        }
    };

    const handleGoogleError = () => {
        console.log('Google Sign In was unsuccessful. Try again later');
    }

    return (
        <div className="bg-white p-8 rounded-2xl card-shadow">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
                <p className="mt-2 text-gray-600">Please enter your detail to sign in</p>
            </div>

            {/* Google Sign In */}
            <div className="mb-6">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your email'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500"
                    />
                </div>
                {emailErrorMessage && (
                    <p className="text-red-500 text-sm">{emailErrorMessage}</p>
                )}

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                        placeholder='Enter your password'
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500"
                    />
                </div>
                {passwordErrorMessage && (
                    <p className="text-red-500 text-sm">{passwordErrorMessage}</p>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <p className="text-sm text-zinc-700 hover:underline" onClick={() => setMode('reset-password')}>
                        Forgot password?
                    </p>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-2 px-4 button-primary shadow-md"
                >
                    {isLoading ? <CircularProgress sx={{ color: 'white' }} size={24} /> : 'Login'}
                </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-medium text-zinc-700 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Login
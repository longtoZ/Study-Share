import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser, checkEmailExists } from '@/services/userService';

import DropdownList from '@/components/common/DropdownList';
import CircularProgress from '@mui/material/CircularProgress';
import EmailVerification from './components/EmailVerification';

import BackgroundImage from './images/signup_background.jpeg';

interface FormData {
    email: string;
    password: string;
    retypePassword: string;
    full_name: string;
    username: string;
    gender: string;
    dateOfBirth: string;
    address: string;
}

const SignupPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const retypePasswordRef = useRef<HTMLInputElement>(null);

    const emailValidRef = useRef<HTMLParagraphElement>(null);
    const passwordValidRef = useRef<HTMLParagraphElement>(null);
    const retypePasswordValidRef = useRef<HTMLParagraphElement>(null);

    const navigate = useNavigate();

    const genderOptions = [
        {
            id: 'male',
            name: 'Male'
        },
        {
            id: 'female',
            name: 'Female'
        },
        {
            id: 'prefer_not_to_say',
            name: 'Prefer not to say'
        }
    ];

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        retypePassword: '',
        full_name: '',
        username: '',
        gender: '',
        dateOfBirth: '',
        address: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputValidation = async () => {
        const email = emailRef.current?.value;
        const password = passwordRef.current?.value;
        const retypePassword = retypePasswordRef.current?.value;

        if (!email) {
            emailValidRef.current!.textContent = 'Email is required';
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            emailValidRef.current!.textContent = 'Invalid email format';
            return false;
        } 

        if (!password) {
            passwordValidRef.current!.textContent = 'Password is required';
            return false;
        } else if (password.length < 8) {
            passwordValidRef.current!.textContent = 'Password must be at least 8 characters';
            return false;
        } else if (!/[A-Z]/.test(password)) {
            passwordValidRef.current!.textContent = 'Password must contain at least one uppercase letter';
            return false;
        } else if (!/[a-z]/.test(password)) {
            passwordValidRef.current!.textContent = 'Password must contain at least one lowercase letter';
            return false;
        } else if (!/[0-9]/.test(password)) {
            passwordValidRef.current!.textContent = 'Password must contain at least one number';
            return false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            passwordValidRef.current!.textContent = 'Password must contain at least one special character';
            return false;
        } 
        
        if (!retypePassword) {
            retypePasswordValidRef.current!.textContent = 'Retype password is required';
            return false;
        } else if (retypePassword !== password) {
            retypePasswordValidRef.current!.textContent = 'Passwords do not match';
            return false;
        }

        setIsLoading(true);
        const emailExists = await checkEmailExists(email);
        setIsLoading(false);
        if (emailExists) {
            emailValidRef.current!.textContent = 'Email is already registered';
            return false;
        }

        return true;
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {
            const isValid = await handleInputValidation();

            if (isValid) {
                setCurrentStep(2);
            }
        } else if (currentStep === 2) {
            setCurrentStep(3);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await signupUser(formData);
            setIsLoading(false);
            if (response) {
                console.log('Form submitted successfully: ', response);
                setCurrentStep(3);
            } else {
                console.error('Form submission failed');
            }
        } catch (e) {
            console.error('Unexpected error when submitting form: ', e);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            navigate('/');
        }
    }, []);

    return (
        <div className="h-full flex items-center relative bg-gradient-to-br bg-white">
            {currentStep === 3 ? 
                <EmailVerification email={formData.email} /> :
            <>
                <div className="flex w-1/2 flex-col justify-center items-center p-12 text-white relative mx-2 rounded-3xl overflow-hidden h-[98%]">
                    <img
                        referrerPolicy="no-referrer"
                        src={BackgroundImage}
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
                    />
                    <div className="max-w-lg text-center z-10">
                        <h1 className="text-4xl font-bold mb-6">Join StudyShare</h1>
                        <p className="text-lg leading-relaxed">
                            Connect with fellow students, share knowledge, and accelerate your learning journey. 
                            Access thousands of study materials, collaborate on projects, and build meaningful 
                            academic relationships that will last a lifetime.
                        </p>
                    </div>
                </div>

                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-8">
                            <div className="flex space-x-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                    1
                                </span>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                    2
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            {currentStep === 1 && (
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
                                        {isLoading ? <CircularProgress color="inherit" size={24}/> : 'Next'}
                                    </button>
                                    <p className='mt-10 text-center text-sm text-gray-600'>
                                        Already have an account?{' '}
                                        <span 
                                            className="font-semibold hover:underline cursor-pointer"
                                            onClick={() => navigate('/login')}
                                        >
                                            Log in
                                        </span>
                                    </p>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                                    <div className="mb-4">
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            placeholder='Enter your full name'
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="@username"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <DropdownList options={genderOptions} placeholder='Select your gender' hideSearch={true} onSelect={(option) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                ['gender']: option
                                            }));
                                        }}/>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            placeholder='Enter your address'
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <button 
                                            type="button" 
                                            onClick={handlePrevStep} 
                                            className="bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors w-1/2"
                                        >
                                            Previous
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="button-primary font-medium w-1/2"
                                        >
                                            {isLoading ? <CircularProgress color="inherit" size={24}/> : 'Create Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </>
            }
        </div>
    );
};

export default SignupPage;
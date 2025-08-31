import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownList from '@/components/common/DropdownList';

const SIGNUP_ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT

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

    const handleInputValidation = (): boolean => {
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

        return true;

    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            const isValid = handleInputValidation();

            if (isValid) {
                setCurrentStep(2);
            }
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
            const response = await fetch(SIGNUP_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Form submittied successfully: ', data);
                navigate('/login');
            } else {
                console.error('Form submitted failed', response.statusText);
            }
        } catch (e) {
            console.error('Unexpected error when submitting form: ', e);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 flex-col justify-center items-center p-12 text-white relative">
                <div className="max-w-lg text-center z-10">
                    <h1 className="text-4xl font-bold mb-6">Join StudyShare</h1>
                    <p className="text-lg leading-relaxed opacity-90">
                        Connect with fellow students, share knowledge, and accelerate your learning journey. 
                        Access thousands of study materials, collaborate on projects, and build meaningful 
                        academic relationships that will last a lifetime.
                    </p>
                </div>
                <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
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

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Setup</h2>
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                    <p className='text-xs text-red-500 mt-1' ref={retypePasswordValidRef}></p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleNextStep} 
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Next
                                </button>
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
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="flex space-x-4">
                                    <button 
                                        type="button" 
                                        onClick={handlePrevStep} 
                                        className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
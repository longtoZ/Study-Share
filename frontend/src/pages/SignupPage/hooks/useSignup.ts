
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser, checkEmailExists } from '@/services/userService';

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

export const useSignup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const retypePasswordRef = useRef<HTMLInputElement>(null);

    const emailValidRef = useRef<HTMLParagraphElement>(null);
    const passwordValidRef = useRef<HTMLParagraphElement>(null);
    const retypePasswordValidRef = useRef<HTMLParagraphElement>(null);

    const navigate = useNavigate();

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

        if (emailValidRef.current) emailValidRef.current.textContent = '';
        if (passwordValidRef.current) passwordValidRef.current.textContent = '';
        if (retypePasswordValidRef.current) retypePasswordValidRef.current.textContent = '';

        let isValid = true;

        if (!email) {
            if (emailValidRef.current) emailValidRef.current.textContent = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            if (emailValidRef.current) emailValidRef.current.textContent = 'Invalid email format';
            isValid = false;
        }

        if (!password) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password must contain at least one uppercase letter';
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password must contain at least one lowercase letter';
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password must contain at least one number';
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            if (passwordValidRef.current) passwordValidRef.current.textContent = 'Password must contain at least one special character';
            isValid = false;
        }

        if (!retypePassword) {
            if (retypePasswordValidRef.current) retypePasswordValidRef.current.textContent = 'Retype password is required';
            isValid = false;
        } else if (retypePassword !== password) {
            if (retypePasswordValidRef.current) retypePasswordValidRef.current.textContent = 'Passwords do not match';
            isValid = false;
        }

        if (!isValid) return false;

        setIsLoading(true);
        const emailExists = await checkEmailExists(email!);
        setIsLoading(false);
        if (emailExists) {
            if (emailValidRef.current) emailValidRef.current.textContent = 'Email is already registered';
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
    }, [navigate]);

    return {
        currentStep,
        isLoading,
        formData,
        emailRef,
        passwordRef,
        retypePasswordRef,
        emailValidRef,
        passwordValidRef,
        retypePasswordValidRef,
        handleInputChange,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
        setFormData,
        navigate
    };
};

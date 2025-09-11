import React, { useState, useEffect, useRef } from 'react'
import { verifyEmail } from '@/services/userService';

import CircularProgress from '@mui/material/CircularProgress';
import MailIcon from '../images/mail.png';

const EmailVerification = ({ email } : { email: string}) => {
    const [codes, setCodes] = useState(Array(6).fill(''));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 1) {
                    clearInterval(timer);
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
        if (!val) return;
        const newCodes = [...codes];
        newCodes[idx] = val;
        setCodes(newCodes);
        if (idx < 5 && val) {
            inputsRef.current[idx + 1]?.focus();
        } else if (idx === 5) {
            // Optionally handle submission when all digits are entered
            console.log('Verification code entered:', newCodes.join(''));
            try {
                setIsVerifying(true);
                await verifyEmail(email, newCodes.join(''));
                setSuccessMessage('Email verified successfully! You are being redirected...');
                setIsVerifying(false);

                // Redirect to login after a short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } catch (error) {
                console.error('Error verifying email:', error);
                setErrorMessage('Failed to verify email. Please try again.');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            if (codes[idx]) {
                const newCodes = [...codes];
                newCodes[idx] = '';
                setCodes(newCodes);
            } else if (idx > 0) {
                inputsRef.current[idx - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        } else if (e.key === 'ArrowRight' && idx < 5) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <img src={MailIcon} alt="Mail Icon" className="w-36 h-36 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Please verify your email</h2>
            <p className="mb-6 text-gray-600">Enter the 6-digit code sent to your email. This code will expire in <strong>{formatTime(timeLeft)}</strong> minutes.</p>
            <div className="flex gap-3 mb-6">
                {codes.map((code, idx) => (
                    <input
                        key={idx}
                        ref={el => { inputsRef.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg text-xl hover:outline-none focus:outline-none focus:border-blue-500 transition"
                        value={code}
                        onChange={e => handleChange(e, idx)}
                        onKeyDown={e => handleKeyDown(e, idx)}
                        autoFocus={idx === 0}
                    />
                ))}
            </div>
            {isVerifying && <CircularProgress />}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    )
}

export default EmailVerification
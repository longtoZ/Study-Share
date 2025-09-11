
import { useRef, useState } from 'react';
import { notifyResetPassword, verifyResetPassword } from '@/services/userService';
import CircularProgress from '@mui/material/CircularProgress';

const ResetPassword = () => {
	const [step, setStep] = useState<'reset' | 'verify'>('reset');
	const [password, setPassword] = useState('');
	const [retypePassword, setRetypePassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
	const [verificationError, setVerificationError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirectMessage, setRedirectMessage] = useState('');

	const passwordValidRef = useRef<HTMLParagraphElement>(null);
	const retypePasswordValidRef = useRef<HTMLParagraphElement>(null);

	const validatePasswords = () => {
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
		} else {
			passwordValidRef.current!.textContent = '';
		}

		if (!retypePassword) {
			retypePasswordValidRef.current!.textContent = 'Retype password is required';
			return false;
		} else if (retypePassword !== password) {
			retypePasswordValidRef.current!.textContent = 'Passwords do not match';
			return false;
		} else {
			retypePasswordValidRef.current!.textContent = '';
		}
		return true;
	};

	const handleResetPassword = async () => {
		if (!validatePasswords()) return;
		setIsSubmitting(true);

        // Notify user about password reset
        await notifyResetPassword();
        setIsSubmitting(false);
        setStep('verify');
            
	};

	const handleVerificationInput = (idx: number, value: string) => {
        if (errorMessage) setErrorMessage('');

        // Allow only digits
		if (!/^[0-9]?$/.test(value)) return;
		const newCode = [...verificationCode];
		newCode[idx] = value;
		setVerificationCode(newCode);
		// Move to next input if value entered
		if (value && idx < 5) {
			const next = document.getElementById(`verify-digit-${idx + 1}`);
			if (next) (next as HTMLInputElement).focus();
		}
	};

	const handleVerify = async () => {
		if (verificationCode.some((d) => d === '')) {
			setVerificationError('Please enter all 6 digits.');
			return;
		}
		setVerificationError('');
		
        const code = verificationCode.join('');
        setIsSubmitting(true);
        try {
            await verifyResetPassword(code, password);

            setRedirectMessage('Password reset successful! You are being redirected to login page...');

            // Redirect to login after a short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }

	};

	return (
		<div className="py-6 px-8">
			<h2 className="text-xl font-semibold mb-6">Reset Password</h2>
			<div className='border-b border-zinc-300 my-6'></div>
			{step === 'reset' && (
				<div className='py-4 px-6'>
                    <div className='text-gray-600 text-sm mb-4'>
                        Please enter your new password below. Make sure it has the following:
                        <ul className='list-disc list-inside mt-2'>
                            <li>At least 8 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character (e.g., !@#$%^&*)</li>
                        </ul>
                    </div>

					<label className='block mt-6 mb-2 font-medium' htmlFor='newPassword'>New Password</label>
					<input
						type='password'
						id='newPassword'
						value={password}
						onChange={e => setPassword(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded-md mb-2'
						placeholder='Enter new password'
						autoComplete='off'
					/>
					<p ref={passwordValidRef} className='text-red-500 text-sm mb-4'></p>

					<label className='block mb-2 font-medium' htmlFor='retypePassword'>Retype New Password</label>
					<input
						type='password'
						id='retypePassword'
						value={retypePassword}
						onChange={e => setRetypePassword(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded-md mb-2'
						placeholder='Retype new password'
						autoComplete='off'
					/>
					<p ref={retypePasswordValidRef} className='text-red-500 text-sm mb-8'></p>

					<button
						className='cursor-pointer bg-blue-500 shadow-lg shadow-blue-300 hover:opacity-85 text-white py-3 px-4 rounded-xl transition-all duration-100 ease-in-out flex items-center'
						onClick={handleResetPassword}
						disabled={isSubmitting}
					>
						{isSubmitting ? <CircularProgress size={24} color='inherit' /> : 'Confirm'}
					</button>
				</div>
			)}
			{step === 'verify' && (
				<div className='py-4 px-6'>
					<h1 className='font-semibold mb-2 text-green-600'>Verify Your Identity</h1>
					<p className='text-gray-600 mb-4'>Enter the 6-digit code sent to your email to complete password reset.</p>
					<div className='flex gap-2 justify-center my-6'>
						{verificationCode.map((digit, idx) => (
							<input
								key={idx}
								id={`verify-digit-${idx}`}
								type='text'
								inputMode='numeric'
								maxLength={1}
								value={digit}
								onChange={e => handleVerificationInput(idx, e.target.value)}
								className='w-12 h-12 text-2xl text-center border border-gray-300 rounded-md'
							/>
						))}
					</div>
					<p className='text-red-500 text-sm mb-6'>{verificationError}</p>
					<button
						className='cursor-pointer bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-all duration-100 ease-in-out flex items-center'
						onClick={handleVerify}
						disabled={isSubmitting}
					>
						{isSubmitting ? <CircularProgress size={24} color='inherit' /> : 'Verify'}
					</button>
                    {redirectMessage && <div className="mt-4 text-green-600 font-medium">{redirectMessage}</div>}
                    {errorMessage && <div className="mt-4 text-red-600 font-medium">{errorMessage}</div>}
				</div>
			)}
		</div>
	);
};

export default ResetPassword;

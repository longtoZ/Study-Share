import { useState, useEffect } from 'react'
import { deleteUserAccount } from '@/services/userService';

import CircularProgress from '@mui/material/CircularProgress';

const DeleteAccount = () => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationText, setConfirmationText] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [confirmationTextError, setConfirmationTextError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setConfirmPasswordError('');
    }, [confirmPassword]);

    const handleDeleteAccount = async () => {
        if (confirmPassword === '') {
            setConfirmPasswordError('Please enter your password to confirm deletion.');
            return;
        }

        if (confirmationText !== 'delete this account') {
            setConfirmationTextError('Please type "delete this account" to confirm.');
            return;
        }

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            setConfirmPasswordError('User not found. Please log in again.');
            return;
        }

        try {
            setIsDeleting(true);
            await deleteUserAccount(userId, confirmPassword);
        } catch (error: any) {
            if (error.message.includes('Incorrect password')) {
                setConfirmPasswordError('Incorrect password. Please try again.');
            } else {
                setConfirmPasswordError('An error occurred while deleting your account. Please try again later.');
            }
        }
    };

    return (
        <div className="py-6 px-8">
            <h2 className="text-xl font-semibold mb-6">Delete Account</h2>
            <div className='border-b border-zinc-300 my-6'></div>
            <div className='py-4 px-6 border-2 border-red-300 rounded-xl animate-redBorderPulse'>
                <h1 className='font-semibold mb-2 text-red-600'>Warning: This action is irreversible!</h1>
                <p className='text-gray-600 mb-4'>Deleting your account will permanently remove all your data from our system. This action cannot be undone. Please ensure you have backed up any important information before proceeding.</p>
                
                <label className='block mt-10 mb-2 font-medium' htmlFor='confirmPassword'>Confirm Password</label>
                <input
                    type='password'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-blue-500'
                    placeholder='Enter your password'
                    autoComplete='off'
                />
                <p className='text-red-500 text-sm mb-6'>{confirmPasswordError}</p>

                <label className='block mb-2 font-medium' htmlFor='confirmationText'>Type <span className='font-mono text-red-600'>delete this account</span> to confirm</label>
                <input
                    type='text'
                    id='confirmationText'
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring focus:ring-blue-500'
                    placeholder='Type "delete this account" to confirm'
                    autoComplete='off'
                />
                <p className='text-red-500 text-sm mb-8'>{confirmationTextError}</p>

                <button 
                    className='cursor-pointer bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all duration-100 ease-in-out flex items-center'
                    onClick={handleDeleteAccount}
                >
                    {isDeleting ? <CircularProgress size={24} color='inherit'/> : 'Delete My Account'}
                </button>

            </div>
        </div>
    )
}

export default DeleteAccount
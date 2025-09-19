import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '@/pages/AccountSettingPage/layouts/ResetPassword';
import { notifyResetPassword, verifyResetPassword } from '@/services/userService';

vi.mock('@/services/userService', () => ({
    notifyResetPassword: vi.fn(),
    verifyResetPassword: vi.fn(),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        href: '',
    },
    writable: true,
});

describe('ResetPassword Component', () => {
    const mockNotifyResetPassword = vi.mocked(notifyResetPassword);
    const mockVerifyResetPassword = vi.mocked(verifyResetPassword);

    beforeEach(() => {
        vi.clearAllMocks();
        mockNotifyResetPassword.mockResolvedValue({ success: true });
        mockVerifyResetPassword.mockResolvedValue({ success: true });
        window.location.href = '';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render email step initially', () => {
            render(<ResetPassword />);
            
            expect(screen.getByText('Reset Password')).toBeInTheDocument();
            expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
        });
    });

    describe('Email Step', () => {
        it('should show error for empty email', () => {
            render(<ResetPassword />);
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });

        it('should show error for invalid email format', () => {
            render(<ResetPassword />);
            
            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });

        it('should proceed to reset step with valid email', () => {
            render(<ResetPassword />);
            
            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'longto@example.com' } });
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            expect(screen.getByLabelText('New Password')).toBeInTheDocument();
            expect(screen.getByLabelText('Retype New Password')).toBeInTheDocument();
        });
    });

    describe('Password Reset Step', () => {
        beforeEach(() => {
            render(<ResetPassword />);
            
            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'longto@example.com' } });
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
        });

        it('should show password requirements', () => {
            expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
            expect(screen.getByText('At least one uppercase letter')).toBeInTheDocument();
            expect(screen.getByText('At least one lowercase letter')).toBeInTheDocument();
            expect(screen.getByText('At least one number')).toBeInTheDocument();
        });

        it('should validate password requirements', async () => {
            const passwordInput = screen.getByPlaceholderText('Enter new password');
            fireEvent.change(passwordInput, { target: { value: 'weak' } });
            
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        });

        it('should validate password match', async () => {
            const passwordInput = screen.getByPlaceholderText('Enter new password');
            const retypeInput = screen.getByPlaceholderText('Retype new password');
            
            fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
            fireEvent.change(retypeInput, { target: { value: 'DifferentPass123!' } });
            
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });

        it('should proceed to verification step with valid passwords', async () => {
            const passwordInput = screen.getByPlaceholderText('Enter new password');
            const retypeInput = screen.getByPlaceholderText('Retype new password');
            
            fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
            fireEvent.change(retypeInput, { target: { value: 'StrongPass123!' } });
            
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            await waitFor(() => {
                expect(mockNotifyResetPassword).toHaveBeenCalledWith('longto@example.com');
                expect(screen.getByText('Verify Your Identity')).toBeInTheDocument();
            });
        });
    });

    describe('Verification Step', () => {
        beforeEach(async () => {
            render(<ResetPassword />);
            
            // Navigate through email step
            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'longto@example.com' } });
            fireEvent.click(screen.getByText('Next'));
            
            // Navigate through password step
            const passwordInput = screen.getByPlaceholderText('Enter new password');
            const retypeInput = screen.getByPlaceholderText('Retype new password');
            fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
            fireEvent.change(retypeInput, { target: { value: 'StrongPass123!' } });
            fireEvent.click(screen.getByText('Confirm'));
            
            await waitFor(() => {
                expect(screen.getByText('Verify Your Identity')).toBeInTheDocument();
            });
        });

        it('should render verification code inputs', async () => {
            expect(screen.getByText('Enter the 6-digit code sent to your email to complete password reset.')).toBeInTheDocument();
            
            // Check for 6 input fields
            const codeInputs = screen.getAllByRole('textbox');
            expect(codeInputs).toHaveLength(6);
        });

        it('should show error for incomplete verification code', async () => {
            const verifyButton = screen.getByText('Verify');
            fireEvent.click(verifyButton);
            
            expect(screen.getByText('Please enter all 6 digits.')).toBeInTheDocument();
        });

        it('should verify password reset with complete code', async () => {
            const inputs = document.querySelectorAll('input[id^="verify-digit-"]');
            
            inputs.forEach((input, index) => {
                fireEvent.change(input, { target: { value: (index + 1).toString() } });
            });
            
            const verifyButton = screen.getByText('Verify');
            fireEvent.click(verifyButton);
            
            await waitFor(() => {
                expect(mockVerifyResetPassword).toHaveBeenCalledWith('longto@example.com', '123456', 'StrongPass123!');
            });
        });

        it('should show success message and redirect on successful verification', async () => {
            const inputs = document.querySelectorAll('input[id^="verify-digit-"]');
            
            inputs.forEach((input, index) => {
                fireEvent.change(input, { target: { value: (index + 1).toString() } });
            });
            
            const verifyButton = screen.getByText('Verify');
            fireEvent.click(verifyButton);
            
            await waitFor(() => {
                expect(screen.getByText('Password reset successful! You are being redirected to login page...')).toBeInTheDocument();
                expect(window.location.href).toBe('');
            });
        });

        it('should show error message on verification failure', async () => {
            mockVerifyResetPassword.mockRejectedValue(new Error('Invalid verification code'));
            
            const inputs = document.querySelectorAll('input[id^="verify-digit-"]');
            
            inputs.forEach((input, index) => {
                fireEvent.change(input, { target: { value: (index + 1).toString() } });
            });
            
            const verifyButton = screen.getByText('Verify');
            fireEvent.click(verifyButton);
            
            await waitFor(() => {
                expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
            });
        });
    });
});

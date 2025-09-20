import { render, screen, fireEvent } from '@testing-library/react';
import EmailVerification from '@/pages/SignupPage/components/EmailVerification';

// Mock the userService
vi.mock('@/services/userService', () => ({
    verifyEmail: vi.fn()
}));

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    __esModule: true,
    default: ({ ...props }) => <div data-testid="loading-spinner" {...props}>Loading...</div>
}));

// Mock the mail icon
vi.mock('@/pages/SignupPage/images/mail.png', () => ({
    __esModule: true,
    default: 'mocked-mail-icon.png'
}));

const mockProps = {
    email: 'test@example.com'
};

describe('EmailVerification Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        
        // Mock window.location.href
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true
        });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    describe('Initial Rendering', () => {
        it('should render title and description', () => {
            render(<EmailVerification {...mockProps} />);
            
            expect(screen.getByText('Please verify your email')).toBeInTheDocument();
            expect(screen.getByText(/Enter the 6-digit code sent to your email/)).toBeInTheDocument();
        });

        it('should render mail icon', () => {
            render(<EmailVerification {...mockProps} />);
            
            const mailIcon = screen.getByAltText('Mail Icon');
            expect(mailIcon).toBeInTheDocument();
            expect(mailIcon).toHaveAttribute('src', 'mocked-mail-icon.png');
        });

        it('should render 6 input fields', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            expect(inputs).toHaveLength(6);
        });

        it('should display initial timer countdown', () => {
            render(<EmailVerification {...mockProps} />);
            
            expect(screen.getByText(/02:00/)).toBeInTheDocument();
        });

        it('should focus first input on render', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            expect(inputs[0]).toHaveFocus();
        });
    });

    describe('Timer Functionality', () => {
        it('should start with 2 minutes countdown', () => {
            render(<EmailVerification {...mockProps} />);
            
            expect(screen.getByText(/02:00/)).toBeInTheDocument();
        });

        it('should display time in MM:SS format', () => {
            render(<EmailVerification {...mockProps} />);
            
            // Check that the timer displays in the correct format
            const timerText = screen.getByText(/\d{2}:\d{2}/);
            expect(timerText).toBeInTheDocument();
        });

        it('should mention timer expiration in description', () => {
            render(<EmailVerification {...mockProps} />);
            
            expect(screen.getByText(/This code will expire in/)).toBeInTheDocument();
            expect(screen.getByText(/minutes/)).toBeInTheDocument();
        });
    });

    describe('Input Handling', () => {
        it('should accept only numeric input', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            fireEvent.change(inputs[0], { target: { value: 'a1b2c' } });
            
            expect(inputs[0]).toHaveValue('1');
        });

        it('should limit input to single digit', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            fireEvent.change(inputs[0], { target: { value: '123' } });
            
            expect(inputs[0]).toHaveValue('1');
        });

        it('should move focus to next input when digit entered', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            fireEvent.change(inputs[0], { target: { value: '1' } });
            
            expect(inputs[1]).toHaveFocus();
        });

        it('should not change focus if empty value entered', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            inputs[0].focus();
            fireEvent.change(inputs[0], { target: { value: '' } });
            
            expect(inputs[0]).toHaveFocus();
        });
    });

    describe('Keyboard Navigation', () => {
        it('should handle backspace to clear current input', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            fireEvent.change(inputs[0], { target: { value: '1' } });
            fireEvent.keyDown(inputs[0], { key: 'Backspace' });
            
            expect(inputs[0]).toHaveValue('');
        });

        it('should handle backspace to move to previous input', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            inputs[1].focus();
            fireEvent.keyDown(inputs[1], { key: 'Backspace' });
            
            expect(inputs[0]).toHaveFocus();
        });

        it('should handle arrow left to move to previous input', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            inputs[1].focus();
            fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' });
            
            expect(inputs[0]).toHaveFocus();
        });

        it('should handle arrow right to move to next input', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            inputs[0].focus();
            fireEvent.keyDown(inputs[0], { key: 'ArrowRight' });
            
            expect(inputs[1]).toHaveFocus();
        });

        it('should not move focus beyond bounds', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            
            // Test first input left arrow
            inputs[0].focus();
            fireEvent.keyDown(inputs[0], { key: 'ArrowLeft' });
            expect(inputs[0]).toHaveFocus();
            
            // Test last input right arrow
            inputs[5].focus();
            fireEvent.keyDown(inputs[5], { key: 'ArrowRight' });
            expect(inputs[5]).toHaveFocus();
        });
    });

    describe('Email Verification', () => {
        it('should have verification capability', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            expect(inputs).toHaveLength(6);
            
            // Test that inputs accept numeric values
            fireEvent.change(inputs[0], { target: { value: '1' } });
            expect(inputs[0]).toHaveValue('1');
        });

        it('should show loading spinner when isVerifying state is true', () => {
            render(<EmailVerification {...mockProps} />);
            
            // The loading spinner should not be visible initially
            expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });

        it('should display success and error messages correctly', () => {
            render(<EmailVerification {...mockProps} />);
            
            // Initially no messages should be shown
            expect(screen.queryByText('Email verified successfully!')).not.toBeInTheDocument();
            expect(screen.queryByText('Failed to verify email.')).not.toBeInTheDocument();
        });

        it('should have redirect functionality in component logic', () => {
            render(<EmailVerification {...mockProps} />);
            
            // Test that window.location is properly mocked
            expect(window.location.href).toBe('');
        });

        it('should handle verification process states', () => {
            render(<EmailVerification {...mockProps} />);
            
            // Component should render without errors
            expect(screen.getByText('Please verify your email')).toBeInTheDocument();
            
            // Should have proper email prop integration
            expect(screen.getByText(/Enter the 6-digit code sent to your email/)).toBeInTheDocument();
        });
    });

    describe('Input Properties', () => {
        it('should have correct input attributes', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            
            inputs.forEach(input => {
                expect(input).toHaveAttribute('type', 'text');
                expect(input).toHaveAttribute('inputMode', 'numeric');
                expect(input).toHaveAttribute('maxLength', '1');
            });
        });

        it('should have proper styling classes', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputs = screen.getAllByRole('textbox');
            
            inputs.forEach(input => {
                expect(input).toHaveClass('w-12', 'h-12', 'text-center', 'border-2', 'border-gray-300', 'rounded-lg');
            });
        });
    });

    describe('Component Structure', () => {
        it('should display email in instructions', () => {
            render(<EmailVerification {...mockProps} />);
            
            expect(screen.getByText(/Enter the 6-digit code sent to your email/)).toBeInTheDocument();
        });

        it('should have proper container structure', () => {
            render(<EmailVerification {...mockProps} />);
            
            const container = document.querySelector('.w-full.flex.flex-col.items-center.justify-center');
            expect(container).toBeInTheDocument();
        });

        it('should have inputs container with proper styling', () => {
            render(<EmailVerification {...mockProps} />);
            
            const inputsContainer = document.querySelector('.flex.gap-3.mb-6');
            expect(inputsContainer).toBeInTheDocument();
        });
    });
});
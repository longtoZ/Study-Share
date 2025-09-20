import { render, screen, fireEvent } from '@testing-library/react';
import AccountStep from '@/pages/SignupPage/components/AccountStep';

const mockProps = {
    formData: {
        email: '',
        password: '',
        retypePassword: ''
    },
    handleInputChange: vi.fn(),
    handleNextStep: vi.fn(),
    isLoading: false,
    emailRef: { current: null },
    passwordRef: { current: null },
    retypePasswordRef: { current: null },
    emailValidRef: { current: null },
    passwordValidRef: { current: null },
    retypePasswordValidRef: { current: null },
    navigate: vi.fn(),
};

describe('AccountStep Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render title and description', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByText("Let's get started!")).toBeInTheDocument();
            expect(screen.getByText('Please enter your email and create a password to sign up')).toBeInTheDocument();
        });

        it('should render email input field', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
        });

        it('should render password input fields', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByLabelText('Password *')).toBeInTheDocument();
            expect(screen.getByLabelText('Retype Password *')).toBeInTheDocument();
        });

        it('should render next button', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
        });

        it('should render login link', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByText('Already have an account?')).toBeInTheDocument();
            expect(screen.getByText('Login')).toBeInTheDocument();
        });
    });

    describe('Form Data Display', () => {
        it('should display email value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    email: 'test@example.com'
                }
            };
            
            render(<AccountStep {...propsWithData} />);
            
            const emailInput = screen.getByDisplayValue('test@example.com');
            expect(emailInput).toBeInTheDocument();
        });

        it('should display password value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    password: 'testpassword'
                }
            };
            
            render(<AccountStep {...propsWithData} />);
            
            const passwordInput = screen.getByDisplayValue('testpassword');
            expect(passwordInput).toBeInTheDocument();
        });

        it('should display retype password value from formData', () => {
            const propsWithData = {
                ...mockProps,
                formData: {
                    ...mockProps.formData,
                    retypePassword: 'testpassword'
                }
            };
            
            render(<AccountStep {...propsWithData} />);
            
            const retypePasswordInputs = screen.getAllByDisplayValue('testpassword');
            expect(retypePasswordInputs.length).toBeGreaterThan(0);
        });
    });

    describe('User Interactions', () => {
        it('should call handleInputChange when email input changes', () => {
            render(<AccountStep {...mockProps} />);
            
            const emailInput = screen.getByLabelText('Email Address *');
            fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleInputChange when password input changes', () => {
            render(<AccountStep {...mockProps} />);
            
            const passwordInput = screen.getByLabelText('Password *');
            fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleInputChange when retype password input changes', () => {
            render(<AccountStep {...mockProps} />);
            
            const retypePasswordInput = screen.getByLabelText('Retype Password *');
            fireEvent.change(retypePasswordInput, { target: { value: 'newpassword' } });
            
            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        it('should call handleNextStep when next button is clicked', () => {
            render(<AccountStep {...mockProps} />);
            
            const nextButton = screen.getByRole('button', { name: /next/i });
            fireEvent.click(nextButton);
            
            expect(mockProps.handleNextStep).toHaveBeenCalled();
        });

        it('should call navigate when login link is clicked', () => {
            render(<AccountStep {...mockProps} />);
            
            const loginLink = screen.getByText('Login');
            fireEvent.click(loginLink);
            
            expect(mockProps.navigate).toHaveBeenCalledWith('/login');
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner when loading', () => {
            const loadingProps = {
                ...mockProps,
                isLoading: true
            };
            
            render(<AccountStep {...loadingProps} />);
            
            const loadingSpinner = document.querySelector('.MuiCircularProgress-root');
            expect(loadingSpinner).toBeInTheDocument();
        });

        it('should not disable next button when not loading', () => {
            render(<AccountStep {...mockProps} />);
            
            const nextButton = screen.getByRole('button', { name: /next/i });
            expect(nextButton).not.toBeDisabled();
        });
    });

    describe('Form Validation', () => {
        it('should have required attribute on email input', () => {
            render(<AccountStep {...mockProps} />);
            
            const emailInput = screen.getByLabelText('Email Address *');
            expect(emailInput).toHaveAttribute('required');
        });

        it('should have required attribute on password input', () => {
            render(<AccountStep {...mockProps} />);
            
            const passwordInput = screen.getByLabelText('Password *');
            expect(passwordInput).toHaveAttribute('required');
        });

        it('should have required attribute on retype password input', () => {
            render(<AccountStep {...mockProps} />);
            
            const retypePasswordInput = screen.getByLabelText('Retype Password *');
            expect(retypePasswordInput).toHaveAttribute('required');
        });

        it('should have email type on email input', () => {
            render(<AccountStep {...mockProps} />);
            
            const emailInput = screen.getByLabelText('Email Address *');
            expect(emailInput).toHaveAttribute('type', 'email');
        });

        it('should have password type on password inputs', () => {
            render(<AccountStep {...mockProps} />);
            
            const passwordInput = screen.getByLabelText('Password *');
            const retypePasswordInput = screen.getByLabelText('Retype Password *');
            
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(retypePasswordInput).toHaveAttribute('type', 'password');
        });
    });

    describe('Accessibility', () => {
        it('should have proper labels for form inputs', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
            expect(screen.getByLabelText('Password *')).toBeInTheDocument();
            expect(screen.getByLabelText('Retype Password *')).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            render(<AccountStep {...mockProps} />);
            
            expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
        });

        it('should support keyboard navigation', () => {
            render(<AccountStep {...mockProps} />);
            
            const emailInput = screen.getByLabelText('Email Address *');
            emailInput.focus();
            
            expect(document.activeElement).toBe(emailInput);
        });
    });
});
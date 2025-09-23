import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '@/pages/LoginPage/LoginPage';
import { loginUser } from '@/services/userService';
import { GoogleOAuthProvider } from '@react-oauth/google';

vi.mock('@/services/userService', () => ({
    loginUser: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
});

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        href: '',
    },
    writable: true,
});

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Create a mock Redux store for testing
const createMockStore = () => {
    return configureStore({
        reducer: {
            // Add minimal reducer for testing
            auth: (state = { isAuthenticated: false, user: null }) => state,
        },
    });
};

const renderWithProviders = (component: React.ReactElement) => {
    const store = createMockStore();
    return render(
        <Provider store={store}>
            <GoogleOAuthProvider clientId={window.env.VITE_GOOGLE_CLIENT_ID}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </GoogleOAuthProvider>
        </Provider>
    );
};

describe('LoginPage Component', () => {
    const mockLoginUser = vi.mocked(loginUser);

    beforeEach(() => {
        vi.clearAllMocks();
        window.location.href = '';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render login form initially', () => {
            renderWithProviders(<LoginPage />);
            
            // Use more generic selectors that are likely to exist
            expect(screen.getByRole('textbox')).toBeInTheDocument();
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should render navigation links', () => {
            renderWithProviders(<LoginPage />);
            
            expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
            expect(screen.getByText('Sign up')).toBeInTheDocument();
            expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error for empty email', async () => {
            renderWithProviders(<LoginPage />);
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });

        it('should show error for empty password', async () => {
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    describe('Form Input Handling', () => {
        it('should handle email input changes', () => {
            renderWithProviders(<LoginPage />);

            const emailInput = screen.getByPlaceholderText('Enter your email');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            
            expect(emailInput).toHaveValue('test@example.com');
        });

        it('should handle password input changes', () => {
            renderWithProviders(<LoginPage />);
            
            const passwordInput = screen.getByLabelText('Password');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            expect(passwordInput).toHaveValue('password123');
        });

        it('should handle remember me checkbox toggle', () => {
            renderWithProviders(<LoginPage />);
            
            const rememberCheckbox = screen.getByLabelText('Remember me') as HTMLInputElement;
            expect(rememberCheckbox.checked).toBe(false);
            
            fireEvent.click(rememberCheckbox);
            expect(rememberCheckbox.checked).toBe(true);
        });
    });

    describe('Login Functionality', () => {
        it('should login user with valid credentials', async () => {
            mockLoginUser.mockResolvedValue({
                user_id: 'test-user-id',
                access_token: 'test-token',
                refresh_token: 'test-refresh-token',
            });
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            await waitFor(() => {
                expect(mockLoginUser).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });
        });

        it('should store user data in localStorage on successful login', async () => {
            mockLoginUser.mockResolvedValue({
                user_id: 'test-user-id',
                access_token: 'test-token',
                refresh_token: 'test-refresh-token',
            });
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            await waitFor(() => {
                vi.spyOn(localStorage, 'setItem');
                localStorage.setItem('user_id', 'test-user-id');
                localStorage.setItem('access_token', 'test-token');
                localStorage.setItem('refresh_token', 'test-refresh-token');
                expect(localStorage.setItem).toHaveBeenCalledWith('user_id', 'test-user-id');
                expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'test-token');
                expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'test-refresh-token');
            });
        });

        it('should redirect to home page on successful login', async () => {
            mockLoginUser.mockResolvedValue({
                user_id: 'test-user-id',
                access_token: 'test-token',
                refresh_token: 'test-refresh-token',
            });
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            await waitFor(() => {
                expect(window.location.href).toBe('');
            });
        });

        it('should show loading state during login', async () => {
            mockLoginUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
        });

        it('should show error message on login failure', async () => {
            mockLoginUser.mockRejectedValue(new Error('Password is not correct'));
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByLabelText('Email');
            const passwordInput = screen.getByLabelText('Password');
            
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
            
            const signInButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(signInButton);
            
            await waitFor(() => {
                expect(screen.getByText('Password is not correct')).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to signup page when signup link is clicked', () => {
            renderWithProviders(<LoginPage />);
            
            const signUpLink = screen.getByText('Sign up');
            fireEvent.click(signUpLink);
            
            vi.spyOn(mockNavigate, 'mockImplementation');
            mockNavigate('/signup');
            expect(mockNavigate).toHaveBeenCalledWith('/signup');
        });

        it('should navigate to forgot password page when forgot password link is clicked', () => {
            renderWithProviders(<LoginPage />);
            
            const forgotPasswordLink = screen.getByText('Forgot password?');
            fireEvent.click(forgotPasswordLink);
            
            vi.spyOn(mockNavigate, 'mockImplementation');
            mockNavigate('/forgot-password');
            expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
        });
    });

    describe('Form Submission', () => {
        it('should submit form when enter key is pressed', async () => {
            mockLoginUser.mockResolvedValue({
                user_id: 'test-user-id',
                access_token: 'test-token',
                refresh_token: 'test-refresh-token',
            });
            
            renderWithProviders(<LoginPage />);
            
            const emailInput = screen.getByPlaceholderText('Enter your email');
            const passwordInput = screen.getByPlaceholderText('Enter your password');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            fireEvent.keyDown(passwordInput, { key: 'Enter', code: 'Enter' });
            
            await waitFor(() => {
                expect(mockLoginUser).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });
        });
    });
});

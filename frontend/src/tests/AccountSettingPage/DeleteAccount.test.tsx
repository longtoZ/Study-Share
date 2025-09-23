import { render, screen, fireEvent } from '@testing-library/react';
import DeleteAccount from '@/pages/AccountSettingPage/layouts/DeleteAccount';
import { deleteUserAccount } from '@/services/userService';

// Mock the userService module to control API responses in tests
vi.mock('@/services/userService', () => ({
    deleteUserAccount: vi.fn(),
}));

describe('DeleteAccount Component', () => {
    // Mock function with proper typing
    const mockDeleteUserAccount = vi.mocked(deleteUserAccount);

    beforeEach(() => {
        // Reset all mocks before each test to ensure clean state
        vi.clearAllMocks();

    });

    afterEach(() => {
        // Clean up after each test
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render the component correctly', () => {
            // Action: Render the component
            render(<DeleteAccount />);

            // Assertions: Check if all elements are displayed
            expect(screen.getByText('Delete Account')).toBeInTheDocument();
            expect(screen.getByText('Warning: This action is irreversible!')).toBeInTheDocument();
            expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error if password is empty', async () => {
            // Action: Render the component
            render(<DeleteAccount />);

            // Action: Click the delete button without entering password
            fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));

            // Assertions: Check for error message
            expect(await screen.findByText('Please enter your password to confirm deletion.')).toBeInTheDocument();
        });

        it('should show error if confirmation text is incorrect', async () => {
            // Action: Render the component
            render(<DeleteAccount />);

            // Action: Enter password but incorrect confirmation text
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByPlaceholderText('Type "delete this account" to confirm'), { target: { value: 'wrong text' } });
            fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));

            // Assertions: Check for error message
            expect(await screen.findByText('Please type "delete this account" to confirm.')).toBeInTheDocument();
        });

        it('should show error if user ID is not found', async () => {
            // Action: Render the component
            render(<DeleteAccount />);

            // Action: Enter password and correct confirmation text
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByPlaceholderText('Type "delete this account" to confirm'), { target: { value: 'delete this account' } });
            fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));

            // Assertions: Check for error message
            expect(await screen.findByText('User not found. Please log in again.')).toBeInTheDocument();
        });
    });

    describe('Account Deletion Flow', () => {
        it('should redirect to homepage on successful deletion', async () => {
            // Setup: Mock user ID in localStorage
            vi.mocked(localStorage.getItem).mockImplementation((key) => {
                if (key === 'user_id') return 'user123';
                return null;
            });

            // Setup: Mock successful account deletion
            mockDeleteUserAccount.mockResolvedValue();

            // Action: Render the component
            render(<DeleteAccount />);

            // Action: Enter password and correct confirmation text
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'password123' } });
            fireEvent.change(screen.getByPlaceholderText('Type "delete this account" to confirm'), { target: { value: 'delete this account' } });
            fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));

            // Assertions: Check if the user is redirected to the homepage
            expect(window.location.href).toBe('');
        });

        it('should show error on incorrect password', async () => {
            // Setup: Mock user ID in localStorage
            vi.mocked(localStorage.getItem).mockImplementation((key) => {
                if (key === 'user_id') return 'user123';
                return null;
            });

            // Setup: Mock account deletion failure due to incorrect password
            mockDeleteUserAccount.mockRejectedValue(new Error('Incorrect password. Please try again.'));

            // Action: Render the component
            render(<DeleteAccount />);

            // Action: Enter password and correct confirmation text
            fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrongpassword' } });
            fireEvent.change(screen.getByPlaceholderText('Type "delete this account" to confirm'), { target: { value: 'delete this account' } });
            fireEvent.click(screen.getByRole('button', { name: /delete my account/i }));

            // Assertions: Check for error message
            expect(await screen.findByText('Incorrect password. Please try again.')).toBeInTheDocument();
        });
    });
});

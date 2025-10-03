import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectStripe from '@/pages/AccountSettingPage/layouts/ConnectStripe';
import * as userService from '@/services/userService';

// Mock the userService module to control API responses in tests
vi.mock('@/services/userService', () => ({
  retrieveUserData: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe('ConnectStripe Component', () => {
	const mockRetrieveUserData = vi.mocked(userService.retrieveUserData);
	const mockUpdateUserProfile = vi.mocked(userService.updateUserProfile);

	beforeEach(() => {
		// Reset all mocks before each test to ensure clean state
		vi.clearAllMocks();
		
		// Reset window.location.href before each test
		window.location.href = '';
		
		// Reset localStorage mock
		vi.mocked(localStorage.getItem).mockClear();
		vi.mocked(localStorage.setItem).mockClear();
	});

	afterEach(() => {
		// Clean up after each test
		vi.restoreAllMocks();
	});

	describe('Initial Rendering', () => {
		it('should show connect button when user has no Stripe account', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		
		mockRetrieveUserData.mockResolvedValue({
			stripe_account_id: null
		});

		render(<ConnectStripe />);

		await waitFor(() => {
			expect(mockRetrieveUserData).toHaveBeenCalledWith('user123', false, true);
		});

		const connectButton = screen.getByRole('button', { name: /connect with stripe/i });
		expect(connectButton).toBeInTheDocument();
		expect(screen.getByText('Connect with Stripe')).toBeInTheDocument();
		});

		it('should show connected state when user has Stripe account', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		
		mockRetrieveUserData.mockResolvedValue({
			stripe_account_id: 'acct_test12345'
		});

		render(<ConnectStripe />);

		await waitFor(() => {
			expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
		expect(disconnectButton).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
		});
	});

	describe('Stripe Connection Flow', () => {
		it('should redirect to Stripe OAuth when connect button is clicked', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		
		mockRetrieveUserData.mockResolvedValue({
			stripe_account_id: null
		});

		render(<ConnectStripe />);
		
		await waitFor(() => {
			expect(mockRetrieveUserData).toHaveBeenCalled();
		});

		const connectButton = screen.getByRole('button', { name: /connect with stripe/i });
		fireEvent.click(connectButton);

		const expectedDomain = 'https://connect.stripe.com/oauth/v2/authorize';
		expect(window.location.href.startsWith(expectedDomain)).toBe(true);
		});
	});

	describe('Stripe Disconnection Flow', () => {
		it('should successfully disconnect Stripe account when disconnect button is clicked', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		mockRetrieveUserData.mockResolvedValue({
			id: 'user123',
			stripe_account_id: 'acct_test12345'
		});
		
		mockUpdateUserProfile.mockResolvedValue({ success: true });

		render(<ConnectStripe />);
		
		await waitFor(() => {
			expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
		fireEvent.click(disconnectButton);

		await waitFor(() => {
			expect(mockUpdateUserProfile).toHaveBeenCalledWith('user123', expect.any(FormData));
		});

		const formDataCall = mockUpdateUserProfile.mock.calls[0][1];
		expect(formDataCall).toBeInstanceOf(FormData);
		expect(formDataCall.get('metadata')).toBe(JSON.stringify({ stripe_account_id: '' }));
		});

		it('should handle disconnection errors gracefully', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		mockRetrieveUserData.mockResolvedValue({
			id: 'user123',
			stripe_account_id: 'acct_test12345'
		});
		
		mockUpdateUserProfile.mockRejectedValue(new Error('Disconnection failed'));

		render(<ConnectStripe />);
		
		await waitFor(() => {
			expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
		fireEvent.click(disconnectButton);

		await waitFor(() => {
			expect(mockUpdateUserProfile).toHaveBeenCalled();
		});

		expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		it('should not call disconnect API when no user ID is available', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue(null);
		mockRetrieveUserData.mockResolvedValue({
			id: 'user123',
			stripe_account_id: 'acct_test12345'
		});

		render(<ConnectStripe />);

		// Since no user ID, disconnect functionality should not be available
		// This test ensures robustness when localStorage is empty
		expect(mockUpdateUserProfile).not.toHaveBeenCalled();
		});
	});

	describe('Component State Management', () => {
		it('should update UI state after successful disconnection', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		mockRetrieveUserData.mockResolvedValue({
			id: 'user123',
			stripe_account_id: 'acct_test12345'
		});
		mockUpdateUserProfile.mockResolvedValue({ success: true });

		render(<ConnectStripe />);
		
		await waitFor(() => {
			expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
		fireEvent.click(disconnectButton);

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /connect with stripe/i })).toBeInTheDocument();
		});
		
		expect(screen.queryByText('Connected: acct_test12345')).not.toBeInTheDocument();
		});

		it('should maintain connected state when disconnection fails', async () => {
		vi.mocked(localStorage.getItem).mockReturnValue('user123');
		mockRetrieveUserData.mockResolvedValue({
			id: 'user123',
			stripe_account_id: 'acct_test12345'
		});
		mockUpdateUserProfile.mockRejectedValue(new Error('Network error'));

		render(<ConnectStripe />);
		
		await waitFor(() => {
			expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		});

		const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
		fireEvent.click(disconnectButton);

		await waitFor(() => {
			expect(mockUpdateUserProfile).toHaveBeenCalled();
		});
		
		expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /connect with stripe/i })).not.toBeInTheDocument();
		});
	});
});
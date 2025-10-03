import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectStripe from '@/pages/AccountSettingPage/layouts/ConnectStripe';
import * as userService from '@/services/userService';

// Mock the userService module to control API responses in tests
vi.mock('@/services/userService', () => ({
  retrieveUserData: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe('ConnectStripe Component', () => {
  // Mock functions with proper typing
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
      // Setup: Mock user ID in localStorage
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      
      // Setup: Mock user data without Stripe account
      mockRetrieveUserData.mockResolvedValue({
        stripe_account_id: null
      });

      // Action: Render the component
      render(<ConnectStripe />);

      // Wait for async data loading to complete
      await waitFor(() => {
        expect(mockRetrieveUserData).toHaveBeenCalledWith('user123', false, true);
      });

      // Assertions: Check if connect button is displayed
      const connectButton = screen.getByRole('button', { name: /connect with stripe/i });
      expect(connectButton).toBeInTheDocument();
      expect(screen.getByText('Connect with Stripe')).toBeInTheDocument();
    });

    it('should show connected state when user has Stripe account', async () => {
      // Setup: Mock user ID in localStorage
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      
      // Setup: Mock user data with Stripe account
      mockRetrieveUserData.mockResolvedValue({
        stripe_account_id: 'acct_test12345'
      });

      // Action: Render the component
      render(<ConnectStripe />);

      // Wait for async data loading to complete
      await waitFor(() => {
        expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      });

      // Assertions: Check if disconnect button is displayed
      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      expect(disconnectButton).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
    });
  });

  describe('Stripe Connection Flow', () => {
    it('should redirect to Stripe OAuth when connect button is clicked', async () => {
      // Setup: Mock user ID and environment variables
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      
      // Setup: Mock user data without Stripe account
      mockRetrieveUserData.mockResolvedValue({
        stripe_account_id: null
      });

      // Action: Render component and wait for data loading
      render(<ConnectStripe />);
      
      await waitFor(() => {
        expect(mockRetrieveUserData).toHaveBeenCalled();
      });

      // Action: Click the connect button
      const connectButton = screen.getByRole('button', { name: /connect with stripe/i });
      fireEvent.click(connectButton);

      // Assertions: Check if correct Stripe OAuth URL is set
      const expectedDomain = 'https://connect.stripe.com/oauth/v2/authorize';
      expect(window.location.href.startsWith(expectedDomain)).toBe(true);
    });
  });

  describe('Stripe Disconnection Flow', () => {
    it('should successfully disconnect Stripe account when disconnect button is clicked', async () => {
      // Setup: Mock user with connected Stripe account
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      mockRetrieveUserData.mockResolvedValue({
        id: 'user123',
        stripe_account_id: 'acct_test12345'
      });
      
      // Setup: Mock successful disconnection
      mockUpdateUserProfile.mockResolvedValue({ success: true });

      // Action: Render component and wait for initial data
      render(<ConnectStripe />);
      
      await waitFor(() => {
        expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      });

      // Action: Click disconnect button
      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      fireEvent.click(disconnectButton);

      // Assertions: Verify API call and state update
      await waitFor(() => {
        expect(mockUpdateUserProfile).toHaveBeenCalledWith('user123', expect.any(FormData));
      });

      // Check that FormData contains correct metadata
      const formDataCall = mockUpdateUserProfile.mock.calls[0][1];
      expect(formDataCall).toBeInstanceOf(FormData);
      expect(formDataCall.get('metadata')).toBe(JSON.stringify({ stripe_account_id: '' }));
    });

    it('should handle disconnection errors gracefully', async () => {
      // Setup: Mock user with connected Stripe account
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      mockRetrieveUserData.mockResolvedValue({
        id: 'user123',
        stripe_account_id: 'acct_test12345'
      });
      
      // Setup: Mock API error during disconnection
      mockUpdateUserProfile.mockRejectedValue(new Error('Disconnection failed'));

      // Action: Render component and interact
      render(<ConnectStripe />);
      
      await waitFor(() => {
        expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      });

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      fireEvent.click(disconnectButton);

      // Assertions: Verify error handling
      await waitFor(() => {
        expect(mockUpdateUserProfile).toHaveBeenCalled();
      });

      // Should still show connected state after error
      expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
    });

    it('should not call disconnect API when no user ID is available', async () => {
      // Setup: Mock user with Stripe account but no user ID
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      mockRetrieveUserData.mockResolvedValue({
        id: 'user123',
        stripe_account_id: 'acct_test12345'
      });

      // Action: Render component
      render(<ConnectStripe />);

      // Since no user ID, disconnect functionality should not be available
      // This test ensures robustness when localStorage is empty
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('Component State Management', () => {
    it('should update UI state after successful disconnection', async () => {
      // Setup: Mock connected user
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      mockRetrieveUserData.mockResolvedValue({
        id: 'user123',
        stripe_account_id: 'acct_test12345'
      });
      mockUpdateUserProfile.mockResolvedValue({ success: true });

      // Action: Render and disconnect
      render(<ConnectStripe />);
      
      await waitFor(() => {
        expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      });

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      fireEvent.click(disconnectButton);

      // Assertions: UI should update to show connect button after successful disconnection
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /connect with stripe/i })).toBeInTheDocument();
      });
      
      // Connected state should no longer be visible
      expect(screen.queryByText('Connected: acct_test12345')).not.toBeInTheDocument();
    });

    it('should maintain connected state when disconnection fails', async () => {
      // Setup: Mock connected user with failing disconnection
      vi.mocked(localStorage.getItem).mockReturnValue('user123');
      mockRetrieveUserData.mockResolvedValue({
        id: 'user123',
        stripe_account_id: 'acct_test12345'
      });
      mockUpdateUserProfile.mockRejectedValue(new Error('Network error'));

      // Action: Render and attempt disconnection
      render(<ConnectStripe />);
      
      await waitFor(() => {
        expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      });

      const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
      fireEvent.click(disconnectButton);

      // Assertions: Should maintain connected state after failed disconnection
      await waitFor(() => {
        expect(mockUpdateUserProfile).toHaveBeenCalled();
      });
      
      expect(screen.getByText('Connected: acct_test12345')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /connect with stripe/i })).not.toBeInTheDocument();
    });
  });
});
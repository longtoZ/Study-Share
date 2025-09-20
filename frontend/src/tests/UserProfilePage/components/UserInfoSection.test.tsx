import { render, screen, fireEvent } from '@testing-library/react';
import UserInfoSection from '@/pages/UserProfilePage/components/UserInfoSection';

// Mock Material-UI icons
vi.mock('@mui/icons-material/AddOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="add-icon" {...props}>AddIcon</div>
}));

vi.mock('@mui/icons-material/EmailOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="email-icon" {...props}>EmailIcon</div>
}));

const mockUser = {
    full_name: 'John Doe',
    user_id: 'johndoe123',
    created_date: '2023-01-15T10:30:00Z',
    address: 'New York, USA',
    profile_picture_url: 'https://example.com/profile.jpg',
    background_image_url: 'https://example.com/background.jpg'
};

const mockUserWithoutImages = {
    full_name: 'Jane Smith',
    user_id: 'janesmith456',
    created_date: '2023-06-20T14:45:00Z',
    address: 'London, UK',
    profile_picture_url: null,
    background_image_url: null
};

describe('UserInfoSection Component', () => {
    describe('User Information Display', () => {
        it('should render user full name', () => {
            render(<UserInfoSection user={mockUser} />);
            
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('should render user ID with @ symbol', () => {
            render(<UserInfoSection user={mockUser} />);
            
            expect(screen.getByText('@johndoe123')).toBeInTheDocument();
        });

        it('should render formatted join date', () => {
            render(<UserInfoSection user={mockUser} />);
            
            expect(screen.getByText(/Joined on/)).toBeInTheDocument();
            expect(screen.getByText(/1\/15\/2023/)).toBeInTheDocument();
        });

        it('should render user address', () => {
            render(<UserInfoSection user={mockUser} />);
            
            expect(screen.getByText(/Living in/)).toBeInTheDocument();
            expect(screen.getByText('New York, USA')).toBeInTheDocument();
        });

        it('should handle missing created_date gracefully', () => {
            const userWithoutDate = { ...mockUser, created_date: null };
            render(<UserInfoSection user={userWithoutDate} />);
            
            expect(screen.getByText('N/A')).toBeInTheDocument();
        });
    });

    describe('Profile Images', () => {
        it('should render custom profile picture when URL is provided', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const profileImage = screen.getByAltText('Profile');
            expect(profileImage).toHaveAttribute('src', 'https://example.com/profile.jpg');
        });

        it('should render custom background image when URL is provided', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const backgroundImages = document.querySelectorAll('img');
            const backgroundImage = backgroundImages[0]; // First image is background
            expect(backgroundImage).toHaveAttribute('src', 'https://example.com/background.jpg');
        });

        it('should use placeholder images when URLs are not provided', () => {
            render(<UserInfoSection user={mockUserWithoutImages} />);
            
            const images = document.querySelectorAll('img');
            // Check that placeholder images are used (they should contain 'placeholder' in src)
            expect(images[0].src).toContain('placeholder_bg.png');
            expect(images[1].src).toContain('placeholder_pfp.png');
        });

        it('should set proper image attributes', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const profileImage = screen.getByAltText('Profile');
            expect(profileImage).toHaveClass('w-48', 'h-48', 'object-cover', 'rounded-full');
            expect(profileImage).toHaveAttribute('referrerPolicy', 'no-referrer');
        });
    });

    describe('Action Buttons', () => {
        it('should render Follow button with correct styling', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const followButton = screen.getByRole('button', { name: /follow/i });
            expect(followButton).toBeInTheDocument();
            expect(followButton).toHaveClass('button-primary');
            expect(screen.getByTestId('add-icon')).toBeInTheDocument();
        });

        it('should render Message button with correct styling', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const messageButton = screen.getByRole('button', { name: /message/i });
            expect(messageButton).toBeInTheDocument();
            expect(messageButton).toHaveClass('button-outline');
            expect(screen.getByTestId('email-icon')).toBeInTheDocument();
        });

        it('should handle Follow button click', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const followButton = screen.getByRole('button', { name: /follow/i });
            fireEvent.click(followButton);
            
            // Button should be clickable (no error thrown)
            expect(followButton).toBeInTheDocument();
        });

        it('should handle Message button click', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const messageButton = screen.getByRole('button', { name: /message/i });
            fireEvent.click(messageButton);
            
            // Button should be clickable (no error thrown)
            expect(messageButton).toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const container = document.querySelector('.bg-primary.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have rounded corners and proper spacing', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const container = document.querySelector('.rounded-3xl');
            expect(container).toBeInTheDocument();
        });

        it('should position profile image correctly', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const profileImage = screen.getByAltText('Profile');
            expect(profileImage).toHaveClass('absolute', '-top-34', 'left-6');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null user gracefully', () => {
            render(<UserInfoSection user={null} />);
            
            // Should not throw error and render placeholders
            expect(document.querySelector('.bg-primary')).toBeInTheDocument();
        });

        it('should handle undefined user gracefully', () => {
            render(<UserInfoSection user={undefined} />);
            
            // Should not throw error and render placeholders
            expect(document.querySelector('.bg-primary')).toBeInTheDocument();
        });

        it('should handle user with missing fields', () => {
            const incompleteUser = {
                full_name: 'Test User'
                // Missing other fields
            };
            
            render(<UserInfoSection user={incompleteUser} />);
            
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('N/A')).toBeInTheDocument(); // For missing date
        });
    });

    describe('Accessibility', () => {
        it('should have proper alt text for images', () => {
            render(<UserInfoSection user={mockUser} />);
            
            expect(screen.getByAltText('Profile')).toBeInTheDocument();
            // Background image has empty alt (decorative)
            const backgroundImage = document.querySelectorAll('img')[0];
            expect(backgroundImage).toHaveAttribute('alt', '');
        });

        it('should have focusable buttons', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const followButton = screen.getByRole('button', { name: /follow/i });
            const messageButton = screen.getByRole('button', { name: /message/i });
            
            expect(followButton).toBeInTheDocument();
            expect(messageButton).toBeInTheDocument();
        });

        it('should prevent image interactions', () => {
            render(<UserInfoSection user={mockUser} />);
            
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                expect(img).toHaveClass('pointer-events-none');
            });
        });
    });
});
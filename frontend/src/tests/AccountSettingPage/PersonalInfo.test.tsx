import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PersonalInfo from '@/pages/AccountSettingPage/layouts/PersonalInfo';
import { retrieveUserData, updateUserProfile } from '@/services/userService';

vi.mock('@/services/userService', () => ({
    retrieveUserData: vi.fn(),
    updateUserProfile: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => 'test-user-id'),
    },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');

const mockUserData = {
    user_id: 'test-user-id',
    full_name: 'Long To',
    email: 'longto@example.com',
    gender: 'male',
    date_of_birth: '1990-01-01',
    bio: 'Test bio',
    profile_picture_url: '',
    background_image_url: '',
    address: 'Test Address',
    stripe_account_id: null,
};

describe('PersonalInfo Component', () => {
    const mockRetrieveUserData = vi.mocked(retrieveUserData);
    const mockUpdateUserProfile = vi.mocked(updateUserProfile);

    beforeEach(() => {
        vi.clearAllMocks();
        mockRetrieveUserData.mockResolvedValue(mockUserData);
        mockUpdateUserProfile.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render personal information form', async () => {
            render(<PersonalInfo />);
            
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByText('Profile picture and background')).toBeInTheDocument();
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Long To')).toBeInTheDocument();
                expect(screen.getByDisplayValue('longto@example.com')).toBeInTheDocument();
            });
        });

        it('should fetch and display user data on mount', async () => {
            render(<PersonalInfo />);
            
            await waitFor(() => {
                expect(retrieveUserData).toHaveBeenCalledWith('test-user-id', true);
            });
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Long To')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Test Address')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
            });
        });
    });

    describe('Form Interactions', () => {
        it('should handle input changes', async () => {
            render(<PersonalInfo />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Long To')).toBeInTheDocument();
            });
            
            const nameInput = screen.getByDisplayValue('Long To');
            fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
            
            expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
        });

        it('should handle save button click', async () => {
            render(<PersonalInfo />);
            
            await waitFor(() => {
                expect(screen.getByText('Save Changes')).toBeInTheDocument();
            });
            
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(updateUserProfile).toHaveBeenCalledWith('test-user-id', expect.any(FormData));
            });
        });
    });

    describe('Profile Picture Management', () => {
        it('should handle profile picture upload', async () => {
            render(<PersonalInfo />);
            
            await waitFor(() => {
                expect(screen.getByText('Upload your profile picture here')).toBeInTheDocument();
            });
            
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = document.querySelectorAll('input[type="file"]')[0] as HTMLInputElement;
            
            fireEvent.change(fileInput, { target: { files: [file] } });
            
            await waitFor(() => {
                expect(screen.getByAltText('Profile')).toBeInTheDocument();
            });
            
            expect(URL.createObjectURL).toHaveBeenCalledWith(file);
        });

        it('should clear profile picture when clear button is clicked', async () => {
            const mockDataWithImage = {
                ...mockUserData,
                profile_picture_url: 'test-image-url.jpg'
            };
            mockRetrieveUserData.mockResolvedValue(mockDataWithImage);
            
            render(<PersonalInfo />);
            
            await waitFor(() => {
                expect(screen.getByAltText('Profile')).toBeInTheDocument();
            });
            
            const clearButton = screen.getByText('Clear');
            fireEvent.click(clearButton);
            
            await waitFor(() => {
                expect(screen.getByText('Upload your profile picture here')).toBeInTheDocument();
            });
        });
    });

    describe('Background Image Management', () => {
        it('should handle background image upload', async () => {
            render(<PersonalInfo />);

            await waitFor(() => {
                expect(screen.getByText('Upload your background image here')).toBeInTheDocument();
            });

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = document.querySelectorAll('input[type="file"]')[1] as HTMLInputElement;
            
            fireEvent.change(fileInput, { target: { files: [file] } });

            await waitFor(() => {
                expect(screen.getByAltText('Background')).toBeInTheDocument();
            });
            
            expect(URL.createObjectURL).toHaveBeenCalledWith(file);
        });

        it('should clear background image when clear button is clicked', async () => {
            const mockDataWithBackground = {
                ...mockUserData,
                background_image_url: 'test-background-url.jpg'
            };
            mockRetrieveUserData.mockResolvedValue(mockDataWithBackground);
            
            render(<PersonalInfo />);

            await waitFor(() => {
                expect(screen.getByAltText('Background')).toBeInTheDocument();
            });
            
            const clearButton = screen.getByText('Clear');
            fireEvent.click(clearButton);

            await waitFor(() => {
                expect(screen.getByText('Upload your background image here')).toBeInTheDocument();
            });
        });
    });
});


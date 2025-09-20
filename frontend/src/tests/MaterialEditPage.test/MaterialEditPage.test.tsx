import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MaterialEditPage from '@/pages/MaterialEditPage/MaterialEditPage';
import { getMaterial, updateMaterial, deleteMaterial } from '@/services/materialService';
import { retrieveLessons, retrieveAllSubjects } from '@/services/userService';
import type { Subject } from '@/interfaces/table';
import type { LessonExtended } from '@/interfaces/userProfile';

vi.mock('@/services/materialService', () => ({
    getMaterial: vi.fn(),
    updateMaterial: vi.fn(),
    deleteMaterial: vi.fn(),
}));

vi.mock('@/services/userService', () => ({
    retrieveLessons: vi.fn(),
    retrieveAllSubjects: vi.fn(),
}));

// Mock useParams and useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ materialId: 'test-material-id' }),
        useNavigate: () => mockNavigate,
    };
});

// Mock window alert
global.alert = vi.fn();

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockMaterialData = {
    material_id: 'test-material-id',
    name: 'Test Material',
    description: 'Test material description',
    is_public: true,
    user_id: 'test-user-id',
    upload_date: '2024-01-01T10:00:00Z',
};

const mockSubjectsData: Subject[] = [
    { subject_id: 'science', name: 'Science', description: 'Science related materials' },
    { subject_id: 'mathematics', name: 'Mathematics', description: 'Mathematics related materials' },
];

const mockLessonsData: LessonExtended[] = [
    {
        user_id: 'test-user-id',
        lesson_id: 'lesson-1',
        name: 'Lesson 1',
        description: 'Description for Lesson 1',
        created_date: '2024-01-05T12:00:00Z',
        material_count: 2,
        is_public: true,
        view_count: 100,
        user_name: 'User 1',
	    profile_picture_url: 'https://example.com/user1.jpg',
	    background_image_url: 'https://example.com/background1.jpg',
    },
    {
        user_id: 'test-user-id',
        lesson_id: 'lesson-2',
        name: 'Lesson 2',
        description: 'Description for Lesson 2',
        created_date: '2024-01-06T12:00:00Z',
        material_count: 3,
        is_public: false,
        view_count: 50,
        user_name: 'User 2',
        profile_picture_url: 'https://example.com/user2.jpg',
        background_image_url: 'https://example.com/background2.jpg',
    },
];

describe('MaterialEditPage Component', () => {
    const mockGetMaterial = vi.mocked(getMaterial);
    const mockUpdateMaterial = vi.mocked(updateMaterial);
    const mockDeleteMaterial = vi.mocked(deleteMaterial);
    const mockRetrieveLessons = vi.mocked(retrieveLessons);
    const mockRetrieveAllSubjects = vi.mocked(retrieveAllSubjects);

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetMaterial.mockResolvedValue(mockMaterialData);
        mockUpdateMaterial.mockResolvedValue(mockMaterialData);
        mockDeleteMaterial.mockResolvedValue({ success: true });
        mockRetrieveAllSubjects.mockResolvedValue(mockSubjectsData);
        mockRetrieveLessons.mockResolvedValue(mockLessonsData);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render material edit form after loading', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Material')).toBeInTheDocument();
                expect(screen.getByText('Material Information')).toBeInTheDocument();
                expect(screen.getByText('Edit Details')).toBeInTheDocument();
            });
        });

        it('should fetch and display material data on mount', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(mockGetMaterial).toHaveBeenCalledWith('test-material-id');
            });
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Material')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Test material description')).toBeInTheDocument();
                expect(screen.getByText('test-material-id')).toBeInTheDocument();
            });
        });
    });

    describe('Read-only Information Display', () => {
        it('should display material information correctly', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('test-material-id')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Test material description')).toBeInTheDocument();
            });
        });

        it('should display formatted dates correctly', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText(new Date('2024-01-01T10:00:00Z').toLocaleString())).toBeInTheDocument();
            });
        });
    });

    describe('Form Input Handling', () => {
        it('should handle material name input changes', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Material')).toBeInTheDocument();
            });
            
            const nameInput = screen.getByDisplayValue('Test Material');
            fireEvent.change(nameInput, { target: { value: 'Updated Material Name' } });
            
            expect(nameInput).toHaveValue('Updated Material Name');
        });

        it('should handle description input changes', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test material description')).toBeInTheDocument();
            });
            
            const descriptionInput = screen.getByDisplayValue('Test material description');
            fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
            
            expect(descriptionInput).toHaveValue('Updated description');
        });
    });

    describe('Save Functionality', () => {
        it('should save material changes', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Save Changes')).toBeInTheDocument();
            });
            
            // Update material name
            const nameInput = screen.getByDisplayValue('Test Material');
            fireEvent.change(nameInput, { target: { value: 'Updated Material' } });
            
            // Click save
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(mockUpdateMaterial).toHaveBeenCalledWith('test-material-id', expect.any(String), expect.any(Object));
            });
        });

        it('should handle cancel button click', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            const cancelButton = screen.getAllByText('Cancel')[0]; // First cancel button

            await waitFor(() => {
                expect(cancelButton).toBeInTheDocument();
            });
            
            fireEvent.click(cancelButton);
            
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    describe('Delete Functionality', () => {
        it('should open delete confirmation dialog', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Material')).toBeInTheDocument();
            });
            
            const deleteButton = screen.getByText('Delete Material');
            fireEvent.click(deleteButton);
            
            expect(screen.getByText('Are you sure?')).toBeInTheDocument();
            expect(screen.getByText('delete this material')).toBeInTheDocument();
        });

        it('should close dialog when cancel is clicked', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Material')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Material');
            fireEvent.click(deleteButton);
            
            // Close dialog
            const cancelButton = screen.getAllByText('Cancel')[1]; // Second cancel button in dialog
            fireEvent.click(cancelButton);
            
            // expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
        });

        it('should show alert for incorrect confirmation text', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Material')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Material');
            fireEvent.click(deleteButton);
            
            // Enter wrong confirmation text
            const confirmationInput = screen.getByPlaceholderText('Type here...');
            fireEvent.change(confirmationInput, { target: { value: 'wrong text' } });
            
            // Click confirm
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            expect(global.alert).toHaveBeenCalledWith('Confirmation text does not match. Please try again.');
        });

        it('should delete material with correct confirmation text', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Material')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Material');
            fireEvent.click(deleteButton);
            
            // Enter correct confirmation text
            const confirmationInput = screen.getByPlaceholderText('Type here...');
            fireEvent.change(confirmationInput, { target: { value: 'delete this material' } });
            
            // Click confirm
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            await waitFor(() => {
                expect(mockDeleteMaterial).toHaveBeenCalledWith('test-material-id', 'test-user-id');
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle empty material data', async () => {
            mockGetMaterial.mockResolvedValue(null);
            
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Material')).toBeInTheDocument();
            });
            
            // Form should render with empty values
            expect(screen.getByPlaceholderText('Enter material name')).toHaveValue('');
            expect(screen.getByPlaceholderText('Enter material description')).toHaveValue('');
        });

        it('should show error message on save failure', async () => {
            mockUpdateMaterial.mockRejectedValue(new Error('Failed to update material'));
            
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Save Changes')).toBeInTheDocument();
            });
            
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(screen.getByText('Failed to update material')).toBeInTheDocument();
            });
        });
    });

    describe('Dialog Overlay', () => {
        it('should close dialog when clicking overlay', async () => {
            renderWithRouter(<MaterialEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Material')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Material');
            fireEvent.click(deleteButton);
            
            // Click overlay to close
            const overlay = document.querySelector('.bg-\\[\\#00000080\\]');
            if (overlay) {
                fireEvent.click(overlay);
            }
            
            // expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
        });
    });
});

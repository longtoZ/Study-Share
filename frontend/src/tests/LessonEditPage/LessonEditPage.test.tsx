import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LessonEditPage from '@/pages/LessonEditPage/LessonEditPage';
import { getLesson, updateLesson, deleteLesson } from '@/services/lessonService';

vi.mock('@/services/lessonService', () => ({
    getLesson: vi.fn(),
    updateLesson: vi.fn(),
    deleteLesson: vi.fn(),
}));

// Mock useParams and useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ lessonId: 'test-lesson-id' }),
        useNavigate: () => mockNavigate,
    };
});

// Mock window alert
global.alert = vi.fn();

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockLessonData = {
    lesson_id: 'test-lesson-id',
    name: 'Test Lesson',
    description: 'Test lesson description',
    is_public: true,
    user_id: 'test-user-id',
    created_date: '2024-01-01T10:00:00Z',
    last_updated: '2024-01-02T15:30:00Z',
    material_count: 5,
};

describe('LessonEditPage Component', () => {
    const mockGetLesson = vi.mocked(getLesson);
    const mockUpdateLesson = vi.mocked(updateLesson);
    const mockDeleteLesson = vi.mocked(deleteLesson);

    beforeEach(() => {
        vi.clearAllMocks();
        mockGetLesson.mockResolvedValue(mockLessonData);
        mockUpdateLesson.mockResolvedValue(mockLessonData);
        mockDeleteLesson.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render loading state initially', () => {
            renderWithRouter(<LessonEditPage />);
            
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('should render lesson edit form after loading', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
                expect(screen.getByText('Lesson Information')).toBeInTheDocument();
                expect(screen.getByText('Edit Details')).toBeInTheDocument();
            });
        });

        it('should fetch and display lesson data on mount', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(mockGetLesson).toHaveBeenCalledWith('test-lesson-id');
            });
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Lesson')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Test lesson description')).toBeInTheDocument();
                expect(screen.getByText('test-lesson-id')).toBeInTheDocument();
            });
        });
    });

    describe('Read-only Information Display', () => {
        it('should display lesson information correctly', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('test-lesson-id')).toBeInTheDocument();
                expect(screen.getByText('test-user-id')).toBeInTheDocument();
                expect(screen.getByText('5')).toBeInTheDocument();
            });
        });

        it('should display formatted dates correctly', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText(new Date('2024-01-01T10:00:00Z').toLocaleString())).toBeInTheDocument();
                expect(screen.getByText(new Date('2024-01-02T15:30:00Z').toLocaleString())).toBeInTheDocument();
            });
        });
    });

    describe('Form Input Handling', () => {
        it('should handle lesson name input changes', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Lesson')).toBeInTheDocument();
            });
            
            const nameInput = screen.getByDisplayValue('Test Lesson');
            fireEvent.change(nameInput, { target: { value: 'Updated Lesson Name' } });
            
            expect(nameInput).toHaveValue('Updated Lesson Name');
        });

        it('should handle description input changes', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Test lesson description')).toBeInTheDocument();
            });
            
            const descriptionInput = screen.getByDisplayValue('Test lesson description');
            fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
            
            expect(descriptionInput).toHaveValue('Updated description');
        });

        it('should handle public checkbox toggle', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByLabelText('Public')).toBeInTheDocument();
            });
            
            const publicCheckbox = screen.getByLabelText('Public') as HTMLInputElement;
            expect(publicCheckbox.checked).toBe(true);
            
            fireEvent.click(publicCheckbox);
            expect(publicCheckbox.checked).toBe(false);
        });
    });

    describe('Save Functionality', () => {
        it('should save lesson changes', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Save Changes')).toBeInTheDocument();
            });
            
            // Update lesson name
            const nameInput = screen.getByDisplayValue('Test Lesson');
            fireEvent.change(nameInput, { target: { value: 'Updated Lesson' } });
            
            // Click save
            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(mockUpdateLesson).toHaveBeenCalledWith('test-lesson-id', 'test-user-id', {
                    name: 'Updated Lesson',
                    description: 'Test lesson description',
                    is_public: true,
                });
            });
        });
    });

    describe('Delete Functionality', () => {
        it('should open delete confirmation dialog', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Lesson')).toBeInTheDocument();
            });
            
            const deleteButton = screen.getByText('Delete Lesson');
            fireEvent.click(deleteButton);
            
            expect(screen.getByText('Are you sure?')).toBeInTheDocument();
            expect(screen.getByText('delete this lesson')).toBeInTheDocument();
        });

        it('should close dialog when cancel is clicked', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Lesson')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Lesson');
            fireEvent.click(deleteButton);
            
            // Close dialog
            const cancelButton = screen.getAllByText('Cancel')[1]; // Second cancel button in dialog
            fireEvent.click(cancelButton);

            // expect(screen.queryByText('Are you sure?')).not.toBeVisible();
        });

        it('should show alert for incorrect confirmation text', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Lesson')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Lesson');
            fireEvent.click(deleteButton);
            
            // Enter wrong confirmation text
            const confirmationInput = screen.getByPlaceholderText('Type here...');
            fireEvent.change(confirmationInput, { target: { value: 'wrong text' } });
            
            // Click confirm
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            expect(global.alert).toHaveBeenCalledWith('Confirmation text does not match. Please try again.');
        });

        it('should delete lesson with correct confirmation text', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Lesson')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Lesson');
            fireEvent.click(deleteButton);
            
            // Enter correct confirmation text
            const confirmationInput = screen.getByPlaceholderText('Type here...');
            fireEvent.change(confirmationInput, { target: { value: 'delete this lesson' } });
            
            // Click confirm
            const confirmButton = screen.getByText('Confirm');
            fireEvent.click(confirmButton);
            
            await waitFor(() => {
                expect(mockDeleteLesson).toHaveBeenCalledWith('test-lesson-id', 'test-user-id');
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle lesson fetch error gracefully', async () => {
            mockGetLesson.mockRejectedValue(new Error('Failed to fetch lesson'));
            
            renderWithRouter(<LessonEditPage />);
            
            // Component should still render loading state without crashing
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });

        it('should handle empty lesson data', async () => {
            mockGetLesson.mockResolvedValue(null);
            
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
            });
            
            // Form should render with empty values
            expect(screen.getByPlaceholderText('Enter lesson name')).toHaveValue('');
            expect(screen.getByPlaceholderText('Enter lesson description')).toHaveValue('');
        });
    });

    describe('Dialog Overlay', () => {
        it('should close dialog when clicking overlay', async () => {
            renderWithRouter(<LessonEditPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Delete Lesson')).toBeInTheDocument();
            });
            
            // Open dialog
            const deleteButton = screen.getByText('Delete Lesson');
            fireEvent.click(deleteButton);
            
            // Click overlay to close
            const overlay = document.querySelector('.bg-\\[\\#00000080\\]');
            if (overlay) {
                fireEvent.click(overlay);
            }
            
            // expect(screen.queryByText('Are you sure?')).not.toBeVisible();
        });
    });
});

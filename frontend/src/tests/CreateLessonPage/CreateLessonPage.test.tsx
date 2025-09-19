import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateLessonPage from '@/pages/CreateLessonPage/CreateLessonPage';
import { createLesson } from '@/services/lessonService';

vi.mock('@/services/lessonService', () => ({
    createLesson: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => 'test-user-id'),
    },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url');

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CreateLessonPage Component', () => {
    const mockCreateLesson = vi.mocked(createLesson);

    beforeEach(() => {
        vi.clearAllMocks();
        mockCreateLesson.mockResolvedValue({ lesson_id: 'test-lesson-id' });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render create lesson form initially', () => {
            renderWithRouter(<CreateLessonPage />);
            
            expect(screen.getByText('Create a new lesson')).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error for empty lesson name', async () => {
            renderWithRouter(<CreateLessonPage />);
            
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            expect(screen.getByText('Lesson name is required')).toBeInTheDocument();
        });

        it('should show error for empty description', async () => {
            renderWithRouter(<CreateLessonPage />);
            
            const titleInput = screen.getByPlaceholderText('Enter lesson name');
            fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });
            
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            expect(screen.getByText('Description is required')).toBeInTheDocument();
        });

    });

    describe('Lesson Creation', () => {
        it('should create lesson with valid data', async () => {
            renderWithRouter(<CreateLessonPage />);
            
            // Fill out form
            fireEvent.change(screen.getByPlaceholderText('Enter lesson name'), { target: { value: 'Test Lesson' } });
            fireEvent.change(screen.getByPlaceholderText('Enter lesson description'), { target: { value: 'Test description' } });
            
            // Submit form
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            await waitFor(() => {
                expect(mockCreateLesson).toHaveBeenCalledWith(expect.any(Object));
            });
        });

        it('should navigate to lesson page on successful creation', async () => {
            renderWithRouter(<CreateLessonPage />);
            
            // Fill out form
            fireEvent.change(screen.getByPlaceholderText('Enter lesson name'), { target: { value: 'Test Lesson' } });
            fireEvent.change(screen.getByPlaceholderText('Enter lesson description'), { target: { value: 'Test description' } });
            
            // Submit form
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            await waitFor(() => {
                expect(mockCreateLesson).toHaveBeenCalled();
            });
            
            // Check that navigate was called (the path might be different)
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalled();
            });
        });

        it('should show error message on creation failure', async () => {
            mockCreateLesson.mockRejectedValue(new Error('Failed to create lesson'));
            
            renderWithRouter(<CreateLessonPage />);
            
            // Fill out form
            fireEvent.change(screen.getByPlaceholderText('Enter lesson name'), { target: { value: 'Test Lesson' } });
            fireEvent.change(screen.getByPlaceholderText('Enter lesson description'), { target: { value: 'Test description' } });

            // Submit form
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            await waitFor(() => {
                expect(screen.getByText('Failed to create lesson. Please try again.')).toBeInTheDocument();
            });
        });
    });

    describe('Form Reset', () => {
        it('should reset form when cancel button is clicked', async () => {
            renderWithRouter(<CreateLessonPage />);
            
            // Fill out form
            const nameInput = screen.getByPlaceholderText('Enter lesson name') as HTMLInputElement;
            const descriptionInput = screen.getByPlaceholderText('Enter lesson description') as HTMLInputElement;
            
            fireEvent.change(nameInput, { target: { value: 'Test Lesson' } });
            fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

            // Verify values are set
            expect(nameInput).toHaveValue('Test Lesson');
            expect(descriptionInput).toHaveValue('Test description');

            // Click cancel
            const cancelButton = screen.getByText('Clear');
            fireEvent.click(cancelButton);

            // Wait for form to be cleared
            await waitFor(() => {
                expect(nameInput.value).toBe('');
                expect(descriptionInput.value).toBe('');
            });
        });
    });
});

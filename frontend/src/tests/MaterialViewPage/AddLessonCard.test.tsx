import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddLessonCard from '@/pages/MaterialViewPage/components/AddLessonCard';
import { retrieveLessons } from '@/services/userService';
import { addMaterialToLesson } from '@/services/lessonService';
import type { LessonExtended } from '@/interfaces/userProfile';

vi.mock('@/services/userService', () => ({
    retrieveLessons: vi.fn(),
}));

vi.mock('@/services/lessonService', () => ({
    addMaterialToLesson: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockLessonsData: LessonExtended[] = [
    {
        user_id: 'test-user-id',
        lesson_id: 'lesson-1',
        name: 'Mathematics Fundamentals',
        description: 'Basic mathematics concepts',
        created_date: '2024-01-01T10:00:00Z',
        material_count: 3,
        is_public: true,
        view_count: 150,
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile.jpg',
        background_image_url: 'https://example.com/background.jpg',
    },
    {
        user_id: 'test-user-id',
        lesson_id: 'lesson-2',
        name: 'Advanced Physics',
        description: 'Complex physics theories',
        created_date: '2024-01-02T11:00:00Z',
        material_count: 5,
        is_public: false,
        view_count: 75,
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile2.jpg',
        background_image_url: 'https://example.com/background2.jpg',
    },
];

describe('AddLessonCard Component', () => {
    const mockRetrieveLessons = vi.mocked(retrieveLessons);
    const mockAddMaterialToLesson = vi.mocked(addMaterialToLesson);

    const defaultProps = {
        user_id: 'test-user-id',
        material_id: 'test-material-id',
        className: 'test-class',
        hideSearch: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockRetrieveLessons.mockResolvedValue(mockLessonsData);
        mockAddMaterialToLesson.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render add to lesson button', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            expect(screen.getByText('Add to Lesson')).toBeInTheDocument();
            expect(screen.getByRole('button')).toHaveClass('flex', 'items-center', 'gap-2');
        });

        it('should fetch lessons on mount', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalledWith('test-user-id', 'newest', { from: 0, to: 99 });
            });
        });

        it('should apply custom className', () => {
            renderWithRouter(<AddLessonCard {...defaultProps} className="custom-class" />);
            
            const container = screen.getByRole('button').parentElement;
            expect(container).toHaveClass('custom-class');
        });
    });

    describe('Dropdown Interaction', () => {
        it('should open dropdown when button is clicked', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
            });
        });

        it('should display lessons in dropdown', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
                expect(screen.getByText('Advanced Physics')).toBeInTheDocument();
            });
        });

        it('should hide search input when hideSearch is true', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} hideSearch={true} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
            });
        });

        it('should close dropdown when clicking outside', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
            });
            
            // Click outside
            fireEvent.mouseDown(document.body);
            
            await waitFor(() => {
                expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
            });
        });
    });

    describe('Search Functionality', () => {
        it('should filter lessons based on search term', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
                expect(screen.getByText('Advanced Physics')).toBeInTheDocument();
            });
            
            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'Math' } });
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
                expect(screen.queryByText('Advanced Physics')).not.toBeInTheDocument();
            });
        });

        it('should show "No lessons found" when search returns no results', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
            });
            
            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'NonExistentLesson' } });
            
            await waitFor(() => {
                expect(screen.getByText('No lessons found')).toBeInTheDocument();
            });
        });

        it('should be case insensitive in search', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
            });
            
            const searchInput = screen.getByPlaceholderText('Search...');
            fireEvent.change(searchInput, { target: { value: 'MATHEMATICS' } });
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
        });
    });

    describe('Lesson Selection', () => {
        it('should select lesson when clicked', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
            
            const lesson = screen.getByText('Mathematics Fundamentals');
            fireEvent.click(lesson);
            
            // Check if the lesson is selected (check icon should appear)
            await waitFor(() => {
                const selectedLesson = lesson.parentElement;
                expect(selectedLesson).toHaveClass('bg-blue-100');
            });
        });

        it('should show check icon for selected lesson', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
            
            const lesson = screen.getByText('Mathematics Fundamentals');
            fireEvent.click(lesson);
            
            await waitFor(() => {
                // Check if CheckCircleOutlineOutlinedIcon is present
                const checkIcon = document.querySelector('.MuiSvgIcon-root');
                expect(checkIcon).toBeInTheDocument();
            });
        });

        it('should clear selection when clear button is clicked', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
            
            // Select a lesson
            const lesson = screen.getByText('Mathematics Fundamentals');
            fireEvent.click(lesson);
            
            await waitFor(() => {
                const selectedLesson = lesson.parentElement;
                expect(selectedLesson).toHaveClass('bg-blue-100');
            });
            
            // Click clear button
            const clearButton = screen.getByText('Clear');
            fireEvent.click(clearButton);
            
            await waitFor(() => {
                const lessonElement = lesson.parentElement;
                expect(lessonElement).not.toHaveClass('bg-blue-100');
            });
        });
    });

    describe('Save Functionality', () => {
        it('should add material to lesson when save button is clicked', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
            
            // Select a lesson
            const lesson = screen.getByText('Mathematics Fundamentals');
            fireEvent.click(lesson);
            
            // Click save button
            const saveButton = screen.getByText('Save');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(mockAddMaterialToLesson).toHaveBeenCalledWith('lesson-1', 'test-material-id');
            });
        });

        it('should not call addMaterialToLesson if no lesson is selected', async () => {
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Save')).toBeInTheDocument();
            });
            
            // Click save button without selecting a lesson
            const saveButton = screen.getByText('Save');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(mockAddMaterialToLesson).not.toHaveBeenCalled();
            });
        });

        it('should handle save errors gracefully', async () => {
            mockAddMaterialToLesson.mockRejectedValue(new Error('Failed to add material'));
            
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('Mathematics Fundamentals')).toBeInTheDocument();
            });
            
            // Select a lesson
            const lesson = screen.getByText('Mathematics Fundamentals');
            fireEvent.click(lesson);
            
            // Click save button
            const saveButton = screen.getByText('Save');
            fireEvent.click(saveButton);
            
            await waitFor(() => {
                expect(mockAddMaterialToLesson).toHaveBeenCalledWith('lesson-1', 'test-material-id');
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle empty lessons list', async () => {
            mockRetrieveLessons.mockResolvedValue([]);
            
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(screen.getByText('No lessons found')).toBeInTheDocument();
            });
        });

        it('should handle failed lessons fetch', async () => {
            mockRetrieveLessons.mockRejectedValue(new Error('Failed to fetch lessons'));
            
            renderWithRouter(<AddLessonCard {...defaultProps} />);
            
            const button = screen.getByText('Add to Lesson');
            fireEvent.click(button);
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalled();
            });
        });
    });
});
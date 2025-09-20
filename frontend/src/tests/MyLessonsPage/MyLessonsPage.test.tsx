import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyLessonsPage from '@/pages/MyLessonsPage/MyLessonsPage';
import { retrieveLessons, calculateStatistics } from '@/services/userService';
import { verifyUser } from '@/services/authService';

// Mock useParams and useNavigate from react-router-dom
const mockNavigate = vi.fn();
const mockParams = { userId: 'test-user-id' };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => mockParams,
        useNavigate: () => mockNavigate,
    };
});

// Mock services
vi.mock('@/services/userService', () => ({
    retrieveLessons: vi.fn(),
    calculateStatistics: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
    verifyUser: vi.fn(),
}));

// Mock utility functions
vi.mock('@/utils/storeMaterialsLessons', () => ({
    storeLessons: vi.fn(),
}));

// Mock components
vi.mock('@/components/layout/LessonsGrid', () => ({
    default: ({ lessons }: any) => (
        <div data-testid="lessons-grid">
            {lessons.map((lesson: any, index: number) => (
                <div key={index} data-testid="lesson-item">
                    {lesson.name}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('@/components/common/SearchBar', () => ({
    default: ({ className }: any) => (
        <div data-testid="search-bar" className={className}>
            <input placeholder="Search..." />
        </div>
    ),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockLessons = [
    {
        lesson_id: 'lesson-1',
        name: 'Math Lesson 1',
        description: 'Basic algebra',
        created_date: '2024-01-01T10:00:00Z',
        user_id: 'test-user-id',
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile.jpg',
        background_image_url: 'https://example.com/background.jpg',
        material_count: 5,
        avg_rating: 4.2,
        rating_count: 10,
        is_public: true,
        view_count: 25,
    },
    {
        lesson_id: 'lesson-2',
        name: 'Math Lesson 2',
        description: 'Advanced calculus',
        created_date: '2024-01-02T10:00:00Z',
        user_id: 'test-user-id',
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile.jpg',
        background_image_url: 'https://example.com/background2.jpg',
        material_count: 3,
        avg_rating: 4.5,
        rating_count: 8,
        is_public: true,
        view_count: 15,
    },
];

const mockStatistics = {
    total_materials: 20,
    total_lessons: 5,
    total_downloads: 100,
    average_rating: 4.5,
};

describe('MyLessonsPage Component', () => {
    const mockRetrieveLessons = vi.mocked(retrieveLessons);
    const mockCalculateStatistics = vi.mocked(calculateStatistics);
    const mockVerifyUser = vi.mocked(verifyUser);

    beforeEach(() => {
        vi.clearAllMocks();
        mockRetrieveLessons.mockResolvedValue(mockLessons);
        mockCalculateStatistics.mockResolvedValue(mockStatistics);
        mockVerifyUser.mockResolvedValue(undefined);
    });

    describe('Initial Rendering', () => {
        it('should render page title', () => {
            renderWithRouter(<MyLessonsPage />);
            
            expect(screen.getByText('All Lessons')).toBeInTheDocument();
        });

        it('should render search bar', () => {
            renderWithRouter(<MyLessonsPage />);
            
            expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        });

        it('should render user lessons section with username', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.getByText("Test User")).toBeInTheDocument();
            });
        });

        it('should show loading state initially', () => {
            renderWithRouter(<MyLessonsPage />);
            
            expect(screen.getByText('Fetching lessons...')).toBeInTheDocument();
        });
    });

    describe('Author Verification', () => {
        it('should show create lesson button when user is author', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Create lesson')).toBeInTheDocument();
            });
        });

        it('should not show create lesson button when user is not author', async () => {
            mockVerifyUser.mockRejectedValue(new Error('Not authorized'));
            
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.queryByText('Create lesson')).not.toBeInTheDocument();
            });
        });

        it('should navigate to create lesson page when button is clicked', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                const createButton = screen.getByText('Create lesson');
                fireEvent.click(createButton);
                
                expect(mockNavigate).toHaveBeenCalledWith('/create-lesson');
            });
        });
    });

    describe('Lessons Display', () => {
        it('should display lessons when loaded', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.getByTestId('lessons-grid')).toBeInTheDocument();
                expect(screen.getByText('Math Lesson 1')).toBeInTheDocument();
                expect(screen.getByText('Math Lesson 2')).toBeInTheDocument();
            });
        });

        it('should call retrieveLessons with correct parameters', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalledWith(
                    'test-user-id',
                    'newest',
                    { from: 0, to: 9 }
                );
            });
        });

        it('should call calculateStatistics with user ID', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(mockCalculateStatistics).toHaveBeenCalledWith('test-user-id');
            });
        });
    });

    describe('Sort Functionality', () => {
        it('should have newest selected by default', () => {
            renderWithRouter(<MyLessonsPage />);
            
            const newestButton = screen.getByText('Newest');
            expect(newestButton).toHaveClass('bg-white');
        });

        it('should switch to oldest when clicked', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            const oldestButton = screen.getByText('Oldest');
            fireEvent.click(oldestButton);
            
            expect(oldestButton).toHaveClass('bg-white');
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalledWith(
                    'test-user-id',
                    'oldest',
                    { from: 0, to: 9 }
                );
            });
        });

        it('should switch back to newest when clicked', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            // Click oldest first
            const oldestButton = screen.getByText('Oldest');
            fireEvent.click(oldestButton);
            
            // Then click newest
            const newestButton = screen.getByText('Newest');
            fireEvent.click(newestButton);
            
            expect(newestButton).toHaveClass('bg-white');
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenLastCalledWith(
                    'test-user-id',
                    'newest',
                    { from: 0, to: 9 }
                );
            });
        });
    });

    describe('Pagination', () => {
        it('should display correct page information', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Page 1 / 2')).toBeInTheDocument();
            });
        });

        it('should disable previous button on first page', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                const prevButton = screen.getByText('Previous');
                expect(prevButton).toBeDisabled();
            });
        });

        it('should enable next button when more pages available', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                expect(nextButton).not.toBeDisabled();
            });
        });

        it('should handle next page click', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            // Wait for initial load to complete
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalledWith(
                    'test-user-id',
                    'newest',
                    { from: 0, to: 9 }
                );
            });
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenLastCalledWith(
                    'test-user-id',
                    'newest',
                    { from: 10, to: 19 }
                );
            });
        });

        it('should handle previous page click', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            // First go to next page
            await waitFor(() => {
                const nextButton = screen.getByText('Next');
                fireEvent.click(nextButton);
            });
            
            // Then go back to previous page
            await waitFor(() => {
                const prevButton = screen.getByText('Previous');
                fireEvent.click(prevButton);
            });
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenLastCalledWith(
                    'test-user-id',
                    'newest',
                    { from: 0, to: 9 }
                );
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockVerifyUser.mockRejectedValue(new Error('Service error'));
            
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error verifying user:', expect.any(Error));
            });
            
            consoleSpy.mockRestore();
        });

        it('should handle empty lessons array', async () => {
            mockRetrieveLessons.mockResolvedValue([]);
            
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Fetching lessons...')).toBeInTheDocument();
            });
        });
    });

    describe('Component Structure', () => {
        it('should have correct main container styling', () => {
            renderWithRouter(<MyLessonsPage />);
            
            const mainContainer = screen.getByText('All Lessons').closest('div');
            expect(mainContainer).toHaveClass('p-12', 'min-h-screen', 'overflow-y-auto', 'scrollbar-hide');
        });

        it('should have proper header hierarchy', () => {
            renderWithRouter(<MyLessonsPage />);
            
            const mainHeader = screen.getByText('All Lessons');
            expect(mainHeader.tagName).toBe('H1');
        });
    });

    describe('Accessibility', () => {
        it('should have proper button roles', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                const buttons = screen.getAllByRole('button');
                expect(buttons.length).toBeGreaterThan(0);
            });
        });

        it('should have proper heading structure', () => {
            renderWithRouter(<MyLessonsPage />);
            
            const mainHeading = screen.getByText('All Lessons');
            expect(mainHeading.tagName).toBe('H1');
        });

        it('should support keyboard navigation', async () => {
            renderWithRouter(<MyLessonsPage />);
            
            await waitFor(() => {
                const createButton = screen.queryByText('Create lesson');
                if (createButton) {
                    createButton.focus();
                    expect(document.activeElement).toBe(createButton);
                }
            });
        });
    });
});

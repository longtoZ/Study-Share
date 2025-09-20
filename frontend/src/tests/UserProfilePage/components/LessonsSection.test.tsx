import { render, screen, fireEvent } from '@testing-library/react';
import LessonsSection from '@/pages/UserProfilePage/components/LessonsSection';

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="loading-spinner" {...props}>Loading...</div>
}));

vi.mock('@mui/icons-material/ArrowForwardIosOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="arrow-icon" {...props}>ArrowIcon</div>
}));

// Mock LessonsGrid component
vi.mock('@/components/layout/LessonsGrid', () => ({
    __esModule: true,
    default: ({ lessons }: any) => (
        <div data-testid="lessons-grid">
            {lessons.map((lesson: any, index: number) => (
                <div key={index} data-testid="lesson-item">
                    {lesson.title} - {lesson.subject}
                </div>
            ))}
        </div>
    )
}));

const mockLessons = [
    {
        lesson_id: '1',
        title: 'Introduction to Machine Learning',
        subject: 'Computer Science',
        description: 'Basic concepts of ML',
        duration: '2 hours'
    },
    {
        lesson_id: '2',
        title: 'Linear Algebra Fundamentals',
        subject: 'Mathematics',
        description: 'Essential linear algebra concepts',
        duration: '1.5 hours'
    },
    {
        lesson_id: '3',
        title: 'Quantum Physics Basics',
        subject: 'Physics',
        description: 'Introduction to quantum mechanics',
        duration: '3 hours'
    }
];

const mockNavigate = vi.fn();

const defaultProps = {
    userId: 'user123',
    lessons: mockLessons,
    isLessonsLoading: false,
    navigate: mockNavigate
};

describe('LessonsSection Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Section Header', () => {
        it('should render section title', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByText('My Lessons')).toBeInTheDocument();
        });

        it('should render section description', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByText('Here are some of the lessons I have created:')).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('should display loading spinner when lessons are loading', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.getByText('Fetching lessons...')).toBeInTheDocument();
        });

        it('should not display lessons grid when loading', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            expect(screen.queryByTestId('lessons-grid')).not.toBeInTheDocument();
        });

        it('should have proper loading message styling', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            const loadingContainer = screen.getByText('Fetching lessons...').closest('div');
            expect(loadingContainer).toHaveClass('flex', 'justify-center', 'items-center', 'text-gray-600');
        });
    });

    describe('Empty State', () => {
        it('should display no lessons message when lessons array is empty', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                />
            );
            
            expect(screen.getByText('No lessons found.')).toBeInTheDocument();
        });

        it('should not display lessons grid when no lessons', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                />
            );
            
            expect(screen.queryByTestId('lessons-grid')).not.toBeInTheDocument();
        });

        it('should have proper empty state styling', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                />
            );
            
            const emptyContainer = screen.getByText('No lessons found.').closest('div');
            expect(emptyContainer).toHaveClass('flex', 'justify-center', 'items-center', 'text-gray-600');
        });
    });

    describe('Lessons Display', () => {
        it('should render LessonsGrid when lessons are available', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByTestId('lessons-grid')).toBeInTheDocument();
        });

        it('should pass lessons to LessonsGrid component', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByText('Introduction to Machine Learning - Computer Science')).toBeInTheDocument();
            expect(screen.getByText('Linear Algebra Fundamentals - Mathematics')).toBeInTheDocument();
            expect(screen.getByText('Quantum Physics Basics - Physics')).toBeInTheDocument();
        });

        it('should display correct number of lessons', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const lessonItems = screen.getAllByTestId('lesson-item');
            expect(lessonItems).toHaveLength(3);
        });
    });

    describe('Show More Button', () => {
        it('should render Show More button', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toBeInTheDocument();
        });

        it('should have proper button styling', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toHaveClass('button-outline', 'w-full');
        });

        it('should display arrow icon in button', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
        });

        it('should call navigate function when clicked', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/user123/lessons');
        });

        it('should construct correct navigation path', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    userId="differentUser789"
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/differentUser789/lessons');
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const container = document.querySelector('.bg-primary.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have rounded corners and proper spacing', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const container = document.querySelector('.rounded-3xl.px-10.py-6');
            expect(container).toBeInTheDocument();
        });

        it('should have proper margin top', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const container = document.querySelector('.mt-10');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined lessons gracefully', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={undefined as any}
                />
            );
            
            // Should show loading or empty state, not crash
            expect(screen.getByText('My Lessons')).toBeInTheDocument();
        });

        it('should handle null userId', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    userId={null as any}
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/null/lessons');
        });

        it('should handle empty userId string', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    userId=""
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user//lessons');
        });

        it('should handle lessons with missing properties', () => {
            const lessonsWithMissingProps = [
                { lesson_id: '1', title: 'Test Lesson' },
                { lesson_id: '2', subject: 'Test Subject' }
            ];
            
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={lessonsWithMissingProps}
                />
            );
            
            expect(screen.getByTestId('lessons-grid')).toBeInTheDocument();
        });
    });

    describe('Loading and Data States Combination', () => {
        it('should show button during all states', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            // Show More button should be present in all states
            expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
        });

        it('should show button with empty lessons', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                />
            );
            
            expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
        });

        it('should prioritize loading state over empty state', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                    isLessonsLoading={true}
                />
            );
            
            expect(screen.getByText('Fetching lessons...')).toBeInTheDocument();
            expect(screen.queryByText('No lessons found.')).not.toBeInTheDocument();
        });

        it('should show lessons grid when data is available and not loading', () => {
            render(<LessonsSection {...defaultProps} />);
            
            expect(screen.getByTestId('lessons-grid')).toBeInTheDocument();
            expect(screen.queryByText('Fetching lessons...')).not.toBeInTheDocument();
            expect(screen.queryByText('No lessons found.')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const sectionTitle = screen.getByText('My Lessons');
            expect(sectionTitle.tagName).toBe('H1');
        });

        it('should have focusable Show More button', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toBeInTheDocument();
            expect(showMoreButton.tagName).toBe('BUTTON');
        });

        it('should provide loading feedback for screen readers', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            expect(screen.getByText('Fetching lessons...')).toBeInTheDocument();
        });

        it('should provide empty state feedback', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    lessons={[]}
                />
            );
            
            expect(screen.getByText('No lessons found.')).toBeInTheDocument();
        });
    });

    describe('Button Interaction', () => {
        it('should be clickable multiple times', () => {
            render(<LessonsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            
            fireEvent.click(showMoreButton);
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledTimes(2);
            expect(mockNavigate).toHaveBeenCalledWith('/user/user123/lessons');
        });

        it('should maintain button functionality during loading', () => {
            render(
                <LessonsSection 
                    {...defaultProps} 
                    isLessonsLoading={true}
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/user123/lessons');
        });
    });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '@/pages/SearchPage/SearchPage';
import { retrieveAllSubjects, retrieveLessons } from '@/services/userService';
import { searchMaterial } from '@/services/materialService';
import { searchLesson } from '@/services/lessonService';

// Mock services
vi.mock('@/services/userService', () => ({
    retrieveAllSubjects: vi.fn(),
    retrieveLessons: vi.fn(),
}));

vi.mock('@/services/materialService', () => ({
    searchMaterial: vi.fn(),
}));

vi.mock('@/services/lessonService', () => ({
    searchLesson: vi.fn(),
}));

// Mock components
vi.mock('@/components/layout/MaterialsGrid', () => ({
    default: ({ materials }: any) => (
        <div data-testid="materials-grid">
            {materials.map((material: any, index: number) => (
                <div key={index} data-testid="material-item">
                    {material.name}
                </div>
            ))}
        </div>
    ),
}));

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

vi.mock('@/components/common/DropdownList', () => ({
    default: ({ options, onSelect }: any) => (
        <select data-testid="dropdown" onChange={(e) => onSelect(e.target.value)}>
            {options.map((option: any) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    ),
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.alert
global.alert = vi.fn();

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockSubjects = [
    {
        subject_id: 'subject-1',
        name: 'Mathematics',
        description: 'Math subject',
    },
    {
        subject_id: 'subject-2',
        name: 'Physics',
        description: 'Physics subject',
    },
];

const mockLessons = [
    {
        lesson_id: 'lesson-1',
        name: 'Algebra Basics',
        description: 'Basic algebra',
        created_date: '2024-01-01T10:00:00Z',
        user_id: 'user-1',
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile.jpg',
        background_image_url: 'https://example.com/bg.jpg',
        material_count: 5,
        is_public: true,
        view_count: 100,
    },
];

const mockMaterials = [
    {
        material_id: 'material-1',
        name: 'Math Textbook',
        description: 'Advanced mathematics',
        upload_date: '2024-01-01T10:00:00Z',
        user_id: 'user-1',
        user_name: 'Test User',
        profile_picture_url: 'https://example.com/profile.jpg',
        subject_name: 'Mathematics',
        price: 0,
        num_page: 100,
        view_count: 500,
        download_count: 50,
        rating_count: 10,
        avg_rating: 4.5,
    },
];

describe('SearchPage Component', () => {
    const mockRetrieveAllSubjects = vi.mocked(retrieveAllSubjects);
    const mockRetrieveLessons = vi.mocked(retrieveLessons);
    const mockSearchMaterial = vi.mocked(searchMaterial);
    const mockSearchLesson = vi.mocked(searchLesson);

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('test-user-id');
        mockRetrieveAllSubjects.mockResolvedValue(mockSubjects);
        mockRetrieveLessons.mockResolvedValue(mockLessons);
        mockSearchMaterial.mockResolvedValue(mockMaterials);
        mockSearchLesson.mockResolvedValue([]);
    });

    describe('Initial Rendering', () => {
        it('should render search page title', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getAllByText('Search')[0]).toBeInTheDocument();
        });

        it('should render search input', () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            expect(searchInput).toBeInTheDocument();
        });

        it('should render search button', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
        });

        it('should render filter toggle button', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getByRole('button', { name: /toggle filters/i })).toBeInTheDocument();
        });

        it('should have materials tab selected by default', () => {
            renderWithRouter(<SearchPage />);
            
            const materialTab = screen.getByText('Material');
            expect(materialTab).toHaveClass('border-blue-600', 'text-blue-600');
        });

        it('should show filters by default', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To')).toBeInTheDocument();
            expect(screen.getByText('Author')).toBeInTheDocument();
        });
    });

    describe('Search Functionality', () => {
        it('should update search input value', () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'mathematics' } });
            
            expect(searchInput).toHaveValue('mathematics');
        });

        it('should show alert when searching with empty query', () => {
            renderWithRouter(<SearchPage />);
            
            const searchButton = screen.getByRole('button', { name: /search/i });
            fireEvent.click(searchButton);
            
            expect(global.alert).toHaveBeenCalledWith('Please enter a search query');
        });

        it('should perform search when form is submitted', async () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'mathematics' } });
            
            const searchButton = screen.getByRole('button', { name: /search/i });
            fireEvent.click(searchButton);
            
            await waitFor(() => {
                expect(mockSearchMaterial).toHaveBeenCalledWith('mathematics', expect.any(Object));
                expect(mockSearchLesson).toHaveBeenCalledWith('mathematics', expect.any(Object));
            });
        });

        it('should perform search on Enter key press', async () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'physics' } });
            fireEvent.keyDown(searchInput, { key: 'Enter' });
            
            await waitFor(() => {
                expect(mockSearchMaterial).toHaveBeenCalledWith('physics', expect.any(Object));
            });
        });

        it('should display search results for materials', async () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'math' } });
            
            const searchButton = screen.getByRole('button', { name: /search/i });
            fireEvent.click(searchButton);
            
            await waitFor(() => {
                expect(screen.getByTestId('materials-grid')).toBeInTheDocument();
                expect(screen.getByText('Math Textbook')).toBeInTheDocument();
            });
        });
    });

    describe('Tab Functionality', () => {
        it('should switch to lessons tab when clicked', () => {
            renderWithRouter(<SearchPage />);
            
            const lessonTab = screen.getByText('Lesson');
            fireEvent.click(lessonTab);
            
            expect(lessonTab).toHaveClass('border-blue-600', 'text-blue-600');
            expect(screen.getByText('Lessons')).toBeInTheDocument();
        });

        it('should switch back to materials tab when clicked', () => {
            renderWithRouter(<SearchPage />);
            
            // Switch to lessons first
            const lessonTab = screen.getByText('Lesson');
            fireEvent.click(lessonTab);
            
            // Switch back to materials
            const materialTab = screen.getByText('Material');
            fireEvent.click(materialTab);
            
            expect(materialTab).toHaveClass('border-blue-600', 'text-blue-600');
            expect(screen.getByText('Materials')).toBeInTheDocument();
        });

        it('should show lessons grid when lessons tab is active', () => {
            renderWithRouter(<SearchPage />);
            
            const lessonTab = screen.getByText('Lesson');
            fireEvent.click(lessonTab);
            
            expect(screen.getByTestId('lessons-grid')).toBeInTheDocument();
        });
    });

    describe('Filter Functionality', () => {
        it('should toggle filters visibility', () => {
            renderWithRouter(<SearchPage />);
            
            const filterButton = screen.getByRole('button', { name: /toggle filters/i });
            
            // Filters should be visible by default
            expect(screen.getByText('From')).toBeInTheDocument();
            
            // Hide filters
            fireEvent.click(filterButton);
            expect(screen.queryByText('From')).not.toBeInTheDocument();
            
            // Show filters again
            fireEvent.click(filterButton);
            expect(screen.getByText('From')).toBeInTheDocument();
        });

        it('should update date filters', async () => {
            renderWithRouter(<SearchPage />);

            const fromDateInput = screen.getByPlaceholderText('From date');
            const toDateInput = screen.getByPlaceholderText('To date');

            expect(fromDateInput).toBeInTheDocument();
            expect(toDateInput).toBeInTheDocument();

            fireEvent.change(fromDateInput, { target: { value: '2024-01-01' } });
            fireEvent.change(toDateInput, { target: { value: '2024-12-31' } });
            
            expect(fromDateInput).toHaveValue('2024-01-01');
            expect(toDateInput).toHaveValue('2024-12-31');
        });

        it('should update author filter', () => {
            renderWithRouter(<SearchPage />);
            
            const authorInput = screen.getByPlaceholderText('Author id...');
            fireEvent.change(authorInput, { target: { value: 'test-author' } });
            
            expect(authorInput).toHaveValue('test-author');
        });

        it('should show material-specific filters for materials tab', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getByText('Subject')).toBeInTheDocument();
            expect(screen.getByText('In lesson')).toBeInTheDocument();
        });

        it('should hide material-specific filters for lessons tab', () => {
            renderWithRouter(<SearchPage />);
            
            const lessonTab = screen.getByText('Lesson');
            fireEvent.click(lessonTab);
            
            expect(screen.queryByText('Subject')).not.toBeInTheDocument();
            expect(screen.queryByText('In lesson')).not.toBeInTheDocument();
        });

        it('should show sort by filter for both tabs', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getByText('Sort by')).toBeInTheDocument();
            
            // Switch to lessons tab
            const lessonTab = screen.getByText('Lesson');
            fireEvent.click(lessonTab);
            
            expect(screen.getByText('Sort by')).toBeInTheDocument();
        });
    });

    describe('Data Loading', () => {
        it('should fetch subjects and lessons on mount', async () => {
            renderWithRouter(<SearchPage />);
            
            await waitFor(() => {
                expect(mockRetrieveAllSubjects).toHaveBeenCalled();
                expect(mockRetrieveLessons).toHaveBeenCalledWith('test-user-id', 'newest', { from: 0, to: 99 });
            });
        });

        it('should handle localStorage user_id', () => {
            mockLocalStorage.getItem.mockReturnValue('custom-user-id');
            
            renderWithRouter(<SearchPage />);
            
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user_id');
        });

        it('should handle missing user_id in localStorage', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            
            renderWithRouter(<SearchPage />);
            
            await waitFor(() => {
                expect(mockRetrieveLessons).toHaveBeenCalledWith('', 'newest', { from: 0, to: 99 });
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle service errors gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockSearchMaterial.mockRejectedValue(new Error('Search failed'));
            
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'test' } });
            
            const searchButton = screen.getByRole('button', { name: /search/i });
            fireEvent.click(searchButton);
            
            consoleSpy.mockRestore();
        });

        it('should handle empty search results', async () => {
            mockSearchMaterial.mockResolvedValue([]);
            mockSearchLesson.mockResolvedValue([]);
            
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
            
            const searchButton = screen.getByRole('button', { name: /search/i });
            fireEvent.click(searchButton);
            
            await waitFor(() => {
                expect(screen.getByTestId('materials-grid')).toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper aria labels', () => {
            renderWithRouter(<SearchPage />);
            
            expect(screen.getAllByText('Search')[0]).toBeInTheDocument();
            expect(screen.getByLabelText('Toggle filters')).toBeInTheDocument();
        });

        it('should have proper button roles', () => {
            renderWithRouter(<SearchPage />);
            
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should support keyboard navigation', () => {
            renderWithRouter(<SearchPage />);
            
            const searchInput = screen.getByPlaceholderText('Search materials or lessons...');
            searchInput.focus();
            
            expect(document.activeElement).toBe(searchInput);
        });

        it('should have proper form submission', () => {
            renderWithRouter(<SearchPage />);
            
            const form = screen.getByPlaceholderText('Search materials or lessons...').closest('form');
            expect(form).toBeInTheDocument();
        });
    });

    describe('Responsive Design', () => {
        it('should have responsive grid classes for filters', () => {
            renderWithRouter(<SearchPage />);
            
            const filtersContainer = screen.getByText('From').closest('div')?.parentElement;
            expect(filtersContainer).toHaveClass('grid', 'gap-3', 'sm:grid-cols-2', 'md:grid-cols-3');
        });

        it('should have responsive tab layout', () => {
            renderWithRouter(<SearchPage />);
            
            const tabsContainer = screen.getByText('Material').parentElement;
            expect(tabsContainer).toHaveClass('flex', 'gap-2', 'border-b', 'border-gray-200');
        });
    });
});

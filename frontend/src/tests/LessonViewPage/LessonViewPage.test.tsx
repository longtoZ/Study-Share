import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { retrieveAllMaterials } from '@/services/lessonService';
import { verifyUser } from '@/services/authService';
import { addEntry } from '@/services/historyService';
import LessonViewPage from '@/pages/LessonViewPage/LessonViewPage';

vi.mock('@/services/lessonService', () => ({
    retrieveAllMaterials: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
    verifyUser: vi.fn(),
}));

vi.mock('@/services/historyService', () => ({
    addEntry: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => 'test-user-id'),
    },
});

// Mock UUID
vi.mock('uuid', () => ({
    v4: vi.fn(() => 'mock-uuid'),
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

const mockMaterialsData = {
    materials: [
        {
            material_id: 'material-1',
            name: 'Test Material 1',
            description: 'Test description 1',
            author_name: 'Author 1',
            author_profile_picture_url: 'profile1.jpg',
            created_date: '2024-01-01T10:00:00Z',
            material_url: 'material1.pdf',
            thumbnail_url: 'thumb1.jpg',
            user_id: 'author-1'
        },
        {
            material_id: 'material-2',
            name: 'Test Material 2',
            description: 'Test description 2',
            author_name: 'Author 2',
            author_profile_picture_url: 'profile2.jpg',
            created_date: '2024-01-02T15:30:00Z',
            material_url: 'material2.pdf',
            thumbnail_url: 'thumb2.jpg',
            user_id: 'author-2'
        }
    ],
    lessonName: 'Test Lesson',
    authorId: 'lesson-author-id'
};

describe('LessonViewPage Component', () => {
    const mockRetrieveAllMaterials = vi.mocked(retrieveAllMaterials);
    const mockVerifyUser = vi.mocked(verifyUser);
    const mockAddEntry = vi.mocked(addEntry);

    beforeEach(() => {
        vi.clearAllMocks();
        mockRetrieveAllMaterials.mockResolvedValue(mockMaterialsData);
        mockAddEntry.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render loading state initially', () => {
            render(<LessonViewPage />);
            
            expect(screen.getByText('Loading materials...')).toBeInTheDocument();
        });

        it('should render lesson page with materials after loading', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('All Materials')).toBeInTheDocument();
                expect(screen.getByText("Test Lesson")).toBeInTheDocument();
            });
        });

        it('should fetch materials on mount', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(mockRetrieveAllMaterials).toHaveBeenCalledWith('test-lesson-id', 'newest');
            });
        });

        it('should add history entry on mount', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(mockAddEntry).toHaveBeenCalledWith({
                    history_id: 'test-user-id-mock-uuid',
                    user_id: 'test-user-id',
                    material_id: null,
                    lesson_id: 'test-lesson-id',
                    type: 'lessons',
                    viewed_date: expect.any(Date),
                });
            });
        });
    });

    describe('Author Verification', () => {
        it('should show edit button when user is author', async () => {
            mockVerifyUser.mockResolvedValue({ verified: true });
            
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
            });
        });

        it('should not show edit button when user is not author', async () => {
            mockVerifyUser.mockRejectedValue(new Error('Not authorized'));
            
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.queryByText('Edit Lesson')).not.toBeInTheDocument();
            });
        });

        it('should navigate to edit page when edit button is clicked', async () => {
            mockVerifyUser.mockResolvedValue({ verified: true });
            
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
            });
            
            const editButton = screen.getByText('Edit Lesson');
            fireEvent.click(editButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/lesson/test-lesson-id/edit');
        });
    });

    describe('Material Ordering', () => {
        it('should display newest materials by default', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Newest')).toHaveClass('bg-white');
                expect(screen.getByText('Oldest')).toHaveClass('text-zinc-800');
            });
        });

        it('should change to oldest order when clicked', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Oldest')).toBeInTheDocument();
            });
            
            const oldestButton = screen.getByText('Oldest');
            fireEvent.click(oldestButton);
            
            await waitFor(() => {
                expect(mockRetrieveAllMaterials).toHaveBeenCalledWith('test-lesson-id', 'oldest');
            });
        });

        it('should update UI when switching to oldest', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Oldest')).toBeInTheDocument();
            });
            
            const oldestButton = screen.getByText('Oldest');
            fireEvent.click(oldestButton);
            
            await waitFor(() => {
                expect(screen.getByText('Oldest')).toHaveClass('bg-white');
                expect(screen.getByText('Newest')).toHaveClass('text-zinc-800');
            });
        });
    });

    describe('Materials Display', () => {
        it('should display materials when loaded', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material 1')).toBeInTheDocument();
                expect(screen.getByText('Test Material 2')).toBeInTheDocument();
            });
        });

        it('should show empty state when no materials found', async () => {
            mockRetrieveAllMaterials.mockResolvedValue({
                materials: [],
                lessonName: 'Empty Lesson',
                authorId: 'author-id'
            });
            
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('No materials found.')).toBeInTheDocument();
            });
        });
    });

    describe('Navigation', () => {
        it('should navigate to create lesson page when create button is clicked', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Create lesson')).toBeInTheDocument();
            });
            
            const createButton = screen.getByText('Create lesson');
            fireEvent.click(createButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/create-lesson');
        });
    });

    describe('Search Functionality', () => {
        it('should render search bar', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                const searchInput = screen.getByRole('textbox');
                expect(searchInput).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle materials fetch error gracefully', async () => {
            mockRetrieveAllMaterials.mockRejectedValue(new Error('Failed to fetch materials'));
            
            render(<LessonViewPage />);
            
            // Component should still render without crashing
            expect(screen.getByText('All Materials')).toBeInTheDocument();
        });

        it('should handle missing lesson data', async () => {
            mockRetrieveAllMaterials.mockResolvedValue({
                materials: [],
                lessonName: '',
                authorId: 'author-id'
            });
            
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.getByText("'s materials")).toBeInTheDocument();
            });
        });
    });

    describe('Loading States', () => {
        it('should show loading indicator when fetching materials', () => {
            render(<LessonViewPage />);
            
            expect(screen.getByText('Loading materials...')).toBeInTheDocument();
        });

        it('should hide loading indicator after materials are loaded', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(screen.queryByText('Loading materials...')).not.toBeInTheDocument();
            });
        });
    });

    describe('Component Lifecycle', () => {
        it('should refetch materials when order changes', async () => {
            render(<LessonViewPage />);
            
            await waitFor(() => {
                expect(mockRetrieveAllMaterials).toHaveBeenCalledWith('test-lesson-id', 'newest');
            });
            
            const oldestButton = screen.getByText('Oldest');
            fireEvent.click(oldestButton);
            
            await waitFor(() => {
                expect(mockRetrieveAllMaterials).toHaveBeenCalledWith('test-lesson-id', 'oldest');
            });
            
            expect(mockRetrieveAllMaterials).toHaveBeenCalledTimes(2);
        });
    });
});

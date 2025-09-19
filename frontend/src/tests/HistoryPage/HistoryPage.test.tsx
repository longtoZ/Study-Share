import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HistoryPage from '@/pages/HistoryPage/HistoryPage';
import { deleteEntry, bulkDeleteEntries, listEntries } from '@/services/historyService';

vi.mock('@/services/historyService', () => ({
    deleteEntry: vi.fn(),
    bulkDeleteEntries: vi.fn(),
    listEntries: vi.fn(),
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(() => 'test-user-id'),
    },
});

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

const mockHistoryEntries = [
    {
        history_id: 'history-1',
        material_id: 'material-1',
        material_name: 'Test Material',
        material_author_name: 'Author 1',
        material_author_profile_picture_url: 'profile1.jpg',
        type: 'material',
        viewed_date: '2024-01-01T10:00:00Z',
        user_id: 'author-1'
    },
    {
        history_id: 'history-2',
        lesson_id: 'lesson-1',
        lesson_name: 'Test Lesson',
        lesson_author_name: 'Author 2',
        lesson_author_profile_picture_url: 'profile2.jpg',
        type: 'lesson',
        viewed_date: '2024-01-02T15:30:00Z',
        user_id: 'author-2'
    }
];

describe('HistoryPage Component', () => {
    const mockListEntries = vi.mocked(listEntries);
    const mockDeleteEntry = vi.mocked(deleteEntry);
    const mockBulkDeleteEntries = vi.mocked(bulkDeleteEntries);

    beforeEach(() => {
        vi.clearAllMocks();
        mockListEntries.mockResolvedValue(mockHistoryEntries);
        mockDeleteEntry.mockResolvedValue({ success: true });
        mockBulkDeleteEntries.mockResolvedValue({ success: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render history page with initial state', async () => {
            renderWithRouter(<HistoryPage />);
            
            expect(screen.getByText('Materials and Lessons history')).toBeInTheDocument();
            expect(screen.getByText('Type')).toBeInTheDocument();
            expect(screen.getByText('From')).toBeInTheDocument();
            expect(screen.getByText('To')).toBeInTheDocument();
            
            await waitFor(() => {
                expect(mockListEntries).toHaveBeenCalledWith('test-user-id', expect.any(Object), expect.any(Object));
            });
        });

        it('should display history entries in table', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
                expect(screen.getByText('Test Lesson')).toBeInTheDocument();
                expect(screen.getByText('Author 1')).toBeInTheDocument();
                expect(screen.getByText('Author 2')).toBeInTheDocument();
            });
        });

        it('should show loading state initially', () => {
            renderWithRouter(<HistoryPage />);
            
            expect(screen.getByText('Fetching history...')).toBeInTheDocument();
        });
    });

    describe('Filter Functionality', () => {
        it('should handle filter type change', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            // Change filter to lessons
            const dropdown = screen.getByText('Materials');
            fireEvent.click(dropdown);
            
            const lessonsOption = screen.getByText('Lessons');
            fireEvent.click(lessonsOption);
            
            await waitFor(() => {
                expect(mockListEntries).toHaveBeenCalledWith(
                    'test-user-id',
                    expect.objectContaining({ type: 'lessons' }),
                    expect.any(Object)
                );
            });
        });

        // it('should handle date filter changes', async () => {
        //     renderWithRouter(<HistoryPage />);
            
        //     await waitFor(() => {
        //         expect(screen.getByText('Test Material')).toBeInTheDocument();
        //     });
            
        //     const fromInput = screen.getAllByRole('textbox')[0];
        //     const toInput = screen.getAllByRole('textbox')[1];
            
        //     fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
        //     fireEvent.change(toInput, { target: { value: '2024-01-31' } });
            
        //     expect(fromInput).toHaveValue('2024-01-01');
        //     expect(toInput).toHaveValue('2024-01-31');
        // });
    });

    describe('Entry Selection', () => {
        it('should handle individual entry selection', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const checkboxes = screen.getAllByRole('checkbox');
            const firstEntryCheckbox = checkboxes[1]; // Skip the "select all" checkbox
            
            fireEvent.click(firstEntryCheckbox);
            
            expect(screen.getByText('1 selected')).toBeInTheDocument();
        });

        it('should handle select all functionality', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
            fireEvent.click(selectAllCheckbox);
            
            expect(screen.getByText('2 selected')).toBeInTheDocument();
        });

        it('should show delete selected button when entries are selected', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const firstEntryCheckbox = screen.getAllByRole('checkbox')[1];
            fireEvent.click(firstEntryCheckbox);
            
            expect(screen.getByText('Delete selected')).toBeInTheDocument();
        });
    });

    describe('Entry Actions', () => {
        it('should handle individual entry deletion', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            
            await waitFor(() => {
                expect(mockDeleteEntry).toHaveBeenCalledWith(mockHistoryEntries[0]);
            });
        });

        it('should handle bulk deletion', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            // Select entries
            const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
            fireEvent.click(selectAllCheckbox);
            
            const deleteSelectedButton = screen.getByText('Delete selected');
            fireEvent.click(deleteSelectedButton);
            
            await waitFor(() => {
                expect(mockBulkDeleteEntries).toHaveBeenCalledWith(['history-1', 'history-2']);
            });
        });

        it('should navigate to material when clicking material name', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const materialLink = screen.getByText('Test Material');
            fireEvent.click(materialLink);
            
            expect(mockNavigate).toHaveBeenCalledWith('/material/material-1');
        });

        it('should navigate to lesson when clicking lesson name', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Lesson')).toBeInTheDocument();
            });
            
            const lessonLink = screen.getByText('Test Lesson');
            fireEvent.click(lessonLink);
            
            expect(mockNavigate).toHaveBeenCalledWith('/lesson/lesson-1');
        });

        it('should navigate to user profile when clicking author name', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Author 1')).toBeInTheDocument();
            });
            
            const authorLink = screen.getByText('Author 1');
            fireEvent.click(authorLink);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/author-1');
        });
    });

    describe('Pagination', () => {
        it('should handle previous page navigation', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const previousButton = screen.getByText('Previous');
            expect(previousButton).toBeDisabled(); // Should be disabled on first page
        });

        it('should handle next page navigation', async () => {
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('Test Material')).toBeInTheDocument();
            });
            
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
            
            await waitFor(() => {
                expect(mockListEntries).toHaveBeenCalledWith(
                    'test-user-id',
                    expect.any(Object),
                    { from: 10, to: 19 }
                );
            });
        });
    });

    describe('Empty State', () => {
        it('should show empty state when no entries found', async () => {
            mockListEntries.mockResolvedValue([]);
            
            renderWithRouter(<HistoryPage />);
            
            await waitFor(() => {
                expect(screen.getByText('No history entries found.')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', async () => {
            mockListEntries.mockRejectedValue(new Error('API Error'));
            
            renderWithRouter(<HistoryPage />);
            
            // Component should still render without crashing
            expect(screen.getByText('Materials and Lessons history')).toBeInTheDocument();
        });
    });
});


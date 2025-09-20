import { render, screen, fireEvent } from '@testing-library/react';
import TopContributors from '@/pages/StatisticsPage/components/TopContributors';

// Mock Material-UI icons
vi.mock('@mui/icons-material/ArrowForwardIos', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="arrow-icon" {...props}>ArrowForwardIosIcon</div>
}));

const mockTopContributors = [
    {
        user_id: '1',
        full_name: 'John Doe',
        profile_picture_url: 'https://example.com/john.jpg',
        total_materials: 25,
        total_lessons: 15
    },
    {
        user_id: '2',
        full_name: 'Jane Smith',
        profile_picture_url: 'https://example.com/jane.jpg',
        total_materials: 20,
        total_lessons: 12
    },
    {
        user_id: '3',
        full_name: 'Bob Johnson',
        profile_picture_url: 'https://example.com/bob.jpg',
        total_materials: 18,
        total_lessons: 10
    },
    {
        user_id: '4',
        full_name: 'Alice Brown',
        profile_picture_url: 'https://example.com/alice.jpg',
        total_materials: 15,
        total_lessons: 8
    }
];

// Mock window.open
Object.defineProperty(window, 'open', {
    value: vi.fn(),
    writable: true
});

describe('TopContributors Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render component title', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('Top Contributors')).toBeInTheDocument();
        });

        it('should render table headers', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('Rank')).toBeInTheDocument();
            expect(screen.getByText('User')).toBeInTheDocument();
            expect(screen.getByText('Materials Uploaded')).toBeInTheDocument();
            expect(screen.getByText('Lessons Created')).toBeInTheDocument();
        });

        it('should render all contributors', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
            expect(screen.getByText('Alice Brown')).toBeInTheDocument();
        });
    });

    describe('Data Display', () => {
        it('should display user names correctly', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            mockTopContributors.forEach(user => {
                expect(screen.getByText(user.full_name)).toBeInTheDocument();
            });
        });

        it('should display materials count correctly', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('25 materials')).toBeInTheDocument();
            expect(screen.getByText('20 materials')).toBeInTheDocument();
            expect(screen.getByText('18 materials')).toBeInTheDocument();
            expect(screen.getByText('15 materials')).toBeInTheDocument();
        });

        it('should display lessons count correctly', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('15 lessons')).toBeInTheDocument();
            expect(screen.getByText('12 lessons')).toBeInTheDocument();
            expect(screen.getByText('10 lessons')).toBeInTheDocument();
            expect(screen.getByText('8 lessons')).toBeInTheDocument();
        });

        it('should display rank numbers correctly', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('4')).toBeInTheDocument();
        });
    });

    describe('Profile Pictures', () => {
        it('should render profile pictures with correct attributes', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const johnImage = screen.getByAltText('John Doe');
            const janeImage = screen.getByAltText('Jane Smith');
            
            expect(johnImage).toHaveAttribute('src', 'https://example.com/john.jpg');
            expect(janeImage).toHaveAttribute('src', 'https://example.com/jane.jpg');
        });

        it('should have proper image styling', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const images = screen.getAllByRole('img');
            images.forEach(img => {
                expect(img).toHaveClass('w-10', 'h-10', 'rounded-full', 'mr-3', 'object-cover');
            });
        });

        it('should have referrer policy set', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const images = screen.getAllByRole('img');
            images.forEach(img => {
                expect(img).toHaveAttribute('referrerPolicy', 'no-referrer');
            });
        });
    });

    describe('Rank Styling', () => {
        it('should apply special styling for top 3 ranks', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            // Check for rank styling classes (yellow for 1st, gray for 2nd, red for 3rd)
            const rankElements = document.querySelectorAll('span');
            const firstRank = Array.from(rankElements).find(el => el.textContent === '1');
            const secondRank = Array.from(rankElements).find(el => el.textContent === '2');
            const thirdRank = Array.from(rankElements).find(el => el.textContent === '3');
            
            expect(firstRank).toHaveClass('text-yellow-500', 'bg-yellow-200');
            expect(secondRank).toHaveClass('text-gray-500', 'bg-gray-200');
            expect(thirdRank).toHaveClass('text-red-500', 'bg-red-200');
        });

        it('should apply default styling for ranks beyond top 3', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const rankElements = document.querySelectorAll('span');
            const fourthRank = Array.from(rankElements).find(el => el.textContent === '4');
            
            expect(fourthRank).toHaveClass('bg-gray-100', 'text-gray-500');
        });

        it('should apply row background gradient for top 3', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const rows = document.querySelectorAll('tbody tr');
            
            expect(rows[0]).toHaveClass('bg-gradient-to-r', 'from-yellow-300', 'via-yellow-50', 'to-white');
            expect(rows[1]).toHaveClass('bg-gradient-to-r', 'from-gray-300', 'via-gray-50', 'to-white');
            expect(rows[2]).toHaveClass('bg-gradient-to-r', 'from-red-300', 'via-red-50', 'to-white');
        });
    });

    describe('Row Interactions', () => {
        it('should open user profile when row is clicked', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const johnRow = screen.getByText('John Doe').closest('tr');
            fireEvent.click(johnRow!);
            
            expect(window.open).toHaveBeenCalledWith('/user/1', '_blank');
        });

        it('should have hover effects on rows', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                expect(row).toHaveClass('hover:bg-zinc-50', 'cursor-pointer');
            });
        });

        it('should render arrow icons in each row', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const arrowIcons = screen.getAllByTestId('arrow-icon');
            expect(arrowIcons).toHaveLength(mockTopContributors.length);
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const container = document.querySelector('.bg-white.p-8.rounded-3xl.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have scrollable table', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const scrollContainer = document.querySelector('.overflow-x-auto');
            expect(scrollContainer).toBeInTheDocument();
        });

        it('should have proper table structure', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const table = screen.getByRole('table');
            expect(table).toHaveClass('w-full', 'text-left', 'border-separate', 'border-spacing-y-1');
        });

        it('should have proper header styling', () => {
            render(<TopContributors topContributors={mockTopContributors} />);
            
            const headerRow = document.querySelector('thead tr');
            expect(headerRow).toHaveClass('bg-gray-50');
        });
    });

    describe('Empty Data Handling', () => {
        it('should handle empty contributors array', () => {
            render(<TopContributors topContributors={[]} />);
            
            expect(screen.getByText('Top Contributors')).toBeInTheDocument();
            expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        });
    });

    describe('Data Types', () => {
        it('should handle single contributor', () => {
            const singleContributor = [mockTopContributors[0]];
            
            render(<TopContributors topContributors={singleContributor} />);
            
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('25 materials')).toBeInTheDocument();
            expect(screen.getByText('15 lessons')).toBeInTheDocument();
        });

        it('should handle zero values correctly', () => {
            const zeroContributor = [{
                user_id: '1',
                full_name: 'Zero User',
                profile_picture_url: 'https://example.com/zero.jpg',
                total_materials: 0,
                total_lessons: 0
            }];
            
            render(<TopContributors topContributors={zeroContributor} />);
            
            expect(screen.getByText('0 materials')).toBeInTheDocument();
            expect(screen.getByText('0 lessons')).toBeInTheDocument();
        });
    });
});
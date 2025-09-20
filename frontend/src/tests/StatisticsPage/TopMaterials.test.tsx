import { render, screen, fireEvent } from '@testing-library/react';
import TopMaterials from '@/pages/StatisticsPage/components/TopMaterials';

// Mock Material-UI icons
vi.mock('@mui/icons-material/Visibility', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="visibility-icon" {...props}>VisibilityIcon</div>
}));

vi.mock('@mui/icons-material/Download', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="download-icon" {...props}>DownloadIcon</div>
}));

vi.mock('@mui/icons-material/ArrowForwardIos', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="arrow-icon" {...props}>ArrowForwardIosIcon</div>
}));

// Mock DropdownList component
vi.mock('@/components/common/DropdownList', () => ({
    __esModule: true,
    default: ({ options, onSelect, className }: any) => (
        <select 
            data-testid="range-dropdown"
            className={className}
            onChange={(e) => onSelect(e.target.value)}
        >
            {options.map((option: any) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    )
}));

const mockMostViewedMaterials = [
    {
        material_id: '1',
        name: 'Advanced Mathematics',
        upload_date: '2024-01-15',
        view_count: 150,
        download_count: 75
    },
    {
        material_id: '2',
        name: 'Physics Fundamentals',
        upload_date: '2024-02-10',
        view_count: 120,
        download_count: 60
    }
];

const mockMostDownloadedMaterials = [
    {
        material_id: '3',
        name: 'Chemistry Basics',
        upload_date: '2024-01-20',
        view_count: 100,
        download_count: 90
    },
    {
        material_id: '4',
        name: 'Biology Guide',
        upload_date: '2024-02-05',
        view_count: 80,
        download_count: 85
    }
];

const mockProps = {
    mostViewedMaterials: mockMostViewedMaterials,
    mostDownloadedMaterials: mockMostDownloadedMaterials,
    setMaterialsRange: vi.fn()
};

// Mock window.open
Object.defineProperty(window, 'open', {
    value: vi.fn(),
    writable: true
});

describe('TopMaterials Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render component title', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('Top Materials Leaderboard')).toBeInTheDocument();
        });

        it('should render range dropdown', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByTestId('range-dropdown')).toBeInTheDocument();
        });

        it('should render tab buttons', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('Most Viewed')).toBeInTheDocument();
            expect(screen.getByText('Most Downloaded')).toBeInTheDocument();
        });

        it('should render table headers', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('Rank')).toBeInTheDocument();
            expect(screen.getByText('Material Name')).toBeInTheDocument();
            expect(screen.getByText('Upload Date')).toBeInTheDocument();
        });

        it('should render icons in tab buttons', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByTestId('visibility-icon')).toBeInTheDocument();
            expect(screen.getByTestId('download-icon')).toBeInTheDocument();
        });
    });

    describe('Tab Functionality', () => {
        it('should start with "viewed" tab active', () => {
            render(<TopMaterials {...mockProps} />);
            
            const viewedButton = screen.getByText('Most Viewed').closest('button');
            const downloadedButton = screen.getByText('Most Downloaded').closest('button');
            
            expect(viewedButton).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-sky-500', 'text-white');
            expect(downloadedButton).toHaveClass('bg-gray-100', 'text-gray-600');
        });

        it('should switch to downloaded tab when clicked', () => {
            render(<TopMaterials {...mockProps} />);
            
            const downloadedButton = screen.getByText('Most Downloaded');
            fireEvent.click(downloadedButton);
            
            const downloadedButtonElement = downloadedButton.closest('button');
            const viewedButton = screen.getByText('Most Viewed').closest('button');
            
            expect(downloadedButtonElement).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-sky-500', 'text-white');
            expect(viewedButton).toHaveClass('bg-gray-100', 'text-gray-600');
        });

        it('should display correct materials based on active tab', () => {
            render(<TopMaterials {...mockProps} />);
            
            // Initially shows viewed materials
            expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument();
            expect(screen.getByText('Physics Fundamentals')).toBeInTheDocument();
            
            // Switch to downloaded tab
            fireEvent.click(screen.getByText('Most Downloaded'));
            
            expect(screen.getByText('Chemistry Basics')).toBeInTheDocument();
            expect(screen.getByText('Biology Guide')).toBeInTheDocument();
        });
    });

    describe('Data Display', () => {
        it('should display material names correctly', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument();
            expect(screen.getByText('Physics Fundamentals')).toBeInTheDocument();
        });

        it('should format upload dates correctly', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('1/15/2024')).toBeInTheDocument();
            expect(screen.getByText('2/10/2024')).toBeInTheDocument();
        });

        it('should display view counts in viewed tab', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('150 views')).toBeInTheDocument();
            expect(screen.getByText('120 views')).toBeInTheDocument();
        });

        it('should display download counts in downloaded tab', () => {
            render(<TopMaterials {...mockProps} />);
            
            fireEvent.click(screen.getByText('Most Downloaded'));
            
            expect(screen.getByText('90 downloads')).toBeInTheDocument();
            expect(screen.getByText('85 downloads')).toBeInTheDocument();
        });

        it('should display rank numbers correctly', () => {
            render(<TopMaterials {...mockProps} />);
            
            const rankElements = screen.getAllByText('1');
            const rank2Elements = screen.getAllByText('2');
            
            expect(rankElements.length).toBeGreaterThan(0);
            expect(rank2Elements.length).toBeGreaterThan(0);
        });
    });

    describe('Table Headers Update', () => {
        it('should show "Views" and "Downloads" headers in viewed tab', () => {
            render(<TopMaterials {...mockProps} />);
            
            expect(screen.getByText('Views')).toBeInTheDocument();
            expect(screen.getByText('Downloads')).toBeInTheDocument();
        });

        it('should show "Downloads" and "Views" headers in downloaded tab', () => {
            render(<TopMaterials {...mockProps} />);
            
            fireEvent.click(screen.getByText('Most Downloaded'));
            
            const headers = screen.getAllByText('Downloads');
            const viewHeaders = screen.getAllByText('Views');
            
            expect(headers.length).toBeGreaterThan(0);
            expect(viewHeaders.length).toBeGreaterThan(0);
        });
    });

    describe('Range Dropdown', () => {
        it('should call setMaterialsRange when dropdown changes', () => {
            render(<TopMaterials {...mockProps} />);
            
            const dropdown = screen.getByTestId('range-dropdown');
            fireEvent.change(dropdown, { target: { value: 'last-week' } });
            
            expect(mockProps.setMaterialsRange).toHaveBeenCalledWith('last-week');
        });

        it('should have proper styling classes', () => {
            render(<TopMaterials {...mockProps} />);
            
            const dropdown = screen.getByTestId('range-dropdown');
            expect(dropdown).toHaveClass('w-48');
        });
    });

    describe('Row Interactions', () => {
        it('should open material page when row is clicked', () => {
            render(<TopMaterials {...mockProps} />);
            
            const materialRow = screen.getByText('Advanced Mathematics').closest('tr');
            fireEvent.click(materialRow!);
            
            expect(window.open).toHaveBeenCalledWith('/material/1', '_blank');
        });

        it('should have hover effects on rows', () => {
            render(<TopMaterials {...mockProps} />);
            
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                expect(row).toHaveClass('hover:bg-blue-50');
            });
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<TopMaterials {...mockProps} />);
            
            const container = document.querySelector('.bg-white.p-8.rounded-3xl.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have scrollable table', () => {
            render(<TopMaterials {...mockProps} />);
            
            const scrollContainer = document.querySelector('.overflow-x-auto');
            expect(scrollContainer).toBeInTheDocument();
        });

        it('should render arrow icons in table rows', () => {
            render(<TopMaterials {...mockProps} />);
            
            const arrowIcons = screen.getAllByTestId('arrow-icon');
            expect(arrowIcons.length).toBe(mockMostViewedMaterials.length);
        });
    });

    describe('Empty Data Handling', () => {
        it('should handle empty materials arrays', () => {
            const emptyProps = {
                ...mockProps,
                mostViewedMaterials: [],
                mostDownloadedMaterials: []
            };
            
            render(<TopMaterials {...emptyProps} />);
            
            expect(screen.getByText('Top Materials Leaderboard')).toBeInTheDocument();
            expect(screen.queryByText('Advanced Mathematics')).not.toBeInTheDocument();
        });
    });
});
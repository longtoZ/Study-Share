import { render, screen } from '@testing-library/react';
import GeneralStats from '@/pages/StatisticsPage/components/GeneralStats';

// Mock Material-UI icons
vi.mock('@mui/icons-material/Article', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="article-icon" {...props}>ArticleIcon</div>
}));

vi.mock('@mui/icons-material/CollectionsBookmark', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="collections-icon" {...props}>CollectionsBookmarkIcon</div>
}));

vi.mock('@mui/icons-material/Group', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="group-icon" {...props}>GroupIcon</div>
}));

vi.mock('@mui/icons-material/Download', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="download-icon" {...props}>DownloadIcon</div>
}));

const mockGeneralStats = {
    totalMaterials: 150,
    totalLessons: 75,
    totalDownloads: 2500,
    totalUsers: 1200
};

describe('GeneralStats Component', () => {
    describe('Initial Rendering', () => {
        it('should render all stat cards', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            expect(screen.getByText('Total Materials')).toBeInTheDocument();
            expect(screen.getByText('Total Lessons')).toBeInTheDocument();
            expect(screen.getByText('Total Downloads')).toBeInTheDocument();
            expect(screen.getByText('Total Users')).toBeInTheDocument();
        });

        it('should display correct stat values', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            expect(screen.getByText('150')).toBeInTheDocument();
            expect(screen.getByText('75')).toBeInTheDocument();
            expect(screen.getByText('2500')).toBeInTheDocument();
            expect(screen.getByText('1200')).toBeInTheDocument();
        });

        it('should render all icons', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            expect(screen.getByTestId('article-icon')).toBeInTheDocument();
            expect(screen.getByTestId('collections-icon')).toBeInTheDocument();
            expect(screen.getByTestId('download-icon')).toBeInTheDocument();
            expect(screen.getByTestId('group-icon')).toBeInTheDocument();
        });
    });

    describe('Data Display', () => {
        it('should handle zero values', () => {
            const zeroStats = {
                totalMaterials: 0,
                totalLessons: 0,
                totalDownloads: 0,
                totalUsers: 0
            };
            
            render(<GeneralStats generalStats={zeroStats} />);
            
            const zeroValues = screen.getAllByText('0');
            expect(zeroValues).toHaveLength(4);
        });

        it('should handle large numbers', () => {
            const largeStats = {
                totalMaterials: 999999,
                totalLessons: 888888,
                totalDownloads: 777777,
                totalUsers: 666666
            };
            
            render(<GeneralStats generalStats={largeStats} />);
            
            expect(screen.getByText('999999')).toBeInTheDocument();
            expect(screen.getByText('888888')).toBeInTheDocument();
            expect(screen.getByText('777777')).toBeInTheDocument();
            expect(screen.getByText('666666')).toBeInTheDocument();
        });
    });

    describe('Component Structure', () => {
        it('should have proper grid layout', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-4');
            expect(gridContainer).toBeInTheDocument();
        });

        it('should have proper card styling', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const cards = document.querySelectorAll('.bg-white.p-6.rounded-3xl.shadow-lg');
            expect(cards).toHaveLength(4);
        });

        it('should have hover effects', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const hoverCards = document.querySelectorAll('.hover\\:scale-105');
            expect(hoverCards).toHaveLength(4);
        });
    });

    describe('Icon Colors', () => {
        it('should have correct icon color classes', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const articleIcon = screen.getByTestId('article-icon');
            const collectionsIcon = screen.getByTestId('collections-icon');
            const downloadIcon = screen.getByTestId('download-icon');
            const groupIcon = screen.getByTestId('group-icon');
            
            expect(articleIcon).toHaveClass('text-blue-600');
            expect(collectionsIcon).toHaveClass('text-green-600');
            expect(downloadIcon).toHaveClass('text-red-600');
            expect(groupIcon).toHaveClass('text-purple-600');
        });
    });

    describe('Gradient Backgrounds', () => {
        it('should have gradient overlay elements', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const gradientOverlays = document.querySelectorAll('.absolute.inset-0.bg-gradient-to-r');
            expect(gradientOverlays).toHaveLength(4);
        });

        it('should have proper gradient classes', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            expect(document.querySelector('.from-blue-500.to-blue-300')).toBeInTheDocument();
            expect(document.querySelector('.from-green-500.to-green-300')).toBeInTheDocument();
            expect(document.querySelector('.from-red-500.to-red-300')).toBeInTheDocument();
            expect(document.querySelector('.from-purple-500.to-purple-300')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const headings = screen.getAllByRole('heading', { level: 2 });
            expect(headings).toHaveLength(4);
        });

        it('should have readable text content', () => {
            render(<GeneralStats generalStats={mockGeneralStats} />);
            
            const materialTitle = screen.getByText('Total Materials');
            const materialValue = screen.getByText('150');
            
            expect(materialTitle).toHaveClass('text-gray-700');
            expect(materialValue).toHaveClass('text-gray-900');
        });
    });
});
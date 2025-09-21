import { render, screen } from '@testing-library/react';
import AboutSection from '@/pages/UserProfilePage/components/AboutSection';

// Mock Material-UI icons
vi.mock('@mui/icons-material/ArticleOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="article-icon" {...props}>ArticleIcon</div>
}));

vi.mock('@mui/icons-material/SchoolOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="school-icon" {...props}>SchoolIcon</div>
}));

vi.mock('@mui/icons-material/DownloadOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="download-icon" {...props}>DownloadIcon</div>
}));

vi.mock('@mui/icons-material/PeopleOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="people-icon" {...props}>PeopleIcon</div>
}));

const mockUser = {
    bio: 'I am a passionate computer science student who loves sharing knowledge and helping others learn. I have experience in web development, algorithms, and data structures.',
    statistics: {
        total_materials: 25,
        total_lessons: 12,
        total_downloads: 1450,
        average_rating: 4.8
    }
};

const mockUserWithZeroStats = {
    bio: 'New to the platform and excited to start sharing!',
    statistics: {
        total_materials: 0,
        total_lessons: 0,
        total_downloads: 0,
        average_rating: 0
    }
};

const mockUserWithoutBio = {
    bio: '',
    statistics: {
        total_materials: 5,
        total_lessons: 3,
        total_downloads: 150,
        average_rating: 4.2
    }
};

describe('AboutSection Component', () => {
    describe('Bio Section', () => {
        it('should render About section header', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText('About')).toBeInTheDocument();
        });

        it('should render user bio text', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText(/passionate computer science student/)).toBeInTheDocument();
        });

        it('should handle empty bio gracefully', () => {
            render(<AboutSection user={mockUserWithoutBio} />);
            
            // Should not crash and still render the About section
            expect(screen.getByText('About')).toBeInTheDocument();
        });

        it('should have proper text alignment for bio', () => {
            render(<AboutSection user={mockUser} />);
            
            const bioText = screen.getByText(/passionate computer science student/);
            expect(bioText).toHaveClass('text-justify');
        });
    });

    describe('Achievement Section', () => {
        it('should render Achievement section header', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText('Achievement')).toBeInTheDocument();
        });

        it('should render all four achievement cards', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText('Study Materials')).toBeInTheDocument();
            expect(screen.getByText('Learning Lessons')).toBeInTheDocument();
            expect(screen.getByText('Total Downloads')).toBeInTheDocument();
            expect(screen.getByText('Community Ratings')).toBeInTheDocument();
        });

        it('should display correct statistics values', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText('25')).toBeInTheDocument(); // total_materials
            expect(screen.getByText('12')).toBeInTheDocument(); // total_lessons
            expect(screen.getByText('1450')).toBeInTheDocument(); // total_downloads
            expect(screen.getByText('4.8')).toBeInTheDocument(); // average_rating
        });

        it('should display zero values correctly', () => {
            render(<AboutSection user={mockUserWithZeroStats} />);
            
            expect(screen.getAllByText('0')).toHaveLength(4); // All stats are 0
        });
    });

    describe('Card Content', () => {
        it('should display descriptive text for each card', () => {
            render(<AboutSection user={mockUser} />);
            
            expect(screen.getByText('Documents, Notes & Guides')).toBeInTheDocument();
            expect(screen.getByText('Curated Content Collections')).toBeInTheDocument();
            expect(screen.getByText('By Other Students')).toBeInTheDocument();
            expect(screen.getByText('Feedback Received')).toBeInTheDocument();
        });

        it('should have proper font styling for statistics', () => {
            render(<AboutSection user={mockUser} />);
            
            const statsNumbers = document.querySelectorAll('.text-3xl.font-bold');
            expect(statsNumbers).toHaveLength(4);
        });

        it('should have proper font styling for card titles', () => {
            render(<AboutSection user={mockUser} />);
            
            const cardTitles = document.querySelectorAll('.font-semibold');
            expect(cardTitles.length).toBeGreaterThanOrEqual(4);
        });
    });

    describe('Grid Layout', () => {
        it('should have responsive grid layout', () => {
            render(<AboutSection user={mockUser} />);
            
            const gridContainer = document.querySelector('.grid');
            expect(gridContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
        });

        it('should have proper spacing between cards', () => {
            render(<AboutSection user={mockUser} />);
            
            const gridContainer = document.querySelector('.grid');
            expect(gridContainer).toHaveClass('gap-6');
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<AboutSection user={mockUser} />);
            
            const container = document.querySelector('.bg-primary.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have rounded corners and padding', () => {
            render(<AboutSection user={mockUser} />);
            
            const container = document.querySelector('.rounded-3xl.px-10.py-6');
            expect(container).toBeInTheDocument();
        });

        it('should have proper spacing between sections', () => {
            render(<AboutSection user={mockUser} />);
            
            const achievementHeader = screen.getByText('Achievement');
            expect(achievementHeader).toHaveClass('mt-8');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null user gracefully', () => {
            render(<AboutSection user={null as any} />);
            
            expect(screen.getByText('About')).toBeInTheDocument();
            expect(screen.getByText('Achievement')).toBeInTheDocument();
        });

        it('should handle undefined user gracefully', () => {
            render(<AboutSection user={undefined as any} />);
            
            expect(screen.getByText('About')).toBeInTheDocument();
            expect(screen.getByText('Achievement')).toBeInTheDocument();
        });

        it('should handle missing statistics gracefully', () => {
            const userWithoutStats = { bio: 'Test bio' };
            render(<AboutSection user={userWithoutStats as any} />);
            
            expect(screen.getByText('About')).toBeInTheDocument();
            expect(screen.getByText('Achievement')).toBeInTheDocument();
        });

        it('should handle partial statistics', () => {
            const userWithPartialStats = {
                bio: 'Test bio',
                statistics: {
                    total_materials: 5
                    // Missing other stats
                }
            };
            render(<AboutSection user={userWithPartialStats as any} />);
            
            expect(screen.getByText('5')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<AboutSection user={mockUser} />);
            
            const aboutHeader = screen.getByText('About');
            const achievementHeader = screen.getByText('Achievement');
            
            expect(aboutHeader.tagName).toBe('H1');
            expect(achievementHeader.tagName).toBe('H1');
        });

        it('should have clickable cards with cursor pointer', () => {
            render(<AboutSection user={mockUser} />);
            
            const cards = document.querySelectorAll('.cursor-pointer');
            expect(cards).toHaveLength(4); // All four achievement cards
        });

        it('should have proper contrast with shadow effects', () => {
            render(<AboutSection user={mockUser} />);
            
            const cards = document.querySelectorAll('.shadow-lg');
            expect(cards.length).toBeGreaterThanOrEqual(4);
        });
    });
});
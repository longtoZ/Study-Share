import { render, screen } from '@testing-library/react';
import SignupHeader from '@/pages/SignupPage/components/SignupHeader';

// Mock the background image
vi.mock('@/pages/SignupPage/images/signup_background.jpeg', () => ({
    __esModule: true,
    default: 'mocked-signup-background.jpeg'
}));

describe('SignupHeader Component', () => {
    describe('Initial Rendering', () => {
        it('should render main title', () => {
            render(<SignupHeader />);
            
            expect(screen.getByText('Join StudyShare')).toBeInTheDocument();
        });

        it('should render description text', () => {
            render(<SignupHeader />);
            
            const description = screen.getByText(/Connect with fellow students, share knowledge/);
            expect(description).toBeInTheDocument();
        });

        it('should render background image', () => {
            render(<SignupHeader />);
            
            const backgroundImage = screen.getByAltText('Background');
            expect(backgroundImage).toBeInTheDocument();
            expect(backgroundImage).toHaveAttribute('src', 'mocked-signup-background.jpeg');
        });
    });

    describe('Content Verification', () => {
        it('should display complete description text', () => {
            render(<SignupHeader />);
            
            const fullDescription = 'Connect with fellow students, share knowledge, and accelerate your learning journey. Access thousands of study materials, collaborate on projects, and build meaningful academic relationships that will last a lifetime.';
            expect(screen.getByText(fullDescription)).toBeInTheDocument();
        });

        it('should have proper heading hierarchy', () => {
            render(<SignupHeader />);
            
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent('Join StudyShare');
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling classes', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.flex.w-1\\/2.flex-col.justify-center.items-center');
            expect(container).toBeInTheDocument();
        });

        it('should have rounded corners and overflow hidden', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.rounded-3xl.overflow-hidden');
            expect(container).toBeInTheDocument();
        });

        it('should have proper height styling', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.h-\\[98\\%\\]');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Background Image Styling', () => {
        it('should have absolute positioning on background image', () => {
            render(<SignupHeader />);
            
            const backgroundImage = screen.getByAltText('Background');
            expect(backgroundImage).toHaveClass('absolute', 'top-0', 'left-0', 'w-full', 'h-full');
        });

        it('should have object cover and brightness filter', () => {
            render(<SignupHeader />);
            
            const backgroundImage = screen.getByAltText('Background');
            expect(backgroundImage).toHaveClass('object-cover', 'brightness-75');
        });

        it('should have proper referrer policy', () => {
            render(<SignupHeader />);
            
            const backgroundImage = screen.getByAltText('Background');
            expect(backgroundImage).toHaveAttribute('referrerPolicy', 'no-referrer');
        });
    });

    describe('Text Content Styling', () => {
        it('should have proper title styling', () => {
            render(<SignupHeader />);
            
            const title = screen.getByText('Join StudyShare');
            expect(title).toHaveClass('text-4xl', 'font-bold', 'mb-6');
        });

        it('should have proper description styling', () => {
            render(<SignupHeader />);
            
            const description = screen.getByText(/Connect with fellow students/);
            expect(description).toHaveClass('text-lg', 'leading-relaxed');
        });

        it('should have content container with proper styling', () => {
            render(<SignupHeader />);
            
            const contentContainer = document.querySelector('.max-w-lg.text-center.z-10');
            expect(contentContainer).toBeInTheDocument();
        });
    });

    describe('Layout and Positioning', () => {
        it('should have flex layout with proper alignment', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.flex.flex-col.justify-center.items-center');
            expect(container).toBeInTheDocument();
        });

        it('should have proper padding and margins', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.p-12.mx-2');
            expect(container).toBeInTheDocument();
        });

        it('should have proper z-index on content', () => {
            render(<SignupHeader />);
            
            const contentContainer = document.querySelector('.z-10');
            expect(contentContainer).toBeInTheDocument();
        });
    });

    describe('Text Color and Visibility', () => {
        it('should have white text color', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.text-white');
            expect(container).toBeInTheDocument();
        });

        it('should have relative positioning for layering', () => {
            render(<SignupHeader />);
            
            const container = document.querySelector('.relative');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper alt text for background image', () => {
            render(<SignupHeader />);
            
            const backgroundImage = screen.getByAltText('Background');
            expect(backgroundImage).toBeInTheDocument();
        });

        it('should have semantic heading structure', () => {
            render(<SignupHeader />);
            
            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toBeInTheDocument();
        });

        it('should have readable text content', () => {
            render(<SignupHeader />);
            
            const textContent = screen.getByText(/Connect with fellow students/);
            expect(textContent).toBeInTheDocument();
        });
    });

    describe('Component Rendering', () => {
        it('should render without crashing', () => {
            expect(() => render(<SignupHeader />)).not.toThrow();
        });

        it('should render all expected elements', () => {
            render(<SignupHeader />);
            
            expect(screen.getByText('Join StudyShare')).toBeInTheDocument();
            expect(screen.getByText(/Connect with fellow students/)).toBeInTheDocument();
            expect(screen.getByAltText('Background')).toBeInTheDocument();
        });

        it('should maintain proper component structure', () => {
            const { container } = render(<SignupHeader />);
            
            expect(container.firstChild).toHaveClass('flex', 'w-1/2', 'flex-col');
        });
    });
});
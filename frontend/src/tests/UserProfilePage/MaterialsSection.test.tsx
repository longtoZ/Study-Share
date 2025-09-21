import { render, screen, fireEvent } from '@testing-library/react';
import MaterialsSection from '@/pages/UserProfilePage/components/MaterialsSection';

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="loading-spinner" {...props}>Loading...</div>
}));

vi.mock('@mui/icons-material/ArrowForwardIosOutlined', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="arrow-icon" {...props}>ArrowIcon</div>
}));

// Mock MaterialsGrid component
vi.mock('@/components/layout/MaterialsGrid', () => ({
    __esModule: true,
    default: ({ materials }: any) => (
        <div data-testid="materials-grid">
            {materials.map((material: any, index: number) => (
                <div key={index} data-testid="material-item">
                    {material.name} - {material.subject}
                </div>
            ))}
        </div>
    )
}));

const mockMaterials = [
    {
        material_id: '1',
        name: 'Advanced Calculus Notes',
        subject: 'Mathematics',
        description: 'Comprehensive calculus study guide',
        downloads: 150
    },
    {
        material_id: '2',
        name: 'Data Structures Tutorial',
        subject: 'Computer Science',
        description: 'Complete guide to data structures',
        downloads: 200
    },
    {
        material_id: '3',
        name: 'Physics Lab Manual',
        subject: 'Physics',
        description: 'Laboratory experiments guide',
        downloads: 75
    }
];

const mockNavigate = vi.fn();

const defaultProps = {
    userId: 'user123',
    materials: mockMaterials,
    isMaterialsLoading: false,
    navigate: mockNavigate
};

describe('MaterialsSection Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Section Header', () => {
        it('should render section title', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            expect(screen.getByText('My Materials')).toBeInTheDocument();
        });

        it('should render section description', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            expect(screen.getByText('Here are some of the materials I have created:')).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('should display loading spinner when materials are loading', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    isMaterialsLoading={true}
                />
            );
            
            expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
            expect(screen.getByText('Fetching materials...')).toBeInTheDocument();
        });

        it('should not display materials grid when loading', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    isMaterialsLoading={true}
                />
            );
            
            expect(screen.queryByTestId('materials-grid')).not.toBeInTheDocument();
        });

        it('should have proper loading message styling', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    isMaterialsLoading={true}
                />
            );
            
            const loadingContainer = screen.getByText('Fetching materials...').closest('div');
            expect(loadingContainer).toHaveClass('flex', 'justify-center', 'items-center', 'text-gray-600');
        });
    });

    describe('Empty State', () => {
        it('should display no materials message when materials array is empty', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    materials={[]}
                />
            );
            
            expect(screen.getByText('No materials found.')).toBeInTheDocument();
        });

        it('should not display materials grid when no materials', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    materials={[]}
                />
            );
            
            expect(screen.queryByTestId('materials-grid')).not.toBeInTheDocument();
        });
    });

    describe('Materials Display', () => {
        it('should render MaterialsGrid when materials are available', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            expect(screen.getByTestId('materials-grid')).toBeInTheDocument();
        });

        it('should pass materials to MaterialsGrid component', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            expect(screen.getByText('Advanced Calculus Notes - Mathematics')).toBeInTheDocument();
            expect(screen.getByText('Data Structures Tutorial - Computer Science')).toBeInTheDocument();
            expect(screen.getByText('Physics Lab Manual - Physics')).toBeInTheDocument();
        });

        it('should display correct number of materials', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const materialItems = screen.getAllByTestId('material-item');
            expect(materialItems).toHaveLength(3);
        });
    });

    describe('Show More Button', () => {
        it('should render Show More button', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toBeInTheDocument();
        });

        it('should have proper button styling', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toHaveClass('button-outline', 'w-full');
        });

        it('should display arrow icon in button', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
        });

        it('should call navigate function when clicked', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/user123/materials');
        });

        it('should construct correct navigation path', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    userId="differentUser456"
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/differentUser456/materials');
        });
    });

    describe('Component Structure', () => {
        it('should have proper container styling', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const container = document.querySelector('.bg-primary.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should have rounded corners and proper spacing', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const container = document.querySelector('.rounded-3xl.px-10.py-6');
            expect(container).toBeInTheDocument();
        });

        it('should have proper margin top', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const container = document.querySelector('.mt-10');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined materials gracefully', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    materials={undefined as any}
                />
            );
            
            // Should show loading or empty state, not crash
            expect(screen.getByText('My Materials')).toBeInTheDocument();
        });

        it('should handle null userId', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    userId={null as any}
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user/null/materials');
        });

        it('should handle empty userId string', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    userId=""
                />
            );
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            fireEvent.click(showMoreButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/user//materials');
        });
    });

    describe('Loading and Data States Combination', () => {
        it('should not show button during loading', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    isMaterialsLoading={true}
                />
            );
            
            // Show More button should still be present as it's outside the conditional
            expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
        });

        it('should show button with empty materials', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    materials={[]}
                />
            );
            
            expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
        });

        it('should prioritize loading state over empty state', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    materials={[]}
                    isMaterialsLoading={true}
                />
            );
            
            expect(screen.getByText('Fetching materials...')).toBeInTheDocument();
            expect(screen.queryByText('No materials found.')).not.toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const sectionTitle = screen.getByText('My Materials');
            expect(sectionTitle.tagName).toBe('H1');
        });

        it('should have focusable Show More button', () => {
            render(<MaterialsSection {...defaultProps} />);
            
            const showMoreButton = screen.getByRole('button', { name: /show more/i });
            expect(showMoreButton).toBeInTheDocument();
            expect(showMoreButton.tagName).toBe('BUTTON');
        });

        it('should provide loading feedback for screen readers', () => {
            render(
                <MaterialsSection 
                    {...defaultProps} 
                    isMaterialsLoading={true}
                />
            );
            
            expect(screen.getByText('Fetching materials...')).toBeInTheDocument();
        });
    });
});
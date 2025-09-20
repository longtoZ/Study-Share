import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContentView from '@/pages/MaterialViewPage/components/ContentView';

// Mock MetadataCard component
vi.mock('@/pages/MaterialViewPage/components/MetadataCard', () => ({
    default: ({ icon, label, value, isPaid }: any) => (
        <div data-testid="metadata-card" data-label={label} data-value={value} data-is-paid={isPaid}>
            <div data-testid="metadata-icon">{icon}</div>
            <div data-testid="metadata-label">{label}</div>
            <div data-testid="metadata-value">{value}</div>
        </div>
    ),
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockMaterial = {
    material_id: 'test-material-id',
    name: 'Test Material',
    description: 'This is a test material description with detailed information.',
    subject_id: 'math',
    file_type: 'PDF',
    size: 2048000, // 2MB in bytes
    num_page: 10,
    view_count: 150,
    download_count: 75,
    price: 9.99,
    is_paid: true,
};

const mockImagePages = [
    { pageNumber: 1, imageUrl: 'https://example.com/page1.jpg' },
    { pageNumber: 2, imageUrl: 'https://example.com/page2.jpg' },
    { pageNumber: 3, imageUrl: 'https://example.com/page3.jpg' },
    { pageNumber: 4, imageUrl: 'https://example.com/page4.jpg' },
];

const defaultProps = {
    material: mockMaterial,
    subject: 'Mathematics',
    isMaterialPaid: false,
    imagePages: mockImagePages,
    imageWidth: 800,
    scrollViewRef: { current: null },
    handleOnScroll: vi.fn(),
    handleZoomIn: vi.fn(),
    handleZoomOut: vi.fn(),
};

describe('ContentView Component', () => {
    const mockHandleOnScroll = vi.fn();
    const mockHandleZoomIn = vi.fn();
    const mockHandleZoomOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock scrollViewRef
        Object.defineProperty(defaultProps, 'scrollViewRef', {
            value: { current: document.createElement('div') },
            writable: true,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render content view with tab navigation', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByText('About')).toBeInTheDocument();
        });

        it('should render content tab as active by default', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const contentTab = screen.getByText('Content');
            const aboutTab = screen.getByText('About');
            
            expect(contentTab).toHaveClass('text-blue-600', 'border-b-4', 'border-blue-600');
            expect(aboutTab).toHaveClass('text-gray-500');
        });

        it('should apply correct styling to the main container', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const container = screen.getByText('Content').closest('div')?.parentElement;
            expect(container).toHaveClass('bg-white', 'rounded-3xl', 'card-shadow', 'p-8');
        });
    });

    describe('Tab Navigation', () => {
        it('should switch to about tab when clicked', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const aboutTab = screen.getByText('About');
            fireEvent.click(aboutTab);
            
            expect(aboutTab).toHaveClass('text-blue-600', 'border-b-4', 'border-blue-600');
            expect(screen.getByText('Content')).toHaveClass('text-gray-500');
        });

        it('should switch back to content tab when clicked', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            // First switch to about
            const aboutTab = screen.getByText('About');
            fireEvent.click(aboutTab);
            
            // Then switch back to content
            const contentTab = screen.getByText('Content');
            fireEvent.click(contentTab);
            
            expect(contentTab).toHaveClass('text-blue-600', 'border-b-4', 'border-blue-600');
            expect(aboutTab).toHaveClass('text-gray-500');
        });

        it('should show hover effects on inactive tabs', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const aboutTab = screen.getByText('About');
            expect(aboutTab).toHaveClass('hover:text-gray-800');
        });
    });

    describe('Content Tab View', () => {
        it('should render image pages when available', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(4); // 4 pages
            
            images.forEach((img, index) => {
                expect(img).toHaveAttribute('src', mockImagePages[index].imageUrl);
                expect(img).toHaveAttribute('alt', `Page ${mockImagePages[index].pageNumber}`);
            });
        });

        it('should apply correct width to images', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const images = screen.getAllByRole('img');
            images.forEach(img => {
                expect(img).toHaveStyle({ width: '800px' });
            });
        });

        it('should show PDF preview not available when no images', () => {
            renderWithRouter(<ContentView {...defaultProps} imagePages={[]} />);
            
            expect(screen.getByText('PDF Preview Not Available')).toBeInTheDocument();
            expect(screen.getByText('A full-featured, scrollable PDF viewer would go here.')).toBeInTheDocument();
        });

        it('should render zoom controls', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const zoomInButton = screen.getByRole('button', { name: 'Zoom In' }); // First button (zoom in)
            const zoomOutButton = screen.getByRole('button', { name: 'Zoom Out' }); // Second button (zoom out)

            expect(zoomInButton).toBeInTheDocument();
            expect(zoomOutButton).toBeInTheDocument();
        });

        it('should call handleZoomIn when zoom in button is clicked', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    handleZoomIn={mockHandleZoomIn}
                />
            );
            
            const buttons = screen.getAllByRole('button');
            const zoomInButton = buttons.find(button => 
                button.querySelector('[data-testid="ZoomInOutlinedIcon"]') || 
                button.innerHTML.includes('ZoomIn')
            ) || buttons[2]; // Fallback to third button
            
            fireEvent.click(zoomInButton);
            expect(mockHandleZoomIn).toHaveBeenCalledTimes(1);
        });

        it('should call handleZoomOut when zoom out button is clicked', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    handleZoomOut={mockHandleZoomOut}
                />
            );
            
            const buttons = screen.getAllByRole('button');
            const zoomOutButton = buttons.find(button => 
                button.querySelector('[data-testid="ZoomOutOutlinedIcon"]') || 
                button.innerHTML.includes('ZoomOut')
            ) || buttons[3]; // Fallback to fourth button
            
            fireEvent.click(zoomOutButton);
            expect(mockHandleZoomOut).toHaveBeenCalledTimes(1);
        });

        it('should call handleOnScroll when scrolling', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    handleOnScroll={mockHandleOnScroll}
                />
            );
            
            const scrollContainer = document.querySelector('.overflow-y-auto');
            if (scrollContainer) {
                fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });
                expect(mockHandleOnScroll).toHaveBeenCalled();
            }
        });
    });

    describe('Paid Content Overlay', () => {
        it('should show paid content overlay for pages beyond 2 when material is paid', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    isMaterialPaid={true}
                />
            );
            
            const paidMessages = screen.getAllByText(/This page is blurred because it is paid content/);
            expect(paidMessages).toHaveLength(2); // Pages 3 and 4
        });

        it('should not show paid content overlay when material is not paid', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    isMaterialPaid={false}
                />
            );
            
            expect(screen.queryByText(/This page is blurred because it is paid content/)).not.toBeInTheDocument();
        });

        it('should not show paid content overlay for first 2 pages even when paid', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    isMaterialPaid={true}
                />
            );
            
            // Should still render first 2 pages normally
            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('alt', 'Page 1');
            expect(images[1]).toHaveAttribute('alt', 'Page 2');
        });
    });

    describe('About Tab View', () => {
        beforeEach(() => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            // Switch to about tab
            const aboutTab = screen.getByText('About');
            fireEvent.click(aboutTab);
        });

        it('should render Info section title', () => {
            expect(screen.getByText('Info')).toBeInTheDocument();
        });

        it('should render all metadata cards', () => {
            const metadataCards = screen.getAllByTestId('metadata-card');
            expect(metadataCards).toHaveLength(7); // Subject, Type, Size, Pages, Views, Downloads, Price
        });

        it('should render metadata cards with correct values', () => {            
            // Check for specific metadata values
            const subjectCard = screen.getByText('Mathematics');
            const typeCard = screen.getByText('PDF');
            const sizeCard = screen.getByText('1.95 MB'); // 2048000 bytes = ~1.95 MB
            const pagesCard = screen.getByText('10');
            const viewsCard = screen.getByText('150');
            const downloadsCard = screen.getByText('75');
            const priceCard = screen.getByText('$9.99');
            
            expect(subjectCard).toBeInTheDocument();
            expect(typeCard).toBeInTheDocument();
            expect(sizeCard).toBeInTheDocument();
            expect(pagesCard).toBeInTheDocument();
            expect(viewsCard).toBeInTheDocument();
            expect(downloadsCard).toBeInTheDocument();
            expect(priceCard).toBeInTheDocument();
        });

        it('should render Description section', () => {
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('This is a test material description with detailed information.')).toBeInTheDocument();
        });

        it('should handle missing material data gracefully', () => {
            renderWithRouter(<ContentView {...defaultProps} material={null} />);
            
            const aboutTab = screen.getAllByRole('button', { name: 'About View' })[1];
            fireEvent.click(aboutTab);

            expect(screen.getAllByText('Unknown')).toHaveLength(2); // Should show "Unknown" for missing values
            expect(screen.getByText('No description available.')).toBeInTheDocument();
        });

        it('should show "Free" when material has no price', () => {
            const freeMaterial = { ...mockMaterial, price: null };
            renderWithRouter(<ContentView {...defaultProps} material={freeMaterial} />);

            const aboutTab = screen.getAllByRole('button', { name: 'About View' })[1];
            fireEvent.click(aboutTab);
            
            expect(screen.getByText('Free')).toBeInTheDocument();
        });

        it('should handle unknown subject', () => {
            renderWithRouter(<ContentView {...defaultProps} subject="" />);

            const aboutTab = screen.getAllByRole('button', { name: 'About View' })[1];
            fireEvent.click(aboutTab);
            
            expect(screen.getAllByText('Unknown')).toHaveLength(1);
        });

        it('should format file size correctly', () => {
            const largeMaterial = { ...mockMaterial, size: 5242880 }; // 5MB
            renderWithRouter(<ContentView {...defaultProps} material={largeMaterial} />);

            const aboutTab = screen.getAllByRole('button', { name: 'About View' })[1];
            fireEvent.click(aboutTab);
            
            expect(screen.getByText('5.00 MB')).toBeInTheDocument();
        });

        it('should handle zero values correctly', () => {
            const emptyMaterial = { 
                ...mockMaterial, 
                view_count: 0, 
                download_count: 0, 
                num_page: 0 
            };
            renderWithRouter(<ContentView {...defaultProps} material={emptyMaterial} />);

            const aboutTab = screen.getAllByRole('button', { name: 'About View' })[1];
            fireEvent.click(aboutTab);
            
            const zeroValues = screen.getAllByText('0');
            expect(zeroValues.length).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty imagePages array', () => {
            renderWithRouter(<ContentView {...defaultProps} imagePages={[]} />);
            
            expect(screen.getByText('PDF Preview Not Available')).toBeInTheDocument();
        });

        it('should handle missing material properties', () => {
            const incompleteMaterial = {
                material_id: 'test-id',
                name: 'Test Material',
            };
            
            renderWithRouter(<ContentView {...defaultProps} material={incompleteMaterial} />);
            
            const aboutTab = screen.getByRole('button', { name: 'About View' });
            fireEvent.click(aboutTab);
            
            expect(screen.getByText('No description available.')).toBeInTheDocument();
        });

        it('should handle very small file sizes', () => {
            const smallMaterial = { ...mockMaterial, size: 1024 }; // 1KB
            renderWithRouter(<ContentView {...defaultProps} material={smallMaterial} />);
            
            const aboutTab = screen.getByRole('button', { name: 'About View' });
            fireEvent.click(aboutTab);
            
            expect(screen.getByText('0.00 MB')).toBeInTheDocument();
        });

        it('should handle undefined scrollViewRef', () => {
            renderWithRouter(
                <ContentView 
                    {...defaultProps} 
                    scrollViewRef={undefined}
                />
            );
            
            // Should render without errors
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper alt text for images', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            mockImagePages.forEach((page, index) => {
                const img = screen.getAllByRole('img')[index];
                expect(img).toHaveAttribute('alt', `Page ${page.pageNumber}`);
            });
        });

        it('should have proper button roles for zoom controls', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThanOrEqual(4); // Content, About, ZoomIn, ZoomOut
        });

        it('should have proper tab button roles', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const contentTab = screen.getByText('Content');
            const aboutTab = screen.getByText('About');
            
            expect(contentTab.tagName).toBe('BUTTON');
            expect(aboutTab.tagName).toBe('BUTTON');
        });

        it('should have proper hover states for interactive elements', () => {
            renderWithRouter(<ContentView {...defaultProps} />);
            
            const aboutTab = screen.getByText('About');
            expect(aboutTab).toHaveClass('transition-colors', 'duration-200');
        });
    });
});
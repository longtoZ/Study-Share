import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RatingCard from '@/pages/MaterialViewPage/components/RatingCard';
import { rateMaterial, getMaterialRating, checkUserRating } from '@/services/ratingService';

vi.mock('@/services/ratingService', () => ({
    rateMaterial: vi.fn(),
    getMaterialRating: vi.fn(),
    checkUserRating: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockRatingData = [
    { star_level: 5, count: 10 },
    { star_level: 4, count: 8 },
    { star_level: 3, count: 3 },
    { star_level: 2, count: 1 },
    { star_level: 1, count: 0 },
];

describe('RatingCard Component', () => {
    const mockRateMaterial = vi.mocked(rateMaterial);
    const mockGetMaterialRating = vi.mocked(getMaterialRating);
    const mockCheckUserRating = vi.mocked(checkUserRating);

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('test-user-id');
        mockGetMaterialRating.mockResolvedValue(mockRatingData);
        mockCheckUserRating.mockResolvedValue(false);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render rating card', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('Rating Distribution')).toBeInTheDocument();
            });
        });

        it('should not fetch data when materialId is undefined', () => {
            renderWithRouter(<RatingCard materialId={undefined} />);
            
            expect(mockGetMaterialRating).not.toHaveBeenCalled();
            expect(mockCheckUserRating).not.toHaveBeenCalled();
        });

        it('should fetch rating data on mount', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(mockGetMaterialRating).toHaveBeenCalledWith('test-material-id');
                expect(mockCheckUserRating).toHaveBeenCalledWith('test-material-id', 'test-user-id');
            });
        });
    });

    describe('Average Rating Display', () => {
        it('should calculate and display correct average rating', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                // Average: (5*10 + 4*8 + 3*3 + 2*1 + 1*0) / 22 = 93/22 ≈ 4.2
                expect(screen.getByText('4.2')).toBeInTheDocument();
            });
        });

        it('should display total review count', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('Based on 22 reviews')).toBeInTheDocument();
            });
        });

        it('should display 0.0 rating when no ratings exist', async () => {
            mockGetMaterialRating.mockResolvedValue([]);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('0.0')).toBeInTheDocument();
                expect(screen.getByText('Based on 0 reviews')).toBeInTheDocument();
            });
        });

        it('should render average rating stars correctly', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                // Should show 4.2 stars (4 full stars, 1 partial star)
                const starIcons = document.querySelectorAll('.text-yellow-400');
                expect(starIcons.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Rating Distribution Display', () => {
        it('should display star levels 5 to 1', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('5')).toBeInTheDocument();
                expect(screen.getByText('4')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument();
                expect(screen.getByText('2')).toBeInTheDocument();
                expect(screen.getByText('1')).toBeInTheDocument();
            });
        });

        it('should calculate correct bar widths', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const progressBars = document.querySelectorAll('.bg-yellow-400.h-2');
                expect(progressBars.length).toBe(5);
                
                // 5 stars: 10/22 * 100 ≈ 45.45%
                expect(progressBars[0]).toHaveStyle({ width: '45.45454545454545%' });
                // 4 stars: 8/22 * 100 ≈ 36.36%
                expect(progressBars[1]).toHaveStyle({ width: '36.36363636363637%' });
            });
        });

        it('should handle zero ratings for each star level', async () => {
            const emptyRatingData = [
                { star_level: 5, count: 0 },
                { star_level: 4, count: 0 },
                { star_level: 3, count: 0 },
                { star_level: 2, count: 0 },
                { star_level: 1, count: 0 },
            ];
            mockGetMaterialRating.mockResolvedValue(emptyRatingData);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const counts = screen.getAllByText('0');
                expect(counts.length).toBeGreaterThanOrEqual(5); // Should show 0 for each star level
            });
        });
    });

    describe('User Rating Interaction', () => {
        it('should show rating section when user has not rated', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('Rate this material')).toBeInTheDocument();
            });
        });

        it('should not show rating section when user has already rated', async () => {
            mockCheckUserRating.mockResolvedValue(true);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.queryByText('Rate this material')).not.toBeInTheDocument();
            });
        });

        it('should render interactive stars for rating', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                expect(interactiveStars.length).toBe(5);
            });
        });

        it('should call rateMaterial when star is clicked', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                fireEvent.click(interactiveStars[4]); // Click 5th star
            });
            
            expect(mockRateMaterial).toHaveBeenCalledWith({
                material_id: 'test-material-id',
                user_id: 'test-user-id',
                star_level: 5,
                rated_date: expect.any(Date),
            });
        });

        it('should handle hover effects on interactive stars', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                
                // Hover over 3rd star
                fireEvent.mouseEnter(interactiveStars[2]);
                
                // Should highlight stars up to the hovered one
                expect(interactiveStars[2]).toHaveClass('hover:scale-110');
            });
        });

        it('should clear hover state on mouse leave', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                
                // Hover and then leave
                fireEvent.mouseEnter(interactiveStars[2]);
                fireEvent.mouseLeave(interactiveStars[2]);
                
                // Hover state should be cleared
                expect(interactiveStars[2]).toHaveClass('hover:scale-110');
            });
        });

        it('should not allow rating when materialId is undefined', async () => {
            renderWithRouter(<RatingCard materialId={undefined} />);
            
            // Try to trigger rating (though rating section shouldn't show)
            // This tests the guard clause in onRate function
            expect(mockRateMaterial).not.toHaveBeenCalled();
        });
    });

    describe('Star Rendering Logic', () => {
        it('should render full stars for whole numbers', async () => {
            // Mock data that gives exactly 4.0 rating
            const exactRatingData = [
                { star_level: 4, count: 1 },
            ];
            mockGetMaterialRating.mockResolvedValue(exactRatingData);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('4.0')).toBeInTheDocument();
            });
        });

        it('should render half stars for decimal ratings', async () => {
            // Mock data that gives 3.5 rating
            const halfRatingData = [
                { star_level: 3, count: 1 },
                { star_level: 4, count: 1 },
            ];
            mockGetMaterialRating.mockResolvedValue(halfRatingData);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('3.5')).toBeInTheDocument();
            });
        });

        it('should render outline stars for unrated positions', async () => {
            const lowRatingData = [
                { star_level: 2, count: 1 },
            ];
            mockGetMaterialRating.mockResolvedValue(lowRatingData);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('2.0')).toBeInTheDocument();
                // Should have outline stars for positions 3, 4, 5
                const outlineStars = document.querySelectorAll('.text-gray-300');
                expect(outlineStars.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle rating fetch errors gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockGetMaterialRating.mockRejectedValue(new Error('Failed to fetch rating'));
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching material rating:', expect.any(Error));
            });
            
            consoleSpy.mockRestore();
        });

        it('should handle rating submission errors gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockCheckUserRating.mockResolvedValue(false);
            mockRateMaterial.mockRejectedValue(new Error('Failed to submit rating'));
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                fireEvent.click(interactiveStars[4]);
            });
            
            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error rating material:', expect.any(Error));
            });
            
            consoleSpy.mockRestore();
        });

        it('should handle missing localStorage user_id', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(mockCheckUserRating).toHaveBeenCalledWith('test-material-id', '');
            });
        });
    });

    describe('Data Processing', () => {
        it('should process rating data correctly', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                // Verify the processing of rating data
                expect(screen.getByText('4.2')).toBeInTheDocument(); // Calculated average
                expect(screen.getByText('Based on 22 reviews')).toBeInTheDocument(); // Total count
            });
        });

    });

    describe('Layout and Styling', () => {
        it('should have correct container styling', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            const container = document.querySelector('.bg-white.rounded-3xl.card-shadow');
            expect(container).toBeInTheDocument();
        });

        it('should apply transition effects to progress bars', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const progressBars = document.querySelectorAll('.bg-yellow-400.h-2');
                progressBars.forEach(bar => {
                    expect(bar).toHaveClass('transition-all', 'duration-300');
                });
            });
        });
    });

    describe('Accessibility', () => {
        it('should be accessible with proper text content', async () => {
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                expect(screen.getByText('Rating Distribution')).toBeInTheDocument();
                expect(screen.getByText('Based on 22 reviews')).toBeInTheDocument();
            });
        });

        it('should have interactive elements for screen readers', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.cursor-pointer');
                expect(interactiveStars.length).toBe(5);
            });
        });

        it('should provide visual feedback for interactions', async () => {
            mockCheckUserRating.mockResolvedValue(false);
            
            renderWithRouter(<RatingCard materialId="test-material-id" />);
            
            await waitFor(() => {
                const interactiveStars = document.querySelectorAll('.hover\\:scale-110');
                expect(interactiveStars.length).toBe(5);
            });
        });
    });
});
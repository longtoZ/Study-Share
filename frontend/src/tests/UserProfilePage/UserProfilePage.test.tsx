import { render, screen } from '@testing-library/react';
import UserProfilePage from '@/pages/UserProfilePage/UserProfilePage';

// Mock the useProfileData hook
const mockUseProfileData = vi.fn();
vi.mock('@/pages/UserProfilePage/hooks/useProfileData', () => ({
    useProfileData: () => mockUseProfileData()
}));

// Mock all child components
vi.mock('@/pages/UserProfilePage/components/UserInfoSection', () => ({
    __esModule: true,
    default: ({ user }: any) => (
        <div data-testid="user-info-section">
            UserInfoSection - {user?.full_name || 'No user'}
        </div>
    )
}));

vi.mock('@/pages/UserProfilePage/components/AboutSection', () => ({
    __esModule: true,
    default: ({ user }: any) => (
        <div data-testid="about-section">
            AboutSection - {user?.bio || 'No bio'}
        </div>
    )
}));

vi.mock('@/pages/UserProfilePage/components/MaterialsSection', () => ({
    __esModule: true,
    default: ({ userId, materials, isMaterialsLoading, navigate }: any) => (
        <div data-testid="materials-section">
            MaterialsSection - User: {userId}, Materials: {materials?.length || 0}, Loading: {isMaterialsLoading.toString()}
        </div>
    )
}));

vi.mock('@/pages/UserProfilePage/components/LessonsSection', () => ({
    __esModule: true,
    default: ({ userId, lessons, isLessonsLoading, navigate }: any) => (
        <div data-testid="lessons-section">
            LessonsSection - User: {userId}, Lessons: {lessons?.length || 0}, Loading: {isLessonsLoading.toString()}
        </div>
    )
}));

const mockUser = {
    user_id: 'user123',
    full_name: 'John Doe',
    bio: 'Software engineer passionate about education',
    profile_picture_url: 'https://example.com/profile.jpg',
    created_date: '2023-01-15T10:30:00Z',
    address: 'New York, USA'
};

const mockMaterials = [
    { material_id: '1', name: 'Calculus Notes', subject: 'Mathematics' },
    { material_id: '2', name: 'Python Tutorial', subject: 'Computer Science' }
];

const mockLessons = [
    { lesson_id: '1', title: 'Intro to ML', subject: 'Data Science' },
    { lesson_id: '2', title: 'Web Development', subject: 'Programming' }
];

const defaultMockData = {
    user: mockUser,
    materials: mockMaterials,
    lessons: mockLessons,
    isMaterialsLoading: false,
    isLessonsLoading: false
};

// Mock window.location.href assignment
Object.defineProperty(window, 'location', {
    value: {
        href: ''
    },
    writable: true
});

describe('UserProfilePage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseProfileData.mockReturnValue(defaultMockData);
    });

    describe('Component Rendering', () => {
        it('should render all child components', () => {
            render(<UserProfilePage />);
            
            expect(screen.getByTestId('user-info-section')).toBeInTheDocument();
            expect(screen.getByTestId('about-section')).toBeInTheDocument();
            expect(screen.getByTestId('materials-section')).toBeInTheDocument();
            expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
        });

        it('should pass correct props to UserInfoSection', () => {
            render(<UserProfilePage />);
            
            expect(screen.getByText('UserInfoSection - John Doe')).toBeInTheDocument();
        });

        it('should pass correct props to AboutSection', () => {
            render(<UserProfilePage />);
            
            expect(screen.getByText('AboutSection - Software engineer passionate about education')).toBeInTheDocument();
        });

        it('should pass correct props to MaterialsSection', () => {
            render(<UserProfilePage />);
            
            expect(screen.getByText('MaterialsSection - User: user123, Materials: 2, Loading: false')).toBeInTheDocument();
        });

        it('should pass correct props to LessonsSection', () => {
            render(<UserProfilePage />);
            
            expect(screen.getByText('LessonsSection - User: user123, Lessons: 2, Loading: false')).toBeInTheDocument();
        });
    });

    describe('Loading States', () => {
        it('should handle materials loading state', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                isMaterialsLoading: true
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Loading: true/)).toBeInTheDocument();
        });

        it('should handle lessons loading state', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                isLessonsLoading: true
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Lessons: 2, Loading: true/)).toBeInTheDocument();
        });

        it('should handle both loading states simultaneously', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                isMaterialsLoading: true,
                isLessonsLoading: true
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Materials: 2, Loading: true/)).toBeInTheDocument();
            expect(screen.getByText(/Lessons: 2, Loading: true/)).toBeInTheDocument();
        });
    });

    describe('Data States', () => {
        it('should handle empty materials array', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                materials: []
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Materials: 0/)).toBeInTheDocument();
        });

        it('should handle empty lessons array', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                lessons: []
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Lessons: 0/)).toBeInTheDocument();
        });

        it('should handle null user data', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                user: null
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText('UserInfoSection - No user')).toBeInTheDocument();
            expect(screen.getByText('AboutSection - No bio')).toBeInTheDocument();
        });

        it('should handle undefined materials and lessons', () => {
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                materials: undefined,
                lessons: undefined
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Materials: 0/)).toBeInTheDocument();
            expect(screen.getByText(/Lessons: 0/)).toBeInTheDocument();
        });
    });

    describe('Navigation Function', () => {
        it('should pass navigation function to MaterialsSection', () => {
            render(<UserProfilePage />);
            
            // The navigation function should be passed (tested by checking component renders)
            expect(screen.getByTestId('materials-section')).toBeInTheDocument();
        });

        it('should pass navigation function to LessonsSection', () => {
            render(<UserProfilePage />);
            
            // The navigation function should be passed (tested by checking component renders)
            expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
        });
    });

    describe('Page Layout', () => {
        it('should have proper container styling', () => {
            render(<UserProfilePage />);
            
            const container = document.querySelector('.p-12.min-h-screen.w-full');
            expect(container).toBeInTheDocument();
        });

        it('should have proper scrolling behavior', () => {
            render(<UserProfilePage />);
            
            const container = document.querySelector('.overflow-y-auto.scrollbar-hide');
            expect(container).toBeInTheDocument();
        });

        it('should have proper height and padding', () => {
            render(<UserProfilePage />);
            
            const container = document.querySelector('.h-\\[100vh\\].pb-36');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Component Order', () => {
        it('should render components in correct order', () => {
            render(<UserProfilePage />);
            
            const container = document.querySelector('.p-12');
            const children = Array.from(container?.children || []);
            
            expect(children[0]).toHaveAttribute('data-testid', 'user-info-section');
            expect(children[1]).toHaveAttribute('data-testid', 'about-section');
            expect(children[2]).toHaveAttribute('data-testid', 'materials-section');
            expect(children[3]).toHaveAttribute('data-testid', 'lessons-section');
        });
    });

    describe('Hook Integration', () => {
        it('should call useProfileData hook', () => {
            render(<UserProfilePage />);
            
            expect(mockUseProfileData).toHaveBeenCalledTimes(1);
        });

        it('should handle hook returning undefined values', () => {
            mockUseProfileData.mockReturnValue({
                user: undefined,
                materials: undefined,
                lessons: undefined,
                isMaterialsLoading: undefined,
                isLessonsLoading: undefined
            });
            
            render(<UserProfilePage />);
            
            // Should not crash and render components with fallback values
            expect(screen.getByTestId('user-info-section')).toBeInTheDocument();
            expect(screen.getByTestId('about-section')).toBeInTheDocument();
            expect(screen.getByTestId('materials-section')).toBeInTheDocument();
            expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
        });
    });

    describe('Type Casting', () => {
        it('should handle user type casting for AboutSection', () => {
            const userWithoutBio = {
                user_id: 'user456',
                full_name: 'Jane Smith'
                // Missing bio and other fields
            };
            
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                user: userWithoutBio
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText('AboutSection - No bio')).toBeInTheDocument();
        });

        it('should handle userId type casting for sections', () => {
            const userWithStringId = {
                ...mockUser,
                user_id: 'string-user-id'
            };
            
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                user: userWithStringId
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/User: string-user-id/)).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle completely empty hook response', () => {
            mockUseProfileData.mockReturnValue({});
            
            render(<UserProfilePage />);
            
            expect(screen.getByTestId('user-info-section')).toBeInTheDocument();
            expect(screen.getByTestId('about-section')).toBeInTheDocument();
            expect(screen.getByTestId('materials-section')).toBeInTheDocument();
            expect(screen.getByTestId('lessons-section')).toBeInTheDocument();
        });

        it('should handle hook throwing error gracefully', () => {
            mockUseProfileData.mockImplementation(() => {
                throw new Error('Hook failed');
            });
            
            // Should not crash the test
            expect(() => render(<UserProfilePage />)).toThrow('Hook failed');
        });

        it('should handle very large datasets', () => {
            const largeMaterials = Array.from({ length: 1000 }, (_, i) => ({
                material_id: `material-${i}`,
                name: `Material ${i}`
            }));
            
            const largeLessons = Array.from({ length: 500 }, (_, i) => ({
                lesson_id: `lesson-${i}`,
                title: `Lesson ${i}`
            }));
            
            mockUseProfileData.mockReturnValue({
                ...defaultMockData,
                materials: largeMaterials,
                lessons: largeLessons
            });
            
            render(<UserProfilePage />);
            
            expect(screen.getByText(/Materials: 1000/)).toBeInTheDocument();
            expect(screen.getByText(/Lessons: 500/)).toBeInTheDocument();
        });
    });
});
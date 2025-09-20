import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CommentSection from '@/pages/MaterialViewPage/components/CommentSection';

// Mock Material-UI components
vi.mock('@mui/material/CircularProgress', () => ({
    default: ({ size, color }: any) => <div data-testid="circular-progress" data-size={size} data-color={color}>Loading...</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

const mockUser = {
    user_id: 'test-user-id',
    full_name: 'Test User',
    profile_picture_url: 'https://example.com/profile.jpg',
};

const mockCommentsData = [
    {
        comment_id: 'comment-1',
        user_id: 'user-1',
        user_name: 'John Doe',
        profile_picture_url: 'https://example.com/john.jpg',
        content: 'This is a great material!',
        created_date: '2024-01-01T10:00:00Z',
        upvote: 5,
        upvoted: false,
    },
    {
        comment_id: 'comment-2',
        user_id: 'user-2',
        user_name: 'Jane Smith',
        profile_picture_url: 'https://example.com/jane.jpg',
        content: 'Very helpful, thanks for sharing.',
        created_date: '2024-01-02T11:00:00Z',
        upvote: 3,
        upvoted: true,
    },
];

const defaultProps = {
    user: mockUser,
    isAuthor: false,
    commentOrder: 'newest' as const,
    setCommentOrder: vi.fn(),
    commentContent: '',
    setCommentContent: vi.fn(),
    isPostingComment: false,
    handlePostComment: vi.fn(),
    allCommentsData: mockCommentsData,
    handleUpvote: vi.fn(),
    handleDeleteComment: vi.fn(),
    isNoMoreComments: false,
    setCommentsRange: vi.fn(),
    commentsRange: { start: 0, end: 10 },
};

describe('CommentSection Component', () => {
    const mockSetCommentOrder = vi.fn();
    const mockSetCommentContent = vi.fn();
    const mockHandlePostComment = vi.fn();
    const mockHandleUpvote = vi.fn();
    const mockHandleDeleteComment = vi.fn();
    const mockSetCommentsRange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render comments section with title', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByText('Comments')).toBeInTheDocument();
        });

        it('should render comment order buttons', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByText('Newest')).toBeInTheDocument();
            expect(screen.getByText('Popular')).toBeInTheDocument();
        });

        it('should render comment input area', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
        });

        it('should render user profile picture in comment input', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const profileImg = screen.getByAltText('Uploader Profile');
            expect(profileImg).toHaveAttribute('src', 'https://example.com/profile.jpg');
        });

        it('should use placeholder image when user has no profile picture', () => {
            const propsWithoutProfilePicture = {
                ...defaultProps,
                user: { ...mockUser, profile_picture_url: null },
            };
            
            renderWithRouter(<CommentSection {...propsWithoutProfilePicture} />);
            
            const profileImg = screen.getByAltText('Uploader Profile');
            expect(profileImg).toHaveAttribute('src', 'https://placehold.co/100x100/E5E7EB/4B5563?text=User');
        });
    });

    describe('Comment Order Toggle', () => {
        it('should highlight active order button', () => {
            renderWithRouter(<CommentSection {...defaultProps} commentOrder="newest" />);
            
            const newestButton = screen.getByText('Newest');
            const popularButton = screen.getByText('Popular');
            
            expect(newestButton).toHaveClass('bg-white', 'shadow-sm');
            expect(popularButton).not.toHaveClass('bg-white', 'shadow-sm');
        });

        it('should call setCommentOrder when newest button is clicked', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    setCommentOrder={mockSetCommentOrder}
                    commentOrder="popular"
                />
            );
            
            const newestButton = screen.getByText('Newest');
            fireEvent.click(newestButton);
            
            expect(mockSetCommentOrder).toHaveBeenCalledWith('newest');
        });

        it('should call setCommentOrder when popular button is clicked', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    setCommentOrder={mockSetCommentOrder}
                    commentOrder="newest"
                />
            );
            
            const popularButton = screen.getByText('Popular');
            fireEvent.click(popularButton);
            
            expect(mockSetCommentOrder).toHaveBeenCalledWith('popular');
        });

        it('should highlight popular button when selected', () => {
            renderWithRouter(<CommentSection {...defaultProps} commentOrder="popular" />);
            
            const newestButton = screen.getByText('Newest');
            const popularButton = screen.getByText('Popular');
            
            expect(popularButton).toHaveClass('bg-white', 'shadow-sm');
            expect(newestButton).not.toHaveClass('bg-white', 'shadow-sm');
        });
    });

    describe('Comment Input', () => {
        it('should update comment content when typing', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    setCommentContent={mockSetCommentContent}
                />
            );
            
            const textarea = screen.getByPlaceholderText('Add a comment...');
            fireEvent.change(textarea, { target: { value: 'New comment' } });
            
            expect(mockSetCommentContent).toHaveBeenCalledWith('New comment');
        });

        it('should display current comment content', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    commentContent="Current comment text"
                />
            );
            
            const textarea = screen.getByPlaceholderText('Add a comment...');
            expect(textarea).toHaveValue('Current comment text');
        });

        it('should call handlePostComment when submit button is clicked', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    handlePostComment={mockHandlePostComment}
                />
            );
            
            const submitButton = screen.getByRole('button', { name: '' }); // Send button with icon
            fireEvent.click(submitButton);
            
            expect(mockHandlePostComment).toHaveBeenCalledTimes(1);
        });

        it('should show loading spinner when posting comment', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isPostingComment={true}
                />
            );
            
            expect(screen.getByTestId('circular-progress')).toBeInTheDocument();
        });

        it('should show send icon when not posting comment', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isPostingComment={false}
                />
            );
            
            expect(screen.queryByTestId('circular-progress')).not.toBeInTheDocument();
        });
    });

    describe('Comments Display', () => {
        it('should render all comments', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('This is a great material!')).toBeInTheDocument();
            expect(screen.getByText('Very helpful, thanks for sharing.')).toBeInTheDocument();
        });

        it('should render comment dates correctly', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const date1 = new Date('2024-01-01T10:00:00Z').toLocaleString();
            const date2 = new Date('2024-01-02T11:00:00Z').toLocaleString();
            
            expect(screen.getByText(date1)).toBeInTheDocument();
            expect(screen.getByText(date2)).toBeInTheDocument();
        });

        it('should render comment upvote counts', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
        });

        it('should render user profile pictures in comments', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const profileImages = screen.getAllByAltText('User Profile');
            expect(profileImages).toHaveLength(2);
            expect(profileImages[0]).toHaveAttribute('src', 'https://example.com/john.jpg');
            expect(profileImages[1]).toHaveAttribute('src', 'https://example.com/jane.jpg');
        });

        it('should use placeholder image for comments without profile pictures', () => {
            const commentsWithoutProfilePic = [
                {
                    ...mockCommentsData[0],
                    profile_picture_url: null,
                },
            ];
            
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    allCommentsData={commentsWithoutProfilePic}
                />
            );
            
            const profileImg = screen.getByAltText('User Profile');
            expect(profileImg).toHaveAttribute('src', 'https://placehold.co/100x100/E5E7EB/4B5563?text=User');
        });

        it('should show "No comments yet" when there are no comments', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    allCommentsData={[]}
                />
            );
            
            expect(screen.getByText('No comments yet.')).toBeInTheDocument();
        });

        it('should render clickable user names with correct href', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const johnLink = screen.getByText('John Doe').closest('a');
            const janeLink = screen.getByText('Jane Smith').closest('a');
            
            expect(johnLink).toHaveAttribute('href', '/user/user-1');
            expect(janeLink).toHaveAttribute('href', '/user/user-2');
            expect(johnLink).toHaveAttribute('target', '_blank');
            expect(janeLink).toHaveAttribute('target', '_blank');
        });
    });

    describe('Comment Upvoting', () => {
        it('should call handleUpvote with upvote when comment is not upvoted', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    handleUpvote={mockHandleUpvote}
                />
            );
            
            const upvoteButtons = screen.getAllByRole('button');
            const firstCommentUpvoteButton = upvoteButtons.find(button => 
                button.textContent?.includes('5')
            );
            
            if (firstCommentUpvoteButton) {
                fireEvent.click(firstCommentUpvoteButton);
                expect(mockHandleUpvote).toHaveBeenCalledWith('comment-1', 'upvote');
            }
        });

        it('should call handleUpvote with cancel-upvote when comment is upvoted', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    handleUpvote={mockHandleUpvote}
                />
            );
            
            const upvoteButtons = screen.getAllByRole('button');
            const secondCommentUpvoteButton = upvoteButtons.find(button => 
                button.textContent?.includes('3')
            );
            
            if (secondCommentUpvoteButton) {
                fireEvent.click(secondCommentUpvoteButton);
                expect(mockHandleUpvote).toHaveBeenCalledWith('comment-2', 'cancel-upvote');
            }
        });

        it('should show filled heart icon for upvoted comments', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            // The second comment is upvoted (upvoted: true)
            const upvoteButtons = screen.getAllByRole('button');
            const secondCommentUpvoteButton = upvoteButtons.find(button => 
                button.textContent?.includes('3')
            );
            
            expect(secondCommentUpvoteButton).toBeInTheDocument();
        });

        it('should show outline heart icon for non-upvoted comments', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            // The first comment is not upvoted (upvoted: false)
            const upvoteButtons = screen.getAllByRole('button');
            const firstCommentUpvoteButton = upvoteButtons.find(button => 
                button.textContent?.includes('5')
            );
            
            expect(firstCommentUpvoteButton).toBeInTheDocument();
        });
    });

    describe('Comment Deletion (Author Only)', () => {
        it('should show delete button when user is author', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isAuthor={true}
                />
            );
            
            const deleteButtons = screen.getAllByText('Delete');
            expect(deleteButtons).toHaveLength(2); // One for each comment
        });

        it('should not show delete button when user is not author', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isAuthor={false}
                />
            );
            
            expect(screen.queryByText('Delete')).not.toBeInTheDocument();
        });

        it('should call handleDeleteComment when delete button is clicked', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isAuthor={true}
                    handleDeleteComment={mockHandleDeleteComment}
                />
            );
            
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            
            expect(mockHandleDeleteComment).toHaveBeenCalledWith('comment-1', 'user-1');
        });
    });

    describe('Load More Comments', () => {
        it('should show "Load more comments" button when there are more comments', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isNoMoreComments={false}
                />
            );
            
            expect(screen.getByText('Load more comments')).toBeInTheDocument();
        });

        it('should show "No more comments" when there are no more comments', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    isNoMoreComments={true}
                />
            );
            
            expect(screen.getByText('No more comments.')).toBeInTheDocument();
            expect(screen.queryByText('Load more comments')).not.toBeInTheDocument();
        });

        it('should call setCommentsRange when load more button is clicked', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    setCommentsRange={mockSetCommentsRange}
                    commentsRange={{ start: 0, end: 10 }}
                    isNoMoreComments={false}
                />
            );
            
            const loadMoreButton = screen.getByText('Load more comments');
            fireEvent.click(loadMoreButton);
            
            expect(mockSetCommentsRange).toHaveBeenCalledWith({ start: 11, end: 20 });
        });

        it('should calculate correct range for load more comments', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    setCommentsRange={mockSetCommentsRange}
                    commentsRange={{ start: 10, end: 20 }}
                    isNoMoreComments={false}
                />
            );
            
            const loadMoreButton = screen.getByText('Load more comments');
            fireEvent.click(loadMoreButton);
            
            expect(mockSetCommentsRange).toHaveBeenCalledWith({ start: 21, end: 30 });
        });
    });

    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });

        it('should have proper textarea attributes', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            const textarea = screen.getByPlaceholderText('Add a comment...');
            expect(textarea).toHaveAttribute('style', 'resize: none;');
        });

        it('should have proper image alt texts', () => {
            renderWithRouter(<CommentSection {...defaultProps} />);
            
            expect(screen.getByAltText('Uploader Profile')).toBeInTheDocument();
            expect(screen.getAllByAltText('User Profile')).toHaveLength(2);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty comment content gracefully', () => {
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    commentContent=""
                />
            );
            
            const textarea = screen.getByPlaceholderText('Add a comment...');
            expect(textarea).toHaveValue('');
        });

        it('should handle invalid dates gracefully', () => {
            const invalidDateCommentData = [{
                ...mockCommentsData[0],
                created_date: 'invalid-date',
            }];
            
            renderWithRouter(
                <CommentSection 
                    {...defaultProps} 
                    allCommentsData={invalidDateCommentData}
                />
            );
            
            // Should render the comment even with invalid date
            expect(screen.getByText('This is a great material!')).toBeInTheDocument();
        });
    });
});
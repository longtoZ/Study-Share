import { jest } from '@jest/globals';

// Mock the Comment model
jest.unstable_mockModule('../models/comment.model.js', () => ({
    default: {
        createComment: jest.fn(),
        getCommentsByMaterialId: jest.fn(),
        deleteComment: jest.fn(),
        voteComment: jest.fn(),
        checkUpvoteRecord: jest.fn()
    }
}));

// Import after mocking
const CommentController = (await import('../controllers/comment.controller.js')).default;
const Comment = (await import('../models/comment.model.js')).default;

describe('Comment Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('createComment', () => {
        it('should create comment successfully', async () => {
            // Arrange
            const commentData = {
                material_id: 'material123',
                user_id: 'user123',
                content: 'This is a test comment',
                upvote: 0
            };
            const createdComment = { comment_id: 'comment123', ...commentData };

            mockReq.body = commentData;
            Comment.createComment.mockResolvedValue(createdComment);

            // Act
            await CommentController.createComment(mockReq, mockRes);

            // Assert
            expect(Comment.createComment).toHaveBeenCalledWith(commentData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comment created successfully",
                comment: createdComment
            });
        });

        it('should handle comment creation errors', async () => {
            // Arrange
            const commentData = {
                material_id: 'material123',
                user_id: 'user123',
                content: 'This is a test comment'
            };
            const error = new Error('Database connection failed');

            mockReq.body = commentData;
            Comment.createComment.mockRejectedValue(error);

            // Act
            await CommentController.createComment(mockReq, mockRes);

            // Assert
            expect(Comment.createComment).toHaveBeenCalledWith(commentData);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database connection failed'
            });
        });
    });

    describe('getCommentsByMaterialId', () => {
        it('should retrieve comments successfully', async () => {
            // Arrange
            const materialId = 'material123';
            const mockComments = [
                { comment_id: 'comment1', content: 'First comment', upvotes: 5 },
                { comment_id: 'comment2', content: 'Second comment', upvotes: 3 }
            ];

            mockReq.params = { material_id: materialId };
            mockReq.query = { order: 'newest', start: 0, end: 10 };
            Comment.getCommentsByMaterialId.mockResolvedValue(mockComments);

            // Act
            await CommentController.getCommentsByMaterialId(mockReq, mockRes);

            // Assert
            expect(Comment.getCommentsByMaterialId).toHaveBeenCalledWith(
                materialId, 'newest', 0, 10
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comments retrieved successfully",
                comments: mockComments
            });
        });

        it('should handle errors when retrieving comments', async () => {
            // Arrange
            const materialId = 'material123';
            const error = new Error('Failed to fetch comments');

            mockReq.params = { material_id: materialId };
            mockReq.query = { order: 'newest', start: 0, end: 10 };
            Comment.getCommentsByMaterialId.mockRejectedValue(error);

            // Act
            await CommentController.getCommentsByMaterialId(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to fetch comments'
            });
        });
    });

    describe('deleteComment', () => {
        it('should delete comment successfully when user is authorized', async () => {
            // Arrange
            const commentId = 'comment123';
            const userId = 'user123';

            mockReq.params = { comment_id: commentId };
            mockReq.body = { authorId: userId };
            mockReq.user = { id: userId };
            Comment.deleteComment.mockResolvedValue();

            // Act
            await CommentController.deleteComment(mockReq, mockRes);

            // Assert
            expect(Comment.deleteComment).toHaveBeenCalledWith(commentId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comment deleted successfully"
            });
        });

        it('should return 403 when user is not authorized to delete comment', async () => {
            // Arrange
            const commentId = 'comment123';
            const userId = 'user123';
            const authorId = 'user456';

            mockReq.params = { comment_id: commentId };
            mockReq.body = { authorId: authorId };
            mockReq.user = { id: userId };

            // Act
            await CommentController.deleteComment(mockReq, mockRes);

            // Assert
            expect(Comment.deleteComment).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: "You are not authorized to delete this comment"
            });
        });

        it('should handle deletion errors', async () => {
            // Arrange
            const commentId = 'comment123';
            const userId = 'user123';
            const error = new Error('Failed to delete comment');

            mockReq.params = { comment_id: commentId };
            mockReq.body = { authorId: userId };
            mockReq.user = { id: userId };
            Comment.deleteComment.mockRejectedValue(error);

            // Act
            await CommentController.deleteComment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to delete comment'
            });
        });
    });

    describe('voteComment', () => {
        it('should vote comment successfully', async () => {
            // Arrange
            const commentId = 'comment123';
            const userId = 'user123';
            const vote = 'upvote';
            const voteResult = { success: true };

            mockReq.params = { comment_id: commentId };
            mockReq.body = { user_id: userId, vote: vote };
            Comment.voteComment.mockResolvedValue(voteResult);

            // Act
            await CommentController.voteComment(mockReq, mockRes);

            // Assert
            expect(Comment.voteComment).toHaveBeenCalledWith(userId, commentId, vote);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Comment voted successfully",
                result: voteResult
            });
        });

        it('should handle voting errors', async () => {
            // Arrange
            const commentId = 'comment123';
            const userId = 'user123';
            const vote = 'upvote';
            const error = new Error('Comment not found');

            mockReq.params = { comment_id: commentId };
            mockReq.body = { user_id: userId, vote: vote };
            Comment.voteComment.mockRejectedValue(error);

            // Act
            await CommentController.voteComment(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Comment not found'
            });
        });
    });

    describe('checkUpvoteRecord', () => {
        it('should check upvote record successfully', async () => {
            // Arrange
            const userId = 'user123';
            const commentId = 'comment123';
            const upvoteRecord = { user_id: userId, comment_id: commentId, vote_date: new Date() };

            mockReq.params = { user_id: userId, comment_id: commentId };
            Comment.checkUpvoteRecord.mockResolvedValue(upvoteRecord);

            // Act
            await CommentController.checkUpvoteRecord(mockReq, mockRes);

            // Assert
            expect(Comment.checkUpvoteRecord).toHaveBeenCalledWith(userId, commentId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Upvote record checked successfully",
                isUpvoted: upvoteRecord
            });
        });

        it('should handle upvote record check errors', async () => {
            // Arrange
            const userId = 'user123';
            const commentId = 'comment123';
            const error = new Error('Database error');

            mockReq.params = { user_id: userId, comment_id: commentId };
            Comment.checkUpvoteRecord.mockRejectedValue(error);

            // Act
            await CommentController.checkUpvoteRecord(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database error'
            });
        });
    });
});

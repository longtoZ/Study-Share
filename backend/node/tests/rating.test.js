import { jest } from '@jest/globals';

// Mock the Rating model
jest.unstable_mockModule('../models/rating.model.js', () => ({
    default: {
        rateMaterial: jest.fn(),
        createRatingLog: jest.fn(),
        getMaterialRating: jest.fn(),
        checkUserRating: jest.fn()
    }
}));

// Mock the RatingService
jest.unstable_mockModule('../services/rating.service.js', () => ({
    default: {
        createRating: jest.fn(),
        checkUserRating: jest.fn()
    }
}));

// Import after mocking
const RatingController = (await import('../controllers/rating.controller.js')).default;
const Rating = (await import('../models/rating.model.js')).default;
const RatingService = (await import('../services/rating.service.js')).default;

describe('Rating Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            query: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('createRating', () => {
        it('should create rating successfully', async () => {
            // Arrange
            const ratingData = {
                user_id: 'user123',
                material_id: 'material123',
                star_level: 4,
                rated_date: new Date().toISOString()
            };

            const mockCreatedRating = {
                material_id: 'material123',
                star_level: 4,
                count: 1
            };

            mockReq.body = { ratingData };
            RatingService.createRating.mockResolvedValue(mockCreatedRating);

            // Act
            await RatingController.createRating(mockReq, mockRes);

            // Assert
            expect(RatingService.createRating).toHaveBeenCalledWith(ratingData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Rating created successfully',
                rating: mockCreatedRating
            });
        });

        it('should handle rating creation error', async () => {
            // Arrange
            const ratingData = {
                user_id: 'user123',
                material_id: 'material123',
                star_level: 4
            };

            mockReq.body = { ratingData };
            const error = new Error('Database error');
            RatingService.createRating.mockRejectedValue(error);

            // Act
            await RatingController.createRating(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database error'
            });
        });
    });

    describe('getMaterialRating', () => {
        it('should get material rating successfully', async () => {
            // Arrange
            const materialId = 'material123';
            const mockRating = [
                { material_id: 'material123', star_level: 5, count: 10 },
                { material_id: 'material123', star_level: 4, count: 8 },
                { material_id: 'material123', star_level: 3, count: 5 }
            ];

            mockReq.params = { material_id: materialId };
            Rating.getMaterialRating.mockResolvedValue(mockRating);

            // Act
            await RatingController.getMaterialRating(mockReq, mockRes);

            // Assert
            expect(Rating.getMaterialRating).toHaveBeenCalledWith(materialId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Material rating retrieved successfully',
                rating: mockRating
            });
        });

        it('should handle error when getting material rating', async () => {
            // Arrange
            const materialId = 'material123';
            const error = new Error('Database connection failed');

            mockReq.params = { material_id: materialId };
            Rating.getMaterialRating.mockRejectedValue(error);

            // Act
            await RatingController.getMaterialRating(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database connection failed'
            });
        });
    });

    describe('checkUserRating', () => {
        it('should check user rating successfully when user has rated', async () => {
            // Arrange
            const materialId = 'material123';
            const userId = 'user123';

            mockReq.params = { material_id: materialId };
            mockReq.query = { 'user-id': userId };
            RatingService.checkUserRating.mockResolvedValue(true);

            // Act
            await RatingController.checkUserRating(mockReq, mockRes);

            // Assert
            expect(RatingService.checkUserRating).toHaveBeenCalledWith(materialId, userId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User rating check completed',
                hasRated: true
            });
        });

        it('should check user rating successfully when user has not rated', async () => {
            // Arrange
            const materialId = 'material123';
            const userId = 'user123';

            mockReq.params = { material_id: materialId };
            mockReq.query = { 'user-id': userId };
            RatingService.checkUserRating.mockResolvedValue(false);

            // Act
            await RatingController.checkUserRating(mockReq, mockRes);

            // Assert
            expect(RatingService.checkUserRating).toHaveBeenCalledWith(materialId, userId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User rating check completed',
                hasRated: false
            });
        });

        it('should handle error when checking user rating', async () => {
            // Arrange
            const materialId = 'material123';
            const userId = 'user123';
            const error = new Error('Service error');

            mockReq.params = { material_id: materialId };
            mockReq.query = { 'user-id': userId };
            RatingService.checkUserRating.mockRejectedValue(error);

            // Act
            await RatingController.checkUserRating(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Service error'
            });
        });
    });
});
import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/statistics.model.js', () => ({
    default: {
        getTotalMaterials: jest.fn(),
        getTotalLessons: jest.fn(),
        getTotalUsers: jest.fn(),
        getTotalDownloads: jest.fn(),
        getMostViewedMaterials: jest.fn(),
        getMostDownloadedMaterials: jest.fn(),
        getTopContributors: jest.fn()
    }
}));

jest.unstable_mockModule('../services/statistics.service.js', () => ({
    default: {
        getGeneralStats: jest.fn(),
        getTopMaterials: jest.fn(),
        getTopContributors: jest.fn()
    }
}));

// Import after mocking
const StatisticsController = (await import('../controllers/statistics.controller.js')).default;
const Statistics = (await import('../models/statistics.model.js')).default;
const StatisticsService = (await import('../services/statistics.service.js')).default;

describe('Statistics Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            params: {},
            query: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('getGeneralStats', () => {
        it('should get general statistics successfully', async () => {
            // Arrange
            const mockStats = {
                totalMaterials: 1250,
                totalLessons: 180,
                totalUsers: 950,
                totalDownloads: 25000
            };

            StatisticsService.getGeneralStats.mockResolvedValue(mockStats);

            // Act
            await StatisticsController.getGeneralStats(mockReq, mockRes);

            // Assert
            expect(StatisticsService.getGeneralStats).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockStats);
        });

        it('should handle error when getting general statistics', async () => {
            // Arrange
            const error = new Error('Failed to fetch general statistics');
            StatisticsService.getGeneralStats.mockRejectedValue(error);

            // Act
            await StatisticsController.getGeneralStats(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to fetch general statistics'
            });
        });
    });

    describe('getTopMaterials', () => {
        it('should get top materials successfully', async () => {
            // Arrange
            const from = '2024-01-01';
            const to = '2024-01-31';
            const mockTopMaterials = {
                mostViewed: [
                    {
                        material_id: 'mat1',
                        name: 'Advanced Mathematics',
                        view_count: 500,
                        download_count: 100
                    },
                    {
                        material_id: 'mat2',
                        name: 'Physics Fundamentals',
                        view_count: 450,
                        download_count: 90
                    }
                ],
                mostDownloaded: [
                    {
                        material_id: 'mat3',
                        name: 'Chemistry Guide',
                        view_count: 300,
                        download_count: 200
                    },
                    {
                        material_id: 'mat4',
                        name: 'Biology Essentials',
                        view_count: 250,
                        download_count: 150
                    }
                ]
            };

            mockReq.query = { from, to };
            StatisticsService.getTopMaterials.mockResolvedValue(mockTopMaterials);

            // Act
            await StatisticsController.getTopMaterials(mockReq, mockRes);

            // Assert
            expect(StatisticsService.getTopMaterials).toHaveBeenCalledWith(from, to);
            expect(mockRes.json).toHaveBeenCalledWith(mockTopMaterials);
        });

        it('should handle error when getting top materials', async () => {
            // Arrange
            const from = '2024-01-01';
            const to = '2024-01-31';
            const error = new Error('Failed to fetch top materials');

            mockReq.query = { from, to };
            StatisticsService.getTopMaterials.mockRejectedValue(error);

            // Act
            await StatisticsController.getTopMaterials(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to fetch top materials'
            });
        });
    });

    describe('getTopContributors', () => {
        it('should get top contributors successfully', async () => {
            // Arrange
            const mockTopContributors = [
                {
                    user_id: 'user1',
                    full_name: 'John Doe',
                    contribution_count: 25,
                    total_downloads: 500
                },
                {
                    user_id: 'user2',
                    full_name: 'Jane Smith',
                    contribution_count: 20,
                    total_downloads: 400
                },
                {
                    user_id: 'user3',
                    full_name: 'Bob Johnson',
                    contribution_count: 18,
                    total_downloads: 350
                }
            ];

            StatisticsService.getTopContributors.mockResolvedValue(mockTopContributors);

            // Act
            await StatisticsController.getTopContributors(mockReq, mockRes);

            // Assert
            expect(StatisticsService.getTopContributors).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith(mockTopContributors);
        });

        it('should handle error when getting top contributors', async () => {
            // Arrange
            const error = new Error('Failed to fetch top contributors');
            StatisticsService.getTopContributors.mockRejectedValue(error);

            // Act
            await StatisticsController.getTopContributors(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Failed to fetch top contributors'
            });
        });
    });
});
import { jest } from '@jest/globals';

// Mock the History model
jest.unstable_mockModule('../models/history.model.js', () => ({
    default: {
        deleteHistory: jest.fn(),
        bulkDeleteHistory: jest.fn(),
        listEntries: jest.fn()
    }
}));

// Mock the History service
jest.unstable_mockModule('../services/history.service.js', () => ({
    default: {
        addEntry: jest.fn()
    }
}));

// Import after mocking
const HistoryController = (await import('../controllers/history.controller.js')).default;
const HistoryService = (await import('../services/history.service.js')).default;
const History = (await import('../models/history.model.js')).default;

describe('History Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {}
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('addEntry', () => {
        it('should add history entry successfully', async () => {
            // Arrange
            const historyData = {
                user_id: 'user123',
                material_id: 'material456',
                lesson_id: 'lesson789',
                viewed_date: new Date().toISOString()
            };

            mockReq.body = historyData;
            HistoryService.addEntry.mockResolvedValue();

            // Act
            await HistoryController.addEntry(mockReq, mockRes);

            // Assert
            expect(HistoryService.addEntry).toHaveBeenCalledWith(historyData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "History entry added/updated successfully"
            });
        });

        it('should handle errors when adding history entry', async () => {
            // Arrange
            const historyData = {
                user_id: 'user123',
                material_id: 'material456',
                lesson_id: 'lesson789',
                viewed_date: new Date().toISOString()
            };
            const error = new Error('Database connection failed');

            mockReq.body = historyData;
            HistoryService.addEntry.mockRejectedValue(error);

            // Act
            await HistoryController.addEntry(mockReq, mockRes);

            // Assert
            expect(HistoryService.addEntry).toHaveBeenCalledWith(historyData);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database connection failed'
            });
        });
    });

    describe('deleteEntry', () => {
        it('should delete history entry successfully', async () => {
            // Arrange
            const deleteData = {
                user_id: 'user123',
                material_id: 'material456',
                lesson_id: 'lesson789'
            };

            mockReq.body = deleteData;
            History.deleteHistory.mockResolvedValue();

            // Act
            await HistoryController.deleteEntry(mockReq, mockRes);

            // Assert
            expect(History.deleteHistory).toHaveBeenCalledWith(
                'user123', 'material456', 'lesson789'
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "History entry deleted successfully"
            });
        });

        it('should handle errors when deleting history entry', async () => {
            // Arrange
            const deleteData = {
                user_id: 'user123',
                material_id: 'material456',
                lesson_id: 'lesson789'
            };
            const error = new Error('Entry not found');

            mockReq.body = deleteData;
            History.deleteHistory.mockRejectedValue(error);

            // Act
            await HistoryController.deleteEntry(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Entry not found'
            });
        });
    });

    describe('bulkDeleteEntries', () => {
        it('should bulk delete history entries successfully', async () => {
            // Arrange
            const historyIds = ['history1', 'history2', 'history3'];
            mockReq.body = { history_ids: historyIds };
            History.bulkDeleteHistory.mockResolvedValue();

            // Act
            await HistoryController.bulkDeleteEntries(mockReq, mockRes);

            // Assert
            expect(History.bulkDeleteHistory).toHaveBeenCalledWith(historyIds);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "History entries deleted successfully"
            });
        });

        it('should handle errors when bulk deleting history entries', async () => {
            // Arrange
            const historyIds = ['history1', 'history2', 'history3'];
            const error = new Error('Bulk delete failed');

            mockReq.body = { history_ids: historyIds };
            History.bulkDeleteHistory.mockRejectedValue(error);

            // Act
            await HistoryController.bulkDeleteEntries(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Bulk delete failed'
            });
        });
    });

    describe('listEntries', () => {
        it('should list history entries successfully', async () => {
            // Arrange
            const requestData = {
                user_id: 'user123',
                filter: {
                    from: '2025-01-01',
                    to: '2025-12-31',
                    type: 'material'
                },
                pageRange: {
                    from: 0,
                    to: 10
                }
            };
            const mockEntries = [
                {
                    history_id: 'history1',
                    user_id: 'user123',
                    material_id: 'material456',
                    viewed_date: '2025-09-20T10:00:00Z'
                },
                {
                    history_id: 'history2',
                    user_id: 'user123',
                    lesson_id: 'lesson789',
                    viewed_date: '2025-09-19T15:30:00Z'
                }
            ];

            mockReq.body = requestData;
            History.listEntries.mockResolvedValue(mockEntries);

            // Act
            await HistoryController.listEntries(mockReq, mockRes);

            // Assert
            expect(History.listEntries).toHaveBeenCalledWith(
                'user123',
                requestData.filter,
                requestData.pageRange
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "History entries retrieved successfully",
                entries: mockEntries
            });
        });

        it('should handle errors when listing history entries', async () => {
            // Arrange
            const requestData = {
                user_id: 'user123',
                filter: { type: 'all' },
                pageRange: { from: 0, to: 10 }
            };
            const error = new Error('Database query failed');

            mockReq.body = requestData;
            History.listEntries.mockRejectedValue(error);

            // Act
            await HistoryController.listEntries(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Database query failed'
            });
        });

        it('should handle listing with minimal filter parameters', async () => {
            // Arrange
            const requestData = {
                user_id: 'user123',
                filter: {},
                pageRange: { from: 0, to: 5 }
            };
            const mockEntries = [];

            mockReq.body = requestData;
            History.listEntries.mockResolvedValue(mockEntries);

            // Act
            await HistoryController.listEntries(mockReq, mockRes);

            // Assert
            expect(History.listEntries).toHaveBeenCalledWith(
                'user123',
                {},
                { from: 0, to: 5 }
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "History entries retrieved successfully",
                entries: mockEntries
            });
        });
    });
});

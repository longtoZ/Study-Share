import { jest } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../models/task.model.js', () => ({
    default: {
        getRecentTasks: jest.fn(),
    }
}));

// Import after mocking
const TaskController = (await import('../controllers/task.controller.js')).default;
const Task = (await import('../models/task.model.js')).default;

describe('Task Controller Tests', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Setup mock request and response objects
        mockReq = {
            body: {},
            params: {},
            user: { user_id: 'user123' }
        };
        
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('getRecentTasks', () => {
        it('should get recent tasks successfully', async () => {
            // Arrange
            const mockTasks = [
                {
                    task_id: 'task1',
                    user_id: 'user123',
                    title: 'Task 1',
                    description: 'Description 1',
                    status: 'pending',
                    created_date: '2024-01-01T00:00:00Z'
                },
                {
                    task_id: 'task2',
                    user_id: 'user123',
                    title: 'Task 2',
                    description: 'Description 2',
                    status: 'completed',
                    created_date: '2024-01-02T00:00:00Z'
                }
            ];

            mockReq.user = { user_id: 'user123' };
            mockReq.query = { limit: '10' };
            Task.getRecentTasks.mockResolvedValue(mockTasks);

            // Act
            await TaskController.getRecentTasks(mockReq, mockRes);

            // Assert
            expect(Task.getRecentTasks).toHaveBeenCalledWith('user123', 10);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                tasks: mockTasks
            });
        });

        it('should handle error when getting recent tasks', async () => {
            // Arrange
            const error = new Error('Error fetching recent tasks: Database connection failed');
            mockReq.user = { user_id: 'user123' };
            mockReq.query = { limit: '10' };
            Task.getRecentTasks.mockRejectedValue(error);

            // Act
            await TaskController.getRecentTasks(mockReq, mockRes);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                error: 'Error fetching recent tasks: Database connection failed'
            });
        });

        it('should use default limit when not provided', async () => {
            // Arrange
            const mockTasks = [];
            mockReq.user = { user_id: 'user123' };
            mockReq.query = {}; // No limit provided
            Task.getRecentTasks.mockResolvedValue(mockTasks);

            // Act
            await TaskController.getRecentTasks(mockReq, mockRes);

            // Assert
            expect(Task.getRecentTasks).toHaveBeenCalledWith('user123', 5);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                tasks: mockTasks
            });
        });
    });
});